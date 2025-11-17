// src/components/Forms/AddPatientForm.jsx
import React, { useState } from "react";
import api from "../../api/apiClient";
import TestSelect from "../TestSelect";
import { motion } from "framer-motion";

export default function AddPatientForm({ onPatientAdded }) {
    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "",
        phone: "",
        referred_by: "",
        sample_date: "",
        tests: [],
        concession: "0",
        paid_amount: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [showSummary, setShowSummary] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTestsChange = (selectedTests) => {
        setForm((prev) => ({ ...prev, tests: selectedTests }));
    };

    // Compute summary & unique tube names
    const summary = (() => {
        const total = (form.tests || []).reduce(
            (sum, t) => sum + (Number(t.price) || 0),
            0
        );
        const concession = Number(form.concession) || 0;
        const paid = Number(form.paid_amount) || 0;
        const final = total - concession;
        const pending = final - paid;
        return {
            total,
            concession,
            paid,
            final: final < 0 ? 0 : final,
            pending: pending < 0 ? 0 : pending,
        };
    })();

    // unique tubes (names) aggregated from selected tests
    const usedTubes = (() => {
        const names = {};
        (form.tests || []).forEach((t) => {
            if (t.tubes && t.tubes.length) {
                t.tubes.forEach((tube) => {
                    names[tube.name] = (names[tube.name] || 0) + 1;
                });
            } else if (t.tube_name) {
                // backwards compatibility if older field exists
                names[t.tube_name] = (names[t.tube_name] || 0) + 1;
            }
        });
        // return array of { name, count }
        return Object.keys(names).map((n) => ({ name: n, count: names[n] }));
    })();

    const handlePreview = (e) => {
        e.preventDefault();
        setMessage("");
        if (!form.name || !form.age || !form.gender || !form.phone) {
            setMessage("⚠️ Please fill all mandatory fields.");
            return;
        }
        if (!form.tests.length) {
            setMessage("⚠️ Please select at least one test.");
            return;
        }
        setShowSummary(true);
    };

    const handleConfirm = async () => {
        setLoading(true);
        setMessage("");

        try {
            const payload = {
                full_name: form.name.trim(),
                age: form.age,
                gender: form.gender === "M" ? "Male" : form.gender === "F" ? "Female" : form.gender,
                phone: form.phone,
                referred_by: form.referred_by,
                sample_date: form.sample_date || null,
                // backend PatientSerializer expects "tests" as list of ids (see your serializer)
                test_ids: form.tests.map((t) => t.id),
                total_price: summary.total,
                concession: summary.concession,
                final_price: summary.final,
                paid_amount: summary.paid,
                pending_amount: summary.pending,
            };

            await api.post("/patients/", payload);

            setMessage("✅ Patient added successfully!");
            setForm({
                name: "",
                age: "",
                gender: "",
                phone: "",
                referred_by: "",
                sample_date: "",
                tests: [],
                concession: "0",
                paid_amount: "",
            });
            setShowSummary(false);

            // notify parent so it can refresh counters
            if (typeof onPatientAdded === "function") onPatientAdded();
        } catch (err) {
            console.error("❌ Error adding patient:", err);
            const backendMsg =
                err?.response?.data && typeof err.response.data === "object"
                    ? JSON.stringify(err.response.data)
                    : err?.response?.data || err.message;
            setMessage("Error adding patient. " + backendMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePreview} className="space-y-4 relative bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {message && (
                <div
                    className={`p-2 rounded-lg text-sm ${message.startsWith("✅")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                >
                    {message}
                </div>
            )}

            {/* Patient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="name" placeholder="Patient Name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600" required />
                <input name="age" placeholder="Age" value={form.age} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600" required />
                <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600" required>
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600" required />
                <input name="referred_by" placeholder="Referred By" value={form.referred_by} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600" />
                <input type="date" name="sample_date" value={form.sample_date} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900" required/>
            </div>

            {/* Test multi-select */}
            <div>
                <label className="text-sm font-medium mb-1 block">Select Tests</label>
                <TestSelect selectedTests={form.tests} onChange={handleTestsChange} />
                {/* Total Amount Display */}
                {form.tests.length > 0 && (
                    <div className="mt-3 p-3 border rounded-lg bg-gray-50 text-gray-700 text-sm">
                        <div className="flex justify-between mb-2">
                            <span>Total Test Amount:</span>
                            <span className="font-semibold text-blue-600">₹{summary.total}</span>
                        </div>

                        {/* Use Tube list */}
                        <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-1">Use Tube:</div>
                            {usedTubes.length === 0 ? (
                                <div className="text-sm text-gray-500">—</div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {usedTubes.map((t) => (
                                        <div key={t.name} className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-sm">
                                            {t.name}{t.count > 1 ? ` ×${t.count}` : ""}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Payment fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="number" name="concession" placeholder="Concession (₹)" value={form.concession} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600" min="0" />
                <input type="number" name="paid_amount" placeholder="Paid Amount (₹)" value={form.paid_amount} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-600" min="0" />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg mt-3">
                Add Patient
            </button>

            {/* Summary modal */}
            {showSummary && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSummary(false)}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.25 }} onClick={(e) => e.stopPropagation()} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-3">🧾 Bill Summary</h2>

                        <div className="text-sm space-y-2">
                            <div className="flex justify-between"><span>Patient:</span><span className="font-medium">{form.name}</span></div>
                            <div className="flex justify-between"><span>Total Tests:</span><span className="font-medium">{form.tests.length}</span></div>
                            <div className="flex justify-between"><span>Total Test Price:</span><span className="font-medium">₹{summary.total}</span></div>
                            <div className="flex justify-between"><span>Concession:</span><span className="font-medium text-yellow-600">₹{summary.concession}</span></div>
                            <div className="flex justify-between"><span>Final Amount:</span><span className="font-medium text-blue-600">₹{summary.final}</span></div>
                            <div className="flex justify-between"><span>Paid:</span><span className="font-medium text-green-600">₹{summary.paid}</span></div>
                            <div className="flex justify-between border-t pt-2 mt-2"><span>Pending:</span><span className={`font-bold ${summary.pending > 0 ? "text-red-600" : "text-green-600"}`}>₹{summary.pending}</span></div>
                        </div>

                        <div className="flex justify-end gap-3 mt-5">
                            <button type="button" onClick={() => setShowSummary(false)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">Cancel</button>
                            <button type="button" onClick={handleConfirm} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">{loading ? "Saving..." : "Confirm & Save"}</button>
                        </div>
                    </motion.div>
                </div>
            )}
        </form>
    );
}
