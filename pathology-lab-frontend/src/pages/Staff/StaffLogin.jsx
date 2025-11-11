import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserCheck } from "lucide-react";

export default function StaffLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.username.trim() === "" || formData.password.trim() === "") {
            setError("Please fill in all fields.");
            return;
        }

        setError("");
        alert("✅ Logged in as Blood Collection Staff (mock)");
        navigate("/staff/dashboard");
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
                    <div className="form-field">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-field">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-[1.02] active:scale-100 font-medium"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
                    Are you an admin?{" "}
                    <Link
                        to="/login"
                        className="text-blue-600 hover:underline dark:text-blue-400 font-medium"
                    >
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
