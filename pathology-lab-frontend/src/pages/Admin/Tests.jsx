// src/pages/Admin/Tests.jsx
import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { motion } from "framer-motion";
import { Edit, Trash2, Search } from "lucide-react";
import AddTestForm from "../../components/Forms/AddTestForm";
import { fetchTests, addTest, updateTest, deleteTest } from "../../api/testService";

export default function Tests() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState("");
    const [editingTest, setEditingTest] = useState(null);
    const [showAddTest, setShowAddTest] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTests();
    }, []);

    const loadTests = async () => {
        try {
            setLoading(true);
            const data = await fetchTests();
            setTests(data);
        } catch (err) {
            console.error("Error loading tests:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTests = useMemo(() => {
        return tests.filter(
            (test) =>
                test.name.toLowerCase().includes(search.toLowerCase()) ||
                test.tube?.toLowerCase().includes(search.toLowerCase()) ||
                test.price.toString().includes(search)
        );
    }, [search, tests]);

    const handleAddTest = async (newTest) => {
        try {
            const added = await addTest(newTest);
            setTests((prev) => [...prev, added]);
        } catch (err) {
            console.error("Error adding test:", err);
        }
    };

    const handleEdit = async (updated) => {
        try {
            const edited = await updateTest(editingTest.id, updated);
            setTests((prev) =>
                prev.map((t) => (t.id === editingTest.id ? edited : t))
            );
            setEditingTest(null);
        } catch (err) {
            console.error("Error updating test:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this test?")) {
            try {
                await deleteTest(id);
                setTests((prev) => prev.filter((t) => t.id !== id));
            } catch (err) {
                console.error("Error deleting test:", err);
            }
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
                    <div className="flex flex-wrap items-center justify-between mb-5 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                            Manage Tests
                        </h1>

                        <button
                            onClick={() => setShowAddTest(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg shadow transition-all"
                        >
                            + Add Test
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mb-5">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by name, price, or tube type..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            Loading tests...
                        </p>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto"
                        >
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-gray-100 dark:border-gray-700">
                                        <th className="py-3 px-4 font-medium">Test Name</th>
                                        <th className="py-3 px-4 font-medium">Tube Type</th>
                                        <th className="py-3 px-4 font-medium">Price (₹)</th>
                                        <th className="py-3 px-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTests.length > 0 ? (
                                        filteredTests.map((test) => (
                                            <tr
                                                key={test.id}
                                                className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition"
                                            >
                                                <td className="py-3 px-4">{test.name}</td>
                                                <td className="py-3 px-4">{test.tube}</td>
                                                <td className="py-3 px-4">₹{test.price}</td>
                                                <td className="py-3 px-4 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingTest(test)}
                                                        className="p-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(test.id)}
                                                        className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="py-5 text-center text-gray-500 dark:text-gray-400"
                                            >
                                                No tests found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </motion.div>
                    )}
                </main>
            </div>

            {showAddTest && (
                <Modal title="Add New Test" onClose={() => setShowAddTest(false)}>
                    <AddTestForm
                        onClose={() => setShowAddTest(false)}
                        onAddTest={handleAddTest}
                    />
                </Modal>
            )}

            {editingTest && (
                <Modal title="Edit Test" onClose={() => setEditingTest(null)}>
                    <AddTestForm
                        onClose={() => setEditingTest(null)}
                        onAddTest={handleEdit}
                        existingTest={editingTest}
                    />
                </Modal>
            )}
        </div>
    );
}

/* ───────────────────────────── */
function Modal({ title, onClose, children }) {
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-lg border border-gray-200 dark:border-gray-700"
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>
                {children}
            </motion.div>
        </div>
    );
}
