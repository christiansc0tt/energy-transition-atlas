'use client';
import Link from 'next/link';

const sources = [
  {
    sector: 'All sectors',
    items: [
      'IEA Critical Minerals Outlook 2024 — primary reference for mining, refining, and processing concentration figures',
      'USGS Mineral Commodity Summaries 2024 — production and reserve data by country',
      'IEA World Energy Outlook 2024 — scenario demand projections (NZE, APS, STEPS)',
    ],
  },
  {
    sector: 'Solar PV',
    items: [
      'IEA Solar PV Global Supply Chains 2022 — polysilicon and wafer concentration',
      'BloombergNEF Solar Outlook 2024 — wafer, cell, and module capacity shares',
      'NREL Life Cycle Assessment Harmonization — embedded carbon ranges',
      'Fraunhofer ISE — carbon intensity by manufacturing geography',
      'Wood Mackenzie Solar Supply Chain Q1 2025 — Xinjiang share estimates',
    ],
  },
  {
    sector: 'AI Hardware',
    items: [
      'USGS Mineral Commodity Summaries 2024 — gallium and germanium production shares',
      'CSIS Semiconductor Supply Chain Analysis 2023 — fab and packaging concentration',
      'IEA Electricity 2024 — data centre power demand projections',
      'Chinese Ministry of Commerce export control notices (Aug 2023, Sep 2023) — gallium, germanium, graphite controls',
    ],
  },
  {
    sector: 'EV & Battery',
    items: [
      'IEA Global EV Outlook 2024 — battery supply chain concentration',
      'Benchmark Mineral Intelligence 2024 — cathode and cell capacity shares',
      'BloombergNEF EV Battery Supply Chain 2024 — cell manufacturing geography',
      'OECD Due Diligence Guidance for Responsible Supply Chains — DRC cobalt context',
    ],
  },
  {
    sector: 'Wind',
    items: [
      'USGS 2024 — rare earth element mining and refining shares',
      'IEA Critical Minerals Outlook 2024 — NdFeB magnet supply chain',
      'BloombergNEF Wind Market Outlook 2024 — turbine manufacturer market shares',
      'NREL — offshore wind lifecycle carbon estimates',
      'ORE Catapult 2024 — installation vessel constraints',
    ],
  },
  {
    sector: 'Nuclear & SMR',
    items: [
      'World Nuclear Association 2024 — uranium mining, conversion, and enrichment shares',
      'US Nuclear Regulatory Commission (NRC) — HALEU supply and licensing status',
      'US Department of Energy — SMR deployment timeline and fuel supply',
      'IEA — nuclear lifecycle carbon estimates',
    ],
  },
];

