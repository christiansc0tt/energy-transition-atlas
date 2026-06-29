'use client';

const colors = {
  red: { bar: '#e84040', text: '#e84040' },
  amber: { bar: '#f5a623', text: '#f5a623' },
  green: { bar: '#2ec97e', text: '#2ec97e' },
  blue: { bar: '#3a9fd6', text: '#3a9fd6' },
};

export default function ConcentrationBars({ items, whyItMatters, whySource }) {
  return (
    <div className="conc-wrap">
      <div className="bars">
        {items.map((item, i) => {
          const c = colors[item.color] || colors.amber;
          return (
            <div key={i} className="conc-row">
              <span className="conc-label">{item.label}</span>
              <div className="conc-track">
                <div
                  className="conc-fill"
                  style={{ width: `${item.pct}%`, background: c.bar }}
                />
              </div>
              <span className="conc-pct" style={{ color: c.text }}>{item.pct}%</span>
            </div>
          );
        })}
      </div>

      {whyItMatters && (
        <div className="why-box">
          <p
            className="why-text"
            dangerouslySetInnerHTML={{ __html: whyItMatters }}
          />
          {whySource && <p className="why-source">{whySource}</p>}
        </div>
      )}

      <style jsx>{`
        .conc-wrap {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .bars {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-bottom: 14px;
        }
        .conc-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .conc-label {
          font-size: 12px;
          color: #e8ecee;
          width: 160px;
          flex-shrink: 0;
        }
        .conc-track {
          flex: 1;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 3px;
          height: 6px;
          overflow: hidden;
        }
        .conc-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .conc-pct {
          font-size: 12px;
          font-weight: 500;
          width: 36px;
          text-align: right;
          flex-shrink: 0;
        }
        .why-box {
          padding-top: 14px;
          border-top: 1px solid #2a3035;
        }
        .why-text {
          font-size: 12px;
          color: #7a8a94;
          line-height: 1.65;
          margin-bottom: 6px;
        }
        .why-text :global(strong) {
          color: #e8ecee;
          font-style: italic;
        }
        .why-text :global(em) {
          font-style: italic;
        }
        .why-source {
          font-size: 11px;
          color: #4a5a64;
        }
      `}</style>
    </div>
  );
}
