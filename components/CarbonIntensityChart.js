'use client';
import { useEffect, useRef } from 'react';

const defaultData = [
  { label: 'China (Xinjiang, coal)', value: 77, flag: '🇨🇳', color: '#e84040' },
  { label: 'China (national avg)', value: 58, flag: '🇨🇳', color: '#f5a623' },
  { label: 'Germany (mixed grid)', value: 38, flag: '🇩🇪', color: '#f5a623' },
  { label: 'USA (mixed grid)', value: 32, flag: '🇺🇸', color: '#3a9fd6' },
  { label: 'EU average', value: 28, flag: '🇪🇺', color: '#3a9fd6' },
  { label: 'Norway (hydro)', value: 23, flag: '🇳🇴', color: '#2ec97e' },
];

export default function CarbonIntensityChart({ data = defaultData, title = 'Carbon intensity — polysilicon manufacturing', unit = 'g CO₂/Wp', source }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    let Chart;
    async function init() {
      if (typeof window === 'undefined') return;
      const mod = await import('chart.js/auto');
      Chart = mod.default;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color + 'cc'),
            borderColor: data.map(d => d.color),
            borderWidth: 1,
            borderRadius: 4,
            borderSkipped: false,
          }],
        },
        options: {
          indexAxis: 'y',
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
                label: (ctx) => ` ${ctx.parsed.x} ${unit}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.05)' },
              ticks: { color: '#7a8a94', font: { size: 11 } },
              border: { color: '#2a3035' },
              title: {
                display: true,
                text: unit,
                color: '#4a5a64',
                font: { size: 11 },
              },
            },
            y: {
              grid: { display: false },
              ticks: { color: '#e8ecee', font: { size: 11 } },
              border: { color: '#2a3035' },
            },
          },
        },
      });
    }
    init();
    return () => { if (chartRef.current) chartRef.current.destroy(); };
  }, [data, unit]);

  return (
    <div className="chart-wrap">
      <p className="chart-title">{title}</p>
      <div style={{ position: 'relative', height: `${data.length * 40 + 60}px` }}>
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`${title}: ${data.map(d => `${d.label} ${d.value} ${unit}`).join(', ')}`}
        />
      </div>
      {source && <p className="chart-source">{source}</p>}
      <style jsx>{`
        .chart-wrap { display: flex; flex-direction: column; gap: 8px; }
        .chart-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: #7a8a94; font-weight: 500; }
        .chart-source { font-size: 11px; color: #4a5a64; margin-top: 4px; }
      `}</style>
    </div>
  );
}
