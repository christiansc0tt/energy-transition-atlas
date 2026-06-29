export const ev = {
  id: 'ev',
  name: 'EV & Battery',
  icon: '🔋',
  paradox: 'Zero-emission vehicle, conflict minerals',
  subtitle: '75 kWh NMC811 battery pack — from lithium brine and cobalt mine to cell manufacture and vehicle assembly.',
  killerFact: {
    text: '<strong>70% of global cobalt</strong> is mined in the DRC, where artisanal mining involves child labour. China processes <strong>~70% of global cobalt</strong> and <strong>~60% of lithium chemicals</strong>. The battery supply chain is more geographically concentrated than the oil supply chain it is replacing — and with far fewer supplier alternatives.',
  },
  stats: [
    { value: '70%', label: 'DRC share of cobalt mining', sub: 'ASM / human rights risk', color: 'red' },
    { value: '77%', label: 'Chinese cathode active material', sub: 'NMC + LFP combined', color: 'red' },
    { value: '8–12t CO₂', label: 'Embodied carbon per 75 kWh pack', sub: 'Breakeven ~2–3 yrs (EU grid)', color: 'amber' },
  ],
  stages: [
    {
      num: 1, name: 'Mining', flag: '🇨🇩', pct: 'DRC cobalt',
      detail: '<strong>Mining:</strong> Cobalt — 70% DRC, with significant artisanal small-scale mining (ASM) involving child labour. Lithium — Chile (Atacama brine, SQM/Albemarle), Australia (hard rock, Pilbara), Argentina. The human rights and ESG exposure is concentrated at this stage. <em>Source: IEA Global EV Outlook 2024</em>',
    },
    {
      num: 2, name: 'Refining', flag: '🇨🇳', pct: '~70%',
      detail: '<strong>Refining:</strong> China processes 70% of cobalt sulphate, 60% of lithium hydroxide, and dominates natural graphite processing (94%). CATL and BYD alone represent ~50% of global cell capacity. Indonesian NiMH nickel increasingly relevant as cobalt-free LFP chemistry grows. <em>Source: IEA Global EV Outlook 2024; Benchmark Mineral Intelligence</em>',
    },
    {
      num: 3, name: 'Cathode', flag: '🇨🇳🇰🇷', pct: '~77%',
      detail: '<strong>Cathode:</strong> NMC cathode is ~65% Chinese-processed. LFP — 98% Chinese. South Korean players (POSCO, LG Energy Solution) are significant in NMC. The cathode chemistry determines which minerals are critical — LFP reduces cobalt exposure but increases lithium concentration. <em>Source: Benchmark Mineral Intelligence 2024</em>',
    },
    {
      num: 4, name: 'Cell mfg', flag: '🇨🇳', pct: '~75%',
      detail: '<strong>Cell manufacturing:</strong> ~75% of global cell capacity is Chinese (CATL, BYD, CALB, Gotion). New EU capacity (Northvolt) and US capacity (LG, Panasonic/Toyota) is coming online, but these facilities depend on Chinese cathode and graphite supply chains for at least 5–7 more years. <em>Source: BloombergNEF EV Battery Supply Chain 2024</em>',
    },
    {
      num: 5, name: 'Vehicle assembly', flag: '🌍', pct: 'Global',
      detail: '<strong>Vehicle assembly:</strong> Geographically diversified — China, Germany, USA, South Korea, Japan. The EV paradox: the most visible, brand-facing stage is the least concentrated, while the invisible upstream stages are the most concentrated. <em>Source: IEA Global EV Outlook 2024</em>',
    },
  ],
  concentration: [
    { label: 'Cobalt (mining)', pct: 73, color: 'red' },
    { label: 'Lithium (mining)', pct: 66, color: 'amber' },
    { label: 'Graphite (refining)', pct: 94, color: 'red' },
    { label: 'Nickel (refining)', pct: 58, color: 'amber' },
    { label: 'Cathode (manufacturing)', pct: 77, color: 'red' },
    { label: 'Cell capacity', pct: 75, color: 'red' },
  ],
  whyItMatters: 'The battery supply chain is <strong>more concentrated than crude oil.</strong> The top 3 oil producers hold ~40% of production; the top 3 lithium processors hold 66%. The difference: oil has decades of diversified infrastructure. Batteries do not.',
  whySource: 'IEA Critical Minerals Outlook 2024; Benchmark Mineral Intelligence',
  investmentImplication: 'Cobalt price volatility (DRC supply disruption risk) creates margin risk for NMC cathode producers. The structural shift to LFP reduces cobalt exposure but concentrates risk in Chinese cell manufacturers. EU battery regulation (CBAM, supply chain due diligence directive) creates compliance cost for any fund with EV OEM exposure.',
};

