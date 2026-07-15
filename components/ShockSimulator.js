'use client';

// components/ShockSimulator.js
// ---------------------------------------------------------------------------
// THE ACTION LAYER.
//
// This is the most dangerous component in the atlas, and the honesty rule for
// it is absolute: NOTHING HERE IS SOURCED. There is no public dataset that
// says "graphite export ban -> +7% pack cost in 9 months". We are constructing
// it from cost-share midpoints, a pass-through assumption, and a scarcity
// premium we invented.
//
// So the model is shown, not hidden. The user can move the assumptions and
// watch the answer move. A finance audience trusts a stated model with visible
// levers far more than a confident number with no provenance — and if they
// disagree with our pass-through, they should be able to see that it is a
// slider and not a fact.
// ---------------------------------------------------------------------------

import { useMemo, useState } from 'react';
import { forSector, scoredById, nodeById, downstreamOf } from '../data/graph';
import { COST_WEIGHT } from '../data/graph/content';

const LEAD_YEARS = { 0: 'under 2 years', 1: '2–4 years', 2: '4–7 years', 3: 'over 7 years — qualification-bound' };
const SUB_TEXT = {
  0: 'A proven substitute is deployed at scale today. The shock is absorbable.',
  1: 'A substitute exists at a modest cost or performance penalty.',
  2: 'Substitution is possible but immature — significant penalty, unproven at scale.',
  3: 'No credible substitute exists.',
};

const SHOCKS = [
  { id: 'export-ban', label: 'Export ban', hint: 'This node’s output leaves the market entirely' },
  { id: 'price-spike', label: 'Price spike', hint: 'Input cost rises, supply continues' },
  { id: 'capacity-loss', label: 'Capacity loss', hint: 'Fire, flood, outage — partial, temporary' },
];

