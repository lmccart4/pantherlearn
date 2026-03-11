// src/components/PredictRound.jsx
import React, { useState } from "react";
import AttentionDisplay from "./AttentionDisplay";

export default function PredictRound({ scenario, roundNum, totalRounds, onComplete }) {
  const [phase, setPhase] = useState("predict"); // predict | reveal | insight
  const [selectedWords, setSelectedWords] = useState([]);

  const handleWordClick = (idx) => {
    if (phase !== "predict" || idx === scenario.targetIdx) return;
    setSelectedWords((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleSubmit = () => {
    setPhase("reveal");
  };

  const handleContinue = () => {
    if (phase === "reveal") {
      setPhase("insight");
    } else {
      // Score: how many of the top 3 attenders did they pick?
      const topWordIdxs = scenario.topAttenders.map((a) =>
        a.wordIdx != null ? a.wordIdx : scenario.words.indexOf(a.word)
      );
      const correctPicks = selectedWords.filter((idx) => topWordIdxs.includes(idx));
      const points = correctPicks.length * 4; // 4 pts each, max 12

      onComplete({
        points: Math.min(points, 12),
        maxPoints: 12,
        correct: correctPicks.length >= 2,
        picked: selectedWords.map((i) => scenario.words[i]),
        correctPicks: correctPicks.length,
      });
    }
  };

  const topWordIdxs = scenario.topAttenders.map((a) => scenario.words.indexOf(a.word));

  return (
    <div className="slide-up" style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ color: "var(--muted)", fontSize: "12px", fontFamily: "var(--font-mono)", marginBottom: "12px", letterSpacing: "1px" }}>
        ROUND {roundNum} OF {totalRounds} — PREDICT
      </div>

      {/* Instructions */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        <div style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "4px" }}>
          The word <strong style={{ color: "var(--accent)" }}>"{scenario.words[scenario.targetIdx]}"</strong> means: <strong style={{ color: "var(--success)" }}>{scenario.meaning}</strong>
        </div>
        {phase === "predict" && (
          <p style={{ color: "var(--text-dim)", fontSize: "13px", marginTop: "8px" }}>
            Click the <strong>3 words</strong> you think the attention mechanism focuses on most to determine this meaning. Then hit "Check My Prediction."
          </p>
        )}
      </div>

      {/* Sentence — clickable in predict mode, arrows in reveal mode */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
        {phase === "predict" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", padding: "20px 0" }}>
            {scenario.words.map((word, i) => {
              const isTarget = i === scenario.targetIdx;
              const isSelected = selectedWords.includes(i);

              return (
                <button
                  key={`${word}-${i}`}
                  onClick={() => handleWordClick(i)}
                  disabled={isTarget}
                  style={{
                    padding: "8px 16px", borderRadius: "8px",
                    fontFamily: "var(--font-mono)", fontSize: "16px",
                    background: isTarget ? "rgba(129,140,248,0.15)" : isSelected ? "rgba(52,211,153,0.15)" : "var(--bg)",
                    border: `1.5px solid ${isTarget ? "var(--accent)" : isSelected ? "var(--success)" : "var(--border)"}`,
                    color: isTarget ? "var(--accent)" : isSelected ? "var(--success)" : "var(--text)",
                    fontWeight: isTarget || isSelected ? 700 : 400,
                    cursor: isTarget ? "default" : "pointer",
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  {word}
                  {isTarget && (
                    <span style={{
                      position: "absolute", top: "-8px", right: "-8px",
                      fontSize: "10px", background: "var(--accent)", color: "var(--bg)",
                      borderRadius: "50%", width: "18px", height: "18px",
                      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                    }}>?</span>
                  )}
                  {isSelected && (
                    <span style={{
                      position: "absolute", top: "-8px", right: "-8px",
                      fontSize: "10px", background: "var(--success)", color: "var(--bg)",
                      borderRadius: "50%", width: "18px", height: "18px",
                      display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                    }}>✓</span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <AttentionDisplay scenario={scenario} showWeights highlightedWords={selectedWords} />
        )}
      </div>

      {/* Submit prediction */}
      {phase === "predict" && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSubmit}
            disabled={selectedWords.length === 0}
            style={{
              background: selectedWords.length > 0 ? "var(--accent)" : "var(--border)",
              color: selectedWords.length > 0 ? "var(--bg)" : "var(--muted)",
              border: "none", padding: "12px 28px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 700, cursor: selectedWords.length > 0 ? "pointer" : "default",
            }}
          >
            Check My Prediction ({selectedWords.length} selected)
          </button>
        </div>
      )}

      {/* Reveal feedback */}
      {phase === "reveal" && (
        <div className="fade-in">
          {(() => {
            const correctPicks = selectedWords.filter((idx) => topWordIdxs.includes(idx));
            return (
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <div style={{
                  fontSize: "14px", fontWeight: 600,
                  color: correctPicks.length >= 2 ? "var(--success)" : correctPicks.length >= 1 ? "var(--warning)" : "var(--danger)",
                }}>
                  {correctPicks.length === 3
                    ? "🎯 Perfect prediction! You got all 3!"
                    : correctPicks.length === 2
                    ? "✅ Great job! You identified 2 out of 3 key words."
                    : correctPicks.length === 1
                    ? "Close! You found 1 of the 3 key context words."
                    : "Not quite — look at the arrows to see which words actually mattered."}
                </div>
                <p style={{ color: "var(--text-dim)", fontSize: "12px", marginTop: "4px" }}>
                  Your picks are highlighted in <span style={{ color: "var(--success)" }}>green</span>. The actual top attention words are shown by the arrows.
                </p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Insight */}
      {phase === "insight" && (
        <div className="fade-in" style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "10px" }}>
            💡 The attention mechanism focused on:
          </h4>
          {scenario.topAttenders.map((a, i) => (
            <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", fontSize: "13px" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--accent)", minWidth: "100px" }}>
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

      {phase !== "predict" && (
        <div className="fade-in" style={{ textAlign: "center" }}>
          <button
            onClick={handleContinue}
            style={{
              background: "var(--accent)", color: "var(--bg)", border: "none",
              padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
            }}
          >
            {phase === "reveal" ? "See Details →" : roundNum < totalRounds ? "Next Round →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
