// src/components/StageIntro.jsx
import React from "react";

export default function StageIntro({ stage, stageNum, onStart }) {
  if (!stage) return null;

  return (
    <div
      className="fade-in"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 60px)",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "500px",
          textAlign: "center",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "40px 32px",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>{stage.icon}</div>
        <div
          style={{
            color: "var(--accent)",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          Stage {stageNum} of 4
        </div>
        <h2
          style={{
            fontSize: "24px",
            fontWeight: 700,
            marginBottom: "6px",
            fontFamily: "var(--font-mono)",
          }}
        >
          {stage.title}
        </h2>
        <p
          style={{
            color: "var(--accent)",
            fontSize: "14px",
            fontStyle: "italic",
            marginBottom: "16px",
          }}
        >
          {stage.subtitle}
        </p>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "14px",
            lineHeight: 1.7,
            marginBottom: "28px",
          }}
        >
          {stage.description}
        </p>
        <button
          onClick={onStart}
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
            border: "none",
            padding: "12px 32px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: 700,
          }}
        >
          Let's Go →
        </button>
      </div>
    </div>
  );
}
