'use client';
import { useState, useEffect, useRef } from 'react';

const stageColors = {
  0: { bg: '#1a2a1a', border: '#2a5a2a', dot: '#2ec97e', label: 'Mining' },
  1: { bg: '#2a1a1a', border: '#5a2a2a', dot: '#e84040', label: 'Refining' },
  2: { bg: '#1a1f2a', border: '#2a3a5a', dot: '#3a9fd6', label: 'Manufacturing' },
  3: { bg: '#2a2a1a', border: '#5a4a1a', dot: '#f5a623', label: 'Assembly' },
  4: { bg: '#1a1a2a', border: '#2a2a5a', dot: '#a78bfa', label: 'Deployment' },
};

export default function SupplyChainFlowMap({ stages }) {
  const [active, setActive] = useState(null);
  const [animated, setAnimated] = useState(false);
  const [flowDot, setFlowDot] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setFlowDot(d => (d + 1) % stages.length);
    }, 900);
    return () => clearInterval(intervalRef.current);
  }, [stages.length]);

  const activeStage = active !== null ? stages[active] : null;

  return (
    <div className="flow-wrap">
      {/* Flow map */}
      <div className="flow-map" role="group" aria-label="Supply chain flow diagram">
        {stages.map((stage, i) => {
          const c = stageColors[i] || stageColors[4];
          const isActive = active === i;
          const isFlow = flowDot === i;
          return (
            <div key={i} className="stage-col">
              <button
                className={`stage-node ${isActive ? 'node-active' : ''}`}
                style={{
                  background: isActive ? c.bg : '#161a1c',
                  borderColor: isActive ? c.dot : (isFlow ? c.dot : '#2a3035'),
                  boxShadow: isFlow && !isActive ? `0 0 0 2px ${c.dot}22` : 'none',
                }}
                onClick={() => setActive(active === i ? null : i)}
                aria-pressed={isActive}
              >
                <span className="node-num" style={{ color: c.dot }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="node-flag">{stage.flag}</span>
                <span className="node-name">{stage.name}</span>
                <span className="node-pct" style={{ color: c.dot }}>{stage.pct}</span>
                <span
                  className="node-dot"
                  style={{ background: c.dot, opacity: isFlow ? 1 : 0.3 }}
                />
              </button>

              {i < stages.length - 1 && (
                <div className="arrow-wrap" aria-hidden="true">
                  <div className="arrow-track">
                    <div
                      className="arrow-fill"
                      style={{
                        width: animated ? '100%' : '0%',
                        transitionDelay: `${i * 0.12}s`,
                        background: `linear-gradient(90deg, ${stageColors[i].dot}, ${stageColors[i + 1].dot})`,
                      }}
                    />
                    <div
                      className="arrow-pulse"
                      style={{
                        left: flowDot === i ? '0%' : flowDot > i ? '100%' : '-20%',
                        background: stageColors[i].dot,
                      }}
                    />
                  </div>
                  <div className="arrow-head" style={{ borderLeftColor: stageColors[i + 1].dot }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stage legend */}
      <div className="stage-legend" aria-hidden="true">
        {Object.values(stageColors).slice(0, stages.length).map((c, i) => (
          <span key={i} className="legend-item">
            <span className="legend-dot" style={{ background: c.dot }} />
            <span className="legend-label">{c.label}</span>
          </span>
        ))}
      </div>

      {/* Detail panel */}
      <div
        className={`detail-panel ${activeStage ? 'panel-open' : ''}`}
        aria-live="polite"
      >
        {activeStage ? (
          <>
            <div className="detail-header">
              <span className="detail-stage-num" style={{ color: stageColors[active]?.dot }}>
                Stage {activeStage.num}
              </span>
              <span className="detail-name">{activeStage.name}</span>
              <span className="detail-flag">{activeStage.flag}</span>
              <button className="detail-close" onClick={() => setActive(null)} aria-label="Close detail">✕</button>
            </div>
            <p
              className="detail-text"
              dangerouslySetInnerHTML={{ __html: activeStage.detail }}
            />
          </>
        ) : (
          <p className="detail-prompt">
            ← Click any stage to see materials, carbon hotspots, and geopolitical risks
          </p>
        )}
      </div>

      <style jsx>{`
        .flow-wrap { display: flex; flex-direction: column; gap: 12px; }
        .flow-map {
          display: flex;
          align-items: center;
          gap: 0;
          overflow-x: auto;
          padding: 4px 0 8px;
          scrollbar-width: thin;
          scrollbar-color: #2a3035 transparent;
        }
        .stage-col {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .stage-node {
          width: 108px;
          background: #161a1c;
          border: 1px solid #2a3035;
          border-radius: 10px;
          padding: 12px 8px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          position: relative;
          flex-shrink: 0;
        }
        .stage-node:hover {
          border-color: #3a464e;
          background: #1e2326;
        }
        .node-active {
          transform: translateY(-2px);
        }
        .node-num {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          font-variant-numeric: tabular-nums;
        }
        .node-flag { font-size: 20px; margin: 2px 0; }
        .node-name {
          font-size: 11px;
          font-weight: 500;
          color: #e8ecee;
          text-align: center;
          line-height: 1.3;
        }
        .node-pct {
          font-size: 11px;
          font-weight: 500;
        }
        .node-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 2px;
          transition: opacity 0.4s;
        }
        .arrow-wrap {
          display: flex;
          align-items: center;
          width: 32px;
          flex-shrink: 0;
          position: relative;
        }
        .arrow-track {
          flex: 1;
          height: 2px;
          background: #2a3035;
          position: relative;
          overflow: hidden;
        }
        .arrow-fill {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 0%;
          transition: width 0.5s ease;
        }
        .arrow-pulse {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transition: left 0.9s ease;
          margin-left: -4px;
          opacity: 0.9;
        }
        .arrow-head {
          width: 0;
          height: 0;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 6px solid #3a464e;
          flex-shrink: 0;
        }
        .stage-legend {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          padding: 0 2px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: #7a8a94;
        }
        .legend-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .detail-panel {
          background: #161a1c;
          border: 1px solid #2a3035;
          border-radius: 8px;
          padding: 14px 16px;
          min-height: 72px;
          transition: border-color 0.2s;
        }
        .panel-open {
          border-color: #3a464e;
        }
        .detail-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .detail-stage-num {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        .detail-name {
          font-size: 13px;
          font-weight: 500;
          color: #e8ecee;
          flex: 1;
        }
        .detail-flag { font-size: 16px; }
        .detail-close {
          background: none;
          border: none;
          color: #4a5a64;
          cursor: pointer;
          font-size: 13px;
          padding: 2px 6px;
          border-radius: 4px;
          transition: color 0.15s;
        }
        .detail-close:hover { color: #e8ecee; }
        .detail-text {
          font-size: 12px;
          color: #7a8a94;
          line-height: 1.65;
        }
        .detail-text :global(strong) { color: #e8ecee; font-weight: 500; }
        .detail-text :global(em) {
          font-style: normal;
          color: #4a5a64;
          font-size: 11px;
          display: block;
          margin-top: 6px;
        }
        .detail-prompt {
          font-size: 12px;
          color: #4a5a64;
          font-style: italic;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
