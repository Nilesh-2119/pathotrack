// src/pages/Admin/Settings.jsx
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

export default function Settings() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside className="hidden md:block w-64">
                <Sidebar open={true} />
            </aside>

            {/* Sidebar (mobile) */}
            <div className="md:hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-6 max-w-4xl mx-auto w-full">
                    <h1 className="text-2xl font-semibold mb-6">Settings</h1>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                        {["profile", "password", "preferences"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium capitalize transition-all ${activeTab === tab
                                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 hover:text-blue-600"
                                    }`}
                            >
                                {tab === "profile"
                                    ? "Edit Lab Profile"
                                    : tab === "password"
                                        ? "Change Password"
                                        : "Preferences"}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === "profile" && <LabProfileForm />}
                    {activeTab === "password" && <PasswordChangeForm />}
                    {activeTab === "preferences" && (
                        <PreferencesSection theme={theme} toggleTheme={toggleTheme} />
                    )}
                </main>
            </div>
        </div>
    );
}

/* ----------------------- LAB PROFILE FORM ----------------------- */
function LabProfileForm() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
            <h2 className="text-lg font-semibold mb-4">Edit Lab Profile</h2>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    alert("Lab profile updated successfully (mock)!");
                }}
                className="space-y-4"
            >
                <div>
                    <label className="block text-sm font-medium mb-1">Lab Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Sunrise Diagnostics"
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <textarea
                        placeholder="Enter lab address"
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Contact Number</label>
                        <input
                            type="tel"
                            placeholder="9876543210"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Address</label>
                        <input
                            type="email"
                            placeholder="lab@example.com"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                            required
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

/* ----------------------- PASSWORD CHANGE FORM ----------------------- */
function PasswordChangeForm() {
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setPasswords({ ...passwords, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setError("New passwords do not match.");
            return;
        }
        setError("");
        alert("Password changed successfully (mock)!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Current Password</label>
                    <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">New Password</label>
                    <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                    <input
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </motion.div>
    );
}

/* ----------------------- PREFERENCES SECTION ----------------------- */
function PreferencesSection({ theme, toggleTheme }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
        >
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>

            <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                    Theme Mode
                </span>
                <button
                    onClick={toggleTheme}
                    className={`px-4 py-2 rounded-lg text-sm font-medium shadow-sm ${theme === "dark"
                        ? "bg-gray-700 text-gray-100"
                        : "bg-gray-200 text-gray-800"
                        }`}
                >
                    {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
                </button>
            </div>
        </motion.div>
    );
}
