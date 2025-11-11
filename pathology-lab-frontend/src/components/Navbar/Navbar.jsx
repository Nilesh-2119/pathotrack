// src/components/Navbar/Navbar.jsx
import React, { useContext } from "react";
import { Moon, Sun, UserCircle, LogOut, Menu } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onOpenSidebar }) {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    // 🧠 Fetch logged-in user data (from localStorage)
    const user =
        JSON.parse(localStorage.getItem("user")) || {
            doctorName: "Dr. Admin",
            email: "lab@patho.com",
        };

    // 🔐 Logout functionality
    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
        }
    };

    return (
        <header className="flex items-center justify-between gap-4 px-4 py-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20 shadow-sm">
            {/* Left side: Hamburger + Lab name */}
            <div className="flex items-center gap-3">
                <button
                    className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={onOpenSidebar}
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                        PathoTrack Admin
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Welcome back 👋
                    </div>
                </div>
            </div>

            {/* Right side: Theme, User Info, Logout */}
            <div className="flex items-center gap-3">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    title="Toggle theme"
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-gray-600" />
                    )}
                </button>

                {/* User info */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                    <UserCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    <div className="hidden sm:block">
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                            {user.doctorName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                        </div>
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition text-red-500 hover:text-red-600"
                    title="Logout"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
