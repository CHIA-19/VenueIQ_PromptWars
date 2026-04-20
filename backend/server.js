const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// ─── Match Phase Definitions ──────────────────────────────────────────────────
const PHASES = {
  PRE_MATCH: 'PRE_MATCH',
  KICKOFF: 'KICKOFF',
  HALFTIME: 'HALFTIME',
  FULL_TIME: 'FULL_TIME',
};

// Target density ranges [min, max] per zone per phase
const PHASE_PROFILES = {
  PRE_MATCH: {
    'gate-a': [55, 80], 'gate-b': [60, 85], 'gate-c': [50, 75], 'gate-d': [45, 70],
    'north-concourse': [40, 65], 'south-concourse': [35, 60],
    'food-court-east': [30, 50], 'food-court-west': [25, 45],
    'main-bowl': [20, 40],
    'parking-1': [70, 90], 'parking-2': [65, 85], 'parking-3': [55, 80],
  },
  KICKOFF: {
    'gate-a': [10, 25], 'gate-b': [8, 20], 'gate-c': [12, 28], 'gate-d': [10, 22],
    'north-concourse': [20, 40], 'south-concourse': [18, 35],
    'food-court-east': [25, 45], 'food-court-west': [20, 40],
    'main-bowl': [85, 98],
    'parking-1': [90, 98], 'parking-2': [88, 96], 'parking-3': [80, 94],
  },
  HALFTIME: {
    'gate-a': [15, 30], 'gate-b': [12, 28], 'gate-c': [18, 32], 'gate-d': [14, 26],
    'north-concourse': [65, 85], 'south-concourse': [60, 80],
    'food-court-east': [85, 97], 'food-court-west': [80, 95],
    'main-bowl': [30, 50],
    'parking-1': [88, 96], 'parking-2': [86, 94], 'parking-3': [78, 90],
  },
  FULL_TIME: {
    'gate-a': [75, 92], 'gate-b': [80, 95], 'gate-c': [70, 88], 'gate-d': [72, 90],
    'north-concourse': [70, 85], 'south-concourse': [65, 82],
    'food-court-east': [35, 55], 'food-court-west': [30, 50],
    'main-bowl': [15, 35],
    'parking-1': [55, 75], 'parking-2': [60, 82], 'parking-3': [65, 88],
  },
};

