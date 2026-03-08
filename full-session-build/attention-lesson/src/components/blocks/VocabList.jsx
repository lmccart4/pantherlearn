import React, { useState } from "react";

export default function VocabList({ block }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      {block.title && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ height: "1px", background: "var(--border)", flex: 1 }} />
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
            color: "var(--muted)", textTransform: "uppercase", fontFamily: "var(--font-mono)",
          }}>
            {block.title}
          </span>
          <div style={{ height: "1px", background: "var(--border)", flex: 1 }} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
        {block.terms.map((item, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              background: expanded === i ? "rgba(129,140,248,0.08)" : "var(--surface)",
              border: `1.5px solid ${expanded === i ? "rgba(129,140,248,0.35)" : "var(--border)"}`,
              borderRadius: "10px",
              padding: "14px 16px",
              textAlign: "left",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: expanded === i ? "10px" : 0 }}>
              <span style={{ fontWeight: 700, fontSize: "14px", color: "var(--accent)", fontFamily: "var(--font-mono)" }}>
                {item.term}
              </span>
              <span style={{ color: "var(--muted)", fontSize: "14px", transition: "transform 0.2s", transform: expanded === i ? "rotate(180deg)" : "rotate(0deg)" }}>
                ▾
              </span>
            </div>
            {expanded === i && (
              <p style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6, margin: 0 }}>
                {item.definition}
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
