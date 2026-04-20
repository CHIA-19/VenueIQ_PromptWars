import { useVenue } from '../../context/VenueContext';
import { Navigation, Clock } from 'lucide-react';

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5)  return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  return `${Math.floor(s/3600)}h ago`;
}

const levelBg = {
  warn:  'border-amber-300 bg-amber-50',
  info:  'border-slate-200 bg-white',
  error: 'border-red-300 bg-red-50',
};
const levelBadge = {
  warn:  'bg-amber-100 text-amber-700 border-amber-200',
  info:  'bg-slate-100 text-slate-600 border-slate-200',
  error: 'bg-red-100 text-red-700 border-red-200',
};

export default function AlertsTab({ onTabChange }) {
  const { alerts } = useVenue();

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      <div className="mb-4">
        <h2 className="text-lg font-black text-slate-800">My Alerts</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{alerts.length} notifications</p>
      </div>

      {alerts.length === 0 && (
        <div className="text-center text-slate-400 py-12">
          <Clock size={32} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No alerts yet</p>
        </div>
      )}

      <div className="space-y-2.5">
        {alerts.slice(0, 20).map(a => (
          <div key={a.id} className={`rounded-2xl border p-3.5 ${levelBg[a.level] || levelBg.info} animate-alert-enter`}>
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm text-slate-700 leading-relaxed font-medium flex-1">{a.msg}</p>
              <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-wide border rounded-full px-2 py-0.5 shrink-0 ${levelBadge[a.level] || levelBadge.info}`}>
                {a.level === 'warn' ? '⚠ Alert' : '✓ Info'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">{timeAgo(a.ts)}</span>
              <div className="flex items-center gap-2">
                {a.level === 'warn' && (
                  <button
                    onClick={() => onTabChange('navigate')}
                    className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                  >
                    <Navigation size={10} /> Navigate there
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
