// src/components/Results.jsx
import React from "react";

export default function Results({ scores, finalScore, maxScore, onFinish }) {
  const pct = Math.round((finalScore / maxScore) * 100);
  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const gradeColor = pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)";
  const perfects = scores.filter((s) => s.judgment === "perfect").length;
  const firstTries = scores.filter((s) => s.judgment === "perfect" && s.attempts === 1).length;

  // Group by concept
  const concepts = {};
  for (const s of scores) {
    if (!concepts[s.concept]) concepts[s.concept] = { scores: [], total: 0, earned: 0 };
    concepts[s.concept].scores.push(s);
    concepts[s.concept].total += s.maxPoints;
    concepts[s.concept].earned += s.points;
  }

  const conceptLabels = {
    specificity: "Specificity", audience: "Audience Targeting", formatting: "Format Control",
    role_setting: "Role Setting", constraints: "Constraints", negative_constraints: "Negative Constraints",
    chain_of_thought: "Chain-of-Thought", few_shot: "Few-Shot Prompting", system_design: "System Design",
  };

  return (
    <div className="slide-up" style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🧪</div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, fontFamily: "var(--font-mono)", marginBottom: "12px" }}>Workshop Complete!</h1>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "16px",
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "16px", padding: "20px 32px",
        }}>
          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: gradeColor, fontFamily: "var(--font-mono)" }}>{finalScore}</div>
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>out of {maxScore}</div>
          </div>
          <div style={{ width: "1px", height: "50px", background: "var(--border)" }} />
          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: gradeColor, fontFamily: "var(--font-mono)" }}>{grade}</div>
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>{perfects}/{scores.length} perfect</div>
          </div>
        </div>
        {firstTries > 0 && (
          <div style={{ marginTop: "12px", color: "var(--success)", fontSize: "13px", fontWeight: 600 }}>
            ⚡ {firstTries} first-try perfect{firstTries !== 1 ? "s" : ""}!
          </div>
        )}
      </div>

      {/* Concept mastery */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", marginBottom: "16px" }}>Skills Breakdown</h3>
        {Object.entries(concepts).map(([concept, data]) => {
          const pctC = data.total > 0 ? data.earned / data.total : 0;
          return (
            <div key={concept} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "4px" }}>
                <span>{conceptLabels[concept] || concept}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: pctC >= 0.7 ? "var(--success)" : pctC >= 0.4 ? "var(--warning)" : "var(--danger)" }}>
                  {data.earned}/{data.total} pts
                </span>
              </div>
              <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${pctC * 100}%`, height: "100%", background: pctC >= 0.7 ? "var(--success)" : pctC >= 0.4 ? "var(--warning)" : "var(--danger)", borderRadius: "3px", transition: "width 0.6s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Takeaways */}
      <div style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--success)", marginBottom: "12px" }}>🧠 Key Takeaways</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            "Specific prompts get specific results. Tell the AI exactly what format, length, and content you want.",
            "Setting a role ('You are a pirate captain...') makes the AI commit to a persona instead of defaulting to generic responses.",
            "Negative constraints ('do NOT use these words') are just as powerful as positive instructions.",
            "Few-shot prompting — giving examples before the task — teaches the AI the pattern you want without needing to explain it in words.",
            "Chain-of-thought prompting ('think step by step') dramatically improves accuracy on reasoning and math tasks.",
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", color: "var(--text-dim)", lineHeight: 1.5 }}>
              <span style={{ color: "var(--success)", fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
              {t}
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "var(--border)", color: "var(--muted)",
          padding: "14px 36px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
        }}>
          ✓ Score Submitted
        </div>
        <p style={{ color: "var(--muted)", fontSize: "11px", marginTop: "12px" }}>Your score has been sent to PantherLearn</p>
      </div>
    </div>
  );
}
