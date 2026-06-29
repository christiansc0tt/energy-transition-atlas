'use client';
import { useState } from 'react';
import { minerals, aiSystemPrompt, suggestedQueries } from '../data/minerals';

const riskColors = {
  critical: { bg: 'rgba(232,64,64,0.15)', color: '#ff6060', label: 'Critical' },
  high: { bg: 'rgba(245,166,35,0.15)', color: '#f5a623', label: 'High' },
  medium: { bg: 'rgba(46,201,126,0.1)', color: '#5ee09a', label: 'Medium' },
};

const levelColors = {
  core: { bg: '#c03030', label: 'Core' },
  secondary: { bg: '#7a6020', label: 'Sec.' },
};

function Cell({ dep }) {
  if (!dep) return <td className="cell empty">—</td>;
  const c = levelColors[dep.level];
  return (
    <td className="cell">
      <span
        className="dep-pill"
        style={{ background: c.bg }}
        title={dep.label}
      >
        {dep.label}
      </span>
      <style jsx>{`
        .cell { padding: 9px 10px; border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle; }
        .cell.empty { color: #4a5a64; text-align: center; }
        .dep-pill { font-size: 10px; font-weight: 500; padding: 2px 7px; border-radius: 3px; color: #e8ecee; white-space: nowrap; }
      `}</style>
    </td>
  );
}

