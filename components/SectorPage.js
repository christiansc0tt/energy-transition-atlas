'use client';
import WorldFlowMap from './WorldFlowMap';
import SupplyChainFlowMap from './SupplyChainFlowMap';
import ConcentrationBars from './ConcentrationBars';
import CarbonPaybackChart from './CarbonPaybackChart';
import ScenarioDemandChart from './ScenarioDemandChart';

const statColors = { red: '#e84040', amber: '#f5a623', green: '#2ec97e' };

export default function SectorPage({ sector }) {
  return (
    <div className="sector">

      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">
            {sector.name}
            {sector.dualUse && <span className="dual-badge">⚔ Dual-use minerals</span>}
          </h1>
          <p className="page-subtitle">{sector.subtitle}</p>
        </div>
        <div className="paradox-badge">⚠ PARADOX: {sector.paradox}</div>
      </div>

      <div className="killer-fact">
        <p className="killer-label">Killer fact</p>
        <p className="killer-text" dangerouslySetInnerHTML={{ __html: sector.killerFact.text }} />
      </div>

      <div className="stats-row">
        {sector.stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <p className="stat-value" style={{ color: statColors[stat.color] }}>{stat.value}</p>
            <p className="stat-label">{stat.label}</p>
            <p className="stat-sub" style={{ color: statColors[stat.color] }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* World flow map — full width, headline visual */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Geographic supply chain — material flows</span>
          <span className="panel-tag amber">Hover nodes and arcs</span>
        </div>
        <WorldFlowMap sectorId={sector.id} />
      </div>

      {/* Stage detail navigator */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Stage detail — mine to deployment</span>
          <span className="panel-tag amber">Click any stage</span>
        </div>
        <SupplyChainFlowMap stages={sector.stages} />
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Supply concentration by stage</span>
            <span className="panel-tag">China share</span>
          </div>
          <ConcentrationBars items={sector.concentration} whyItMatters={sector.whyItMatters} whySource={sector.whySource} />
        </div>
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Carbon payback timeline</span>
            <span className="panel-tag">25-year life</span>
          </div>
          <CarbonPaybackChart
            debtMonths={sector.carbonPaybackMonths || 6}
            lifetimeYears={sector.lifetimeYears || 25}
            technology={sector.name}
          />
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Mineral demand under IEA scenarios</span>
          <span className="panel-tag amber">NZE / APS / STEPS — toggle scenarios</span>
        </div>
        <ScenarioDemandChart />
      </div>

      {sector.smrNote && (
        <div className="callout callout-blue">
          <p className="callout-label">⚛ SMR connection</p>
          <p className="callout-text" dangerouslySetInnerHTML={{ __html: sector.smrNote }} />
        </div>
      )}

      {sector.dualUseNote && (
        <div className="callout callout-red">
          <p className="callout-label">⚔ Dual-use exposure</p>
          <p className="callout-text">{sector.dualUseNote}</p>
        </div>
      )}

      {sector.investmentImplication && (
        <div className="invest-box">
          <p className="invest-label">Investment implications</p>
          <p className="invest-text">{sector.investmentImplication}</p>
        </div>
      )}

      <div className="method-note">
        <span>ℹ</span>
        <span>Carbon figures are lifecycle estimates (cradle-to-gate). Embedded carbon ranges reflect grid-mix uncertainty at time of manufacture. All figures carry a source and year — where contested, shown as ranges. <a href="/methodology">Full methodology →</a></span>
      </div>

      <style jsx>{`
        .sector { display: flex; flex-direction: column; gap: 16px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: 500; color: #e8ecee; margin-bottom: 6px; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .page-subtitle { font-size: 13px; color: #7a8a94; max-width: 500px; line-height: 1.55; }
        .dual-badge { background: rgba(232,64,64,0.12); border: 1px solid rgba(232,64,64,0.25); color: #ff8080; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 4px; }
        .paradox-badge { background: rgba(245,166,35,0.1); border: 1px solid rgba(245,166,35,0.28); color: #f5a623; font-size: 11px; font-weight: 500; padding: 6px 12px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .killer-fact { background: rgba(58,159,214,0.07); border-left: 3px solid #3a9fd6; padding: 14px 16px; border-radius: 0 8px 8px 0; }
        .killer-label { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; color: #3a9fd6; margin-bottom: 5px; }
        .killer-text { font-size: 13px; color: #e8ecee; line-height: 1.6; }
        .killer-text :global(strong) { color: #fff; font-weight: 500; }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .stat-card { background: #1e2326; border: 1px solid #2a3035; border-radius: 10px; padding: 16px; text-align: center; }
        .stat-value { font-size: 26px; font-weight: 500; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 12px; color: #7a8a94; line-height: 1.4; margin-bottom: 4px; }
        .stat-sub { font-size: 11px; }
        .panel { background: #1e2326; border: 1px solid #2a3035; border-radius: 10px; padding: 16px; }
        .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .panel-title { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em; color: #7a8a94; }
        .panel-tag { background: rgba(58,159,214,0.13); color: #3a9fd6; font-size: 11px; padding: 3px 8px; border-radius: 4px; }
        .panel-tag.amber { background: rgba(245,166,35,0.13); color: #f5a623; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .callout { border-radius: 8px; padding: 14px 16px; }
        .callout-blue { background: rgba(58,159,214,0.06); border: 1px solid rgba(58,159,214,0.2); }
        .callout-red { background: rgba(232,64,64,0.06); border: 1px solid rgba(232,64,64,0.2); }
        .callout-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #3a9fd6; margin-bottom: 6px; font-weight: 500; }
        .callout-red .callout-label { color: #ff8080; }
        .callout-text { font-size: 12px; color: #7a8a94; line-height: 1.65; }
        .callout-text :global(strong) { color: #e8ecee; font-weight: 500; }
        .invest-box { background: rgba(46,201,126,0.05); border: 1px solid rgba(46,201,126,0.18); border-radius: 8px; padding: 14px 16px; }
        .invest-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #2ec97e; margin-bottom: 6px; font-weight: 500; }
        .invest-text { font-size: 12px; color: #7a8a94; line-height: 1.65; }
        .method-note { background: rgba(255,255,255,0.02); border: 1px solid #2a3035; border-radius: 8px; padding: 12px 14px; font-size: 11px; color: #7a8a94; line-height: 1.6; display: flex; gap: 10px; align-items: flex-start; }
        .method-note :global(a) { color: #3a9fd6; text-decoration: none; }
        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
          .stats-row { grid-template-columns: 1fr; }
          .page-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
