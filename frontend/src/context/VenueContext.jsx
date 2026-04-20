import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : window.location.origin;
const API = `${SOCKET_URL}/api`;

const VenueContext = createContext(null);

export function VenueProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected]   = useState(false);
  const [venueState, setVenueState] = useState(null);
  const [alerts, setAlerts]         = useState([]);
  const [phase, setPhaseState]      = useState('PRE_MATCH');

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect',    () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('venue:update', (state) => {
      setVenueState(state);
      setPhaseState(state.matchPhase);
      setAlerts(state.alerts || []);
    });

    socket.on('venue:alert', (alert) => {
      setAlerts(prev => [alert, ...prev].slice(0, 40));
    });

    return () => socket.disconnect();
  }, []);

  const changePhase = useCallback(async (newPhase) => {
    try {
      const res = await fetch(`${API}/phase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phase: newPhase }),
      });
      const data = await res.json();
      if (data.success) setPhaseState(newPhase);
    } catch (e) {
      console.error('Phase change failed', e);
    }
  }, []);

  const rebalance = useCallback(async () => {
    try {
      await fetch(`${API}/rebalance`, { method: 'POST' });
    } catch (e) {
      console.error('Rebalance failed', e);
    }
  }, []);

  const placeOrder = useCallback(async (standId, items) => {
    const res = await fetch(`${API}/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ standId, items }),
    });
    return res.json();
  }, []);

  return (
    <VenueContext.Provider value={{ connected, venueState, alerts, phase, changePhase, rebalance, placeOrder }}>
      {children}
    </VenueContext.Provider>
  );
}

export function useVenue() {
  const ctx = useContext(VenueContext);
  if (!ctx) throw new Error('useVenue must be used within VenueProvider');
  return ctx;
}
