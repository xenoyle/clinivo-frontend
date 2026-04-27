import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';

import ProtectedRoute from "./components/ProtectedRoute";

import Sidebar from "./layout/Sidebar";

// Import Page Components
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientMessages from "./pages/PatientMessages";
import DoctorMessages from "./pages/DoctorMessages";
import Settings from "./pages/Settings";

/**
 * AppContent handles the conditional logic for the UI.
 * It uses useLocation to determine if the Sidebar should be visible.
 */
function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Define paths where the Sidebar should NOT appear (Login/Landing)
  const noSidebarPaths = ["/", "/login", "/register"]; 
  const showSidebar = !noSidebarPaths.includes(location.pathname);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar only renders if showSidebar is true */}
      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      
      <main className="main-content" style={{ flexGrow: 1, overflowX: 'hidden' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes for PATIENTS */}
          <Route element={<ProtectedRoute allowedRoles={["PATIENT"]} />}>
            <Route path="/patient-messages" element={<PatientMessages />} />
            {/* Any other patient-only routes go here */}
          </Route>

          {/* Protected Routes for DOCTORS */}
          <Route element={<ProtectedRoute allowedRoles={["DOCTOR"]} />}>
            <Route path="/doctor-messages" element={<DoctorMessages />} />
            {/* Any other doctor-only routes go here */}
          </Route>

          {/* Shared Protected Routes (Both can access) */}
          <Route element={<ProtectedRoute allowedRoles={["PATIENT", "DOCTOR"]} />}>
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

/**
 * App is the root component that provides the Router context.
 */
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;