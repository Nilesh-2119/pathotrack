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

export default function MonthlyReportChart({ data, monthName }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm border border-gray-100 dark:border-gray-700 mt-6">
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Monthly Report — {monthName}
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="patients" fill="#3B82F6" name="Patients" />
                    <Bar dataKey="revenue" fill="#10B981" name="Revenue (₹)" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
