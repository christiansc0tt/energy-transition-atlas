import { validate, fragility, riskType, downstream, depths, findCycles } from './data/graph/schema.js';
import ev from './data/graph/ev.js';
import solar from './data/graph/solar.js';

const sectors = { ev, solar };
let fail = false;

for (const [name, g] of Object.entries(sectors)) {
  const errs = validate(g);
  const cyc = findCycles(g.nodes, g.edges);
  if (errs.length || cyc.length) fail = true;
  console.log(`\n=== ${name.toUpperCase()} — ${g.stages.length} stages, ${g.nodes.length} nodes, ${g.edges.length} edges`);
  console.log(errs.length ? 'ERRORS:\n  ' + errs.join('\n  ') : '  valid: 0 errors');
  if (cyc.length) console.log('  CYCLE at: ' + cyc.join(', '));

  const rows = g.stages
    .map(s => ({ id: s.id, f: fragility(s.C,s.S,s.L), cs: s.costShare, r: riskType(fragility(s.C,s.S,s.L), s.costShare) }))
    .sort((a,b) => b.f - a.f).slice(0, 5);
  console.log('  top 5 fragility:');
  for (const r of rows) console.log(`    ${String(r.f).padStart(2)}  ${r.id.padEnd(22)} cost:${r.cs.padEnd(5)} ${r.r}`);
}

// cross-sector shared stages
const all = Object.values(sectors).flatMap(g => g.stages);
const shared = all.filter(s => s.sectors.length > 1);
console.log('\n=== SHARED STAGES (the cross-sector finding)');
for (const s of shared) console.log(`  ${s.id.padEnd(16)} fragility ${fragility(s.C,s.S,s.L)}  serves: ${s.sectors.join(' + ')}`);

// depth check on solar
const d = depths(solar.nodes, solar.edges);
const maxD = Math.max(...Object.values(d));
console.log(`\nSolar max depth: ${maxD}. Layout ranks derived OK.`);
console.log(`Downstream of wafer-cn: ${downstream('wafer-cn', solar.edges).size} of ${solar.nodes.length} nodes`);
console.log(`Downstream of poly-cn-xj: ${downstream('poly-cn-xj', solar.edges).size} of ${solar.nodes.length} nodes`);

process.exit(fail ? 1 : 0);
