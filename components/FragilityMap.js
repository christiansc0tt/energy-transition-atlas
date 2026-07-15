'use client';

// components/FragilityMap.js
// ---------------------------------------------------------------------------
// D3 does maths (projection, collision, zoom). React does DOM. D3 never
// touches an element React owns.
//
// LAYOUT RULE, learned the hard way: every control is position:absolute over
// an aspect-locked frame. Controls that live in the document flow can reflow
// the document — that is why the map used to resize when you toggled a stage
// chip. Out of flow, the whole class of bug is impossible rather than patched.
//
// There is no floating tooltip. Hover writes to the panel. One fixed place for
// readouts, so nothing ever covers a node.
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { forSector, scoredById, nodeById, downstreamOf, upstreamOf, SECTORS } from '../data/graph';

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const W = 1000;
const H = 560;

// Pyrometer ramp, fragility 0-10. Cold rolled steel -> incandescent.
// Perceptually ordered and legible to red-green colourblind readers, which is
// what rules out the default red/amber/green risk ramp.
export const HEAT = [
  '#3E4C57', '#43505A', '#4B555A', '#5C5B53', '#75654A',
  '#8E7143', '#A87E3B', '#C48432', '#DE7526', '#F4681B', '#FFA94D',
];

const LAYERS = ['mining', 'refining', 'component', 'assembly', 'deployment'];
const SECTOR_LABEL = { ev: 'EV & Battery', solar: 'Solar PV', wind: 'Wind' };

