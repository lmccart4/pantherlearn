import React, { useState } from "react";
import { renderText } from "./TextBlock";

export default function QuestionBlock({ block, responses, onResponse }) {
  const [revealed, setRevealed] = useState(false);
  const response = responses[block.id];

  if (block.questionType === "short_answer") {
    return (
      <div style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: "12px",
        padding: "20px",
        transition: "border-color 0.2s",
        ...(response ? { borderColor: "rgba(129,140,248,0.4)" } : {}),
      }}>
        <p style={{ fontSize: "15px", lineHeight: 1.65, marginBottom: "14px", fontWeight: 500 }}>
          {block.prompt}
        </p>
        <textarea
          value={response || ""}
          onChange={(e) => onResponse(block.id, e.target.value)}
          placeholder={block.placeholder}
          rows={4}
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "12px 14px",
            color: "var(--text)",
            fontSize: "14px",
            lineHeight: 1.6,
            resize: "vertical",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />
        {response && (
          <p style={{ fontSize: "12px", color: "var(--success)", marginTop: "8px" }}>
            ✓ Response saved
          </p>
        )}
      </div>
    );
  }

  if (block.questionType === "multiple_choice") {
    const selected = response !== undefined ? response : null;
    const isCorrect = selected === block.correctIndex;

    return (
      <div style={{
        background: "var(--surface)",
        border: "1.5px solid var(--border)",
        borderRadius: "12px",
        padding: "20px",
      }}>
        <p style={{ fontSize: "15px", lineHeight: 1.65, marginBottom: "16px", fontWeight: 500 }}>
          {block.prompt}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
          {block.options.map((opt, i) => {
            let bg = "rgba(255,255,255,0.02)";
            let border = "var(--border)";
            let textColor = "var(--text)";
            let labelColor = "var(--muted)";

            if (selected !== null && revealed) {
              if (i === block.correctIndex) {
                bg = "rgba(52,211,153,0.1)";
                border = "rgba(52,211,153,0.5)";
                textColor = "var(--success)";
                labelColor = "var(--success)";
              } else if (i === selected && selected !== block.correctIndex) {
                bg = "rgba(248,113,113,0.1)";
                border = "rgba(248,113,113,0.5)";
                textColor = "var(--danger)";
                labelColor = "var(--danger)";
              }
            } else if (selected === i) {
              bg = "rgba(129,140,248,0.1)";
              border = "rgba(129,140,248,0.5)";
              textColor = "var(--accent)";
              labelColor = "var(--accent)";
            }

            return (
              <button
                key={i}
                onClick={() => {
                  if (revealed) return;
                  onResponse(block.id, i);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px", borderRadius: "8px",
                  background: bg, border: `1.5px solid ${border}`,
                  color: textColor, fontSize: "14px", textAlign: "left",
                  cursor: revealed ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                <span style={{
                  width: "24px", height: "24px", flexShrink: 0,
                  borderRadius: "50%", border: `2px solid ${labelColor}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 700, fontFamily: "var(--font-mono)",
                  color: labelColor,
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {selected !== null && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            style={{
              padding: "10px 20px", borderRadius: "8px",
              background: "var(--accent)", color: "var(--bg)",
              border: "none", fontWeight: 700, fontSize: "13px",
            }}
          >
            Check Answer
          </button>
        )}

        {revealed && (
          <div style={{
            marginTop: "12px", padding: "14px", borderRadius: "8px",
            background: isCorrect ? "rgba(52,211,153,0.08)" : "rgba(248,113,113,0.08)",
            border: `1px solid ${isCorrect ? "rgba(52,211,153,0.25)" : "rgba(248,113,113,0.25)"}`,
          }}>
            <p style={{ fontWeight: 700, marginBottom: "6px", color: isCorrect ? "var(--success)" : "var(--danger)", fontSize: "13px" }}>
              {isCorrect ? "✓ Correct!" : "✗ Not quite"}
            </p>
            <div style={{ fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.6 }}>
              {renderText(block.explanation)}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
