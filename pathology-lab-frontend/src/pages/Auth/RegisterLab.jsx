// src/pages/Auth/RegisterLab.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Stethoscope } from "lucide-react";

export default function RegisterLab() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    labName: "",
    address: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // contact validation (max 10 digits)
    if (name === "contact" && (!/^\d*$/.test(value) || value.length > 10)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.contact.length !== 10) {
      setError("Contact number must be exactly 10 digits!");
      return;
    }

    setError("");
    alert("✅ Lab Account Created Successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
            <Stethoscope className="w-7 h-7" />
            <h1 className="text-2xl font-semibold">Create Lab Account</h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Register your Pathology Lab on <strong>PathoTrack</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 border border-red-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">Lab Name</label>
            <input
              type="text"
              name="labName"
              value={formData.labName}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="e.g. City Diagnostics"
            />
          </div>

          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Full lab address"
            />
          </div>

          <div>
            <label className="form-label">Contact Number</label>
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="10-digit phone number"
            />
          </div>

          <div>
            <label className="form-label">Email</label>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-[1.02] active:scale-100 font-medium"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200 dark:border-gray-700"></div>

        {/* Login Options */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">
            Already have a Lab Account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
            >
              Login as Admin
            </Link>
          </p>
          <p>
            Are you a Blood Collection Staff?{" "}
            <Link
              to="/staff/login"
              className="text-teal-600 hover:underline dark:text-teal-400 font-medium"
            >
              Login as Staff
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
