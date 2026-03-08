import React from "react";

export default function DefinitionBlock({ block }) {
  return (
    <div style={{
      display: "flex", gap: "0",
      background: "var(--surface)",
      border: "1px solid rgba(129,140,248,0.25)",
      borderRadius: "12px",
      overflow: "hidden",
    }}>
      {/* Left accent bar */}
      <div style={{ width: "4px", background: "var(--accent)", flexShrink: 0 }} />

      <div style={{ padding: "16px 20px", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <span style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em",
            color: "var(--accent)", textTransform: "uppercase",
            fontFamily: "var(--font-mono)",
          }}>
            Definition
          </span>
        </div>
        <div style={{ fontWeight: 700, fontSize: "17px", color: "var(--accent)", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
          {block.term}
        </div>
        <div style={{ fontSize: "14px", color: "var(--text-dim)", lineHeight: 1.65 }}>
          {block.definition}
        </div>
      </div>
    </div>
  );
}
