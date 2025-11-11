// src/pages/Admin/Patients.jsx
import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { motion } from "framer-motion";
import { formatFullDate } from "../../utils/dateFormat";
import { getPatients } from "../../api/patientService";

export default function Patients() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(() => new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientData, setPatientData] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatDateStr = (d) => {
        const pad = (n) => String(n).padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };

    const selectedDateStr = formatDateStr(selectedDate);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatientData(data);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = useMemo(() => {
        return patientData.filter((p) => {
            const matchesDate = p.date === selectedDateStr;
            const matchesSearch =
                p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.phone?.includes(searchTerm);
            return matchesDate && matchesSearch;
        });
    }, [selectedDateStr, searchTerm, patientData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-500">
                Loading patients...
            </div>
        );
    }

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
                    <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
                        <div>
                            <h1 className="text-xl font-semibold">Patients List</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Showing patients for {formatFullDate(selectedDate)}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center">
                            <input
                                type="date"
                                value={selectedDateStr}
                                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
                            />
                            <input
                                type="text"
                                placeholder="Search by name or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm w-48 md:w-64"
                            />
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto"
                    >
                        <table className="w-full min-w-[700px] border-collapse">
                            <thead>
                                <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                                    <th className="text-left py-3 px-4 font-medium">Name</th>
                                    <th className="text-left py-3 px-4 font-medium">Phone</th>
                                    <th className="text-right py-3 px-4 font-medium">Amount Paid</th>
                                    <th className="text-right py-3 px-4 font-medium">Pending</th>
                                    <th className="text-left py-3 px-4 font-medium">Collected By</th>
                                    <th className="text-center py-3 px-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredPatients.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-6 text-gray-500 dark:text-gray-400">
                                            No patients found for this date.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPatients.map((p) => (
                                        <tr
                                            key={p.id}
                                            onClick={() => setSelectedPatient(p)}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-4 font-medium">{p.name || "—"}</td>
                                            <td className="py-3 px-4">{p.phone || "—"}</td>
                                            <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-semibold">
                                                ₹{p.amountPaid || 0}
                                            </td>
                                            <td className="py-3 px-4 text-right text-amber-600 dark:text-amber-400 font-semibold">
                                                {p.amountPending > 0 ? `₹${p.amountPending}` : "—"}
                                            </td>
                                            <td className="py-3 px-4">{p.staff || "—"}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === "Completed"
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                                                        }`}
                                                >
                                                    {p.status || "Pending"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
