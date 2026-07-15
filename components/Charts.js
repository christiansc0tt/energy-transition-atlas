'use client';

// components/Charts.js
// Hand-rolled SVG. No chart library: these are two fixed shapes, not a
// plotting problem, and Chart.js would cost more than it saves here.

import { useState } from 'react';

const INK = '#C6D3DC', DIM = '#708392', LINE = '#24323C', HOT = '#FFA94D';

// --- PRICE VOLATILITY ------------------------------------------------------
export function PriceChart({ price }) {
  const [hover, setHover] = useState(null);
  const W = 720, H = 260, PL = 58, PR = 16, PT = 18, PB = 34;

  const vals = price.points.map((p) => p.v);
  const max = Math.max(...vals) * 1.08;
  const x = (i) => PL + (i / (price.points.length - 1)) * (W - PL - PR);
  const y = (v) => H - PB - (v / max) * (H - PT - PB);

  const line = price.points.map((p, i) => `${i ? 'L' : 'M'}${x(i)},${y(p.v)}`).join(' ');
  const area = `${line} L${x(price.points.length - 1)},${H - PB} L${PL},${H - PB} Z`;
  const ticks = [0, max * 0.25, max * 0.5, max * 0.75, max];
  const fmt = (v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : Math.round(v));
  const peak = price.points.reduce((a, b) => (b.v > a.v ? b : a));
  const trough = price.points.reduce((a, b) => (b.v < a.v ? b : a));

  return (
    <figure className="ch">
      <style dangerouslySetInnerHTML={{ __html: chartStyles }} />
      <figcaption className="ch-head">
        <p className="ch-eyebrow">Price volatility</p>
        <h3>{price.material}</h3>
        <p className="ch-sub">{price.unit} · {price.points[0].t} – {price.points.at(-1).t}</p>
      </figcaption>

      <svg viewBox={`0 0 ${W} ${H}`} className="ch-svg" role="img"
           aria-label={`${price.material} price, ${price.unit}, peaking at ${peak.v} in ${peak.t}`}>
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={y(t)} y2={y(t)} stroke={LINE} strokeWidth={0.5} />
            <text x={PL - 8} y={y(t) + 3} textAnchor="end" className="ch-tick">{fmt(t)}</text>
          </g>
        ))}

        <path d={area} fill="url(#ch-fade)" />
        <defs>
          <linearGradient id="ch-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={HOT} stopOpacity="0.22" />
            <stop offset="100%" stopColor={HOT} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={line} fill="none" stroke={HOT} strokeWidth={1.6} />

        {/* The round trip is the whole point — mark both ends of it. */}
        <line x1={PL} x2={W - PR} y1={y(trough.v)} y2={y(trough.v)}
              stroke={DIM} strokeWidth={0.6} strokeDasharray="3 3" />

        {price.points.map((p, i) => {
          const marked = price.marks.some((m) => m.t === p.t);
          return (
            <g key={p.t}>
              {marked && <circle cx={x(i)} cy={y(p.v)} r={3.5} fill={HOT} />}
              <rect x={x(i) - 14} y={PT} width={28} height={H - PT - PB}
                    fill="transparent" style={{ cursor: 'crosshair' }}
                    onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
            </g>
          );
        })}

        {hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={PT} y2={H - PB} stroke={DIM} strokeWidth={0.6} />
            <circle cx={x(hover)} cy={y(price.points[hover].v)} r={3} fill={INK} />
            <text x={x(hover) < W / 2 ? x(hover) + 8 : x(hover) - 8} y={y(price.points[hover].v) - 9}
                  textAnchor={x(hover) < W / 2 ? 'start' : 'end'} className="ch-val">
              {price.points[hover].t} · {fmt(price.points[hover].v)}
            </text>
          </g>
        )}

        {price.points.map((p, i) =>
          i % 3 === 0 ? <text key={p.t} x={x(i)} y={H - 14} textAnchor="middle" className="ch-tick">{p.t}</text> : null
        )}
      </svg>

      <div className="ch-marks">
        {price.marks.map((m) => (
          <p key={m.t}><span>{m.t}</span>{m.label}</p>
        ))}
      </div>

      <p className="ch-lesson">{price.lesson}</p>
      <p className="ch-conf">Indicative shape · <strong>{price.confidence}</strong> — {price.note}</p>
    </figure>
  );
}

