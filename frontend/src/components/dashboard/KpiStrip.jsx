import { useEffect, useRef, useState } from 'react';
import { Users, Clock, AlertTriangle, Flame } from 'lucide-react';

function AnimatedNumber({ value, suffix = '' }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const start = prev.current;
    const end   = value;
    const diff  = end - start;
    if (diff === 0) return;
    const duration = 600;
    const startTime = performance.now();

    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(step);
      else prev.current = end;
    }
    requestAnimationFrame(step);
  }, [value]);

  return <span className="counter-value">{display.toLocaleString()}{suffix}</span>;
}

export default function KpiStrip({ venueState }) {
  if (!venueState) return null;

  const zones    = venueState.zones || [];
  const queues   = venueState.queues || [];
  const alerts   = (venueState.alerts || []).filter(a => a.level === 'warn');

  const atCapacity = zones.filter(z => z.density > 70).length;
  const avgWait    = queues.length
    ? Math.round(queues.reduce((s, q) => s + q.waitMins, 0) / queues.length)
    : 0;

  const cards = [
    {
      id: 'kpi-attendance',
      label: 'Total Attendance',
      value: venueState.totalAttendance,
      suffix: '',
      icon: Users,
      color: 'text-blue-400',
      bg: 'from-blue-500/10 to-blue-600/5',
      border: 'border-blue-500/20',
      sub: 'DY Patil Stadium · Cap 55K',
    },
    {
      id: 'kpi-wait',
      label: 'Avg Wait Time',
      value: avgWait,
      suffix: ' min',
      icon: Clock,
      color: avgWait > 10 ? 'text-amber-400' : 'text-emerald-400',
      bg: avgWait > 10 ? 'from-amber-500/10 to-amber-600/5' : 'from-emerald-500/10 to-emerald-600/5',
      border: avgWait > 10 ? 'border-amber-500/20' : 'border-emerald-500/20',
      sub: 'Across all 8 stands',
    },
    {
      id: 'kpi-alerts',
      label: 'Active Alerts',
      value: alerts.length,
      suffix: '',
      icon: AlertTriangle,
      color: alerts.length > 0 ? 'text-red-400' : 'text-slate-400',
      bg: alerts.length > 0 ? 'from-red-500/10 to-red-600/5' : 'from-slate-500/10 to-slate-600/5',
      border: alerts.length > 0 ? 'border-red-500/20' : 'border-slate-600/30',
      sub: alerts.length > 0 ? 'Threshold breaches detected' : 'All systems nominal',
    },
    {
      id: 'kpi-capacity',
      label: 'Zones at Capacity',
      value: atCapacity,
      suffix: `/${zones.length}`,
      icon: Flame,
      color: atCapacity > 3 ? 'text-red-400' : atCapacity > 0 ? 'text-amber-400' : 'text-emerald-400',
      bg: atCapacity > 3 ? 'from-red-500/10 to-red-600/5' : 'from-slate-500/10 to-slate-600/5',
      border: atCapacity > 3 ? 'border-red-500/20' : 'border-slate-600/30',
      sub: '> 70% density threshold',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map(({ id, label, value, suffix, icon: Icon, color, bg, border, sub }) => (
        <div
          key={id}
          id={id}
          className={`relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${bg} p-4 backdrop-blur-sm`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</span>
            <Icon size={15} className={color} />
          </div>
          <div className={`text-3xl font-black ${color}`}>
            <AnimatedNumber value={value} suffix={suffix} />
          </div>
          <div className="text-[10px] text-slate-600 mt-1 font-medium">{sub}</div>
        </div>
      ))}
    </div>
  );
}