export default function MineralsPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  async function runQuery(q) {
    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: aiSystemPrompt,
          messages: [{ role: 'user', content: q }],
        }),
      });
      const data = await res.json();
      const text = data.content
        ?.filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('') || 'No response received.';
      setResponse(text);
    } catch {
      setResponse('Analysis unavailable — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="minerals-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Cross-sector minerals</h1>
          <p className="page-subtitle">
            Which minerals are shared chokepoints across multiple transition
            technologies? Cobalt, REEs, and gallium each span 3+ sectors — and
            China controls the processing of all three.
          </p>
        </div>
        <div className="paradox-badge">⚠ Shared bottlenecks</div>
      </div>

      {/* Minerals table */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Mineral exposure by sector</span>
          <span className="panel-tag amber">China processing share + dual-use flag</span>
        </div>
        <div className="table-wrap">
          <table className="minerals-table">
            <thead>
              <tr>
                <th>Mineral</th>
                <th>Solar PV</th>
                <th>EV / Battery</th>
                <th>Wind</th>
                <th>AI Hardware</th>
                <th>Nuclear</th>
                <th>CN processing</th>
                <th>Risk</th>
                <th>Dual-use</th>
              </tr>
            </thead>
            <tbody>
              {minerals.map((m, i) => {
                const risk = riskColors[m.risk];
                return (
                  <tr key={i}>
                    <td className="mineral-name">{m.name}</td>
                    <Cell dep={m.solar} />
                    <Cell dep={m.ev} />
                    <Cell dep={m.wind} />
                    <Cell dep={m.ai} />
                    <Cell dep={m.nuclear} />
                    <td className="cell-pct">
                      {m.cnProcessing != null ? `${m.cnProcessing}%` : '—'}
                    </td>
                    <td className="cell-risk">
                      <span
                        className="risk-pill"
                        style={{ background: risk.bg, color: risk.color }}
                      >
                        {risk.label}
                      </span>
                    </td>
                    <td className="cell-dual">
                      {m.dualUse ? (
                        <span title={m.dualUseNote} className="dual-flag">
                          🛡 {m.dualUseNote}
                        </span>
                      ) : (
                        <span className="empty-cell">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="table-note">
          Core = technology does not function without this mineral. Sec. = secondary
          dependency, substitution possible but costly. 🛡 = same refined form used
          in weapons systems. China export controls on gallium, germanium, graphite,
          and REEs target clean tech and western defence supply chains simultaneously.
          <span className="source"> IEA Critical Minerals Outlook 2024; CSIS; Pentagon Critical Materials Report 2023</span>
        </p>
      </div>

      {/* AI Analyst */}
      <div className="ai-panel">
        <div className="ai-header">
          <span className="ai-title">✦ AI risk analyst</span>
          <span className="ai-subtitle">Ask about mineral exposure, geopolitical risk, or investment implications</span>
        </div>

        <div className="suggested">
          {suggestedQueries.map((q, i) => (
            <button
              key={i}
              className="sq-btn"
              onClick={() => {
                setQuery(q);
                runQuery(q);
              }}
            >
              {q}
            </button>
          ))}
        </div>

        <div className="input-row">
          <input
            type="text"
            className="query-input"
            placeholder="Ask about mineral risk, geopolitical exposure, or investment implications..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) runQuery(query.trim());
            }}
          />
          <button
            className="run-btn"
            onClick={() => query.trim() && runQuery(query.trim())}
            disabled={loading}
          >
            {loading ? '...' : 'Ask ↗'}
          </button>
        </div>

        {(loading || response) && (
          <div className="ai-response">
            {loading ? (
              <span className="loading-text">Analysing supply chain data...</span>
            ) : (
              <>
                <p className="response-label">AI risk analysis</p>
                <p className="response-text">{response}</p>
              </>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .minerals-page { display: flex; flex-direction: column; gap: 16px; }
        .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .page-title { font-size: 22px; font-weight: 500; color: #e8ecee; margin-bottom: 6px; }
        .page-subtitle { font-size: 13px; color: #7a8a94; max-width: 500px; line-height: 1.55; }
        .paradox-badge { background: rgba(245,166,35,0.1); border: 1px solid rgba(245,166,35,0.28); color: #f5a623; font-size: 11px; font-weight: 500; padding: 6px 12px; border-radius: 20px; white-space: nowrap; flex-shrink: 0; }
        .panel { background: #1e2326; border: 1px solid #2a3035; border-radius: 10px; padding: 16px; }
        .panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
        .panel-title { font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em; color: #7a8a94; }
        .panel-tag { background: rgba(58,159,214,0.13); color: #3a9fd6; font-size: 11px; padding: 3px 8px; border-radius: 4px; }
        .panel-tag.amber { background: rgba(245,166,35,0.13); color: #f5a623; }
        .table-wrap { overflow-x: auto; }
        .minerals-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .minerals-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #4a5a64; padding: 8px 10px; text-align: left; border-bottom: 1px solid #2a3035; white-space: nowrap; }
        .mineral-name { padding: 9px 10px; border-bottom: 1px solid rgba(255,255,255,0.04); color: #e8ecee; font-weight: 500; font-size: 12px; white-space: nowrap; }
        .cell-pct { padding: 9px 10px; border-bottom: 1px solid rgba(255,255,255,0.04); color: #f5a623; font-size: 12px; font-weight: 500; text-align: center; }
        .cell-risk { padding: 9px 10px; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .risk-pill { font-size: 10px; font-weight: 500; padding: 2px 7px; border-radius: 3px; }
        .cell-dual { padding: 9px 10px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 11px; }
        .dual-flag { color: #ff8080; cursor: help; }
        .empty-cell { color: #4a5a64; }
        .minerals-table tr:hover .mineral-name,
        .minerals-table tr:hover td { background: rgba(255,255,255,0.02); }
        .table-note { font-size: 11px; color: #4a5a64; line-height: 1.6; margin-top: 14px; padding-top: 14px; border-top: 1px solid #2a3035; }
        .source { display: block; margin-top: 4px; }
        .ai-panel { background: #1e2326; border: 1px solid #2a3035; border-radius: 10px; padding: 16px; }
        .ai-header { margin-bottom: 12px; }
        .ai-title { font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.07em; color: #3a9fd6; display: block; margin-bottom: 4px; }
        .ai-subtitle { font-size: 12px; color: #7a8a94; }
        .suggested { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
        .sq-btn { background: #161a1c; border: 1px solid #2a3035; color: #7a8a94; font-size: 11px; padding: 6px 12px; border-radius: 16px; cursor: pointer; transition: all 0.15s; }
        .sq-btn:hover { border-color: #3a9fd6; color: #3a9fd6; background: rgba(58,159,214,0.07); }
        .input-row { display: flex; gap: 8px; }
        .query-input { flex: 1; background: #161a1c; border: 1px solid #2a3035; border-radius: 6px; padding: 9px 12px; font-size: 12px; color: #e8ecee; outline: none; }
        .query-input:focus { border-color: #3a9fd6; }
        .query-input::placeholder { color: #4a5a64; }
        .run-btn { background: rgba(58,159,214,0.13); border: 1px solid rgba(58,159,214,0.28); color: #3a9fd6; font-size: 12px; padding: 9px 16px; border-radius: 6px; cursor: pointer; white-space: nowrap; }
        .run-btn:hover { background: rgba(58,159,214,0.22); }
        .run-btn:disabled { opacity: 0.5; cursor: default; }
        .ai-response { background: #161a1c; border: 1px solid #3a464e; border-radius: 8px; padding: 14px; margin-top: 12px; }
        .loading-text { font-size: 12px; color: #4a5a64; font-style: italic; }
        .response-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; color: #3a9fd6; margin-bottom: 8px; font-weight: 500; }
        .response-text { font-size: 13px; color: #e8ecee; line-height: 1.7; }
      `}</style>
    </div>
  );
}
