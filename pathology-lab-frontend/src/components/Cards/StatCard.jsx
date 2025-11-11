// src/components/Cards/StatCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, note, children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{title}</div>
                    <div className="mt-1 text-2xl font-semibold">{value}</div>
                    {note && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{note}</div>}
                </div>
                <div className="text-3xl text-gray-200 dark:text-gray-600">{children}</div>
            </div>
        </motion.div>
    );
}
