// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import RegisterLab from "./pages/Auth/RegisterLab";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/Admin/Dashboard";
import Patients from "./pages/Admin/Patients";
import Staff from "./pages/Admin/Staff";
import Settings from "./pages/Admin/Settings";
import Tests from "./pages/Admin/Tests";

// Staff Pages
import StaffLogin from "./pages/Staff/StaffLogin";
import StaffDashboard from "./pages/Staff/Dashboard";
import StaffPatients from "./pages/Staff/Patients";

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* ===== Landing ===== */}
          <Route path="/" element={<Landing />} />

          {/* ===== Auth Pages ===== */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterLab />} />

          {/* ===== Admin Routes ===== */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/patients" element={<Patients />} />
          <Route path="/admin/staff" element={<Staff />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/tests" element={<Tests />} />

          {/* ===== Staff Routes ===== */}
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/patients" element={<StaffPatients />} />

          {/* ===== Fallback ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
