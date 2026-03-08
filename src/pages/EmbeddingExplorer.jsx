// src/pages/EmbeddingExplorer.jsx
// Main activity page for the Embedding Explorer ("The Word Vault").
// Students select a case, walk through 6 phases, and submit an engineer's report.

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { CASES, PHASES, DIFFICULTY_COLORS } from "../lib/embeddingCases";
import {
  createExploration,
  getStudentExplorations,
  updateExploration,
  deleteExploration,
  calculateScore,
} from "../lib/embeddingStore";
import { awardXP } from "../lib/gamification";

// ── Helpers ─────────────────────────────────────────────────────────────────

function SimilarityBadge({ score }) {
  const color = score >= 0.7 ? "var(--green, #10b981)" : score >= 0.4 ? "var(--amber)" : "var(--text3)";
  return (
    <span style={{
      fontSize: 11, fontFamily: "monospace", padding: "2px 8px", borderRadius: 20,
      background: color + "18", color,
    }}>
      {score.toFixed(2)}
    </span>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function EmbeddingExplorer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Core state
  const [selectedCase, setSelectedCase] = useState(null);
  const [exploration, setExploration] = useState(null);
  const [phase, setPhase] = useState("briefing");
  const [loading, setLoading] = useState(true);
  const [existingExplorations, setExistingExplorations] = useState([]);

  // Exploration data (synced to Firestore)
  const [discoveredInsights, setDiscoveredInsights] = useState([]);
  const [flaggedFindings, setFlaggedFindings] = useState([]);
  const [findingNotes, setFindingNotes] = useState({});
  const [identifiedFindings, setIdentifiedFindings] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const [summary, setSummary] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // MC analysis answers
  const [labAnswers, setLabAnswers] = useState({});
  const [insightAnswers, setInsightAnswers] = useState({});

  // UI state
  const [activeInsightQuestion, setActiveInsightQuestion] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [openSection, setOpenSection] = useState(0);

  const caseData = selectedCase || null;

  // ── Load existing explorations on mount ──
  useEffect(() => {
    if (!user?.uid || !courseId) return;
    (async () => {
      setLoading(true);
      try {
        const exps = await getStudentExplorations(db, courseId, user.uid);
        setExistingExplorations(exps);
      } catch (err) {
        console.error("Error loading explorations:", err);
      }
      setLoading(false);
    })();
  }, [user?.uid, courseId]);

  // ── Save helper ──
  async function save(updates) {
    if (!exploration?.id) return;
    try {
      await updateExploration(db, courseId, exploration.id, updates);
    } catch (err) {
      console.error("Error saving exploration:", err);
    }
  }

  // ── Case selection ──
  async function handleSelectCase(c) {
    const existing = existingExplorations.find((exp) => exp.caseId === c.id);
    if (existing) {
      setSelectedCase(c);
      setExploration(existing);
      setPhase(existing.currentPhase || "briefing");
      setDiscoveredInsights(existing.discoveredInsights || []);
      setFlaggedFindings(existing.flaggedFindings || []);
      setFindingNotes(existing.findingNotes || {});
      setIdentifiedFindings(existing.engineerReport?.identifiedFindings || []);
      setExplanations(existing.engineerReport?.explanations || []);
      setSummary(existing.engineerReport?.summary || "");
      setSubmitted(!!existing.score || existing.status === "submitted");
      setLabAnswers(existing.labAnswers || {});
      setInsightAnswers(existing.insightAnswers || {});
    } else {
      try {
        const exp = await createExploration(db, courseId, {
          studentId: user.uid,
          studentName: user.displayName || "Anonymous",
          caseId: c.id,
        });
        setSelectedCase(c);
        setExploration(exp);
        setPhase("briefing");
        setDiscoveredInsights([]);
        setFlaggedFindings([]);
        setFindingNotes({});
        setIdentifiedFindings([]);
        setExplanations([]);
        setSummary("");
        setSubmitted(false);
        setLabAnswers({});
        setInsightAnswers({});
      } catch (err) {
        console.error("Error creating exploration:", err);
      }
    }
  }

  // ── Restart exploration ──
  async function handleRestart(c) {
    const existing = existingExplorations.find((exp) => exp.caseId === c.id);
    if (!existing) return;
    try {
      await deleteExploration(db, courseId, existing.id);
      const exp = await createExploration(db, courseId, {
        studentId: user.uid,
        studentName: user.displayName || "Anonymous",
        caseId: c.id,
      });
      setExistingExplorations((prev) => prev.filter((i) => i.id !== existing.id));
      setSelectedCase(c);
      setExploration(exp);
      setPhase("briefing");
      setDiscoveredInsights([]);
      setFlaggedFindings([]);
      setFindingNotes({});
      setIdentifiedFindings([]);
      setExplanations([]);
      setSummary("");
      setSubmitted(false);
      setLabAnswers({});
      setInsightAnswers({});
    } catch (err) {
      console.error("Error restarting exploration:", err);
    }
  }

  // ── Phase navigation ──
  function handlePhaseChange(phaseId) {
    setPhase(phaseId);
    save({ currentPhase: phaseId });
  }

  // ── Insight discovery (gated by MC question) ──
  function handleInsightClick(insightId) {
    if (discoveredInsights.includes(insightId)) {
      setSelectedInsight((prev) => prev?.id === insightId ? null : caseData.insights.find((i) => i.id === insightId));
      setActiveInsightQuestion(null);
      return;
    }
    setActiveInsightQuestion(insightId);
    setSelectedInsight(null);
  }

  function handleInsightAnswer(insightId, choiceId) {
    const insight = caseData.insights.find((i) => i.id === insightId);
    if (!insight?.question) return;
    const isCorrect = choiceId === insight.question.correctAnswer;
    const existing = insightAnswers[insightId];
    const attempts = (existing?.attempts || 0) + 1;
    const entry = {
      answer: choiceId,
      correct: isCorrect,
      attempts,
      firstAnswer: existing?.firstAnswer || choiceId,
      answeredAt: new Date().toISOString(),
    };
    const next = { ...insightAnswers, [insightId]: entry };
    setInsightAnswers(next);
    save({ insightAnswers: next });

    if (isCorrect) {
      const nextInsights = [...discoveredInsights, insightId];
      setDiscoveredInsights(nextInsights);
      save({ discoveredInsights: nextInsights });
      setActiveInsightQuestion(null);
      setSelectedInsight(insight);
    }
  }

  // ── Lab MC answer ──
  function handleLabAnswer(sectionKey, choiceId, questionData) {
    const isCorrect = choiceId === questionData.correctAnswer;
    const existing = labAnswers[sectionKey];
    const attempts = (existing?.attempts || 0) + 1;
    const entry = {
      answer: choiceId,
      correct: isCorrect,
      attempts,
      firstAnswer: existing?.firstAnswer || choiceId,
      answeredAt: new Date().toISOString(),
    };
    const next = { ...labAnswers, [sectionKey]: entry };
    setLabAnswers(next);
    save({ labAnswers: next });
  }

  // ── Finding flagging ──
  function handleFlagFinding(insightId) {
    const next = flaggedFindings.includes(insightId)
      ? flaggedFindings.filter((id) => id !== insightId)
      : [...flaggedFindings, insightId];
    setFlaggedFindings(next);
    save({ flaggedFindings: next });
  }

  function handleNoteChange(insightId, note) {
    const next = { ...findingNotes, [insightId]: note };
    setFindingNotes(next);
    save({ findingNotes: next });
  }

  // ── Report toggles ──
  function handleToggleFinding(findingId) {
    const next = identifiedFindings.includes(findingId)
      ? identifiedFindings.filter((id) => id !== findingId)
      : [...identifiedFindings, findingId];
    setIdentifiedFindings(next);
    save({ engineerReport: { identifiedFindings: next, explanations, summary } });
  }

  function handleExplanationChange(index, text) {
    const next = [...explanations];
    next[index] = text;
    setExplanations(next);
    save({ engineerReport: { identifiedFindings, explanations: next, summary } });
  }

  function handleSummaryChange(text) {
    setSummary(text);
    save({ engineerReport: { identifiedFindings, explanations, summary: text } });
  }

  // ── Submit ──
  async function handleSubmit() {
    if (!exploration || !caseData) return;
    const expData = {
      discoveredInsights,
      flaggedFindings,
      findingNotes,
      labAnswers,
      insightAnswers,
      engineerReport: { identifiedFindings, explanations, summary },
    };
    const score = calculateScore(expData, caseData);
    try {
      await updateExploration(db, courseId, exploration.id, {
        ...expData,
        score,
        status: "submitted",
        submittedAt: new Date(),
      });
      if (!exploration.score) {
        await awardXP(user.uid, score.total, "embedding_exploration", courseId);
        for (const insId of discoveredInsights) {
          await awardXP(user.uid, 2, "embedding_insight", courseId);
        }
      }
      setSubmitted(true);
      setExploration((prev) => ({ ...prev, score }));
      setPhase("review");
    } catch (err) {
      console.error("Error submitting exploration:", err);
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <main className="page-wrapper">
        <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="spinner" />
        </div>
      </main>
    );
  }

  // ── Case Picker ──
  if (!selectedCase) {
    return (
      <main className="page-wrapper">
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 12 }}
          >
            ← Back
          </button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", margin: 0 }}>
            The Word Vault
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }}>
            Welcome to LexiCorp, junior engineer. Select a project to explore how AI turns words into numbers.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
          {CASES.map((c) => {
            const exp = existingExplorations.find((i) => i.caseId === c.id);
            const diff = DIFFICULTY_COLORS[c.difficulty];
            return (
              <div
                key={c.id}
                className="card"
                onClick={() => handleSelectCase(c)}
                style={{
                  padding: "24px 20px", cursor: "pointer",
                  border: exp?.score ? "1.5px solid var(--green, #10b981)" : "1.5px solid var(--border)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = exp?.score ? "var(--green, #10b981)" : "var(--border)"; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    background: c.color + "18", fontSize: 24,
                  }}>
                    {c.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: "var(--text)" }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>{c.subtitle}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                    background: diff.color + "18", color: diff.color,
                  }}>
                    {diff.label}
                  </span>
                </div>
                <p style={{
                  fontSize: 13, color: "var(--text2)", lineHeight: 1.5, margin: "0 0 14px",
                  display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {c.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "var(--text3)" }}>
                  <span>{c.totalInsights} insights &middot; {c.estimatedTime}</span>
                  {exp?.score ? (
                    <span style={{ color: "var(--green, #10b981)", fontWeight: 600 }}>
                      Score: {exp.score.total}/100
                    </span>
                  ) : exp ? (
                    <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ color: c.color, fontWeight: 600 }}>Continue</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm("Restart this project? All progress will be lost.")) handleRestart(c); }}
                        style={{
                          background: "none", border: "1px solid var(--border)", borderRadius: 6,
                          color: "var(--text3)", fontSize: 11, padding: "2px 8px", cursor: "pointer",
                        }}
                      >
                        Restart
                      </button>
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </main>
    );
  }

  // ── Active Exploration Layout ──
  const currentPhaseIdx = PHASES.findIndex((p) => p.id === phase);
  const score = exploration?.score || null;
  const accentColor = caseData.color;

  return (
    <main className="page-wrapper">
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <button
          onClick={() => { setSelectedCase(null); setExploration(null); }}
          style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 18, padding: 0 }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
            {caseData.emoji} {caseData.title}
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>{caseData.subtitle}</div>
        </div>
        <span style={{
          fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20,
          background: accentColor + "18", color: accentColor,
        }}>
          Insights: {discoveredInsights.length}/{caseData.totalInsights}
        </span>
      </div>

      {/* Phase Navigation */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: 24 }}>
        {PHASES.map((p, i) => {
          const isCurrent = p.id === phase;
          const isPast = i < currentPhaseIdx;
          return (
            <button
              key={p.id}
              onClick={() => handlePhaseChange(p.id)}
              style={{
                flex: "0 0 auto", padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: isCurrent ? 700 : 500, whiteSpace: "nowrap",
                background: isCurrent ? accentColor + "22" : "transparent",
                color: isCurrent ? accentColor : isPast ? "var(--text2)" : "var(--text3)",
                borderBottom: isCurrent ? `2px solid ${accentColor}` : isPast ? "2px solid var(--border)" : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {isPast ? "✓ " : ""}{p.emoji} {p.label}
            </button>
          );
        })}
      </div>

      {/* Phase Content */}
      {phase === "briefing" && <PhaseBriefing caseData={caseData} onNext={() => handlePhaseChange("dataroom")} />}
      {phase === "dataroom" && (
        <PhaseWordLab
          caseData={caseData} openSection={openSection} setOpenSection={setOpenSection}
          labAnswers={labAnswers} onLabAnswer={handleLabAnswer}
          onNext={() => handlePhaseChange("exploration")}
        />
      )}
      {phase === "exploration" && (
        <PhaseSpaceExplorer
          caseData={caseData} discoveredInsights={discoveredInsights}
          onInsightClick={handleInsightClick} onInsightAnswer={handleInsightAnswer}
          insightAnswers={insightAnswers} activeInsightQuestion={activeInsightQuestion}
          selectedInsight={selectedInsight}
          onCloseInsight={() => { setSelectedInsight(null); setActiveInsightQuestion(null); }}
          onNext={() => handlePhaseChange("evidence")}
        />
      )}
      {phase === "evidence" && (
        <PhasePatternLocker
          caseData={caseData} discoveredInsights={discoveredInsights}
          flaggedFindings={flaggedFindings} findingNotes={findingNotes}
          expandedItems={expandedItems} setExpandedItems={setExpandedItems}
          onFlag={handleFlagFinding} onNoteChange={handleNoteChange}
          onNext={() => handlePhaseChange("report")}
        />
      )}
      {phase === "report" && (
        <PhaseReport
          caseData={caseData} identifiedFindings={identifiedFindings}
          explanations={explanations} summary={summary} submitted={submitted}
          onToggleFinding={handleToggleFinding} onExplanationChange={handleExplanationChange}
          onSummaryChange={handleSummaryChange} onSubmit={handleSubmit}
        />
      )}
      {phase === "review" && (
        <PhaseReview caseData={caseData} score={score} discoveredInsights={discoveredInsights} submitted={submitted} />
      )}
    </div>
    </main>
  );
}

