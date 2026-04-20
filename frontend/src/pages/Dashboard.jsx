import { Link } from 'react-router-dom';
import { useVenue } from '../context/VenueContext';
import KpiStrip      from '../components/dashboard/KpiStrip';
import StadiumHeatmap from '../components/dashboard/StadiumHeatmap';
import QueueMonitor  from '../components/dashboard/QueueMonitor';
import AlertFeed     from '../components/dashboard/AlertFeed';
import MatchTimeline from '../components/dashboard/MatchTimeline';
import { Activity, Wifi, WifiOff, ArrowLeft, Smartphone } from 'lucide-react';

export default function Dashboard() {
  const { venueState, connected, alerts } = useVenue();

  return (
    <div className="fixed inset-0 flex flex-col bg-[#080d18] overflow-hidden font-['Outfit',sans-serif]">

      {/* ── Top navigation bar ── */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-slate-900/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/" id="dash-nav-home" className="text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Activity size={14} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-black tracking-tight text-white">VenueIQ</span>
            <span className="text-slate-600 mx-2 text-xs">·</span>
            <span className="text-xs font-medium text-slate-500">Ops Dashboard</span>
          </div>
          <div className={`flex items-center gap-1.5 ml-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            connected
              ? 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20'
              : 'text-red-400 bg-red-400/8 border-red-400/20 animate-pulse'
          }`}>
            {connected ? <Wifi size={10} /> : <WifiOff size={10} />}
            {connected ? 'Live' : 'Offline'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-600 font-medium hidden md:block">
            DY Patil Stadium · Match Day
          </span>
          <Link
            to="/app"
            id="dash-nav-app"
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 border border-indigo-500/30 bg-indigo-500/8 hover:bg-indigo-500/15 px-3 py-1.5 rounded-lg transition-all"
          >
            <Smartphone size={12} />
            Fan App
          </Link>
        </div>
      </header>

      {/* ── KPI strip ── */}
      <div className="px-4 pt-3 shrink-0">
        <KpiStrip venueState={venueState} />
      </div>

      {/* ── Match Timeline ── */}
      <div className="px-4 pt-3 shrink-0">
        <MatchTimeline />
      </div>

      {/* ── Main 2-column grid ── */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-5 gap-3 px-4 pt-3 pb-4 min-h-0 overflow-hidden">

        {/* Left: Stadium Heatmap — takes 3 cols */}
        <div className="xl:col-span-3 rounded-2xl border border-white/6 bg-slate-900/60 p-4 flex flex-col min-h-0">
          <StadiumHeatmap zones={venueState?.zones || []} />
        </div>

        {/* Right: Queue Monitor + Alert Feed — takes 2 cols */}
        <div className="xl:col-span-2 flex flex-col gap-3 min-h-0 overflow-hidden">

          {/* Queue Monitor */}
          <div className="rounded-2xl border border-white/6 bg-slate-900/60 p-4 flex flex-col" style={{ flex: '0 0 auto', maxHeight: '50%' }}>
            <QueueMonitor queues={venueState?.queues || []} />
          </div>

          {/* Alert Feed */}
          <div className="rounded-2xl border border-white/6 bg-slate-900/60 p-4 flex flex-col flex-1 min-h-0 overflow-hidden">
            <AlertFeed alerts={alerts} />
          </div>
        </div>
      </div>
    </div>
  );
}