export default function FragilityMap({ sector, onSectorChange, onSelect }) {
  const [world, setWorld] = useState(null);
  const [layerFilter, setLayerFilter] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [transform, setTransform] = useState(d3.zoomIdentity);
  const svgRef = useRef(null);

  useEffect(() => {
    let alive = true;
    d3.json(WORLD_URL)
      .then((topo) => alive && setWorld(feature(topo, topo.objects.countries)))
      .catch(() => alive && setWorld('error'));
    return () => { alive = false; };
  }, []);

  useEffect(() => { setSelected(null); setHovered(null); }, [sector]);
  useEffect(() => { onSelect?.(selected); }, [selected, onSelect]);

  const graph = useMemo(() => forSector(sector), [sector]);

  const projection = useMemo(
    () => d3.geoNaturalEarth1().fitExtent([[10, 26], [W - 10, H - 30]], { type: 'Sphere' }),
    []
  );
  const path = useMemo(() => d3.geoPath(projection), [projection]);

  // China carries six-plus nodes at nearly identical coordinates. Without
  // dodging they stack into one blob. Seed at the true position, let collision
  // push them apart, spring them back toward the truth.
  const placed = useMemo(() => {
    const pts = graph.nodes.map((n) => {
      const [x, y] = projection([n.lon, n.lat]) || [W / 2, H / 2];
      const frag = scoredById[n.stageId]?.fragility ?? 0;
      return { ...n, x, y, x0: x, y0: y, r: 4 + frag * 0.55, frag };
    });
    d3.forceSimulation(pts)
      .force('collide', d3.forceCollide((d) => d.r + 2.5).strength(0.85))
      .force('x', d3.forceX((d) => d.x0).strength(0.28))
      .force('y', d3.forceY((d) => d.y0).strength(0.28))
      .stop()
      .tick(140);
    return pts;
  }, [graph, projection]);

  const posById = useMemo(() => Object.fromEntries(placed.map((p) => [p.id, p])), [placed]);

  // d3 computes the zoom transform; React applies it. No DOM mutation.
  useEffect(() => {
    if (!svgRef.current) return;
    const sel = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([1, 8])
      .filter((e) => e.type !== 'dblclick')
      .on('zoom', (e) => setTransform(e.transform));
    sel.call(zoom);
    return () => sel.on('.zoom', null);
  }, [world]);

  const focus = selected || hovered;
  const lit = useMemo(() => {
    if (!focus) return null;
    const down = downstreamOf(focus);
    const up = upstreamOf(focus);
    return { down, up, all: new Set([focus, ...down, ...up]) };
  }, [focus]);

  const shown = placed.filter((n) => !layerFilter || scoredById[n.stageId]?.layer === layerFilter);
  const shownIds = new Set(shown.map((n) => n.id));

  const dim = (id) => {
    if (!lit) return 1;
    if (id === focus || lit.down.has(id)) return 1;
    if (lit.up.has(id)) return 0.5;
    return 0.1;
  };

  const readout = focus ? { node: nodeById[focus], stage: scoredById[nodeById[focus]?.stageId] } : null;
  const pinned = Boolean(selected);

  return (
    <div className="fm">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="fm-frame">
        {!world && <p className="fm-status">Loading basemap…</p>}
        {world === 'error' && (
          <p className="fm-status fm-err">
            Basemap didn’t load. Check the connection to cdn.jsdelivr.net, then reload.
          </p>
        )}

        {world && world !== 'error' && (
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="fm-svg" role="img"
               aria-label={`Supply chain fragility map, ${SECTOR_LABEL[sector]}`}>
            <defs>
              <filter id="fm-glow" x="-120%" y="-120%" width="340%" height="340%">
                <feGaussianBlur stdDeviation="5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <radialGradient id="fm-sphere">
                <stop offset="70%" stopColor="#141C24" />
                <stop offset="100%" stopColor="#0D141A" />
              </radialGradient>
            </defs>

            <g transform={transform.toString()}>
              <path d={path({ type: 'Sphere' })} fill="url(#fm-sphere)" stroke="#22303B" />
              <path d={path(d3.geoGraticule10())} fill="none" stroke="#1B2830" strokeWidth={0.4} />
              {world.features.map((f, i) => (
                <path key={i} d={path(f)} fill="#1B242C" stroke="#2A3742" strokeWidth={0.35} />
              ))}

              {/* Flows. Beziers between DODGED positions — great circles connect
                  true coordinates, and after collision the nodes aren't there. */}
              <g fill="none">
                {graph.edges.map((e, i) => {
                  const a = posById[e.from], b = posById[e.to];
                  if (!a || !b || !shownIds.has(e.from) || !shownIds.has(e.to)) return null;
                  const on = lit && lit.all.has(e.from) && lit.all.has(e.to);
                  const dx = b.x - a.x, dy = b.y - a.y;
                  return (
                    <path
                      key={i}
                      d={`M${a.x},${a.y} Q${(a.x + b.x) / 2 - dy * 0.16},${(a.y + b.y) / 2 + dx * 0.16} ${b.x},${b.y}`}
                      stroke={on ? HEAT[Math.max(a.frag, b.frag)] : '#4C6070'}
                      strokeWidth={on ? 1.5 : 0.7}
                      strokeOpacity={lit ? (on ? 0.75 : 0.04) : 0.18}
                    />
                  );
                })}
              </g>

              {/* Radius and heat both encode fragility — redundant on purpose,
                  so the ramp survives greyscale and colourblind readers. */}
              <g>
                {shown.map((n) => {
                  const hot = n.frag >= 7;
                  const o = dim(n.id);
                  return (
                    <g key={n.id} opacity={o} className={hot && o > 0.5 ? 'fm-hot' : undefined}>
                      <circle
                        cx={n.x} cy={n.y} r={n.r} fill={HEAT[n.frag]}
                        stroke={n.id === selected ? '#FFFFFF' : n.alignment === 'exposed' ? '#0B1116' : '#8FA3B0'}
                        strokeWidth={n.id === selected ? 1.6 : n.alignment === 'exposed' ? 1 : 0.8}
                        filter={hot ? 'url(#fm-glow)' : undefined}
                      />
                      <circle
                        cx={n.x} cy={n.y} r={Math.max(n.r + 7, 11)}
                        fill="transparent" style={{ cursor: 'pointer' }}
                        tabIndex={0} role="button"
                        aria-label={`${scoredById[n.stageId]?.label}, ${n.country}, fragility ${n.frag}`}
                        onMouseEnter={() => setHovered(n.id)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(n.id)}
                        onBlur={() => setHovered(null)}
                        onClick={() => setSelected(selected === n.id ? null : n.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(selected === n.id ? null : n.id); }
                          if (e.key === 'Escape') setSelected(null);
                        }}
                      />
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>
        )}

        {/* --- OVERLAY CONTROLS. Absolutely positioned, out of flow, cannot
                resize anything. This is the fix, not a workaround. --- */}
        <nav className="fm-o fm-sectors" aria-label="Sector">
          {SECTORS.map((s) => (
            <button key={s} className={`fm-sec ${s === sector ? 'on' : ''}`}
                    onClick={() => onSectorChange(s)} aria-pressed={s === sector}>
              {SECTOR_LABEL[s]}
            </button>
          ))}
        </nav>

        <div className="fm-o fm-layers" role="group" aria-label="Filter by stage">
          {LAYERS.map((l) => (
            <button key={l} className={`fm-chip ${layerFilter === l ? 'on' : ''}`}
                    onClick={() => setLayerFilter(layerFilter === l ? null : l)}
                    aria-pressed={layerFilter === l}>
              {l}
            </button>
          ))}
        </div>

        <div className="fm-o fm-legend">
          <div className="fm-ramp" aria-hidden="true">
            {HEAT.map((c, i) => <span key={i} style={{ background: c }} />)}
          </div>
          <span className="fm-scale"><em>0</em> resilient · fragility · white-hot <em>10</em></span>
        </div>

        <div className="fm-o fm-count">
          {/* Zero-padded and fixed-width on purpose. A changing label must
              never be able to move anything. */}
          {String(shown.length).padStart(2, '0')} nodes{layerFilter ? ` · ${layerFilter}` : ''}
        </div>

        <aside className="fm-o fm-panel" aria-live="polite">
          {!readout && (
            <div className="fm-empty">
              <p className="fm-eyebrow">Read the heat</p>
              <p>
                Every node above 7 is a furnace — arc furnace, Siemens reactor, crystal puller,
                sintering press. The chokepoints are where the heat is.
              </p>
              <p>Hover to read a node. Click to pin it and light what it governs.</p>
            </div>
          )}

          {readout && (
            <div className="fm-card">
              <p className="fm-eyebrow">
                {readout.stage.layer} · {readout.node.country}
                {pinned && <span className="fm-pin">pinned</span>}
              </p>
              <h3>{readout.stage.label}</h3>

              <div className="fm-frag" style={{ '--c': HEAT[readout.stage.fragility] }}>
                <span className="fm-fragnum">{readout.stage.fragility}</span>
                <span className="fm-fraglabel">
                  fragility<br /><em>{readout.stage.riskType.replace('-', ' ')}</em>
                </span>
              </div>

              <dl className="fm-dl">
                <div><dt>Concentration (C)</dt><dd>{readout.stage.C}<span> / 4</span></dd></div>
                <div><dt>Substitutability (S)</dt><dd>{readout.stage.S}<span> / 3</span></dd></div>
                <div><dt>Lead time (L)</dt><dd>{readout.stage.L}<span> / 3</span></dd></div>
                <div><dt>Cost share</dt><dd>{readout.stage.costShare}</dd></div>
                <div><dt>Country share</dt><dd>{Math.round(readout.node.share * 100)}<span>%</span></dd></div>
                <div><dt>Alignment</dt><dd>{readout.node.alignment}</dd></div>
              </dl>

              {readout.stage.firmConcentration && (
                <p className="fm-flag fm-lower">
                  <strong>Fragility is a lower bound here.</strong> The binding concentration is
                  firm-level, not country-level, and the score only measures countries.
                </p>
              )}

              {readout.stage.sectors.length > 1 && (
                <p className="fm-flag fm-shared">
                  Shared node — also serves {readout.stage.sectors.filter((s) => s !== sector).join(', ')}.
                </p>
              )}

              <p className={`fm-conf fm-conf-${readout.stage.confidence}`}>
                Scorecard: <strong>{readout.stage.confidence}</strong>
                {readout.stage.confidence === 'modelled' && ' — our judgement, not a published figure'}
                <br />Country share: <strong>{readout.node.confidence}</strong> · {readout.node.source}
              </p>

              {pinned ? (
                <>
                  <p className="fm-notes">{readout.stage.notes}</p>
                  <p className="fm-blast">Governs <strong>{downstreamOf(selected).size}</strong> downstream nodes.</p>
                  <button className="fm-close" onClick={() => setSelected(null)}>Clear</button>
                </>
              ) : (
                <p className="fm-hint">Click to pin, read the full note, and light the chain.</p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const styles = `
.fm { --bg:#0E151B; --panel:#101920; --line:#24323C; --ink:#C6D3DC; --dim:#708392; --hot:#FFA94D;
  font-family: var(--font-inter), system-ui, sans-serif; }

/* Aspect-locked. The map can never change size, whatever the controls say. */
.fm-frame { position: relative; aspect-ratio: 1000 / 560; background: var(--bg);
  border: 1px solid var(--line); border-radius: 2px; overflow: hidden; }
.fm-svg { position: absolute; inset: 0; width: 100%; height: 100%; touch-action: none; }
.fm-status { position:absolute; inset:0; display:grid; place-content:center; color: var(--dim); font-size: 13px; }
.fm-err { color: #E0864C; }

.fm-o { position: absolute; z-index: 2; }
.fm-sectors { top: .55rem; left: .55rem; display: flex; gap: .15rem;
  background: rgba(10,16,21,.82); backdrop-filter: blur(6px);
  border: 1px solid var(--line); border-radius: 2px; padding: 2px; }
.fm-layers { bottom: .55rem; left: .55rem; display: flex; gap: 2px;
  background: rgba(10,16,21,.82); backdrop-filter: blur(6px);
  border: 1px solid var(--line); border-radius: 2px; padding: 2px; }
.fm-sec, .fm-chip { background: none; border: none; color: var(--dim);
  font: 600 10px/1 var(--font-archivo), sans-serif; letter-spacing: .13em;
  text-transform: uppercase; padding: .5rem .65rem; cursor: pointer; border-radius: 2px; }
.fm-sec:hover, .fm-chip:hover { color: var(--ink); background: #16212A; }
.fm-sec.on { color: #0B1116; background: var(--hot); }
.fm-chip { font-size: 9px; letter-spacing: .1em; padding: .45rem .5rem; }
.fm-chip.on { color: #0B1116; background: var(--dim); }
.fm-sec:focus-visible, .fm-chip:focus-visible, .fm-close:focus-visible { outline: 2px solid var(--hot); outline-offset: 1px; }
.fm-svg circle:focus-visible { outline: 2px solid var(--hot); }

.fm-legend { bottom: .55rem; left: 50%; transform: translateX(-50%);
  display: flex; align-items: center; gap: .6rem;
  background: rgba(10,16,21,.82); backdrop-filter: blur(6px);
  border: 1px solid var(--line); border-radius: 2px; padding: .4rem .6rem;
  font: 500 9px/1 var(--font-archivo), sans-serif; letter-spacing: .1em;
  text-transform: uppercase; color: var(--dim); white-space: nowrap; }
.fm-ramp { display: flex; }
.fm-ramp span { width: 13px; height: 8px; }
.fm-scale em { font-style: normal; font-family: var(--font-mono), monospace; color: var(--ink); }

.fm-count { top: .55rem; left: 50%; transform: translateX(-50%);
  font: 400 10px/1 var(--font-mono), monospace; color: var(--dim);
  background: rgba(10,16,21,.82); border: 1px solid var(--line); border-radius: 2px;
  padding: .45rem .6rem; white-space: nowrap; }

.fm-panel { top: .55rem; right: .55rem; bottom: .55rem; width: 268px;
  background: rgba(16,25,32,.94); backdrop-filter: blur(8px);
  border: 1px solid var(--line); border-radius: 2px;
  padding: .8rem; overflow-y: auto; color: var(--ink); }

/* Only 7+ breathes, and only where the reader is already looking. Ambient
   pulsing everywhere would be decoration; pulsing at the argument is signal. */
.fm-hot { animation: fm-breathe 3.4s ease-in-out infinite; }
@keyframes fm-breathe { 0%,100% { opacity:1 } 50% { opacity:.74 } }
@media (prefers-reduced-motion: reduce) { .fm-hot { animation: none } }

.fm-eyebrow { font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .16em;
  text-transform: uppercase; color: var(--dim); margin: 0 0 .5rem;
  display: flex; gap: .4rem; align-items: center; }
.fm-pin { color: var(--hot); border: 1px solid #3A2A14; padding: 2px 4px; border-radius: 2px; }
.fm-empty p { font-size: 12px; line-height: 1.6; color: var(--dim); margin: 0 0 .7rem; }
.fm-card h3 { font-size: 15px; line-height: 1.25; margin: 0 0 .7rem; font-weight: 600; }

.fm-frag { display: flex; align-items: center; gap: .55rem; margin-bottom: .8rem; }
.fm-fragnum { font: 300 38px/1 var(--font-mono), monospace; color: var(--c);
  text-shadow: 0 0 22px color-mix(in srgb, var(--c) 55%, transparent); }
.fm-fraglabel { font: 600 9px/1.5 var(--font-archivo), sans-serif; letter-spacing: .14em;
  text-transform: uppercase; color: var(--dim); }
.fm-fraglabel em { color: var(--c); font-style: normal; }

.fm-dl { margin: 0 0 .8rem; border-top: 1px solid var(--line); }
.fm-dl > div { display: flex; justify-content: space-between; padding: .28rem 0;
  border-bottom: 1px solid var(--line); font-size: 11px; }
.fm-dl dt { color: var(--dim); margin: 0; }
.fm-dl dd { margin: 0; font-family: var(--font-mono), monospace; }
.fm-dl dd span { color: var(--dim); }

.fm-flag { font-size: 10.5px; line-height: 1.55; padding: .45rem .55rem; border-radius: 2px; margin: 0 0 .55rem; }
.fm-lower { background: #1F1509; border-left: 2px solid #C48432; color: #D9BE93; }
.fm-shared { background: #0E1A20; border-left: 2px solid #4E7C8C; color: #9FC0CC; }
.fm-conf { font-size: 10px; line-height: 1.6; color: var(--dim); margin: 0 0 .7rem;
  padding-left: .55rem; border-left: 2px solid var(--line); }
.fm-conf-modelled { border-left-color: #7A5B2E; }
.fm-conf-sourced { border-left-color: #3E6B54; }
.fm-notes { font-size: 11px; line-height: 1.65; color: #9FB0BC; margin: 0 0 .7rem; }
.fm-blast { font-size: 10.5px; color: var(--dim); margin: 0 0 .7rem; }
.fm-blast strong { font-family: var(--font-mono), monospace; color: var(--hot); }
.fm-hint { font-size: 10px; color: var(--dim); font-style: italic; margin: 0; }
.fm-close { background: none; border: 1px solid var(--line); color: var(--dim);
  font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .12em;
  text-transform: uppercase; padding: .45rem .6rem; cursor: pointer; border-radius: 2px; }
.fm-close:hover { color: var(--ink); }

@media (max-width: 900px) {
  .fm-frame { aspect-ratio: 3 / 4; }
  .fm-panel { top: auto; bottom: 3rem; left: .55rem; right: .55rem; width: auto; max-height: 46%; }
  .fm-legend { display: none; }
  .fm-count { display: none; }
}
`;