export default function ShockSimulator({ sector, selectedNode }) {
  const graph = useMemo(() => forSector(sector), [sector]);
  const candidates = useMemo(
    () => [...graph.nodes].sort((a, b) =>
      (scoredById[b.stageId]?.fragility ?? 0) - (scoredById[a.stageId]?.fragility ?? 0)),
    [graph]
  );

  const [nodeId, setNodeId] = useState(null);
  const [shock, setShock] = useState('export-ban');
  const [magnitude, setMagnitude] = useState(50);
  const [passThrough, setPassThrough] = useState(80);

  const active = nodeId || selectedNode || candidates[0]?.id;
  const node = nodeById[active];
  const stage = scoredById[node?.stageId];

  const result = useMemo(() => {
    if (!node || !stage) return null;
    const w = COST_WEIGHT[stage.costShare];
    const pt = passThrough / 100;
    const m = magnitude / 100;

    let mult, headline;
    if (shock === 'export-ban') {
      // Scarcity premium: the more of the stage this node holds, the harder the
      // remainder has to stretch. share/(1-share), capped at 3x because beyond
      // that the model is meaningless — nothing clears, it is not a price event.
      const rest = Math.max(0.02, 1 - node.share);
      mult = Math.min(3, node.share / rest);
      headline = node.share > 0.85
        ? 'Not a price event. At this share there is no remainder to bid for — the line stops.'
        : 'The remainder gets bid up. Cost, not availability, is the binding constraint.';
    } else if (shock === 'price-spike') {
      mult = m;
      headline = 'Supply continues. This is a margin event, not a capability event.';
    } else {
      const lost = m * node.share;
      const rest = Math.max(0.02, 1 - lost);
      mult = Math.min(3, lost / rest);
      headline = 'Temporary by definition. Recovery is measured in months, not the lead time below.';
    }

    const delta = w * mult * pt * 100;
    return {
      delta,
      mult,
      w,
      headline,
      downstream: downstreamOf(active).size,
      recovery: shock === 'capacity-loss' ? 'weeks to months' : LEAD_YEARS[stage.L],
      substitution: SUB_TEXT[stage.S],
    };
  }, [node, stage, shock, magnitude, passThrough, active]);

  if (!node || !result) return null;

  return (
    <section className="sim">
      <style dangerouslySetInnerHTML={{ __html: simStyles }} />

      <header className="sim-head">
        <p className="sim-eyebrow">Shock simulator</p>
        <h3>What breaks, how much it costs, how long it lasts</h3>
        <p className="sim-warn">
          <strong>Every number below is modelled, not sourced.</strong> No public dataset prices a
          supply-chain shock. This is cost-share midpoints times a scarcity premium times a
          pass-through assumption — all three are ours, and all three are on screen. Move them.
        </p>
      </header>

      <div className="sim-controls">
        <label className="sim-field">
          <span>Node</span>
          <select value={active} onChange={(e) => setNodeId(e.target.value)}>
            {candidates.map((n) => (
              <option key={n.id} value={n.id}>
                {scoredById[n.stageId]?.label} · {n.country} · fragility {scoredById[n.stageId]?.fragility}
              </option>
            ))}
          </select>
        </label>

        <div className="sim-field">
          <span>Shock</span>
          <div className="sim-seg">
            {SHOCKS.map((s) => (
              <button key={s.id} className={shock === s.id ? 'on' : ''} onClick={() => setShock(s.id)}
                      title={s.hint} aria-pressed={shock === s.id}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {shock !== 'export-ban' && (
          <label className="sim-field">
            <span>{shock === 'price-spike' ? 'Price rise' : 'Capacity lost'} — {magnitude}%</span>
            <input type="range" min="10" max="200" step="5" value={magnitude}
                   onChange={(e) => setMagnitude(+e.target.value)} />
          </label>
        )}

        <label className="sim-field">
          <span>Pass-through to end product — {passThrough}%</span>
          <input type="range" min="0" max="100" step="5" value={passThrough}
                 onChange={(e) => setPassThrough(+e.target.value)} />
        </label>
      </div>

      <div className="sim-out">
        <div className="sim-big">
          <span className="sim-num">
            {result.delta < 0.05 ? '~0' : `+${result.delta.toFixed(1)}`}<em>%</em>
          </span>
          <span className="sim-biglabel">end-product<br />cost delta</span>
        </div>

        <dl className="sim-dl">
          <div><dt>Downstream nodes hit</dt><dd>{result.downstream}</dd></div>
          <div><dt>Recovery horizon</dt><dd>{result.recovery}</dd></div>
          <div><dt>Node share of stage</dt><dd>{Math.round(node.share * 100)}%</dd></div>
          <div><dt>Stage cost share</dt><dd>{stage.costShare} ({(result.w * 100).toFixed(0)}%)</dd></div>
        </dl>
      </div>

      <p className="sim-headline">{result.headline}</p>
      <p className="sim-sub"><strong>Substitution:</strong> {result.substitution}</p>

      {stage.id === 'graphite-anode' && (
        <p className="sim-gotcha">
          The standard answer makes this worse. Switching to LFP removes cobalt and nickel — but
          LFP cells need <em>more</em> anode per kWh, not less.
        </p>
      )}
      {stage.id === 'ingot-wafer' && shock === 'export-ban' && (
        <p className="sim-gotcha">
          China restricts wafer <em>technology</em>, not wafer exports — so the real shock here
          never shows up as a cost delta at all. It caps your ceiling instead of raising your price.
          This simulator cannot model that, and the gap is the point.
        </p>
      )}
      {stage.id === 'ree-separation' && (
        <p className="sim-gotcha">
          Cost share is low, so the number above is small. It is also irrelevant: a rounding-error
          input you cannot buy stops the line exactly as dead as an expensive one.
        </p>
      )}
      {stage.firmConcentration && (
        <p className="sim-gotcha">
          Understated. The binding concentration here is firm-level; the model only sees countries.
        </p>
      )}

      <details className="sim-model">
        <summary>Show the model</summary>
        <pre>{`cost delta = stage cost share × multiplier × pass-through

  stage cost share   ${stage.costShare} → ${result.w}  (midpoint of ${stage.costShare === 'low' ? '<5%' : stage.costShare === 'mid' ? '5–20%' : '>20%'} of BOM)
  multiplier         ${result.mult.toFixed(2)}  ${shock === 'export-ban' ? '← share / (1 − share), capped at 3' : shock === 'price-spike' ? '← the price rise itself' : '← lost / (1 − lost), capped at 3'}
  pass-through       ${(passThrough / 100).toFixed(2)}

  = ${result.w} × ${result.mult.toFixed(2)} × ${(passThrough / 100).toFixed(2)} = ${(result.delta / 100).toFixed(4)} → ${result.delta.toFixed(1)}%

Known weaknesses, stated rather than buried:
  · Cost-share midpoints are crude. A 'mid' stage is anywhere from 5% to 20%.
  · The scarcity premium is invented. Real markets do not clear on a ratio.
  · Pass-through is assumed uniform. It is not: contract structures differ.
  · No substitution response. The model does not let anyone react, which
    overstates long-run impact and understates short-run disruption.
  · Recovery horizon is the stage's L score, which is itself judgement.`}</pre>
      </details>
    </section>
  );
}

const simStyles = `
.sim { background: #101920; border: 1px solid #24323C; border-radius: 2px; padding: 1rem;
  font-family: var(--font-inter), system-ui, sans-serif; color: #C6D3DC; }
.sim-eyebrow { font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .16em;
  text-transform: uppercase; color: #708392; margin: 0 0 .4rem; }
.sim-head h3 { font-size: 15px; font-weight: 600; margin: 0 0 .6rem; }
.sim-warn { font-size: 11px; line-height: 1.6; color: #D9BE93; background: #1F1509;
  border-left: 2px solid #C48432; padding: .5rem .6rem; border-radius: 2px; margin: 0 0 1rem; }

.sim-controls { display: flex; flex-direction: column; gap: .7rem; margin-bottom: 1rem; }
.sim-field { display: flex; flex-direction: column; gap: .3rem; }
.sim-field > span { font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .12em;
  text-transform: uppercase; color: #708392; }
.sim-field select { background: #0B1116; border: 1px solid #24323C; color: #C6D3DC;
  padding: .45rem .5rem; border-radius: 2px; font-size: 11.5px;
  font-family: var(--font-inter), sans-serif; }
.sim-field input[type=range] { accent-color: #FFA94D; }
.sim-seg { display: flex; gap: 2px; }
.sim-seg button { flex: 1; background: #0B1116; border: 1px solid #24323C; color: #708392;
  font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .1em; text-transform: uppercase;
  padding: .5rem .3rem; cursor: pointer; border-radius: 2px; }
.sim-seg button.on { background: #FFA94D; color: #0B1116; border-color: #FFA94D; }
.sim-seg button:focus-visible, .sim-field select:focus-visible { outline: 2px solid #FFA94D; outline-offset: 1px; }

.sim-out { display: flex; gap: 1.2rem; align-items: center; padding: .8rem 0;
  border-top: 1px solid #24323C; border-bottom: 1px solid #24323C; margin-bottom: .8rem; }
.sim-big { display: flex; align-items: center; gap: .5rem; }
.sim-num { font: 300 40px/1 var(--font-mono), monospace; color: #FFA94D;
  text-shadow: 0 0 22px rgba(255,169,77,.4); }
.sim-num em { font-size: 20px; font-style: normal; }
.sim-biglabel { font: 600 9px/1.5 var(--font-archivo), sans-serif; letter-spacing: .12em;
  text-transform: uppercase; color: #708392; }
.sim-dl { flex: 1; margin: 0; }
.sim-dl > div { display: flex; justify-content: space-between; padding: .22rem 0; font-size: 11px; }
.sim-dl dt { color: #708392; margin: 0; }
.sim-dl dd { margin: 0; font-family: var(--font-mono), monospace; }

.sim-headline { font-size: 12.5px; line-height: 1.6; margin: 0 0 .5rem; }
.sim-sub { font-size: 11.5px; line-height: 1.6; color: #9FB0BC; margin: 0 0 .6rem; }
.sim-sub strong { color: #C6D3DC; }
.sim-gotcha { font-size: 11.5px; line-height: 1.6; color: #9FC0CC; background: #0E1A20;
  border-left: 2px solid #4E7C8C; padding: .5rem .6rem; border-radius: 2px; margin: 0 0 .6rem; }

.sim-model { margin-top: .6rem; }
.sim-model summary { font: 600 9px/1 var(--font-archivo), sans-serif; letter-spacing: .12em;
  text-transform: uppercase; color: #708392; cursor: pointer; padding: .4rem 0; }
.sim-model summary:hover { color: #C6D3DC; }
.sim-model pre { font: 400 10px/1.65 var(--font-mono), monospace; color: #9FB0BC;
  background: #0B1116; border: 1px solid #24323C; border-radius: 2px;
  padding: .7rem; overflow-x: auto; white-space: pre-wrap; margin: .3rem 0 0; }
`;
