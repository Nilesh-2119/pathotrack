// src/components/Cards/StatCard.jsx
import React from 'react';
export default function StatCard({ title, value, children, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
      ${onClick ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : ""}`}
        >
            <div className="flex items-center justify-between">
                <div className="text-gray-500 dark:text-gray-400 text-sm">{title}</div>
                <div className="text-gray-700 dark:text-gray-300">{children}</div>
            </div>

            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
            </div>
        </div>
    );
}

