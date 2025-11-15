// src/components/Charts/MonthlyReportChart.jsx
import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend,
} from "recharts";

/**
 * Props:
 * - data: [{ day: 1, patients: 5, revenue: 500 }, ...]
 * - monthName: string
 *
 * Wrapper uses responsive heights so chart looks good on phone & desktop.
 */
export default function MonthlyReportChart({ data = [], monthName = "" }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6 h-72 md:h-80">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Monthly Report — {monthName}
            </h3>

            <div className="w-full h-[calc(100%-2.25rem)]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 6, right: 12, bottom: 6, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fill: "currentColor" }} />
                        <YAxis />
                        <Tooltip
                            wrapperStyle={{ borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
                        />
                        <Legend />
                        <Bar dataKey="patients" fill="#3B82F6" name="Patients" />
                        <Bar dataKey="revenue" fill="#10B981" name="Revenue (₹)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
