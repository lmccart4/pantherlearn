// src/components/ThemeToggle.jsx — Light/dark mode toggle for TopBar
import { useState } from "react";
import { getTheme, setTheme } from "../lib/theme";

export default function ThemeToggle() {
  const [theme, setLocal] = useState(getTheme);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setLocal(next);
    setTheme(next);
  };

  const isLight = theme === "light";

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      style={{
        background: "none",
        border: "none",
        color: isLight ? "var(--amber)" : "var(--text3, #888)",
        fontSize: 18,
        cursor: "pointer",
        padding: "4px 6px",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        transition: "color 0.15s",
      }}
    >
      {isLight ? (
        // Sun icon (light mode active)
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="10" cy="10" r="4" />
          <path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M3.4 3.4l1.4 1.4M15.2 15.2l1.4 1.4M3.4 16.6l1.4-1.4M15.2 4.8l1.4-1.4" />
        </svg>
      ) : (
        // Moon icon (dark mode active)
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17.3 11.05A7.5 7.5 0 0 1 8.95 2.7a7.5 7.5 0 1 0 8.35 8.35Z" />
        </svg>
      )}
    </button>
  );
}
