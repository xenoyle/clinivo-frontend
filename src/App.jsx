import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';

import Sidebar from "./layout/Sidebar";

// Import Page Components
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientMessages from "./pages/PatientMessages";
import ProviderMessages from "./pages/ProviderMessages";
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

          {/* Connected App Routes */}
          <Route path="/patient-messages" element={<PatientMessages />} />
          <Route path="/provider-messages" element={<ProviderMessages />} />
          <Route path="/settings" element={<Settings />} />

          {/* Optional: Catch-all route to redirect unknown URLs back to login 
            <Route path="*" element={<Navigate to="/login" />} />
          */}
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