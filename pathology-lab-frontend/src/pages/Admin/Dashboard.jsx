// src/pages/Admin/Dashboard.jsx
import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import StatCard from "../../components/Cards/StatCard";
import DailyReportsChart from "../../components/Charts/DailyReportsChart";
import PatientsTable from "../../components/Tables/PatientsTable";
import { formatFullDate } from "../../utils/dateFormat";
import MonthlyReportChart from "../../components/Charts/MonthlyReportChart";
import {
  Users,
  AlertTriangle,
  IndianRupee,
  DollarSign,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { getDashboardSummary } from "../../api/dashboardService";
import { getPatients } from "../../api/patientService";

function MonthlyReport({ monthDataSource }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const filtered = monthDataSource.filter(
    (p) => new Date(p.date).getMonth() === selectedMonth
  );

  const dailySummary = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const patients = filtered.filter((p) => new Date(p.date).getDate() === day);
    const revenue = patients.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    return { day, patients: patients.length, revenue };
  }).filter((d) => d.patients > 0 || d.revenue > 0);

  const totalPatients = filtered.length || 0;
  const totalRevenue = filtered.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
  const pending = filtered.reduce((sum, p) => sum + (p.amountPending || 0), 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">Monthly Summary</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-2 rounded-lg text-sm focus:outline-none"
        >
          {months.map((m, i) => (
            <option key={m} value={i}>{m}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Total Patients" value={totalPatients} color="blue" />
        <SummaryCard label="Total Revenue" value={`₹${totalRevenue}`} color="green" />
        <SummaryCard label="Pending Amount" value={`₹${pending}`} color="yellow" />
      </div>

      <MonthlyReportChart data={dailySummary} monthName={months[selectedMonth]} />
    </div>
  );
}

const SummaryCard = ({ label, value, color }) => (
  <div className={`bg-${color}-50 dark:bg-${color}-900/30 p-4 rounded-lg`}>
    <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    <div className={`text-2xl font-semibold text-${color}-600 dark:text-${color}-400`}>
      {value}
    </div>
  </div>
);

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [statsData, setStatsData] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [patients, summary] = await Promise.all([
          getPatients(),
          getDashboardSummary(),
        ]);
        setPatientData(patients);
        setStatsData(summary);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBackendData();
  }, []);

  const today = new Date();
  const todayStr = formatDate(today);
  const selectedDateStr = formatDate(selectedDate);

  const filteredPatients = useMemo(() => {
    return patientData.filter((p) => p.date === selectedDateStr);
  }, [patientData, selectedDateStr]);

  const isToday = selectedDateStr === todayStr;

  const stats = {
    patients: statsData?.patients || 0,
    pendingReports: statsData?.pending_reports || 0,
    received: statsData?.revenue_collected || 0,
    pending: statsData?.amount_pending || 0,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Fetching latest dashboard data...
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

        <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Reports for {formatFullDate(selectedDate)}
            </h1>
          </div>

          {/* Stats */}
          <motion.div
            key={selectedDateStr}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <StatCard title="Total Patients" value={stats.patients}><Users /></StatCard>
            <StatCard title="Reports Pending" value={stats.pendingReports}><AlertTriangle /></StatCard>
            <StatCard title="Amount Received" value={`₹${stats.received}`}><IndianRupee /></StatCard>
            <StatCard title="Amount Pending" value={`₹${stats.pending}`}><DollarSign /></StatCard>
          </motion.div>

          <DailyReportsChart data={[]} />

          <PatientsTable rows={filteredPatients} />

          <MonthlyReport monthDataSource={patientData} />
        </main>
      </div>
    </div>
  );
}
