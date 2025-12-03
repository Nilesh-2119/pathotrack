// src/components/Forms/AddExpenseForm.jsx
import React, { useState } from "react";
import { createExpense } from "../../api/expenseService";

export default function AddExpenseForm({ onSaved }) {
  const [form, setForm] = useState({ amount: "", note: "", date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        amount: form.amount,
        note: form.note,
        date: form.date || undefined,
      };
      const saved = await createExpense(payload);
      setForm({ amount: "", note: "", date: "" });
      if (onSaved) onSaved(saved);
    } catch (err) {
      console.error("AddExpenseForm error:", err);
      // show backend error message if available
      const msg = err?.response?.data || err?.message || "Failed to save expense";
      setError(JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-medium mb-2">Add Expense</h3>
      {error ? <div className="text-red-600 mb-2">{error}</div> : null}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">Amount</label>
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 250.00"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Note</label>
          <input
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Optional note"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            {submitting ? "Saving..." : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
