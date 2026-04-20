import { useState } from 'react';
import { useVenue } from '../../context/VenueContext';
import { Navigation, Clock } from 'lucide-react';

// ── Simplified SVG zone layout (attendee perspective) ─────────────────────────
const NAV_ZONES = [
  { id: 'gate-a',          label: 'Gate A',       x: 150, y: 15,  w: 70, h: 32, rx: 6 },
  { id: 'gate-b',          label: 'Gate B',       x: 260, y: 15,  w: 70, h: 32, rx: 6 },
  { id: 'north-concourse', label: 'N.Concourse',  x: 70,  y: 65,  w: 75, h: 120, rx: 8 },
  { id: 'south-concourse', label: 'S.Concourse',  x: 335, y: 65,  w: 75, h: 120, rx: 8 },
  { id: 'food-court-east', label: 'FC East',      x: 335, y: 48,  w: 75, h: 55,  rx: 7 },
  { id: 'food-court-west', label: 'FC West',      x: 70,  y: 165, w: 75, h: 55,  rx: 7 },
  { id: 'main-bowl',       label: 'Main Bowl',    cx: 240, cy: 130, rx: 80, ry: 58, ellipse: true },
  { id: 'gate-c',          label: 'Gate C',       x: 150, y: 225, w: 70, h: 32, rx: 6 },
  { id: 'gate-d',          label: 'Gate D',       x: 260, y: 225, w: 70, h: 32, rx: 6 },
];

// Route paths from Section 114 (near Gate C) to each zone
const ROUTES = {
  'gate-a':          { path: 'M 185 240 Q 185 130 185 47', walkMins: 7 },
  'gate-b':          { path: 'M 185 240 Q 295 130 295 47', walkMins: 8 },
  'north-concourse': { path: 'M 185 240 Q 120 180 107 125', walkMins: 4 },
  'south-concourse': { path: 'M 185 240 Q 290 200 372 125', walkMins: 5 },
  'food-court-east': { path: 'M 185 240 Q 300 160 372 75',  walkMins: 6 },
  'food-court-west': { path: 'M 185 240 Q 130 200 107 192', walkMins: 3 },
  'main-bowl':       { path: 'M 185 240 Q 200 190 240 130', walkMins: 2 },
  'gate-c':          { path: 'M 185 240 L 185 240',          walkMins: 0 },
  'gate-d':          { path: 'M 185 240 Q 240 235 295 240', walkMins: 1 },
};

function densityColor(d) {
  if (d > 70) return '#ef4444';
  if (d > 40) return '#f59e0b';
  return '#10b981';
}

