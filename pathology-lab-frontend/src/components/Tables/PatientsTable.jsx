// src/components/Tables/PatientsTable.jsx
import React from "react";
import { motion } from "framer-motion";

export default function PatientsTable({ rows }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto"
    >
      <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center justify-between">
        Recent Patients
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
          ({rows.length} records)
        </span>
      </h3>

      <div className="overflow-auto rounded-lg">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/30">
              <th className="text-left py-3 px-4 font-medium">Name</th>
              <th className="text-left py-3 px-4 font-medium">Phone</th>
              <th className="text-right py-3 px-4 font-medium">Paid</th>
              <th className="text-right py-3 px-4 font-medium">Pending</th>
              <th className="text-left py-3 px-4 font-medium">Collected By</th>
              <th className="text-center py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="text-sm text-gray-700 dark:text-gray-300 divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
              >
                <td className="py-3 px-4 font-medium whitespace-nowrap">
                  {r.name}
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                  {r.phone}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                  ₹{r.amountPaid.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right font-semibold text-amber-600 dark:text-amber-400">
                  ₹{r.amountPending.toLocaleString()}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">{r.staff}</td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${r.status === "Completed"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                      }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
