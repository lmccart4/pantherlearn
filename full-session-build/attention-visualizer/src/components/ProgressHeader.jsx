// src/components/ProgressHeader.jsx
import React from "react";

export default function ProgressHeader({ currentRound, totalRounds, score, stage }) {
  const pct = (currentRound / totalRounds) * 100;

  return (
    <div
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: "var(--surface)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--accent)",
          fontWeight: 700,
        }}
      >
        STAGE {stage}/4
      </span>

      {/* Progress bar */}
      <div
        style={{
          flex: 1,
          height: "4px",
          background: "var(--border)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, var(--accent-dim), var(--accent))",
            borderRadius: "2px",
            transition: "width 0.5s ease",
          }}
        />
      </div>

      <span style={{ color: "var(--text-dim)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
        {currentRound}/{totalRounds}
      </span>

      <div
        style={{
          background: "rgba(129,140,248,0.1)",
          border: "1px solid rgba(129,140,248,0.2)",
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--accent)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {score} pts
      </div>
    </div>
  );
}
