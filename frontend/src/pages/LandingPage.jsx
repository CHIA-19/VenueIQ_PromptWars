import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, Shield, Activity } from 'lucide-react';

// ── Animated mini-heatmap for the right hero panel ────────────────────────────
const PREVIEW_ZONES = [
  { x: 120, y: 30,  w: 60, h: 30, label: 'Gate A' },
  { x: 240, y: 30,  w: 60, h: 30, label: 'Gate B' },
  { x: 30,  y: 90,  w: 70, h: 35, label: 'N.Concourse' },
  { x: 300, y: 90,  w: 70, h: 35, label: 'FC East' },
  { x: 120, y: 100, w: 180,h: 80, label: 'Main Bowl' },
  { x: 30,  y: 165, w: 70, h: 35, label: 'FC West' },
  { x: 300, y: 165, w: 70, h: 35, label: 'S.Concourse' },
  { x: 120, y: 205, w: 60, h: 30, label: 'Gate C' },
  { x: 240, y: 205, w: 60, h: 30, label: 'Gate D' },
];

function densityColor(d) {
  if (d > 70) return { fill: '#ef4444', glow: 'rgba(239,68,68,0.5)' };
  if (d > 40) return { fill: '#f59e0b', glow: 'rgba(245,158,11,0.4)' };
  return { fill: '#10b981', glow: 'rgba(16,185,129,0.4)' };
}

function AnimatedHeatmap() {
  const [densities, setDensities] = useState(PREVIEW_ZONES.map(() => 30 + Math.random() * 60));

  useEffect(() => {
    const timer = setInterval(() => {
      setDensities(prev => prev.map(d => {
        const next = d + (Math.random() - 0.5) * 20;
        return Math.max(10, Math.min(95, next));
      }));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <svg viewBox="0 0 400 260" className="w-full h-full" style={{ filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.15))' }}>
      {/* Stadium outline */}
      <ellipse cx="200" cy="130" rx="185" ry="118" fill="none" stroke="rgba(99,102,241,0.2)" strokeWidth="2" />
      <ellipse cx="200" cy="130" rx="140" ry="85"  fill="rgba(15,23,42,0.8)" stroke="rgba(99,102,241,0.1)" strokeWidth="1" />

      {PREVIEW_ZONES.map((z, i) => {
        const d = densities[i];
        const { fill, glow } = densityColor(d);
        return (
          <g key={i}>
            <rect
              x={z.x} y={z.y} width={z.w} height={z.h} rx={6}
              fill={fill} opacity={0.75}
              style={{ transition: 'fill 1.2s ease, opacity 0.8s ease', filter: `drop-shadow(0 0 8px ${glow})` }}
            />
            <text x={z.x + z.w / 2} y={z.y + z.h / 2 + 4} textAnchor="middle"
              fill="rgba(255,255,255,0.85)" fontSize="7" fontFamily="Outfit,sans-serif" fontWeight="700">
              {z.label}
            </text>
          </g>
        );
      })}

      {/* Live pulse dot */}
      <circle cx="200" cy="130" r="5" fill="#6366f1">
        <animate attributeName="r" values="5;12;5" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

// ── Feature pills ─────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Zap,      label: 'Real-time crowd intelligence' },
  { icon: Users,    label: 'Dynamic queue management' },
  { icon: Shield,   label: 'Anomaly detection & alerts' },
  { icon: Activity, label: 'Match-phase simulation engine' },
];

// ── Stats ──────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '42K+', label: 'Attendees tracked' },
  { value: '< 3s', label: 'Update latency' },
  { value: '12',   label: 'Venue zones' },
  { value: '4',    label: 'Match phases' },
];

export default function LandingPage() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#080d18] flex flex-col">
      {/* ── Top nav ── */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Activity size={18} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            VenueIQ
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-400/10 border border-emerald-400/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Demo
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col lg:flex-row items-center overflow-hidden">

        {/* Left — Branding + CTAs */}
        <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-8 animate-slide-up">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-6 w-fit">
            <Zap size={13} className="text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">Hackathon Prototype — VenueIQ v1.0</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] mb-4">
            <span className="text-white">Smart Stadium</span>
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Experience Platform
            </span>
          </h1>

          <p className="text-slate-400 text-base lg:text-lg leading-relaxed mb-8 max-w-md">
            Real-time crowd intelligence, dynamic queue balancing, and personalized 
            attendee guidance — all driven by live sensor simulation.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-full px-3 py-1.5">
                <Icon size={12} className="text-blue-400" />
                <span className="text-xs text-slate-300 font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Link
              to="/dashboard"
              id="cta-dashboard"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              Open Ops Dashboard
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/app"
              id="cta-attendee"
              className="flex items-center justify-center gap-2 bg-white/8 hover:bg-white/12 border border-white/12 text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Attendee App
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 border-t border-white/6 pt-6 max-w-md">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-black text-white">{value}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5 leading-tight">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Animated heatmap preview */}
        <div className="flex-1 flex items-center justify-center px-8 py-8 lg:py-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative w-full max-w-[520px]">
            {/* Glow backdrop */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-purple-600/10 rounded-3xl blur-3xl" />

            {/* Card */}
            <div className="relative rounded-3xl border border-white/8 bg-slate-900/60 backdrop-blur-xl p-6 shadow-2xl">
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-bold text-white">Live Crowd Heatmap</div>
                  <div className="text-xs text-slate-500">DY Patil Stadium · Pre-Match</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400">LIVE</span>
                </div>
              </div>

              {/* SVG map */}
              <div className="w-full aspect-[400/260]">
                <AnimatedHeatmap />
              </div>

              {/* Legend */}
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-white/5">
                {[['#10b981', '< 40%', 'Low'], ['#f59e0b', '40–70%', 'Moderate'], ['#ef4444', '> 70%', 'High']].map(([color, pct, label]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <span className="text-[10px] text-slate-400 font-medium">{pct} {label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Background mesh gradient ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-600/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
