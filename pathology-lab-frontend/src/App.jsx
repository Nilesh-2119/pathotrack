// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// ✅ Import ProtectedRoute
import ProtectedRoute from "./components/Auth/ProtectedRoute";

import CollectorDashboard from "./pages/Staff/CollectorDashboard";

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

          {/* ===== Admin Routes (Protected) ===== */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/staff"
            element={
              <ProtectedRoute>
                <Staff />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/tests"
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            }
          />

          {/* ===== Staff Routes ===== */}
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/patients"
            element={
              <ProtectedRoute>
                <StaffPatients />
              </ProtectedRoute>
            }
          />

          {/* ===== Password Reset ===== */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* ===== Default Redirect ===== */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/staff/collecteddashboard" element={<CollectorDashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