export const wind = {
  id: 'wind',
  name: 'Wind',
  icon: '🌬️',
  paradox: 'Offshore clean power, landlocked REE dependency',
  subtitle: '15 MW offshore turbine — from rare-earth mining to seabed installation. NdFeB permanent magnets and GOES electrical steel are the critical chokepoints.',
  killerFact: {
    text: 'A 15 MW direct-drive offshore turbine contains roughly <strong>3–4 tonnes of NdFeB magnets</strong>, requiring ~600 kg of neodymium and ~120 kg of dysprosium. China controls <strong>85% of global rare-earth refining</strong> and ~60% of mining. There is currently no credible western rare-earth separation facility operating at commercial scale outside China.',
  },
  stats: [
    { value: '85%', label: 'Chinese REE refining capacity', sub: 'MP Materials partial exception', color: 'red' },
    { value: '~60%', label: 'Chinese share of GOES production', sub: 'Transformer core chokepoint', color: 'amber' },
    { value: '14–20 g CO₂/kWh', label: 'Offshore wind LCA — full lifecycle', sub: 'Lowest of any generation source', color: 'green' },
  ],
  stages: [
    {
      num: 1, name: 'REE mining', flag: '🇨🇳🇦🇺', pct: '~60% CN',
      detail: '<strong>REE mining:</strong> China mines ~60% of global rare earths. Australia (Lynas, Mt Weld) and the USA (MP Materials, Mountain Pass) are significant secondary producers. However, most non-Chinese ore is shipped to China for processing — the mining concentration understates the refining concentration. <em>Source: USGS 2024</em>',
    },
    {
      num: 2, name: 'REE refining', flag: '🇨🇳', pct: '~85%',
      detail: '<strong>REE refining / separation:</strong> China refines ~85% of global rare earths, including ore imported from Australia and the USA. Lynas (Malaysia) is the only significant non-Chinese separation facility. No European REE separation facility currently operates at commercial scale. <em>Source: IEA Critical Minerals Outlook 2024</em>',
    },
    {
      num: 3, name: 'NdFeB magnets', flag: '🇨🇳', pct: '~92%',
      detail: '<strong>NdFeB magnet manufacturing:</strong> ~92% Chinese. Vacuumschmelze (Germany) and a handful of Japanese producers are the only non-Chinese suppliers, operating at a fraction of Chinese capacity. Dysprosium is essential for high-temperature performance — export-controlled by China since September 2023. <em>Source: CSIS; IEA Critical Minerals 2024</em>',
    },
    {
      num: 4, name: 'Turbine nacelle', flag: '🌍', pct: 'Global top 3: 55%',
      detail: '<strong>Turbine nacelle:</strong> More geographically diversified — Vestas (Denmark), Siemens Gamesa (Spain/Germany), GE Vernova (USA) are the western leaders. Chinese manufacturers (Goldwind, Mingyang) are significant but primarily domestic. The nacelle is not the chokepoint — the magnets inside it are. <em>Source: BloombergNEF Wind Market Outlook 2024</em>',
    },
    {
      num: 5, name: 'Installation', flag: '🌊', pct: 'Regional',
      detail: '<strong>Offshore installation:</strong> Constrained by specialist vessel availability (jack-up installation vessels, SOV support vessels). European vessel fleet is approaching capacity for planned North Sea build-out. Jones Act limits US vessel competition. GOES steel for transformer cores is a secondary constraint — ~60% Chinese. <em>Source: NREL; ORE Catapult 2024</em>',
    },
  ],
  concentration: [
    { label: 'REE mining', pct: 60, color: 'red' },
    { label: 'REE refining/separation', pct: 85, color: 'red' },
    { label: 'NdFeB magnet manufacturing', pct: 92, color: 'red' },
    { label: 'GOES (transformer steel)', pct: 60, color: 'amber' },
    { label: 'Turbine nacelles (global top 3)', pct: 55, color: 'blue' },
  ],
  whyItMatters: 'The mining–refining gap is the defining feature of REE supply chains: China mines 60% but refines 85%. The additional 25% represents ore imported from Australia and the USA — refined in China because no competitive western alternative exists. <strong>This is where the geopolitical leverage actually sits.</strong>',
  whySource: 'USGS 2024; IEA Critical Minerals Outlook 2024',
  dualUseNote: 'NdFeB magnets are used in both offshore wind generators and in electric motors for submarines, drone propulsion, and missile actuators. China\'s REE export controls (September 2023, extended) explicitly list heavy rare earths including dysprosium — essential for high-temperature magnet performance in both wind and defence applications.',
  investmentImplication: 'REE price volatility directly affects turbine manufacturer margins — Siemens Gamesa and Vestas have limited hedging options given the absence of liquid REE futures markets. GOES steel constraints are creating transformer delivery lead times of 2–3 years, a binding constraint on offshore wind connection timelines that affects project finance assumptions.',
};

