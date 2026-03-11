// src/components/ChallengeRound.jsx
import React, { useState } from "react";
import AttentionDisplay from "./AttentionDisplay";

export default function ChallengeRound({ scenario, roundNum, totalRounds, onComplete }) {
  const [phase, setPhase] = useState("meaning"); // meaning | predict | reveal | insight
  const [meaningPick, setMeaningPick] = useState(null);
  const [selectedWords, setSelectedWords] = useState([]);

  const handleMeaning = (m) => {
    setMeaningPick(m);
    setPhase("predict");
  };

  const handleWordClick = (idx) => {
    if (idx === scenario.targetIdx) return;
    setSelectedWords((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : prev.length >= 3 ? prev : [...prev, idx]
    );
  };

  const handleSubmitPrediction = () => setPhase("reveal");

  const handleContinue = () => {
    if (phase === "reveal") {
      setPhase("insight");
    } else {
      const meaningCorrect = meaningPick === scenario.meaning;
      const topIdxs = scenario.topAttenders.map((a) => a.wordIdx != null ? a.wordIdx : scenario.words.indexOf(a.word));
      const correctPicks = selectedWords.filter((idx) => topIdxs.includes(idx));

      const meaningPts = meaningCorrect ? 6 : 0;
      const predictionPts = correctPicks.length * 3; // 3 pts each, max 9

      onComplete({
        points: Math.min(meaningPts + predictionPts, 15),
        maxPoints: 15,
        correct: meaningCorrect && correctPicks.length >= 2,
        meaningCorrect,
        predictionCorrect: correctPicks.length,
      });
    }
  };

  const topWordIdxs = scenario.topAttenders.map((a) => a.wordIdx != null ? a.wordIdx : scenario.words.indexOf(a.word));
  const meaningCorrect = meaningPick === scenario.meaning;

  return (
    <div className="slide-up" style={{ maxWidth: "700px", margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ color: "var(--muted)", fontSize: "12px", fontFamily: "var(--font-mono)", marginBottom: "12px", letterSpacing: "1px" }}>
        ROUND {roundNum} OF {totalRounds} — CHALLENGE ⚡
      </div>

      {/* Sentence display */}
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "16px" }}>
        {phase === "meaning" && (
          <div style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "8px" }}>
            What does <strong style={{ color: "var(--accent)" }}>"{scenario.words[scenario.targetIdx]}"</strong> mean in this sentence?
          </div>
        )}
        {phase === "predict" && (
          <div style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "8px" }}>
            {meaningCorrect ? "✅ Correct!" : `The actual meaning is "${scenario.meaning}".`} Now predict: which 3 words does attention focus on?
          </div>
        )}

        {phase === "meaning" || phase === "predict" ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", padding: "20px 0" }}>
            {scenario.words.map((word, i) => {
              const isTarget = i === scenario.targetIdx;
              const isSelected = phase === "predict" && selectedWords.includes(i);

              return (
                <button
                  key={`${word}-${i}`}
                  onClick={() => phase === "predict" && handleWordClick(i)}
                  disabled={phase === "meaning" || isTarget}
                  style={{
                    padding: "8px 14px", borderRadius: "8px",
                    fontFamily: "var(--font-mono)", fontSize: "16px",
                    background: isTarget ? "rgba(129,140,248,0.15)" : isSelected ? "rgba(52,211,153,0.15)" : "var(--bg)",
                    border: `1.5px solid ${isTarget ? "var(--accent)" : isSelected ? "var(--success)" : "var(--border)"}`,
                    color: isTarget ? "var(--accent)" : isSelected ? "var(--success)" : "var(--text)",
                    fontWeight: isTarget || isSelected ? 700 : 400,
                    cursor: phase === "predict" && !isTarget ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}
                >
                  {word}
                </button>
              );
            })}
          </div>
        ) : (
          <AttentionDisplay scenario={scenario} showWeights highlightedWords={selectedWords} />
        )}
      </div>

      {/* Meaning choices */}
      {phase === "meaning" && (
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          {[scenario.meaning, scenario.wrongMeaning].sort().map((m) => (
            <button
              key={m}
              onClick={() => handleMeaning(m)}
              style={{
                flex: 1, padding: "14px", borderRadius: "10px",
                background: "var(--surface)", border: "1.5px solid var(--border)",
                color: "var(--text)", fontSize: "14px", fontWeight: 500, transition: "all 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = "var(--accent)")}
              onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {/* Predict submit */}
      {phase === "predict" && (
        <div style={{ textAlign: "center" }}>
          <button
            onClick={handleSubmitPrediction}
            disabled={selectedWords.length === 0}
            style={{
              background: selectedWords.length > 0 ? "var(--accent)" : "var(--border)",
              color: selectedWords.length > 0 ? "var(--bg)" : "var(--muted)",
              border: "none", padding: "12px 28px", borderRadius: "8px",
              fontSize: "14px", fontWeight: 700,
            }}
          >
            Check Prediction ({selectedWords.length} selected)
          </button>
        </div>
      )}

      {/* Reveal feedback */}
      {phase === "reveal" && (
        <div className="fade-in" style={{ textAlign: "center", marginBottom: "16px" }}>
          {(() => {
            const correctPicks = selectedWords.filter((idx) => topWordIdxs.includes(idx));
            return (
              <div style={{ fontSize: "14px", fontWeight: 600, color: correctPicks.length >= 2 ? "var(--success)" : "var(--warning)" }}>
                {meaningCorrect
                  ? `Meaning: ✅ | Prediction: ${correctPicks.length}/3 key words`
                  : `Meaning: ❌ | Prediction: ${correctPicks.length}/3 key words`}
              </div>
            );
          })()}
        </div>
      )}

      {/* Insight */}
      {phase === "insight" && (
        <div className="fade-in" style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "10px" }}>💡 Why this sentence is tricky:</h4>
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

      {(phase === "reveal" || phase === "insight") && (
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
