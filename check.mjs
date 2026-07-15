import { validate, fragility, riskType, downstream } from './data/graph/schema.js';
import ev from './data/graph/ev.js';

const errs = validate(ev);
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'Schema valid: 0 errors');
console.log(`\n${ev.stages.length} stages, ${ev.nodes.length} nodes, ${ev.edges.length} edges\n`);

const rows = ev.stages
  .map(s => ({ id: s.id, f: fragility(s.C,s.S,s.L), cs: s.costShare, r: riskType(fragility(s.C,s.S,s.L), s.costShare) }))
  .sort((a,b) => b.f - a.f);
console.log('FRAGILITY RANKING');
for (const r of rows) console.log(`  ${String(r.f).padStart(2)}  ${r.id.padEnd(24)} cost:${r.cs.padEnd(5)} ${r.r}`);

const d = downstream('gr-anode-cn', ev.edges);
console.log(`\nDownstream of gr-anode-cn: ${d.size} nodes -> ${[...d].join(', ')}`);
const d2 = downstream('ree-sep-cn', ev.edges);
console.log(`Downstream of ree-sep-cn: ${d2.size} nodes -> ${[...d2].join(', ')}`);
