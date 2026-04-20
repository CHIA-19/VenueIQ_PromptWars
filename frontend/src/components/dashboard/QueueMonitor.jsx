import { useVenue } from '../../context/VenueContext';
import { Clock, RefreshCw } from 'lucide-react';

const STATUS_CONFIG = {
  Open:     { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/25', dot: 'bg-emerald-400' },
  Busy:     { color: 'text-amber-400',   bg: 'bg-amber-400/10    border-amber-400/25',   dot: 'bg-amber-400'   },
  Critical: { color: 'text-red-400',     bg: 'bg-red-400/10     border-red-400/25',     dot: 'bg-red-400 animate-pulse' },
};

const CAT_EMOJI = { Beer: '🍺', Snacks: '🍿', 'Hot Food': '🌭' };

export default function QueueMonitor({ queues = [] }) {
  const { rebalance } = useVenue();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Queue Monitor</h2>
        <button
          id="btn-rebalance"
          onClick={rebalance}
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 border border-indigo-500/30 bg-indigo-500/8 hover:bg-indigo-500/15 px-3 py-1.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <RefreshCw size={12} />
          Auto-rebalance
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5 overflow-y-auto scrollbar-hide">
        {queues.map(q => {
          const cfg = STATUS_CONFIG[q.status] || STATUS_CONFIG.Open;
          return (
            <div
              key={q.id}
              id={`queue-${q.id}`}
              className="rounded-xl border border-white/6 bg-slate-800/40 p-3 flex flex-col gap-2 hover:bg-slate-800/60 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-1">
                <div>
                  <div className="text-xs font-bold text-slate-200 leading-tight">{q.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{CAT_EMOJI[q.category]} {q.category}</div>
                </div>
                <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider border rounded-full px-2 py-0.5 ${cfg.bg} ${cfg.color} whitespace-nowrap`}>
                  <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                  {q.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock size={10} className="text-slate-500" />
                  <span className="text-sm font-black" style={{ transition: 'all 0.6s ease' }}>{q.waitMins} min</span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {q.depth} in queue
                </div>
              </div>

              {/* mini depth bar */}
              <div className="w-full h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${
                    q.status === 'Critical' ? 'bg-red-500' : q.status === 'Busy' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (q.depth / 80) * 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
