// src/pages/Admin/Staff.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { motion } from "framer-motion";
import { formatFullDate } from "../../utils/dateFormat";
import api from "../../api/apiClient";

export default function Staff() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState("");
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const [newStaff, setNewStaff] = useState({
        username: "",
        phone: "",
        password: "",
    });

    // Fetch staff list
    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/staff/");
            setStaffList(res.data || []);
        } catch (err) {
            console.error("❌ Failed to load staff:", err);
            setError(
                "Failed to load staff. Make sure backend is running and /api/staff/ is reachable."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleAddOpen = () => {
        setNewStaff({ username: "", phone: "", password: "" });
        setError("");
        setShowAddModal(true);
    };

    const handleAddStaff = async (e) => {
        e.preventDefault();
        setAdding(true);
        setError("");

        try {
            const payload = {
                username: newStaff.username.trim(),
                phone: newStaff.phone.trim(),
                password: newStaff.password,
            };

            const res = await api.post("/staff/add/", payload);
            setStaffList((prev) => [res.data, ...prev]);
            setShowAddModal(false);
            alert("✅ Staff added successfully!");
        } catch (err) {
            console.error("❌ Error adding staff:", err);

            let msg = "Error adding staff. Please try again.";

            if (err.response?.data) {
                const data = err.response.data;

                if (typeof data === "object" && !Array.isArray(data)) {
                    msg = Object.entries(data)
                        .map(([field, messages]) => {
                            if (Array.isArray(messages)) {
                                return `${field}: ${messages.join(", ")}`;
                            }
                            return `${field}: ${messages}`;
                        })
                        .join("\n");
                } else if (typeof data === "string") {
                    msg = data;
                }
            }

            setError(msg);
        } finally {
            setAdding(false);
        }
    };

    const handleResetPassword = async (staff) => {
        const newPassword = prompt(
            `Enter a new password for ${staff.username}:`
        );
        if (!newPassword) return;

        try {
            const res = await api.post("/staff/reset-password/", {
                staff_id: staff.id,
                new_password: newPassword,
            });
            alert(res.data.message || "Password reset successful!");
        } catch (err) {
            console.error("❌ Error resetting password:", err);
            alert(
                err.response?.data?.detail ||
                "Failed to reset password. Check backend logs."
            );
        }
    };

    const handleDeleteStaff = async (staff) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to remove ${staff.username}?`
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/staff/${staff.id}/delete/`);
            alert(`✅ ${staff.username} removed successfully.`);
            setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
            setSelectedStaff(null);
        } catch (err) {
            console.error("❌ Failed to delete staff:", err);
            alert(
                "Error deleting staff. Please check your backend logs or permissions."
            );
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <aside className="hidden md:block w-64">
                <Sidebar open={true} />
            </aside>

            <div className="md:hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col">
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <div>
                            <h1 className="text-xl font-semibold">Blood Collection Staff</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage and monitor your phlebotomists
                            </p>
                        </div>
                        <button
                            onClick={handleAddOpen}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
                        >
                            + Add Blood Collection Boy
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-3 border border-red-300 whitespace-pre-line">
                            {error}
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto"
                    >
                        <table className="w-full min-w-[700px] border-collapse">
                            <thead>
                                <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                                    <th className="text-left py-3 px-4 font-medium">Username</th>
                                    <th className="text-left py-3 px-4 font-medium">Phone</th>
                                    <th className="text-right py-3 px-4 font-medium">Joined On</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="3" className="py-6 text-center">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : staffList.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="text-center py-6 text-gray-500 dark:text-gray-400"
                                        >
                                            No staff found.
                                        </td>
                                    </tr>
                                ) : (
                                    staffList.map((s) => (
                                        <tr
                                            key={s.id}
                                            onClick={() => setSelectedStaff(s)}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-4 font-medium">{s.username}</td>
                                            <td className="py-3 px-4">{s.phone || "—"}</td>
                                            <td className="py-3 px-4 text-right">
                                                {s.created_at
                                                    ? formatFullDate(new Date(s.created_at))
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </motion.div>

                    {/* Add Staff Modal */}
                    {showAddModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowAddModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <h2 className="text-lg font-semibold mb-4">Add New Staff</h2>

                                {error && (
                                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm mb-3 border border-red-300 whitespace-pre-line">
                                        {error}
                                    </div>
                                )}

                                <form onSubmit={handleAddStaff} className="space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        value={newStaff.username}
                                        onChange={(e) =>
                                            setNewStaff((p) => ({ ...p, username: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 rounded-lg border"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        value={newStaff.phone}
                                        onChange={(e) =>
                                            setNewStaff((p) => ({ ...p, phone: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 rounded-lg border"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={newStaff.password}
                                        onChange={(e) =>
                                            setNewStaff((p) => ({ ...p, password: e.target.value }))
                                        }
                                        className="w-full px-3 py-2 rounded-lg border"
                                        required
                                    />

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-4 py-2 rounded-lg bg-gray-200 text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={adding}
                                            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
                                        >
                                            {adding ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}

                    {/* Staff Details Modal */}
                    {selectedStaff && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                            onClick={() => setSelectedStaff(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 border"
                            >
                                <h2 className="text-lg font-semibold mb-4">
                                    {selectedStaff.username}
                                </h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Phone:</span>
                                        <span>{selectedStaff.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Role:</span>
                                        <span>{selectedStaff.role}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Joined:</span>
                                        <span>
                                            {selectedStaff.created_at
                                                ? formatFullDate(new Date(selectedStaff.created_at))
                                                : "—"}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between mt-6 gap-3">
                                    <button
                                        onClick={() => handleResetPassword(selectedStaff)}
                                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                    >
                                        Reset Password
                                    </button>

                                    <button
                                        onClick={() => handleDeleteStaff(selectedStaff)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Remove Staff
                                    </button>

                                    <button
                                        onClick={() => setSelectedStaff(null)}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
