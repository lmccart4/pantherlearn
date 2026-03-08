// src/components/Results.jsx
import React from "react";

export default function Results({ scores, finalScore, maxScore, onFinish }) {
  const pct = Math.round((finalScore / maxScore) * 100);
  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const gradeColor = pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)";

  const totalFlagged = scores.reduce((s, r) => s + (r.flaggedCount || 0), 0);
  const totalClassified = scores.reduce((s, r) => s + (r.classifications?.length || 0), 0);

  return (
    <div className="slide-up" style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🕵️</div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", marginBottom: "12px" }}>
          Investigation Complete!
        </h1>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "16px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "20px 32px",
        }}>
          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: gradeColor, fontFamily: "var(--font-mono)" }}>{finalScore}</div>
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>out of {maxScore}</div>
          </div>
          <div style={{ width: "1px", height: "50px", background: "var(--border)" }} />
          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: gradeColor, fontFamily: "var(--font-mono)" }}>{grade}</div>
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>{totalFlagged} claims flagged</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--danger)" }}>{totalFlagged}</div>
          <div style={{ fontSize: "11px", color: "var(--muted)" }}>Claims Flagged</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--accent)" }}>{totalClassified}</div>
          <div style={{ fontSize: "11px", color: "var(--muted)" }}>Classified</div>
        </div>
        <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--success)" }}>{scores.length}</div>
          <div style={{ fontSize: "11px", color: "var(--muted)" }}>Scenarios Done</div>
        </div>
      </div>

      {/* Per-scenario breakdown */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", marginBottom: "16px" }}>Scenario Breakdown</h3>
        {scores.map((s, i) => {
          const scenarioPct = s.maxPoints > 0 ? s.points / s.maxPoints : 0;
          return (
            <div key={i} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span>Round {i + 1}: {s.flaggedCount} flagged, {s.classifications?.length || 0} classified</span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontWeight: 600,
                  color: scenarioPct >= 0.6 ? "var(--success)" : "var(--warning)",
                }}>
                  {s.points}/{s.maxPoints} pts
                </span>
              </div>
              <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  width: `${scenarioPct * 100}%`, height: "100%",
                  background: scenarioPct >= 0.6 ? "var(--success)" : "var(--warning)",
                  borderRadius: "3px", transition: "width 0.6s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Takeaways */}
      <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--danger)", marginBottom: "12px" }}>🧠 Key Takeaways</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            "AI hallucinations happen because models predict probable-sounding words, not truthful ones. They don't 'know' facts — they pattern-match.",
            "Hallucinations are dangerous precisely because they sound confident and plausible. The AI doesn't signal uncertainty.",
            "Common hallucination types include invented studies, wrong dates, false attributions, and fabricated details. Knowing the categories helps you spot them.",
            "The only reliable defense is critical thinking: verify specific claims, cross-reference sources, and be especially skeptical of statistics, quotes, and named sources.",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--danger)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          onClick={onFinish}
          style={{
            background: "linear-gradient(135deg, #ef4444, #f87171)", color: "#fff", border: "none",
            padding: "14px 36px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
            boxShadow: "0 4px 20px rgba(248,113,113,0.3)",
          }}
        >
          ✓ Submit Score
        </button>
        <p style={{ color: "var(--muted)", fontSize: "11px", marginTop: "12px" }}>Your score has been sent to PantherLearn</p>
      </div>
    </div>
  );
}
