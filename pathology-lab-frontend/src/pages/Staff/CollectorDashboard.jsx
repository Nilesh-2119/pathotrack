// src/pages/Staff/Dashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import StaffSidebar from "../../components/Sidebar/StaffSidebar";
import StaffNavbar from "../../components/Navbar/StaffNavbar";
import AddExpenseForm from "../../components/Forms/AddExpenseForm";
import api from "../../api/apiClient";

// helper YYYY-MM-DD
const formatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const selectedDateStr = formatDate(selectedDate);

  const [patients, setPatients] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [submittingExpense, setSubmittingExpense] = useState(false);

  // fetch profile once
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/profile/");
        setProfile(res.data || null);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setProfile(null);
      }
    };
    loadProfile();
  }, []);

  // fetch data when date or profile changes
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateStr, profile]);

  // fetch patients + expenses (staff-scoped)
  const fetchAll = async () => {
    setLoading(true);

    try {
      // Try server-side date filtering; fallback to client fetching if needed
      const [pRes, eRes] = await Promise.allSettled([
        api.get("/patients/", { params: { date: selectedDateStr } }),
        api.get("/expenses/", { params: { date: selectedDateStr } }),
      ]);

      let allPatients = [];
      if (pRes.status === "fulfilled" && Array.isArray(pRes.value.data)) {
        allPatients = pRes.value.data;
      } else {
        // fallback: fetch all then filter
        try {
          const r = await api.get("/patients/");
          allPatients = Array.isArray(r.data) ? r.data : [];
        } catch (err) {
          console.error("Failed fallback fetch patients:", err);
          allPatients = [];
        }
      }

      // ensure exact date match
      allPatients = allPatients.filter((p) => p.sample_date === selectedDateStr);

      // staff-scoped filtering
      const staffId = profile?.id || profile?.user_id || null;
      const staffUsernames = [
        profile?.username,
        `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim(),
      ].filter(Boolean);

      const myPatients = allPatients.filter((p) => {
        // possible shapes: p.created_by = id | p.created_by = { id, username } | p.created_by_name
        if (!profile) return false;
        if (p.created_by === staffId) return true;
        if (p.created_by?.id === staffId) return true;
        if (p.created_by_name && staffUsernames.includes(p.created_by_name)) return true;
        // sometimes created_by is username string
        if (typeof p.created_by === "string" && staffUsernames.includes(p.created_by)) return true;
        return false;
      });

      setPatients(myPatients);

      // expenses
      let allExpenses = [];
      if (eRes.status === "fulfilled" && Array.isArray(eRes.value.data)) {
        allExpenses = eRes.value.data;
      } else {
        // fallback
        try {
          const r = await api.get("/expenses/");
          allExpenses = Array.isArray(r.data) ? r.data : [];
        } catch (err) {
          console.error("Failed fallback fetch expenses:", err);
          allExpenses = [];
        }
      }

      // filter by date
      allExpenses = allExpenses.filter((ex) => ex.date === selectedDateStr);

      const myExpenses = allExpenses.filter((ex) => {
        if (!profile) return false;
        if (ex.created_by === staffId) return true;
        if (ex.created_by?.id === staffId) return true;
        if (ex.created_by_name && staffUsernames.includes(ex.created_by_name)) return true;
        if (typeof ex.created_by === "string" && staffUsernames.includes(ex.created_by)) return true;
        return false;
      });

      setExpenses(myExpenses);
    } catch (err) {
      console.error("fetchAll error:", err);
      setPatients([]);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Stats
  const stats = useMemo(() => {
    const patientsCount = Array.isArray(patients) ? patients.length : 0;
    const amountReceived = (patients || []).reduce((s, p) => s + Number(p.paid_amount || 0), 0);
    const amountPending = (patients || []).reduce((s, p) => s + Number(p.pending_amount || 0), 0);
    const expenseTotal = (expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
    const net = amountReceived - expenseTotal;
    return {
      patients: patientsCount,
      received: amountReceived,
      pending: amountPending,
      expenseTotal,
      net,
    };
  }, [patients, expenses]);

  // Add expense handler (if AddExpenseForm calls API directly, adapt accordingly)
  const handleAddExpense = async (payload) => {
    // payload { amount, note, date }
    setSubmittingExpense(true);
    try {
      await api.post("/expenses/", payload);
      await fetchAll();
      setShowExpenseModal(false);
    } catch (err) {
      console.error("Add expense failed:", err);
      throw err;
    } finally {
      setSubmittingExpense(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await api.delete(`/expenses/${id}/`);
      await fetchAll();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete expense");
    }
  };

  const prevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };
  const nextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 dark:text-gray-300">
        Loading dashboard...
      </div>
    );
  }

  // display date in friendly format
  const displayDateLabel = (d) => {
    try {
      return new Date(d).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <aside className="hidden md:block w-64">
        <StaffSidebar open={true} />
      </aside>

      <div className="md:hidden">
        <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col">
        <StaffNavbar onOpenSidebar={() => setSidebarOpen(true)} patientCount={stats.patients} />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
            <div>
              <div className="text-sm text-gray-500">Reports for</div>
              <div className="font-semibold">{displayDateLabel(selectedDate)}</div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={prevDay} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                ‹
              </button>

              <input
                type="date"
                value={selectedDateStr}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 text-sm rounded-lg border bg-gray-100 dark:bg-gray-700"
              />

              <button onClick={nextDay} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                ›
              </button>

              <button
                onClick={() => setShowExpenseModal(true)}
                className="ml-3 inline-flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
              >
                + Add Expense
              </button>
            </div>
          </div>

          {/* stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="text-sm text-gray-500">OPD Patients</div>
              <div className="text-2xl font-semibold mt-2">{stats.patients}</div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="text-sm text-gray-500">Amount Received</div>
              <div className="text-2xl font-semibold mt-2">₹{stats.received}</div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="text-sm text-gray-500">Amount Pending</div>
              <div className="text-2xl font-semibold mt-2">₹{stats.pending}</div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="text-sm text-gray-500">Expenses</div>
              <div className="text-2xl font-semibold mt-2">₹{stats.expenseTotal}</div>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
              <div className="text-sm text-gray-500">Net Total</div>
              <div className="text-2xl font-semibold mt-2">₹{stats.net}</div>
            </div>
          </div>

          {/* expenses list */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border dark:border-gray-700">
            <h3 className="font-semibold mb-3">Expenses ({selectedDateStr})</h3>

            {expenses.length === 0 ? (
              <div className="text-sm text-gray-500">No expenses found.</div>
            ) : (
              <div className="space-y-3">
                {expenses.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg"
                  >
                    <div>
                      <div className="font-semibold">₹{ex.amount}</div>
                      <div className="text-xs text-gray-500">
                        {ex.note || "No note"} <span className="mx-1">•</span>{" "}
                        <span className="font-medium">{ex.created_by_name || "You"}</span>{" "}
                        <span className="text-gray-400">on</span> <span>{ex.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteExpense(ex.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ADD EXPENSE MODAL */}
      {showExpenseModal && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3"
          onClick={() => setShowExpenseModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl p-5 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Add Expense ({selectedDateStr})</h3>

            <AddExpenseForm
              defaultDate={selectedDateStr}
              onSaved={async () => {
                await fetchAll();
                setShowExpenseModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
