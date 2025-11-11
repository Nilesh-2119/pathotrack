// src/pages/Auth/Landing.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FlaskConical, Activity, Users, Lock } from "lucide-react";

export default function Landing() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col">
            {/* Navbar */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-20">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
                    <FlaskConical className="w-6 h-6" />
                    PathoTrack
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
                    >
                        Create Account
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="flex flex-col-reverse md:flex-row items-center justify-between flex-1 px-8 md:px-16 py-10 gap-10">
                <div className="max-w-xl space-y-6 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                        Simplify Your Pathology Lab Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        PathoTrack is a cloud-based platform to manage your patients, staff,
                        reports, and billing — all in one place. Focus on care, not chaos.
                    </p>
                    <div className="flex justify-center md:justify-start gap-3">
                        <Link
                            to="/register"
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow text-sm font-medium"
                        >
                            Get Started — Create Your Lab
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                <div className="flex-1 flex justify-center md:justify-end">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/9987/9987815.png"
                        alt="Lab illustration"
                        className="w-72 md:w-96 drop-shadow-lg"
                    />
                </div>
            </section>

            {/* Features */}
            <section className="py-12 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Activity,
                            title: "Smart Analytics",
                            desc: "Track your daily and monthly reports with visual dashboards.",
                        },
                        {
                            icon: Users,
                            title: "Staff & Patients",
                            desc: "Easily manage staff, patients, and lab records securely.",
                        },
                        {
                            icon: Lock,
                            title: "Secure & Cloud-Based",
                            desc: "Your lab data stays encrypted and accessible anywhere.",
                        },
                    ].map((f) => (
                        <div
                            key={f.title}
                            className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <f.icon className="w-8 h-8 text-blue-600 mb-3" />
                            <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="py-4 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
                © {new Date().getFullYear()} PathoTrack — Smart Lab Management
            </footer>
        </div>
    );
}
