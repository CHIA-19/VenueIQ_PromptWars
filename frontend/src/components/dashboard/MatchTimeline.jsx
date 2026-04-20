import { useVenue } from '../../context/VenueContext';

const PHASES = [
  { id: 'PRE_MATCH', label: 'Pre-Match', emoji: '🏟️', desc: 'Gates surge, parking fills' },
  { id: 'KICKOFF',   label: 'Kick-off',  emoji: '⚽', desc: 'Bowl fills, gates calm' },
  { id: 'HALFTIME',  label: 'Half Time', emoji: '🔔', desc: 'Concourses + food courts spike' },
  { id: 'FULL_TIME', label: 'Full Time', emoji: '🏆', desc: 'All exits surge' },
];

export default function MatchTimeline() {
  const { phase, changePhase } = useVenue();
  const currentIdx = PHASES.findIndex(p => p.id === phase);

  return (
    <div className="rounded-2xl border border-white/6 bg-slate-800/40 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Match Timeline</h2>
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
          Click phase to simulate ↓
        </span>
      </div>

      {/* Track */}
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700 rounded-full" />
        <div
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${(currentIdx / (PHASES.length - 1)) * 100}%` }}
        />

        {/* Phase buttons */}
        <div className="relative flex justify-between">
          {PHASES.map((p, i) => {
            const isActive   = p.id === phase;
            const isPast     = i < currentIdx;
            return (
              <button
                key={p.id}
                id={`phase-${p.id.toLowerCase()}`}
                onClick={() => changePhase(p.id)}
                className="flex flex-col items-center gap-2 group"
                title={p.desc}
              >
                {/* Node */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300 ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30 scale-110'
                    : isPast
                    ? 'border-blue-500/60 bg-blue-500/10'
                    : 'border-slate-600 bg-slate-800 group-hover:border-indigo-400/60'
                }`}>
                  {p.emoji}
                </div>
                {/* Label */}
                <div className="text-center">
                  <div className={`text-[11px] font-bold transition-colors ${
                    isActive ? 'text-indigo-300' : isPast ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}>{p.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active phase description */}
      <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500 font-medium text-center">
        {PHASES[currentIdx]?.desc} — crowd simulation active
      </div>
    </div>
  );
}
