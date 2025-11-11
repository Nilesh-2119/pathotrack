// src/components/Forms/AddTestForm.jsx
import React, { useState, useEffect } from "react";

export default function AddTestForm({ onClose, onAddTest, existingTest }) {
    const [testData, setTestData] = useState({
        name: "",
        price: "",
        tube: "",
    });

    // ✅ If existingTest provided (edit mode), pre-fill fields
    useEffect(() => {
        if (existingTest) {
            setTestData({
                name: existingTest.name || "",
                price: existingTest.price || "",
                tube: existingTest.tube || "",
            });
        }
    }, [existingTest]);

    const tubeOptions = [
        { label: "EDTA Tube (Purple)", value: "EDTA Tube (Purple)" },
        { label: "Plain Tube (Red)", value: "Plain Tube (Red)" },
        { label: "Fluoride Tube (Grey)", value: "Fluoride Tube (Grey)" },
        { label: "Sodium Citrate Tube (Blue)", value: "Sodium Citrate Tube (Blue)" },
        { label: "Heparin Tube (Green)", value: "Heparin Tube (Green)" },
        { label: "Urine Container (Yellow)", value: "Urine Container (Yellow)" },
    ];

    const handleChange = (e) => {
        setTestData({ ...testData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (testData.name && testData.price && testData.tube) {
            onAddTest(testData);
            onClose();
            alert(existingTest ? "Test updated successfully!" : "New test added!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {existingTest ? "Edit Test" : "Add New Test"}
            </h3>

            {/* Test Name */}
            <div>
                <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
                    Test Name
                </label>
                <input
                    name="name"
                    type="text"
                    placeholder="e.g., Blood Sugar (Fasting)"
                    value={testData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>

            {/* Price */}
            <div>
                <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
                    Price (₹)
                </label>
                <input
                    name="price"
                    type="number"
                    placeholder="Enter price in ₹"
                    value={testData.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
            </div>

            {/* Tube Type */}
            <div>
                <label className="text-sm font-medium block mb-1 text-gray-700 dark:text-gray-300">
                    Tube Type
                </label>
                <select
                    name="tube"
                    value={testData.tube}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                >
                    <option value="">Select Tube Type</option>
                    {tubeOptions.map((tube) => (
                        <option key={tube.value} value={tube.value}>
                            {tube.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium transition"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                >
                    {existingTest ? "Update Test" : "Save Test"}
                </button>
            </div>
        </form>
    );
}
