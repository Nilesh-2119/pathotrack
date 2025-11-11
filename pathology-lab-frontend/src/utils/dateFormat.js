// src/utils/dateFormat.js

// Adds ordinal suffix to date number (st, nd, rd, th)
function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

// Formats a JS Date object → "10th November 2025"
export function formatFullDate(date) {
    if (!(date instanceof Date) || isNaN(date)) return "";
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${day}${suffix} ${month} ${year}`;
}

// Optional helper: format date string "YYYY-MM-DD" → readable format
export function formatDateString(dateStr) {
    const date = new Date(dateStr);
    return formatFullDate(date);
}
