import React, { useContext } from "react";
import { Moon, Sun, Menu, UserCircle } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

export default function StaffNavbar({ onOpenSidebar, patientCount }) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    const staff =
        JSON.parse(localStorage.getItem("staff")) || {
            name: "John Doe",
            email: "staff@patho.com",
        };

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-3">
                <button
                    onClick={onOpenSidebar}
                    className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        {staff.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        {staff.email}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Today’s Patients:{" "}
                    <span className="font-semibold text-blue-600">{patientCount}</span>
                </div>

                <button
                    onClick={toggleTheme}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
        </header>
    );
}
