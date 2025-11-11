// src/context/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

// ✅ Create and Export the Context
export const ThemeContext = createContext();

// ✅ Theme Provider
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "light"
    );

    // Apply theme to the document
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Toggle theme
    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// ✅ Optional Custom Hook
export function useTheme() {
    return useContext(ThemeContext);
}
