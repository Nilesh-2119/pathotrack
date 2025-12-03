// src/pages/Staff/Patients.jsx
import React, { useEffect, useState } from "react";
import StaffSidebar from "../../components/Sidebar/StaffSidebar";
import StaffNavbar from "../../components/Navbar/StaffNavbar";
import api from "../../api/apiClient";

// Helper: Date -> YYYY-MM-DD
const formatDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export default function StaffPatients() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [payment, setPayment] = useState("");
  const [updating, setUpdating] = useState(false);

  // selected date for patient list (default to today)
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  useEffect(() => {
    // fetch patients for the selectedDate on mount and when selectedDate changes
    fetchPatients(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, patients]);

  const fetchPatients = async (date = null) => {
    setLoading(true);
    try {
      const res = await api.get("/patients/");
      const all = Array.isArray(res.data) ? res.data : [];
      const byDate = date ? all.filter((p) => p.sample_date === date) : all;
      setPatients(byDate);
      setFilteredPatients(byDate);
      setError("");
    } catch (err) {
      console.error("❌ Failed to load patients:", err);
      setError("Unable to load patient list.");
      setPatients([]);
      setFilteredPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // FILTER: search applies on already date-filtered patients
  const applyFilter = () => {
    if (!search.trim()) {
      setFilteredPatients(patients);
      return;
    }

    const s = search.toLowerCase();

    const results = patients.filter((p) =>
      (p.full_name || "").toLowerCase().includes(s) ||
      (p.phone || "").toLowerCase().includes(s) ||
      (p.referred_by || "").toLowerCase().includes(s)
    );

    setFilteredPatients(results);
  };

  // PAYMENT UPDATE
  const handlePaymentUpdate = async () => {
    if (!payment || Number(payment) <= 0) return;

    try {
      setUpdating(true);

      let newPaid = Number(selectedPatient.paid_amount) + Number(payment);
      let newPending = Number(selectedPatient.total_price) - newPaid;
      if (newPending < 0) newPending = 0;

      await api.patch(`/patients/${selectedPatient.id}/`, {
        paid_amount: newPaid,
        pending_amount: newPending,
      });

      // Refresh patients for the selected date
      await fetchPatients(selectedDate);
      setPayment("");

      // Update modal UI if it's still open
      setSelectedPatient((prev) =>
        prev
          ? {
              ...prev,
              paid_amount: newPaid,
              pending_amount: newPending,
            }
          : prev
      );
    } catch (err) {
      console.error("❌ Failed to update payment:", err);
    } finally {
      setUpdating(false);
    }
  };

  // REPORT UPDATE
  const handleReportUpdate = async () => {
    try {
      setUpdating(true);

      await api.patch(`/patients/${selectedPatient.id}/`, {
        status: "Report Given",
      });

      // Refresh patients for the selected date
      await fetchPatients(selectedDate);
      setSelectedPatient(null);
    } catch (err) {
      console.error("❌ Failed to update report:", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SIDEBAR */}
      <aside className="hidden md:block w-64">
        <StaffSidebar open={true} />
      </aside>

      {/* MOBILE SIDEBAR */}
      <div className="md:hidden">
        <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* MAIN SECTION */}
      <div className="flex-1 flex flex-col dark:text-gray-100">
        <StaffNavbar
          onOpenSidebar={() => setSidebarOpen(true)}
          patientCount={patients.length}
        />

        <main className="p-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h1 className="text-lg font-semibold">My Patients</h1>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              {/* DATE PICKER (responsive) */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="sr-only">Select date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                />
              </div>

              {/* SEARCH BOX */}
              <input
                type="text"
                placeholder="Search by name, phone, doctor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-60 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
            {/* LOADING / ERROR / EMPTY */}
            {loading ? (
              <p className="text-center py-6 text-gray-500">Loading…</p>
            ) : error ? (
              <p className="text-center text-red-500 py-6">{error}</p>
            ) : filteredPatients.length === 0 ? (
              <p className="text-center text-gray-500 py-6">No patients found.</p>
            ) : (
              <>
                {/* HEADER - visible on md+; on small screens each row shows labels */}
                <div className="hidden md:grid grid-cols-4 text-sm font-medium text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2 px-1">
                  <div>Name</div>
                  <div>Amount</div>
                  <div>Pending</div>
                  <div>Status</div>
                </div>

                {/* LIST - responsive: single column on small screens, grid on md+ */}
                <div className="space-y-2">
                  {filteredPatients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPatient(p)}
                      className="block md:grid md:grid-cols-4 items-center py-3 px-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition"
                    >
                      {/* NAME */}
                      <div className="flex flex-col">
                        <div className="font-medium dark:text-gray-200">{p.full_name}</div>
                        {/* show small meta on mobile */}
                        <div className="text-xs text-gray-500 mt-1 md:hidden">
                          {p.phone ? `${p.phone} • ` : ""}{p.referred_by || ""}
                        </div>
                      </div>

                      {/* AMOUNT (md col) */}
                      <div className="mt-2 md:mt-0 md:px-2">
                        <div className="dark:text-gray-200">₹{p.paid_amount}</div>
                      </div>

                      {/* PENDING */}
                      <div className="mt-2 md:mt-0">
                        <div className="text-red-500 font-semibold">
                          {p.pending_amount > 0 ? ("₹" + p.pending_amount) : "—"}
                        </div>
                      </div>

                      {/* STATUS */}
                      <div className="mt-2 md:mt-0">
                        <div
                          className={`font-semibold ${p.status === "Pending" ? "text-yellow-500" : "text-green-500"}`}
                        >
                          {p.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* PATIENT MODAL */}
      {selectedPatient && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-lg md:max-w-md"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: "95vh", overflowY: "auto" }}
          >
            <h2 className="text-xl font-semibold mb-3 dark:text-white">
              {selectedPatient.full_name}
            </h2>

            <div className="grid grid-cols-1 gap-2">
              <p className="dark:text-gray-300"><b>Age:</b> {selectedPatient.age}</p>
              <p className="dark:text-gray-300"><b>Phone:</b> {selectedPatient.phone}</p>

              <p className="dark:text-gray-300">
                <b>Referred By:</b> {selectedPatient.referred_by || "—"}
              </p>

              <p className="dark:text-gray-300"><b>Sample Date:</b> {selectedPatient.sample_date}</p>

              <p className="mt-2 font-semibold dark:text-white">Tests:</p>
              <div className="max-h-40 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                <ul className="ml-3 list-disc space-y-1">
                  {selectedPatient.tests?.length ? (
                    selectedPatient.tests.map((t, i) => (
                      <li key={i} className="flex justify-between dark:text-gray-200">
                        <span>{t.name}</span>
                        <span className="font-medium">₹{t.price}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 dark:text-gray-400">No tests found</li>
                  )}
                </ul>
              </div>

              <p className="mt-3 dark:text-gray-300"><b>Total:</b> ₹{selectedPatient.total_price}</p>
              <p className="dark:text-gray-300"><b>Paid:</b> ₹{selectedPatient.paid_amount}</p>
              <p className="dark:text-gray-300"><b>Pending:</b> ₹{selectedPatient.pending_amount}</p>

              <p className="mt-3 dark:text-gray-300">
                <b>Report Status:</b>{" "}
                <span
                  className={selectedPatient.status === "Report Given"
                    ? "text-green-600"
                    : "text-yellow-600"}
                >
                  {selectedPatient.status}
                </span>
              </p>
            </div>

            {/* PAYMENT SECTION */}
            {selectedPatient.pending_amount > 0 && (
              <div className="mt-5 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <label className="block text-sm font-medium dark:text-gray-300">
                  Enter Amount Received
                </label>

                <input
                  type="number"
                  min="0"
                  value={payment}
                  placeholder="₹ Enter amount"
                  onChange={(e) => setPayment(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                />

                <button
                  onClick={handlePaymentUpdate}
                  disabled={updating}
                  className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                >
                  {updating ? "Updating…" : "Update Payment"}
                </button>
              </div>
            )}

            {/* REPORT STATUS BUTTON */}
            {selectedPatient.status !== "Report Given" && (
              <button
                onClick={handleReportUpdate}
                disabled={updating}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                {updating ? "Updating…" : "Mark Report Given"}
              </button>
            )}

            <button
              className="mt-4 w-full bg-gray-300 dark:bg-gray-700 py-2 rounded-lg dark:text-white"
              onClick={() => setSelectedPatient(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
