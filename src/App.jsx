import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'


import Navbar from "./layout/Navbar";

import Home from "./pages/Home";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout-success" element={<LogoutSuccess />} /> */}

          {/* ✅ Protected Routes */}
          {/* <Route path="/ROUTE HERE" element={<ProtectedRoute element={PAGE HERE} requiredRoles={["ROLE HERE"]} />} />
          <Route path="/ROUTE HERE/:id" element={<ProtectedRoute element={PAGE HERE} requiredRoles={["ROLE HERE", "ROLE HERE"]} />} /> */}

          {/* ✅ Public Route (ViewUser should be accessible to all users, including guests) */}
          {/* <Route path="/ROUTE HERE/:id" element={PAGE HERE} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App
