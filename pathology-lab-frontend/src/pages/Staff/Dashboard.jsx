// src/pages/Staff/Dashboard.jsx
import React, { useState } from "react";
import StaffSidebar from "../../components/Sidebar/StaffSidebar";
import StaffNavbar from "../../components/Navbar/StaffNavbar";
import AddPatientForm from "../../components/Forms/AddPatientForm";
import { recentPatients } from "../../utils/mockData";

export default function StaffDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // 🧠 Mock logged-in staff data
    const staff = JSON.parse(localStorage.getItem("staff")) || { id: 1, name: "John Doe" };

    // 🗓️ Calculate today's date & patient count
    const today = new Date().toISOString().split("T")[0];
    const todayPatients = recentPatients.filter(
        (p) => p.collectedById === staff.id && p.date === today
    );

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
                    patientCount={todayPatients.length}
                />

                <main className="flex-1 w-full px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-5xl mx-auto">
                    <h1 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">
                        Add New Patient
                    </h1>

                    <div className="bg-white dark:bg-gray-800 rounded-xl sm:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <AddPatientForm availableTests={[]} />
                    </div>
                </main>
            </div>
        </div>
    );
}
