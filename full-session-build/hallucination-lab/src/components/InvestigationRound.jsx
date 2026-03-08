// src/components/InvestigationRound.jsx
// Three phases:
// 1. CHAT — student asks the AI a question (or uses the suggested prompt)
// 2. INVESTIGATE — student highlights suspicious sentences in the response
// 3. CLASSIFY — student labels each flagged sentence with a hallucination type
// 4. REVIEW — see how they did + insight

import React, { useState, useCallback } from "react";
import { sendChat } from "../lib/pantherlearn";
import { HALLUCINATION_TYPES } from "../data/scenarios";

export default function InvestigationRound({ scenario, roundNum, totalRounds, onComplete }) {
  const [phase, setPhase] = useState("chat"); // chat | loading | investigate | classify | review
  const [chatInput, setChatInput] = useState(scenario.suggestedPrompt);
  const [aiResponse, setAiResponse] = useState("");
  const [sentences, setSentences] = useState([]);
  const [flagged, setFlagged] = useState(new Set()); // indices of flagged sentences
  const [classifications, setClassifications] = useState({}); // { sentenceIdx: typeKey }
  const [error, setError] = useState(null);

  // Split response into sentences for highlighting
  const splitSentences = (text) => {
    // Split on sentence boundaries but keep the delimiters
    return text
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);
  };

  // Phase 1: Send the chat
  const handleSend = async () => {
    if (!chatInput.trim()) return;
    setPhase("loading");
    setError(null);

    try {
      const response = await sendChat(scenario.systemPrompt, [
        { role: "user", content: chatInput.trim() },
      ]);
      setAiResponse(response);
      setSentences(splitSentences(response));
      setPhase("investigate");
    } catch (err) {
      console.error("Chat error:", err);
      setError(err.message);
      setPhase("chat");
    }
  };

  // Phase 2: Toggle sentence flagging
  const toggleFlag = (idx) => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
        // Also remove classification
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

  // Calculate score and complete
  const handleContinue = () => {
    // Score based on:
    // - Number of sentences flagged (did they flag a reasonable amount?)
    // - Quality of classifications
    // Since we can't perfectly auto-grade which sentences are actually hallucinated
    // (the AI generates different responses each time), we score on:
    // 1. Participation: did they flag at least 2 sentences? (5 pts)
    // 2. Restraint: did they flag fewer than 60% of sentences? (5 pts) — shows discernment
    // 3. Classification variety: did they use different types? (5 pts)
    // 4. Reflection quality is handled by the short answer in PantherLearn

    const maxPts = scenario.maxPoints;
    let pts = 0;

    // Participation: flagged at least 2
    if (flagged.size >= 2) pts += Math.round(maxPts * 0.35);
    else if (flagged.size === 1) pts += Math.round(maxPts * 0.15);

    // Discernment: didn't flag everything (shows they can distinguish)
    const flagPct = sentences.length > 0 ? flagged.size / sentences.length : 0;
    if (flagPct > 0.1 && flagPct < 0.6) pts += Math.round(maxPts * 0.3);
    else if (flagPct <= 0.1 || flagPct >= 0.6) pts += Math.round(maxPts * 0.1);

    // Classification: used at least 2 different types
    const uniqueTypes = new Set(Object.values(classifications));
    if (uniqueTypes.size >= 2) pts += Math.round(maxPts * 0.35);
    else if (uniqueTypes.size === 1) pts += Math.round(maxPts * 0.15);

    onComplete({
      points: Math.min(pts, maxPts),
      maxPoints: maxPts,
      correct: pts >= maxPts * 0.6,
      flaggedCount: flagged.size,
      totalSentences: sentences.length,
      classifications: Object.entries(classifications).map(([idx, type]) => ({
        sentence: sentences[idx],
        type,
      })),
    });
  };

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

      {/* PHASE: CHAT */}
      {phase === "chat" && (
        <div>
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "14px", marginBottom: "12px" }}>
              Ask the AI about <strong style={{ color: "var(--text)" }}>{scenario.topic}</strong>. You can use the suggested prompt or write your own:
            </p>
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              style={{
                width: "100%", minHeight: "80px", padding: "12px", borderRadius: "8px",
                background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)",
                fontSize: "14px", fontFamily: "var(--font-sans)", resize: "vertical", lineHeight: 1.6,
              }}
            />
          </div>
          {error && (
            <div style={{ color: "var(--danger)", fontSize: "13px", marginBottom: "12px", padding: "8px 12px", background: "rgba(248,113,113,0.08)", borderRadius: "8px" }}>
              ⚠ {error} — Try again.
            </div>
          )}
          <button
            onClick={handleSend}
            disabled={!chatInput.trim()}
            style={{
              width: "100%", padding: "14px", borderRadius: "10px", fontSize: "15px", fontWeight: 700,
              background: chatInput.trim() ? "var(--accent)" : "var(--border)",
              color: chatInput.trim() ? "var(--bg)" : "var(--muted)",
              border: "none", cursor: chatInput.trim() ? "pointer" : "default",
            }}
          >
            💬 Ask the AI
          </button>
        </div>
      )}

      {/* PHASE: LOADING */}
      {phase === "loading" && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: "32px", animation: "pulse 1.5s ease infinite" }}>🤖</div>
          <p style={{ color: "var(--muted)", marginTop: "12px" }}>The AI is thinking...</p>
        </div>
      )}

      {/* PHASE: INVESTIGATE */}
      {phase === "investigate" && (
        <div>
          <div style={{ background: "rgba(248,113,113,0.06)", border: "1px solid rgba(248,113,113,0.15)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
              <strong style={{ color: "var(--danger)" }}>🔍 Investigation mode:</strong> Click on any sentence you think contains a hallucination (false or made-up information). Flag at least 2 suspicious sentences.
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
                    {sentence}{" "}
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
                border: "none",
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
                  🚩 "{sentences[idx]}"
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {HALLUCINATION_TYPES.filter((t) =>
                    scenario.hallucinationTypes.includes(t.key) ||
                    // Always show a few common types
                    ["wrong_date", "invented_detail", "false_attribution", "fake_study"].includes(t.key)
                  )
                    .slice(0, 6)
                    .map((type) => {
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
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--accent)", marginBottom: "12px" }}>
              📋 Your Investigation Report
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--danger)" }}>{flagged.size}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>Sentences Flagged</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--accent)" }}>{Object.keys(classifications).length}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>Classified</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--success)" }}>{new Set(Object.values(classifications)).size}</div>
                <div style={{ fontSize: "11px", color: "var(--muted)" }}>Types Identified</div>
              </div>
            </div>

            {/* Show flagged items with classifications */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[...flagged].sort().map((idx) => {
                const typeKey = classifications[idx];
                const type = HALLUCINATION_TYPES.find((t) => t.key === typeKey);
                return (
                  <div key={idx} style={{
                    display: "flex", alignItems: "start", gap: "8px", padding: "8px 12px",
                    background: "var(--bg)", borderRadius: "8px", fontSize: "13px",
                    borderLeft: `3px solid ${type?.color || "var(--muted)"}`,
                  }}>
                    <span style={{ flexShrink: 0 }}>{type?.emoji || "🚩"}</span>
                    <div>
                      <div style={{ color: "var(--text-dim)", marginBottom: "2px" }}>
                        {sentences[idx]?.substring(0, 80)}{sentences[idx]?.length > 80 ? "..." : ""}
                      </div>
                      <span style={{ fontSize: "11px", color: type?.color || "var(--muted)", fontWeight: 600 }}>
                        {type?.label || "Unclassified"}
                      </span>
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