// ─── Initial Venue State ──────────────────────────────────────────────────────
let venueState = {
  matchPhase: PHASES.PRE_MATCH,
  timestamp: Date.now(),
  totalAttendance: 42180,
  zones: [
    { id: 'gate-a',         name: 'Gate A',             type: 'gate',        density: 62, capacity: 3500, svgX: 260, svgY: 40 },
    { id: 'gate-b',         name: 'Gate B',             type: 'gate',        density: 71, capacity: 3500, svgX: 380, svgY: 40 },
    { id: 'gate-c',         name: 'Gate C',             type: 'gate',        density: 55, capacity: 3500, svgX: 260, svgY: 290 },
    { id: 'gate-d',         name: 'Gate D',             type: 'gate',        density: 48, capacity: 3500, svgX: 380, svgY: 290 },
    { id: 'north-concourse',name: 'North Concourse',    type: 'concourse',   density: 44, capacity: 6000, svgX: 170, svgY: 100 },
    { id: 'south-concourse',name: 'South Concourse',    type: 'concourse',   density: 38, capacity: 6000, svgX: 470, svgY: 225 },
    { id: 'food-court-east',name: 'Food Court East',    type: 'food',        density: 35, capacity: 2000, svgX: 470, svgY: 100 },
    { id: 'food-court-west',name: 'Food Court West',    type: 'food',        density: 28, capacity: 2000, svgX: 170, svgY: 225 },
    { id: 'main-bowl',      name: 'Main Bowl',          type: 'bowl',        density: 22, capacity: 40000, svgX: 320, svgY: 165 },
    { id: 'parking-1',      name: 'Parking Zone 1',     type: 'parking',     density: 78, capacity: 5000, svgX: 80,  svgY: 165 },
    { id: 'parking-2',      name: 'Parking Zone 2',     type: 'parking',     density: 73, capacity: 5000, svgX: 320, svgY: 310 },
    { id: 'parking-3',      name: 'Parking Zone 3',     type: 'parking',     density: 68, capacity: 5000, svgX: 560, svgY: 165 },
  ],
  queues: [
    { id: 'q1', name: 'Stand 7 — Beer',      category: 'Beer',     waitMins: 4,  depth: 12, status: 'Open'     },
    { id: 'q2', name: 'Stand 12 — Snacks',   category: 'Snacks',   waitMins: 11, depth: 34, status: 'Busy'     },
    { id: 'q3', name: 'Stand 3 — Hot Food',  category: 'Hot Food', waitMins: 18, depth: 54, status: 'Critical' },
    { id: 'q4', name: 'Stand 9 — Beer',      category: 'Beer',     waitMins: 3,  depth: 8,  status: 'Open'     },
    { id: 'q5', name: 'Stand 5 — Snacks',    category: 'Snacks',   waitMins: 7,  depth: 21, status: 'Busy'     },
    { id: 'q6', name: 'Stand 11 — Hot Food', category: 'Hot Food', waitMins: 14, depth: 42, status: 'Critical' },
    { id: 'q7', name: 'Stand 2 — Beer',      category: 'Beer',     waitMins: 2,  depth: 5,  status: 'Open'     },
    { id: 'q8', name: 'Stand 15 — Snacks',   category: 'Snacks',   waitMins: 9,  depth: 27, status: 'Busy'     },
  ],
  alerts: [
    { id: 'a1', ts: Date.now() - 25000, msg: '✅ Staff dispatched to Food Court East', level: 'info' },
    { id: 'a2', ts: Date.now() - 12000, msg: '⚠️ Gate B density > 70% — monitor advised', level: 'warn' },
  ],
};

let orderCounter = 42;
let alertIdCounter = 100;

// ─── Helpers ─────────────────────────────────────────────────────────────────
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function lerp(val, target, factor) {
  return val + (target - val) * factor;
}

function getStatusForQueue(waitMins) {
  if (waitMins >= 15) return 'Critical';
  if (waitMins >= 7)  return 'Busy';
  return 'Open';
}

function getDensityLevel(d) {
  if (d > 70) return 'red';
  if (d > 40) return 'amber';
  return 'green';
}

function maybeGenerateAlert() {
  const critZones = venueState.zones.filter(z => z.density > 80);
  if (critZones.length > 0 && Math.random() < 0.35) {
    const z = critZones[Math.floor(Math.random() * critZones.length)];
    const templates = [
      `⚠️ ${z.name} density > ${Math.round(z.density)}% — rerouting recommended`,
      `🔴 Anomaly detected: ${z.name} compression spike`,
      `⚠️ Crowd surge at ${z.name} — staffing alert`,
    ];
    const msg = templates[Math.floor(Math.random() * templates.length)];
    pushAlert(msg, 'warn');
  }
  if (Math.random() < 0.15) {
    const positives = [
      '✅ Staff dispatched to Food Court West',
      '✅ Auto-rebalance kept Avg Wait under 10 min',
      '✅ Corridor 3 cleared — flow normalized',
    ];
    pushAlert(positives[Math.floor(Math.random() * positives.length)], 'info');
  }
}

function pushAlert(msg, level) {
  const alert = { id: `a${alertIdCounter++}`, ts: Date.now(), msg, level };
  venueState.alerts = [alert, ...venueState.alerts].slice(0, 40);
  io.emit('venue:alert', alert);
}

