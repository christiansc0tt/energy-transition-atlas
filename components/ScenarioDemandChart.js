'use client';
import { useEffect, useRef, useState } from 'react';

const scenarioData = {
  lithium: {
    label: 'Lithium',
    unit: 'kt',
    baseline: 130,
    scenarios: {
      STEPS: [130, 210, 320, 480],
      APS:   [130, 290, 520, 780],
      NZE:   [130, 380, 750, 1200],
    },
    years: [2023, 2025, 2030, 2040],
    note: 'NZE implies ~9× increase in lithium demand by 2040 vs 2023 baseline.',
  },
  cobalt: {
    label: 'Cobalt',
    unit: 'kt',
    baseline: 190,
    scenarios: {
      STEPS: [190, 210, 250, 290],
      APS:   [190, 230, 310, 380],
      NZE:   [190, 260, 370, 430],
    },
    years: [2023, 2025, 2030, 2040],
    note: 'Cobalt demand growth is more moderate due to LFP chemistry shift, but DRC concentration remains.',
  },
  ree: {
    label: 'Rare earth elements',
    unit: 'kt',
    baseline: 170,
    scenarios: {
      STEPS: [170, 195, 240, 310],
      APS:   [170, 220, 320, 460],
      NZE:   [170, 260, 420, 680],
    },
    years: [2023, 2025, 2030, 2040],
    note: 'REE demand driven by EV motors and wind turbines — both scale rapidly under NZE.',
  },
  silicon: {
    label: 'Silicon (solar)',
    unit: 'kt polysilicon',
    baseline: 900,
    scenarios: {
      STEPS: [900, 1200, 2200, 3800],
      APS:   [900, 1600, 3800, 7200],
      NZE:   [900, 2200, 6500, 14000],
    },
    years: [2023, 2025, 2030, 2040],
    note: 'NZE solar deployment requires ~15× polysilicon production by 2040. Marginal supply is Chinese coal-grid at current trajectory.',
  },
};

const scenColors = {
  NZE: '#2ec97e',
  APS: '#3a9fd6',
  STEPS: '#f5a623',
};

export default function ScenarioDemandChart() {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [mineral, setMineral] = useState('lithium');
  const [activeScen, setActiveScen] = useState({ NZE: true, APS: true, STEPS: true });

  const data = scenarioData[mineral];

  useEffect(() => {
    let Chart;
    async function init() {
      if (typeof window === 'undefined') return;
      const mod = await import('chart.js/auto');
      Chart = mod.default;
      if (chartRef.current) chartRef.current.destroy();
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      const datasets = Object.entries(data.scenarios)
        .filter(([key]) => activeScen[key])
        .map(([key, values]) => ({
          label: key,
          data: values,
          borderColor: scenColors[key],
          backgroundColor: scenColors[key] + '18',
          borderWidth: 2,
          pointBackgroundColor: scenColors[key],
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
          tension: 0.3,
        }));

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: { labels: data.years, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#1e2326',
              borderColor: '#3a464e',
              borderWidth: 1,
              titleColor: '#e8ecee',
              bodyColor: '#7a8a94',
              padding: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} ${data.unit}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { color: '#7a8a94', font: { size: 11 } },
              border: { color: '#2a3035' },
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                color: '#7a8a94',
                font: { size: 11 },
                callback: (v) => v.toLocaleString(),
              },
              border: { color: '#2a3035' },
              title: {
                display: true,
                text: data.unit,
                color: '#4a5a64',
                font: { size: 11 },
              },
            },
          },
        },
      });
    }
    init();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [mineral, activeScen, data]);

  return (
    <div className="scenario-wrap">
      <div className="scenario-header">
        <p className="chart-title">Mineral demand by IEA scenario</p>
        <div className="mineral-tabs">
          {Object.entries(scenarioData).map(([key, val]) => (
            <button
              key={key}
              className={`mineral-tab ${mineral === key ? 'active' : ''}`}
              onClick={() => setMineral(key)}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario toggles */}
      <div className="scen-toggles">
        {Object.entries(scenColors).map(([key, color]) => (
          <button
            key={key}
            className={`scen-toggle ${activeScen[key] ? 'active' : 'inactive'}`}
            style={{ borderColor: activeScen[key] ? color : '#2a3035', color: activeScen[key] ? color : '#4a5a64' }}
            onClick={() => setActiveScen(s => ({ ...s, [key]: !s[key] }))}
          >
            <span className="scen-dot" style={{ background: activeScen[key] ? color : '#2a3035' }} />
            {key}
          </button>
        ))}
        <span className="scen-source">IEA WEO 2024 (CC BY)</span>
      </div>

      <div style={{ position: 'relative', height: '200px' }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${data.label} demand under IEA scenarios to 2040`}
        />
      </div>

      <div className="insight-box">
        <span className="insight-label">Consequential insight</span>
        <p className="insight-text">{data.note}</p>
      </div>

      <style jsx>{`
        .scenario-wrap { display: flex; flex-direction: column; gap: 12px; }
        .scenario-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .chart-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #7a8a94; font-weight: 500; }
        .mineral-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .mineral-tab { background: #161a1c; border: 1px solid #2a3035; color: #7a8a94; font-size: 11px; padding: 4px 10px; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
        .mineral-tab:hover { color: #e8ecee; border-color: #3a464e; }
        .mineral-tab.active { background: rgba(245,166,35,0.1); border-color: rgba(245,166,35,0.3); color: #f5a623; }
        .scen-toggles { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .scen-toggle { display: flex; align-items: center; gap: 5px; background: none; border: 1px solid; font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
        .scen-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .scen-source { font-size: 11px; color: #4a5a64; margin-left: auto; }
        .insight-box { background: rgba(58,159,214,0.06); border-left: 3px solid #3a9fd6; padding: 10px 14px; border-radius: 0 6px 6px 0; }
        .insight-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #3a9fd6; font-weight: 500; display: block; margin-bottom: 4px; }
        .insight-text { font-size: 12px; color: #7a8a94; line-height: 1.6; }
      `}</style>
    </div>
  );
}
