// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import api from "../../api/apiClient";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Login request
      const loginRes = await api.post("/auth/login/", {
        username: formData.email,
        password: formData.password,
      });

      localStorage.setItem("access", loginRes.data.access);
      localStorage.setItem("refresh", loginRes.data.refresh);

      // Fetch full user profile (IMPORTANT!)
      const profileRes = await api.get("/auth/profile/");
      localStorage.setItem("user", JSON.stringify(profileRes.data));

      navigate("/admin/dashboard");
    } catch (err) {
      console.error("❌ Login Error:", err);

      if (err.response?.status === 400) {
        setError("Invalid credentials.");
      } else if (err.response?.status === 404) {
        setError("No account found.");
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <FlaskConical className="w-6 h-6" />
            <h1 className="text-2xl font-semibold">Welcome Back</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Login to your PathoTrack Lab Dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="example@patholab.com"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-[1.02]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
