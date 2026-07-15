// data/graph/schema.js
// ---------------------------------------------------------------------------
// THE SCHEMA. Every sector file must conform to this shape, unchanged.
// If a sector cannot be expressed here, fix the schema once and re-score
// everything. Do not add ad-hoc fields per sector.
// ---------------------------------------------------------------------------

// --- SCORING SCALE ---------------------------------------------------------
// Fragility = C + S + L. Range 0-10. Alignment-agnostic and cost-agnostic
// by design: those are separate axes, reported separately.

export const CONCENTRATION = {
  // Top-1 country share of GLOBAL output at this stage.
  0: '<30%  — genuinely distributed',
  1: '30-49% — leading producer, no chokepoint',
  2: '50-69% — dominant producer',
  3: '70-89% — near-monopoly',
  4: '>=90%  — effective monopoly',
};

export const SUBSTITUTABILITY = {
  // Can the END PRODUCT be made without this input, or with a different
  // input, using technology PROVEN AT SCALE TODAY? Not "in a lab".
  0: 'Yes — proven substitute deployed at scale now',
  1: 'Yes — modest cost or performance penalty',
  2: 'Possible but immature; significant penalty or unproven at scale',
  3: 'No credible substitute',
};

export const LEAD_TIME = {
  // Years to stand up QUALIFIED alternative capacity at scale.
  // Qualification, not construction, is usually the binding constraint.
  0: '<2 years',
  1: '2-4 years',
  2: '4-7 years',
  3: '>7 years, or qualification cycle dominates the timeline',
};

// Cost share of end-product BOM. NOT part of fragility.
// Determines whether a shock transmits as price or as line-stop.
export const COST_SHARE = {
  low: '<5% of BOM',
  mid: '5-20% of BOM',
  high: '>20% of BOM',
};

// Separate lens, never folded into fragility.
export const ALIGNMENT = {
  allied: 'US/EU/UK/JP/KR/AU/CA',
  neutral: 'Non-aligned or mixed',
  exposed: 'Subject to export control or strategic rivalry',
};

export const fragility = (C, S, L) => C + S + L;

// The 2x2 that fragility + cost share produces. This is the analytical output.
export const riskType = (frag, costShare) => {
  const high = frag >= 7;
  const heavy = costShare === 'high' || costShare === 'mid';
  if (high && heavy) return 'price-shock';
  if (high && !heavy) return 'line-stop';
  if (frag >= 4 && heavy) return 'margin-pressure';
  return 'low';
};

// --- SHAPES ----------------------------------------------------------------
//
// STAGE — the analytical unit. The scorecard lives here.
//   id           string, kebab-case, globally unique across ALL sectors
//   label        string, display name
//   sectors      string[]  <-- ARRAY. A stage can serve multiple sectors.
//                             This is how NdFeB appears in both EV and wind,
//                             and it is the atlas's only real cross-sector find.
//   layer        'mining' | 'refining' | 'component' | 'assembly' | 'deployment'
//   material     string
//   C, S, L      integers per the scales above
//   costShare    'low' | 'mid' | 'high'
//   carbon       { value|range, unit, basis, note } | null
//   policy       string[]  export controls, tariffs, CBAM, FEOC etc.
//   confidence   'sourced' | 'derived' | 'modelled'   <-- MANDATORY.
//                'sourced'  = lifted from a citable public dataset
//                'derived'  = arithmetic on sourced data
//                'modelled' = our judgement. Must be visually distinct in UI.
//   sources      string[]
//   notes        string
//
// NODE — a geographic instance of a stage. Plotted on the map.
//   id           string, unique
//   stageId      string, FK -> stage.id
//   country      ISO-2
//   lat, lon     numbers
//   share        0-1, this country's share of that stage's global output
//   alignment    'allied' | 'neutral' | 'exposed'
//   confidence   as above
//   source       string
//
// EDGE — a material flow between two NODES. Drawn as an arc.
//   from, to     node ids
//   volumeShare  0-1, indicative
//   confidence   as above
//
// Stage-to-stage topology is DERIVED from edges via node.stageId.
// Never store it twice.

// --- VALIDATOR -------------------------------------------------------------
// Run this before committing any sector file. It catches the errors that are
// invisible on a map but fatal to the analysis.

const LAYERS = ['mining', 'refining', 'component', 'assembly', 'deployment'];
const CONF = ['sourced', 'derived', 'modelled'];

