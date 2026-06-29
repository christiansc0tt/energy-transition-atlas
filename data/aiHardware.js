export const aiHardware = {
  id: 'ai',
  name: 'AI Hardware',
  icon: '🖥️',
  paradox: 'Digital infrastructure, contested minerals',
  subtitle: 'A 400W GPU server rack — traced from gallium arsenide wafers to data-centre deployment. The minerals powering AI compute also appear in F-35 radar systems and missile guidance.',
  dualUse: true,
  killerFact: {
    text: 'China imposed export controls on <strong>gallium and germanium in July 2023</strong> — materials essential to GaAs RF chips, SiC power semiconductors, and infrared optics. China produces <strong>80% of global gallium</strong> and <strong>60% of germanium</strong>. The same minerals enable both AI accelerators and anti-drone missile guidance systems.',
  },
  stats: [
    { value: '80%', label: 'Chinese gallium production', sub: 'Export controls since Aug 2023', color: 'red' },
    { value: '92%', label: 'Advanced chip packaging in Taiwan & South Korea', sub: 'CoWoS, HBM supply risk', color: 'red' },
    { value: '~1.5 TWh', label: 'Global data centre power demand by 2026', sub: 'SMR deals: MSFT, AMZN, GOOG', color: 'amber' },
  ],
  stages: [
    {
      num: 1, name: 'Mining', flag: '⛏️', pct: 'Global',
      detail: '<strong>Mining:</strong> Gallium is a byproduct of aluminium (bauxite) and zinc smelting — no primary gallium mines exist. Supply is entirely co-product dependent. China extracts ~80% of global output from its aluminium processing industry. Germanium is similarly a zinc-smelting byproduct. <em>Source: USGS 2024</em>',
    },
    {
      num: 2, name: 'Refining', flag: '🇨🇳', pct: '~80%',
      detail: '<strong>Refining:</strong> China dominates gallium (80%), germanium (60%), and rare-earth refining. Export controls imposed August 2023 have already affected spot prices. No credible short-term western substitute exists for gallium arsenide RF chips or SiC power devices. <em>Source: USGS Mineral Commodity Summaries 2024; IEA Critical Minerals Outlook 2024</em>',
    },
    {
      num: 3, name: 'Wafer / Fab', flag: '🇹🇼', pct: '~90%',
      detail: '<strong>Wafer / Fab:</strong> TSMC (Taiwan) produces ~90% of advanced logic nodes (≤5nm). ASML extreme ultraviolet lithography tools are the secondary chokepoint — the Netherlands controls the only EUV supplier globally. Intel and Samsung are the only credible TSMC alternatives, both at earlier nodes. <em>Source: CSIS semiconductor supply chain analysis</em>',
    },
    {
      num: 4, name: 'Packaging', flag: '🇰🇷🇹🇼', pct: '~92%',
      detail: '<strong>Packaging:</strong> High Bandwidth Memory (HBM) is manufactured by SK Hynix and Samsung (~95% combined). CoWoS advanced packaging is ~88% concentrated in Taiwan. This packaging layer is the binding constraint on H100/H200 and B200 GPU output — not wafer fab. <em>Source: CSIS; Morgan Stanley semiconductor supply</em>',
    },
    {
      num: 5, name: 'Data centre', flag: '🌍', pct: 'Global',
      detail: '<strong>Data centre:</strong> Global data centres consume ~200–250 TWh/yr (2023), rising to est. 1.5 TWh by 2026. Microsoft, Amazon, and Google are all pursuing SMR PPAs to decarbonise AI compute — linking the hardware supply chain directly to the nuclear tab. <em>Source: IEA Electricity 2024</em>',
    },
  ],
  concentration: [
    { label: 'Gallium refining', pct: 80, color: 'red' },
    { label: 'Germanium refining', pct: 60, color: 'red' },
    { label: 'Advanced node fab (TSMC)', pct: 90, color: 'amber' },
    { label: 'HBM memory (SK/Samsung)', pct: 95, color: 'amber' },
    { label: 'CoWoS packaging', pct: 88, color: 'amber' },
    { label: 'REE for magnets (motors)', pct: 85, color: 'red' },
  ],
  whyItMatters: "The chokepoint isn't the GPU — it's the <strong>materials and packaging</strong> that make it run. Remove Chinese gallium or Taiwanese CoWoS capacity and H100/B200 production stalls within 6–12 months.",
  whySource: 'IEA Critical Minerals 2024; CSIS semiconductor supply chain analysis',
  smrNote: 'Microsoft, Amazon, and Google have signed SMR power-purchase agreements (2023–2025) to power AI compute without grid carbon exposure. This links the AI hardware supply chain directly to the nuclear tab: SMR deployment requires <strong>HALEU enrichment</strong> (only ~5 commercial providers globally), <strong>zirconium cladding</strong> (Russia historically dominant), and <strong>hafnium control rods</strong>.',
  dualUseNote: 'Gallium nitride (GaN) is used in both AI server power electronics and in active electronically scanned array (AESA) radar systems for F-35 and Typhoon jets. China\'s export controls are explicitly dual-use — targeting western defence capability alongside AI competition. No analyst tool currently maps this overlap.',
  investmentImplication: 'Gallium and germanium export controls create a quantifiable supply-chain risk premium for fabless semiconductor companies dependent on GaAs and SiC devices. The Taiwan concentration in advanced packaging (CoWoS) represents a single-point-of-failure for GPU supply that is not reflected in most data-centre REIT valuations. SMR PPAs from hyperscalers are creating a new class of nuclear offtake contract — relevant to nuclear equity and project finance analysts.',
};
