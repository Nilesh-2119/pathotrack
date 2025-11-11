// src/components/Charts/DailyReportsChart.jsx
import React from 'react';
import { ResponsiveContainer, LineChart, XAxis, Tooltip, Line, CartesianGrid } from 'recharts';

export default function DailyReportsChart({ data }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 h-64">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Daily Reports</h3>
            <ResponsiveContainer width="100%" height="85%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke={undefined} />
                    <XAxis dataKey="day" />
                    <Tooltip />
                    <Line type="monotone" dataKey="reports" stroke="#3B82F6" strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
