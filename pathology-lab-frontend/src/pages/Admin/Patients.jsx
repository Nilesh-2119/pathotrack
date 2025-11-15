// src/pages/Admin/Patients.jsx
import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { motion } from "framer-motion";
import api from "../../api/apiClient";

// format date YYYY-MM-DD from Date object
const formatDateStr = (d) => {
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function AdminPatients() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [patients, setPatients] = useState([]);
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [paymentInput, setPaymentInput] = useState("");

    const selectedDateStr = formatDateStr(selectedDate);

    // load patients
    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            setLoading(true);
            const res = await api.get("/patients/");
            setPatients(res.data || []);
        } catch (err) {
            console.error("❌ Failed to load patients:", err);
        } finally {
            setLoading(false);
        }
    };

    // derive doctor list for dropdown
    const doctorList = useMemo(() => {
        const names = patients
            .map((p) => p.referred_by)
            .filter(Boolean);
        // unique
        return Array.from(new Set(names));
    }, [patients]);

    // filtered patients by date, search, doctor
    const filteredPatients = useMemo(() => {
        return patients.filter((p) => {
            const matchDate = p.sample_date === selectedDateStr;
            const term = searchTerm.trim().toLowerCase();
            const matchSearch =
                !term ||
                (p.full_name && p.full_name.toLowerCase().includes(term)) ||
                (p.phone && p.phone.includes(term));
            const matchDoctor = selectedDoctor ? p.referred_by === selectedDoctor : true;
            return matchDate && matchSearch && matchDoctor;
        });
    }, [patients, selectedDateStr, searchTerm, selectedDoctor]);

    // ===== Payment update (keeps modal open) =====
    const handlePaymentUpdate = async () => {
        const amt = Number(paymentInput);
        if (!selectedPatient || !amt || amt <= 0) return;

        try {
            setUpdating(true);
            const newPaid = Number(selectedPatient.paid_amount || 0) + amt;
            let newPending = Number(selectedPatient.total_price || 0) - newPaid;
            if (newPending < 0) newPending = 0;

            await api.patch(`/patients/${selectedPatient.id}/`, {
                paid_amount: newPaid,
                pending_amount: newPending,
            });

            // Update local state immediately (keeps modal open)
            setSelectedPatient((prev) => prev ? {
                ...prev,
                paid_amount: String(newPaid),
                pending_amount: String(newPending),
            } : prev);

            // refresh list in background (non-blocking)
            loadPatients();

            setPaymentInput("");
        } catch (err) {
            console.error("❌ Payment update failed:", err);
        } finally {
            setUpdating(false);
        }
    };

    // ===== Mark report given (close modal after) =====
    const handleReportUpdate = async () => {
        if (!selectedPatient) return;

        try {
            setUpdating(true);
            await api.patch(`/patients/${selectedPatient.id}/`, {
                status: "Report Given",
            });

            // refresh and close modal
            await loadPatients();
            setSelectedPatient(null);
        } catch (err) {
            console.error("❌ Failed to update report:", err);
        } finally {
            setUpdating(false);
        }
    };

    // mobile card + desktop table responsive UI
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

                <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                    {/* Header + Filters */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                        <div>
                            <h1 className="text-xl font-semibold">Patients List</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing patients for <span className="font-medium">{selectedDateStr}</span>
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 items-center">
                            <input
                                type="date"
                                value={selectedDateStr}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                className="px-3 py-2 text-sm rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                            />

                            <input
                                type="text"
                                placeholder="Search name / phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-3 py-2 text-sm rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-700 w-48 md:w-64"
                            />

                            <select
                                value={selectedDoctor}
                                onChange={(e) => setSelectedDoctor(e.target.value)}
                                className="px-3 py-2 text-sm rounded-lg border bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                            >
                                <option value="">All Doctors</option>
                                {doctorList.map((dr, i) => (
                                    <option key={i} value={dr}>
                                        {dr}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Patients area */}
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-5 shadow-sm border border-gray-200 dark:border-gray-700"
                    >
                        {loading ? (
                            <div className="py-16 text-center text-gray-500 dark:text-gray-300">Loading patients...</div>
                        ) : filteredPatients.length === 0 ? (
                            <div className="py-10 text-center text-gray-500 dark:text-gray-300">No patients found.</div>
                        ) : (
                            <>
                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-auto">
                                    <table className="w-full min-w-[700px] text-sm">
                                        <thead>
                                            <tr className="text-left border-b bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-300">
                                                <th className="py-3 px-3 font-medium">Patient</th>
                                                <th className="py-3 px-3 font-medium">Phone</th>
                                                <th className="py-3 px-3 text-right font-medium">Paid</th>
                                                <th className="py-3 px-3 text-right font-medium">Pending</th>
                                                <th className="py-3 px-3 font-medium">Collected By</th>
                                                <th className="py-3 px-3 text-center font-medium">Status</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {filteredPatients.map((p) => (
                                                <tr
                                                    key={p.id}
                                                    onClick={() => setSelectedPatient(p)}
                                                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <td className="py-3 px-3 font-medium">{p.full_name || "—"}</td>
                                                    <td className="py-3 px-3">{p.phone || "—"}</td>
                                                    <td className="py-3 px-3 text-right text-green-600 dark:text-green-400 font-semibold">
                                                        ₹{p.paid_amount || 0}
                                                    </td>
                                                    <td className="py-3 px-3 text-right text-red-500 font-semibold">
                                                        {p.pending_amount > 0 ? `₹${p.pending_amount}` : "—"}
                                                    </td>
                                                    <td className="py-3 px-3">{p.created_by_name || p.created_by || "—"}</td>
                                                    <td className="py-3 px-3 text-center">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === "Report Given"
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                                }`}
                                                        >
                                                            {p.status || "Pending"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile list */}
                                <div className="md:hidden space-y-3">
                                    {filteredPatients.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => setSelectedPatient(p)}
                                            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700 cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="font-medium">{p.full_name}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Collected By
                                                        <span className="font-semibold"> {p.created_by_name || p.created_by || "—"}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-green-600 dark:text-green-400 font-semibold">₹{p.paid_amount || 0}</div>
                                                    <div className="text-sm text-red-500">{p.pending_amount > 0 ? `₹${p.pending_amount}` : "—"}</div>
                                                </div>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between text-sm">
                                                <div className={`font-medium ${p.status === "Report Given" ? "text-green-600" : "text-yellow-600"}`}>
                                                    {p.status || "Pending"}
                                                </div>
                                                <div className="text-xs text-gray-500">{p.sample_date}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </motion.div>
                </main>
            </div>

            {/* Patient details modal (same UX as staff) */}
            {selectedPatient && (
                <div
                    className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3"
                    onClick={() => setSelectedPatient(null)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl p-5 max-w-lg w-full shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-xl font-semibold mb-2">{selectedPatient.full_name}</h2>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div><b>Age:</b> {selectedPatient.age}</div>
                            <div><b>Phone:</b> {selectedPatient.phone || "—"}</div>
                            <div><b>Sample Date:</b> {selectedPatient.sample_date || "—"}</div>
                            <div><b>Collected By:</b> {selectedPatient.created_by_name || selectedPatient.created_by || "—"}</div>
                        </div>

                        <p className="mb-2"><b>Referred By:</b> {selectedPatient.referred_by || "—"}</p>

                        <p className="mt-2 font-semibold">Tests:</p>
                        <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3">
                            <ul className="list-disc ml-4 space-y-1 text-sm">
                                {selectedPatient.tests && selectedPatient.tests.length > 0 ? (
                                    selectedPatient.tests.map((t) => (
                                        <li key={t.id} className="flex justify-between">
                                            <span>{t.name}</span>
                                            <span className="font-medium">₹{t.price}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-gray-500">No tests found</li>
                                )}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <div><b>Total:</b> ₹{selectedPatient.total_price || 0}</div>
                            <div><b>Paid:</b> ₹{selectedPatient.paid_amount || 0}</div>
                            <div><b>Pending:</b> ₹{selectedPatient.pending_amount || 0}</div>
                            <div className="text-right text-xs text-gray-500">{/* placeholder */}</div>
                        </div>

                        {/* Payment update */}
                        {Number(selectedPatient.pending_amount) > 0 && (
                            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <label className="block text-sm font-medium mb-1">Enter Amount Received</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={paymentInput}
                                    onChange={(e) => setPaymentInput(e.target.value)}
                                    placeholder="₹ Enter amount"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                />

                                <div className="flex gap-3 mt-3">
                                    <button
                                        onClick={handlePaymentUpdate}
                                        disabled={updating}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                                    >
                                        {updating ? "Updating…" : "Update Payment"}
                                    </button>

                                    {/* Mark report given also available here */}
                                    <button
                                        onClick={handleReportUpdate}
                                        disabled={updating}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                                    >
                                        {updating ? "Updating…" : "Mark Report Given"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* If no pending, allow marking report or close */}
                        {Number(selectedPatient.pending_amount) <= 0 && (
                            <div className="mt-3 space-y-2">
                                {selectedPatient.status !== "Report Given" && (
                                    <button
                                        onClick={handleReportUpdate}
                                        disabled={updating}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                                    >
                                        {updating ? "Updating…" : "Mark Report Given"}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => setSelectedPatient(null)}
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
