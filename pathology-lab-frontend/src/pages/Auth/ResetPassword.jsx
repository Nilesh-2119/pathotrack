// src/pages/Auth/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../../api/apiClient";
import { Lock } from "lucide-react";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await api.post("/auth/password-reset/confirm/", {
                email,
                new_password: password,
            });
            setMessage("✅ Password reset successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            console.error("❌ Password Reset Error:", err);
            setError(
                err.response?.data?.detail ||
                err.response?.data?.error ||
                "Password reset failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
                <div className="flex flex-col items-center text-center mb-6">
                    <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-2" />
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        Reset Password
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Enter your new password for <strong>{email}</strong>.
                    </p>
                </div>

                {message && (
                    <div className="bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm mb-4 border border-green-300">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-4 border border-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="form-input"
                            placeholder="Re-enter new password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-[1.02] active:scale-100 font-medium"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                    >
                        Back to Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
