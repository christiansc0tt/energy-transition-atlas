'use client';

// components/FragilityMap.js
// ---------------------------------------------------------------------------
// THE CENTREPIECE.
//
// Division of labour, and it matters: D3 does maths (projection, collision,
// zoom behaviour). React does DOM. D3 never touches an element React owns.
// This is the single decision that stops the two libraries fighting.
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';
import { forSector, scoredById, nodeById, downstreamOf, upstreamOf, SECTORS } from '../data/graph';

const WORLD_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const W = 1000;
const H = 520;

// Pyrometer ramp, indexed by fragility 0-10. Cold rolled steel -> incandescent.
// Perceptually ordered and legible to red-green colourblind readers, which
// rules out the default red/amber/green risk ramp.
const HEAT = [
  '#3E4C57', '#43505A', '#4B555A', '#5C5B53', '#75654A',
  '#8E7143', '#A87E3B', '#C48432', '#DE7526', '#F4681B', '#FFA94D',
];

const LAYERS = ['mining', 'refining', 'component', 'assembly', 'deployment'];

export default function FragilityMap() {
  const [world, setWorld] = useState(null);
  const [sector, setSector] = useState('ev');
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

  const graph = useMemo(() => forSector(sector), [sector]);

  const projection = useMemo(
    () => d3.geoNaturalEarth1().fitExtent([[8, 8], [W - 8, H - 8]], { type: 'Sphere' }),
    []
  );
  const path = useMemo(() => d3.geoPath(projection), [projection]);

  // Node placement. China carries six-plus nodes at nearly identical
  // coordinates; without dodging they stack into one blob and the map reads as
  // amateur work. Seed the simulation at the true position and let collision
  // push them apart, with a weak spring holding them near the truth.
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

  // Zoom. d3 computes the transform; React applies it. No DOM mutation.
  useEffect(() => {
    if (!svgRef.current) return;
    const sel = d3.select(svgRef.current);
    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', (e) => setTransform(e.transform));
    sel.call(zoom);
    return () => sel.on('.zoom', null);
  }, []);

  const focus = selected || hovered;
  const lit = useMemo(() => {
    if (!focus) return null;
    const down = downstreamOf(focus);
    const up = upstreamOf(focus);
    return { down, up, all: new Set([focus, ...down, ...up]) };
  }, [focus]);

  const visible = (n) => !layerFilter || scoredById[n.stageId]?.layer === layerFilter;
  const shown = placed.filter(visible);
  const shownIds = new Set(shown.map((n) => n.id));

  const dim = (id) => {
    if (!lit) return 1;
    if (id === focus) return 1;
    if (lit.down.has(id)) return 1;
    if (lit.up.has(id)) return 0.55;
    return 0.12;
  };

  const sel = selected ? { node: nodeById[selected], stage: scoredById[nodeById[selected]?.stageId] } : null;

  return (
    <div className="fm">
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <header className="fm-bar">
        <nav className="fm-sectors" aria-label="Sector">
          {SECTORS.map((s) => (
            <button
              key={s}
              className={`fm-sec ${s === sector ? 'on' : ''}`}
              onClick={() => { setSector(s); setSelected(null); }}
              aria-pressed={s === sector}
            >
              {s === 'ev' ? 'EV & Battery' : s === 'solar' ? 'Solar PV' : 'Wind'}
            </button>
          ))}
        </nav>
        <div className="fm-layers" role="group" aria-label="Filter by stage">
          {LAYERS.map((l) => (
            <button
              key={l}
              className={`fm-chip ${layerFilter === l ? 'on' : ''}`}
              onClick={() => setLayerFilter(layerFilter === l ? null : l)}
              aria-pressed={layerFilter === l}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <div className="fm-body">
        <div className="fm-mapwrap">
          {!world && <p className="fm-status">Loading basemap…</p>}
          {world === 'error' && (
            <p className="fm-status fm-err">
              Basemap didn’t load. Check the connection to cdn.jsdelivr.net, then reload.
            </p>
          )}

          {world && world !== 'error' && (
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="fm-svg" role="img"
                 aria-label={`Supply chain fragility map, ${sector} sector`}>
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

                {/* Flows. Bezier between dodged screen positions, not great
                    circles — great circles connect true coordinates, and after
                    collision the nodes are no longer at their true coordinates. */}
                <g fill="none">
                  {graph.edges.map((e, i) => {
                    const a = posById[e.from], b = posById[e.to];
                    if (!a || !b || !shownIds.has(e.from) || !shownIds.has(e.to)) return null;
                    const on = lit && (lit.all.has(e.from) && lit.all.has(e.to));
                    const o = lit ? (on ? 0.75 : 0.05) : 0.18;
                    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
                    const dx = b.x - a.x, dy = b.y - a.y;
                    const bow = Math.hypot(dx, dy) * 0.16;
                    return (
                      <path
                        key={i}
                        d={`M${a.x},${a.y} Q${mx - dy * 0.16},${my + dx * 0.16 - bow * 0} ${b.x},${b.y}`}
                        stroke={on ? HEAT[Math.max(a.frag, b.frag)] : '#4C6070'}
                        strokeWidth={on ? 1.5 : 0.7}
                        strokeOpacity={o}
                      />
                    );
                  })}
                </g>

                {/* Nodes. Radius and heat both encode fragility — redundant on
                    purpose, so the ramp survives greyscale printing. */}
                <g>
                  {shown.map((n) => {
                    const hot = n.frag >= 7;
                    const o = dim(n.id);
                    return (
                      <g key={n.id} opacity={o} className={hot && o > 0.5 ? 'fm-hot' : undefined}>
                        <circle
                          cx={n.x} cy={n.y} r={n.r}
                          fill={HEAT[n.frag]}
                          stroke={n.alignment === 'exposed' ? '#0B1116' : '#8FA3B0'}
                          strokeWidth={n.alignment === 'exposed' ? 1 : 0.8}
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

          {hovered && !selected && posById[hovered] && (
            <div className="fm-tip" style={{ left: `${(posById[hovered].x / W) * 100}%`, top: `${(posById[hovered].y / H) * 100}%` }}>
              <strong>{scoredById[nodeById[hovered].stageId]?.label}</strong>
              <span>{nodeById[hovered].country} · {Math.round(nodeById[hovered].share * 100)}% of stage</span>
              <span className="fm-tipfrag">fragility {posById[hovered].frag}</span>
            </div>
          )}
        </div>

        <aside className="fm-panel">
          {!sel && (
            <div className="fm-empty">
              <p className="fm-eyebrow">Read the heat</p>
              <p>
                Every node above 7 is a furnace — arc furnace, Siemens reactor, crystal puller,
                sintering press. The chokepoints in the energy transition are where the heat is.
              </p>
              <p>Select a node to see its scorecard and what it governs downstream.</p>
            </div>
          )}

          {sel && (
            <div className="fm-card">
              <p className="fm-eyebrow">{sel.stage.layer} · {sel.node.country}</p>
              <h3>{sel.stage.label}</h3>

              <div className="fm-frag" style={{ '--c': HEAT[sel.stage.fragility] }}>
                <span className="fm-fragnum">{sel.stage.fragility}</span>
                <span className="fm-fraglabel">
                  fragility<br /><em>{sel.stage.riskType.replace('-', ' ')}</em>
                </span>
              </div>

              <dl className="fm-dl">
                <div><dt>Concentration (C)</dt><dd>{sel.stage.C}<span> / 4</span></dd></div>
                <div><dt>Substitutability (S)</dt><dd>{sel.stage.S}<span> / 3</span></dd></div>
                <div><dt>Lead time (L)</dt><dd>{sel.stage.L}<span> / 3</span></dd></div>
                <div><dt>Cost share</dt><dd>{sel.stage.costShare}</dd></div>
                <div><dt>Country share</dt><dd>{Math.round(sel.node.share * 100)}<span>%</span></dd></div>
                <div><dt>Alignment</dt><dd>{sel.node.alignment}</dd></div>
              </dl>

              {sel.stage.firmConcentration && (
                <p className="fm-flag fm-lower">
                  <strong>Fragility is a lower bound here.</strong> The binding concentration is at
                  firm level, not country level, and the score only measures countries.{' '}
                  {sel.stage.firmConcentration.note}
                </p>
              )}

              {sel.stage.sectors.length > 1 && (
                <p className="fm-flag fm-shared">
                  Shared node — also serves {sel.stage.sectors.filter((s) => s !== sector).join(', ')}.
                </p>
              )}

              <p className={`fm-conf fm-conf-${sel.stage.confidence}`}>
                Scorecard: <strong>{sel.stage.confidence}</strong>
                {sel.stage.confidence === 'modelled' && ' — our judgement, not a published figure'}
                <br />
                Country share: <strong>{sel.node.confidence}</strong> · {sel.node.source}
              </p>

              {sel.stage.carbon && (
                <p className="fm-carbon">
                  <span className="fm-eyebrow">Embodied carbon</span>
                  {sel.stage.carbon.range
                    ? `${sel.stage.carbon.range[0]}–${sel.stage.carbon.range[1]} ${sel.stage.carbon.unit}`
                    : `${sel.stage.carbon.value} ${sel.stage.carbon.unit}`}
                  <em>{sel.stage.carbon.basis}</em>
                </p>
              )}

              <p className="fm-notes">{sel.stage.notes}</p>

              <p className="fm-blast">
                Governs <strong>{downstreamOf(selected).size}</strong> downstream nodes.
              </p>

              <button className="fm-close" onClick={() => setSelected(null)}>Clear selection</button>
            </div>
          )}
        </aside>
      </div>

      <footer className="fm-legend">
        <div className="fm-ramp" aria-hidden="true">
          {HEAT.map((c, i) => <span key={i} style={{ background: c }} />)}
        </div>
        <span className="fm-scale"><em>0</em> resilient · dependency fragility · white-hot <em>10</em></span>
        <span className="fm-count">
          {shown.length} nodes · {graph.stages.length} stages
          {layerFilter && ` · ${layerFilter} only`}
        </span>
      </footer>
    </div>
  );
}

const styles = `
.fm {
  --bg: #0E151B; --panel: #131C23; --line: #24323C;
  --ink: #C6D3DC; --dim: #708392; --hot: #FFA94D;
  background: var(--bg); color: var(--ink);
  border: 1px solid var(--line); border-radius: 2px;
  font-family: var(--font-inter), system-ui, sans-serif;
}
.fm-bar {
  display: flex; justify-content: space-between; align-items: center;
  gap: 1rem; padding: .6rem .8rem; border-bottom: 1px solid var(--line);
  flex-wrap: wrap;
}
.fm-sectors { display: flex; gap: .15rem; }
.fm-sec, .fm-chip {
  background: none; border: 1px solid transparent; color: var(--dim);
  font: 600 11px/1 var(--font-archivo), sans-serif;
  letter-spacing: .13em; text-transform: uppercase;
  padding: .5rem .7rem; cursor: pointer; border-radius: 2px;
}
.fm-sec:hover, .fm-chip:hover { color: var(--ink); }
.fm-sec.on { color: var(--hot); border-color: var(--line); background: #0A1015; }
.fm-layers { display: flex; gap: .15rem; }
.fm-chip { font-size: 10px; letter-spacing: .1em; padding: .45rem .55rem; }
.fm-chip.on { color: #0E151B; background: var(--dim); }
.fm-sec:focus-visible, .fm-chip:focus-visible, .fm-close:focus-visible { outline: 2px solid var(--hot); outline-offset: 2px; }

.fm-body { display: grid; grid-template-columns: 1fr 300px; }
.fm-mapwrap { position: relative; border-right: 1px solid var(--line); }
.fm-svg { display: block; width: 100%; height: auto; touch-action: none; }
.fm-status { padding: 4rem 1rem; text-align: center; color: var(--dim); font-size: 13px; }
.fm-err { color: #E0864C; }

/* The signature. Only nodes at 7+ breathe, and only where the reader is
   already looking — ambient pulsing everywhere would be decoration. */
.fm-hot { animation: fm-breathe 3.4s ease-in-out infinite; }
@keyframes fm-breathe { 0%,100% { opacity: 1 } 50% { opacity: .74 } }
@media (prefers-reduced-motion: reduce) { .fm-hot { animation: none } }

.fm-tip {
  position: absolute; transform: translate(-50%, calc(-100% - 14px));
  background: #0A1015; border: 1px solid var(--line); border-radius: 2px;
  padding: .45rem .6rem; pointer-events: none; white-space: nowrap;
  display: flex; flex-direction: column; gap: 2px; font-size: 11px;
}
.fm-tip strong { font-size: 12px; }
.fm-tip span { color: var(--dim); }
.fm-tipfrag { font-family: var(--font-mono), monospace; color: var(--hot) !important; }

.fm-panel { padding: .9rem; min-height: 460px; overflow-y: auto; max-height: 520px; }
.fm-eyebrow {
  font: 600 10px/1 var(--font-archivo), sans-serif; letter-spacing: .16em;
  text-transform: uppercase; color: var(--dim); margin: 0 0 .5rem;
}
.fm-empty p { font-size: 12.5px; line-height: 1.6; color: var(--dim); margin: 0 0 .7rem; }
.fm-card h3 { font-size: 16px; line-height: 1.25; margin: 0 0 .8rem; font-weight: 600; }

.fm-frag { display: flex; align-items: center; gap: .6rem; margin-bottom: .9rem; }
.fm-fragnum {
  font: 300 40px/1 var(--font-mono), monospace; color: var(--c);
  text-shadow: 0 0 22px color-mix(in srgb, var(--c) 55%, transparent);
}
.fm-fraglabel {
  font: 600 9px/1.5 var(--font-archivo), sans-serif; letter-spacing: .14em;
  text-transform: uppercase; color: var(--dim);
}
.fm-fraglabel em { color: var(--c); font-style: normal; }

.fm-dl { margin: 0 0 .9rem; border-top: 1px solid var(--line); }
.fm-dl > div {
  display: flex; justify-content: space-between; padding: .3rem 0;
  border-bottom: 1px solid var(--line); font-size: 11.5px;
}
.fm-dl dt { color: var(--dim); margin: 0; }
.fm-dl dd { margin: 0; font-family: var(--font-mono), monospace; }
.fm-dl dd span { color: var(--dim); }

.fm-flag { font-size: 11px; line-height: 1.55; padding: .5rem .6rem; border-radius: 2px; margin: 0 0 .6rem; }
.fm-lower { background: #1F1509; border-left: 2px solid #C48432; color: #D9BE93; }
.fm-shared { background: #0E1A20; border-left: 2px solid #4E7C8C; color: #9FC0CC; }

.fm-conf { font-size: 10.5px; line-height: 1.6; color: var(--dim); margin: 0 0 .7rem; padding-left: .6rem; border-left: 2px solid var(--line); }
.fm-conf-modelled { border-left-color: #7A5B2E; }
.fm-conf-sourced { border-left-color: #3E6B54; }

.fm-carbon { font-size: 12px; margin: 0 0 .7rem; font-family: var(--font-mono), monospace; }
.fm-carbon em { display: block; font-family: var(--font-inter), sans-serif; font-style: normal; font-size: 10px; color: var(--dim); }
.fm-notes { font-size: 11.5px; line-height: 1.65; color: #9FB0BC; margin: 0 0 .8rem; white-space: pre-wrap; }
.fm-blast { font-size: 11px; color: var(--dim); margin: 0 0 .8rem; }
.fm-blast strong { font-family: var(--font-mono), monospace; color: var(--hot); }
.fm-close {
  background: none; border: 1px solid var(--line); color: var(--dim);
  font: 600 10px/1 var(--font-archivo), sans-serif; letter-spacing: .12em;
  text-transform: uppercase; padding: .5rem .7rem; cursor: pointer; border-radius: 2px;
}
.fm-close:hover { color: var(--ink); }

.fm-legend {
  display: flex; align-items: center; gap: .8rem; flex-wrap: wrap;
  padding: .55rem .8rem; border-top: 1px solid var(--line);
  font: 500 10px/1 var(--font-archivo), sans-serif; letter-spacing: .1em;
  text-transform: uppercase; color: var(--dim);
}
.fm-ramp { display: flex; }
.fm-ramp span { width: 15px; height: 9px; }
.fm-scale em { font-style: normal; font-family: var(--font-mono), monospace; color: var(--ink); }
.fm-count { margin-left: auto; font-family: var(--font-mono), monospace; letter-spacing: 0; text-transform: none; }

@media (max-width: 860px) {
  .fm-body { grid-template-columns: 1fr; }
  .fm-mapwrap { border-right: none; border-bottom: 1px solid var(--line); }
  .fm-panel { max-height: none; min-height: 0; }
  .fm-tip { display: none; }
}
`;
