// src/pages/Staff/Dashboard.jsx
import React, { useState, useEffect } from "react";
import StaffSidebar from "../../components/Sidebar/StaffSidebar";
import StaffNavbar from "../../components/Navbar/StaffNavbar";
import AddPatientForm from "../../components/Forms/AddPatientForm";
import AddExpenseForm from "../../components/Forms/AddExpenseForm";
import { getExpenses as apiGetExpenses } from "../../api/expenseService";
import api from "../../api/apiClient";

// Helper to format Date -> YYYY-MM-DD
const formatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [todayCount, setTodayCount] = useState(0); // 🔥 Dynamic patient count

  // Tabs: "patients" or "expenses"
  const [activeTab, setActiveTab] = useState("patients");

  // Expenses state
  const [expenses, setExpenses] = useState([]);
  // selected date for expenses view (default to today)
  const [selectedExpenseDate, setSelectedExpenseDate] = useState(
    formatDate(new Date())
  );
  const [expensesLoading, setExpensesLoading] = useState(false);

  // =========================
  //  1️⃣ Fetch logged-in staff
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/profile/");
        setStaff(res.data);

        // Once profile loads → also load today's patients
        fetchTodayPatients();
        // Also load expenses for today's date (but do not block main loading)
        fetchExpenses(selectedExpenseDate);
      } catch (err) {
        console.error("❌ Failed to load staff profile:", err);
        setError("Unable to load staff information. Please re-login.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =========================
  //  Expenses fetcher (by date)
  // =========================
  async function fetchExpenses(date = selectedExpenseDate) {
    setExpensesLoading(true);
    try {
      // request with date param - backend already supports this
      const res = await api.get("/expenses/", { params: { date } });
      const raw = Array.isArray(res.data) ? res.data : [];
      // client-side safe filter: only exact-date items
      const filtered = raw.filter((it) => it.date === date);
      setExpenses(filtered);
    } catch (err) {
      console.error("❌ Failed to load expenses:", err);
      setExpenses([]); // fallback safe state
    } finally {
      setExpensesLoading(false);
    }
  }

  // Call fetchExpenses when selectedExpenseDate changes
  useEffect(() => {
    if (activeTab === "expenses") {
      fetchExpenses(selectedExpenseDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExpenseDate, activeTab]);

  // =========================
  //  2️⃣ Fetch today's patients
  // =========================
  const fetchTodayPatients = async () => {
    try {
      const res = await api.get("/patients/");
      setTodayCount(res.data);
    } catch (err) {
      console.error("❌ Failed to load today's patients:", err);
    }
  };

  // Called by AddPatientForm after successful save
  const handlePatientAdded = () => {
    fetchTodayPatients();
  };

  // Called by AddExpenseForm after successful save
  const handleExpenseSaved = () => {
    // refresh current selected date's expenses
    fetchExpenses(selectedExpenseDate);
  };

  // =========================
  //  Loading / Error UI
  // =========================

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600 dark:text-gray-300">
        Loading staff dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  // Show correct staff name
  const displayName =
    staff?.first_name || staff?.username || staff?.name || "Staff";

  // patientCount might be an array or number depending on backend; guard length
  const patientCountNumber = Array.isArray(todayCount)
    ? todayCount.length
    : Number(todayCount) || 0;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* ===== Sidebar (desktop) ===== */}
      <aside className="hidden md:block w-64">
        <StaffSidebar open={true} />
      </aside>

      {/* ===== Sidebar (mobile) ===== */}
      <div className="md:hidden">
        <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ===== Main Content ===== */}
      <div className="flex-1 flex flex-col">
        <StaffNavbar
          onOpenSidebar={() => setSidebarOpen(true)}
          patientCount={patientCountNumber} // 🔥 REAL COUNT
        />

        <main className="flex-1 w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-5xl mx-auto">
          <h1 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Welcome, {displayName} 👋
          </h1>

          {/* ===== Tabs ===== */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setActiveTab("patients")}
              className={`px-3 py-1 rounded-md ${activeTab === "patients"
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                }`}
            >
              Patients
            </button>

            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-3 py-1 rounded-md ${activeTab === "expenses"
                ? "bg-red-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                }`}
            >
              My Expenses
            </button>
          </div>

          {/* ===== Patients Tab (original UI) ===== */}
          {activeTab === "patients" && (
            <>
              <h2 className="text-base font-medium text-gray-600 dark:text-gray-400 mb-2">
                Add New Patient
              </h2>

              <div className="bg-white dark:bg-gray-800 rounded-xl sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                {/* 🔥 Pass callback to update count */}
                <AddPatientForm onPatientAdded={handlePatientAdded} />
              </div>
            </>
          )}

          {/* ===== Expenses Tab (new UI) ===== */}
          {activeTab === "expenses" && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-medium text-gray-600 dark:text-gray-400">
                    My Expenses
                  </h2>
                  <p className="text-sm text-gray-500">View and add daily expenses</p>
                </div>

                {/* Date filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500">Date</label>
                  <input
                    type="date"
                    value={selectedExpenseDate}
                    onChange={(e) => setSelectedExpenseDate(e.target.value)}
                    className="px-3 py-2 rounded-lg border bg-white dark:bg-gray-800"
                  />
                </div>
              </div>

              {/* Expenses list */}
              <div className="bg-white dark:bg-gray-800 rounded-xl sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                {expensesLoading ? (
                  <div className="text-sm text-gray-500">Loading expenses…</div>
                ) : expenses && expenses.length ? (
                  <ul className="space-y-2">
                    {expenses.map((ex) => (
                      <li key={ex.id} className="p-3 border rounded bg-white dark:bg-gray-900">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">₹{ex.amount} — {ex.note || "-"}</div>
                            <div className="text-xs text-gray-500">
                              {ex.date} • {ex.created_by_name || "You"}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">No expenses for this date.</div>
                )}

                {/* Add expense form */}
                <div className="mt-4">
                  <AddExpenseForm onSaved={handleExpenseSaved} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
