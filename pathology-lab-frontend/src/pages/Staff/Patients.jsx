import React from "react";
import StaffSidebar from "../../components/Sidebar/StaffSidebar";
import StaffNavbar from "../../components/Navbar/StaffNavbar";
import { recentPatients } from "../../utils/mockData";

export default function StaffPatients() {
    const staff = JSON.parse(localStorage.getItem("staff")) || { id: 1 };
    const myPatients = recentPatients.filter(
        (p) => p.collectedById === staff.id
    );

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <aside className="hidden md:block w-64">
                <StaffSidebar open={true} />
            </aside>

            <div className="flex-1 flex flex-col">
                <StaffNavbar onOpenSidebar={() => { }} patientCount={myPatients.length} />

                <main className="flex-1 p-6">
                    <h1 className="text-lg font-semibold mb-4">My Patients</h1>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-600 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="pb-3">Name</th>
                                    <th className="pb-3">Phone</th>
                                    <th className="pb-3">Tests</th>
                                    <th className="pb-3">Amount</th>
                                    <th className="pb-3">Pending</th>
                                    <th className="pb-3">Status</th>
                                    <th className="pb-3">Report</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myPatients.map((p, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    >
                                        <td className="py-2">{p.name}</td>
                                        <td>{p.phone}</td>
                                        <td>{p.tests?.join(", ")}</td>
                                        <td>₹{p.amountPaid}</td>
                                        <td>{p.amountPending > 0 ? `₹${p.amountPending}` : "—"}</td>
                                        <td
                                            className={`font-medium ${p.status === "Pending"
                                                    ? "text-yellow-500"
                                                    : "text-green-600"
                                                }`}
                                        >
                                            {p.status}
                                        </td>
                                        <td>{p.reportGiven ? "✅ Given" : "❌ Not Yet"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {myPatients.length === 0 && (
                            <p className="text-center text-gray-500 py-6">
                                No patients found for you yet.
                            </p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
