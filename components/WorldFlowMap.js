'use client';
import { useEffect, useRef, useState } from 'react';

// Flow data per sector: each flow has from/to as [lon, lat] coordinates
// and metadata for the tooltip
const sectorFlows = {
  solar: {
    label: 'Solar PV',
    nodes: [
      { id: 'us-quartz', label: 'USA', sub: 'Quartz mining', coords: [-98, 39], color: '#2ec97e', stage: 'Mining' },
      { id: 'br-quartz', label: 'Brazil', sub: 'Quartz mining', coords: [-51, -10], color: '#2ec97e', stage: 'Mining' },
      { id: 'cn-poly', label: 'China (Xinjiang)', sub: 'Polysilicon ~95%', coords: [87, 42], color: '#e84040', stage: 'Refining' },
      { id: 'cn-wafer', label: 'China', sub: 'Wafer + Cell ~94%', coords: [116, 32], color: '#e84040', stage: 'Manufacturing' },
      { id: 'vn-module', label: 'SE Asia', sub: 'Module assembly ~80%', coords: [106, 14], color: '#f5a623', stage: 'Assembly' },
      { id: 'eu-deploy', label: 'Europe / USA', sub: 'Deployment', coords: [10, 50], color: '#a78bfa', stage: 'Deployment' },
    ],
    flows: [
      { from: [-98, 39], to: [87, 42], label: 'Quartz → polysilicon', color: '#2ec97e' },
      { from: [-51, -10], to: [87, 42], label: 'Quartz → polysilicon', color: '#2ec97e' },
      { from: [87, 42], to: [116, 32], label: 'Polysilicon → wafer', color: '#e84040' },
      { from: [116, 32], to: [106, 14], label: 'Wafer → module', color: '#f5a623' },
      { from: [106, 14], to: [10, 50], label: 'Module → deployment', color: '#a78bfa' },
    ],
  },
  ai: {
    label: 'AI Hardware',
    nodes: [
      { id: 'cn-ga', label: 'China', sub: 'Gallium refining ~80%', coords: [108, 32], color: '#e84040', stage: 'Refining' },
      { id: 'tw-fab', label: 'Taiwan', sub: 'Advanced fab ~90%', coords: [121, 24], color: '#e84040', stage: 'Wafer/Fab' },
      { id: 'kr-hbm', label: 'South Korea', sub: 'HBM memory ~95%', coords: [128, 37], color: '#f5a623', stage: 'Packaging' },
      { id: 'us-dc', label: 'USA', sub: 'Data centres', coords: [-95, 38], color: '#a78bfa', stage: 'Deployment' },
      { id: 'eu-dc', label: 'Europe', sub: 'Data centres', coords: [10, 50], color: '#a78bfa', stage: 'Deployment' },
    ],
    flows: [
      { from: [108, 32], to: [121, 24], label: 'Gallium → GaAs wafer', color: '#e84040' },
      { from: [121, 24], to: [128, 37], label: 'GPU die → HBM packaging', color: '#f5a623' },
      { from: [128, 37], to: [-95, 38], label: 'Packaged GPU → US data centres', color: '#a78bfa' },
      { from: [128, 37], to: [10, 50], label: 'Packaged GPU → EU data centres', color: '#a78bfa' },
    ],
  },
  ev: {
    label: 'EV & Battery',
    nodes: [
      { id: 'cd-co', label: 'DRC', sub: 'Cobalt mining ~70%', coords: [24, -4], color: '#e84040', stage: 'Mining' },
      { id: 'cl-li', label: 'Chile', sub: 'Lithium mining ~26%', coords: [-69, -30], color: '#2ec97e', stage: 'Mining' },
      { id: 'au-li', label: 'Australia', sub: 'Lithium mining ~47%', coords: [134, -26], color: '#2ec97e', stage: 'Mining' },
      { id: 'cn-ref', label: 'China', sub: 'Refining ~70% cobalt, ~60% Li', coords: [108, 34], color: '#e84040', stage: 'Refining' },
      { id: 'cn-cell', label: 'China', sub: 'Cell manufacturing ~75%', coords: [121, 28], color: '#e84040', stage: 'Manufacturing' },
      { id: 'eu-ev', label: 'Europe', sub: 'Vehicle assembly', coords: [10, 50], color: '#a78bfa', stage: 'Deployment' },
    ],
    flows: [
      { from: [24, -4], to: [108, 34], label: 'DRC cobalt → China refining', color: '#e84040' },
      { from: [-69, -30], to: [108, 34], label: 'Chilean lithium → China refining', color: '#2ec97e' },
      { from: [134, -26], to: [108, 34], label: 'Australian lithium → China refining', color: '#2ec97e' },
      { from: [108, 34], to: [121, 28], label: 'Refined materials → cell mfg', color: '#f5a623' },
      { from: [121, 28], to: [10, 50], label: 'Cells → EU vehicle assembly', color: '#a78bfa' },
    ],
  },
  wind: {
    label: 'Wind',
    nodes: [
      { id: 'cn-ree', label: 'China', sub: 'REE mining ~60%', coords: [100, 38], color: '#e84040', stage: 'Mining' },
      { id: 'au-ree', label: 'Australia', sub: 'REE mining (Lynas)', coords: [122, -26], color: '#2ec97e', stage: 'Mining' },
      { id: 'cn-sep', label: 'China', sub: 'REE refining ~85%', coords: [115, 30], color: '#e84040', stage: 'Refining' },
      { id: 'cn-mag', label: 'China', sub: 'NdFeB magnets ~92%', coords: [121, 36], color: '#e84040', stage: 'Manufacturing' },
      { id: 'eu-wind', label: 'Europe', sub: 'Offshore wind deployment', coords: [5, 56], color: '#a78bfa', stage: 'Deployment' },
    ],
    flows: [
      { from: [100, 38], to: [115, 30], label: 'Chinese REE ore → separation', color: '#e84040' },
      { from: [122, -26], to: [115, 30], label: 'Australian ore → China separation', color: '#2ec97e' },
      { from: [115, 30], to: [121, 36], label: 'Separated REE → NdFeB magnets', color: '#f5a623' },
      { from: [121, 36], to: [5, 56], label: 'Magnets → EU wind turbines', color: '#a78bfa' },
    ],
  },
  nuclear: {
    label: 'Nuclear & SMR',
    nodes: [
      { id: 'kz-u', label: 'Kazakhstan', sub: 'Uranium mining ~45%', coords: [67, 48], color: '#2ec97e', stage: 'Mining' },
      { id: 'ca-u', label: 'Canada', sub: 'Uranium mining ~15%', coords: [-96, 60], color: '#2ec97e', stage: 'Mining' },
      { id: 'ru-enr', label: 'Russia', sub: 'Enrichment ~40%', coords: [60, 57], color: '#e84040', stage: 'Enrichment' },
      { id: 'fr-fab', label: 'France', sub: 'Fuel fabrication', coords: [2, 46], color: '#3a9fd6', stage: 'Fabrication' },
      { id: 'us-smr', label: 'USA', sub: 'SMR deployment', coords: [-95, 38], color: '#a78bfa', stage: 'Deployment' },
    ],
    flows: [
      { from: [67, 48], to: [60, 57], label: 'Kazakh uranium → Russian enrichment', color: '#2ec97e' },
      { from: [-96, 60], to: [60, 57], label: 'Canadian uranium → Russian enrichment', color: '#2ec97e' },
      { from: [60, 57], to: [2, 46], label: 'Enriched UF₆ → French fuel fab', color: '#e84040' },
      { from: [2, 46], to: [-95, 38], label: 'Fuel assemblies → US SMR', color: '#3a9fd6' },
    ],
  },
};

