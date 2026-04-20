import { useEffect, useRef } from 'react';

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5)  return 'just now';
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  return `${Math.floor(s/3600)}h ago`;
}

const levelStyle = {
  warn: 'border-amber-500/30 bg-amber-500/5',
  info: 'border-emerald-500/20 bg-emerald-500/5',
  error:'border-red-500/30   bg-red-500/5',
};

export default function AlertFeed({ alerts = [] }) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [alerts.length]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Alert Feed</h2>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Live</span>
        </div>
      </div>
      <div ref={feedRef} className="flex-1 overflow-y-auto scrollbar-hide space-y-2">
        {alerts.length === 0 && (
          <div className="text-center text-slate-600 text-sm py-8 italic">No alerts yet...</div>
        )}
        {alerts.map((a, i) => (
          <div
            key={a.id}
            className={`animate-alert-enter rounded-xl border p-3 ${levelStyle[a.level] || levelStyle.info}`}
            style={{ animationDelay: `${Math.min(i, 3) * 0.04}s` }}
          >
            <p className="text-xs text-slate-200 leading-relaxed font-medium">{a.msg}</p>
            <p className="text-[10px] text-slate-600 mt-1 font-medium">{timeAgo(a.ts)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
