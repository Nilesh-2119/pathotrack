// src/api/staffService.js
import api from "./apiClient";

// ✅ Get all blood collection staff (for current lab admin)
export const fetchStaff = async () => {
    try {
        // Correct backend path
        const res = await api.get("/staff/"); // backend route: /api/staff/
        return res.data;
    } catch (error) {
        console.error("❌ Failed to fetch staff:", error);
        throw error;
    }
};

// ✅ Add new staff (blood collection boy)
export const addStaff = async (payload) => {
    try {
        // Correct backend path
        const res = await api.post("/staff/add/", payload); // backend route: /api/staff/add/
        return res.data;
    } catch (error) {
        console.error("❌ Failed to add staff:", error);
        throw error;
    }
};

// ✅ Reset staff password
export const resetStaffPassword = async (staffId, newPassword) => {
  try {
    const res = await api.post("/staff/reset-password/", {
      staff_id: staffId,
      new_password: newPassword,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Failed to reset password:", error);
    throw error;
  }
};
