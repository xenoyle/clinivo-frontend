import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css'


import Sidebar from "./layout/Sidebar";

import Login from "./pages/Login";

import PatientMessages from "./pages/PatientMessages";
import ProviderMessages from "./pages/ProviderMessages";
import Settings from "./pages/Settings";

// Separate component to use useLocation hook for conditional rendering of Sidebar
function AppContent() {
  const [count, setCount] = useState(0)
  const location = useLocation();

  const noSidebarPaths = ["/", "/login"]; // Add any other paths where you don't want Sidebar (probably register and forgot password)
  const showSidebar = !noSidebarPaths.includes(location.pathname);
  return (
    <div className="App">
      {showSidebar && <Sidebar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-messages" element={<PatientMessages />} />
        <Route path="/provider-messages" element={<ProviderMessages />} />
        <Route path="/settings" element={<Settings />} />

        {/* ✅ Protected Routes */}
        {/* <Route path="/ROUTE HERE" element={<ProtectedRoute element={PAGE HERE} requiredRoles={["ROLE HERE"]} />} />
        <Route path="/ROUTE HERE/:id" element={<ProtectedRoute element={PAGE HERE} requiredRoles={["ROLE HERE", "ROLE HERE"]} />} /> */}

        {/* ✅ Public Route (ViewUser should be accessible to all users, including guests) */}
        {/* <Route path="/ROUTE HERE/:id" element={PAGE HERE} /> */}
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
