import { Routes, Route, Navigate } from 'react-router-dom';
import { VenueProvider } from './context/VenueContext';
import LandingPage   from './pages/LandingPage';
import Dashboard     from './pages/Dashboard';
import AttendeeApp   from './pages/AttendeeApp';

export default function App() {
  return (
    <VenueProvider>
      <Routes>
        <Route path="/"          element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app"       element={<AttendeeApp />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </VenueProvider>
  );
}
