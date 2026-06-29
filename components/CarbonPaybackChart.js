'use client';

export default function CarbonPaybackChart({
  debtMonths = 6,
  lifetimeYears = 25,
  technology = 'Solar PV (Chinese polysilicon)',
  source = 'IEA (2024); NREL lifecycle analysis',
}) {
  const debtYears = debtMonths / 12;
  const debtPct = (debtYears / lifetimeYears) * 100;
  const netYears = lifetimeYears - Math.ceil(debtYears);
  const netPct = Math.round(((lifetimeYears - debtYears) / lifetimeYears) * 100);

  return (
    <div className="payback-wrap">
      <p className="chart-title">Carbon payback over {lifetimeYears}-year lifetime</p>

      <div className="bar-outer">
        <div className="bar-track">
          <div className="debt-seg" style={{ width: `${debtPct}%` }}>
            <span className="seg-text">Debt ({debtMonths}mo)</span>
          </div>
          <div className="pos-seg">
            <span className="seg-text">Net-positive generation →</span>
          </div>
        </div>
        <div className="year-labels">
          <span className="year-label" style={{ left: '0%', transform: 'none' }}>Year 0</span>
          <span className="year-label breakeven" style={{ left: `${debtPct}%` }}>Breakeven</span>
          <span className="year-label" style={{ right: '0%', left: 'auto', transform: 'none' }}>Year {lifetimeYears}</span>
        </div>
      </div>

      <div className="legend">
        <span className="leg-item"><span className="leg-dot" style={{ background: '#8b1a1a' }} />Embodied carbon from manufacture</span>
        <span className="leg-item"><span className="leg-dot" style={{ background: '#0f4a2a' }} />Zero-emission generation</span>
      </div>

      <div className="stat-grid">
        <div className="stat-tile">
          <p className="tile-val" style={{ color: '#e84040' }}>{debtMonths} mo</p>
          <p className="tile-label">Carbon payback</p>
        </div>
        <div className="stat-tile">
          <p className="tile-val" style={{ color: '#2ec97e' }}>{netYears} yrs</p>
          <p className="tile-label">Net zero-carbon</p>
        </div>
        <div className="stat-tile">
          <p className="tile-val" style={{ color: '#3a9fd6' }}>{netPct}%</p>
          <p className="tile-label">Of lifetime positive</p>
        </div>
      </div>

      <div className="intensity-section">
        <p className="intensity-title">Manufacturing carbon intensity</p>
        {[
          { flag: '🇨🇳', label: 'China (Xinjiang, coal)', val: 77, pct: 100, color: '#e84040' },
          { flag: '🇩🇪', label: 'Germany (mixed)', val: 38, pct: 49, color: '#f5a623' },
          { flag: '🇳🇴', label: 'Norway (hydro)', val: 23, pct: 30, color: '#2ec97e' },
        ].map((row, i) => (
          <div key={i} className="int-row">
            <span className="int-flag">{row.flag}</span>
            <span className="int-label">{row.label}</span>
            <div className="int-track">
              <div className="int-fill" style={{ width: `${row.pct}%`, background: row.color }} />
            </div>
            <span className="int-val" style={{ color: row.color }}>~{row.val} g CO₂/Wp</span>
          </div>
        ))}
        <p className="int-source">IEA (2024); NREL; Fraunhofer ISE</p>
      </div>

      <p className="chart-source">{technology} — {source}</p>

      <style jsx>{`
        .payback-wrap { display: flex; flex-direction: column; gap: 14px; }
        .chart-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #7a8a94; font-weight: 500; }
        .bar-outer { display: flex; flex-direction: column; gap: 0; }
        .bar-track { display: flex; height: 30px; border-radius: 5px; overflow: hidden; }
        .debt-seg { background: #8b1a1a; display: flex; align-items: center; justify-content: center; min-width: 56px; flex-shrink: 0; }
        .pos-seg { background: #0f4a2a; flex: 1; display: flex; align-items: center; padding: 0 10px; }
        .seg-text { font-size: 11px; color: rgba(255,255,255,0.7); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .year-labels { position: relative; height: 26px; margin-top: 5px; }
        .year-label { position: absolute; font-size: 10px; color: #4a5a64; transform: translateX(-50%); white-space: nowrap; top: 0; }
        .year-label.breakeven { color: #7a8a94; }
        .legend { display: flex; gap: 16px; flex-wrap: wrap; }
        .leg-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #7a8a94; }
        .leg-dot { width: 9px; height: 9px; border-radius: 2px; flex-shrink: 0; }
        .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
        .stat-tile { background: #161a1c; border: 1px solid #2a3035; border-radius: 7px; padding: 10px; text-align: center; }
        .tile-val { font-size: 17px; font-weight: 500; margin-bottom: 3px; }
        .tile-label { font-size: 10px; color: #7a8a94; line-height: 1.3; }
        .intensity-section { display: flex; flex-direction: column; gap: 8px; }
        .intensity-title { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #4a5a64; font-weight: 500; }
        .int-row { display: flex; align-items: center; gap: 8px; }
        .int-flag { font-size: 14px; width: 20px; text-align: center; flex-shrink: 0; }
        .int-label { font-size: 11px; color: #e8ecee; width: 140px; flex-shrink: 0; }
        .int-track { flex: 1; background: rgba(255,255,255,0.06); border-radius: 3px; height: 5px; }
        .int-fill { height: 100%; border-radius: 3px; }
        .int-val { font-size: 11px; font-weight: 500; width: 96px; text-align: right; white-space: nowrap; flex-shrink: 0; }
        .int-source { font-size: 10px; color: #4a5a64; margin-top: 2px; }
        .chart-source { font-size: 10px; color: #4a5a64; }
      `}</style>
    </div>
  );
}
