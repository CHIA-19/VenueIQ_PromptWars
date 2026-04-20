import { useState } from 'react';
import { useVenue } from '../../context/VenueContext';
import { ShoppingCart, Clock, X, Plus, Minus, CheckCircle } from 'lucide-react';

const STANDS = [
  {
    id: 'stand-7',
    name: 'Stand 7',
    category: 'Beer',
    emoji: '🍺',
    queueId: 'q1',
    items: [
      { id: 'kingfisher', name: 'Kingfisher Pint', price: 280 },
      { id: 'bira-white', name: 'Bira White 330ml', price: 220 },
      { id: 'soda',       name: 'Soft Drink (Can)', price: 80 },
      { id: 'water',      name: 'Water Bottle',     price: 40 },
    ],
  },
  {
    id: 'stand-12',
    name: 'Stand 12',
    category: 'Snacks',
    emoji: '🍿',
    queueId: 'q2',
    items: [
      { id: 'popcorn',  name: 'Masala Popcorn',    price: 120 },
      { id: 'nachos',   name: 'Nachos + Salsa',    price: 180 },
      { id: 'peanuts',  name: 'Roasted Peanuts',   price: 60 },
      { id: 'chips',    name: 'Chips Combo',        price: 100 },
    ],
  },
  {
    id: 'stand-3',
    name: 'Stand 3',
    category: 'Hot Food',
    emoji: '🌭',
    queueId: 'q3',
    items: [
      { id: 'hotdog',   name: 'Chicken Hot Dog',   price: 200 },
      { id: 'burger',   name: 'Veg Burger',        price: 160 },
      { id: 'samosa',   name: 'Samosa (4 pcs)',    price: 80 },
      { id: 'fries',    name: 'French Fries',      price: 120 },
    ],
  },
  {
    id: 'stand-9',
    name: 'Stand 9',
    category: 'Beer',
    emoji: '🍻',
    queueId: 'q4',
    items: [
      { id: 'heineken', name: 'Heineken 330ml',    price: 260 },
      { id: 'wheat',    name: 'Wheat Beer Pint',   price: 300 },
      { id: 'juice',    name: 'Fresh Lime Soda',   price: 90 },
      { id: 'tea',      name: 'Cutting Chai',      price: 30 },
    ],
  },
  {
    id: 'stand-5',
    name: 'Stand 5',
    category: 'Snacks',
    emoji: '🌮',
    queueId: 'q5',
    items: [
      { id: 'wrap',     name: 'Chicken Wrap',      price: 190 },
      { id: 'sandwich', name: 'Club Sandwich',     price: 160 },
      { id: 'momos',    name: 'Veg Momos (6pcs)',  price: 120 },
      { id: 'roll',     name: 'Paneer Kathi Roll', price: 140 },
    ],
  },
  {
    id: 'stand-15',
    name: 'Stand 15',
    category: 'Desserts',
    emoji: '🍦',
    queueId: 'q8',
    items: [
      { id: 'icecream', name: 'Softy Ice Cream',   price: 80 },
      { id: 'brownie',  name: 'Fudge Brownie',     price: 140 },
      { id: 'shake',    name: 'Chocolate Shake',   price: 160 },
      { id: 'candy',    name: 'Candy Floss',       price: 50 },
    ],
  },
];

const WAIT_STATUS = { Open: 'text-emerald-600 bg-emerald-50 border-emerald-200', Busy: 'text-amber-600 bg-amber-50 border-amber-200', Critical: 'text-red-600 bg-red-50 border-red-200' };

