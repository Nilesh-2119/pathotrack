// src/pages/Auth/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import api from "../../api/apiClient";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const res = await api.post("/auth/password-reset/", { email });
            setMessage("✅ Password reset link sent! Check your inbox.");
            setEmail("");
        } catch (err) {
            console.error("❌ Forgot Password Error:", err);
            setError(
                err.response?.data?.email?.[0] ||
                err.response?.data?.detail ||
                "Unable to send reset link. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col items-center text-center mb-6">
                    <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-2" />
                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                        Forgot Password
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Enter your email to receive a password reset link.
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
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            placeholder="example@patholab.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-[1.02] active:scale-100 font-medium"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
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
