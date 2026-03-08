// src/components/Results.jsx
import React from "react";

export default function Results({ scores, finalScore, maxScore, onFinish }) {
  const correct = scores.filter((s) => s.correct).length;
  const total = scores.length;
  const pct = Math.round((finalScore / maxScore) * 100);

  // Group by stage
  const stages = {};
  for (const s of scores) {
    if (!stages[s.stage]) stages[s.stage] = { correct: 0, total: 0, points: 0, maxPoints: 0 };
    stages[s.stage].total++;
    stages[s.stage].points += s.points;
    stages[s.stage].maxPoints += s.maxPoints;
    if (s.correct) stages[s.stage].correct++;
  }

  const stageNames = {
    1: "Pattern Recognition",
    2: "Context is Everything",
    3: "Ambiguity & Knowledge",
    4: "Temperature Control",
  };

  const grade =
    pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  const gradeColor =
    pct >= 80 ? "var(--success)" : pct >= 60 ? "var(--warning)" : "var(--danger)";

  return (
    <div
      className="slide-up"
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "40px 24px",
      }}
    >
      {/* Score circle */}
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "48px", marginBottom: "8px" }}>🧪</div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            marginBottom: "8px",
          }}
        >
          Lab Complete!
        </h1>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px 32px",
          }}
        >
          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: gradeColor, fontFamily: "var(--font-mono)" }}>
              {finalScore}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>out of {maxScore}</div>
          </div>
          <div
            style={{
              width: "1px",
              height: "50px",
              background: "var(--border)",
            }}
          />
          <div>
            <div style={{ fontSize: "48px", fontWeight: 700, color: gradeColor, fontFamily: "var(--font-mono)" }}>
              {grade}
            </div>
            <div style={{ color: "var(--muted)", fontSize: "12px" }}>
              {correct}/{total} exact matches
            </div>
          </div>
        </div>
      </div>

      {/* Stage breakdown */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            marginBottom: "16px",
            color: "var(--accent)",
          }}
        >
          Performance by Stage
        </h3>
        {Object.entries(stages).map(([stage, data]) => {
          const stagePct = data.maxPoints > 0 ? data.points / data.maxPoints : 0;
          return (
            <div key={stage} style={{ marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  marginBottom: "4px",
                }}
              >
                <span style={{ fontWeight: 500 }}>
                  Stage {stage}: {stageNames[stage]}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    color:
                      stagePct >= 0.7
                        ? "var(--success)"
                        : stagePct >= 0.4
                        ? "var(--warning)"
                        : "var(--danger)",
                  }}
                >
                  {data.correct}/{data.total} · {data.points}/{data.maxPoints} pts
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  background: "var(--border)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${stagePct * 100}%`,
                    height: "100%",
                    background:
                      stagePct >= 0.7
                        ? "var(--success)"
                        : stagePct >= 0.4
                        ? "var(--warning)"
                        : "var(--danger)",
                    borderRadius: "3px",
                    transition: "width 0.6s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Takeaways */}
      <div
        style={{
          background: "rgba(129,140,248,0.06)",
          border: "1px solid rgba(129,140,248,0.15)",
          borderRadius: "12px",
          padding: "20px",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--accent)",
            marginBottom: "12px",
          }}
        >
          🧠 Key Takeaways
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            "Language models predict the next token by assigning probabilities to every possible word based on patterns in training data.",
            "The attention mechanism uses context words to determine meaning — the same word can have completely different probabilities depending on surrounding words.",
            "When the model is uncertain, it spreads probability across many options (high entropy). When it's confident, one token dominates.",
            "Temperature controls how 'creative' vs. 'predictable' the model is. Low temperature picks the safest option; high temperature takes risks.",
          ].map((takeaway, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                fontSize: "13px",
                color: "var(--text-dim)",
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: "var(--accent)", fontWeight: 700, flexShrink: 0 }}>
                {i + 1}.
              </span>
              {takeaway}
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div style={{ textAlign: "center" }}>
        <button
          onClick={onFinish}
          style={{
            background: "linear-gradient(135deg, var(--accent-dim), var(--accent))",
            color: "var(--bg)",
            border: "none",
            padding: "14px 36px",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 700,
            boxShadow: "0 4px 20px rgba(129,140,248,0.25)",
          }}
        >
          ✓ Submit Score
        </button>
        <p style={{ color: "var(--muted)", fontSize: "11px", marginTop: "12px" }}>
          Your score has been sent to PantherLearn
        </p>
      </div>
    </div>
  );
}
