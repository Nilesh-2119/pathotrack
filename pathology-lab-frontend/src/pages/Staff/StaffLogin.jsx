// src/pages/Staff/StaffLogin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserCheck } from "lucide-react";
import api from "../../api/apiClient";

export default function StaffLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("access")) {
      navigate("/staff/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loginRes = await api.post("/auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);

      // Fetch staff profile
      const profileRes = await api.get("/auth/profile/");
      localStorage.setItem("user", JSON.stringify(profileRes.data));

      navigate("/staff/dashboard");
    } catch (err) {
      console.error("❌ Staff login error:", err);

      const msg =
        err.response?.data?.detail ||
        "Invalid credentials. Please try again.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <UserCheck className="w-6 h-6" />
            <h1 className="text-2xl font-semibold">Staff Login</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Login to your Blood Collection Staff dashboard.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="form-input"
              required
            />
          </div>

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Are you an admin?{" "}
          <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400 font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
