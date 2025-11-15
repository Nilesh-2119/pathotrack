// src/components/Navbar/StaffNavbar.jsx
import React, { useContext } from "react";
import { Moon, Sun, Menu, UserCircle } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

export default function StaffNavbar({ onOpenSidebar, patientCount }) {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm">

            <button
                onClick={onOpenSidebar}
                className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1 text-center text-sm font-medium">
                Today’s Patients:{" "}
                <span className="text-blue-600 font-semibold">{patientCount}</span>
            </div>

            <div className="flex items-center gap-4">
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
