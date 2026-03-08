import React from "react";

const COLORS = {
  warmup: { accent: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.2)" },
  "main-activity": { accent: "#818cf8", bg: "rgba(129,140,248,0.08)", border: "rgba(129,140,248,0.2)" },
  wrapup: { accent: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.2)" },
};

export default function SectionHeader({ section }) {
  const color = COLORS[section.color] || COLORS["main-activity"];

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: "14px",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
    }}>
      <div style={{
        fontSize: "28px",
        background: `rgba(255,255,255,0.06)`,
        width: "56px", height: "56px",
        borderRadius: "12px",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        border: `1px solid ${color.border}`,
      }}>
        {section.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: color.accent, fontFamily: "var(--font-mono)" }}>
            {section.label}
          </h2>
          {section.time && (
            <span style={{
              fontSize: "12px", color: color.accent, opacity: 0.7,
              background: `rgba(255,255,255,0.06)`, border: `1px solid ${color.border}`,
              borderRadius: "20px", padding: "2px 10px", fontFamily: "var(--font-mono)",
            }}>
              {section.time}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
