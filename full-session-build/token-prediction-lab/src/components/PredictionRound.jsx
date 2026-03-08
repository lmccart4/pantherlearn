// src/components/PredictionRound.jsx
import React, { useState, useMemo } from "react";

export default function PredictionRound({ round, roundNum, totalRounds, onComplete }) {
  const [picked, setPicked] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [temperature, setTemperature] = useState(1.0);

  // Apply temperature to probabilities for boss rounds
  const adjustedTokens = useMemo(() => {
    if (!round.hasTemperature) return round.tokens;

    // Temperature scaling: divide logits by temperature, then softmax
    const logits = round.tokens.map((t) => Math.log(t.prob + 0.001));
    const scaled = logits.map((l) => l / Math.max(temperature, 0.1));
    const maxScaled = Math.max(...scaled);
    const exps = scaled.map((s) => Math.exp(s - maxScaled));
    const sum = exps.reduce((a, b) => a + b, 0);
    const probs = exps.map((e) => e / sum);

    return round.tokens.map((t, i) => ({
      ...t,
      displayProb: Math.round(probs[i] * 100) / 100,
      isTopAdjusted: probs[i] === Math.max(...probs),
    }));
  }, [round, temperature]);

  const handlePick = (token) => {
    if (showResults) return;
    setPicked(token.word);
    setShowResults(true);
  };

  const handleContinue = () => {
    const topToken = round.tokens.find((t) => t.isTop);
    onComplete({
      picked,
      pickedTop: picked === topToken.word,
      pickedProb: round.tokens.find((t) => t.word === picked)?.prob || 0,
      topToken: topToken.word,
    });
  };

  const topToken = round.tokens.find((t) => t.isTop);

  return (
    <div
      className="slide-up"
      style={{
        maxWidth: "680px",
        margin: "0 auto",
        padding: "32px 24px",
      }}
    >
      {/* Round label */}
      <div
        style={{
          color: "var(--muted)",
          fontSize: "12px",
          fontFamily: "var(--font-mono)",
          marginBottom: "8px",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Round {roundNum} of {totalRounds}
      </div>

      {/* Partial sentence */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <div style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "8px" }}>
          Complete the sentence:
        </div>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 600,
            lineHeight: 1.5,
            fontFamily: "var(--font-mono)",
          }}
        >
          {round.partial}
          <span
            style={{
              display: "inline-block",
              width: "80px",
              height: "4px",
              background: showResults ? "var(--accent)" : "var(--muted)",
              borderRadius: "2px",
              marginLeft: "6px",
              verticalAlign: "middle",
              animation: showResults ? "none" : "pulse 1.5s ease infinite",
            }}
          />
        </div>
      </div>

      {/* Prompt */}
      {!showResults && (
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "14px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          What word do you think comes next? Pick the one you think is{" "}
          <strong style={{ color: "var(--accent)" }}>most likely</strong>.
        </p>
      )}

      {/* Temperature slider (boss rounds only) */}
      {round.hasTemperature && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "16px 20px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600 }}>
              🌡️ Temperature: {temperature.toFixed(1)}
            </span>
            <span style={{ color: "var(--muted)", fontSize: "12px" }}>
              {temperature < 0.5
                ? "Very Conservative"
                : temperature < 1.0
                ? "Conservative"
                : temperature < 1.5
                ? "Balanced"
                : temperature < 2.0
                ? "Creative"
                : "Very Creative"}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="2.5"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            style={{ width: "100%", accentColor: "var(--accent)" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              color: "var(--muted)",
              marginTop: "4px",
            }}
          >
            <span>🧊 Predictable</span>
            <span>🔥 Creative</span>
          </div>
        </div>
      )}

      {/* Token choices */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
        {(round.hasTemperature ? adjustedTokens : round.tokens).map((token) => {
          const isThisPicked = picked === token.word;
          const isTop = round.hasTemperature ? token.isTopAdjusted : token.isTop;
          const prob = round.hasTemperature ? token.displayProb : token.prob;

          let bg = "var(--surface)";
          let borderColor = "var(--border)";

          if (showResults) {
            if (isTop && isThisPicked) {
              bg = "rgba(52,211,153,0.1)";
              borderColor = "var(--success)";
            } else if (isTop) {
              bg = "rgba(52,211,153,0.06)";
              borderColor = "rgba(52,211,153,0.4)";
            } else if (isThisPicked) {
              bg = "rgba(248,113,113,0.08)";
              borderColor = "rgba(248,113,113,0.4)";
            }
          }

          return (
            <button
              key={token.word}
              onClick={() => handlePick(token)}
              disabled={showResults}
              style={{
                background: bg,
                border: `1.5px solid ${borderColor}`,
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "var(--text)",
                fontSize: "15px",
                fontWeight: isThisPicked ? 700 : 500,
                cursor: showResults ? "default" : "pointer",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Word */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  minWidth: "100px",
                  textAlign: "left",
                }}
              >
                {token.word}
              </span>

              {/* Probability bar (shown after picking) */}
              {showResults && (
                <div
                  style={{
                    flex: 1,
                    height: "20px",
                    background: "var(--border)",
                    borderRadius: "4px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      width: `${prob * 100}%`,
                      height: "100%",
                      background: isTop
                        ? "linear-gradient(90deg, rgba(52,211,153,0.4), rgba(52,211,153,0.7))"
                        : "linear-gradient(90deg, rgba(129,140,248,0.3), rgba(129,140,248,0.5))",
                      borderRadius: "4px",
                      transition: "width 0.8s ease",
                    }}
                  />
                </div>
              )}

              {/* Probability text */}
              {showResults && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: isTop ? "var(--success)" : "var(--text-dim)",
                    minWidth: "50px",
                    textAlign: "right",
                  }}
                >
                  {Math.round(prob * 100)}%
                </span>
              )}

              {/* Picked indicator */}
              {isThisPicked && (
                <span style={{ fontSize: "14px" }}>
                  {showResults && isTop ? "✅" : showResults ? "❌" : "👈"}
                </span>
              )}

              {/* Top indicator */}
              {showResults && isTop && !isThisPicked && (
                <span style={{ fontSize: "14px" }}>⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Insight (shown after picking) */}
      {showResults && (
        <div
          className="fade-in"
          style={{
            background: "rgba(129,140,248,0.06)",
            border: "1px solid rgba(129,140,248,0.2)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "6px" }}>
            💡 Insight
          </div>
          <p style={{ color: "var(--text-dim)", fontSize: "14px", lineHeight: 1.6 }}>
            {round.insight}
          </p>
          {round.concept && (
            <span
              style={{
                display: "inline-block",
                marginTop: "8px",
                padding: "2px 10px",
                borderRadius: "12px",
                fontSize: "11px",
                fontWeight: 600,
                background: "rgba(129,140,248,0.1)",
                color: "var(--accent)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              {round.concept.replace("_", " ")}
            </span>
          )}
        </div>
      )}

      {/* Feedback banner */}
      {showResults && (
        <div
          className="fade-in"
          style={{
            textAlign: "center",
            marginBottom: "16px",
            fontSize: "14px",
            fontWeight: 600,
            color: picked === topToken.word ? "var(--success)" : "var(--warning)",
          }}
        >
          {picked === topToken.word
            ? "🎯 You predicted like a language model!"
            : `Close! The model's top pick was "${topToken.word}" (${Math.round(topToken.prob * 100)}%)`}
        </div>
      )}

      {/* Continue button */}
      {showResults && (
        <div className="fade-in" style={{ textAlign: "center" }}>
          <button
            onClick={handleContinue}
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
              border: "none",
              padding: "12px 28px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {roundNum < totalRounds ? "Next Round →" : "See Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
