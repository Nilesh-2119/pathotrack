// src/components/Charts/DailyReportsChart.jsx
import React from "react";
import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    Tooltip,
    Line,
    CartesianGrid,
} from "recharts";

/**
 * Props:
 * - data: [{ day: '1', reports: 5 }, ...]
 *
 * The outer wrapper controls visual height for mobile vs desktop using Tailwind classes.
 */
export default function DailyReportsChart({ data = [] }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 h-56 md:h-64">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Daily Reports
            </h3>

            <div className="w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="day"
                            tick={{ fill: "currentColor" }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            wrapperStyle={{ borderRadius: 8, boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}
                        />
                        <Line
                            type="monotone"
                            dataKey="reports"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ r: 3 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
