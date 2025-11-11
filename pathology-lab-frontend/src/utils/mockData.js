// src/utils/mockData.js
// Dates in YYYY-MM-DD
const today = new Date();
const pad = n => String(n).padStart(2, '0');
const YYYYMMDD = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const mockStats = {
    // derived in Dashboard using recentPatients
    totalStaff: 4,
};

export const dailyReports = [
    { day: 'Mon', reports: 10 },
    { day: 'Tue', reports: 14 },
    { day: 'Wed', reports: 8 },
    { day: 'Thu', reports: 18 },
    { day: 'Fri', reports: 12 },
    { day: 'Sat', reports: 16 },
    { day: 'Sun', reports: 9 },
];

export const recentPatients = [
    { id: 1, name: 'Amit Verma', phone: '9876543210', amountPaid: 1200, amountPending: 0, staff: 'Rahul Singh', status: 'Completed', date: YYYYMMDD(new Date()) },
    { id: 2, name: 'Sneha Patil', phone: '9876504321', amountPaid: 0, amountPending: 900, staff: 'Vikas Shah', status: 'Pending', date: YYYYMMDD(new Date(Date.now() - 86400000)) }, // yesterday
    { id: 3, name: 'Raj Sharma', phone: '9876112233', amountPaid: 1500, amountPending: 0, staff: 'Anjali Kapoor', status: 'Completed', date: YYYYMMDD(new Date(Date.now() - 2 * 86400000)) },
    { id: 4, name: 'Kavita Joshi', phone: '9876123456', amountPaid: 0, amountPending: 500, staff: 'Rahul Singh', status: 'Pending', date: YYYYMMDD(new Date()) },
    { id: 5, name: 'Sunil Rao', phone: '9876999888', amountPaid: 800, amountPending: 0, staff: 'Anjali Kapoor', status: 'Completed', date: YYYYMMDD(new Date()) },
];
