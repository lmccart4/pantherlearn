// src/components/LanguageSelector.jsx
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "../contexts/TranslationContext";

export default function LanguageSelector() {
  const { language, setLanguage, languages } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = languages.find((l) => l.code === language) || languages[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Language selector"
        aria-expanded={open}
        aria-haspopup="listbox"
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 8,
          border: "1px solid var(--border)", background: "var(--surface)",
          color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13,
          cursor: "pointer", transition: "border-color 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = open ? "var(--amber)" : "var(--border)"}
      >
        <span style={{ fontSize: 15 }}>{current.flag}</span>
        <span>{current.native}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" style={{ opacity: 0.5, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
          <path d="M3 4.5L6 7.5L9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div role="listbox" aria-label="Select language"
          onKeyDown={(e) => {
            if (e.key === "Escape") { setOpen(false); ref.current?.querySelector("button")?.focus(); }
          }}
          style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 1000,
          minWidth: 220, maxHeight: 380, overflowY: "auto",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 10, padding: 4,
          boxShadow: "0 8px 30px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)",
          animation: "langMenuIn 0.14s ease-out",
        }}>
          <style>{`
            @keyframes langMenuIn {
              from { opacity: 0; transform: translateY(-5px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          {languages.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === language}
              onClick={() => { setLanguage(lang.code); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%",
                padding: "9px 11px", borderRadius: 7, cursor: "pointer",
                transition: "background 0.12s", border: "none", textAlign: "left",
                background: lang.code === language ? "var(--amber-dim)" : "transparent",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = lang.code === language ? "var(--amber-dim)" : "rgba(255,255,255,0.05)"}
              onMouseLeave={(e) => e.currentTarget.style.background = lang.code === language ? "var(--amber-dim)" : "transparent"}
            >
              <span style={{ fontSize: 17, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{lang.native}</span>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>{lang.name}</span>
              </div>
              {lang.code === language && (
                <span style={{ color: "var(--amber)", fontSize: 14 }} aria-hidden="true">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
