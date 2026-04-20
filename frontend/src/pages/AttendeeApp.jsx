import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVenue } from '../context/VenueContext';
import HomeTab     from '../components/attendee/HomeTab';
import NavigateTab from '../components/attendee/NavigateTab';
import OrderTab    from '../components/attendee/OrderTab';
import AlertsTab   from '../components/attendee/AlertsTab';
import { Home, Map, ShoppingBag, Bell, Loader2, ArrowLeft, Activity } from 'lucide-react';

const TABS = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'navigate', label: 'Navigate', Icon: Map },
  { id: 'order',    label: 'Order',    Icon: ShoppingBag },
  { id: 'alerts',   label: 'Alerts',   Icon: Bell },
];

export default function AttendeeApp() {
  const { venueState, connected, alerts } = useVenue();
  const [activeTab, setActiveTab] = useState('home');

  const warnCount = alerts.filter(a => a.level === 'warn').length;

  const tabContent = () => {
    switch (activeTab) {
      case 'home':     return <HomeTab     onTabChange={setActiveTab} />;
      case 'navigate': return <NavigateTab />;
      case 'order':    return <OrderTab />;
      case 'alerts':   return <AlertsTab   onTabChange={setActiveTab} />;
      default:         return <HomeTab     onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-100 flex flex-col items-center justify-center overflow-hidden">

      {/* Desktop header - only visible outside the mobile frame */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
        <div className="flex items-center gap-3">
          <Link to="/" id="app-nav-home" className="text-slate-400 hover:text-slate-600 transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Activity size={12} className="text-white" />
            </div>
            <span className="text-sm font-black text-slate-700">VenueIQ Fan App</span>
          </div>
        </div>
        <Link
          to="/dashboard"
          id="app-nav-dashboard"
          className="text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-all"
        >
          → Ops Dashboard
        </Link>
      </div>

      {/* ── Mobile frame ── */}
      <div
        className="relative bg-white flex flex-col shadow-2xl overflow-hidden"
        style={{
          width: '390px',
          height: 'min(844px, calc(100vh - 80px))',
          borderRadius: '44px',
          border: '10px solid #1e293b',
          boxShadow: '0 0 0 2px #0f172a, 0 30px 80px rgba(0,0,0,0.4)',
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-3xl z-30" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-8 pb-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-400">9:41</span>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
            <span className="text-[10px] font-bold text-slate-400">
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Loading overlay */}
        {!venueState && (
          <div className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm font-bold text-slate-400">Connecting to venue...</p>
          </div>
        )}

        {/* Tab content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div key={activeTab} className="flex-1 flex flex-col min-h-0 animate-tab-switch">
            {tabContent()}
          </div>
        </div>

        {/* ── Bottom Tab Bar ── */}
        <div className="shrink-0 border-t border-slate-100 bg-white/95 backdrop-blur-sm">
          <div className="flex items-center justify-around px-2 py-2">
            {TABS.map(({ id, label, Icon }) => {
              const isActive = activeTab === id;
              const badge    = id === 'alerts' && warnCount > 0 ? warnCount : 0;
              return (
                <button
                  key={id}
                  id={`tab-${id}`}
                  onClick={() => setActiveTab(id)}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-200 relative"
                >
                  <div className={`p-2 rounded-xl transition-all duration-200 ${
                    isActive ? 'bg-blue-600 shadow-md shadow-blue-500/30 scale-110' : 'bg-transparent'
                  }`}>
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  </div>
                  <span className={`text-[9px] font-bold transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : 'text-slate-400'
                  }`}>{label}</span>
                  {badge > 0 && (
                    <span className="absolute top-1 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[8px] font-black flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Home indicator */}
          <div className="flex justify-center pb-2">
            <div className="w-28 h-1 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
