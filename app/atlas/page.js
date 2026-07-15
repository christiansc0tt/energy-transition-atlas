'use client';

// app/atlas/page.js
// The main page. Sector state lives here and flows down: the map, the
// narrative, the charts and the simulator are all views of one selection.
// Switching sector switches the whole page, which is the point — the tabs are
// not five sites, they are one argument told five times.

import { useState, useCallback } from 'react';
import FragilityMap from '../../components/FragilityMap';
import { Thesis, DeepDive } from '../../components/SectorNarrative';
import { PriceChart, CarbonSpread } from '../../components/Charts';
import ShockSimulator from '../../components/ShockSimulator';
import { content } from '../../data/graph/content';
import { sharedStages } from '../../data/graph';

export default function AtlasPage() {
  const [sector, setSector] = useState('ev');
  const [selectedNode, setSelectedNode] = useState(null);
  const c = content[sector];

  const handleSelect = useCallback((id) => setSelectedNode(id), []);

  return (
    <main className="at">
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <header className="at-head">
        <p className="at-eyebrow">Energy Transition Supply-Chain Atlas</p>
        <h1>Where the transition actually breaks</h1>
        <p className="at-lede">
          Fragility is dependency: how concentrated a stage is, whether it can be engineered
          around, and how long a replacement takes. It is deliberately blind to cost and to
          politics — those are separate axes, because a cheap part you cannot buy stops the line
          just as dead as an expensive one, and an ally can be a chokepoint too.
        </p>
      </header>

      <FragilityMap sector={sector} onSectorChange={setSector} onSelect={handleSelect} />

      <section className="at-thesis">
        <Thesis text={c.thesis} />
      </section>

      <div className="at-grid">
        <DeepDive deepDive={c.deepDive} />
        <ShockSimulator sector={sector} selectedNode={selectedNode} />
      </div>

      <div className="at-grid">
        <PriceChart price={c.price} />
        <CarbonSpread carbon={c.carbon} />
      </div>

      <section className="at-shared">
        <p className="at-eyebrow">Cross-sector</p>
        <h2>Stages that serve more than one technology</h2>
        <p className="at-sharedlede">
          This table is the reason the atlas is an atlas and not three reports. Nothing here is
          asserted — it falls out of the data model, because a stage declares which sectors it
          serves and the graph is merged before it is filtered.
        </p>
        <table className="at-table">
          <thead>
            <tr><th>Fragility</th><th>Stage</th><th>Risk type</th><th>Serves</th></tr>
          </thead>
          <tbody>
            {sharedStages.map((s) => (
              <tr key={s.id}>
                <td className="at-frag">{s.fragility}</td>
                <td>{s.label}</td>
                <td className="at-dim">{s.riskType.replace('-', ' ')}</td>
                <td className="at-dim">{s.sectors.join(' + ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer className="at-foot">
        <p>
          Scorecards are <strong>modelled</strong> — substitutability and lead time are our
          judgement, not published figures, and are flagged as such throughout. Country shares are
          sourced or derived from public data and cited per node. Nothing in the simulator is
          sourced at all.
        </p>
      </footer>
    </main>
  );
}

const pageStyles = `
.at { max-width: 1320px; margin: 0 auto; padding: 2.5rem 1rem 4rem;
  font-family: var(--font-inter), system-ui, sans-serif; color: #C6D3DC; }
.at-eyebrow { font: 600 10px/1 var(--font-archivo), sans-serif; letter-spacing: .18em;
  text-transform: uppercase; color: #708392; margin: 0 0 .5rem; }
.at-head { margin-bottom: 1.4rem; }
.at-head h1 { font: 600 32px/1.12 var(--font-inter), sans-serif; letter-spacing: -0.025em;
  margin: 0 0 .6rem; }
.at-lede { max-width: 66ch; margin: 0; color: #708392; font-size: 13.5px; line-height: 1.7; }

.at-thesis { margin: 1.8rem 0 0; }
.at-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;
  align-items: start; }

.at-shared { margin-top: 2rem; background: #101920; border: 1px solid #24323C;
  border-radius: 2px; padding: 1.1rem; }
.at-shared h2 { font-size: 17px; font-weight: 600; margin: 0 0 .6rem; }
.at-sharedlede { font-size: 12.5px; line-height: 1.7; color: #9FB0BC; margin: 0 0 1rem; max-width: 68ch; }
.at-table { width: 100%; border-collapse: collapse; }
.at-table th { font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .14em;
  text-transform: uppercase; color: #708392; text-align: left; padding: .4rem .5rem;
  border-bottom: 1px solid #24323C; }
.at-table td { font-size: 12px; padding: .5rem; border-bottom: 1px solid #1A242C; }
.at-frag { font: 400 15px var(--font-mono), monospace; color: #FFA94D; width: 70px; }
.at-dim { color: #708392; }

.at-foot { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #24323C; }
.at-foot p { font-size: 11px; line-height: 1.7; color: #708392; margin: 0; max-width: 78ch; }
.at-foot strong { color: #C48432; }

@media (max-width: 900px) { .at-grid { grid-template-columns: 1fr; } }
`;
