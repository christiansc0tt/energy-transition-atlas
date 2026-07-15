// data/graph/content.js
// ---------------------------------------------------------------------------
// The narrative layer. The graph says WHERE the risk is; this says WHY it
// matters and what it costs. One schema, three sectors, so the tabs cannot
// drift into three different essays.
//
// !! EVERY NUMBER IN THIS FILE IS INDICATIVE !!
// Price series are reconstructed from public reporting and are shaped right,
// not precise. Before publication, rebuild each series from ONE citable source
// and say which. A fund analyst will know these curves by heart.
// ---------------------------------------------------------------------------

export const content = {
  ev: {
    thesis:
      'Cobalt gets the headlines and scores 5. The chain actually breaks at graphite anode ' +
      'processing and rare earth separation — both refining steps, neither fixed by a single ' +
      'Western mine.',

    deepDive: {
      eyebrow: 'The chokepoint',
      title: 'Graphite: the gap between digging and processing',
      body: [
        'Natural graphite mining is concentrated but not exceptional — roughly 70% China, ' +
          'with Mozambique and Madagascar supplying real volume. Fragility 6. Uncomfortable, ' +
          'not fatal.',
        'The problem is what happens next. Turning flake graphite into an anode means ' +
          'spheronising it, purifying it, and coating it — and that step sits at roughly 95% ' +
          'China. It is a processing step, not a deposit, which is why every announcement of ' +
          'a new Western graphite mine misses the point. You can own the rock and still not ' +
          'own an anode.',
        'The Dec 2023 export licensing regime made this legible: controls were placed on ' +
          'the processed material and the technology, not the ore. That is a deliberate ' +
          'choice about which link in the chain is worth holding.',
        'Qualification is what makes it stick. An automaker cannot swap anode suppliers the ' +
          'way it swaps a fastener — the cell has to be requalified, which takes 12 to 24 ' +
          'months of testing. So the binding constraint is not plant construction, which is ' +
          '2–3 years. It is that the plant\'s output is worthless until someone has spent two ' +
          'years proving it. Incumbency compounds.',
        'And the standard answer makes it worse. "Just use LFP" removes cobalt and nickel — ' +
          'but LFP cells need MORE anode per kWh, not less. The chemistry that solves the ' +
          'cobalt problem deepens the graphite one.',
      ],
      compare: { a: 'graphite-mining', b: 'graphite-anode' },
    },

    price: {
      material: 'Lithium carbonate',
      unit: 'US$/tonne',
      confidence: 'modelled',
      note:
        'Indicative shape reconstructed from public reporting — rebuild from a single ' +
        'citable series before publication.',
      points: [
        { t: '2020-Q1', v: 7000 }, { t: '2020-Q3', v: 5800 }, { t: '2021-Q1', v: 11000 },
        { t: '2021-Q3', v: 19000 }, { t: '2022-Q1', v: 62000 }, { t: '2022-Q3', v: 71000 },
        { t: '2022-Q4', v: 80000 }, { t: '2023-Q2', v: 30000 }, { t: '2023-Q4', v: 16000 },
        { t: '2024-Q2', v: 13000 }, { t: '2024-Q4', v: 11000 }, { t: '2025-Q2', v: 10500 },
      ],
      marks: [
        { t: '2022-Q4', label: 'Peak — ~13x the 2020 floor' },
        { t: '2025-Q2', label: 'Round trip complete' },
      ],
      lesson:
        'A >10x round trip in four years, and it changed almost nothing structural. Price ' +
        'signals are supposed to summon supply — but a mine is 4–7 years and a qualified ' +
        'anode line is longer. The spike arrived and left before new capacity could answer ' +
        'it, and the capacity that did get built was mostly built where the processing ' +
        'already was. This is the clearest evidence in the atlas that markets do not clear ' +
        'chokepoints on transition timescales. Fragility and price are different axes.',
    },

    carbon: {
      title: 'Where the pack is built decides most of its carbon',
      unit: 'kgCO₂e/kWh',
      basis: 'cradle-to-gate, full pack',
      confidence: 'modelled',
      bars: [
        { label: 'Coal-heavy grid', range: [75, 90], note: 'Cell plant on a coal-dominated grid' },
        { label: 'EU average grid', range: [60, 75], note: '' },
        { label: 'Nordic hydro', range: [40, 55], note: 'Same process, same chemistry' },
      ],
      payback:
        'Carbon payback against a comparable ICE runs roughly 1–3 years of typical EU ' +
        'driving. Quote the range, never the midpoint: the spread between those bars is ' +
        'most of the answer, and it is geography, not technology.',
    },
  },

  solar: {
    thesis:
      'Public debate stops at modules and occasionally reaches polysilicon. The tightest ' +
      'single stage in this entire atlas is ingot and wafer, at roughly 97% — and China ' +
      'controls it by restricting the technology, not the product.',

    deepDive: {
      eyebrow: 'The chokepoint',
      title: 'Wafer: a capability shock, not a supply shock',
      body: [
        'Polysilicon at ~93% is the number everyone cites. Ingot growth and wafering, at ' +
          'roughly 97%, is tighter — and it gets a fraction of the attention, because the ' +
          'public conversation about solar is a conversation about modules.',
        'The export controls tell you which one matters. China has restricted large-diameter ' +
          'wafer TECHNOLOGY, not wafer exports. You can buy all the wafers you want. You ' +
          'cannot buy the ability to make them.',
        'That is a fundamentally different shock shape from graphite, and it propagates ' +
          'differently. A supply shock raises your cost and clears when capacity arrives. A ' +
          'capability shock does not raise your cost at all — it caps your ceiling. Nothing ' +
          'shows up in the price series. The damage is that in ten years you still cannot do it.',
        'This is why module assembly announcements are close to meaningless as industrial ' +
          'policy. Assembling modules from Chinese wafers is import substitution with extra ' +
          'steps, and it is the stage with the lowest fragility in the chain.',
      ],
      compare: { a: 'polysilicon', b: 'ingot-wafer' },
    },

    price: {
      material: 'Polysilicon (solar grade, spot)',
      unit: 'US$/kg',
      confidence: 'modelled',
      note:
        'Indicative shape reconstructed from public reporting — rebuild from a single ' +
        'citable series before publication.',
      points: [
        { t: '2020-Q1', v: 8 }, { t: '2020-Q3', v: 10 }, { t: '2021-Q1', v: 15 },
        { t: '2021-Q3', v: 26 }, { t: '2022-Q1', v: 34 }, { t: '2022-Q3', v: 40 },
        { t: '2022-Q4', v: 36 }, { t: '2023-Q2', v: 12 }, { t: '2023-Q4', v: 9 },
        { t: '2024-Q2', v: 5 }, { t: '2024-Q4', v: 5 }, { t: '2025-Q2', v: 6 },
      ],
      marks: [
        { t: '2022-Q3', label: 'Peak — capacity lagged demand' },
        { t: '2024-Q2', label: 'Below cash cost for most producers' },
      ],
      lesson:
        'The mirror image of lithium, and more damning. Prices collapsed below cash cost — ' +
          'the strongest possible signal to exit — and concentration did not fall. It rose. ' +
          'Loss-making Chinese capacity stayed on and non-Chinese entrants were priced out ' +
          'before they could qualify. A price crash is not a diversification event. If you ' +
          'take one thing from this atlas: the price of a thing tells you almost nothing ' +
          'about whether you can get it.',
    },

    carbon: {
      title: 'Same process, same product, three times the carbon',
      unit: 'kgCO₂e/kg polysilicon',
      basis: 'cradle-to-gate',
      confidence: 'modelled',
      bars: [
        { label: 'Xinjiang (coal)', range: [70, 90], note: 'Siemens process, coal captive power' },
        { label: 'EU average', range: [35, 50], note: '' },
        { label: 'Norway (hydro)', range: [25, 35], note: 'Identical Siemens process' },
      ],
      payback:
        'The Siemens process is ~50–150 kWh/kg. Run it on Xinjiang coal and you sit at the ' +
        'top; run it on Norwegian hydro and you sit at the bottom. Nothing about the ' +
        'technology changed. This is the worked example for the whole atlas: geography, not ' +
        'process, is doing the work. Module carbon payback runs ~0.5–2 years depending on ' +
        'where it was made and where it is installed — a Xinjiang module on a French grid ' +
        'pays back far slower than the headline figure suggests.',
    },
  },

  wind: {
    thesis:
      'The same magnet, in the same country, at the same concentration, is a worse problem ' +
      'for wind than for EVs — because offshore has no motor to switch to. And the biggest ' +
      'carbon in a turbine is not exotic at all. It is the steel.',

    deepDive: {
      eyebrow: 'The cross-sector case',
      title: 'One material, two sectors, different exposure',
      body: [
        'Rare earth separation scores 9 and serves both EVs and wind. It is the single node ' +
          'this atlas exists to show: separated neodymium is a rounding error on the bill of ' +
          'materials of both products, and it can halt both production lines. Cost share ' +
          'tells you nothing about whether you can buy something.',
        'But downstream of that shared node, the two sectors diverge — and the divergence is ' +
          'the whole argument for scoring substitutability separately from concentration.',
        'EV traction magnets score 6. BMW ships electrically-excited synchronous motors and ' +
          'Tesla ships induction motors: no rare earths, a modest efficiency penalty, in ' +
          'production today. The magnet is substitutable.',
        'Wind generator magnets score 7. The alternative is a geared drivetrain, which is ' +
          'proven — it is the onshore incumbent. But the offshore maintenance economics that ' +
          'pushed the industry to direct-drive in the first place have not changed. The ' +
          'substitute exists and going back costs you the reason you left.',
        'Same material. Same country. Same concentration. Different exposure. No single-sector ' +
          'report produces that comparison, because no single-sector report scores the other sector.',
      ],
      compare: { a: 'ndfeb-magnet-generator', b: 'ree-separation' },
    },

    price: {
      material: 'Neodymium oxide',
      unit: 'US$/kg',
      confidence: 'modelled',
      note:
        'Indicative shape reconstructed from public reporting — rebuild from a single ' +
        'citable series before publication.',
      points: [
        { t: '2020-Q1', v: 42 }, { t: '2020-Q3', v: 48 }, { t: '2021-Q1', v: 85 },
        { t: '2021-Q3', v: 95 }, { t: '2022-Q1', v: 165 }, { t: '2022-Q3', v: 115 },
        { t: '2022-Q4', v: 105 }, { t: '2023-Q2', v: 75 }, { t: '2023-Q4', v: 68 },
        { t: '2024-Q2', v: 55 }, { t: '2024-Q4', v: 58 }, { t: '2025-Q2', v: 62 },
      ],
      marks: [
        { t: '2022-Q1', label: 'Peak — ~4x, on quota policy not scarcity' },
        { t: '2024-Q2', label: 'Back near the floor' },
      ],
      lesson:
        'A smaller spike than lithium, and more instructive. Neodymium moved on Chinese ' +
        'production quota decisions rather than on any change in geology. When one ' +
        'jurisdiction sets the quota, the price is a policy output, not a scarcity signal — ' +
        'and hedging it does not get you a magnet. The exposure survives the price returning ' +
        'to normal, which is precisely why fragility is scored on structure, not on cost.',
    },

    carbon: {
      title: 'The carbon is in the steel, not the exotics',
      unit: 'tCO₂e/tonne steel',
      basis: 'cradle-to-gate',
      confidence: 'modelled',
      bars: [
        { label: 'BF-BOF (coal route)', range: [1.8, 2.3], note: 'The default for plate and monopiles' },
        { label: 'EAF (scrap route)', range: [0.4, 0.8], note: 'Constrained by scrap availability' },
        { label: 'H₂-DRI (emerging)', range: [0.1, 0.6], note: 'Not yet at scale for heavy plate' },
      ],
      payback:
        'Tower and monopile steel is fragility 3 — the least fragile stage in wind — and ' +
        'carries the largest cost share and the largest embodied carbon in the turbine. ' +
        'On a tab otherwise about rare earths and electrical steel, that is worth saying ' +
        'plainly: fragility and importance are different axes, and the biggest ' +
        'decarbonisation lever here has nothing to do with critical minerals.',
    },
  },
};

// Cost-share midpoints for the simulator. Crude on purpose, and the UI says so.
export const COST_WEIGHT = { low: 0.03, mid: 0.12, high: 0.3 };

export default content;
