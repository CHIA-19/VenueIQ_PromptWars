# VenueIQ 🏟️ — Smart Stadium Experience Platform

> Hackathon prototype: Real-time crowd intelligence, dynamic queue management, and personalized fan experience for large-scale sporting events.

## Architecture

```
VenueFlow/
├── backend/      Node.js + Express + Socket.io simulation server
└── frontend/     React + Vite + Tailwind CSS v4 + React Router
```

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 2. Start the Backend Server

```bash
cd backend
node server.js
# → 🏟  VenueIQ Server running → http://localhost:3001
```

### 3. Start the Frontend Dev Server

```bash
cd frontend
npm run dev
# → http://localhost:5173
```

## Routes

| Route | Surface | Description |
|---|---|---|
| `/` | Landing Page | Split-screen hero with animated heatmap preview |
| `/dashboard` | Ops Dashboard | Full-screen command center (dark theme) |
| `/app` | Attendee App | 390px mobile-width fan companion (light theme) |

## REST API (Backend)

| Endpoint | Method | Body | Description |
|---|---|---|---|
| `/api/state` | GET | — | Full venue snapshot |
| `/api/phase` | POST | `{ phase: "PRE_MATCH" \| "KICKOFF" \| "HALFTIME" \| "FULL_TIME" }` | Change match phase + crowd profile |
| `/api/rebalance` | POST | — | Redistribute queue loads |
| `/api/order` | POST | `{ standId, items: [] }` | Place F&B order → `{ orderId, eta }` |

## Socket.io Events

| Event | Direction | Payload |
|---|---|---|
| `venue:update` | Server → Client | Full `venueState` (every 3 s) |
| `venue:alert` | Server → Client | Single `{ id, ts, msg, level }` alert |

## Match Phases

| Phase | Behavior |
|---|---|
| `PRE_MATCH` | Gates surge (55–85%), parking fills, bowl light |
| `KICKOFF` | Bowl fills (85–98%), gates calm down |
| `HALFTIME` | Food courts spike (85–97%), concourses surge |
| `FULL_TIME` | All gates surge (75–95%), parking empties |

## Features

- **Live Crowd Heatmap** — SVG stadium map, 12 zones, color-coded density (green/amber/red)
- **Match Timeline** — Click any phase to instantly shift the simulation
- **Queue Monitor** — 8-card grid with wait times and auto-rebalance
- **Alert Feed** — Server-generated alerts on threshold breach
- **Indoor Navigation** — Tap-to-route with walk time estimates
- **Order Flow** — Full item picker → confirm → order ID + ETA
- **Personal Alerts** — Notification log with navigate action
