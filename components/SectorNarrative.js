'use client';

// components/SectorNarrative.js
// The thesis and the deep dive. The deep dive's job is to make one
// counterintuitive claim well, with the two stages it turns on shown side by
// side, so the reader can check the argument rather than take it.

import { scoredById } from '../data/graph';
import { HEAT } from './FragilityMap';

export function Thesis({ text }) {
  return (
    <p className="nr-thesis">
      <style dangerouslySetInnerHTML={{ __html: narrStyles }} />
      {text}
    </p>
  );
}

export function DeepDive({ deepDive }) {
  const a = scoredById[deepDive.compare.a];
  const b = scoredById[deepDive.compare.b];

  return (
    <section className="nr">
      <style dangerouslySetInnerHTML={{ __html: narrStyles }} />
      <p className="nr-eyebrow">{deepDive.eyebrow}</p>
      <h3 className="nr-title">{deepDive.title}</h3>

      {/* The comparison IS the argument. Two stages, one number each, side by
          side — before the prose, so the reader sees the claim before the case. */}
      <div className="nr-compare">
        {[a, b].map((s) => (
          <div className="nr-cell" key={s.id} style={{ '--c': HEAT[s.fragility] }}>
            <span className="nr-num">{s.fragility}</span>
            <span className="nr-cellname">{s.label}</span>
            <span className="nr-cellmeta">
              C{s.C} · S{s.S} · L{s.L} — {s.riskType.replace('-', ' ')}
            </span>
          </div>
        ))}
      </div>

      {deepDive.body.map((p, i) => <p className="nr-p" key={i}>{p}</p>)}
    </section>
  );
}

const narrStyles = `
.nr-thesis { font: 400 17px/1.55 var(--font-inter), system-ui, sans-serif; color: #C6D3DC;
  max-width: 64ch; margin: 0 0 1.6rem; letter-spacing: -0.01em; }
.nr { background: #101920; border: 1px solid #24323C; border-radius: 2px; padding: 1.1rem;
  font-family: var(--font-inter), system-ui, sans-serif; }
.nr-eyebrow { font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .16em;
  text-transform: uppercase; color: #708392; margin: 0 0 .4rem; }
.nr-title { font-size: 17px; font-weight: 600; color: #C6D3DC; margin: 0 0 1rem; line-height: 1.3; }

.nr-compare { display: grid; grid-template-columns: 1fr 1fr; gap: .5rem; margin-bottom: 1.1rem; }
.nr-cell { background: #0B1116; border: 1px solid #24323C; border-left: 2px solid var(--c);
  border-radius: 2px; padding: .7rem; display: flex; flex-direction: column; gap: .25rem; }
.nr-num { font: 300 32px/1 var(--font-mono), monospace; color: var(--c);
  text-shadow: 0 0 18px color-mix(in srgb, var(--c) 45%, transparent); }
.nr-cellname { font-size: 11.5px; color: #C6D3DC; line-height: 1.35; }
.nr-cellmeta { font: 400 9.5px var(--font-mono), monospace; color: #708392; }

.nr-p { font-size: 12.5px; line-height: 1.7; color: #9FB0BC; margin: 0 0 .8rem; max-width: 68ch; }
.nr-p:last-child { margin-bottom: 0; }

@media (max-width: 640px) { .nr-compare { grid-template-columns: 1fr; } }
`;