// Project lon/lat to SVG x/y using simple equirectangular
function project(lon, lat, width, height) {
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return [x, y];
}

// Build a curved arc path between two projected points
function arcPath(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  // Curve upward perpendicular to the line
  const cx = mx - (dy / dist) * (dist * 0.28);
  const cy = my + (dx / dist) * (dist * 0.28);
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export default function WorldFlowMap({ sectorId = 'solar' }) {
  const svgRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeFlow, setActiveFlow] = useState(null);
  const [activeNode, setActiveNode] = useState(null);
  const [animStep, setAnimStep] = useState(0);
  const [sector, setSector] = useState(sectorId);

  const W = 800;
  const H = 420;

  const data = sectorFlows[sector];

  // Animate flows sequentially
  useEffect(() => {
    setAnimStep(0);
    const interval = setInterval(() => {
      setAnimStep(s => (s + 1) % (data.flows.length + 1));
    }, 1200);
    return () => clearInterval(interval);
  }, [sector, data.flows.length]);

  // Load world map SVG paths via D3
  useEffect(() => {
    let cancelled = false;
    async function loadMap() {
      try {
        const [d3mod, topomod] = await Promise.all([
          import('d3'),
          import('topojson-client'),
        ]);
        const d3 = d3mod;
        const topojson = topomod;

        const response = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
        const world = await response.json();
        if (cancelled) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('.countries').remove();

        const projection = d3.geoNaturalEarth1()
          .scale(148)
          .translate([W / 2, H / 2]);

        const path = d3.geoPath().projection(projection);
        const countries = topojson.feature(world, world.objects.countries);

        svg.insert('g', ':first-child')
          .attr('class', 'countries')
          .selectAll('path')
          .data(countries.features)
          .join('path')
          .attr('d', path)
          .attr('fill', '#1a2226')
          .attr('stroke', '#2a3a40')
          .attr('stroke-width', 0.4);

        setMapLoaded(true);
      } catch (e) {
        setMapLoaded(true); // show fallback
      }
    }
    loadMap();
    return () => { cancelled = true; };
  }, []);

  // Project nodes and flows using D3 projection stored on ref
  const projectedNodes = data.nodes.map(n => {
    const [x, y] = project(n.coords[0], n.coords[1], W, H);
    return { ...n, x, y };
  });

  const projectedFlows = data.flows.map((f, i) => {
    const [x1, y1] = project(f.from[0], f.from[1], W, H);
    const [x2, y2] = project(f.to[0], f.to[1], W, H);
    return { ...f, x1, y1, x2, y2, path: arcPath(x1, y1, x2, y2), index: i };
  });

  const stageOrder = ['Mining', 'Refining', 'Wafer/Fab', 'Enrichment', 'Manufacturing', 'Fabrication', 'Assembly', 'Deployment'];
  const uniqueStages = [...new Set(data.nodes.map(n => n.stage))].sort((a, b) => stageOrder.indexOf(a) - stageOrder.indexOf(b));

  return (
    <div className="world-wrap">
      {/* Sector selector */}
      <div className="sector-tabs">
        {Object.entries(sectorFlows).map(([key, val]) => (
          <button
            key={key}
            className={`sec-tab ${sector === key ? 'active' : ''}`}
            onClick={() => { setSector(key); setActiveNode(null); setActiveFlow(null); }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="map-container">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          style={{ display: 'block' }}
          aria-label={`${data.label} supply chain world flow map`}
          role="img"
        >
          {/* Fallback background if D3 not loaded */}
          {!mapLoaded && (
            <rect width={W} height={H} fill="#141a1c" rx="8" />
          )}

          {/* Graticule lines */}
          {[...Array(7)].map((_, i) => (
            <line
              key={`h${i}`}
              x1={0} y1={(i + 1) * H / 8}
              x2={W} y2={(i + 1) * H / 8}
              stroke="#1e2a2e" strokeWidth="0.5"
            />
          ))}
          {[...Array(11)].map((_, i) => (
            <line
              key={`v${i}`}
              x1={(i + 1) * W / 12} y1={0}
              x2={(i + 1) * W / 12} y2={H}
              stroke="#1e2a2e" strokeWidth="0.5"
            />
          ))}

          {/* Flow arcs */}
          {projectedFlows.map((f, i) => {
            const isActive = animStep > i || activeFlow === i;
            const isHovered = activeFlow === i;
            return (
              <g key={i}>
                {/* Shadow/glow */}
                <path
                  d={f.path}
                  fill="none"
                  stroke={f.color}
                  strokeWidth={isHovered ? 5 : 3}
                  strokeOpacity={isActive ? (isHovered ? 0.25 : 0.12) : 0}
                />
                {/* Main arc */}
                <path
                  d={f.path}
                  fill="none"
                  stroke={f.color}
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  strokeOpacity={isActive ? (isHovered ? 1 : 0.65) : 0}
                  strokeDasharray={isActive ? 'none' : '4 4'}
                  style={{ transition: 'stroke-opacity 0.5s' }}
                  onMouseEnter={() => setActiveFlow(i)}
                  onMouseLeave={() => setActiveFlow(null)}
                  cursor="pointer"
                />
                {/* Animated dot travelling along arc */}
                {isActive && animStep === i + 1 && (
                  <circle r="4" fill={f.color} opacity="0.9">
                    <animateMotion dur="1.1s" path={f.path} fill="freeze" />
                  </circle>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {projectedNodes.map((n, i) => {
            const isHovered = activeNode === i;
            return (
              <g
                key={i}
                transform={`translate(${n.x}, ${n.y})`}
                onMouseEnter={() => setActiveNode(i)}
                onMouseLeave={() => setActiveNode(null)}
                cursor="pointer"
              >
                <circle
                  r={isHovered ? 10 : 7}
                  fill={n.color}
                  fillOpacity={0.2}
                  stroke={n.color}
                  strokeWidth={1.5}
                  style={{ transition: 'r 0.15s' }}
                />
                <circle r={3} fill={n.color} />
                {/* Label */}
                <text
                  x={0} y={isHovered ? -14 : -12}
                  textAnchor="middle"
                  fontSize={isHovered ? 11 : 9}
                  fill="#e8ecee"
                  fontWeight={isHovered ? '500' : '400'}
                  style={{ pointerEvents: 'none', transition: 'font-size 0.15s' }}
                >
                  {n.label}
                </text>
                {isHovered && (
                  <text x={0} y={-3} textAnchor="middle" fontSize={9} fill={n.color} style={{ pointerEvents: 'none' }}>
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip for flows */}
        {activeFlow !== null && (
          <div className="flow-tooltip">
            <span className="tooltip-dot" style={{ background: projectedFlows[activeFlow]?.color }} />
            {projectedFlows[activeFlow]?.label}
          </div>
        )}
      </div>

      {/* Stage legend */}
      <div className="map-legend">
        {uniqueStages.map((stage, i) => {
          const node = data.nodes.find(n => n.stage === stage);
          return (
            <span key={i} className="leg-item">
              <span className="leg-dot" style={{ background: node?.color || '#7a8a94' }} />
              {stage}
            </span>
          );
        })}
        <span className="leg-item leg-arc">
          <span className="leg-line" />
          Material flow
        </span>
      </div>

      <p className="map-source">
        Sources: IEA Critical Minerals Outlook 2024; USGS 2024; Benchmark Mineral Intelligence.
        Schematic — flows represent dominant trade routes, not precise volumes.
      </p>

      <style jsx>{`
        .world-wrap { display: flex; flex-direction: column; gap: 10px; }
        .sector-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
        .sec-tab { background: #161a1c; border: 1px solid #2a3035; color: #7a8a94; font-size: 11px; padding: 4px 10px; border-radius: 4px; cursor: pointer; transition: all 0.15s; }
        .sec-tab:hover { color: #e8ecee; border-color: #3a464e; }
        .sec-tab.active { background: rgba(245,166,35,0.1); border-color: rgba(245,166,35,0.3); color: #f5a623; }
        .map-container { position: relative; background: #0d1214; border: 1px solid #2a3035; border-radius: 8px; overflow: hidden; }
        .flow-tooltip { position: absolute; bottom: 12px; left: 12px; background: rgba(14,18,20,0.9); border: 1px solid #3a464e; border-radius: 5px; padding: 5px 10px; font-size: 11px; color: #e8ecee; display: flex; align-items: center; gap: 7px; pointer-events: none; }
        .tooltip-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .map-legend { display: flex; gap: 14px; flex-wrap: wrap; }
        .leg-item { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #7a8a94; }
        .leg-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .leg-arc { gap: 6px; }
        .leg-line { width: 18px; height: 2px; background: linear-gradient(90deg, #3a9fd6, #f5a623); border-radius: 1px; flex-shrink: 0; }
        .map-source { font-size: 10px; color: #4a5a64; line-height: 1.5; }
      `}</style>
    </div>
  );
}
