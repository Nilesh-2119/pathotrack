// src/components/Tables/PatientsTable.jsx
import React from "react";
import { motion } from "framer-motion";

/**
 * Props:
 * - rows: array of patient objects
 *
 * This component is responsive:
 * - Desktop / md+: table layout
 * - Mobile: compact cards list
 *
 * It is defensive about field names (accepts full_name / name, paid_amount / amountPaid, etc.)
 * and avoids crashes when values are missing.
 */
export default function PatientsTable({ rows = [] }) {
  const safeNumber = (v) => {
    const n = Number(v || 0);
    // show as plain number or with toLocaleString if available
    try {
      return n.toLocaleString();
    } catch {
      return String(n);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-5 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">
          Recent Patients
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
          ({rows.length} records)
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-auto rounded-lg">
        <table className="w-full min-w-[700px] text-sm">
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
            {rows.map((r) => {
              const name = r.full_name || r.name || "—";
              const phone = r.phone || "—";
              const paid = safeNumber(r.paid_amount ?? r.amountPaid ?? 0);
              const pending = safeNumber(r.pending_amount ?? r.amountPending ?? 0);
              const staff = r.created_by_name || r.staff || r.created_by || "—";
              const status = r.status || "Pending";

              return (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150"
                >
                  <td className="py-3 px-4 font-medium whitespace-nowrap">{name}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                    {phone}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">
                    ₹{paid}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-amber-600 dark:text-amber-400">
                    {Number(pending) > 0 ? `₹${pending}` : "—"}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{staff}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${status === "Report Given" || status === "Completed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                        }`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {rows.map((r) => {
          const name = r.full_name || r.name || "—";
          const phone = r.phone || "—";
          const paid = safeNumber(r.paid_amount ?? r.amountPaid ?? 0);
          const pending = safeNumber(r.pending_amount ?? r.amountPending ?? 0);
          const staff = r.created_by_name || r.staff || r.created_by || "—";
          const status = r.status || "Pending";

          return (
            <div
              key={r.id}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-sm">{name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Collected by <span className="font-semibold">{staff}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-green-600 dark:text-green-400 font-semibold">₹{paid}</div>
                  <div className="text-sm text-red-500">{Number(pending) > 0 ? `₹${pending}` : "—"}</div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <div className={`font-medium ${status === "Report Given" ? "text-green-600" : "text-yellow-600"}`}>
                  {status}
                </div>
                <div className="text-xs text-gray-500">{r.sample_date || r.date || ""}</div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
