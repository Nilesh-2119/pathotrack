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
            setError("Failed to load staff. Check backend.");
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
            alert("Staff added successfully!");
        } catch (err) {
            let msg = "Error adding staff.";

            if (err.response?.data) {
                const data = err.response.data;

                if (typeof data === "object" && !Array.isArray(data)) {
                    msg = Object.entries(data)
                        .map(([field, messages]) => `${field}: ${messages}`)
                        .join("\n");
                } else if (typeof data === "string") msg = data;
            }

            setError(msg);
        } finally {
            setAdding(false);
        }
    };

    const handleResetPassword = async (staff) => {
        const newPassword = prompt(`Enter new password for ${staff.username}:`);
        if (!newPassword) return;

        try {
            const res = await api.post("/staff/reset-password/", {
                staff_id: staff.id,
                new_password: newPassword,
            });
            alert(res.data.message || "Password reset successful!");
        } catch (err) {
            alert("Failed to reset password.");
        }
    };

    const handleDeleteStaff = async (staff) => {
        const confirmDelete = window.confirm(
            `Remove ${staff.username}?`
        );
        if (!confirmDelete) return;

        try {
            await api.delete(`/staff/${staff.id}/delete/`);
            alert(`Removed ${staff.username}`);
            setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
            setSelectedStaff(null);
        } catch {
            alert("Failed to delete staff.");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

            {/* SIDEBAR */}
            <aside className="hidden md:block w-64">
                <Sidebar open={true} />
            </aside>

            <div className="md:hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col">
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="p-4 md:p-6 max-w-7xl mx-auto w-full">

                    {/* HEADER */}
                    <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
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
                        <div className="bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm mb-3 whitespace-pre-line">
                            {error}
                        </div>
                    )}

                    {/* STAFF TABLE (DESKTOP) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="hidden md:block bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border dark:border-gray-700"
                    >
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-sm text-gray-500 dark:text-gray-300 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
                                    <th className="py-3 px-4 text-left">Username</th>
                                    <th className="py-3 px-4 text-left">Phone</th>
                                    <th className="py-3 px-4 text-right">Joined On</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y dark:divide-gray-700 text-sm">
                                {loading ? (
                                    <tr><td colSpan="3" className="py-6 text-center">Loading...</td></tr>
                                ) : staffList.length === 0 ? (
                                    <tr><td colSpan="3" className="py-6 text-center">No staff found.</td></tr>
                                ) : (
                                    staffList.map((s) => (
                                        <tr
                                            key={s.id}
                                            onClick={() => setSelectedStaff(s)}
                                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <td className="py-3 px-4 font-medium">{s.username}</td>
                                            <td className="py-3 px-4">{s.phone || "—"}</td>
                                            <td className="py-3 px-4 text-right">
                                                {s.created_at ? formatFullDate(new Date(s.created_at)) : "—"}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </motion.div>

                    {/* MOBILE CARD VIEW */}
                    <div className="md:hidden space-y-3">
                        {staffList.map((s) => (
                            <div
                                key={s.id}
                                onClick={() => setSelectedStaff(s)}
                                className="p-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm cursor-pointer"
                            >
                                <div className="font-semibold text-lg">{s.username}</div>
                                <div className="text-sm mt-1 text-gray-600 dark:text-gray-300">
                                    Phone: {s.phone}
                                </div>

                            </div>
                        ))}
                    </div>

                </main>
            </div>

            {/* ADD STAFF MODAL */}
            {showAddModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
                    onClick={() => setShowAddModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 shadow-xl border dark:border-gray-700"
                    >
                        <h2 className="text-lg font-semibold mb-4">Add New Staff</h2>

                        {error && (
                            <div className="bg-red-200 text-red-800 px-3 py-2 rounded text-sm mb-3 whitespace-pre-line">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={newStaff.username}
                                onChange={(e) => setNewStaff((p) => ({ ...p, username: e.target.value }))}
                                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newStaff.phone}
                                onChange={(e) => setNewStaff((p) => ({ ...p, phone: e.target.value }))}
                                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newStaff.password}
                                onChange={(e) => setNewStaff((p) => ({ ...p, password: e.target.value }))}
                                className="w-full p-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
                                required
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={adding}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                                >
                                    {adding ? "Saving…" : "Save"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* STAFF DETAILS MODAL */}
            {selectedStaff && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3"
                    onClick={() => setSelectedStaff(null)}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl p-6 shadow-xl border dark:border-gray-700"
                    >
                        <h2 className="text-lg font-semibold mb-4">{selectedStaff.username}</h2>

                        <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Phone:</span>
                                <span>{selectedStaff.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Role:</span>
                                <span>{selectedStaff.role}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => handleResetPassword(selectedStaff)}
                                className="flex-1 bg-yellow-500 text-white py-2 rounded-lg"
                            >
                                Reset Password
                            </button>

                            <button
                                onClick={() => handleDeleteStaff(selectedStaff)}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
                            >
                                Remove Staff
                            </button>

                            <button
                                onClick={() => setSelectedStaff(null)}
                                className="flex-1 bg-gray-300 dark:bg-gray-700 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
