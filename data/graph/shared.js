// data/graph/shared.js
// ---------------------------------------------------------------------------
// STAGES THAT SERVE MORE THAN ONE SECTOR.
//
// These live here and NOWHERE ELSE. A shared stage duplicated into two sector
// files is two sources of truth, and they will drift the first time someone
// re-scores one and forgets the other.
//
// Sector files may reference these node ids in their edges. index.js merges
// everything into one graph; a sector view is a FILTER on that graph, not a
// separate graph. That is the whole architecture.
// ---------------------------------------------------------------------------

export const stages = [
  {
    id: 'ree-separation',
    label: 'Rare earth separation (Nd/Pr/Dy/Tb)',
    sectors: ['ev', 'wind'],
    layer: 'refining',
    material: 'rare-earths',
    C: 4, S: 3, L: 2, // 9
    costShare: 'low',
    carbon: null,
    policy: ['China export controls (2023, 2025 expansions)', 'EU CRMA strategic projects'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries', 'IEA Critical Minerals Outlook'],
    notes:
      'THE ATLAS\'S CENTRAL NODE. Fragility 9, cost share LOW = the definitive line-stop. ' +
      'Separated neodymium is a rounding error on the bill of materials of both an EV and ' +
      'a wind turbine, and it can halt both production lines. This single fact is the best ' +
      'argument for keeping cost share out of the fragility score. ' +
      'S=3: you cannot substitute for an element. Substitution happens DOWNSTREAM, at the ' +
      'magnet, and it happens differently in each sector — which is why the magnet stages ' +
      'are split by sector and this one is not.',
  },
  {
    id: 'hpq-mining',
    label: 'High-purity quartz (crucible grade)',
    sectors: ['solar', 'ai-hardware'],
    layer: 'mining',
    material: 'high-purity-quartz',
    C: 3, S: 2, L: 2, // 7
    costShare: 'low',
    carbon: null,
    policy: ['No export controls — this exposure is geological, not political'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries', 'Trade press — CONTESTED, see notes'],
    notes:
      'CONTESTED — FLAG ON THE TAB. Crucible-grade quartz is heavily associated with Spruce ' +
      'Pine, North Carolina. The monopoly framing is repeated constantly in trade press and ' +
      'disputed just as often: Norway, Russia and China have deposits, and the binding ' +
      'constraint is grade and processing know-how, not the presence of rock. Scored C=3 ' +
      'not C=4 deliberately — the evidence does not support monopoly. ' +
      'ALLIED and still fragility 7: the cleanest proof in the atlas that concentration risk ' +
      'is not geopolitical risk. A hurricane is not a trade war.',
  },
  {
    id: 'inverter',
    label: 'Inverters / power electronics',
    sectors: ['solar', 'grid'],
    layer: 'component',
    material: 'power-electronics',
    C: 3, S: 0, L: 0, // 3
    costShare: 'mid',
    carbon: null,
    policy: ['US/EU scrutiny of Chinese inverters on grid-security grounds'],
    confidence: 'modelled',
    sources: ['IEA Solar PV Global Supply Chains'],
    notes:
      'Low fragility, but the only node so far whose risk is CYBER rather than materials. ' +
      'The schema has no field for that and should not grow one for a single case — ' +
      'flag it in notes. If a second cyber node appears, revisit.',
  },
];

export const nodes = [
  { id: 'ree-sep-cn', stageId: 'ree-separation', country: 'CN', lat: 40.8, lon: 111.7, share: 0.9, alignment: 'exposed', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'ree-sep-my', stageId: 'ree-separation', country: 'MY', lat: 4.3, lon: 101.1, share: 0.06, alignment: 'allied', confidence: 'derived', source: 'USGS MCS' },

  { id: 'hpq-us', stageId: 'hpq-mining', country: 'US', lat: 35.9, lon: -82.1, share: 0.7, alignment: 'allied', confidence: 'modelled', source: 'Trade press — contested' },
  { id: 'hpq-no', stageId: 'hpq-mining', country: 'NO', lat: 58.3, lon: 8.6, share: 0.1, alignment: 'allied', confidence: 'modelled', source: 'Trade press — contested' },

  { id: 'inv-cn', stageId: 'inverter', country: 'CN', lat: 36.7, lon: 117.0, share: 0.7, alignment: 'exposed', confidence: 'sourced', source: 'IEA Solar PV GSC' },
  { id: 'inv-eu', stageId: 'inverter', country: 'DE', lat: 51.2, lon: 9.5, share: 0.1, alignment: 'allied', confidence: 'derived', source: 'IEA Solar PV GSC' },
];

export default { stages, nodes, edges: [] };
