import { useState } from 'react';
import { useVenue } from '../../context/VenueContext';
import { Navigation, Bell } from 'lucide-react';

// Live score ticker
function ScoreTicker() {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-4 py-3 shadow-lg shadow-blue-500/20">
      <div className="text-center">
        <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Mumbai FC</div>
        <div className="text-2xl font-black text-white">2</div>
      </div>
      <div className="text-center">
        <div className="text-[9px] font-bold text-blue-200 uppercase tracking-widest mb-0.5">67'</div>
        <div className="text-[10px] font-bold text-blue-100 bg-blue-500/30 border border-blue-400/30 rounded px-2 py-0.5">LIVE</div>
      </div>
      <div className="text-center">
        <div className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Delhi United</div>
        <div className="text-2xl font-black text-white">1</div>
      </div>
    </div>
  );
}

const NOTIFICATION_CARDS = [
  {
    id: 'notif-gate',
    emoji: '🚪',
    color: 'border-amber-400/30 bg-amber-400/5',
    accentColor: 'text-amber-400',
    title: 'Gate C is filling fast',
    body: 'Gate E is 3× faster right now. Save ~8 min walk time.',
    action: 'Switch to Gate E →',
  },
  {
    id: 'notif-food',
    emoji: '🍺',
    color: 'border-blue-400/30 bg-blue-400/5',
    accentColor: 'text-blue-400',
    title: 'Stand 7: 3 min wait',
    body: 'Stand 12 has an 11 min wait. Order from Stand 7 and save time.',
    action: 'Order from Stand 7 →',
  },
  {
    id: 'notif-ht',
    emoji: '⏱️',
    color: 'border-purple-400/30 bg-purple-400/5',
    accentColor: 'text-purple-400',
    title: 'Halftime in 3 mins',
    body: 'Head to the concourse now to beat the rush. Best time to order.',
    action: 'Navigate to Stand 7 →',
  },
];

export default function HomeTab({ onTabChange }) {
  const { venueState, alerts } = useVenue();

  const unreadAlerts = alerts.filter(a => a.level === 'warn').length;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-4">

      {/* Greeting */}
      <div className="animate-slide-up">
        <h1 className="text-xl font-black text-slate-800 leading-tight">
          Welcome back, Alex! 👋
        </h1>
        <p className="text-slate-500 text-sm mt-0.5 font-medium">DY Patil Stadium · Section 114, Row G</p>
      </div>

      {/* Score ticker */}
      <ScoreTicker />

      {/* Smart notifications */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Smart Alerts</h2>
          <div className="flex items-center gap-1">
            <Bell size={11} className="text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400">{unreadAlerts} warnings</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {NOTIFICATION_CARDS.map((card) => (
            <div key={card.id} id={card.id} className={`rounded-2xl border ${card.color} p-3.5`}>
              <div className="flex items-start gap-2.5">
                <span className="text-xl mt-0.5">{card.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-bold ${card.accentColor}`}>{card.title}</h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{card.body}</p>
                  <button
                    onClick={() => card.id === 'notif-food' && onTabChange('order')}
                    className={`mt-2 text-[11px] font-bold ${card.accentColor} hover:underline`}
                  >
                    {card.action}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live zone status mini-preview */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nearby Zones</h2>
          <button onClick={() => onTabChange('navigate')} className="text-[11px] font-bold text-blue-500 flex items-center gap-1">
            <Navigation size={11} /> View Map
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {(venueState?.zones || []).filter(z => ['gate-c','gate-d','food-court-west','south-concourse'].includes(z.id)).map(z => {
            const color = z.density > 70 ? 'text-red-500 bg-red-50 border-red-200' : z.density > 40 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200';
            return (
              <div key={z.id} className={`rounded-xl border px-3 py-2 ${color}`}>
                <div className="text-[10px] font-bold uppercase tracking-wide opacity-60">{z.type}</div>
                <div className="text-xs font-bold mt-0.5">{z.name}</div>
                <div className="text-lg font-black">{Math.round(z.density)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
