// src/pages/Admin/Dashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import StatCard from "../../components/Cards/StatCard";
import DailyReportsChart from "../../components/Charts/DailyReportsChart";
import PatientsTable from "../../components/Tables/PatientsTable";
import MonthlyReportChart from "../../components/Charts/MonthlyReportChart";
import { formatFullDate } from "../../utils/dateFormat";

import {
  Users,
  IndianRupee,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  Plus,
} from "lucide-react";

import { motion } from "framer-motion";
import api from "../../api/apiClient";

// ⏳ Date formatter
const formatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [patientData, setPatientData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Expense Modal
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseNote, setExpenseNote] = useState("");
  const [submittingExpense, setSubmittingExpense] = useState(false);

  const selectedDateStr = formatDate(selectedDate);

  // Load data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // Load patients & expenses when date changes
  useEffect(() => {
    fetchPatients();
    fetchExpenses();
  }, [selectedDateStr]);

  // ---------------------------------------
  // FETCHERS
  // ---------------------------------------

  const fetchAll = async () => {
  setLoading(true);
  try {
    const [p1, e1] = await Promise.all([
      api.get("/patients/"),
      api.get("/expenses/", { params: { date: selectedDateStr } }),
    ]);

    setPatientData(p1.data || []);

    // client-side fallback: keep only items with exact date match
    const rawExpenses = Array.isArray(e1.data) ? e1.data : [];
    const filtered = rawExpenses.filter((it) => it.date === selectedDateStr);
    setExpenses(filtered);
  } catch (err) {
    console.error("❌ Dashboard load error:", err);
  } finally {
    setLoading(false);
  }
};


  const fetchPatients = async () => {
    try {
      const p = await api.get("/patients/");
      setPatientData(p.data || []);
    } catch (err) {
      console.error("❌ Failed loading patients:", err);
    }
  };

 const fetchExpenses = async () => {
  try {
    const e = await api.get("/expenses/", { params: { date: selectedDateStr } });
    const rawExpenses = Array.isArray(e.data) ? e.data : [];
    // fallback filter to ensure only exact-date entries are shown
    setExpenses(rawExpenses.filter((it) => it.date === selectedDateStr));
  } catch (err) {
    console.error("❌ Failed loading expenses:", err);
  }
};


  // ---------------------------------------
  // FILTERED PATIENTS BY DATE
  // ---------------------------------------

  const filteredPatients = useMemo(() => {
    return (patientData || []).filter(
      (p) => p.sample_date === selectedDateStr
    );
  }, [patientData, selectedDateStr]);

  // ---------------------------------------
  // EXPENSE TOTAL
  // ---------------------------------------

  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount || 0),
    0
  );

  // ---------------------------------------
  // STAT CALCULATIONS
  // ---------------------------------------

  const stats = {
    patients: filteredPatients.length,
    received: filteredPatients.reduce(
      (sum, p) => sum + Number(p.paid_amount || 0),
      0
    ),
    pending: filteredPatients.reduce(
      (sum, p) => sum + Number(p.pending_amount || 0),
      0
    ),
  };

  // 💰 Net earnings = received - expenses
  const netEarnings = stats.received - totalExpenses;

  // ---------------------------------------
  // Day switcher
  // ---------------------------------------

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  // ---------------------------------------
  // ADD EXPENSE
  // ---------------------------------------

  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!expenseAmount || Number(expenseAmount) <= 0) return;

    setSubmittingExpense(true);
    try {
      await api.post("/expenses/", {
        amount: expenseAmount,
        note: expenseNote,
        date: selectedDateStr,
      });

      fetchExpenses();
      setExpenseAmount("");
      setExpenseNote("");
      setShowExpenseModal(false);
    } catch (err) {
      console.log("❌ EXPENSE ERROR FULL:", err.response?.data);
      alert(JSON.stringify(err.response?.data));
    } finally {
      setSubmittingExpense(false);
    }
  };

  // ---------------------------------------
  // DELETE EXPENSE
  // ---------------------------------------
  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      await api.delete(`/expenses/${id}/`);
      fetchExpenses();
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  // ---------------------------------------
  // LOADING UI
  // ---------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  // ---------------------------------------
  // UI STARTS HERE
  // ---------------------------------------

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="hidden md:block w-64">
        <Sidebar open={true} />
      </aside>

      <div className="md:hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">

          {/* ------------------------------------ */}
          {/* DATE HEADER (RESPONSIVE) */}
          {/* ------------------------------------ */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevDay}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <ArrowLeft size={18} />
              </button>

              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Reports for
                </div>
                <div className="font-semibold">{formatFullDate(selectedDate)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 text-sm rounded-lg border bg-gray-100 dark:bg-gray-700 w-full sm:w-auto"
              />

              <button
                onClick={handleNextDay}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                <Plus size={14} /> Add Expense
              </button>
            </div>
          </div>

          {/* ------------------------------------ */}
          {/* STAT CARDS (RESPONSIVE) */}
          {/* ------------------------------------ */}

          <motion.div
            key={selectedDateStr}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <StatCard title="OPD Patients" value={stats.patients}>
              <Users />
            </StatCard>

            <StatCard title="Amount Received" value={`₹${stats.received}`}>
              <IndianRupee />
            </StatCard>

            <StatCard title="Amount Pending" value={`₹${stats.pending}`}>
              <DollarSign />
            </StatCard>

            <StatCard title="Expenses" value={`₹${totalExpenses}`}>
              <IndianRupee />
            </StatCard>

            <StatCard title="Net Total" value={`₹${netEarnings}`}>
              <IndianRupee />
            </StatCard>
          </motion.div>

          {/* ------------------------------------ */}
          {/* DAILY CHART */}
          {/* ------------------------------------ */}

          {/* <DailyReportsChart
            data={filteredPatients.map((p, i) => ({
              day: i + 1,
              reports: p.status === "Report Given" ? 1 : 0,
            }))}
          /> */}

          {/* ------------------------------------ */}
          {/* PATIENTS TABLE */}
          {/* ------------------------------------ */}

          {/* <PatientsTable
            rows={filteredPatients.map((p) => ({
              id: p.id,
              name: p.full_name,
              phone: p.phone,
              amountPaid: Number(p.paid_amount || 0),
              amountPending: Number(p.pending_amount || 0),
              staff: p.created_by_name || "—",
              status: p.status || "Pending",
            }))}
          /> */}

          {/* ------------------------------------ */}
          {/* MONTHLY REPORT */}
          {/* ------------------------------------ */}

          {/* <MonthlyReportChart
            data={[]} // You can replace later
            monthName={selectedDate.toLocaleString("default", { month: "long" })}
          /> */}

          {/* ------------------------------------ */}
          {/* EXPENSE LIST */}
          {/* ------------------------------------ */}

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
            <h2 className="text-lg mb-3 font-semibold">Expenses ({selectedDateStr})</h2>

            {expenses.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No expenses found.</p>
            ) : (
              <div className="space-y-3">
                {expenses.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">₹{e.amount}</div>
                      <div className="text-xs text-gray-500">
                        {e.note || "No note"}{" "}
                        <span className="mx-1">•</span>{" "}
                        <span className="font-medium">{e.created_by_name || "Unknown"}</span>{" "}
                        <span className="text-gray-400">on</span>{" "}
                        <span>{e.date || selectedDateStr}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteExpense(e.id)}
                      className="px-3 py-1 text-white bg-red-600 rounded-lg text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ------------------------------------ */}
      {/* ADD EXPENSE MODAL */}
      {/* ------------------------------------ */}

      {showExpenseModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3"
          onClick={() => setShowExpenseModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-5 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">
              Add Expense ({selectedDateStr})
            </h3>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="text-sm block mb-1">Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="text-sm block mb-1">Note</label>
                <input
                  type="text"
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border dark:bg-gray-900 dark:border-gray-700"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submittingExpense}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  {submittingExpense ? "Saving..." : "Save Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
