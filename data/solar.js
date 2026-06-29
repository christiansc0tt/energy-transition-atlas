export const solar = {
  id: 'solar',
  name: 'Solar PV',
  icon: '☀️',
  paradox: 'Green tech, coal supply chain',
  subtitle: '~400W mono-silicon module — traced from quartz mine to rooftop deployment. A panel built in coal country that pays back its carbon in months.',
  killerFact: {
    text: 'A "clean" solar panel is manufactured predominantly in coal-powered Chinese factories — yet still offsets its embodied carbon within <strong>4–8 months</strong> of a 25–30 year operating life. The transition is real <em>and</em> carbon-intensive upfront. Both can be true.',
  },
  stats: [
    { value: '94%', label: 'Chinese polysilicon & wafer capacity', sub: '↑ from ~88% in 2020', color: 'red' },
    { value: '~40%', label: 'Global panels from Xinjiang alone', sub: 'Forced-labour ESG flag', color: 'amber' },
    { value: '3×', label: 'Chinese vs non-Chinese polysilicon carbon intensity', sub: '4–8 mo carbon payback', color: 'green' },
  ],
  stages: [
    {
      num: 1, name: 'Quartz mining', flag: '🌍', pct: 'Global',
      detail: '<strong>Quartz mining:</strong> High-purity quartz (SiO₂ ≥99.97%) is sourced from the USA (Spruce Pine, NC), Brazil, and Norway. Surprisingly non-concentrated — quartz is abundant globally. The supply constraint does not begin here. <em>Source: USGS Industrial Minerals 2024</em>',
    },
    {
      num: 2, name: 'Polysilicon', flag: '🇨🇳', pct: '~95%',
      detail: '<strong>Polysilicon:</strong> Xinjiang produces ~40% of world supply. Siemens-process purification consumes ~110 kWh/kg. Xinjiang grid is ~80% coal; Norway hydropower equivalent is ~23 g CO₂/Wp vs ~77 g CO₂/Wp for China. CBAM and UFLPA are redirecting some trade flows but western alternatives remain 3–4× more expensive. <em>Source: BloombergNEF; IEA Solar PV Global Supply Chains 2022</em>',
    },
    {
      num: 3, name: 'Wafer + Cell', flag: '🇨🇳', pct: '~94%',
      detail: '<strong>Wafer + Cell:</strong> Mono-Si ingot pulling and wafer slicing is ~94% China-concentrated. LONGi and Jinko dominate. Cell efficiency has plateaued near 24–26% for PERC; TOPCon and HJT are next-generation transitions, still primarily Chinese. <em>Source: BloombergNEF Solar Outlook 2024</em>',
    },
    {
      num: 4, name: 'Module assembly', flag: '🌏', pct: '~80%',
      detail: '<strong>Module assembly:</strong> Slightly less concentrated (~80% China) due to tariff-driven capacity in Vietnam, Malaysia, Thailand. However these facilities depend on Chinese wafers and cells — the geographic diversification is partial at best. <em>Source: IEA 2025; Wood Mackenzie Q1 2025</em>',
    },
  ],
  concentration: [
    { label: 'Polysilicon capacity', pct: 95, color: 'red' },
    { label: 'Wafer manufacturing', pct: 94, color: 'red' },
    { label: 'Solar cell production', pct: 88, color: 'amber' },
    { label: 'Module assembly', pct: 80, color: 'amber' },
    { label: 'Xinjiang share (modules)', pct: 40, color: 'amber' },
  ],
  whyItMatters: "The chokepoint isn't where <em>quartz</em> is mined — it's where it's <strong>turned into polysilicon.</strong> Remove China from that stage and global module supply collapses within 12–18 months.",
  whySource: 'IEA (2025); Wood Mackenzie Q1 2025',
  carbonIntensity: [
    { flag: '🇨🇳', label: 'China (coal-heavy)', value: '~77 g CO₂/Wp', pct: 100 },
    { flag: '🇩🇪', label: 'Germany (mixed grid)', value: '~38 g CO₂/Wp', pct: 49 },
    { flag: '🇳🇴', label: 'Norway (hydro)', value: '~23 g CO₂/Wp', pct: 30 },
  ],
  carbonSource: 'IEA (2024); NREL lifecycle analysis; Fraunhofer ISE',
  investmentImplication: 'CBAM tariffs on polysilicon will raise European module costs by an estimated 8–12% by 2026, compressing installer margins. Funds with significant solar developer exposure face a cost-of-goods headwind that is not currently priced into consensus estimates. The Xinjiang forced-labour flag creates ESG exclusion risk for ~40% of global module supply — a material due-diligence issue for any green infrastructure fund.',
};