// ── Phase 1: Project Brief ─────────────────────────────────────────────────

function PhaseBriefing({ caseData, onNext }) {
  const sys = caseData.aiSystem;
  const accentColor = caseData.color;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accentColor, animation: "pulse 1.5s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: accentColor }}>
          Project Brief
        </span>
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>

      <div style={{
        padding: "16px 18px", borderRadius: 14, marginBottom: 20,
        border: `1.5px solid ${accentColor}`, background: accentColor + "0A",
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: accentColor, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          LexiCorp Internal Memo
        </div>
        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.65, margin: 0 }}>
          {caseData.description}
        </p>
      </div>

      <div className="card" style={{ padding: "20px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-display)" }}>
          AI System Profile
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
          {Object.entries(sys).map(([key, val]) => (
            <div key={key}>
              <div style={{ fontSize: 11, color: "var(--text3)", textTransform: "capitalize", marginBottom: 2 }}>
                {key.replace(/([A-Z])/g, " $1").trim()}
              </div>
              <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        padding: "16px 18px", borderRadius: 14, border: `1.5px solid ${accentColor}`,
        background: accentColor + "06", marginBottom: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: accentColor, marginBottom: 6 }}>
          Mission Objectives
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
          <li>Explore the Word Lab data and answer analysis questions</li>
          <li>Discover hidden insights about how embeddings work</li>
          <li>Flag key findings and write analysis notes</li>
          <li>Identify the most important patterns and principles</li>
          <li>Write an Engineer's Report with your conclusions</li>
        </ul>
      </div>

      <button
        onClick={onNext}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: accentColor, color: "#000", fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        Enter Word Lab →
      </button>
    </div>
  );
}

