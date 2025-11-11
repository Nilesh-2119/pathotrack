// src/utils/mockDashboardData.js
export const mockDashboardData = [
    {
        date: "2025-11-10",
        totalPatients: 12,
        reportsPending: 4,
        amountReceived: 6200,
        amountPending: 1800,
        chartData: [
            { name: "8 AM", patients: 2 },
            { name: "10 AM", patients: 4 },
            { name: "12 PM", patients: 3 },
            { name: "2 PM", patients: 2 },
            { name: "4 PM", patients: 1 },
        ],
        recentPatients: [
            {
                name: "Amit Verma",
                phone: "9876543210",
                amount: 600,
                collectedBy: "Rahul Singh",
                status: "Completed",
            },
            {
                name: "Pooja Sharma",
                phone: "9988776655",
                amount: 400,
                collectedBy: "Vikas Shah",
                status: "Pending",
            },
        ],
    },
    {
        date: "2025-11-11",
        totalPatients: 9,
        reportsPending: 3,
        amountReceived: 4900,
        amountPending: 1000,
        chartData: [
            { name: "8 AM", patients: 1 },
            { name: "10 AM", patients: 3 },
            { name: "12 PM", patients: 2 },
            { name: "2 PM", patients: 1 },
            { name: "4 PM", patients: 2 },
        ],
        recentPatients: [
            {
                name: "Suresh Gupta",
                phone: "9123456780",
                amount: 700,
                collectedBy: "Amit Patil",
                status: "Completed",
            },
            {
                name: "Neha Desai",
                phone: "9898989898",
                amount: 500,
                collectedBy: "Rahul Singh",
                status: "Pending",
            },
        ],
    },
];
