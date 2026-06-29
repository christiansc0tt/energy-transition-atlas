'use client';
import { useState } from 'react';
import SectorPage from '../components/SectorPage';
import MineralsPage from '../components/MineralsPage';
import { solar } from '../data/solar';
import { aiHardware } from '../data/aiHardware';
import { ev, wind, nuclear } from '../data/sectors';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'ai', label: 'AI Hardware' },
  { id: 'solar', label: 'Solar PV' },
  { id: 'ev', label: 'EV & Battery' },
  { id: 'wind', label: 'Wind' },
  { id: 'nuclear', label: 'Nuclear & SMR' },
  { id: 'minerals', label: 'Cross-sector minerals' },
];

const sectorData = {
  ai: aiHardware,
  solar: solar,
  ev: ev,
  wind: wind,
  nuclear: nuclear,
};

export default function Home() {
  const [active, setActive] = useState('overview');

  return (
    <div className="atlas">
      {/* Nav */}
      <nav className="nav" role="navigation" aria-label="Sector tabs">
        <div className="nav-brand">
          <span className="brand-bolt">⚡</span>
          Energy Transition Atlas
        </div>
        <div className="nav-tabs" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={active === tab.id}
              className={`nav-tab ${active === tab.id ? 'active' : ''}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <main className="main">
        {active === 'overview' && <OverviewPage setActive={setActive} />}
        {active === 'minerals' && <MineralsPage />}
        {sectorData[active] && <SectorPage sector={sectorData[active]} />}
      </main>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 14px; }
        body {
          background: #0d0f10;
          color: #e8ecee;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>

      <style jsx>{`
        .atlas { min-height: 100vh; background: #0d0f10; }
        .nav {
          background: #0b0d0e;
          border-bottom: 1px solid #2a3035;
          display: flex;
          align-items: center;
          padding: 0 24px;
          height: 46px;
          position: sticky;
          top: 0;
          z-index: 100;
          gap: 0;
        }
        .nav-brand {
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #f5a623;
          display: flex;
          align-items: center;
          gap: 7px;
          margin-right: 28px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .brand-bolt { font-size: 14px; }
        .nav-tabs {
          display: flex;
          overflow-x: auto;
          scrollbar-width: none;
          gap: 0;
        }
        .nav-tabs::-webkit-scrollbar { display: none; }
        .nav-tab {
          padding: 0 15px;
          height: 46px;
          display: flex;
          align-items: center;
          font-size: 13px;
          font-weight: 400;
          color: #7a8a94;
          cursor: pointer;
          white-space: nowrap;
          border: none;
          border-bottom: 2px solid transparent;
          background: none;
          transition: color 0.15s, border-color 0.15s;
        }
        .nav-tab:hover { color: #e8ecee; }
        .nav-tab.active { color: #e8ecee; border-bottom-color: #f5a623; }
        .main { padding: 28px 24px; max-width: 1100px; margin: 0 auto; }
        @media (max-width: 768px) {
          .nav { padding: 0 16px; }
          .main { padding: 20px 16px; }
        }
      `}</style>
    </div>
  );
}

function OverviewPage({ setActive }) {
  const sectors = [
    { id: 'ai', icon: '🖥️', name: 'AI Hardware', tag: 'Anchor sector', desc: 'Gallium, germanium, and the dual-use minerals that power both data centres and missile guidance systems.' },
    { id: 'solar', icon: '☀️', name: 'Solar PV', tag: 'High concentration', desc: '94% Chinese polysilicon & wafer capacity. A panel built in coal country that pays back its carbon in months.' },
    { id: 'ev', icon: '🔋', name: 'EV & Battery', tag: 'Cobalt / lithium chokepoints', desc: 'DRC cobalt, Chilean lithium, Chinese cathode. More concentrated than the oil supply chain it replaces.' },
    { id: 'wind', icon: '🌬️', name: 'Wind', tag: 'NdFeB magnets', desc: 'Neodymium and dysprosium for permanent-magnet turbines. China holds 85% of rare-earth refining capacity.' },
    { id: 'nuclear', icon: '⚛️', name: 'Nuclear & SMR', tag: 'HALEU bottleneck', desc: 'Russian enrichment dependency and the HALEU supply gap constraining tech-sector SMR ambitions.' },
    { id: 'minerals', icon: '💎', name: 'Cross-sector minerals', tag: 'Shared bottlenecks', desc: 'The minerals that span multiple technologies — and the AI analyst that maps their risk.' },
  ];

  return (
    <div className="overview">
      <div className="hero">
        <h1 className="hero-title">
          Every clean technology depends on supply chains that are{' '}
          <span className="accent">carbon-intensive, concentrated,</span> and
          geopolitically contested.
        </h1>
        <p className="hero-sub">
          The transition is real. So is the paradox. This atlas maps the
          materials, geography, and embedded carbon behind seven sectors —
          mine to deployment.
        </p>
      </div>

      <div className="sector-grid">
        {sectors.map((s) => (
          <button key={s.id} className="sector-card" onClick={() => setActive(s.id)}>
            <span className="sc-icon">{s.icon}</span>
            <span className="sc-name">{s.name}</span>
            <span className="sc-tag">{s.tag}</span>
            <span className="sc-desc">{s.desc}</span>
          </button>
        ))}
      </div>

      <div className="thesis-box">
        <p className="thesis-label">Thesis — the transition paradox</p>
        <p className="thesis-text">
          The energy transition is not clean by default — it is carbon-intensive
          and geopolitically concentrated at its upstream. A solar panel is mostly
          Chinese polysilicon made with coal power. A wind turbine rotor depends
          on Chinese rare-earth refining. An EV battery moves Congo cobalt through
          South Korean or Chinese cathode plants. An AI data centre draws on gallium
          and germanium whose export is now controlled by Beijing.
        </p>
        <p className="thesis-text" style={{ marginTop: 10 }}>
          None of this negates the transition. It reframes it. For investors,
          policymakers, and analysts, understanding the supply chain — its carbon
          intensity, its geographic concentration, its geopolitical exposure — is
          the prerequisite for honest transition risk assessment.
        </p>
      </div>

      <style jsx>{`
        .overview { display: flex; flex-direction: column; gap: 28px; }
        .hero { text-align: center; padding: 36px 0 16px; }
        .hero-title { font-size: 20px; font-weight: 500; color: #e8ecee; max-width: 580px; margin: 0 auto 12px; line-height: 1.5; }
        .accent { color: #f5a623; }
        .hero-sub { font-size: 14px; color: #7a8a94; max-width: 480px; margin: 0 auto; line-height: 1.6; }
        .sector-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .sector-card { background: #1e2326; border: 1px solid #2a3035; border-radius: 10px; padding: 18px; cursor: pointer; text-align: left; display: flex; flex-direction: column; gap: 5px; transition: border-color 0.18s, background 0.18s; }
        .sector-card:hover { border-color: #f5a623; background: rgba(245,166,35,0.04); }
        .sc-icon { font-size: 22px; margin-bottom: 4px; }
        .sc-name { font-size: 15px; font-weight: 500; color: #e8ecee; }
        .sc-tag { font-size: 11px; color: #f5a623; font-weight: 500; }
        .sc-desc { font-size: 12px; color: #7a8a94; line-height: 1.5; margin-top: 2px; }
        .thesis-box { background: #1e2326; border: 1px solid #2a3035; border-radius: 10px; padding: 20px; }
        .thesis-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.07em; color: #7a8a94; margin-bottom: 10px; font-weight: 500; }
        .thesis-text { font-size: 13px; color: #7a8a94; line-height: 1.72; }
        @media (max-width: 768px) {
          .sector-grid { grid-template-columns: 1fr 1fr; }
          .hero-title { font-size: 17px; }
        }
      `}</style>
    </div>
  );
}
