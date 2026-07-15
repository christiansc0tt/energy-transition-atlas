// data/graph/wind.js
// Wind supply chain graph. Scored for OFFSHORE unless noted — see the
// substitutability caveat on ndfeb-magnet-generator.
// 'ree-separation' lives in shared.js; edges here reference its node ids.

export const stages = [
  {
    id: 'ndfeb-magnet-generator',
    label: 'NdFeB generator magnets (direct-drive PMSG)',
    sectors: ['wind'],
    layer: 'component',
    material: 'ndfeb',
    C: 3, S: 2, L: 2, // 7
    costShare: 'low',
    carbon: null,
    policy: ['China export controls on magnet technology'],
    confidence: 'modelled',
    sources: ['Adamas Intelligence', 'IEA Critical Minerals Outlook'],
    notes:
      'THE PAIR TO EV. Identical material, identical country concentration, DIFFERENT score: ' +
      '7 here vs 6 for ev/ndfeb-magnet-traction. The gap is S. EVs have rare-earth-free ' +
      'motors shipping today (BMW EESM, Tesla induction) at a modest efficiency penalty, ' +
      'so S=1. Offshore direct-drive has a proven alternative in geared drivetrains, but ' +
      'the offshore O&M economics that killed gearboxes in the first place have not changed ' +
      '— so S=2, not 1. ' +
      'CAVEAT, STATE IT ON THE TAB: score this ONSHORE and S drops to 1 (geared is the ' +
      'incumbent) and fragility falls to 6. One substitutability score per stage does not ' +
      'hold across onshore/offshore. If a second sector shows the same split, sub-sector ' +
      'becomes a schema dimension. Do not add it for one case.',
  },
  {
    id: 'noes',
    label: 'Non-oriented electrical steel (thin-gauge)',
    sectors: ['wind'],
    layer: 'refining',
    material: 'electrical-steel',
    C: 3, S: 3, L: 1, // 7
    costShare: 'low',
    carbon: null,
    policy: ['Steel safeguards (EU)', 'Section 232 (US)'],
    confidence: 'modelled',
    sources: ['World Steel Association', 'Trade press'],
    notes:
      'TERMINOLOGY CORRECTION — this matters and the team has it wrong in the brief. ' +
      'GOES (grain-oriented) is for TRANSFORMER cores and belongs in the grid sector. ' +
      'Generators and motors use NOES (non-oriented). They are different products from ' +
      'different mills with different concentration. Conflating them is exactly the kind of ' +
      'error a steel-literate reader will spot instantly. ' +
      'S=3: there is no substitute for electrical steel in a generator core. ' +
      'High-grade thin-gauge NOES is materially more concentrated than commodity NOES; ' +
      'C=3 reflects the thin-gauge grade, not the tonnage average.',
  },
  {
    id: 'cu-refining',
    label: 'Copper refining',
    sectors: ['wind'],
    layer: 'refining',
    material: 'copper',
    C: 1, S: 1, L: 2, // 4
    costShare: 'mid',
    carbon: null,
    policy: ['Indonesia/Chile export policy'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries', 'ICSG'],
    notes:
      'Low fragility, high tonnage. Aluminium substitutes in cabling at a conductivity ' +
      'penalty (S=1). The copper story is a DEMAND story, not a concentration story — ' +
      'offshore wind is cable-intensive. Same visual treatment as solar silver: ' +
      'scenario chart, not concentration bar.',
  },
  {
    id: 'large-castings',
    label: 'Large castings (hubs, bedplates)',
    sectors: ['wind'],
    layer: 'component',
    material: 'ductile-iron',
    C: 3, S: 1, L: 1, // 5
    costShare: 'mid',
    carbon: null,
    policy: ['Anti-dumping duties on Chinese wind castings (EU)'],
    confidence: 'modelled',
    sources: ['Trade press', 'EU trade defence filings'],
    notes: 'Heavy, low-value-density, and still shipped from China. Freight economics do not save you.',
  },
  {
    id: 'forgings-bearings',
    label: 'Large forgings & main bearings',
    sectors: ['wind'],
    layer: 'component',
    material: 'forged-steel',
    C: 2, S: 1, L: 2, // 5  <-- UNDERSTATED, see firmConcentration
    costShare: 'mid',
    carbon: null,
    policy: [],
    confidence: 'modelled',
    sources: ['Trade press', 'Company disclosures'],
    firmConcentration: {
      top3Share: 0.8,
      note:
        'A handful of firms worldwide can forge and machine main bearings at 15MW+ scale. ' +
        'The binding constraint is a specific press and a specific heat-treatment furnace, ' +
        'not a country.',
      confidence: 'modelled',
    },
    notes:
      'THE SCHEMA\'S BIGGEST LIMITATION, EXPOSED. Country concentration says C=2 and ' +
      'fragility 5. That is wrong in substance and right by the rules: the concentration ' +
      'here is at FIRM and PLANT level, and fragility only measures countries. ' +
      'Fragility is a LOWER BOUND for capital-equipment stages. Say so on the methodology ' +
      'page and surface firmConcentration in the UI wherever it exists.',
  },
  {
    id: 'carbon-fibre',
    label: 'Carbon fibre (spar caps)',
    sectors: ['wind'],
    layer: 'component',
    material: 'carbon-fibre',
    C: 2, S: 1, L: 1, // 4
    costShare: 'mid',
    carbon: null,
    policy: ['Dual-use export controls on some grades'],
    confidence: 'modelled',
    sources: ['Trade press', 'Company disclosures'],
    notes:
      'S=1: glass fibre works, at a weight penalty that caps blade length. The substitute ' +
      'exists but it costs you the product roadmap. Worth a note — "substitutable" is not ' +
      '"substitutable without consequence", and the S scale only captures the first.',
  },
  {
    id: 'balsa-core',
    label: 'Balsa & PET core material',
    sectors: ['wind'],
    layer: 'component',
    material: 'core-material',
    C: 4, S: 0, L: 0, // 4
    costShare: 'low',
    carbon: null,
    policy: [],
    confidence: 'modelled',
    sources: ['Trade press', 'FAO'],
    notes:
      'Ecuador is the overwhelming source of structural balsa — concentration 4, the joint ' +
      'highest in wind, and fragility only 4. PET foam replaced balsa at scale during the ' +
      '2020-21 shortage and never fully gave it back. A monopoly that stopped mattering ' +
      'the moment someone needed it to. ' +
      'Pair this with solar-glass on the tab: the two best proofs that colouring a map by ' +
      'share alone would be actively misleading.',
  },
  {
    id: 'tower-steel',
    label: 'Tower & monopile steel',
    sectors: ['wind'],
    layer: 'component',
    material: 'steel-plate',
    C: 2, S: 0, L: 1, // 3
    costShare: 'high',
    carbon: {
      range: [1.8, 2.3],
      unit: 'tCO2e/t steel',
      basis: 'cradle-to-gate, BF-BOF route',
      note:
        'EAF/scrap route is roughly a third of this. The single biggest lever on a turbine\'s ' +
        'embodied carbon, and it has nothing to do with critical minerals. Worth saying loudly ' +
        'on a tab that is otherwise about exotic materials: the carbon is in the steel.',
    },
    policy: ['CBAM (steel)', 'EU safeguards'],
    confidence: 'modelled',
    sources: ['World Steel Association', 'Peer-reviewed LCA literature'],
    notes: 'Fragility 3, largest cost share, largest carbon. Fragility and importance are not the same axis.',
  },
  {
    id: 'wtiv',
    label: 'Installation vessels (WTIV)',
    sectors: ['wind'],
    layer: 'assembly',
    material: 'vessel',
    C: 1, S: 2, L: 3, // 6  <-- also understated, see firmConcentration
    costShare: 'mid',
    carbon: null,
    policy: ['Jones Act (US) — no compliant next-gen WTIV fleet'],
    confidence: 'modelled',
    sources: ['Trade press', '4C Offshore'],
    firmConcentration: {
      top3Share: 0.6,
      note:
        'A small global fleet of vessels can install 15MW+ turbines. The constraint is a ' +
        'physical asset with a ~3-4 year build time and a country flag, not a mine.',
      confidence: 'modelled',
    },
    notes:
      'THE PUREST NON-MINERAL CHOKEPOINT IN THE ATLAS, and country concentration is close ' +
      'to meaningless for it — vessels are mobile and flagged opportunistically. ' +
      'L=3 is doing the real work: you cannot conjure a WTIV. ' +
      'Jones Act makes this bind in the US specifically, which is a JURISDICTION-of-use ' +
      'constraint, not a jurisdiction-of-production one. The schema has no concept of that. ' +
      'Flag it; do not rebuild the schema around one node.',
  },
  {
    id: 'nacelle-assembly',
    label: 'Nacelle assembly',
    sectors: ['wind'],
    layer: 'assembly',
    material: 'nacelle',
    C: 2, S: 0, L: 1, // 3
    costShare: 'high',
    carbon: null,
    policy: ['Local content rules (India, Brazil, US)'],
    confidence: 'modelled',
    sources: ['GWEC', 'IEA Renewables'],
    notes:
      'Western OEMs (Vestas, Siemens Gamesa, GE) still hold most of the non-Chinese market ' +
      'but have been loss-making — the risk here is BALANCE SHEET, not concentration. ' +
      'The schema cannot see that at all. Say so rather than pretending fragility 3 is the ' +
      'whole answer.',
  },
  {
    id: 'wind-deployment',
    label: 'Installation & deployment',
    sectors: ['wind'],
    layer: 'deployment',
    material: 'turbine',
    C: 1, S: 0, L: 0, // 1
    costShare: 'high',
    carbon: null,
    policy: ['CfD auction design', 'Grid connection queues', 'Seabed leasing'],
    confidence: 'modelled',
    sources: ['GWEC', 'IEA Renewables'],
    notes: 'Terminates the chain.',
  },
];

export const nodes = [
  { id: 'ndfeb-wind-cn', stageId: 'ndfeb-magnet-generator', country: 'CN', lat: 29.9, lon: 121.6, share: 0.87, alignment: 'exposed', confidence: 'sourced', source: 'Adamas Intelligence' },
  { id: 'ndfeb-wind-jp', stageId: 'ndfeb-magnet-generator', country: 'JP', lat: 34.7, lon: 135.5, share: 0.08, alignment: 'allied', confidence: 'derived', source: 'Adamas Intelligence' },

  { id: 'noes-cn', stageId: 'noes', country: 'CN', lat: 31.2, lon: 121.5, share: 0.7, alignment: 'exposed', confidence: 'sourced', source: 'World Steel' },
  { id: 'noes-jp', stageId: 'noes', country: 'JP', lat: 34.7, lon: 135.5, share: 0.1, alignment: 'allied', confidence: 'derived', source: 'World Steel' },
  { id: 'noes-eu', stageId: 'noes', country: 'DE', lat: 51.2, lon: 6.8, share: 0.07, alignment: 'allied', confidence: 'derived', source: 'World Steel' },

  { id: 'cu-ref-cn', stageId: 'cu-refining', country: 'CN', lat: 30.9, lon: 117.8, share: 0.44, alignment: 'exposed', confidence: 'sourced', source: 'ICSG' },
  { id: 'cu-ref-cl', stageId: 'cu-refining', country: 'CL', lat: -33.4, lon: -70.6, share: 0.08, alignment: 'neutral', confidence: 'sourced', source: 'ICSG' },

  { id: 'cast-cn', stageId: 'large-castings', country: 'CN', lat: 36.1, lon: 120.4, share: 0.75, alignment: 'exposed', confidence: 'sourced', source: 'EU trade defence filings' },
  { id: 'cast-eu', stageId: 'large-castings', country: 'ES', lat: 43.3, lon: -2.0, share: 0.12, alignment: 'allied', confidence: 'derived', source: 'Trade press' },

  { id: 'forge-de', stageId: 'forgings-bearings', country: 'DE', lat: 51.4, lon: 7.0, share: 0.3, alignment: 'allied', confidence: 'modelled', source: 'Company disclosures' },
  { id: 'forge-cn', stageId: 'forgings-bearings', country: 'CN', lat: 41.8, lon: 123.4, share: 0.35, alignment: 'exposed', confidence: 'modelled', source: 'Company disclosures' },
  { id: 'forge-jp', stageId: 'forgings-bearings', country: 'JP', lat: 34.7, lon: 135.5, share: 0.15, alignment: 'allied', confidence: 'modelled', source: 'Company disclosures' },

  { id: 'cf-us', stageId: 'carbon-fibre', country: 'US', lat: 35.9, lon: -84.1, share: 0.25, alignment: 'allied', confidence: 'modelled', source: 'Trade press' },
  { id: 'cf-jp', stageId: 'carbon-fibre', country: 'JP', lat: 34.7, lon: 135.5, share: 0.2, alignment: 'allied', confidence: 'modelled', source: 'Trade press' },
  { id: 'cf-cn', stageId: 'carbon-fibre', country: 'CN', lat: 36.7, lon: 119.1, share: 0.3, alignment: 'exposed', confidence: 'modelled', source: 'Trade press' },

  { id: 'balsa-ec', stageId: 'balsa-core', country: 'EC', lat: -1.5, lon: -79.5, share: 0.9, alignment: 'neutral', confidence: 'sourced', source: 'FAO' },

  { id: 'steel-cn', stageId: 'tower-steel', country: 'CN', lat: 39.6, lon: 118.2, share: 0.5, alignment: 'exposed', confidence: 'derived', source: 'World Steel' },
  { id: 'steel-eu', stageId: 'tower-steel', country: 'DE', lat: 51.5, lon: 7.5, share: 0.15, alignment: 'allied', confidence: 'derived', source: 'World Steel' },
  { id: 'steel-kr', stageId: 'tower-steel', country: 'KR', lat: 36.0, lon: 129.4, share: 0.1, alignment: 'allied', confidence: 'derived', source: 'World Steel' },

  { id: 'wtiv-eu', stageId: 'wtiv', country: 'BE', lat: 51.2, lon: 3.2, share: 0.4, alignment: 'allied', confidence: 'modelled', source: '4C Offshore' },
  { id: 'wtiv-cn', stageId: 'wtiv', country: 'CN', lat: 31.2, lon: 121.5, share: 0.35, alignment: 'exposed', confidence: 'modelled', source: '4C Offshore' },

  { id: 'nac-cn', stageId: 'nacelle-assembly', country: 'CN', lat: 39.9, lon: 116.4, share: 0.55, alignment: 'exposed', confidence: 'sourced', source: 'GWEC' },
  { id: 'nac-eu', stageId: 'nacelle-assembly', country: 'DK', lat: 56.2, lon: 8.6, share: 0.25, alignment: 'allied', confidence: 'sourced', source: 'GWEC' },
  { id: 'nac-in', stageId: 'nacelle-assembly', country: 'IN', lat: 13.1, lon: 80.3, share: 0.05, alignment: 'allied', confidence: 'derived', source: 'GWEC' },

  { id: 'wind-dep-cn', stageId: 'wind-deployment', country: 'CN', lat: 35.0, lon: 105.0, share: 0.5, alignment: 'exposed', confidence: 'sourced', source: 'GWEC' },
  { id: 'wind-dep-eu', stageId: 'wind-deployment', country: 'DE', lat: 54.5, lon: 7.5, share: 0.18, alignment: 'allied', confidence: 'sourced', source: 'GWEC' },
  { id: 'wind-dep-us', stageId: 'wind-deployment', country: 'US', lat: 40.5, lon: -73.5, share: 0.08, alignment: 'allied', confidence: 'sourced', source: 'GWEC' },
];

export const edges = [
  // rare earths -> magnets  (ree-sep-* nodes live in shared.js)
  { from: 'ree-sep-cn', to: 'ndfeb-wind-cn', volumeShare: 0.95, confidence: 'modelled' },
  { from: 'ree-sep-cn', to: 'ndfeb-wind-jp', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'ree-sep-my', to: 'ndfeb-wind-jp', volumeShare: 0.3, confidence: 'modelled' },

  // magnets + electrical steel + copper -> nacelle
  { from: 'ndfeb-wind-cn', to: 'nac-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'ndfeb-wind-cn', to: 'nac-eu', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'ndfeb-wind-jp', to: 'nac-eu', volumeShare: 0.3, confidence: 'modelled' },
  { from: 'noes-cn', to: 'nac-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'noes-cn', to: 'nac-eu', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'noes-jp', to: 'nac-eu', volumeShare: 0.25, confidence: 'modelled' },
  { from: 'noes-eu', to: 'nac-eu', volumeShare: 0.25, confidence: 'modelled' },
  { from: 'cu-ref-cn', to: 'nac-cn', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'cu-ref-cn', to: 'nac-eu', volumeShare: 0.4, confidence: 'modelled' },
  { from: 'cu-ref-cl', to: 'nac-eu', volumeShare: 0.3, confidence: 'modelled' },

  // castings, forgings -> nacelle
  { from: 'cast-cn', to: 'nac-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'cast-cn', to: 'nac-eu', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'cast-eu', to: 'nac-eu', volumeShare: 0.4, confidence: 'modelled' },
  { from: 'forge-cn', to: 'nac-cn', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'forge-de', to: 'nac-eu', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'forge-jp', to: 'nac-eu', volumeShare: 0.2, confidence: 'modelled' },

  // blades: carbon fibre + core -> nacelle (blade sets travel with the turbine)
  { from: 'cf-cn', to: 'nac-cn', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'cf-us', to: 'nac-eu', volumeShare: 0.4, confidence: 'modelled' },
  { from: 'cf-jp', to: 'nac-eu', volumeShare: 0.3, confidence: 'modelled' },
  { from: 'balsa-ec', to: 'nac-cn', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'balsa-ec', to: 'nac-eu', volumeShare: 0.5, confidence: 'modelled' },

  // tower steel -> deployment (towers ship separately, not via nacelle)
  { from: 'steel-cn', to: 'wind-dep-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'steel-eu', to: 'wind-dep-eu', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'steel-kr', to: 'wind-dep-us', volumeShare: 0.3, confidence: 'modelled' },

  // nacelle + vessels -> deployment
  { from: 'nac-cn', to: 'wind-dep-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'nac-eu', to: 'wind-dep-eu', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'nac-eu', to: 'wind-dep-us', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'nac-in', to: 'wind-dep-us', volumeShare: 0.1, confidence: 'modelled' },
  { from: 'wtiv-eu', to: 'wind-dep-eu', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'wtiv-eu', to: 'wind-dep-us', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'wtiv-cn', to: 'wind-dep-cn', volumeShare: 0.9, confidence: 'modelled' },
];

export default { stages, nodes, edges };
