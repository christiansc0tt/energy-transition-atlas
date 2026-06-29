'use client';
import { useState } from 'react';

export default function SupplyChainMap({ stages }) {
  const [active, setActive] = useState(1);

  return (
    <div className="supply-chain">
      <div className="stages-row">
        {stages.map((stage, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`stage-btn ${active === i ? 'active' : ''}`}
            aria-pressed={active === i}
          >
            <span className="stage-num">Stage {stage.num}</span>
            <span className="stage-name">{stage.name}</span>
            <span className="stage-flag">{stage.flag}</span>
            <span className="stage-pct">{stage.pct}</span>
          </button>
        ))}
      </div>

      <div
        className="stage-detail"
        dangerouslySetInnerHTML={{ __html: stages[active]?.detail || '' }}
      />

      <style jsx>{`
        .supply-chain {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .stages-row {
          display: grid;
          grid-template-columns: repeat(${stages.length}, 1fr);
          gap: 8px;
        }
        .stage-btn {
          background: #1e2326;
          border: 1px solid #2a3035;
          border-radius: 8px;
          padding: 10px 8px;
          cursor: pointer;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          transition: border-color 0.15s, background 0.15s;
          width: 100%;
        }
        .stage-btn:hover {
          border-color: #f5a623;
          background: rgba(245, 166, 35, 0.06);
        }
        .stage-btn.active {
          border-color: #f5a623;
          background: rgba(245, 166, 35, 0.09);
        }
        .stage-num {
          font-size: 10px;
          color: #4a5a64;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 500;
        }
        .stage-name {
          font-size: 12px;
          font-weight: 500;
          color: #e8ecee;
          line-height: 1.3;
        }
        .stage-flag {
          font-size: 18px;
          margin: 2px 0;
        }
        .stage-pct {
          font-size: 11px;
          color: #f5a623;
        }
        .stage-detail {
          background: #161a1c;
          border: 1px solid #3a464e;
          border-radius: 8px;
          padding: 14px 16px;
          font-size: 12px;
          color: #7a8a94;
          line-height: 1.65;
          min-height: 80px;
        }
        .stage-detail :global(strong) {
          color: #e8ecee;
          font-weight: 500;
        }
        .stage-detail :global(em) {
          color: #4a5a64;
          font-style: normal;
          display: block;
          margin-top: 6px;
          font-size: 11px;
        }
        @media (max-width: 640px) {
          .stages-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
