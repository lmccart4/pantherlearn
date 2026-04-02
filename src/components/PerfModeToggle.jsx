// src/components/PerfModeToggle.jsx — Settings gear with perf mode + theme toggle
import { useState, useEffect, useRef } from "react";
import { isPerfMode, setPerfMode } from "../lib/perfMode";
import { getTheme, setTheme } from "../lib/theme";

export default function PerfModeToggle() {
  const [perfEnabled, setPerfEnabled] = useState(isPerfMode);
  const [theme, setLocalTheme] = useState(getTheme);
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const togglePerf = () => {
    const next = !perfEnabled;
    setPerfEnabled(next);
    setPerfMode(next);
    setToast(next ? "Performance mode enabled" : "Performance mode disabled");
  };

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setLocalTheme(next);
    setTheme(next);
    setToast(next === "light" ? "Light mode enabled" : "Dark mode enabled");
  };

  const isLight = theme === "light";

  const switchStyle = (enabled) => ({
    width: 38,
    height: 22,
    borderRadius: 11,
    background: enabled ? "var(--green, #34d8a8)" : "var(--surface3, #262c3d)",
    border: `1px solid ${enabled ? "var(--green, #34d8a8)" : "var(--border, #323952)"}`,
    position: "relative",
    flexShrink: 0,
    cursor: "pointer",
  });

  const dotStyle = (enabled) => ({
    position: "absolute",
    top: 2,
    left: enabled ? 18 : 2,
    width: 16,
    height: 16,
    borderRadius: "50%",
    background: "var(--text, #f0f0f4)",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
    transition: "left 0.15s",
  });

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Settings"
        title="Settings"
        style={{
          background: "none",
          border: "none",
          color: menuOpen ? "var(--amber)" : "var(--text3, #888)",
          fontSize: 18,
          cursor: "pointer",
          padding: "4px 6px",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          transition: "color 0.15s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 8px)",
          right: 0,
          background: "var(--surface, #1e2132)",
          border: "1px solid var(--border, #2a2f3d)",
          borderRadius: 10,
          padding: "12px 16px",
          minWidth: 220,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          zIndex: 200,
        }}>
          {/* Theme Toggle */}
          <label style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            cursor: "pointer",
            fontSize: 14,
            color: "var(--text, #f0f0f4)",
            fontWeight: 500,
            marginBottom: 12,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {isLight ? "☀️" : "🌙"} {isLight ? "Light Mode" : "Dark Mode"}
            </span>
            <span role="switch" aria-checked={isLight} onClick={toggleTheme} style={switchStyle(isLight)}>
              <span style={dotStyle(isLight)} />
            </span>
          </label>

          {/* Perf Mode Toggle */}
          <label style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            cursor: "pointer",
            fontSize: 14,
            color: "var(--text, #f0f0f4)",
            fontWeight: 500,
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              ⚡ Performance Mode
            </span>
            <span role="switch" aria-checked={perfEnabled} onClick={togglePerf} style={switchStyle(perfEnabled)}>
              <span style={dotStyle(perfEnabled)} />
            </span>
          </label>
          <p style={{
            fontSize: 11,
            color: "var(--text3, #888)",
            marginTop: 6,
            lineHeight: 1.4,
          }}>
            Reduces animations for slower devices.
          </p>
        </div>
      )}

      {toast && (
        <div style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: "var(--surface, #1e2132)",
          border: "1px solid var(--border, #2a2f3d)",
          borderRadius: 10,
          padding: "10px 20px",
          fontSize: 13,
          color: "var(--text, #f0f0f4)",
          fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          zIndex: 300,
          whiteSpace: "nowrap",
          animation: "perfToastIn 0.25s ease",
        }}>
          {toast}
        </div>
      )}

      <style>{`
        @keyframes perfToastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
