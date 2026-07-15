import { validate, findCycles, depths } from './data/graph/schema.js';
import { graph, scored, sharedStages, SECTORS, forSector, downstreamOf, nodes } from './data/graph/index.js';

const errs = validate(graph);
const cyc = findCycles(graph.nodes, graph.edges);
console.log(`MERGED GRAPH — ${graph.stages.length} stages, ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
console.log(errs.length ? 'ERRORS:\n  ' + errs.join('\n  ') : '  valid: 0 errors');
console.log(cyc.length ? '  CYCLE at: ' + cyc.join(', ') : '  acyclic: ok');

for (const sec of SECTORS) {
  const g = forSector(sec);
  console.log(`\n=== ${sec.toUpperCase()} — ${g.stages.length} stages, ${g.nodes.length} nodes, depth ${Math.max(...Object.values(g.depths))}`);
  for (const s of [...g.stages].sort((a,b)=>b.fragility-a.fragility).slice(0,4))
    console.log(`   ${String(s.fragility).padStart(2)}  ${s.id.padEnd(24)} ${s.costShare.padEnd(5)} ${s.riskType}${s.firmConcentration ? '  [LOWER BOUND: firm-level]' : ''}`);
}

console.log('\n=== SHARED STAGES');
for (const s of sharedStages) console.log(`  ${String(s.fragility).padStart(2)}  ${s.id.padEnd(18)} ${s.sectors.join(' + ')}`);

console.log('\n=== BLAST RADIUS (cross-sector, from the merged graph)');
for (const id of ['ree-sep-cn','gr-anode-cn','wafer-cn']) {
  const d = downstreamOf(id);
  console.log(`  ${id.padEnd(12)} -> ${String(d.size).padStart(2)} of ${nodes.length} nodes`);
}

console.log('\n=== FRAGILITY >= 7, ALL SECTORS');
for (const s of scored.filter(s=>s.fragility>=7).sort((a,b)=>b.fragility-a.fragility))
  console.log(`  ${String(s.fragility).padStart(2)}  ${s.id.padEnd(24)} ${s.riskType.padEnd(12)} ${s.sectors.join('+')}`);

process.exit(errs.length || cyc.length ? 1 : 0);
