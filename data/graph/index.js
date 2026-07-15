// data/graph/index.js
// ---------------------------------------------------------------------------
// ONE GRAPH. A sector view is a FILTER on it, not a separate graph.
// This is the architectural decision the shared nodes forced, and it is the
// right one: it means the cross-sector view is free rather than bolted on.
// ---------------------------------------------------------------------------

import shared from './shared.js';
import ev from './ev.js';
import solar from './solar.js';
import wind from './wind.js';
import { fragility, riskType, downstream, upstream, depths } from './schema.js';

const parts = [shared, ev, solar, wind];

// Merge by id. shared.js is first, so it always wins — a sector file can never
// silently shadow a shared stage.
//
// A duplicate id that is NOT a shared stage is a BUG, not a merge. Solar's PV
// cell and EV's battery cell both wanted the id 'cell-cn'; the old silent
// dedupe kept one and quietly repointed the other sector's edges at it. The
// graph validated clean the whole time. Collisions are now fatal.
const merge = (arr, sharedIds) => {
  const out = new Map();
  for (const x of arr) {
    if (out.has(x.id) && !sharedIds.has(x.id)) {
      throw new Error(
        `Duplicate id "${x.id}" across sector files. Ids are global — namespace it ` +
        `(e.g. "pv-cell-cn" vs "cell-cn"), or move it to shared.js if it is genuinely one thing.`
      );
    }
    if (!out.has(x.id)) out.set(x.id, x);
  }
  return [...out.values()];
};

const sharedStageIds = new Set(shared.stages.map((s) => s.id));
const sharedNodeIds = new Set(shared.nodes.map((n) => n.id));

export const stages = merge(parts.flatMap((p) => p.stages), sharedStageIds);
export const nodes = merge(parts.flatMap((p) => p.nodes), sharedNodeIds);
export const edges = parts.flatMap((p) => p.edges);

export const graph = { stages, nodes, edges };

export const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));
export const nodeById = Object.fromEntries(nodes.map((n) => [n.id, n]));

// Enriched stage records: fragility and risk type computed once, not in the UI.
export const scored = stages.map((s) => ({
  ...s,
  fragility: fragility(s.C, s.S, s.L),
  riskType: riskType(fragility(s.C, s.S, s.L), s.costShare),
}));
export const scoredById = Object.fromEntries(scored.map((s) => [s.id, s]));

export const SECTORS = ['ev', 'solar', 'wind']; // add as built

// A sector view. Nodes whose stage serves the sector, plus edges between them.
export function forSector(sector) {
  const sStages = scored.filter((s) => s.sectors.includes(sector));
  const ids = new Set(sStages.map((s) => s.id));
  const sNodes = nodes.filter((n) => ids.has(n.stageId));
  const nodeIds = new Set(sNodes.map((n) => n.id));
  const sEdges = edges.filter((e) => nodeIds.has(e.from) && nodeIds.has(e.to));
  return { stages: sStages, nodes: sNodes, edges: sEdges, depths: depths(sNodes, sEdges) };
}

// Stages serving more than one sector. The atlas's reason to exist.
export const sharedStages = scored
  .filter((s) => s.sectors.length > 1)
  .sort((a, b) => b.fragility - a.fragility);

// Map helpers — the whole centrepiece interaction.
export const downstreamOf = (nodeId) => downstream(nodeId, edges);
export const upstreamOf = (nodeId) => upstream(nodeId, edges);

// Node fragility inherits from its stage. Colour the map with this.
export const nodeFragility = (nodeId) => scoredById[nodeById[nodeId]?.stageId]?.fragility ?? 0;

export default graph;