export default function NavigateTab() {
  const { venueState } = useVenue();
  const [selected, setSelected] = useState(null);

  const zones  = venueState?.zones || [];
  const zoneMap = {};
  zones.forEach(z => { zoneMap[z.id] = z; });

  const selectedZone  = selected ? zoneMap[selected] : null;
  const selectedRoute = selected ? ROUTES[selected] : null;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      <div className="mb-3">
        <h2 className="text-lg font-black text-slate-800">Indoor Navigation</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Tap any zone to get directions</p>
      </div>

      {/* SVG Map */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 mb-4 shadow-sm">
        <svg viewBox="0 0 480 272" className="w-full">
          {/* Stadium outline */}
          <ellipse cx="240" cy="133" rx="225" ry="132" fill="white" stroke="#e2e8f0" strokeWidth="2" />

          {/* Route path */}
          {selectedRoute && selectedRoute.walkMins > 0 && (
            <path
              d={selectedRoute.path}
              fill="none"
              stroke="#6366f1"
              strokeWidth="3"
              strokeDasharray="6 4"
              strokeLinecap="round"
              opacity="0.8"
              style={{
                strokeDashoffset: 0,
                animation: 'none',
              }}
            />
          )}

          {/* Zones */}
          {NAV_ZONES.map(z => {
            const zone  = zoneMap[z.id];
            const d     = zone?.density ?? 30;
            const fill  = densityColor(d);
            const isSel = selected === z.id;

            if (z.ellipse) {
              return (
                <g key={z.id} onClick={() => setSelected(isSel ? null : z.id)} style={{ cursor: 'pointer' }}>
                  <ellipse cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry}
                    fill={fill} opacity={isSel ? 0.9 : 0.65}
                    stroke={isSel ? '#6366f1' : 'transparent'} strokeWidth="2"
                    style={{ transition: 'fill 1s ease, opacity 0.6s ease' }}
                  />
                  <text x={z.cx} y={z.cy - 4} textAnchor="middle" fill="white" fontSize="7" fontFamily="Outfit,sans-serif" fontWeight="700">{z.label}</text>
                  <text x={z.cx} y={z.cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="6" fontFamily="Outfit,sans-serif" fontWeight="800">{Math.round(d)}%</text>
                </g>
              );
            }

            return (
              <g key={z.id} onClick={() => setSelected(isSel ? null : z.id)} style={{ cursor: 'pointer' }}>
                <rect x={z.x} y={z.y} width={z.w} height={z.h} rx={z.rx}
                  fill={fill} opacity={isSel ? 0.9 : 0.65}
                  stroke={isSel ? '#6366f1' : 'transparent'} strokeWidth="2"
                  style={{ transition: 'fill 1s ease, opacity 0.6s ease' }}
                />
                <text x={z.x + z.w/2} y={z.y + 13} textAnchor="middle" fill="white" fontSize="6.5" fontFamily="Outfit,sans-serif" fontWeight="700">{z.label}</text>
                <text x={z.x + z.w/2} y={z.y + 23} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="6" fontFamily="Outfit,sans-serif" fontWeight="800">{Math.round(d)}%</text>
              </g>
            );
          })}

          {/* YOU ARE HERE — Section 114 pulsing dot */}
          <g>
            <circle cx="185" cy="240" r="10" fill="#6366f1" opacity="0.2">
              <animate attributeName="r" values="10;18;10" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="185" cy="240" r="6" fill="#6366f1" />
            <circle cx="185" cy="240" r="3" fill="white" />
            <text x="185" y="257" textAnchor="middle" fill="#4f46e5" fontSize="7" fontFamily="Outfit,sans-serif" fontWeight="800">YOU (Sec 114)</text>
          </g>
        </svg>
      </div>

      {/* Route info card */}
      {selectedZone && selectedRoute ? (
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 animate-slide-up">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-blue-900 text-sm">{selectedZone.name}</h3>
              <p className="text-xs text-blue-600 mt-0.5">Route from Section 114</p>
            </div>
            {selectedRoute.walkMins === 0 ? (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 border border-emerald-200 rounded-full px-3 py-1">You're here!</span>
            ) : (
              <div className="flex items-center gap-1 text-blue-700 bg-blue-100 border border-blue-200 rounded-full px-3 py-1">
                <Clock size={11} />
                <span className="text-[11px] font-bold">{selectedRoute.walkMins} min walk</span>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              selectedZone.density > 70 ? 'bg-red-100 text-red-600' : selectedZone.density > 40 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {selectedZone.density > 70 ? '🔴 High Density' : selectedZone.density > 40 ? '🟡 Moderate' : '🟢 Clear'}
            </div>
            <span className="text-[10px] text-slate-500">{Math.round(selectedZone.density)}% capacity</span>
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all active:scale-95">
            <Navigation size={13} />
            Start Navigation
          </button>
        </div>
      ) : (
        <div className="text-center text-slate-400 text-sm py-4">
          Tap a zone on the map to see directions
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-slate-100">
        {[['#10b981','Low'], ['#f59e0b','Moderate'], ['#ef4444','High']].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: c }} />
            <span className="text-[10px] text-slate-500 font-medium">{l}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-[10px] text-slate-500 font-medium">You</span>
        </div>
      </div>
    </div>
  );
}
