import { useState } from 'react';

// ── Zone definitions: SVG layout for top-down stadium view ────────────────────
// viewBox: 0 0 640 380
const ZONE_SHAPES = [
  // Gates (top)
  { id: 'gate-a',          label: 'Gate A',          x: 210, y: 18,  w: 90, h: 42, rx: 8 },
  { id: 'gate-b',          label: 'Gate B',          x: 340, y: 18,  w: 90, h: 42, rx: 8 },
  // Parking (sides + bottom)
  { id: 'parking-1',       label: 'Parking 1',       x: 18,  y: 140, w: 85, h: 100, rx: 10 },
  { id: 'parking-3',       label: 'Parking 3',       x: 537, y: 140, w: 85, h: 100, rx: 10 },
  { id: 'parking-2',       label: 'Parking 2',       x: 250, y: 310, w: 140, h: 55, rx: 8 },
  // Concourses (inner ring - sides)
  { id: 'north-concourse', label: 'N. Concourse',    x: 115, y: 100, w: 90, h: 180, rx: 12 },
  { id: 'south-concourse', label: 'S. Concourse',    x: 435, y: 100, w: 90, h: 180, rx: 12 },
  // Food courts (inner ring - corners)
  { id: 'food-court-east', label: 'Food Court East', x: 435, y: 62,  w: 90, h: 80,  rx: 10 },
  { id: 'food-court-west', label: 'Food Court West', x: 115, y: 238, w: 90, h: 80,  rx: 10 },
  // Gates (bottom)
  { id: 'gate-c',          label: 'Gate C',          x: 210, y: 325, w: 90, h: 42, rx: 8 },
  { id: 'gate-d',          label: 'Gate D',          x: 340, y: 325, w: 90, h: 42, rx: 8 },
  // Main Bowl (center ellipse — rendered separately)
];

const BOWL = { cx: 320, cy: 190, rx: 100, ry: 75, label: 'Main Bowl' };

function densityFill(d) {
  if (d > 70) return { fill: '#ef4444', glow: '0 0 20px rgba(239,68,68,0.5)', opacity: 0.82 };
  if (d > 40) return { fill: '#f59e0b', glow: '0 0 20px rgba(245,158,11,0.45)', opacity: 0.78 };
  return { fill: '#10b981', glow: '0 0 16px rgba(16,185,129,0.4)', opacity: 0.74 };
}

function densityLevel(d) {
  if (d > 70) return 'HIGH';
  if (d > 40) return 'MED';
  return 'LOW';
}

export default function StadiumHeatmap({ zones = [] }) {
  const [hovered, setHovered] = useState(null);

  const zoneMap = {};
  zones.forEach(z => { zoneMap[z.id] = z; });

  const bowlZone  = zoneMap['main-bowl'];
  const hoveredZone = hovered ? (zoneMap[hovered] || null) : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Live Crowd Heatmap</h2>
        <div className="flex items-center gap-4">
          {[['#10b981','Low (< 40%)'], ['#f59e0b','Moderate (40–70%)'], ['#ef4444','High (> 70%)']].map(([c,l]) => (
            <div key={l} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />
              <span className="text-[10px] text-slate-500 font-medium">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <svg
          viewBox="0 0 640 385"
          className="w-full h-full"
          style={{ filter: 'drop-shadow(0 4px 40px rgba(0,0,0,0.5))' }}
        >
          {/* ── Stadium outer ring ── */}
          <ellipse cx="320" cy="190" rx="298" ry="188" fill="#0f172a" stroke="rgba(99,102,241,0.15)" strokeWidth="2" />
          {/* ── Track / field border ── */}
          <ellipse cx="320" cy="190" rx="115" ry="88" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="1" strokeDasharray="4 4" />

          {/* ── Rectangular zones ── */}
          {ZONE_SHAPES.map(z => {
            const zone = zoneMap[z.id];
            const d    = zone?.density ?? 30;
            const { fill, glow, opacity } = densityFill(d);
            const isHov = hovered === z.id;

            return (
              <g key={z.id}
                onMouseEnter={() => setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={z.x} y={z.y} width={z.w} height={z.h} rx={z.rx}
                  fill={fill}
                  opacity={isHov ? 1 : opacity}
                  style={{
                    transition: 'fill 1.1s ease, opacity 0.7s ease',
                    filter: isHov ? `drop-shadow(${glow})` : `drop-shadow(0 0 8px ${fill}55)`,
                  }}
                />
                {/* Label */}
                <text
                  x={z.x + z.w / 2} y={z.y + z.h / 2 - 4}
                  textAnchor="middle" fill="rgba(255,255,255,0.9)"
                  fontSize={z.w > 85 ? 8 : 7} fontFamily="Outfit,sans-serif" fontWeight="700"
                >
                  {z.label}
                </text>
                <text
                  x={z.x + z.w / 2} y={z.y + z.h / 2 + 8}
                  textAnchor="middle" fill="rgba(255,255,255,0.7)"
                  fontSize="7" fontFamily="Outfit,sans-serif" fontWeight="800"
                >
                  {Math.round(d)}% · {densityLevel(d)}
                </text>
              </g>
            );
          })}

          {/* ── Main Bowl (ellipse) ── */}
          {(() => {
            const d = bowlZone?.density ?? 30;
            const { fill, glow, opacity } = densityFill(d);
            const isHov = hovered === 'main-bowl';
            return (
              <g
                onMouseEnter={() => setHovered('main-bowl')}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <ellipse
                  cx={BOWL.cx} cy={BOWL.cy} rx={BOWL.rx} ry={BOWL.ry}
                  fill={fill} opacity={isHov ? 1 : opacity}
                  style={{
                    transition: 'fill 1.1s ease, opacity 0.7s ease',
                    filter: isHov ? `drop-shadow(${glow})` : `drop-shadow(0 0 10px ${fill}55)`,
                  }}
                />
                {/* Pitch markings */}
                <ellipse cx={BOWL.cx} cy={BOWL.cy} rx={70} ry={50} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                <line x1={BOWL.cx} y1={BOWL.cy - 50} x2={BOWL.cx} y2={BOWL.cy + 50} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                <circle cx={BOWL.cx} cy={BOWL.cy} r="8" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

                <text x={BOWL.cx} y={BOWL.cy - 6} textAnchor="middle" fill="rgba(255,255,255,0.9)"
                  fontSize="9" fontFamily="Outfit,sans-serif" fontWeight="700">Main Bowl</text>
                <text x={BOWL.cx} y={BOWL.cy + 10} textAnchor="middle" fill="rgba(255,255,255,0.7)"
                  fontSize="8" fontFamily="Outfit,sans-serif" fontWeight="800">
                  {Math.round(d)}% · {densityLevel(d)}
                </text>
              </g>
            );
          })()}

          {/* ── Connectors (decorative paths between zones) ── */}
          <path d="M255 60 L255 100" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" fill="none" />
          <path d="M385 60 L385 100" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" fill="none" />
          <path d="M205 318 L205 325" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" fill="none" />
          <path d="M435 318 L435 325" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" fill="none" />
        </svg>

        {/* ── Hover tooltip ── */}
        {hoveredZone && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 glass-dark rounded-xl px-4 py-2.5 pointer-events-none animate-fade-in border border-white/8 shadow-xl">
            <div className="text-sm font-bold text-white">{hoveredZone.name}</div>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-400">Density: <strong className="text-white">{Math.round(hoveredZone.density)}%</strong></span>
              <span className="text-xs text-slate-400">Type: <strong className="text-white capitalize">{hoveredZone.type}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
