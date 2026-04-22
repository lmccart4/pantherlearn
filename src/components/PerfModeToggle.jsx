// src/components/PerfModeToggle.jsx — Settings gear with perf + theme toggle (Savanna)
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

  return (
    <div ref={menuRef} className="pm-root">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Settings"
        aria-expanded={menuOpen}
        title="Settings"
        className={`pm-gear${menuOpen ? " pm-gear--open" : ""}`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {menuOpen && (
        <div className="pm-menu" role="menu">
          <label className="pm-row">
            <span className="pm-row-label">
              {isLight ? "☀️" : "🌙"} {isLight ? "Light Mode" : "Dark Mode"}
            </span>
            <span role="switch" aria-checked={isLight} tabIndex={0} onClick={toggleTheme} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleTheme(); } }} className={`pm-switch${isLight ? " pm-switch--on" : ""}`}>
              <span className="pm-switch-dot" />
            </span>
          </label>

          <label className="pm-row">
            <span className="pm-row-label">⚡ Performance Mode</span>
            <span role="switch" aria-checked={perfEnabled} tabIndex={0} onClick={togglePerf} onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); togglePerf(); } }} className={`pm-switch${perfEnabled ? " pm-switch--on" : ""}`}>
              <span className="pm-switch-dot" />
            </span>
          </label>
          <p className="pm-row-help">Reduces animations for slower devices.</p>
        </div>
      )}

      {toast && <div className="pm-toast" role="status">{toast}</div>}

      <style>{`
        .pm-root { position: relative; }
        .pm-gear {
          background: transparent;
          border: none;
          color: var(--fg-muted);
          font-size: 18px;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: var(--r-sm);
          display: flex;
          align-items: center;
          transition: color var(--dur-fast) var(--ease-snap), background var(--dur-fast) var(--ease-snap);
        }
        .pm-gear:hover { color: var(--fg-default); background: var(--bg-sunken); }
        .pm-gear--open { color: var(--fg-default); background: var(--bg-sunken); }

        .pm-menu {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          background: var(--bg-surface);
          border: 1.5px solid var(--fg-default);
          border-radius: var(--r-md);
          padding: 12px 16px;
          min-width: 240px;
          box-shadow: var(--shadow-card);
          z-index: 200;
          color: var(--fg-default);
        }
        .pm-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: var(--fg-default);
          padding: 6px 0;
        }
        .pm-row-label { display: flex; align-items: center; gap: 8px; }
        .pm-row-help {
          font-family: var(--mono);
          font-size: 11px;
          color: var(--fg-muted);
          margin-top: 4px;
          line-height: 1.4;
          letter-spacing: 0.04em;
        }

        .pm-switch {
          width: 38px;
          height: 22px;
          border-radius: var(--r-full);
          background: var(--bg-sunken);
          border: 1.5px solid var(--fg-default);
          position: relative;
          flex-shrink: 0;
          cursor: pointer;
          transition: background var(--dur-fast) var(--ease-snap);
        }
        .pm-switch--on { background: var(--accent-hero); }
        .pm-switch-dot {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: var(--fg-default);
          transition: left var(--dur-fast) var(--ease-snap);
        }
        .pm-switch--on .pm-switch-dot { left: 18px; background: var(--accent-hero-ink); }

        .pm-toast {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--bg-inverse);
          color: var(--fg-inverse);
          border: 1.5px solid var(--bg-inverse);
          border-radius: var(--r-md);
          padding: 10px 18px;
          font-family: var(--mono);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          box-shadow: var(--shadow-card);
          z-index: 300;
          white-space: nowrap;
          animation: pm-toast-in 0.25s var(--ease-snap);
        }
        @keyframes pm-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
