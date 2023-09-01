import { Routes, Route } from 'react-router-dom';
import './App.css';
import DashboardScreen from './screens/DashboardScreen';
import GuestScreen from './screens/GuestScreen';
import LoginScreen from './screens/LoginScreen';
import PatientScreen from './screens/PatientScreen/PatientScreen';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/guest" element={<GuestScreen />} />
      <Route path="/dashboard" element={<DashboardScreen />} />
      <Route path="/session/:roomKey" element={<DashboardScreen session />} />
      <Route
        path="/session/:roomKey/patient/:name/:id"
        element={<PatientScreen />}
      />
      <Route path="/" element={<LoginScreen />} />
    </Routes>
  );
}
