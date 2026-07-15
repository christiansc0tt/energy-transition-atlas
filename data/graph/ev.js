// data/graph/ev.js
// EV & Battery supply chain graph.
// Shares are indicative and MUST be re-checked against IEA GEVO / USGS MCS
// before publication. Every C/S/L score is our judgement -> confidence:'modelled'.

export const stages = [
  // --- LITHIUM ---
  {
    id: 'li-mining',
    label: 'Lithium mining',
    sectors: ['ev'],
    layer: 'mining',
    material: 'lithium',
    C: 1, S: 2, L: 2, // 5
    costShare: 'mid',
    carbon: null,
    policy: ['Chile/Argentina resource nationalism', 'IRA FTA sourcing rules'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries', 'IEA Global EV Outlook'],
    notes:
      'Concentration is genuinely moderate and largely ALLIED (Australia). S=2 because ' +
      'there is no substitute for lithium in Li-ion; sodium-ion is not proven at scale. ' +
      'Fragility is structural, not geopolitical — this is the clearest case in the atlas ' +
      'for keeping alignment as a separate lens.',
  },
  {
    id: 'li-refining',
    label: 'Lithium refining (carbonate/hydroxide)',
    sectors: ['ev'],
    layer: 'refining',
    material: 'lithium',
    C: 2, S: 2, L: 1, // 5
    costShare: 'mid',
    carbon: null,
    policy: ['IRA FEOC restrictions'],
    confidence: 'modelled',
    sources: ['IEA Critical Minerals Outlook'],
    notes:
      'The mining/refining gap in miniature: Australia digs it, China converts it. ' +
      'L=1 because conversion plants are chemical engineering, not geology.',
  },

  // --- COBALT ---
  {
    id: 'co-mining',
    label: 'Cobalt mining',
    sectors: ['ev'],
    layer: 'mining',
    material: 'cobalt',
    C: 3, S: 0, L: 2, // 5
    costShare: 'low',
    carbon: null,
    policy: ['DRC export policy', 'ASM/human rights due diligence (CSDDD)'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries'],
    notes:
      'THE HEADLINE FINDING IN REVERSE. Cobalt gets the press and scores 5. S=0 because ' +
      'LFP chemistry removes cobalt entirely and is already a large share of global EV ' +
      'battery production — a substitute proven at scale TODAY, which is exactly what S=0 means. ' +
      'DRC concentration is real but it is the risk the market has already engineered around.',
  },
  {
    id: 'co-refining',
    label: 'Cobalt refining',
    sectors: ['ev'],
    layer: 'refining',
    material: 'cobalt',
    C: 3, S: 0, L: 1, // 4
    costShare: 'low',
    carbon: null,
    policy: ['IRA FEOC restrictions'],
    confidence: 'modelled',
    sources: ['IEA Critical Minerals Outlook'],
    notes: 'Higher concentration than mining, lower salience in public debate.',
  },

  // --- NICKEL ---
  {
    id: 'ni-mining',
    label: 'Nickel mining',
    sectors: ['ev'],
    layer: 'mining',
    material: 'nickel',
    C: 2, S: 1, L: 1, // 4
    costShare: 'mid',
    carbon: null,
    policy: ['Indonesia ore export ban', 'IRA FEOC'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries'],
    notes:
      'Indonesian share has risen fast and is still rising — re-check this number, it ' +
      'moves more than any other in the file. S=1: LFP avoids nickel at an energy-density cost.',
  },
  {
    id: 'ni-refining',
    label: 'Class 1 nickel refining',
    sectors: ['ev'],
    layer: 'refining',
    material: 'nickel',
    C: 2, S: 1, L: 1, // 4
    costShare: 'mid',
    carbon: {
      range: [30, 90],
      unit: 'kgCO2e/kg Ni',
      basis: 'cradle-to-gate',
      note:
        'Indonesian HPAL/NPI routes on coal-heavy captive power sit at the top of this ' +
        'range; sulphide routes at the bottom. Widest carbon spread of any EV input — ' +
        'the "geography changes LCA" example for this sector.',
    },
    policy: ['IRA FEOC'],
    confidence: 'modelled',
    sources: ['IEA Critical Minerals Outlook', 'Peer-reviewed LCA literature'],
    notes: 'Carbon range is the story here, not fragility.',
  },

  // --- GRAPHITE ---
  {
    id: 'graphite-mining',
    label: 'Natural graphite mining',
    sectors: ['ev'],
    layer: 'mining',
    material: 'graphite',
    C: 3, S: 1, L: 2, // 6
    costShare: 'low',
    carbon: null,
    policy: ['China export licensing (Dec 2023)'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries'],
    notes:
      'S=1 because synthetic graphite from needle coke bypasses mining entirely and is ' +
      'proven at scale — though China also dominates synthetic output, so the substitute ' +
      'does not reduce country exposure. Worth stating plainly on the tab.',
  },
  {
    id: 'graphite-anode',
    label: 'Battery-grade anode material (spheronised + coated)',
    sectors: ['ev'],
    layer: 'component',
    material: 'graphite-anode',
    C: 4, S: 2, L: 3, // 9  <-- joint highest in EV
    costShare: 'mid',
    carbon: null,
    policy: ['China export licensing regime (Dec 2023)', 'IRA FEOC'],
    confidence: 'modelled',
    sources: ['IEA Critical Minerals Outlook', 'Benchmark Mineral Intelligence (paywalled — cite carefully)'],
    notes:
      'THE EV CHOKEPOINT. Not cobalt. Spheronisation and coating is where the near-monopoly ' +
      'actually sits, and it is a processing step, not a deposit — so Western mining does ' +
      'nothing to fix it. L=3 because OEM qualification (12-24 months) dominates the ' +
      'timeline: you can build the plant faster than you can get the output designed in. ' +
      'S=2: silicon-dominant anodes are real but not proven at automotive scale. ' +
      'Note for the tab: LFP does NOT reduce graphite demand — LFP cells use MORE anode ' +
      'per kWh, not less. The standard "just use LFP" answer makes this exposure worse.',
  },

  // --- RARE EARTHS (SHARED WITH WIND) ---
  {
    id: 'ree-separation',
    label: 'Rare earth separation (Nd/Pr/Dy/Tb)',
    sectors: ['ev', 'wind'], // <-- the cross-sector node
    layer: 'refining',
    material: 'rare-earths',
    C: 4, S: 3, L: 2, // 9  <-- joint highest in EV
    costShare: 'low',
    carbon: null,
    policy: ['China export controls (2023, 2025 expansions)', 'EU CRMA strategic project targets'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries', 'IEA Critical Minerals Outlook'],
    notes:
      'Fragility 9 with LOW cost share = the definitive LINE-STOP node. Separated ' +
      'neodymium is a rounding error on an EV BOM and can halt the line anyway. This is ' +
      'the single best argument in the atlas for not folding cost share into fragility. ' +
      'S=3: you cannot substitute for the element itself at this stage. ' +
      'SHARED WITH WIND — this node is why the atlas exists.',
  },
  {
    id: 'ndfeb-magnet-traction',
    label: 'NdFeB traction magnets',
    sectors: ['ev'],
    layer: 'component',
    material: 'ndfeb',
    C: 3, S: 1, L: 2, // 6
    costShare: 'low',
    carbon: null,
    policy: ['China export controls on magnet technology'],
    confidence: 'modelled',
    sources: ['Adamas Intelligence', 'IEA Critical Minerals Outlook'],
    notes:
      'SCORED LOWER THAN EXPECTED, AND THE SCALE IS RIGHT. S=1 because electrically ' +
      'excited synchronous motors (BMW) and induction motors (Tesla) ship today with no ' +
      'rare earths at a modest efficiency/cost penalty. The magnet is substitutable; the ' +
      'ELEMENT upstream is not. Risk sits at ree-separation, one layer up. ' +
      'Deliberately separate from wind\'s generator magnets: same material, different ' +
      'substitutability, because direct-drive turbines have weaker alternatives.',
  },

  // --- CELL COMPONENTS ---
  {
    id: 'cam',
    label: 'Cathode active material (CAM)',
    sectors: ['ev'],
    layer: 'component',
    material: 'cam',
    C: 3, S: 1, L: 1, // 5
    costShare: 'high',
    carbon: null,
    policy: ['IRA FEOC', 'EU Battery Regulation carbon footprint declaration'],
    confidence: 'modelled',
    sources: ['IEA Global EV Outlook'],
    notes:
      'Roughly half of cell cost, and yet only fragility 5 — Korea and Japan already do ' +
      'this at scale, so it is a capital and margin problem, not a chokepoint. ' +
      'MARGIN-PRESSURE quadrant. A useful counterweight to the alarmism.',
  },
  {
    id: 'separator-electrolyte',
    label: 'Separator & electrolyte',
    sectors: ['ev'],
    layer: 'component',
    material: 'separator-electrolyte',
    C: 3, S: 1, L: 1, // 5
    costShare: 'low',
    carbon: null,
    policy: ['China export licensing on some electrolyte precursors'],
    confidence: 'modelled',
    sources: ['IEA Global EV Outlook'],
    notes: 'Quietly concentrated. Rarely discussed. Low stakes unless combined with other shocks.',
  },
  {
    id: 'cell-manufacture',
    label: 'Cell manufacture',
    sectors: ['ev'],
    layer: 'assembly',
    material: 'cell',
    C: 3, S: 0, L: 1, // 4
    costShare: 'high',
    carbon: {
      range: [40, 60],
      unit: 'kgCO2e/kWh',
      basis: 'cradle-to-gate, cell only',
      note: 'Dominated by the electricity mix of the cell plant. Highly geography-sensitive.',
    },
    policy: ['IRA 45X', 'EU Battery Regulation'],
    confidence: 'modelled',
    sources: ['IEA Global EV Outlook', 'Peer-reviewed LCA literature'],
    notes:
      'The most visible stage and one of the least fragile. Everyone can build a gigafactory; ' +
      'nobody can build a rare earth separation plant quickly. That inversion is the tab\'s thesis.',
  },

  // --- DOWNSTREAM ---
  {
    id: 'pack-assembly',
    label: 'Pack assembly',
    sectors: ['ev'],
    layer: 'assembly',
    material: 'pack',
    C: 1, S: 0, L: 0, // 1
    costShare: 'high',
    carbon: {
      range: [60, 90],
      unit: 'kgCO2e/kWh',
      basis: 'cradle-to-gate, full pack',
      note:
        'Range spans chemistry and grid mix. Carbon payback vs a comparable ICE is roughly ' +
        '1-3 years of typical EU driving — state as a range, never a point estimate.',
    },
    policy: ['EU Battery Regulation carbon footprint declaration'],
    confidence: 'modelled',
    sources: ['Peer-reviewed LCA literature'],
    notes: 'Low fragility. Included so the chain terminates honestly, not because it is interesting.',
  },
  {
    id: 'vehicle-assembly',
    label: 'Vehicle assembly',
    sectors: ['ev'],
    layer: 'deployment',
    material: 'vehicle',
    C: 1, S: 0, L: 0, // 1
    costShare: 'high',
    carbon: null,
    policy: ['Tariffs on Chinese EV imports (EU, US)'],
    confidence: 'modelled',
    sources: ['IEA Global EV Outlook'],
    notes: 'Distributed. The end of the chain, and the least of the problems.',
  },
];

export const nodes = [
  // lithium mining
  { id: 'li-mine-au', stageId: 'li-mining', country: 'AU', lat: -25.0, lon: 122.0, share: 0.48, alignment: 'allied', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'li-mine-cl', stageId: 'li-mining', country: 'CL', lat: -23.5, lon: -68.3, share: 0.24, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'li-mine-cn', stageId: 'li-mining', country: 'CN', lat: 30.5, lon: 102.0, share: 0.16, alignment: 'exposed', confidence: 'sourced', source: 'USGS MCS' },

  // lithium refining
  { id: 'li-ref-cn', stageId: 'li-refining', country: 'CN', lat: 28.7, lon: 115.9, share: 0.6, alignment: 'exposed', confidence: 'sourced', source: 'IEA CMO' },
  { id: 'li-ref-cl', stageId: 'li-refining', country: 'CL', lat: -23.5, lon: -68.3, share: 0.2, alignment: 'neutral', confidence: 'derived', source: 'IEA CMO' },

  // cobalt
  { id: 'co-mine-cd', stageId: 'co-mining', country: 'CD', lat: -10.7, lon: 25.5, share: 0.72, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'co-mine-id', stageId: 'co-mining', country: 'ID', lat: -2.5, lon: 121.5, share: 0.1, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'co-ref-cn', stageId: 'co-refining', country: 'CN', lat: 30.0, lon: 114.3, share: 0.76, alignment: 'exposed', confidence: 'sourced', source: 'IEA CMO' },

  // nickel
  { id: 'ni-mine-id', stageId: 'ni-mining', country: 'ID', lat: -2.5, lon: 121.5, share: 0.55, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'ni-ref-id', stageId: 'ni-refining', country: 'ID', lat: -2.5, lon: 121.5, share: 0.42, alignment: 'neutral', confidence: 'derived', source: 'IEA CMO' },
  { id: 'ni-ref-cn', stageId: 'ni-refining', country: 'CN', lat: 34.3, lon: 108.9, share: 0.28, alignment: 'exposed', confidence: 'derived', source: 'IEA CMO' },

  // graphite
  { id: 'gr-mine-cn', stageId: 'graphite-mining', country: 'CN', lat: 45.8, lon: 126.5, share: 0.72, alignment: 'exposed', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'gr-mine-mz', stageId: 'graphite-mining', country: 'MZ', lat: -13.0, lon: 40.5, share: 0.09, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'gr-anode-cn', stageId: 'graphite-anode', country: 'CN', lat: 41.8, lon: 123.4, share: 0.95, alignment: 'exposed', confidence: 'sourced', source: 'IEA CMO' },
  { id: 'gr-anode-jp', stageId: 'graphite-anode', country: 'JP', lat: 35.0, lon: 137.0, share: 0.03, alignment: 'allied', confidence: 'derived', source: 'IEA CMO' },

  // rare earths (shared with wind)
  { id: 'ree-sep-cn', stageId: 'ree-separation', country: 'CN', lat: 40.8, lon: 111.7, share: 0.9, alignment: 'exposed', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'ree-sep-my', stageId: 'ree-separation', country: 'MY', lat: 4.3, lon: 101.1, share: 0.06, alignment: 'allied', confidence: 'derived', source: 'USGS MCS' },
  { id: 'ndfeb-ev-cn', stageId: 'ndfeb-magnet-traction', country: 'CN', lat: 29.9, lon: 121.6, share: 0.87, alignment: 'exposed', confidence: 'sourced', source: 'Adamas Intelligence' },

  // cell components
  { id: 'cam-cn', stageId: 'cam', country: 'CN', lat: 28.2, lon: 112.9, share: 0.8, alignment: 'exposed', confidence: 'sourced', source: 'IEA GEVO' },
  { id: 'cam-kr', stageId: 'cam', country: 'KR', lat: 36.8, lon: 127.1, share: 0.12, alignment: 'allied', confidence: 'derived', source: 'IEA GEVO' },
  { id: 'sep-cn', stageId: 'separator-electrolyte', country: 'CN', lat: 31.2, lon: 121.5, share: 0.82, alignment: 'exposed', confidence: 'sourced', source: 'IEA GEVO' },

  // cells
  { id: 'cell-cn', stageId: 'cell-manufacture', country: 'CN', lat: 31.8, lon: 119.9, share: 0.76, alignment: 'exposed', confidence: 'sourced', source: 'IEA GEVO' },
  { id: 'cell-kr', stageId: 'cell-manufacture', country: 'KR', lat: 36.8, lon: 127.1, share: 0.06, alignment: 'allied', confidence: 'sourced', source: 'IEA GEVO' },
  { id: 'cell-us', stageId: 'cell-manufacture', country: 'US', lat: 36.2, lon: -86.8, share: 0.07, alignment: 'allied', confidence: 'sourced', source: 'IEA GEVO' },

  // downstream
  { id: 'pack-cn', stageId: 'pack-assembly', country: 'CN', lat: 22.5, lon: 114.1, share: 0.6, alignment: 'exposed', confidence: 'derived', source: 'IEA GEVO' },
  { id: 'pack-eu', stageId: 'pack-assembly', country: 'DE', lat: 48.8, lon: 9.2, share: 0.15, alignment: 'allied', confidence: 'derived', source: 'IEA GEVO' },
  { id: 'veh-cn', stageId: 'vehicle-assembly', country: 'CN', lat: 22.5, lon: 114.1, share: 0.6, alignment: 'exposed', confidence: 'sourced', source: 'IEA GEVO' },
  { id: 'veh-eu', stageId: 'vehicle-assembly', country: 'DE', lat: 48.8, lon: 9.2, share: 0.18, alignment: 'allied', confidence: 'sourced', source: 'IEA GEVO' },
];

export const edges = [
  // lithium
  { from: 'li-mine-au', to: 'li-ref-cn', volumeShare: 0.85, confidence: 'modelled' },
  { from: 'li-mine-cl', to: 'li-ref-cl', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'li-mine-cl', to: 'li-ref-cn', volumeShare: 0.3, confidence: 'modelled' },
  { from: 'li-mine-cn', to: 'li-ref-cn', volumeShare: 1.0, confidence: 'modelled' },
  { from: 'li-ref-cn', to: 'cam-cn', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'li-ref-cl', to: 'cam-kr', volumeShare: 0.5, confidence: 'modelled' },

  // cobalt
  { from: 'co-mine-cd', to: 'co-ref-cn', volumeShare: 0.85, confidence: 'modelled' },
  { from: 'co-mine-id', to: 'co-ref-cn', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'co-ref-cn', to: 'cam-cn', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'co-ref-cn', to: 'cam-kr', volumeShare: 0.2, confidence: 'modelled' },

  // nickel
  { from: 'ni-mine-id', to: 'ni-ref-id', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'ni-mine-id', to: 'ni-ref-cn', volumeShare: 0.3, confidence: 'modelled' },
  { from: 'ni-ref-id', to: 'cam-cn', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'ni-ref-cn', to: 'cam-cn', volumeShare: 0.9, confidence: 'modelled' },

  // graphite — the chokepoint funnel
  { from: 'gr-mine-cn', to: 'gr-anode-cn', volumeShare: 0.95, confidence: 'modelled' },
  { from: 'gr-mine-mz', to: 'gr-anode-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'gr-anode-cn', to: 'cell-cn', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'gr-anode-cn', to: 'cell-kr', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'gr-anode-cn', to: 'cell-us', volumeShare: 0.85, confidence: 'modelled' },
  { from: 'gr-anode-jp', to: 'cell-kr', volumeShare: 0.1, confidence: 'modelled' },

  // rare earths
  { from: 'ree-sep-cn', to: 'ndfeb-ev-cn', volumeShare: 0.95, confidence: 'modelled' },
  { from: 'ree-sep-my', to: 'ndfeb-ev-cn', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'ndfeb-ev-cn', to: 'veh-cn', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'ndfeb-ev-cn', to: 'veh-eu', volumeShare: 0.8, confidence: 'modelled' },

  // components -> cells
  { from: 'cam-cn', to: 'cell-cn', volumeShare: 0.85, confidence: 'modelled' },
  { from: 'cam-cn', to: 'cell-kr', volumeShare: 0.4, confidence: 'modelled' },
  { from: 'cam-kr', to: 'cell-kr', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'cam-kr', to: 'cell-us', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'sep-cn', to: 'cell-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'sep-cn', to: 'cell-kr', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'sep-cn', to: 'cell-us', volumeShare: 0.8, confidence: 'modelled' },

  // cells -> packs -> vehicles
  { from: 'cell-cn', to: 'pack-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'cell-cn', to: 'pack-eu', volumeShare: 0.4, confidence: 'modelled' },
  { from: 'cell-kr', to: 'pack-eu', volumeShare: 0.4, confidence: 'modelled' },
  { from: 'cell-us', to: 'pack-eu', volumeShare: 0.1, confidence: 'modelled' },
  { from: 'pack-cn', to: 'veh-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'pack-eu', to: 'veh-eu', volumeShare: 0.9, confidence: 'modelled' },
];

export default { stages, nodes, edges };