// ── Order Modal ───────────────────────────────────────────────────────────────
function OrderModal({ stand, queue, onClose, onConfirm }) {
  const [cart, setCart] = useState({});

  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = stand.items.find(i => i.id === id);
    return sum + (item?.price || 0) * qty;
  }, 0);

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  function adjust(id, delta) {
    setCart(prev => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) };
      if (next[id] === 0) delete next[id];
      return next;
    });
  }

  const selectedNames = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = stand.items.find(i => i.id === id);
      return `${item?.name} ×${qty}`;
    });

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center" onClick={onClose}>
      <div
        className="w-full max-w-[390px] bg-white rounded-t-3xl p-5 shadow-2xl animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-slate-800 text-lg">{stand.emoji} {stand.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{stand.category} · {queue?.waitMins ?? '?'} min wait</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-400">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="space-y-2.5 mb-5">
          {stand.items.map(item => {
            const qty = cart[item.id] || 0;
            return (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <div className="text-sm font-bold text-slate-700">{item.name}</div>
                  <div className="text-xs text-slate-400 font-medium">₹{item.price}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => adjust(item.id, -1)} disabled={qty === 0}
                    className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-all">
                    <Minus size={13} />
                  </button>
                  <span className="w-5 text-center text-sm font-black text-slate-800">{qty}</span>
                  <button onClick={() => adjust(item.id, 1)}
                    className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-all">
                    <Plus size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirm */}
        <button
          id="btn-confirm-order"
          disabled={cartCount === 0}
          onClick={() => onConfirm(selectedNames, total)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 disabled:opacity-40 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          <ShoppingCart size={16} />
          {cartCount > 0 ? `Confirm Order · ₹${total}` : 'Select items to order'}
        </button>
      </div>
    </div>
  );
}

// ── Order Confirmation Card ───────────────────────────────────────────────────
function OrderConfirmed({ orderId, eta, standName, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={onDismiss}>
      <div
        className="w-full max-w-[340px] bg-white rounded-3xl p-6 shadow-2xl text-center animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-1">Order Confirmed!</h3>
        <p className="text-sm text-slate-500 mb-4">Ready for collection at {standName}</p>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order ID</div>
          <div className="text-2xl font-black text-indigo-600">{orderId}</div>
          <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-500">
            <Clock size={13} />
            <span className="text-sm font-bold">Ready in ~{eta} minutes</span>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl transition-all active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ── Main Order Tab ────────────────────────────────────────────────────────────
export default function OrderTab() {
  const { venueState, placeOrder } = useVenue();
  const [openStand, setOpenStand] = useState(null);
  const [confirmed, setConfirmed] = useState(null);
  const [loading, setLoading]     = useState(false);

  const queues = venueState?.queues || [];
  const queueMap = {};
  queues.forEach(q => { queueMap[q.id] = q; });

  async function handleConfirm(items, total) {
    setLoading(true);
    try {
      const data = await placeOrder(openStand.id, items);
      setOpenStand(null);
      setConfirmed({ ...data, standName: openStand.name });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
      <div className="mb-4">
        <h2 className="text-lg font-black text-slate-800">Order & Queue</h2>
        <p className="text-xs text-slate-500 font-medium mt-0.5">Live wait times — updated every 3s</p>
      </div>

      <div className="space-y-2.5">
        {STANDS.map(stand => {
          const queue  = queueMap[stand.queueId];
          const status = queue?.status || 'Open';
          const wait   = queue?.waitMins ?? '?';
          const badge  = WAIT_STATUS[status] || WAIT_STATUS.Open;

          return (
            <div key={stand.id} id={`stand-${stand.id}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="text-2xl shrink-0">{stand.emoji}</div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-800 text-sm">{stand.name}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{stand.category}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase border rounded-full px-2.5 py-0.5 ${badge}`}>
                        <Clock size={9} />
                        {wait} min wait
                      </span>
                      <span className={`text-[10px] font-bold uppercase border rounded-full px-2 py-0.5 ${badge}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  id={`btn-order-${stand.id}`}
                  onClick={() => setOpenStand(stand)}
                  className="shrink-0 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl transition-all active:scale-95 shadow-sm shadow-blue-500/20"
                >
                  Order
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order Modal */}
      {openStand && !loading && (
        <OrderModal
          stand={openStand}
          queue={queueMap[openStand.queueId]}
          onClose={() => setOpenStand(null)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Confirmation */}
      {confirmed && (
        <OrderConfirmed
          orderId={confirmed.orderId}
          eta={confirmed.eta}
          standName={confirmed.standName}
          onDismiss={() => setConfirmed(null)}
        />
      )}
    </div>
  );
}
