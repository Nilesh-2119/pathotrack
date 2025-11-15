// src/pages/Staff/Dashboard.jsx
import React, { useState, useEffect } from "react";
import StaffSidebar from "../../components/Sidebar/StaffSidebar";
import StaffNavbar from "../../components/Navbar/StaffNavbar";
import AddPatientForm from "../../components/Forms/AddPatientForm";
import api from "../../api/apiClient";

export default function StaffDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [todayCount, setTodayCount] = useState(0); // 🔥 Dynamic patient count

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
            } catch (err) {
                console.error("❌ Failed to load staff profile:", err);
                setError("Unable to load staff information. Please re-login.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // ============================
    //  2️⃣ Fetch today's patients
    // ============================
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

    // ============================
    //  Loading / Error UI
    // ============================

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

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">

            {/* ===== Sidebar (desktop) ===== */}
            <aside className="hidden md:block w-64">
                <StaffSidebar open={true} />
            </aside>

            {/* ===== Sidebar (mobile) ===== */}
            <div className="md:hidden">
                <StaffSidebar
                    open={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            {/* ===== Main Content ===== */}
            <div className="flex-1 flex flex-col">

                <StaffNavbar
                    onOpenSidebar={() => setSidebarOpen(true)}
                    patientCount={todayCount.length}    // 🔥 REAL COUNT
                />

                <main className="flex-1 w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-5xl mx-auto">

                    <h1 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                        Welcome, {displayName} 👋
                    </h1>

                    <h2 className="text-base font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Add New Patient
                    </h2>

                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        {/* 🔥 Pass callback to update count */}
                        <AddPatientForm onPatientAdded={handlePatientAdded} />
                    </div>

                </main>
            </div>
        </div>
    );
}