export const nuclear = {
  id: 'nuclear',
  name: 'Nuclear & SMR',
  icon: '⚛️',
  paradox: 'Zero-carbon baseload, Russian enrichment dependency',
  subtitle: 'Conventional GW-scale PWR and emerging SMR (100–300 MW) — traced from uranium mining to enrichment and fuel fabrication. HALEU is the critical SMR bottleneck.',
  killerFact: {
    text: "As of 2024, Russia's ROSATOM controls approximately <strong>40% of global uranium enrichment capacity</strong> and supplies enriched uranium to ~20% of the world's operating reactors. SMRs — which tech giants are contracting to power AI data centres — require <strong>HALEU at 5–19.75% enrichment</strong>. Currently only ~5 commercial providers can supply HALEU, and western capacity is a fraction of Russian.",
  },
  stats: [
    { value: '~40%', label: "Russian share of global enrichment capacity", sub: 'Post-Ukraine supply risk', color: 'red' },
    { value: '5–19.75%', label: 'HALEU enrichment level required for most SMR designs', sub: 'vs 3–5% for conventional', color: 'amber' },
    { value: '~3–4 g CO₂/kWh', label: 'Nuclear LCA — comparable to wind', sub: 'Lowest lifecycle emitter', color: 'green' },
  ],
  stages: [
    {
      num: 1, name: 'Uranium mining', flag: '🇰🇿🇨🇦🇦🇺', pct: 'Kazakhstan 45%',
      detail: '<strong>Uranium mining:</strong> Kazakhstan (Kazatomprom) produces ~45% of global uranium, Canada and Australia are secondary. Mining is relatively diversified compared to downstream stages. The concentration risk is not at the mining stage — it is at enrichment. <em>Source: World Nuclear Association 2024</em>',
    },
    {
      num: 2, name: 'Conversion', flag: '🇨🇦🇫🇷🇷🇺', pct: '~30% RU',
      detail: '<strong>Conversion (UF₆):</strong> Uranium oxide is converted to uranium hexafluoride for enrichment. Canada (Cameco), France (Orano), Russia (ROSATOM), and the USA (ConverDyn) are the main providers. Russia holds ~30% of global conversion capacity. <em>Source: World Nuclear Association; NRC 2024</em>',
    },
    {
      num: 3, name: 'Enrichment', flag: '🇷🇺', pct: '~40% RU',
      detail: '<strong>Enrichment:</strong> ROSATOM controls ~40% of global enrichment capacity. Urenco (UK/NL/DE/US) and Orano (France) are western alternatives but cannot fully substitute at current capacity. For HALEU (SMR fuel), western capacity is negligible — Centrus Energy (USA) is the only licensed US HALEU producer, with very limited output. <em>Source: IEA; NRC; World Nuclear Association 2024</em>',
    },
    {
      num: 4, name: 'Fuel fabrication', flag: '🌍', pct: 'Regional',
      detail: '<strong>Fuel fabrication:</strong> More geographically distributed — Westinghouse (USA), Framatome (France), TVEL (Russia). SMR fuel fabrication is nascent; most SMR designs have not yet established a qualified fuel supply chain. This is a significant licensing and supply risk for near-term SMR deployment. <em>Source: NRC; DOE 2024</em>',
    },
    {
      num: 5, name: 'Reactor / SMR', flag: '🏭', pct: 'Global',
      detail: '<strong>Reactor / SMR deployment:</strong> SMR-specific materials include zirconium cladding (Russia/France dominant), hafnium control rods (France/Russia), and specific high-grade steel. Microsoft (Constellation), Amazon (X-energy), and Google (Kairos) SMR PPAs are contingent on designs that have not yet received NRC construction permits. <em>Source: DOE; NRC; company filings 2024</em>',
    },
  ],
  concentration: [
    { label: 'Uranium mining (top 3)', pct: 72, color: 'amber' },
    { label: 'Enrichment (ROSATOM)', pct: 40, color: 'red' },
    { label: 'HALEU supply (western)', pct: 5, color: 'red' },
    { label: 'Zirconium cladding (RU/FR)', pct: 65, color: 'amber' },
    { label: 'Hafnium (FR/RU)', pct: 55, color: 'amber' },
  ],
  whyItMatters: "The enrichment stage is where geopolitical exposure concentrates. Sanctioning ROSATOM would simultaneously destabilise ~20% of global reactor operations and eliminate the most accessible HALEU supply for SMR deployment. <strong>Western energy security and AI compute ambitions are both hostage to this single chokepoint.</strong>",
  whySource: 'World Nuclear Association; IEA; NRC 2024',
  smrNote: 'SMR designs require HALEU at 5–19.75% enrichment vs 3–5% for conventional reactors. The entire western HALEU production capacity (Centrus, Ohio) is measured in kg/year — SMR deployment at the scale implied by hyperscaler PPAs requires tonnes/year. This gap is the binding constraint on the SMR timeline, not reactor technology readiness.',
  investmentImplication: 'Uranium spot prices have risen ~4× since 2020 partly on ROSATOM sanction risk. HALEU scarcity creates a near-term ceiling on SMR deployment timelines that tech sector PPA announcements have not adequately priced. Urenco and Orano capacity expansion is the key supply-side variable for nuclear equity investors through 2030.',
};