// ── LabQuestion Component ───────────────────────────────────────────────────

function LabQuestion({ sectionKey, questionData, answer, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  if (answer?.correct) {
    return (
      <div style={{
        margin: "12px 0 20px", padding: "14px 16px", borderRadius: 12,
        border: "1.5px solid var(--green, #10b981)", background: "rgba(16,185,129,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 14 }}>✅</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green, #10b981)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Analysis Complete
          </span>
        </div>
        <p style={{ fontSize: 12, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>
          {questionData.feedbackCorrect}
        </p>
      </div>
    );
  }

  function handleSelect(choiceId) {
    setSelected(choiceId);
    setShowFeedback(false);
  }

  function handleSubmit() {
    if (!selected) return;
    setShowFeedback(true);
    onAnswer(sectionKey, selected, questionData);
  }

  const isCorrect = selected === questionData.correctAnswer;
  const feedbackText = showFeedback
    ? (isCorrect ? questionData.feedbackCorrect : questionData.feedbackIncorrect)
    : null;

  return (
    <div style={{
      margin: "12px 0 20px", padding: "14px 16px", borderRadius: 12,
      border: "1.5px solid var(--border)", background: "var(--surface)",
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
        {questionData.prompt}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {questionData.choices.map((ch) => (
          <button
            key={ch.id}
            onClick={() => handleSelect(ch.id)}
            disabled={showFeedback && isCorrect}
            style={{
              textAlign: "left", padding: "10px 12px", borderRadius: 10,
              border: selected === ch.id ? "1.5px solid var(--cyan)" : "1.5px solid var(--border)",
              background: selected === ch.id ? "rgba(34,211,238,0.06)" : "transparent",
              color: "var(--text2)", fontSize: 12, cursor: "pointer", transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontWeight: 700, marginRight: 6 }}>{ch.id.toUpperCase()}.</span>
            {ch.text}
          </button>
        ))}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: selected ? "var(--cyan)" : "var(--surface2)",
            color: selected ? "#000" : "var(--text3)",
            fontWeight: 700, fontSize: 12, cursor: selected ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          Check Answer
        </button>
      )}

      {showFeedback && (
        <div style={{
          marginTop: 10, padding: "12px 14px", borderRadius: 10,
          border: `1.5px solid ${isCorrect ? "var(--green, #10b981)" : "var(--red, #ef4444)"}`,
          background: isCorrect ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: isCorrect ? "var(--green, #10b981)" : "var(--red, #ef4444)", marginBottom: 4 }}>
            {isCorrect ? "✅ Correct!" : "❌ Not quite"}
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>
            {feedbackText}
          </p>
          {!isCorrect && (
            <button
              onClick={() => { setSelected(null); setShowFeedback(false); }}
              style={{
                marginTop: 8, padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border)",
                background: "transparent", color: "var(--text2)", fontSize: 11, fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Phase 2: Word Lab ───────────────────────────────────────────────────────

function PhaseWordLab({ caseData, openSection, setOpenSection, labAnswers, onLabAnswer, onNext }) {
  const sections = caseData.labSections;
  const accentColor = caseData.color;

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 6px" }}>
        Word Lab
      </h2>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>
        Analyze each data section and answer the analysis questions.
      </p>

      {sections.map((section, idx) => {
        const isOpen = openSection === idx;
        const hasAnswer = labAnswers[section.key]?.correct;
        return (
          <div key={section.key} className="card" style={{ marginBottom: 12, overflow: "hidden" }}>
            <button
              onClick={() => setOpenSection(isOpen ? -1 : idx)}
              style={{
                width: "100%", padding: "16px 18px", background: "none", border: "none",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 8, fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: hasAnswer ? "rgba(16,185,129,0.12)" : accentColor + "18",
                  color: hasAnswer ? "var(--green, #10b981)" : accentColor,
                }}>
                  {hasAnswer ? "✓" : idx + 1}
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{section.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{section.subtitle}</div>
                </div>
              </div>
              <span style={{ color: "var(--text3)", fontSize: 14 }}>{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
              <div style={{ padding: "0 18px 18px" }}>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginTop: 0, marginBottom: 16 }}>
                  {section.content}
                </p>

                {/* Data Visualization */}
                <LabVisualization section={section} accentColor={accentColor} />

                {/* MC Question */}
                <LabQuestion
                  sectionKey={section.key}
                  questionData={section.question}
                  answer={labAnswers[section.key]}
                  onAnswer={onLabAnswer}
                />
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={onNext}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none", marginTop: 12,
          background: accentColor, color: "#000", fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        Open Space Explorer →
      </button>
    </div>
  );
}

// ── Lab Visualization Renderer ──────────────────────────────────────────────

function LabVisualization({ section, accentColor }) {
  const { vizType, data } = section;

  if (vizType === "numberLine") {
    return (
      <div style={{ margin: "0 0 12px", overflowX: "auto" }}>
        <div style={{
          display: "flex", gap: 8, flexWrap: "wrap", padding: "14px 12px", borderRadius: 10,
          background: "var(--bg)", border: "1px solid var(--border)",
        }}>
          {data.map((d) => (
            <div key={d.word} style={{
              padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
              background: "var(--surface)", textAlign: "center", minWidth: 80,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{d.word}</div>
              <div style={{ fontSize: 11, color: accentColor, fontFamily: "monospace" }}>{d.value.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{d.group}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (vizType === "scatter2D") {
    const groupColors = { emotion: "var(--cyan)", tool: "var(--amber)", royalty: "var(--purple, #b08eff)", animal: "var(--green, #10b981)" };
    return (
      <div style={{ margin: "0 0 12px" }}>
        <div style={{
          position: "relative", width: "100%", height: 260, borderRadius: 10,
          background: "var(--bg)", border: "1px solid var(--border)", overflow: "hidden",
        }}>
          {data.map((d) => (
            <div key={d.word} style={{
              position: "absolute", left: `${d.x * 90 + 2}%`, bottom: `${d.y * 85 + 5}%`,
              transform: "translate(-50%, 50%)", textAlign: "center",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: groupColors[d.group] || "var(--text3)",
                margin: "0 auto 2px",
              }} />
              <div style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600, whiteSpace: "nowrap" }}>{d.word}</div>
            </div>
          ))}
          <div style={{ position: "absolute", bottom: 4, left: 8, fontSize: 10, color: "var(--text3)" }}>Dimension 1 →</div>
          <div style={{ position: "absolute", top: 8, left: 8, fontSize: 10, color: "var(--text3)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>Dimension 2 →</div>
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "center" }}>
          {Object.entries(groupColors).map(([group, color]) => (
            <div key={group} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text3)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              {group}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (vizType === "dimensionBars") {
    return (
      <div style={{ margin: "0 0 12px", padding: "14px 12px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
        {data.map((d) => (
          <div key={d.label} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>{d.label}</div>
            {[
              { label: "Synonym Accuracy", value: d.synonymAccuracy, color: "var(--cyan)" },
              { label: "Analogy Accuracy", value: d.analogyAccuracy, color: "var(--purple, #b08eff)" },
              { label: "Cluster Purity", value: d.clusterPurity, color: "var(--amber)" },
            ].map((metric) => (
              <div key={metric.label} style={{ marginBottom: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginBottom: 2 }}>
                  <span>{metric.label}</span>
                  <span>{metric.value}%</span>
                </div>
                <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                  <div style={{ width: `${metric.value}%`, height: "100%", background: metric.color, borderRadius: 3, transition: "width 0.5s" }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (vizType === "polysemyCards") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "0 0 12px" }}>
        {data.map((d) => (
          <div key={d.word} style={{ padding: "12px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>"{d.word}"</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
              {d.meanings.map((m, i) => (
                <span key={i} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 4, background: accentColor + "18", color: accentColor }}>
                  {m}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "var(--text3)" }}>{d.avgPosition}</div>
          </div>
        ))}
      </div>
    );
  }

  if (vizType === "clusterScatter") {
    const groupColors = { animals: "var(--green, #10b981)", vehicles: "var(--cyan)", professions: "var(--purple, #b08eff)", food: "var(--amber)" };
    return (
      <div style={{ margin: "0 0 12px" }}>
        <div style={{
          position: "relative", width: "100%", height: 300, borderRadius: 10,
          background: "var(--bg)", border: "1px solid var(--border)", overflow: "hidden",
        }}>
          {data.map((d) => (
            <div key={d.word} style={{
              position: "absolute", left: `${d.x * 85 + 5}%`, bottom: `${d.y * 80 + 8}%`,
              transform: "translate(-50%, 50%)", textAlign: "center",
            }}>
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: groupColors[d.group] || "var(--text3)",
                margin: "0 auto 2px",
              }} />
              <div style={{ fontSize: 10, color: "var(--text2)", fontWeight: 600, whiteSpace: "nowrap" }}>{d.word}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 14, marginTop: 8, justifyContent: "center", flexWrap: "wrap" }}>
          {Object.entries(groupColors).map(([group, color]) => (
            <div key={group} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text3)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
              {group}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (vizType === "analogyCards") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "0 0 12px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 8, fontFamily: "monospace" }}>
              {d.equation.map((part, j) => (
                <span key={j} style={{
                  color: ["+", "\u2212", "="].includes(part) ? accentColor : "var(--text)",
                  fontWeight: ["+", "\u2212", "="].includes(part) ? 400 : 700,
                  margin: "0 3px",
                }}>
                  {part}
                </span>
              ))}
            </div>
            <p style={{ fontSize: 12, color: "var(--text2)", margin: "0 0 8px", lineHeight: 1.5 }}>
              {d.explanation}
            </p>
            <div style={{ display: "flex", gap: 6 }}>
              {d.topResults.map((r) => (
                <span key={r.word} style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 6,
                  background: r.word === d.result ? accentColor + "18" : "var(--surface2)",
                  color: r.word === d.result ? accentColor : "var(--text3)",
                  fontWeight: r.word === d.result ? 700 : 500,
                }}>
                  {r.word} ({r.score})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (vizType === "similarityTable") {
    return (
      <div style={{ margin: "0 0 12px", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, background: "var(--bg)", borderRadius: 10 }}>
          <thead>
            <tr>
              {["Word 1", "Word 2", "Similarity", ""].map((h) => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: "var(--text3)", fontWeight: 600, borderBottom: "1px solid var(--border)", fontSize: 11 }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr key={i}>
                <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--text)" }}>{d.word1}</td>
                <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--text)" }}>{d.word2}</td>
                <td style={{ padding: "8px 12px" }}><SimilarityBadge score={d.score} /></td>
                <td style={{ padding: "8px 12px" }}>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 4,
                    background: d.category === "high" ? "rgba(16,185,129,0.12)" : d.category === "medium" ? "rgba(245,166,35,0.12)" : "var(--surface2)",
                    color: d.category === "high" ? "var(--green, #10b981)" : d.category === "medium" ? "var(--amber)" : "var(--text3)",
                    fontWeight: 600,
                  }}>
                    {d.category}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (vizType === "applicationCards") {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, margin: "0 0 12px" }}>
        {data.map((d) => (
          <div key={d.app} style={{ padding: "14px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 20 }}>{d.icon}</span>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{d.app}</div>
            </div>
            <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5, margin: "0 0 6px" }}>{d.how}</p>
            <div style={{ fontSize: 10, color: accentColor, fontStyle: "italic" }}>{d.embedRole}</div>
          </div>
        ))}
      </div>
    );
  }

  if (vizType === "trainingDataStats") {
    return (
      <div style={{ margin: "0 0 12px" }}>
        {/* Source breakdown */}
        <div style={{ padding: "14px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)", marginBottom: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Training Data Sources</div>
          {data.sources.map((s) => (
            <div key={s.name} style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text2)", marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <span>{s.pct}%</span>
              </div>
              <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                <div style={{ width: `${s.pct}%`, height: "100%", background: accentColor, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{s.bias}</div>
            </div>
          ))}
        </div>
        {/* Gender pronoun stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
          {[
            { label: "Male pronouns", value: `${data.genderStats.malePronouns}%`, color: "var(--cyan)" },
            { label: "Female pronouns", value: `${data.genderStats.femalePronouns}%`, color: "var(--purple, #b08eff)" },
            { label: "Non-binary", value: `${data.genderStats.nonBinaryPronouns}%`, color: "var(--text3)" },
          ].map((s) => (
            <div key={s.label} style={{ padding: "10px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "var(--font-display)" }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "var(--text3)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (vizType === "genderBars") {
    return (
      <div style={{ margin: "0 0 12px", padding: "14px 14px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
        {data.map((d) => {
          const pct = ((d.genderScore + 1) / 2) * 100; // normalize -1..1 to 0..100
          const barColor = d.direction === "male" ? "var(--cyan)" : d.direction === "female" ? "var(--purple, #b08eff)" : "var(--text3)";
          return (
            <div key={d.profession} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 90, fontSize: 11, fontWeight: 600, color: "var(--text)", textAlign: "right" }}>{d.profession}</div>
              <div style={{ flex: 1, height: 10, background: "var(--surface2)", borderRadius: 5, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: "var(--text3)" }} />
                <div style={{
                  position: "absolute",
                  left: d.genderScore > 0 ? "50%" : `${pct}%`,
                  width: `${Math.abs(d.genderScore) * 50}%`,
                  height: "100%", background: barColor, borderRadius: 5,
                }} />
              </div>
              <div style={{ width: 40, fontSize: 10, color: "var(--text3)", fontFamily: "monospace" }}>
                {d.genderScore > 0 ? "+" : ""}{d.genderScore.toFixed(2)}
              </div>
            </div>
          );
        })}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginTop: 8, paddingLeft: 100 }}>
          <span>← Female</span>
          <span>Male →</span>
        </div>
      </div>
    );
  }

  if (vizType === "biasedAnalogyCards") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 12px" }}>
        {data.map((d, i) => (
          <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--bg)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 6, fontFamily: "monospace" }}>
              {d.analogy}
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 6 }}>
              <div>
                <span style={{ color: "var(--text3)" }}>Expected: </span>
                <span style={{ color: "var(--green, #10b981)", fontWeight: 600 }}>{d.expected}</span>
              </div>
              <div>
                <span style={{ color: "var(--text3)" }}>Actual: </span>
                <span style={{ color: "var(--red, #ef4444)", fontWeight: 600 }}>{d.actual}</span>
              </div>
            </div>
            <span style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 4,
              background: "rgba(239,68,68,0.12)", color: "var(--red, #ef4444)", fontWeight: 600,
            }}>
              {d.biasType}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (vizType === "harmScenarioCards") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8, margin: "0 0 12px" }}>
        {data.map((d) => (
          <div key={d.scenario} style={{
            padding: "16px 16px", borderRadius: 10, background: "var(--bg)",
            border: `1px solid ${d.severity === "critical" ? "rgba(239,68,68,0.3)" : "var(--border)"}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{d.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{d.scenario}</div>
                <span style={{
                  fontSize: 10, padding: "1px 8px", borderRadius: 4,
                  background: d.severity === "critical" ? "rgba(239,68,68,0.12)" : "rgba(245,166,35,0.12)",
                  color: d.severity === "critical" ? "var(--red, #ef4444)" : "var(--amber)",
                  fontWeight: 600,
                }}>
                  {d.severity}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, margin: "0 0 6px" }}>{d.description}</p>
            <div style={{ fontSize: 11, marginTop: 6 }}>
              <span style={{ color: "var(--text3)" }}>Impact: </span>
              <span style={{ color: "var(--red, #ef4444)", fontWeight: 600 }}>{d.impact}</span>
            </div>
            <div style={{ fontSize: 11, marginTop: 2 }}>
              <span style={{ color: "var(--text3)" }}>Affected: </span>
              <span style={{ color: "var(--text2)" }}>{d.affectedGroup}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

// ── Insight Question Card ───────────────────────────────────────────────────

function InsightQuestionCard({ insight, answer, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const q = insight.question;
  if (!q) return null;

  function handleSubmit() {
    if (!selected) return;
    setShowFeedback(true);
    onAnswer(insight.id, selected);
  }

  const isCorrect = selected === q.correctAnswer;
  const feedbackText = showFeedback
    ? (isCorrect ? q.feedbackCorrect : (q.feedbackWrong?.[selected] || "Not quite. Try thinking about it differently."))
    : null;

  return (
    <div style={{
      padding: "18px 18px", borderRadius: 14,
      border: "1.5px solid var(--border)", background: "var(--surface)",
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--amber)", marginBottom: 8 }}>
        Insight Challenge
      </div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>
        {q.prompt}
      </div>

      {insight.evidence && (
        <div style={{
          padding: "10px 12px", borderRadius: 8, fontSize: 11, color: "var(--text2)",
          background: "var(--bg)", border: "1px solid var(--border)", marginBottom: 12, lineHeight: 1.5, fontStyle: "italic",
        }}>
          {insight.evidence}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10 }}>
        {q.choices.map((ch) => (
          <button
            key={ch.id}
            onClick={() => { setSelected(ch.id); setShowFeedback(false); }}
            disabled={showFeedback && isCorrect}
            style={{
              textAlign: "left", padding: "10px 12px", borderRadius: 10,
              border: selected === ch.id ? "1.5px solid var(--cyan)" : "1.5px solid var(--border)",
              background: selected === ch.id ? "rgba(34,211,238,0.06)" : "transparent",
              color: "var(--text2)", fontSize: 12, cursor: "pointer", transition: "all 0.15s",
              fontFamily: "inherit",
            }}
          >
            <span style={{ fontWeight: 700, marginRight: 6 }}>{ch.id.toUpperCase()}.</span>
            {ch.text}
          </button>
        ))}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            padding: "8px 20px", borderRadius: 8, border: "none",
            background: selected ? "var(--cyan)" : "var(--surface2)",
            color: selected ? "#000" : "var(--text3)",
            fontWeight: 700, fontSize: 12, cursor: selected ? "pointer" : "default",
          }}
        >
          Submit Answer
        </button>
      )}

      {showFeedback && (
        <div style={{
          marginTop: 10, padding: "12px 14px", borderRadius: 10,
          border: `1.5px solid ${isCorrect ? "var(--green, #10b981)" : "var(--red, #ef4444)"}`,
          background: isCorrect ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: isCorrect ? "var(--green, #10b981)" : "var(--red, #ef4444)", marginBottom: 4 }}>
            {isCorrect ? "✅ Insight Unlocked!" : "❌ Not quite"}
          </div>
          <p style={{ fontSize: 12, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>
            {feedbackText}
          </p>
          {!isCorrect && (
            <button
              onClick={() => { setSelected(null); setShowFeedback(false); }}
              style={{
                marginTop: 8, padding: "6px 14px", borderRadius: 6, border: "1px solid var(--border)",
                background: "transparent", color: "var(--text2)", fontSize: 11, fontWeight: 600, cursor: "pointer",
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Phase 3: Space Explorer ─────────────────────────────────────────────────

function PhaseSpaceExplorer({ caseData, discoveredInsights, onInsightClick, onInsightAnswer, insightAnswers, activeInsightQuestion, selectedInsight, onCloseInsight, onNext }) {
  const accentColor = caseData.color;
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 6px" }}>
        Space Explorer
      </h2>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 16 }}>
        Discover insights about embedding space. Click a locked card to reveal an insight challenge.
      </p>
      <div style={{
        padding: "8px 14px", borderRadius: 10, marginBottom: 20,
        background: accentColor + "12", display: "inline-block",
        fontSize: 13, fontWeight: 700, color: accentColor,
      }}>
        {discoveredInsights.length}/{caseData.totalInsights} insights discovered
      </div>

      {/* Insight Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {caseData.insights.map((insight) => {
          const discovered = discoveredInsights.includes(insight.id);
          const isActive = activeInsightQuestion === insight.id;
          const isSelected = selectedInsight?.id === insight.id;
          return (
            <div
              key={insight.id}
              className="card"
              onClick={() => onInsightClick(insight.id)}
              style={{
                padding: "16px 16px", cursor: "pointer",
                border: discovered ? "1.5px solid var(--green, #10b981)" : isActive ? `1.5px solid ${accentColor}` : "1.5px solid var(--border)",
                background: discovered ? "rgba(16,185,129,0.04)" : "transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 4,
                  background: discovered ? "rgba(16,185,129,0.12)" : "var(--surface2)",
                  color: discovered ? "var(--green, #10b981)" : "var(--text3)",
                  fontWeight: 600,
                }}>
                  {insight.category}
                </span>
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  color: discovered ? "var(--green, #10b981)" : accentColor,
                }}>
                  {discovered ? "✓" : `${insight.points} pts`}
                </span>
              </div>
              {discovered ? (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{insight.title}</div>
                  <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>{insight.description}</p>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", marginBottom: 4 }}>
                    🔒 Locked Insight
                  </div>
                  <p style={{ fontSize: 11, color: "var(--text3)", lineHeight: 1.5, margin: 0 }}>
                    Answer the challenge to unlock this insight.
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Question or Selected Insight Detail */}
      {activeInsightQuestion && !discoveredInsights.includes(activeInsightQuestion) && (
        <div style={{ marginBottom: 20 }}>
          <InsightQuestionCard
            insight={caseData.insights.find((i) => i.id === activeInsightQuestion)}
            answer={insightAnswers[activeInsightQuestion]}
            onAnswer={onInsightAnswer}
          />
        </div>
      )}

      {selectedInsight && (
        <div className="card" style={{ padding: "18px 18px", marginBottom: 20, border: "1.5px solid var(--green, #10b981)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{selectedInsight.title}</div>
            <button
              onClick={onCloseInsight}
              style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16 }}
            >
              ×
            </button>
          </div>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, margin: "0 0 10px" }}>
            {selectedInsight.description}
          </p>
          <div style={{
            padding: "10px 12px", borderRadius: 8, background: "var(--bg)",
            border: "1px solid var(--border)", fontSize: 12, color: "var(--text2)", lineHeight: 1.5,
            fontStyle: "italic",
          }}>
            {selectedInsight.evidence}
          </div>
        </div>
      )}

      <button
        onClick={onNext}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: accentColor, color: "#000", fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        Open Pattern Locker →
      </button>
    </div>
  );
}

// ── Phase 4: Pattern Locker ─────────────────────────────────────────────────

function PhasePatternLocker({ caseData, discoveredInsights, flaggedFindings, findingNotes, expandedItems, setExpandedItems, onFlag, onNoteChange, onNext }) {
  const accentColor = caseData.color;
  const insightsToShow = caseData.insights.filter((i) => discoveredInsights.includes(i.id));

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 6px" }}>
        Pattern Locker
      </h2>
      <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 20 }}>
        Review your discovered insights. Flag key findings and add analysis notes.
      </p>

      {insightsToShow.length === 0 ? (
        <div className="card" style={{ padding: "32px 20px", textAlign: "center", color: "var(--text3)", marginBottom: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🔒</div>
          <p style={{ fontSize: 13, margin: 0 }}>No insights discovered yet. Go back to the Space Explorer to unlock insights.</p>
        </div>
      ) : (
        insightsToShow.map((insight) => {
          const isFlagged = flaggedFindings.includes(insight.id);
          const isExpanded = expandedItems.has(insight.id);
          return (
            <div key={insight.id} className="card" style={{
              padding: "16px 18px", marginBottom: 10,
              border: isFlagged ? `1.5px solid ${accentColor}` : "1.5px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{insight.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{insight.category} &middot; {insight.points} pts</div>
                </div>
                <button
                  onClick={() => {
                    const next = new Set(expandedItems);
                    isExpanded ? next.delete(insight.id) : next.add(insight.id);
                    setExpandedItems(next);
                  }}
                  style={{ background: "none", border: "none", color: "var(--text3)", fontSize: 12, cursor: "pointer" }}
                >
                  {isExpanded ? "▲" : "▼"}
                </button>
              </div>

              {isExpanded && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6, margin: "0 0 10px" }}>
                    {insight.description}
                  </p>
                  <div style={{
                    padding: "10px 12px", borderRadius: 8, background: "var(--bg)", border: "1px solid var(--border)",
                    fontSize: 11, color: "var(--text2)", lineHeight: 1.5, marginBottom: 10, fontStyle: "italic",
                  }}>
                    {insight.evidence}
                  </div>

                  <textarea
                    placeholder="Write your analysis notes about this insight..."
                    value={findingNotes[insight.id] || ""}
                    onChange={(e) => onNoteChange(insight.id, e.target.value)}
                    style={{
                      width: "100%", minHeight: 60, padding: "10px 12px", borderRadius: 8,
                      border: "1px solid var(--border)", background: "var(--surface)",
                      color: "var(--text)", fontSize: 12, resize: "vertical", fontFamily: "inherit",
                      marginBottom: 10,
                    }}
                  />

                  <button
                    onClick={() => onFlag(insight.id)}
                    style={{
                      padding: "6px 14px", borderRadius: 8,
                      border: isFlagged ? `1.5px solid ${accentColor}` : "1.5px solid var(--border)",
                      background: isFlagged ? accentColor + "15" : "transparent",
                      color: isFlagged ? accentColor : "var(--text2)",
                      fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {isFlagged ? "✓ Flagged" : "Flag as Key Finding"}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>
          {flaggedFindings.length} findings flagged
        </span>
        <button
          onClick={onNext}
          style={{
            padding: "12px 24px", borderRadius: 12, border: "none",
            background: accentColor, color: "#000", fontWeight: 700, fontSize: 14,
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          Write Engineer's Report →
        </button>
      </div>
    </div>
  );
}

// ── Phase 5: Engineer's Report ──────────────────────────────────────────────

function PhaseReport({ caseData, identifiedFindings, explanations, summary, submitted, onToggleFinding, onExplanationChange, onSummaryChange, onSubmit }) {
  const accentColor = caseData.color;

  if (submitted) {
    return (
      <div className="card" style={{ padding: "32px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>✅</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--green, #10b981)", marginBottom: 6 }}>
          Report Submitted
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)" }}>
          Your engineer's report has been submitted. Check the Project Review tab for your score.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 16px" }}>
        Engineer's Report
      </h2>

      {/* Key Findings */}
      <div className="card" style={{ padding: "18px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
          Key Findings
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {caseData.findingsToIdentify.map((f) => {
            const active = identifiedFindings.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => onToggleFinding(f.id)}
                style={{
                  padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: active ? accentColor + "18" : "var(--surface2)",
                  color: active ? accentColor : "var(--text2)",
                  fontWeight: active ? 700 : 500, fontSize: 12, transition: "all 0.2s",
                }}
              >
                {active ? "✓ " : ""}{f.name}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 10, marginBottom: 0 }}>
          Select all findings you identified during your exploration.
        </p>
      </div>

      {/* Explanations per finding */}
      {identifiedFindings.length > 0 && (
        <div className="card" style={{ padding: "18px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
            Explain Your Findings
          </div>
          {identifiedFindings.map((findingId, idx) => {
            const finding = caseData.findingsToIdentify.find((f) => f.id === findingId);
            if (!finding) return null;
            return (
              <div key={findingId} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: accentColor, marginBottom: 6 }}>
                  {finding.name}
                </div>
                <textarea
                  placeholder={`Explain this finding in your own words...`}
                  value={explanations[idx] || ""}
                  onChange={(e) => onExplanationChange(idx, e.target.value)}
                  style={{
                    width: "100%", minHeight: 70, padding: "10px 12px", borderRadius: 10,
                    border: "1px solid var(--border)", background: "var(--surface)",
                    color: "var(--text)", fontSize: 13, resize: "vertical", fontFamily: "inherit",
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Executive Summary */}
      <div className="card" style={{ padding: "18px 18px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
          Executive Summary
        </div>
        <textarea
          placeholder="Summarize your key findings, what you learned about embeddings, and any recommendations..."
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          style={{
            width: "100%", minHeight: 120, padding: "12px 14px", borderRadius: 10,
            border: "1px solid var(--border)", background: "var(--surface)",
            color: "var(--text)", fontSize: 13, resize: "vertical", lineHeight: 1.6,
            fontFamily: "inherit",
          }}
        />
      </div>

      <button
        onClick={onSubmit}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: "var(--red, #ef4444)", color: "#fff", fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        🔒 Submit Report
      </button>
    </div>
  );
}

// ── Phase 6: Project Review ─────────────────────────────────────────────────

function PhaseReview({ caseData, score, discoveredInsights, submitted }) {
  const accentColor = caseData.color;

  if (!score) {
    return (
      <div className="card" style={{ padding: "32px 20px", textAlign: "center", color: "var(--text3)" }}>
        Submit your engineer's report to see results.
      </div>
    );
  }

  const missedInsights = caseData.insights.filter((i) => !discoveredInsights.includes(i.id));

  const breakdown = [
    { label: "Insights Found", value: score.insightsFound, max: 25 },
    { label: "Analysis Accuracy", value: score.analysisAccuracy, max: 20 },
    { label: "Key Findings", value: score.findingsId, max: 25 },
    { label: "Evidence Quality", value: score.evidenceQuality, max: 10 },
    { label: "Engineer's Report", value: score.engineerReport, max: 20 },
  ];

  return (
    <div>
      <div className="card" style={{ padding: "28px 20px", textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>
          {score.total}<span style={{ fontSize: 20, color: "var(--text3)" }}>/100</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: accentColor, marginTop: 6,
          padding: "4px 14px", borderRadius: 20, display: "inline-block",
          background: accentColor + "15",
        }}>
          +{score.xpEarned} XP Earned
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="card" style={{ padding: "18px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-display)" }}>
          Score Breakdown
        </div>
        {breakdown.map((b) => (
          <div key={b.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)", marginBottom: 4 }}>
              <span>{b.label}</span>
              <span style={{ fontWeight: 600 }}>{b.value}/{b.max}</span>
            </div>
            <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4 }}>
              <div style={{
                width: `${(b.value / b.max) * 100}%`, height: "100%", borderRadius: 4,
                background: b.value >= b.max * 0.7 ? "var(--green, #10b981)" : b.value >= b.max * 0.4 ? accentColor : "var(--red, #ef4444)",
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Missed Insights */}
      {missedInsights.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
            Missed Insights
          </div>
          {missedInsights.map((insight) => (
            <div
              key={insight.id}
              className="card"
              style={{ padding: "14px 16px", marginBottom: 8, border: `1.5px solid ${accentColor}` }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {insight.title}
              </div>
              <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>
                {insight.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
