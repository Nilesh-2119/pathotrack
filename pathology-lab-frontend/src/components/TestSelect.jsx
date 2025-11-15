// src/components/TestSelect.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../api/apiClient";
import { ChevronDown, X } from "lucide-react";

/**
 * Props:
 * - selectedTests: array of selected test objects
 * - onChange: function(selectedTests)
 *
 * Test object expected shape (from backend): { id, name, price, tubes: [{id, name}, ...] }
 */
export default function TestSelect({ selectedTests = [], onChange = () => { } }) {
  const [open, setOpen] = useState(false);
  const [tests, setTests] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get("/tests/");
        if (!mounted) return;
        setTests(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch tests:", err);
        setTests([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  // close dropdown on outside click
  useEffect(() => {
    const onDoc = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggleSelect = (test) => {
    const exists = selectedTests.find((t) => t.id === test.id);
    let next;
    if (exists) {
      next = selectedTests.filter((t) => t.id !== test.id);
    } else {
      next = [...selectedTests, test];
    }
    onChange(next);
  };

  const removeChip = (id) => {
    onChange(selectedTests.filter((t) => t.id !== id));
  };

  // filter with search q (case-insensitive)
  const filtered = tests.filter((t) => {
    if (!q) return true;
    const tubeNames = (t.tubes || []).map((x) => x.name).join(" ");
    return (
      t.name.toLowerCase().includes(q.toLowerCase()) ||
      tubeNames.toLowerCase().includes(q.toLowerCase()) ||
      String(t.price).includes(q)
    );
  });

  return (
    <div className="relative" ref={containerRef}>
      {/* Selected chips + opener */}
      <div
        className="w-full border rounded-lg px-3 py-2 flex flex-wrap items-center gap-2 cursor-pointer bg-white dark:bg-gray-800"
        onClick={() => setOpen((s) => !s)}
        aria-expanded={open}
      >
        {selectedTests.length === 0 ? (
          <div className="text-sm text-gray-400">Select tests...</div>
        ) : (
          selectedTests.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-2 px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-xs text-blue-800 dark:text-blue-200"
            >
              <div className="font-medium">{t.name}</div>
              {t.tubes && t.tubes.length > 0 && (
                <div className="text-xs text-gray-500 dark:text-gray-400">· {t.tubes.map(x => x.name).join(", ")}</div>
              )}
              <div className="text-xs font-semibold">₹{t.price}</div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeChip(t.id);
                }}
                title="Remove"
                className="p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}

        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-gray-500 mr-1 hidden sm:block">
            {selectedTests.length} selected
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transform ${open ? "rotate-180" : ""}`} />
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-40 mt-2 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg">
          <div className="px-3 py-2">
            <input
              type="search"
              placeholder="Search tests or tube..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-900 text-sm"
            />
          </div>

          <div className="px-2 pb-2">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-500">Loading tests...</div>
            ) : filtered.length === 0 ? (
              <div className="p-4 text-sm text-gray-500">No tests found.</div>
            ) : (
              <ul className="max-h-56 overflow-auto">
                {filtered.map((t) => {
                  const isSelected = !!selectedTests.find((s) => s.id === t.id);
                  return (
                    <li
                      key={t.id}
                      onClick={() => toggleSelect(t)}
                      className={`flex items-center justify-between gap-3 px-3 py-2 cursor-pointer rounded-md mb-1
                        ${isSelected ? "bg-blue-50 dark:bg-blue-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-700/40"}`}
                    >
                      <div>
                        <div className="font-medium text-sm">{t.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {(t.tubes && t.tubes.length > 0) ? `${t.tubes.map(x => x.name).join(", ")} · ` : ""}₹{t.price}
                        </div>
                      </div>

                      <div className="text-sm">
                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded text-xs bg-blue-600 text-white">Selected</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-xs border">Add</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
