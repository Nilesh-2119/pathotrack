// src/components/Sidebar/Sidebar.jsx
import React from "react";
import {
    Layout,
    Users,
    Settings,
    UserCheck,
    Beaker,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function SideItem({ to, icon: Icon, label }) {
    const location = useLocation();
    const active = location.pathname === to;

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${active
                ? "bg-blue-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 font-medium"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
        >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>
        </Link>
    );
}

export default function Sidebar({ open, onClose }) {
    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity ${open
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Sidebar Container */}
            <aside
                className={`fixed z-40 top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform md:translate-x-0 transition-transform ${open ? "translate-x-0" : "-translate-x-full"
                    } md:relative`}
            >
                {/* Logo + Header */}
                <div className="p-4 flex items-center gap-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                        PT
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            PathoTrack
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Admin Panel
                        </div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="p-4 space-y-1">
                    <SideItem to="/admin/dashboard" icon={Layout} label="Dashboard" />
                    <SideItem to="/admin/patients" icon={Users} label="Patients" />
                    <SideItem to="/admin/staff" icon={UserCheck} label="Blood Collection Staff" />
                    <SideItem to="/admin/tests" icon={Beaker} label="Manage Tests" />
                    <SideItem to="/admin/settings" icon={Settings} label="Settings" />
                </nav>

                {/* Footer / Version */}
                <div className="absolute bottom-3 left-4 text-xs text-gray-400 dark:text-gray-500">
                    © {new Date().getFullYear()} PathoTrack
                </div>
            </aside>
        </>
    );
}
