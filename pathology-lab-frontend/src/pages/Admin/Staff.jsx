// src/pages/Admin/Staff.jsx
import React, { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { motion } from "framer-motion";
import { formatFullDate } from "../../utils/dateFormat";

const staffData = [
    {
        id: 1,
        name: "Rahul Singh",
        phone: "9876543210",
        empId: "EMP001",
        username: "rahul_s",
        totalPatients: 45,
        joinedOn: "2024-05-10",
    },
    {
        id: 2,
        name: "Vikas Shah",
        phone: "9988776655",
        empId: "EMP002",
        username: "vikas_shah",
        totalPatients: 60,
        joinedOn: "2023-12-01",
    },
    {
        id: 3,
        name: "Amit Patil",
        phone: "9123456789",
        empId: "EMP003",
        username: "amit_p",
        totalPatients: 38,
        joinedOn: "2024-02-15",
    },
];

export default function Staff() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar */}
            <aside className="hidden md:block w-64">
                <Sidebar open={true} />
            </aside>

            {/* Sidebar (mobile drawer) */}
            <div className="md:hidden">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-wrap justify-between items-center mb-6">
                        <div>
                            <h1 className="text-xl font-semibold">Blood Collection Staff</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Manage and monitor your phlebotomists
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm"
                        >
                            + Add Blood Collection Boy
                        </button>
                    </div>

                    {/* Staff Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto"
                    >
                        <table className="w-full min-w-[700px] border-collapse">
                            <thead>
                                <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
                                    <th className="text-left py-3 px-4 font-medium">Name</th>
                                    <th className="text-left py-3 px-4 font-medium">Phone</th>
                                    <th className="text-left py-3 px-4 font-medium">Employee ID</th>
                                    <th className="text-left py-3 px-4 font-medium">Username</th>
                                    <th className="text-right py-3 px-4 font-medium">Patients Collected</th>
                                    <th className="text-left py-3 px-4 font-medium">Joined On</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700">
                                {staffData.map((staff) => (
                                    <tr
                                        key={staff.id}
                                        onClick={() => setSelectedStaff(staff)}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                    >
                                        <td className="py-3 px-4 font-medium">{staff.name}</td>
                                        <td className="py-3 px-4">{staff.phone}</td>
                                        <td className="py-3 px-4">{staff.empId}</td>
                                        <td className="py-3 px-4">{staff.username}</td>
                                        <td className="py-3 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">
                                            {staff.totalPatients}
                                        </td>
                                        <td className="py-3 px-4">
                                            {formatFullDate(new Date(staff.joinedOn))}
                                        </td>
                                    </tr>
                                ))}
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
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setShowAddModal(false);
                                        alert("Staff added (mock)!");
                                    }}
                                    className="space-y-3"
                                >
                                    <input
                                        type="text"
                                        placeholder="Full Name"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Phone Number"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Employee ID"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Username"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                        required
                                    />

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                        >
                                            Save
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
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                    Staff Details
                                </h2>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Name:</span>
                                        <span className="font-medium">{selectedStaff.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Phone:</span>
                                        <span>{selectedStaff.phone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Employee ID:</span>
                                        <span>{selectedStaff.empId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Username:</span>
                                        <span>{selectedStaff.username}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Total Patients:</span>
                                        <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                            {selectedStaff.totalPatients}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500 dark:text-gray-400">Joined On:</span>
                                        <span>{formatFullDate(new Date(selectedStaff.joinedOn))}</span>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-between mt-6">
                                    <button
                                        onClick={() => setShowResetModal(true)}
                                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
                                    >
                                        Reset Password
                                    </button>
                                    <button
                                        onClick={() => setSelectedStaff(null)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Reset Password Modal */}
                    {showResetModal && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                            onClick={() => setShowResetModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 border border-gray-200 dark:border-gray-700"
                            >
                                <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    Enter a new password for <strong>{selectedStaff?.name}</strong>.
                                </p>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        setShowResetModal(false);
                                        alert("Password reset successfully (mock)!");
                                    }}
                                    className="space-y-3"
                                >
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                        required
                                    />
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm"
                                        required
                                    />

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowResetModal(false)}
                                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
