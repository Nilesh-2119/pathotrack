/* ========================================================================
   AddTestForm.jsx – Clean version (Name, Price, Tubes Only)
   Works with backend (tube_names field)
========================================================================= */

import React, { useState, useEffect } from "react";

export default function AddTestForm({ onClose, onAddTest, existingTest }) {
    const [testData, setTestData] = useState({
        name: "",
        price: "",
        tube_names: [],   // backend expects list of strings
    });

    const [tubeInput, setTubeInput] = useState("");

    // Pre-fill values when editing
    useEffect(() => {
        if (existingTest) {
            setTestData({
                name: existingTest.name || "",
                price: existingTest.price || "",
                tube_names: existingTest.tubes?.map((t) => t.name) || [],
            });
        }
    }, [existingTest]);

    // Add tube to list
    const handleAddTube = () => {
        const clean = tubeInput.trim();
        if (!clean) return;

        if (!testData.tube_names.includes(clean)) {
            setTestData((prev) => ({
                ...prev,
                tube_names: [...prev.tube_names, clean],
            }));
        }

        setTubeInput("");
    };

    const handleRemoveTube = (name) => {
        setTestData((prev) => ({
            ...prev,
            tube_names: prev.tube_names.filter((t) => t !== name),
        }));
    };

    // Submit handler
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!testData.name || !testData.price) {
            alert("Please enter test name and price.");
            return;
        }

        onAddTest(testData); // send full payload including tube_names
        onClose();
        alert(existingTest ? "Test updated successfully!" : "Test added successfully!");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {existingTest ? "Edit Test" : "Add New Test"}
            </h3>

            {/* Test Name */}
            <div>
                <label className="text-sm font-medium mb-1 block">
                    Test Name
                </label>
                <input
                    name="name"
                    type="text"
                    value={testData.name}
                    onChange={(e) =>
                        setTestData({ ...testData, name: e.target.value })
                    }
                    required
                    placeholder="e.g., CBC, LFT, RFT..."
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                />
            </div>

            {/* Price */}
            <div>
                <label className="text-sm font-medium mb-1 block">
                    Price (₹)
                </label>
                <input
                    name="price"
                    type="number"
                    value={testData.price}
                    onChange={(e) =>
                        setTestData({ ...testData, price: e.target.value })
                    }
                    required
                    placeholder="Enter test price"
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                />
            </div>

            {/* TUBES – Multiple Add */}
            <div>
                <label className="text-sm font-medium mb-1 block">
                    Tubes (Add multiple)
                </label>

                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter tube name (e.g., EDTA Purple)"
                        value={tubeInput}
                        onChange={(e) => setTubeInput(e.target.value)}
                        className="flex-1 px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 dark:border-gray-600"
                    />
                    <button
                        type="button"
                        onClick={handleAddTube}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        +
                    </button>
                </div>

                {/* Tube Chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                    {testData.tube_names.map((tube, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full flex items-center gap-2"
                        >
                            {tube}
                            <button
                                type="button"
                                onClick={() => handleRemoveTube(tube)}
                                className="text-red-500 hover:text-red-700"
                            >
                                ✕
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-sm"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
                >
                    {existingTest ? "Update Test" : "Save Test"}
                </button>
            </div>
        </form>
    );
}
