// src/components/Forms/AddStaffForm.jsx
import React from "react";

export default function AddStaffForm({ onClose, onSubmit }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const newStaff = {
            name: data.get("name"),
            phone: data.get("phone"),
            employeeId: data.get("employeeId"),
            username: data.get("username"),
            password: data.get("password"),
        };
        if (onSubmit) onSubmit(newStaff);
        alert("New Blood Collection Boy added successfully (mock)!");
        onClose();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 bg-white dark:bg-gray-800 p-1 rounded-xl"
        >
            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Add New Staff
            </h3>

            {/* Input Fields */}
            <div className="space-y-3">
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>

                <div>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        name="employeeId"
                        placeholder="Employee ID"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>

                <div>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>

                <div>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>
            </div>

            {/* Footer Buttons */}
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
                    Save
                </button>
            </div>
        </form>
    );
}
