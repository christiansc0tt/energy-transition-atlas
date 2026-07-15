// data/graph/solar.js
// Solar PV (crystalline silicon) supply chain graph.
// Shares indicative — re-check against IEA "Solar PV Global Supply Chains" and
// BNEF before publication. All C/S/L scores are judgement -> confidence:'modelled'.

export const stages = [
  // --- UPSTREAM SILICON ---
  {
    id: 'hpq-mining',
    label: 'High-purity quartz (crucible grade)',
    sectors: ['solar', 'ai-hardware'], // <-- shared: semiconductor wafers need the same crucibles
    layer: 'mining',
    material: 'high-purity-quartz',
    C: 3, S: 2, L: 2, // 7
    costShare: 'low',
    carbon: null,
    policy: ['No export controls — the exposure is geological, not political'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries', 'Trade press — CONTESTED, see notes'],
    notes:
      'CONTESTED — FLAG THIS ON THE TAB. Crucible-grade quartz is heavily associated with ' +
      'Spruce Pine, North Carolina. The near-monopoly framing is widely repeated in trade ' +
      'press and just as widely disputed: Norway, Russia and China have deposits, and the ' +
      'binding question is grade and processing know-how, not the presence of rock. ' +
      'We score C=3 not C=4 deliberately — the evidence does not support monopoly. ' +
      'Give a range, do not repeat the headline uncritically. ' +
      'ANALYTICALLY IMPORTANT: this node is ALLIED and still fragility 7. It is the cleanest ' +
      'proof in the atlas that concentration risk is not the same as geopolitical risk, ' +
      'and the reason alignment is a separate filter rather than part of the score. ' +
      'A hurricane is not a trade war and the map should not colour them the same.',
  },
  {
    id: 'mg-si',
    label: 'Metallurgical-grade silicon',
    sectors: ['solar'],
    layer: 'refining',
    material: 'silicon',
    C: 3, S: 3, L: 1, // 7
    costShare: 'low',
    carbon: {
      range: [5, 12],
      unit: 'kgCO2e/kg Si',
      basis: 'cradle-to-gate',
      note: 'Submerged arc furnace — electricity-intensive, so grid mix dominates.',
    },
    policy: ['US Section 232 / AD-CVD on silicon metal'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries'],
    notes: 'S=3: there is no substitute for silicon in a silicon cell. The chain has no way around this.',
  },
  {
    id: 'polysilicon',
    label: 'Polysilicon (solar grade)',
    sectors: ['solar'],
    layer: 'refining',
    material: 'polysilicon',
    C: 4, S: 2, L: 2, // 8
    costShare: 'mid',
    carbon: {
      range: [25, 90],
      unit: 'kgCO2e/kg polysilicon',
      basis: 'cradle-to-gate',
      note:
        'THE WORKED LCA EXAMPLE FOR THE WHOLE ATLAS. Siemens process is ~50-150 kWh/kg. ' +
        'Run it on Xinjiang coal and you sit at the top of the range; run it on Norwegian ' +
        'hydro and you sit near the bottom. Same process, same product, ~3x the carbon. ' +
        'Geography, not technology, is doing the work. Use this on the methodology page.',
    },
    policy: ['UFLPA (US) — Xinjiang import presumption', 'EU FSR', 'CBAM (indirect)'],
    confidence: 'modelled',
    sources: ['IEA Solar PV Global Supply Chains', 'Peer-reviewed LCA literature'],
    notes:
      'S=2: thin-film (CdTe) avoids polysilicon entirely and is proven at scale — but at a ' +
      'few percent of the market it cannot absorb a c-Si shock on any relevant timescale. ' +
      '"A substitute exists" and "a substitute could take the load" are different claims. ' +
      'The S scale is deliberately about the second.',
  },

  // --- WAFER: THE CHOKEPOINT ---
  {
    id: 'ingot-wafer',
    label: 'Ingot growth & wafering',
    sectors: ['solar'],
    layer: 'component',
    material: 'wafer',
    C: 4, S: 2, L: 2, // 8
    costShare: 'mid',
    carbon: {
      range: [15, 45],
      unit: 'kgCO2e/wafer-equivalent kg',
      basis: 'cradle-to-gate',
      note: 'Czochralski pulling is electricity-intensive; grid mix again dominates.',
    },
    policy: ['China export controls on large-diameter wafer technology (2023 catalogue)'],
    confidence: 'modelled',
    sources: ['IEA Solar PV Global Supply Chains'],
    notes:
      'THE SOLAR CHOKEPOINT, and it is tighter than polysilicon. ~97% China — the most ' +
      'concentrated single stage anywhere in this atlas, EV graphite anode included. ' +
      'Barely discussed outside specialist coverage because the public conversation ' +
      'stops at "modules" and occasionally reaches "polysilicon". ' +
      'Note the export-control asymmetry: China restricts the TECHNOLOGY, not the product. ' +
      'You can buy all the wafers you want. You cannot buy the ability to make them. ' +
      'That is a different shock shape from graphite and the simulator must model it differently.',
  },
  {
    id: 'cell',
    label: 'Cell manufacture',
    sectors: ['solar'],
    layer: 'component',
    material: 'cell',
    C: 3, S: 1, L: 1, // 5
    costShare: 'mid',
    carbon: null,
    policy: ['AD-CVD (US)', 'India ALMM'],
    confidence: 'modelled',
    sources: ['IEA Solar PV Global Supply Chains'],
    notes: 'Replicable. India and SE Asia are already doing it. Capital, not chokepoint.',
  },

  // --- NON-SILICON INPUTS ---
  {
    id: 'silver-mining',
    label: 'Silver mining',
    sectors: ['solar'],
    layer: 'mining',
    material: 'silver',
    C: 1, S: 1, L: 1, // 3
    costShare: 'mid',
    carbon: null,
    policy: ['Mexico mining concession reform'],
    confidence: 'modelled',
    sources: ['USGS Mineral Commodity Summaries', 'Silver Institute'],
    notes:
      'Fragility 3 — genuinely distributed, and largely a by-product of lead/zinc mining, ' +
      'which means supply is inelastic to the silver price. The interesting story is DEMAND, ' +
      'not concentration: solar has gone from a rounding error to a large slice of industrial ' +
      'silver demand, and TOPCon/HJT cells use MORE silver per watt than PERC. ' +
      'This is the one node where the atlas should show a demand-scenario chart rather than ' +
      'a concentration bar. Copper metallisation is the S=1 escape route.',
  },
  {
    id: 'solar-glass',
    label: 'Solar glass',
    sectors: ['solar'],
    layer: 'component',
    material: 'glass',
    C: 4, S: 1, L: 0, // 5
    costShare: 'low',
    carbon: null,
    policy: ['China capacity controls on flat glass'],
    confidence: 'modelled',
    sources: ['IEA Solar PV Global Supply Chains'],
    notes:
      'A useful counter-example: ~90% concentration and fragility only 5, because float ' +
      'glass furnaces are ~18 months and no one has a monopoly on knowing how to melt sand. ' +
      'High concentration, low fragility. Proof the map should not simply colour by share.',
  },
  {
    id: 'module',
    label: 'Module assembly',
    sectors: ['solar'],
    layer: 'assembly',
    material: 'module',
    C: 3, S: 0, L: 0, // 3
    costShare: 'high',
    carbon: {
      range: [400, 800],
      unit: 'kgCO2e/kW',
      basis: 'cradle-to-gate, full module',
      note:
        'Carbon payback ~0.5-2 years depending on module carbon intensity and deployment ' +
        'grid. A Xinjiang-made module on a French grid pays back far slower than the ' +
        'headline "under a year" figure. Never quote a single number.',
    },
    policy: ['Tariffs (US, EU under discussion)', 'EU Net-Zero Industry Act'],
    confidence: 'modelled',
    sources: ['IEA Solar PV Global Supply Chains', 'Peer-reviewed LCA literature'],
    notes:
      'The stage every politician announces a factory for, and the least fragile in the chain. ' +
      'Module assembly without wafer access is import substitution with extra steps.',
  },
  {
    id: 'inverter',
    label: 'Inverters',
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
      'Low fragility, but the only node in the solar chain with a CYBER/grid-security ' +
      'dimension rather than a materials one. The schema has no field for this and ' +
      'probably should not — flag it in notes and move on.',
  },
  {
    id: 'deployment',
    label: 'Installation & deployment',
    sectors: ['solar'],
    layer: 'deployment',
    material: 'system',
    C: 0, S: 0, L: 0, // 0
    costShare: 'high',
    carbon: null,
    policy: ['Local permitting', 'Grid connection queues'],
    confidence: 'modelled',
    sources: ['IEA Renewables'],
    notes: 'Fully distributed. Terminates the chain.',
  },
];

export const nodes = [
  { id: 'hpq-us', stageId: 'hpq-mining', country: 'US', lat: 35.9, lon: -82.1, share: 0.7, alignment: 'allied', confidence: 'modelled', source: 'Trade press — contested' },
  { id: 'hpq-no', stageId: 'hpq-mining', country: 'NO', lat: 58.3, lon: 8.6, share: 0.1, alignment: 'allied', confidence: 'modelled', source: 'Trade press — contested' },

  { id: 'mgsi-cn', stageId: 'mg-si', country: 'CN', lat: 26.6, lon: 101.7, share: 0.78, alignment: 'exposed', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'mgsi-br', stageId: 'mg-si', country: 'BR', lat: -19.9, lon: -44.0, share: 0.05, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'mgsi-no', stageId: 'mg-si', country: 'NO', lat: 61.0, lon: 7.0, share: 0.04, alignment: 'allied', confidence: 'sourced', source: 'USGS MCS' },

  { id: 'poly-cn-xj', stageId: 'polysilicon', country: 'CN', lat: 44.0, lon: 87.6, share: 0.45, alignment: 'exposed', confidence: 'sourced', source: 'IEA Solar PV GSC' },
  { id: 'poly-cn-other', stageId: 'polysilicon', country: 'CN', lat: 36.6, lon: 101.8, share: 0.48, alignment: 'exposed', confidence: 'derived', source: 'IEA Solar PV GSC' },
  { id: 'poly-de', stageId: 'polysilicon', country: 'DE', lat: 51.9, lon: 13.5, share: 0.03, alignment: 'allied', confidence: 'sourced', source: 'IEA Solar PV GSC' },
  { id: 'poly-us', stageId: 'polysilicon', country: 'US', lat: 47.1, lon: -119.3, share: 0.02, alignment: 'allied', confidence: 'sourced', source: 'IEA Solar PV GSC' },

  { id: 'wafer-cn', stageId: 'ingot-wafer', country: 'CN', lat: 34.3, lon: 108.9, share: 0.97, alignment: 'exposed', confidence: 'sourced', source: 'IEA Solar PV GSC' },
  { id: 'wafer-other', stageId: 'ingot-wafer', country: 'VN', lat: 21.0, lon: 105.8, share: 0.02, alignment: 'neutral', confidence: 'derived', source: 'IEA Solar PV GSC' },

  { id: 'cell-cn', stageId: 'cell', country: 'CN', lat: 31.3, lon: 120.6, share: 0.85, alignment: 'exposed', confidence: 'sourced', source: 'IEA Solar PV GSC' },
  { id: 'cell-sea', stageId: 'cell', country: 'VN', lat: 21.0, lon: 105.8, share: 0.08, alignment: 'neutral', confidence: 'derived', source: 'IEA Solar PV GSC' },
  { id: 'cell-in', stageId: 'cell', country: 'IN', lat: 22.3, lon: 70.8, share: 0.04, alignment: 'allied', confidence: 'derived', source: 'IEA Solar PV GSC' },

  { id: 'ag-mine-mx', stageId: 'silver-mining', country: 'MX', lat: 23.6, lon: -102.5, share: 0.24, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'ag-mine-cn', stageId: 'silver-mining', country: 'CN', lat: 34.3, lon: 108.9, share: 0.14, alignment: 'exposed', confidence: 'sourced', source: 'USGS MCS' },
  { id: 'ag-mine-pe', stageId: 'silver-mining', country: 'PE', lat: -12.0, lon: -75.2, share: 0.13, alignment: 'neutral', confidence: 'sourced', source: 'USGS MCS' },

  { id: 'glass-cn', stageId: 'solar-glass', country: 'CN', lat: 31.8, lon: 117.2, share: 0.9, alignment: 'exposed', confidence: 'sourced', source: 'IEA Solar PV GSC' },

  { id: 'mod-cn', stageId: 'module', country: 'CN', lat: 31.3, lon: 120.6, share: 0.8, alignment: 'exposed', confidence: 'sourced', source: 'IEA Solar PV GSC' },
  { id: 'mod-sea', stageId: 'module', country: 'VN', lat: 21.0, lon: 105.8, share: 0.09, alignment: 'neutral', confidence: 'derived', source: 'IEA Solar PV GSC' },
  { id: 'mod-in', stageId: 'module', country: 'IN', lat: 22.3, lon: 70.8, share: 0.05, alignment: 'allied', confidence: 'derived', source: 'IEA Solar PV GSC' },
  { id: 'mod-us', stageId: 'module', country: 'US', lat: 33.4, lon: -111.9, share: 0.04, alignment: 'allied', confidence: 'derived', source: 'IEA Solar PV GSC' },

  { id: 'inv-cn', stageId: 'inverter', country: 'CN', lat: 36.7, lon: 117.0, share: 0.7, alignment: 'exposed', confidence: 'sourced', source: 'IEA Solar PV GSC' },
  { id: 'inv-eu', stageId: 'inverter', country: 'DE', lat: 51.2, lon: 9.5, share: 0.1, alignment: 'allied', confidence: 'derived', source: 'IEA Solar PV GSC' },

  { id: 'deploy-cn', stageId: 'deployment', country: 'CN', lat: 35.0, lon: 105.0, share: 0.4, alignment: 'exposed', confidence: 'sourced', source: 'IEA Renewables' },
  { id: 'deploy-eu', stageId: 'deployment', country: 'DE', lat: 51.2, lon: 9.5, share: 0.15, alignment: 'allied', confidence: 'sourced', source: 'IEA Renewables' },
  { id: 'deploy-us', stageId: 'deployment', country: 'US', lat: 39.0, lon: -98.0, share: 0.12, alignment: 'allied', confidence: 'sourced', source: 'IEA Renewables' },
];

export const edges = [
  // quartz -> crucibles -> ingot (note: HPQ feeds ingot growth directly, NOT polysilicon)
  { from: 'hpq-us', to: 'wafer-cn', volumeShare: 0.7, confidence: 'modelled' },
  { from: 'hpq-no', to: 'wafer-cn', volumeShare: 0.1, confidence: 'modelled' },

  // silicon chain
  { from: 'mgsi-cn', to: 'poly-cn-xj', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'mgsi-cn', to: 'poly-cn-other', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'mgsi-br', to: 'poly-de', volumeShare: 0.4, confidence: 'modelled' },
  { from: 'mgsi-no', to: 'poly-de', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'mgsi-no', to: 'poly-us', volumeShare: 0.3, confidence: 'modelled' },

  { from: 'poly-cn-xj', to: 'wafer-cn', volumeShare: 0.95, confidence: 'modelled' },
  { from: 'poly-cn-other', to: 'wafer-cn', volumeShare: 0.95, confidence: 'modelled' },
  { from: 'poly-de', to: 'wafer-cn', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'poly-de', to: 'wafer-other', volumeShare: 0.3, confidence: 'modelled' },
  { from: 'poly-us', to: 'wafer-other', volumeShare: 0.5, confidence: 'modelled' },

  { from: 'wafer-cn', to: 'cell-cn', volumeShare: 0.85, confidence: 'modelled' },
  { from: 'wafer-cn', to: 'cell-sea', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'wafer-cn', to: 'cell-in', volumeShare: 0.85, confidence: 'modelled' },
  { from: 'wafer-other', to: 'cell-sea', volumeShare: 0.1, confidence: 'modelled' },

  // silver -> cell (metallisation paste)
  { from: 'ag-mine-mx', to: 'cell-cn', volumeShare: 0.3, confidence: 'modelled' },
  { from: 'ag-mine-cn', to: 'cell-cn', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'ag-mine-pe', to: 'cell-cn', volumeShare: 0.3, confidence: 'modelled' },

  // cell + glass -> module
  { from: 'cell-cn', to: 'mod-cn', volumeShare: 0.85, confidence: 'modelled' },
  { from: 'cell-cn', to: 'mod-sea', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'cell-cn', to: 'mod-us', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'cell-sea', to: 'mod-sea', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'cell-in', to: 'mod-in', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'glass-cn', to: 'mod-cn', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'glass-cn', to: 'mod-sea', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'glass-cn', to: 'mod-us', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'glass-cn', to: 'mod-in', volumeShare: 0.8, confidence: 'modelled' },

  // module + inverter -> deployment
  { from: 'mod-cn', to: 'deploy-cn', volumeShare: 0.5, confidence: 'modelled' },
  { from: 'mod-cn', to: 'deploy-eu', volumeShare: 0.9, confidence: 'modelled' },
  { from: 'mod-sea', to: 'deploy-us', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'mod-us', to: 'deploy-us', volumeShare: 0.3, confidence: 'modelled' },
  { from: 'mod-in', to: 'deploy-us', volumeShare: 0.1, confidence: 'modelled' },
  { from: 'inv-cn', to: 'deploy-cn', volumeShare: 0.8, confidence: 'modelled' },
  { from: 'inv-cn', to: 'deploy-eu', volumeShare: 0.6, confidence: 'modelled' },
  { from: 'inv-eu', to: 'deploy-eu', volumeShare: 0.4, confidence: 'modelled' },
];

export default { stages, nodes, edges };