export function validate({ stages, nodes, edges }) {
  const errors = [];
  const stageIds = new Set(stages.map((s) => s.id));
  const nodeIds = new Set(nodes.map((n) => n.id));

  if (stageIds.size !== stages.length) errors.push('Duplicate stage id');
  if (nodeIds.size !== nodes.length) errors.push('Duplicate node id');

  for (const s of stages) {
    const e = (m) => errors.push(`stage ${s.id}: ${m}`);
    if (!Array.isArray(s.sectors) || !s.sectors.length) e('sectors must be a non-empty array');
    if (!LAYERS.includes(s.layer)) e(`bad layer "${s.layer}"`);
    for (const k of ['C', 'S', 'L']) {
      const max = k === 'C' ? 4 : 3;
      if (!Number.isInteger(s[k]) || s[k] < 0 || s[k] > max) e(`${k} must be integer 0-${max}`);
    }
    if (!['low', 'mid', 'high'].includes(s.costShare)) e('bad costShare');
    if (!CONF.includes(s.confidence)) e('bad confidence');
    if (s.confidence === 'sourced' && !(s.sources || []).length) e('sourced but no sources');
    // Optional. Present only where the binding concentration is firm/plant level
    // rather than country level (wind forgings, WTIVs). Where it exists, the
    // fragility score is a LOWER BOUND and the UI must say so.
    if (s.firmConcentration) {
      const f = s.firmConcentration;
      if (!(f.top3Share >= 0 && f.top3Share <= 1)) e('firmConcentration.top3Share must be 0-1');
      if (!CONF.includes(f.confidence)) e('firmConcentration: bad confidence');
      if (!f.note) e('firmConcentration: note required — explain what the constraint physically is');
    }
  }

  for (const n of nodes) {
    const e = (m) => errors.push(`node ${n.id}: ${m}`);
    if (!stageIds.has(n.stageId)) e(`unknown stageId "${n.stageId}"`);
    if (!(n.share >= 0 && n.share <= 1)) e('share must be 0-1');
    if (!['allied', 'neutral', 'exposed'].includes(n.alignment)) e('bad alignment');
    if (!CONF.includes(n.confidence)) e('bad confidence');
    if (Math.abs(n.lat) > 90 || Math.abs(n.lon) > 180) e('bad coordinates');
  }

  // Shares within a stage must not exceed 1. Catches double-counting, which is
  // the single most common error in supply-chain share data.
  const byStage = {};
  for (const n of nodes) byStage[n.stageId] = (byStage[n.stageId] || 0) + n.share;
  for (const [sid, total] of Object.entries(byStage)) {
    if (total > 1.001) errors.push(`stage ${sid}: node shares sum to ${total.toFixed(2)} (>1)`);
  }

  for (const ed of edges) {
    if (!nodeIds.has(ed.from)) errors.push(`edge: unknown from "${ed.from}"`);
    if (!nodeIds.has(ed.to)) errors.push(`edge: unknown to "${ed.to}"`);
    if (!CONF.includes(ed.confidence)) errors.push(`edge ${ed.from}->${ed.to}: bad confidence`);
  }

  return errors;
}

// --- GRAPH TRAVERSAL -------------------------------------------------------
// This is the centrepiece interaction: click a node, everything it governs
// downstream lights up. Breadth-first search. That is all it is.

export function downstream(nodeId, edges) {
  const out = new Set();
  const queue = [nodeId];
  while (queue.length) {
    const cur = queue.shift();
    for (const e of edges) {
      if (e.from === cur && !out.has(e.to)) {
        out.add(e.to);
        queue.push(e.to);
      }
    }
  }
  return out;
}

export function upstream(nodeId, edges) {
  const out = new Set();
  const queue = [nodeId];
  while (queue.length) {
    const cur = queue.shift();
    for (const e of edges) {
      if (e.to === cur && !out.has(e.from)) {
        out.add(e.from);
        queue.push(e.from);
      }
    }
  }
  return out;
}

// DEPTH — topological rank, derived from edges. Do NOT store this.
// Needed because `layer` is semantic, not ordinal: solar has four stages that
// are all legitimately 'component' (wafer -> cell -> glass -> module inputs),
// so a UI that lays out by `layer` will stack them on top of each other.
// Layout by depth; filter by layer.
export function depths(nodes, edges) {
  const rank = Object.fromEntries(nodes.map((n) => [n.id, 0]));
  // Longest-path relaxation. Terminates because the graph is acyclic.
  for (let i = 0; i < nodes.length; i++) {
    let changed = false;
    for (const e of edges) {
      if (rank[e.to] < rank[e.from] + 1) {
        rank[e.to] = rank[e.from] + 1;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return rank;
}

// Guard: a cycle would mean the chain loops (e.g. recycling). Catch it early.
export function findCycles(nodes, edges) {
  const adj = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) adj[e.from]?.push(e.to);
  const state = {};
  const bad = [];
  const walk = (id) => {
    if (state[id] === 1) { bad.push(id); return; }
    if (state[id] === 2) return;
    state[id] = 1;
    for (const nxt of adj[id] || []) walk(nxt);
    state[id] = 2;
  };
  for (const n of nodes) walk(n.id);
  return bad;
}