// ─── Simulation Loop (every 3 s) ─────────────────────────────────────────────
setInterval(() => {
  const profile = PHASE_PROFILES[venueState.matchPhase];

  venueState.zones = venueState.zones.map(zone => {
    const [pMin, pMax] = profile[zone.id] || [20, 60];
    const pMid = (pMin + pMax) / 2;
    // Random walk ±8, then nudge toward phase target
    const delta = (Math.random() - 0.5) * 16;
    let d = clamp(zone.density + delta, 0, 100);
    d = lerp(d, pMid, 0.12); // gentle pull toward phase midpoint
    d = clamp(d, pMin - 5, pMax + 5);
    return { ...zone, density: Math.round(d) };
  });

  venueState.queues = venueState.queues.map(q => {
    const delta = Math.floor((Math.random() - 0.5) * 6);
    const waitMins = clamp(q.waitMins + delta, 1, 30);
    const depthDelta = Math.floor((Math.random() - 0.5) * 10);
    const depth = clamp(q.depth + depthDelta, 0, 80);
    return { ...q, waitMins, depth, status: getStatusForQueue(waitMins) };
  });

  venueState.timestamp = Date.now();
  maybeGenerateAlert();

  io.emit('venue:update', venueState);
}, 3000);

// ─── Socket.io ───────────────────────────────────────────────────────────────
io.on('connection', socket => {
  console.log(`[+] Client connected: ${socket.id}`);
  socket.emit('venue:update', venueState);

  socket.on('disconnect', () => {
    console.log(`[-] Client disconnected: ${socket.id}`);
  });
});

// ─── REST API ─────────────────────────────────────────────────────────────────

// GET /api/state
app.get('/api/state', (req, res) => {
  res.json(venueState);
});

// POST /api/phase  { phase: 'PRE_MATCH' | 'KICKOFF' | 'HALFTIME' | 'FULL_TIME' }
app.post('/api/phase', (req, res) => {
  const { phase } = req.body;
  if (!PHASES[phase]) {
    return res.status(400).json({ error: 'Invalid phase. Use PRE_MATCH, KICKOFF, HALFTIME, or FULL_TIME.' });
  }
  venueState.matchPhase = phase;
  const profile = PHASE_PROFILES[phase];

  // Snap zones to new phase targets immediately for visual impact
  venueState.zones = venueState.zones.map(zone => {
    const [pMin, pMax] = profile[zone.id] || [20, 60];
    const pMid = Math.round((pMin + pMax) / 2);
    return { ...zone, density: pMid };
  });

  const phaseLabels = { PRE_MATCH: 'Pre-Match', KICKOFF: 'Kick-off', HALFTIME: 'Half Time', FULL_TIME: 'Full Time' };
  pushAlert(`🔄 Match phase changed to ${phaseLabels[phase]} — crowd profiles updated`, 'info');

  io.emit('venue:update', venueState);
  res.json({ success: true, phase, state: venueState });
});

// POST /api/rebalance
app.post('/api/rebalance', (req, res) => {
  // Redistribute: bring Busy/Critical queues down, spread load
  const totalLoad = venueState.queues.reduce((s, q) => s + q.depth, 0);
  const targetDepth = Math.round(totalLoad / venueState.queues.length);
  venueState.queues = venueState.queues.map(q => {
    const depth = clamp(targetDepth + Math.floor((Math.random() - 0.5) * 8), 3, 40);
    const waitMins = clamp(Math.round(depth * 0.3), 1, 12);
    return { ...q, depth, waitMins, status: getStatusForQueue(waitMins) };
  });
  pushAlert('✅ Auto-rebalance triggered — queue loads redistributed across all 8 stands', 'info');
  io.emit('venue:update', venueState);
  res.json({ success: true, queues: venueState.queues });
});

// POST /api/order  { standId, items: ['Beer', 'Nachos'] }
app.post('/api/order', (req, res) => {
  const { standId, items } = req.body;
  if (!standId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Provide standId and items[]' });
  }
  const orderId = `VIQ-${String(++orderCounter).padStart(4, '0')}`;
  const eta = Math.floor(Math.random() * 5) + 6; // 6–10 mins
  res.json({ success: true, orderId, eta, standId, items });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('(.*)', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🏟  VenueIQ Server running → http://localhost:${PORT}`);
  console.log(`   Phase: ${venueState.matchPhase} | Zones: ${venueState.zones.length} | Queues: ${venueState.queues.length}`);
});
