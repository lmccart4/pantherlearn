// src/components/blocks/ChecklistBlock.jsx
import { useState } from "react";
import { useTranslatedText } from "../../hooks/useTranslatedText.jsx";
import { useTranslatedTexts } from "../../hooks/useTranslatedText.jsx";

export default function ChecklistBlock({ block }) {
  const translatedTitle = useTranslatedText(block.title);
  const translatedItems = useTranslatedTexts(block.items || []);
  const [checked, setChecked] = useState({});

  const toggle = (i) => setChecked((prev) => ({ ...prev, [i]: !prev[i] }));

  const items = block.items || [];
  const doneCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{
      margin: "24px 0",
      padding: "20px 24px",
      background: "var(--surface, #1e2132)",
      borderRadius: "var(--radius, 12px)",
      border: "1px solid var(--border, #2a2f3d)",
    }}>
      {translatedTitle && (
        <h3 style={{
          fontFamily: "var(--font-display, 'DM Sans', sans-serif)",
          fontSize: 16,
          fontWeight: 700,
          color: "var(--text, #e0e0e0)",
          marginBottom: 12,
        }}>
          📋 {translatedTitle}
        </h3>
      )}

      {/* Progress bar */}
      {items.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{
            height: 4, borderRadius: 2,
            background: "var(--border, #2a2f3d)",
            overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${(doneCount / items.length) * 100}%`,
              background: "var(--green, #22c55e)",
              borderRadius: 2,
              transition: "width 0.3s ease",
            }} />
          </div>
          <p style={{ fontSize: 11, color: "var(--text3, #888)", marginTop: 4 }}>
            {doneCount}/{items.length} completed
          </p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <label
            key={i}
            onClick={() => toggle(i)}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              padding: "8px 10px",
              borderRadius: 8,
              cursor: "pointer",
              background: checked[i] ? "rgba(34, 197, 94, 0.08)" : "transparent",
              transition: "background 0.15s",
            }}
          >
            <span style={{
              width: 22, height: 22, minWidth: 22,
              borderRadius: 6,
              border: checked[i] ? "2px solid var(--green, #22c55e)" : "2px solid var(--border, #2a2f3d)",
              background: checked[i] ? "var(--green, #22c55e)" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, color: "#fff",
              transition: "all 0.15s",
              marginTop: 1,
            }}>
              {checked[i] ? "✓" : ""}
            </span>
            <span style={{
              fontSize: 14,
              color: checked[i] ? "var(--text3, #888)" : "var(--text, #e0e0e0)",
              textDecoration: checked[i] ? "line-through" : "none",
              transition: "all 0.15s",
              lineHeight: 1.5,
            }}>
              {translatedItems[i] ?? item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