export default function MethodologyPage() {
  return (
    <div className="method-wrap">
      <nav className="top-nav">
        <Link href="/" className="nav-brand">
          <span>⚡</span> Energy Transition Atlas
        </Link>
        <Link href="/" className="back-link">← Back to atlas</Link>
      </nav>

      <main className="content">
        <div className="page-header">
          <h1 className="page-title">Methodology</h1>
          <p className="page-subtitle">
            How figures are sourced, what they measure, and where uncertainty exists.
            Honest about limitations — a methodology page that conceals uncertainty
            is worse than none.
          </p>
          <div className="vintage-badge">
            Data vintage: Q1–Q2 2025 — Last reviewed June 2025
          </div>
        </div>

        {/* Section 1 — Data vintage */}
        <section className="section">
          <h2 className="section-title">Data vintage and maintenance</h2>
          <p className="section-text">
            All figures in this atlas are sourced from publicly available datasets
            as of Q1–Q2 2025. Supply chain data moves: Chinese export controls,
            new IEA reports, and price shifts can materially change concentration
            figures within months. Every chart and statistic carries a source and
            year. Where a figure has changed significantly since its source date,
            this is flagged inline.
          </p>
          <p className="section-text">
            This atlas is a snapshot, not a live feed. Figures should not be
            relied upon for investment decisions without verification against
            current primary sources. The data vintage statement on every figure
            is not a disclaimer — it is the information you need to judge whether
            a number is still current.
          </p>
        </section>

        {/* Section 2 — Concentration */}
        <section className="section">
          <h2 className="section-title">Concentration methodology</h2>
          <p className="section-text">
            This atlas distinguishes three types of concentration, which differ
            significantly by mineral and are frequently conflated in poor analysis:
          </p>
          <div className="definition-list">
            <div className="definition">
              <p className="def-term">Mining concentration</p>
              <p className="def-text">
                The share of global raw material extracted by country. This is
                often the least concentrated stage — quartz mining for solar PV
                is globally distributed, even though the downstream supply chain
                is not. Uranium mining (Kazakhstan, Canada, Australia) is more
                concentrated than oil but less concentrated than uranium enrichment.
              </p>
            </div>
            <div className="definition">
              <p className="def-term">Refining and processing concentration</p>
              <p className="def-text">
                The share of global material refined, separated, or chemically
                processed by country. This is typically the most concentrated
                stage and the most geopolitically significant. China refines ~85%
                of rare earth elements globally, including ore imported from
                Australia and the USA for processing. The refining concentration
                is the relevant number for supply chain risk — not mining. This
                distinction is the most important analytical point in the atlas.
              </p>
            </div>
            <div className="definition">
              <p className="def-term">Manufacturing concentration</p>
              <p className="def-text">
                The share of global component or product manufacturing by country.
                Solar wafers (94% China), EV cathode (77% China), and NdFeB
                magnets (92% China) are examples. Manufacturing concentration
                reflects investment, industrial policy, and labour costs as much
                as resource geography — it is more amenable to policy intervention
                than refining concentration.
              </p>
            </div>
          </div>
          <div className="callout">
            <p className="callout-label">Why this matters</p>
            <p className="callout-text">
              A country can mine a critical mineral domestically and still be
              entirely dependent on a foreign nation for the refined or processed
              form. Australia mines significant rare earths at Lynas's Mt Weld
              operation but ships most ore to Malaysia (and historically China)
              for separation. The USA mines lithium but processes a fraction
              domestically. Mining self-sufficiency is not supply chain security.
            </p>
          </div>
        </section>

        {/* Section 3 — LCA */}
        <section className="section">
          <h2 className="section-title">Lifecycle carbon methodology</h2>
          <p className="section-text">
            Carbon figures in this atlas use a <strong>cradle-to-gate</strong> boundary:
            emissions from raw material extraction through to the point the finished
            component leaves the factory gate. This excludes transport to installation
            site, installation itself, operational emissions (zero for generation
            technologies), and end-of-life treatment. The functional unit varies
            by sector and is stated on each figure.
          </p>

          <div className="lca-example">
            <p className="example-label">Worked example — polysilicon carbon intensity</p>
            <p className="example-text">
              The same physical product — solar-grade polysilicon — has a carbon
              intensity that varies by a factor of 3× depending solely on where
              it is manufactured, because the energy input to the Siemens
              purification process is grid electricity whose carbon intensity
              varies dramatically by geography:
            </p>
            <div className="carbon-rows">
              <div className="carbon-row">
                <span className="carbon-flag">🇨🇳</span>
                <span className="carbon-country">China (coal-heavy grid, Xinjiang)</span>
                <div className="carbon-bar-wrap">
                  <div className="carbon-bar" style={{ width: '100%' }} />
                </div>
                <span className="carbon-val">~77 g CO₂/Wp</span>
              </div>
              <div className="carbon-row">
                <span className="carbon-flag">🇩🇪</span>
                <span className="carbon-country">Germany (mixed grid)</span>
                <div className="carbon-bar-wrap">
                  <div className="carbon-bar" style={{ width: '49%' }} />
                </div>
                <span className="carbon-val">~38 g CO₂/Wp</span>
              </div>
              <div className="carbon-row">
                <span className="carbon-flag">🇳🇴</span>
                <span className="carbon-country">Norway (hydropower grid)</span>
                <div className="carbon-bar-wrap">
                  <div className="carbon-bar" style={{ width: '30%' }} />
                </div>
                <span className="carbon-val">~23 g CO₂/Wp</span>
              </div>
            </div>
            <p className="example-source">
              Source: IEA (2024); NREL lifecycle analysis; Fraunhofer ISE
            </p>
          </div>

          <div className="uncertainty-box">
            <p className="uncertainty-label">⚠ Uncertainty in LCA figures</p>
            <p className="uncertainty-text">
              Embedded carbon ranges in this atlas reflect genuine uncertainty,
              not imprecision. LCA figures for the same product can vary by a
              factor of 2–3× across studies depending on: system boundary
              assumptions (what is included in cradle-to-gate), whether
              grid-average or marginal emission factors are used, the vintage
              of the grid emission factor applied, and allocation method for
              co-products. Where a range is shown rather than a point estimate,
              this reflects the range across credible published studies — not
              a confidence interval around a single estimate. Point estimates
              for embedded carbon should be treated with scepticism unless the
              methodology is fully specified.
            </p>
          </div>
        </section>

        {/* Section 4 — Scenario analysis */}
        <section className="section">
          <h2 className="section-title">Scenario analysis — consequential framing</h2>
          <p className="section-text">
            The scenario analysis layer uses IEA demand projections from three
            published scenarios: Net Zero Emissions by 2050 (NZE), Announced
            Pledges Scenario (APS), and Stated Policies Scenario (STEPS). These
            are used as-published under IEA's CC BY licence.
          </p>
          <p className="section-text">
            The framing is <strong>consequential</strong> rather than attributional:
            instead of mapping today's average supply chain, the relevant question
            for transition finance is what changes at the margin as demand scales.
            Under each scenario, the analysis asks: which supply chain node hits
            a physical constraint first, and who is the marginal supplier at that
            constraint? The marginal supplier's carbon intensity — not the
            average — determines the carbon cost of incremental transition
            investment under that scenario.
          </p>
        </section>

        {/* Section 5 — Sources */}
        <section className="section">
          <h2 className="section-title">Sources by sector</h2>
          <div className="sources-list">
            {sources.map((s, i) => (
              <div key={i} className="source-group">
                <p className="source-sector">{s.sector}</p>
                <ul className="source-items">
                  {s.items.map((item, j) => (
                    <li key={j} className="source-item">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — What we can't claim */}
        <section className="section">
          <h2 className="section-title">What this atlas cannot claim</h2>
          <p className="section-text">
            Being explicit about limitations builds more credibility than
            omitting them.
          </p>
          <div className="limits-list">
            <div className="limit-item">
              <p className="limit-title">Not investment advice</p>
              <p className="limit-text">Supply chain data is one input to investment analysis. This atlas does not account for hedging, contractual arrangements, strategic stockpiles, or policy interventions that may materially change the risk profile of any specific investment.</p>
            </div>
            <div className="limit-item">
              <p className="limit-title">Concentration figures are approximations</p>
              <p className="limit-text">Country-level production and processing shares are estimates based on published data. Actual figures may differ due to unreported production, tolling arrangements, and trade flow complexity. Ranges are given where sources disagree by more than 5 percentage points.</p>
            </div>
            <div className="limit-item">
              <p className="limit-title">LCA figures are contested</p>
              <p className="limit-text">Lifecycle carbon estimates carry genuine methodological uncertainty of ±30–50% depending on boundary assumptions. The figures shown represent the central estimates from the most frequently cited studies. They should not be used as precise inputs to carbon accounting without independent verification.</p>
            </div>
            <div className="limit-item">
              <p className="limit-title">Dual-use characterisation is qualitative</p>
              <p className="limit-text">The dual-use flags in the cross-sector minerals table indicate that a mineral is used in both clean energy and defence applications in its refined form. This is not a quantitative assessment of defence dependency or strategic sensitivity, which would require classified data.</p>
            </div>
          </div>
        </section>

        <div className="footer-note">
          Built by MSc Climate & Energy Finance students, University of Edinburgh, 2025.
          Data sourced from public domain and CC BY licensed publications.
          <span className="footer-link"><Link href="/">← Return to atlas</Link></span>
        </div>
      </main>

      <style jsx>{`
        .method-wrap { background: #0d0f10; min-height: 100vh; color: #e8ecee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; }
        .top-nav { background: #0b0d0e; border-bottom: 1px solid #2a3035; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; height: 46px; position: sticky; top: 0; z-index: 100; }
        .nav-brand { font-size: 12px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: #f5a623; text-decoration: none; display: flex; align-items: center; gap: 7px; }
        .back-link { font-size: 13px; color: #7a8a94; text-decoration: none; }
        .back-link:hover { color: #e8ecee; }
        .content { max-width: 760px; margin: 0 auto; padding: 40px 24px 80px; }
        .page-header { margin-bottom: 40px; }
        .page-title { font-size: 28px; font-weight: 500; color: #e8ecee; margin-bottom: 10px; }
        .page-subtitle { font-size: 14px; color: #7a8a94; line-height: 1.65; max-width: 560px; margin-bottom: 16px; }
        .vintage-badge { display: inline-block; background: rgba(46,201,126,0.08); border: 1px solid rgba(46,201,126,0.2); color: #2ec97e; font-size: 12px; padding: 5px 12px; border-radius: 4px; }
        .section { margin-bottom: 48px; }
        .section-title { font-size: 16px; font-weight: 500; color: #e8ecee; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid #2a3035; }
        .section-text { font-size: 13px; color: #7a8a94; line-height: 1.75; margin-bottom: 12px; }
        .section-text strong { color: #e8ecee; font-weight: 500; }
        .definition-list { display: flex; flex-direction: column; gap: 16px; margin: 16px 0; }
        .definition { background: #1e2326; border: 1px solid #2a3035; border-radius: 8px; padding: 16px; }
        .def-term { font-size: 13px; font-weight: 500; color: #f5a623; margin-bottom: 6px; }
        .def-text { font-size: 12px; color: #7a8a94; line-height: 1.7; }
        .callout { background: rgba(58,159,214,0.06); border-left: 3px solid #3a9fd6; padding: 14px 16px; border-radius: 0 8px 8px 0; margin-top: 16px; }
        .callout-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #3a9fd6; margin-bottom: 6px; }
        .callout-text { font-size: 12px; color: #7a8a94; line-height: 1.7; }
        .lca-example { background: #1e2326; border: 1px solid #2a3035; border-radius: 8px; padding: 16px; margin: 16px 0; }
        .example-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #7a8a94; margin-bottom: 8px; }
        .example-text { font-size: 12px; color: #7a8a94; line-height: 1.65; margin-bottom: 14px; }
        .carbon-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
        .carbon-row { display: flex; align-items: center; gap: 10px; }
        .carbon-flag { width: 24px; text-align: center; font-size: 16px; }
        .carbon-country { font-size: 12px; color: #e8ecee; width: 200px; flex-shrink: 0; }
        .carbon-bar-wrap { flex: 1; background: rgba(255,255,255,0.06); border-radius: 3px; height: 5px; }
        .carbon-bar { height: 100%; border-radius: 3px; background: #f5a623; }
        .carbon-val { font-size: 12px; font-weight: 500; color: #f5a623; width: 100px; text-align: right; white-space: nowrap; }
        .example-source { font-size: 11px; color: #4a5a64; }
        .uncertainty-box { background: rgba(245,166,35,0.05); border: 1px solid rgba(245,166,35,0.2); border-radius: 8px; padding: 14px 16px; margin-top: 16px; }
        .uncertainty-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #f5a623; margin-bottom: 6px; }
        .uncertainty-text { font-size: 12px; color: #7a8a94; line-height: 1.7; }
        .sources-list { display: flex; flex-direction: column; gap: 20px; }
        .source-group { border-left: 2px solid #2a3035; padding-left: 16px; }
        .source-sector { font-size: 13px; font-weight: 500; color: #e8ecee; margin-bottom: 8px; }
        .source-items { list-style: none; display: flex; flex-direction: column; gap: 5px; }
        .source-item { font-size: 12px; color: #7a8a94; line-height: 1.6; padding-left: 12px; position: relative; }
        .source-item::before { content: '—'; position: absolute; left: 0; color: #4a5a64; }
        .limits-list { display: flex; flex-direction: column; gap: 14px; margin-top: 14px; }
        .limit-item { background: #1e2326; border: 1px solid #2a3035; border-radius: 8px; padding: 14px 16px; }
        .limit-title { font-size: 13px; font-weight: 500; color: #e8ecee; margin-bottom: 5px; }
        .limit-text { font-size: 12px; color: #7a8a94; line-height: 1.65; }
        .footer-note { font-size: 12px; color: #4a5a64; line-height: 1.7; padding-top: 32px; border-top: 1px solid #2a3035; display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
        .footer-link :global(a) { color: #3a9fd6; text-decoration: none; }
      `}</style>
    </div>
  );
}