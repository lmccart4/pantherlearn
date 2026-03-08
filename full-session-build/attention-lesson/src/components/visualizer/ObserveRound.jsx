// src/components/ObserveRound.jsx
import React, { useState } from "react";
import AttentionDisplay from "./AttentionDisplay";

export default function ObserveRound({ scenario, roundNum, totalRounds, onComplete }) {
  const [phase, setPhase] = useState("meaning"); // meaning | reveal | insight
  const [picked, setPicked] = useState(null);

  const handlePick = (meaning) => {
    setPicked(meaning);
    // Show attention arrows after they pick
    setTimeout(() => setPhase("reveal"), 300);
  };

  const handleContinue = () => {
    if (phase === "reveal") {
      setPhase("insight");
    } else {
      const correct = picked === scenario.meaning;
      onComplete({
        points: correct ? 8 : 3, // partial credit for Stage 1 (observation)
        maxPoints: 8,
        correct,
        picked,
      });
    }
  };

  const correct = picked === scenario.meaning;

  return (
    <div className="slide-up" style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ color: "var(--muted)", fontSize: "12px", fontFamily: "var(--font-mono)", marginBottom: "12px", letterSpacing: "1px" }}>
        ROUND {roundNum} OF {totalRounds} — OBSERVE
      </div>

      {/* Sentence with attention */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
        <div style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "8px" }}>
          What does <strong style={{ color: "var(--accent)" }}>"{scenario.words[scenario.targetIdx]}"</strong> mean in this sentence?
        </div>
        <AttentionDisplay scenario={scenario} showWeights={phase !== "meaning"} />
      </div>

      {/* Meaning choices */}
      {phase === "meaning" && (
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          {[scenario.meaning, scenario.wrongMeaning].sort().map((m) => (
            <button
              key={m}
              onClick={() => handlePick(m)}
              style={{
                flex: 1, padding: "14px", borderRadius: "10px",
                background: "var(--surface)", border: "1.5px solid var(--border)",
                color: "var(--text)", fontSize: "14px", fontWeight: 500,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--accent)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Feedback after picking */}
      {phase === "reveal" && (
        <div className="fade-in">
          <div style={{
            textAlign: "center", fontSize: "14px", fontWeight: 600, marginBottom: "16px",
            color: correct ? "var(--success)" : "var(--warning)",
          }}>
            {correct ? "✅ Correct!" : `Not quite — it means "${scenario.meaning}"`}
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "13px", textAlign: "center", marginBottom: "16px" }}>
            Look at the attention arrows above. The thicker the arrow, the more that word influenced the meaning of <strong style={{ color: "var(--accent)" }}>"{scenario.words[scenario.targetIdx]}"</strong>.
          </p>
        </div>
      )}

      {/* Top attenders breakdown */}
      {phase === "insight" && (
        <div className="fade-in" style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "10px" }}>
            💡 Why these words matter:
          </h4>
          {scenario.topAttenders.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "13px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent)", minWidth: "85px" }}>
                "{a.word}" ({Math.round(a.weight * 100)}%)
              </span>
              <span style={{ color: "var(--text-dim)" }}>{a.why}</span>
            </div>
          ))}
          <p style={{ color: "var(--text-dim)", fontSize: "13px", marginTop: "10px", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
            {scenario.explanation}
          </p>
        </div>
      )}

      {/* Continue button */}
      {phase !== "meaning" && (
        <div className="fade-in" style={{ textAlign: "center" }}>
          <button
            onClick={handleContinue}
            style={{
              background: "var(--accent)", color: "var(--bg)", border: "none",
              padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
            }}
          >
            {phase === "reveal" ? "See Why →" : roundNum < totalRounds ? "Next Round →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
