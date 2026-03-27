// src/components/PerfModeToggle.jsx — Performance Mode toggle for student topbar
import { useState, useEffect, useRef } from "react";
import { isPerfMode, setPerfMode } from "../lib/perfMode";

export default function PerfModeToggle() {
  const [enabled, setEnabled] = useState(isPerfMode);
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    setPerfMode(next);
    setToast(next
      ? "Performance mode enabled — faster on slow devices"
      : "Performance mode disabled"
    );
    setMenuOpen(false);
  };

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Settings"
        title="Settings"
        style={{
          background: "none",
          border: "none",
          color: enabled ? "var(--amber)" : "var(--text3, #888)",
          fontSize: 18,
          cursor: "pointer",
          padding: "4px 6px",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          transition: "color 0.15s",
        }}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="3" />
          <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.4 3.4l1.4 1.4M15.2 15.2l1.4 1.4M3.4 16.6l1.4-1.4M15.2 4.8l1.4-1.4" />
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
            <span>Performance Mode</span>
            <span
              role="switch"
              aria-checked={enabled}
              onClick={toggle}
              style={{
                width: 38,
                height: 22,
                borderRadius: 11,
                background: enabled ? "var(--green, #34d8a8)" : "var(--surface3, #262c3d)",
                border: `1px solid ${enabled ? "var(--green, #34d8a8)" : "var(--border, #323952)"}`,
                position: "relative",
                flexShrink: 0,
                cursor: "pointer",
              }}
            >
              <span style={{
                position: "absolute",
                top: 2,
                left: enabled ? 18 : 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "var(--text, #f0f0f4)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }} />
            </span>
          </label>
          <p style={{
            fontSize: 11,
            color: "var(--text3, #888)",
            marginTop: 6,
            lineHeight: 1.4,
          }}>
            Reduces animations and effects for Chromebooks and slower devices.
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
