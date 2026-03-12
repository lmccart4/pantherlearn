// src/components/InvestigationRound.jsx
// Three phases:
// 1. PROMPT — student sees the AI prompt and clicks "Ask the AI"
// 2. INVESTIGATE — student highlights suspicious sentences in the pre-baked response
// 3. CLASSIFY — student labels each flagged sentence with a hallucination type
// 4. REVIEW — see how they did with ground-truth feedback

import React, { useState } from "react";
import { HALLUCINATION_TYPES } from "../data/scenarios";

export default function InvestigationRound({ scenario, roundNum, totalRounds, onComplete }) {
  const [phase, setPhase] = useState("prompt"); // prompt | investigate | classify | review
  const [flagged, setFlagged] = useState(new Set()); // indices of flagged sentences
  const [classifications, setClassifications] = useState({}); // { sentenceIdx: typeKey }

  const sentences = scenario.sentences;
  const hallucinatedIndices = new Set(
    sentences.map((s, i) => (s.hallucinated ? i : null)).filter(i => i !== null)
  );

  // Phase 1: "Ask the AI" — just transition to investigate with the baked response
  const handleAsk = () => {
    setPhase("investigate");
  };

  // Phase 2: Toggle sentence flagging
  const toggleFlag = (idx) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
        setClassifications((c) => {
          const copy = { ...c };
          delete copy[idx];
          return copy;
        });
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  // Phase 3: Classify a flagged sentence
  const handleClassify = (sentenceIdx, typeKey) => {
    setClassifications((prev) => ({ ...prev, [sentenceIdx]: typeKey }));
  };

  // Submit investigation
  const handleSubmit = () => {
    setPhase("review");
  };

  // Calculate score with ground truth and complete
  const handleContinue = () => {
    const maxPts = scenario.maxPoints;
    let pts = 0;

    // True positives: correctly flagged hallucinations
    const truePositives = [...flagged].filter(i => hallucinatedIndices.has(i));
    // False positives: flagged real facts
    const falsePositives = [...flagged].filter(i => !hallucinatedIndices.has(i));
    // Missed hallucinations
    const missed = [...hallucinatedIndices].filter(i => !flagged.has(i));

    // Detection score (50%): what fraction of hallucinations did they catch?
    const detectionRate = hallucinatedIndices.size > 0
      ? truePositives.length / hallucinatedIndices.size
      : 0;
    pts += Math.round(maxPts * 0.5 * detectionRate);

    // Precision score (25%): of what they flagged, how much was actually wrong?
    const precision = flagged.size > 0
      ? truePositives.length / flagged.size
      : 0;
    pts += Math.round(maxPts * 0.25 * precision);

    // Classification score (25%): did they correctly identify the type?
    let correctTypes = 0;
    for (const idx of truePositives) {
      const classified = classifications[idx];
      const actual = sentences[idx].type;
      if (classified === actual) correctTypes++;
    }
    const classificationRate = truePositives.length > 0
      ? correctTypes / truePositives.length
      : 0;
    pts += Math.round(maxPts * 0.25 * classificationRate);

    onComplete({
      points: Math.min(pts, maxPts),
      maxPoints: maxPts,
      correct: pts >= maxPts * 0.6,
      flaggedCount: flagged.size,
      totalSentences: sentences.length,
      truePositives: truePositives.length,
      falsePositives: falsePositives.length,
      missed: missed.length,
      totalHallucinations: hallucinatedIndices.size,
      classifications: [...flagged].map(idx => ({
        sentence: sentences[idx].text,
        type: classifications[idx],
      })),
    });
  };

  // Determine which hallucination types to show for classify phase
  const availableTypes = (() => {
    // Get types relevant to this scenario + a few common ones
    const scenarioTypes = new Set(
      sentences.filter(s => s.hallucinated).map(s => s.type)
    );
    const commonTypes = ["wrong_date", "invented_detail", "false_attribution", "fake_study"];
    const allRelevant = new Set([...scenarioTypes, ...commonTypes]);
    return HALLUCINATION_TYPES.filter(t => allRelevant.has(t.key)).slice(0, 6);
  })();

  return (
    <div className="slide-up" style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px" }}>
      {/* Round header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <div>
          <div style={{ color: "var(--muted)", fontSize: "12px", fontFamily: "var(--font-mono)", letterSpacing: "1px", textTransform: "uppercase" }}>
            Round {roundNum} of {totalRounds}
          </div>
          <h2 style={{ fontSize: "20px", fontWeight: 700, margin: "4px 0 0" }}>
            {scenario.title}
          </h2>
        </div>
        <span style={{
          padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
          background: scenario.difficulty === "hard" ? "rgba(248,113,113,0.15)" : scenario.difficulty === "medium" ? "rgba(251,191,36,0.12)" : "rgba(52,211,153,0.12)",
          color: scenario.difficulty === "hard" ? "var(--danger)" : scenario.difficulty === "medium" ? "var(--warning)" : "var(--success)",
          textTransform: "uppercase", letterSpacing: "0.5px",
        }}>
          {scenario.difficulty}
        </span>
      </div>

      {/* PHASE: PROMPT */}
      {phase === "prompt" && (
        <div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "14px", marginBottom: "12px" }}>
              A student asked the AI about <strong style={{ color: "var(--text)" }}>{scenario.topic}</strong>:
            </p>
            <div style={{
              padding: "12px 16px", borderRadius: "8px",
              background: "var(--bg)", border: "1px solid var(--border)",
              color: "var(--text)", fontSize: "14px", lineHeight: 1.6,
              fontStyle: "italic",
            }}>
              "{scenario.prompt}"
            </div>
          </div>
          <button
            onClick={handleAsk}
            style={{
              width: "100%", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
              background: "var(--accent)", color: "var(--bg)",
              border: "none", cursor: "pointer",
            }}
          >
            💬 See the AI's Response
          </button>
        </div>
      )}

      {/* PHASE: INVESTIGATE */}
      {phase === "investigate" && (
        <div>
          <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
              <strong style={{ color: "var(--danger)" }}>🔍 Investigation mode:</strong> Click on any sentence you think contains a hallucination (false or made-up information). Flag at least 1 suspicious sentence.
            </p>
          </div>

          {/* Hints */}
          <div style={{ marginBottom: "16px" }}>
            <div style={{ color: "var(--muted)", fontSize: "11px", fontWeight: 600, marginBottom: "6px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              💡 What to look for:
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {scenario.hints.map((hint, i) => (
                <span key={i} style={{
                  padding: "4px 10px", borderRadius: "14px", fontSize: "11px",
                  background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-dim)",
                }}>
                  {hint}
                </span>
              ))}
            </div>
          </div>

          {/* Sentences */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "20px" }}>
            <div style={{ lineHeight: 2 }}>
              {sentences.map((sentence, i) => {
                const isFlagged = flagged.has(i);
                return (
                  <span
                    key={i}
                    onClick={() => toggleFlag(i)}
                    style={{
                      cursor: "pointer",
                      padding: "2px 4px",
                      borderRadius: "4px",
                      background: isFlagged ? "rgba(248,113,113,0.15)" : "transparent",
                      borderBottom: isFlagged ? "2px solid var(--danger)" : "2px solid transparent",
                      color: isFlagged ? "var(--danger)" : "var(--text)",
                      fontWeight: isFlagged ? 600 : 400,
                      transition: "all 0.2s",
                      fontSize: "14px",
                    }}
                  >
                    {sentence.text}{" "}
                    {isFlagged && <span style={{ fontSize: "12px" }}>🚩</span>}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>
              {flagged.size} sentence{flagged.size !== 1 ? "s" : ""} flagged
            </span>
            <button
              onClick={() => setPhase("classify")}
              disabled={flagged.size === 0}
              style={{
                padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                background: flagged.size > 0 ? "var(--accent)" : "var(--border)",
                color: flagged.size > 0 ? "var(--bg)" : "var(--muted)",
                border: "none", cursor: flagged.size > 0 ? "pointer" : "default",
              }}
            >
              Classify Flagged Items →
            </button>
          </div>
        </div>
      )}

      {/* PHASE: CLASSIFY */}
      {phase === "classify" && (
        <div>
          <div style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
              <strong style={{ color: "var(--accent)" }}>🏷️ Classification:</strong> For each flagged sentence, select what TYPE of hallucination you think it is.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            {[...flagged].sort().map((idx) => (
              <div key={idx} style={{
                background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px",
              }}>
                <p style={{
                  fontSize: "14px", color: "var(--danger)", marginBottom: "12px",
                  borderLeft: "3px solid var(--danger)", paddingLeft: "10px",
                }}>
                  🚩 "{sentences[idx].text}"
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {availableTypes.map((type) => {
                    const isSelected = classifications[idx] === type.key;
                    return (
                      <button
                        key={type.key}
                        onClick={() => handleClassify(idx, type.key)}
                        style={{
                          padding: "6px 12px", borderRadius: "16px", fontSize: "12px",
                          background: isSelected ? `${type.color}20` : "var(--bg)",
                          border: `1.5px solid ${isSelected ? type.color : "var(--border)"}`,
                          color: isSelected ? type.color : "var(--text-dim)",
                          fontWeight: isSelected ? 700 : 500, cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {type.emoji} {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setPhase("investigate")}
              style={{
                flex: 1, padding: "12px", borderRadius: "8px", fontSize: "14px",
                background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-dim)",
                fontWeight: 600, cursor: "pointer",
              }}
            >
              ← Back to Highlight
            </button>
            <button
              onClick={handleSubmit}
              style={{
                flex: 2, padding: "12px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                background: "linear-gradient(135deg, #ef4444, #f87171)", color: "#fff",
                border: "none", cursor: "pointer",
              }}
            >
              Submit Investigation 🔍
            </button>
          </div>
        </div>
      )}

      {/* PHASE: REVIEW */}
      {phase === "review" && (
        <div className="fade-in">
          {/* Score summary */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)", marginBottom: "12px" }}>
              📋 Your Investigation Report
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--success)" }}>
                  {[...flagged].filter(i => hallucinatedIndices.has(i)).length}/{hallucinatedIndices.size}
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>Hallucinations Found</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--danger)" }}>
                  {[...flagged].filter(i => !hallucinatedIndices.has(i)).length}
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>False Alarms</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--accent)" }}>
                  {(() => {
                    const tp = [...flagged].filter(i => hallucinatedIndices.has(i));
                    let correct = 0;
                    for (const idx of tp) {
                      if (classifications[idx] === sentences[idx].type) correct++;
                    }
                    return `${correct}/${tp.length}`;
                  })()}
                </div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>Correctly Typed</div>
              </div>
            </div>

            {/* Sentence-by-sentence breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {sentences.map((sentence, idx) => {
                const wasFlagged = flagged.has(idx);
                const isHallucinated = sentence.hallucinated;
                const wasCorrectFlag = wasFlagged && isHallucinated;
                const wasFalseAlarm = wasFlagged && !isHallucinated;
                const wasMissed = !wasFlagged && isHallucinated;

                if (!wasCorrectFlag && !wasFalseAlarm && !wasMissed) return null;

                const borderColor = wasCorrectFlag ? "var(--success)" : wasFalseAlarm ? "var(--danger)" : "var(--warning)";
                const icon = wasCorrectFlag ? "✅" : wasFalseAlarm ? "❌" : "⚠️";
                const label = wasCorrectFlag ? "Correctly caught!" : wasFalseAlarm ? "This was actually true" : "Missed this one";

                return (
                  <div key={idx} style={{
                    padding: "10px 12px", background: "var(--bg)", borderRadius: "8px",
                    borderLeft: `3px solid ${borderColor}`, fontSize: "13px",
                  }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "start" }}>
                      <span style={{ flexShrink: 0 }}>{icon}</span>
                      <div>
                        <div style={{ color: "var(--text-dim)", marginBottom: "4px" }}>
                          {sentence.text.substring(0, 100)}{sentence.text.length > 100 ? "..." : ""}
                        </div>
                        <div style={{ fontSize: "11px", fontWeight: 600, color: borderColor, marginBottom: "2px" }}>
                          {label}
                        </div>
                        {isHallucinated && sentence.explanation && (
                          <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.5, marginTop: "4px" }}>
                            {sentence.explanation}
                          </div>
                        )}
                        {wasCorrectFlag && classifications[idx] && (
                          <div style={{ fontSize: "11px", marginTop: "2px" }}>
                            {classifications[idx] === sentence.type ? (
                              <span style={{ color: "var(--success)" }}>
                                Type: {HALLUCINATION_TYPES.find(t => t.key === sentence.type)?.label} ✓
                              </span>
                            ) : (
                              <div>
                                <span style={{ color: "var(--warning)" }}>
                                  You said: {HALLUCINATION_TYPES.find(t => t.key === classifications[idx])?.label} —
                                  Actual: {HALLUCINATION_TYPES.find(t => t.key === sentence.type)?.label}
                                </span>
                                <div style={{ color: "var(--muted)", marginTop: "2px", fontStyle: "italic" }}>
                                  {HALLUCINATION_TYPES.find(t => t.key === sentence.type)?.description}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Insight */}
          <div style={{ background: "rgba(129,140,248,0.06)", border: "1px solid rgba(129,140,248,0.15)", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px" }}>
            <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--accent)", marginBottom: "8px" }}>
              💡 Why This Matters
            </h4>
            <p style={{ color: "var(--text-dim)", fontSize: "13px", lineHeight: 1.6 }}>
              AI models generate text by predicting the most likely next word — they don't "know" facts or check their work.
              When a model encounters a gap in its training data, it fills it with something <em>plausible-sounding</em> rather
              than admitting uncertainty. This is why AI can state completely false information with total confidence.
              The only defense is critical thinking and fact-checking — exactly what you just practiced.
            </p>
          </div>

          <button
            onClick={handleContinue}
            style={{
              width: "100%", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
              background: "var(--accent)", color: "var(--bg)", border: "none", cursor: "pointer",
            }}
          >
            {roundNum < totalRounds ? "Next Investigation →" : "See Final Results →"}
          </button>
        </div>
      )}
    </div>
  );
}