// --- CARBON SPREAD ---------------------------------------------------------
export function CarbonSpread({ carbon }) {
  const max = Math.max(...carbon.bars.map((b) => b.range[1])) * 1.05;

  return (
    <figure className="ch">
      <style dangerouslySetInnerHTML={{ __html: chartStyles }} />
      <figcaption className="ch-head">
        <p className="ch-eyebrow">Embodied carbon</p>
        <h3>{carbon.title}</h3>
        <p className="ch-sub">{carbon.unit} · {carbon.basis}</p>
      </figcaption>

      {/* Ranges as floating bars, never point estimates. A single bar would
          imply a precision the LCA literature does not have. */}
      <div className="ch-bars">
        {carbon.bars.map((b) => (
          <div className="ch-bar" key={b.label}>
            <span className="ch-barlabel">{b.label}</span>
            <div className="ch-track">
              <div className="ch-fill"
                   style={{ left: `${(b.range[0] / max) * 100}%`, width: `${((b.range[1] - b.range[0]) / max) * 100}%` }} />
            </div>
            <span className="ch-barval">{b.range[0]}–{b.range[1]}</span>
          </div>
        ))}
      </div>

      <p className="ch-lesson">{carbon.payback}</p>
      <p className="ch-conf">Ranges, not point estimates · <strong>{carbon.confidence}</strong></p>
    </figure>
  );
}

const chartStyles = `
.ch { margin: 0; background: #101920; border: 1px solid ${LINE}; border-radius: 2px;
  padding: 1rem; font-family: var(--font-inter), system-ui, sans-serif; color: ${INK}; }
.ch-head { margin-bottom: .8rem; }
.ch-eyebrow { font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .16em;
  text-transform: uppercase; color: ${DIM}; margin: 0 0 .4rem; }
.ch-head h3 { font-size: 15px; font-weight: 600; margin: 0 0 .25rem; line-height: 1.3; }
.ch-sub { font: 400 10.5px/1 var(--font-mono), monospace; color: ${DIM}; margin: 0; }
.ch-svg { width: 100%; height: auto; display: block; }
.ch-tick { font: 400 9px var(--font-mono), monospace; fill: ${DIM}; }
.ch-val { font: 400 10px var(--font-mono), monospace; fill: ${INK}; }

.ch-marks { margin: .5rem 0 .8rem; }
.ch-marks p { font-size: 11px; color: ${DIM}; margin: 0 0 .2rem; display: flex; gap: .5rem; }
.ch-marks span { font-family: var(--font-mono), monospace; color: ${HOT}; min-width: 56px; }

.ch-bars { display: flex; flex-direction: column; gap: .55rem; margin-bottom: .9rem; }
.ch-bar { display: grid; grid-template-columns: 120px 1fr 66px; align-items: center; gap: .6rem; }
.ch-barlabel { font-size: 11px; color: ${DIM}; }
.ch-track { position: relative; height: 14px; background: #0B1116; border: 1px solid ${LINE}; border-radius: 1px; }
.ch-fill { position: absolute; top: 0; bottom: 0;
  background: linear-gradient(90deg, #8E7143, ${HOT}); border-radius: 1px; }
.ch-barval { font: 400 11px var(--font-mono), monospace; text-align: right; }

.ch-lesson { font-size: 12px; line-height: 1.65; color: #9FB0BC; margin: 0 0 .7rem; }
.ch-conf { font-size: 10px; line-height: 1.5; color: ${DIM}; margin: 0;
  padding-left: .55rem; border-left: 2px solid #7A5B2E; }
`;
