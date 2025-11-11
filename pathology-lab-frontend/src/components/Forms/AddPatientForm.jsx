// src/components/Forms/AddPatientForm.jsx
import React, { useState } from "react";

export default function AddPatientForm({ availableTests = [] }) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        age: "",
        referredBy: "",
        selectedTests: [],
        totalAmount: 0,
        amountPaid: "",
        paymentMode: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special case: if payment mode is FOC, make amountPaid = 0
        if (name === "paymentMode" && value === "FOC") {
            setFormData((prev) => ({
                ...prev,
                paymentMode: value,
                amountPaid: 0,
            }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTestToggle = (test) => {
        setFormData((prev) => {
            const selected = prev.selectedTests.includes(test.name)
                ? prev.selectedTests.filter((t) => t !== test.name)
                : [...prev.selectedTests, test.name];

            const totalAmount = availableTests
                .filter((t) => selected.includes(t.name))
                .reduce((sum, t) => sum + t.price, 0);

            return { ...prev, selectedTests: selected, totalAmount };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const pending =
            formData.paymentMode === "FOC"
                ? 0
                : formData.totalAmount - (parseFloat(formData.amountPaid) || 0);

        const newPatient = {
            ...formData,
            amountPending: pending,
            date: new Date().toISOString().split("T")[0],
            status: pending > 0 ? "Pending" : "Paid",
            reportGiven: false,
        };

        alert(`✅ Patient "${formData.name}" added successfully!`);
        console.log("New Patient:", newPatient);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
        >
            {/* Patient Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Patient full name"
                    />
                </div>

                <div>
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                            if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10)
                                handleChange(e);
                        }}
                        required
                        className="form-input"
                        placeholder="10-digit phone number"
                    />
                </div>

                <div>
                    <label className="form-label">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Age"
                    />
                </div>

                {/* 🩺 Referred By Doctor */}
                <div>
                    <label className="form-label">Referred By Doctor</label>
                    <input
                        type="text"
                        name="referredBy"
                        value={formData.referredBy}
                        onChange={handleChange}
                        placeholder="Dr. Name or Clinic Name"
                        className="form-input"
                    />
                </div>
            </div>

            {/* Test Selection */}
            <div>
                <label className="form-label">Select Tests</label>
                {availableTests.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        No tests available. Please add tests first.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                        {availableTests.map((test, index) => (
                            <label
                                key={index}
                                className={`flex items-center justify-between border rounded-lg p-3 cursor-pointer transition ${formData.selectedTests.includes(test.name)
                                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                                        : "bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 hover:border-blue-400"
                                    }`}
                            >
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{test.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        ₹{test.price} • {test.tube}
                                    </span>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.selectedTests.includes(test.name)}
                                    onChange={() => handleTestToggle(test)}
                                    className="accent-blue-600 w-4 h-4"
                                />
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="form-label">Total Test Amount</label>
                    <input
                        type="text"
                        value={`₹${formData.totalAmount}`}
                        readOnly
                        className="form-input bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label className="form-label">Amount Paid</label>
                    <input
                        type="number"
                        name="amountPaid"
                        value={formData.amountPaid}
                        onChange={handleChange}
                        placeholder="Enter paid amount"
                        className="form-input"
                        disabled={formData.paymentMode === "FOC"}
                    />
                </div>

                <div>
                    <label className="form-label">Payment Mode</label>
                    <select
                        name="paymentMode"
                        value={formData.paymentMode}
                        onChange={handleChange}
                        className="form-input"
                    >
                        <option value="">Select mode</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                        <option value="FOC">FOC (Free of Cost)</option>
                    </select>
                </div>

                {/* Payment Status Display */}
                <div>
                    <label className="form-label">Payment Status</label>
                    <input
                        type="text"
                        readOnly
                        value={
                            formData.paymentMode === "FOC"
                                ? "Free of Cost"
                                : formData.totalAmount -
                                    (parseFloat(formData.amountPaid) || 0) >
                                    0
                                    ? "Pending"
                                    : "Fully Paid"
                        }
                        className={`form-input font-medium ${formData.paymentMode === "FOC"
                                ? "text-green-600"
                                : formData.totalAmount -
                                    (parseFloat(formData.amountPaid) || 0) >
                                    0
                                    ? "text-yellow-600"
                                    : "text-green-600"
                            }`}
                    />
                </div>
            </div>

            {/* Submit */}
            <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition transform hover:scale-[1.02] active:scale-100 font-medium"
            >
                Save Patient
            </button>
        </form>
    );
}
