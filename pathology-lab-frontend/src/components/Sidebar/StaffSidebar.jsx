import React from "react";
import { Home, Users, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SideItem({ to, icon: Icon, label }) {
    const loc = useLocation();
    const active = loc.pathname === to;
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-md ${active
                    ? "bg-blue-50 dark:bg-gray-800 text-blue-600"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}

export default function StaffSidebar({ open, onClose }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("staff");
            navigate("/staff/login");
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            <aside
                className={`fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform md:translate-x-0 transition-transform ${open ? "translate-x-0" : "-translate-x-full"
                    } md:relative`}
            >
                <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center text-blue-600 font-bold">
                        BC
                    </div>
                    <div>
                        <div className="text-sm font-semibold">PathoTrack</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Staff Panel
                        </div>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    <SideItem to="/staff/dashboard" icon={Home} label="Home" />
                    <SideItem to="/staff/patients" icon={Users} label="Patients" />
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2 w-full text-left text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-800 hover:text-red-600 rounded-md"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </nav>
            </aside>
        </>
    );
}
