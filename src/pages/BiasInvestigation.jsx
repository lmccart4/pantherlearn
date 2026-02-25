// src/pages/BiasInvestigation.jsx
// Main activity page for the AI Bias Detective, integrated into PantherLearn.
// Students select a case, walk through 6 investigation phases, and submit a bias report.

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { CASES, PHASES, DIFFICULTY_COLORS } from "../lib/biasCases";
import {
  createInvestigation,
  getStudentInvestigations,
  updateInvestigation,
  calculateScore,
} from "../lib/biasStore";
import { awardXP } from "../lib/gamification";

// ── Helpers ─────────────────────────────────────────────────────────────────

function ResultBadge({ result }) {
  const isGood = result === "ACCEPTED" || result === "APPROVED";
  return (
    <span style={{
      fontSize: 10, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.05em",
      padding: "2px 8px", borderRadius: 20,
      background: isGood ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
      color: isGood ? "var(--green, #10b981)" : "var(--red, #ef4444)",
    }}>
      {result}
    </span>
  );
}

function formatCurrency(val) {
  if (typeof val !== "number") return val;
  return val >= 1000 ? `$${(val / 1000).toFixed(0)}k` : `$${val}`;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function BiasInvestigation() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Core state
  const [selectedCase, setSelectedCase] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [phase, setPhase] = useState("briefing");
  const [loading, setLoading] = useState(true);
  const [existingInvestigations, setExistingInvestigations] = useState([]);

  // Investigation data (synced to Firestore)
  const [discoveredClues, setDiscoveredClues] = useState([]);
  const [flaggedEvidence, setFlaggedEvidence] = useState([]);
  const [evidenceNotes, setEvidenceNotes] = useState({});
  const [biases, setBiases] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [summary, setSummary] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // MC analysis answers
  const [dataRoomAnswers, setDataRoomAnswers] = useState({});
  const [clueAnswers, setClueAnswers] = useState({});

  // UI state
  const [selectedClue, setSelectedClue] = useState(null);
  const [activeClueQuestion, setActiveClueQuestion] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [openChart, setOpenChart] = useState(0);

  const caseData = selectedCase || null;

  // ── Load existing investigations on mount ──
  useEffect(() => {
    if (!user?.uid || !courseId) return;
    (async () => {
      setLoading(true);
      try {
        const invs = await getStudentInvestigations(db, courseId, user.uid);
        setExistingInvestigations(invs);
      } catch (err) {
        console.error("Error loading investigations:", err);
      }
      setLoading(false);
    })();
  }, [user?.uid, courseId]);

  // ── Save helper ──
  async function save(updates) {
    if (!investigation?.id) return;
    try {
      await updateInvestigation(db, courseId, investigation.id, updates);
    } catch (err) {
      console.error("Error saving investigation:", err);
    }
  }

  // ── Case selection ──
  async function handleSelectCase(c) {
    const existing = existingInvestigations.find((inv) => inv.caseId === c.id);
    if (existing) {
      // Resume
      setSelectedCase(c);
      setInvestigation(existing);
      setPhase(existing.currentPhase || "briefing");
      setDiscoveredClues(existing.discoveredClues || []);
      setFlaggedEvidence(existing.flaggedEvidence || []);
      setEvidenceNotes(existing.evidenceNotes || {});
      setBiases(existing.biasReport?.identifiedBiases || []);
      setMitigations(existing.biasReport?.mitigations || []);
      setSummary(existing.biasReport?.summary || "");
      setSubmitted(!!existing.score || existing.status === "submitted");
      setDataRoomAnswers(existing.dataRoomAnswers || {});
      setClueAnswers(existing.clueAnswers || {});
    } else {
      // Create new
      try {
        const inv = await createInvestigation(db, courseId, {
          studentId: user.uid,
          studentName: user.displayName || "Anonymous",
          caseId: c.id,
        });
        setSelectedCase(c);
        setInvestigation(inv);
        setPhase("briefing");
        setDiscoveredClues([]);
        setFlaggedEvidence([]);
        setEvidenceNotes({});
        setBiases([]);
        setMitigations([]);
        setSummary("");
        setSubmitted(false);
        setDataRoomAnswers({});
        setClueAnswers({});
      } catch (err) {
        console.error("Error creating investigation:", err);
      }
    }
  }

  // ── Phase navigation ──
  function handlePhaseChange(phaseId) {
    setPhase(phaseId);
    save({ currentPhase: phaseId });
  }

  // ── Clue discovery (now gated by MC question) ──
  function handleClueClick(clueId) {
    if (discoveredClues.includes(clueId)) {
      // Already discovered — toggle expanded view
      setSelectedClue((prev) => prev?.id === clueId ? null : caseData.clues.find((c) => c.id === clueId));
      setActiveClueQuestion(null);
      return;
    }
    // Show the clue question
    setActiveClueQuestion(clueId);
    setSelectedClue(null);
  }

  function handleClueAnswer(clueId, choiceId) {
    const clue = caseData.clues.find((c) => c.id === clueId);
    if (!clue?.question) return;
    const isCorrect = choiceId === clue.question.correctAnswer;
    const existing = clueAnswers[clueId];
    const attempts = (existing?.attempts || 0) + 1;
    const entry = {
      answer: choiceId,
      correct: isCorrect,
      attempts,
      firstAnswer: existing?.firstAnswer || choiceId,
      answeredAt: new Date().toISOString(),
    };
    const next = { ...clueAnswers, [clueId]: entry };
    setClueAnswers(next);
    save({ clueAnswers: next });

    if (isCorrect) {
      // Discover the clue
      const nextClues = [...discoveredClues, clueId];
      setDiscoveredClues(nextClues);
      save({ discoveredClues: nextClues });
      setActiveClueQuestion(null);
      setSelectedClue(clue);
    }
  }

  // ── Data Room MC answer ──
  function handleDataRoomAnswer(sectionKey, choiceId, questionData) {
    const isCorrect = choiceId === questionData.correctAnswer;
    const existing = dataRoomAnswers[sectionKey];
    const attempts = (existing?.attempts || 0) + 1;
    const entry = {
      answer: choiceId,
      correct: isCorrect,
      attempts,
      firstAnswer: existing?.firstAnswer || choiceId,
      answeredAt: new Date().toISOString(),
    };
    const next = { ...dataRoomAnswers, [sectionKey]: entry };
    setDataRoomAnswers(next);
    save({ dataRoomAnswers: next });
  }

  // ── Evidence flagging ──
  function handleFlagEvidence(clueId) {
    const next = flaggedEvidence.includes(clueId)
      ? flaggedEvidence.filter((id) => id !== clueId)
      : [...flaggedEvidence, clueId];
    setFlaggedEvidence(next);
    save({ flaggedEvidence: next });
  }

  function handleNoteChange(clueId, note) {
    const next = { ...evidenceNotes, [clueId]: note };
    setEvidenceNotes(next);
    save({ evidenceNotes: next });
  }

  // ── Bias toggling ──
  function handleToggleBias(biasId) {
    const next = biases.includes(biasId)
      ? biases.filter((id) => id !== biasId)
      : [...biases, biasId];
    setBiases(next);
    save({ biasReport: { identifiedBiases: next, mitigations, summary } });
  }

  function handleMitigationChange(index, text) {
    const next = [...mitigations];
    next[index] = text;
    setMitigations(next);
    save({ biasReport: { identifiedBiases: biases, mitigations: next, summary } });
  }

  function handleSummaryChange(text) {
    setSummary(text);
    save({ biasReport: { identifiedBiases: biases, mitigations, summary: text } });
  }

  // ── Submit ──
  async function handleSubmit() {
    if (!investigation || !caseData) return;
    const invData = {
      discoveredClues,
      flaggedEvidence,
      evidenceNotes,
      dataRoomAnswers,
      clueAnswers,
      biasReport: { identifiedBiases: biases, mitigations, summary },
    };
    const score = calculateScore(invData, caseData);
    try {
      await updateInvestigation(db, courseId, investigation.id, {
        ...invData,
        score,
        status: "submitted",
        submittedAt: new Date(),
      });
      // Award XP only if not already scored
      if (!investigation.score) {
        await awardXP(user.uid, score.total, "bias_investigation", courseId);
        for (const clueId of discoveredClues) {
          await awardXP(user.uid, 2, "bias_clue", courseId);
        }
      }
      setSubmitted(true);
      setInvestigation((prev) => ({ ...prev, score }));
      setPhase("review");
    } catch (err) {
      console.error("Error submitting investigation:", err);
    }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ minHeight: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="spinner" />
      </div>
    );
  }

  // ── Case Picker ──
  if (!selectedCase) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 12 }}
          >
            ← Back
          </button>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--text)", margin: 0 }}>
            AI Bias Detective
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }}>
            Select a case to investigate...
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
          {CASES.map((c) => {
            const inv = existingInvestigations.find((i) => i.caseId === c.id);
            const diff = DIFFICULTY_COLORS[c.difficulty];
            return (
              <div
                key={c.id}
                className="card"
                onClick={() => handleSelectCase(c)}
                style={{
                  padding: "24px 20px", cursor: "pointer",
                  border: inv?.score ? "1.5px solid var(--green, #10b981)" : "1.5px solid var(--border)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = c.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = inv?.score ? "var(--green, #10b981)" : "var(--border)"; e.currentTarget.style.transform = "none"; }}
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
                  <span>{c.totalClues} clues &middot; {c.estimatedTime}</span>
                  {inv?.score ? (
                    <span style={{ color: "var(--green, #10b981)", fontWeight: 600 }}>
                      Score: {inv.score.total}/100
                    </span>
                  ) : inv ? (
                    <span style={{ color: "var(--amber)", fontWeight: 600 }}>Continue</span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Active Investigation Layout ──
  const currentPhaseIdx = PHASES.findIndex((p) => p.id === phase);
  const score = investigation?.score || null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <button
          onClick={() => { setSelectedCase(null); setInvestigation(null); }}
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
          background: "rgba(245,166,35,0.12)", color: "var(--amber)",
        }}>
          Clues: {discoveredClues.length}/{caseData.totalClues}
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
                background: isCurrent ? "rgba(245,166,35,0.15)" : "transparent",
                color: isCurrent ? "var(--amber)" : isPast ? "var(--text2)" : "var(--text3)",
                borderBottom: isCurrent ? "2px solid var(--amber)" : isPast ? "2px solid var(--border)" : "2px solid transparent",
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
        <PhaseDataRoom
          caseData={caseData} openChart={openChart} setOpenChart={setOpenChart}
          dataRoomAnswers={dataRoomAnswers} onDataRoomAnswer={handleDataRoomAnswer}
          onNext={() => handlePhaseChange("investigation")}
        />
      )}
      {phase === "investigation" && (
        <PhaseInvestigation
          caseData={caseData} discoveredClues={discoveredClues}
          onClueClick={handleClueClick} onClueAnswer={handleClueAnswer}
          clueAnswers={clueAnswers} activeClueQuestion={activeClueQuestion}
          selectedClue={selectedClue}
          onCloseClue={() => { setSelectedClue(null); setActiveClueQuestion(null); }}
          onNext={() => handlePhaseChange("evidence")}
        />
      )}
      {phase === "evidence" && (
        <PhaseEvidence
          caseData={caseData} discoveredClues={discoveredClues}
          flaggedEvidence={flaggedEvidence} evidenceNotes={evidenceNotes}
          expandedItems={expandedItems} setExpandedItems={setExpandedItems}
          onFlag={handleFlagEvidence} onNoteChange={handleNoteChange}
          onNext={() => handlePhaseChange("report")}
        />
      )}
      {phase === "report" && (
        <PhaseReport
          caseData={caseData} biases={biases} mitigations={mitigations}
          summary={summary} submitted={submitted}
          onToggleBias={handleToggleBias} onMitigationChange={handleMitigationChange}
          onSummaryChange={handleSummaryChange} onSubmit={handleSubmit}
        />
      )}
      {phase === "review" && (
        <PhaseReview caseData={caseData} score={score} discoveredClues={discoveredClues} submitted={submitted} dataRoomAnswers={dataRoomAnswers} clueAnswers={clueAnswers} />
      )}
    </div>
  );
}

// ── Phase 1: Briefing ───────────────────────────────────────────────────────

function PhaseBriefing({ caseData, onNext }) {
  const sys = caseData.aiSystem;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red, #ef4444)", animation: "pulse 1.5s infinite" }} />
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--red, #ef4444)" }}>
          Case Briefing
        </span>
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>

      <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.65, marginBottom: 20 }}>
        {caseData.description}
      </p>

      <div className="card" style={{ padding: "20px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-display)" }}>
          System Profile
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
        padding: "16px 18px", borderRadius: 14, border: "1.5px solid var(--amber)",
        background: "rgba(245,166,35,0.06)", marginBottom: 24,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)", marginBottom: 6 }}>
          Mission Objectives
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
          <li>Examine the AI system's training data for imbalances</li>
          <li>Discover hidden clues that reveal algorithmic bias</li>
          <li>Flag evidence and write analysis notes</li>
          <li>Identify specific types of bias present in the system</li>
          <li>Propose mitigations and write an executive summary</li>
        </ul>
      </div>

      <button
        onClick={onNext}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: "var(--amber)", color: "#000", fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        Enter Data Room →
      </button>
    </div>
  );
}

// ── DataRoomQuestion Component ──────────────────────────────────────────────

function DataRoomQuestion({ sectionKey, questionData, answer, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // If already answered correctly, show completed state
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

  const justAnsweredCorrectly = showFeedback && selected === questionData.correctAnswer;
  const justAnsweredWrong = showFeedback && selected !== questionData.correctAnswer;

  return (
    <div style={{
      margin: "12px 0 20px", padding: "16px 16px", borderRadius: 12,
      border: "1.5px solid var(--purple, #a855f7)", background: "rgba(168,85,247,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>🔎</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--purple, #a855f7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Detective's Analysis
        </span>
      </div>
      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.5 }}>
        {questionData.question}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {questionData.choices.map((choice) => {
          const isSelected = selected === choice.id;
          const isCorrectChoice = choice.id === questionData.correctAnswer;
          let borderColor = isSelected ? "var(--purple, #a855f7)" : "var(--border)";
          let bgColor = isSelected ? "rgba(168,85,247,0.08)" : "transparent";
          if (showFeedback && isSelected && isCorrectChoice) {
            borderColor = "var(--green, #10b981)";
            bgColor = "rgba(16,185,129,0.08)";
          } else if (showFeedback && isSelected && !isCorrectChoice) {
            borderColor = "var(--red, #ef4444)";
            bgColor = "rgba(239,68,68,0.06)";
          }
          return (
            <button
              key={choice.id}
              onClick={() => { if (!justAnsweredCorrectly) handleSelect(choice.id); }}
              style={{
                padding: "10px 14px", borderRadius: 10, cursor: justAnsweredCorrectly ? "default" : "pointer",
                border: `1.5px solid ${borderColor}`, background: bgColor,
                textAlign: "left", fontSize: 13, color: "var(--text)", transition: "all 0.15s",
              }}
            >
              <span style={{ fontWeight: 600, marginRight: 8, color: "var(--text3)" }}>{choice.id.toUpperCase()}.</span>
              {choice.text}
            </button>
          );
        })}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: selected ? "var(--purple, #a855f7)" : "var(--surface2)",
            color: selected ? "#fff" : "var(--text3)", fontWeight: 700, fontSize: 13,
            cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s",
          }}
        >
          Submit Answer
        </button>
      )}

      {justAnsweredCorrectly && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, background: "rgba(16,185,129,0.08)",
          border: "1px solid var(--green, #10b981)", marginTop: 4,
        }}>
          <p style={{ fontSize: 12, color: "var(--green, #10b981)", fontWeight: 700, margin: "0 0 4px" }}>Correct!</p>
          <p style={{ fontSize: 12, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>{questionData.feedbackCorrect}</p>
        </div>
      )}

      {justAnsweredWrong && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.06)",
          border: "1px solid var(--red, #ef4444)", marginTop: 4,
        }}>
          <p style={{ fontSize: 12, color: "var(--red, #ef4444)", fontWeight: 700, margin: "0 0 4px" }}>Not quite — try again!</p>
          <p style={{ fontSize: 12, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>{questionData.feedbackIncorrect}</p>
        </div>
      )}
    </div>
  );
}

// ── Phase 2: Data Room ──────────────────────────────────────────────────────

function PhaseDataRoom({ caseData, openChart, setOpenChart, dataRoomAnswers, onDataRoomAnswer, onNext }) {
  const td = caseData.trainingData;
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 6px" }}>
        Training Data Overview
      </h2>
      <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 22 }}>{td.description}</p>

      {/* Demographics Accordions */}
      {td.demographics.map((demo, di) => (
        <div key={di} className="card" style={{ padding: 0, marginBottom: 12, overflow: "hidden" }}>
          <button
            onClick={() => setOpenChart(openChart === di ? -1 : di)}
            style={{
              width: "100%", padding: "14px 18px", background: "none", border: "none",
              display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{demo.category}</span>
            <span style={{ fontSize: 12, color: "var(--text3)", transform: openChart === di ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
              ▼
            </span>
          </button>
          {openChart === di && (
            <div style={{ padding: "0 18px 16px" }}>
              {demo.breakdown.map((item) => (
                <div key={item.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)", marginBottom: 3 }}>
                    <span>{item.label}</span>
                    <span style={{ fontWeight: 600 }}>{item.value}%</span>
                  </div>
                  <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4 }}>
                    <div style={{ width: `${item.value}%`, height: "100%", background: item.color, borderRadius: 4, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Demographics Analysis Question */}
      {caseData.dataRoomQuestions?.demographics && (
        <DataRoomQuestion
          sectionKey="demographics"
          questionData={caseData.dataRoomQuestions.demographics}
          answer={dataRoomAnswers?.demographics}
          onAnswer={onDataRoomAnswer}
        />
      )}

      {/* Sample Records Table */}
      <div className="card" style={{ padding: "18px 0", marginBottom: 16, overflowX: "auto" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", padding: "0 18px", marginBottom: 12, fontFamily: "var(--font-display)" }}>
          Sample Records
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 }}>
          <thead>
            <tr>
              {td.recordColumns.map((col) => (
                <th key={col.key} style={{
                  padding: "8px 10px", textAlign: col.align || "center", fontWeight: 600,
                  color: "var(--text3)", borderBottom: "1px solid var(--border)", fontSize: 11,
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {td.sampleRecords.map((rec) => (
              <tr key={rec.id}>
                {td.recordColumns.map((col) => {
                  let val = rec[col.key];
                  let cellStyle = { padding: "8px 10px", textAlign: col.align || "center", color: "var(--text2)", borderBottom: "1px solid var(--border)" };

                  // Badge column
                  if (col.badge) return (
                    <td key={col.key} style={cellStyle}><ResultBadge result={val} /></td>
                  );
                  // Currency format
                  if (col.format === "currency") val = formatCurrency(val);
                  // Boolean
                  if (col.boolean) val = val ? "Yes" : "No";
                  // Suffix
                  if (col.suffix && typeof rec[col.key] === "number") val = `${rec[col.key]}${col.suffix}`;
                  // Warn thresholds
                  if (col.warnBelow != null && typeof rec[col.key] === "number" && rec[col.key] < col.warnBelow) {
                    cellStyle = { ...cellStyle, color: "var(--red, #ef4444)", fontWeight: 600 };
                  }
                  if (col.warnAbove != null && typeof rec[col.key] === "number" && rec[col.key] > col.warnAbove) {
                    cellStyle = { ...cellStyle, color: "var(--red, #ef4444)", fontWeight: 600 };
                  }
                  // Truncate
                  if (col.truncate && typeof val === "string" && val.length > col.truncate) {
                    val = val.slice(0, col.truncate) + "...";
                  }

                  return <td key={col.key} style={cellStyle}>{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sample Records Analysis Question */}
      {caseData.dataRoomQuestions?.sampleRecords && (
        <DataRoomQuestion
          sectionKey="sampleRecords"
          questionData={caseData.dataRoomQuestions.sampleRecords}
          answer={dataRoomAnswers?.sampleRecords}
          onAnswer={onDataRoomAnswer}
        />
      )}

      {/* Feature Weights */}
      <div className="card" style={{ padding: "18px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-display)" }}>
          Feature Weights
        </div>
        {td.featureWeights.map((fw) => (
          <div key={fw.feature} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: fw.suspicious ? "var(--amber)" : "var(--text2)", marginBottom: 3 }}>
              <span>{fw.suspicious ? "⚠️ " : ""}{fw.feature}</span>
              <span style={{ fontWeight: 600 }}>{Math.round(fw.weight * 100)}%</span>
            </div>
            <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4 }}>
              <div style={{
                width: `${fw.weight * 100}%`, height: "100%", borderRadius: 4,
                background: fw.suspicious ? "var(--amber)" : "var(--cyan, #22d3ee)",
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Feature Weights Analysis Question */}
      {caseData.dataRoomQuestions?.featureWeights && (
        <DataRoomQuestion
          sectionKey="featureWeights"
          questionData={caseData.dataRoomQuestions.featureWeights}
          answer={dataRoomAnswers?.featureWeights}
          onAnswer={onDataRoomAnswer}
        />
      )}

      {/* Approval / Accuracy Rates */}
      <div className="card" style={{ padding: "18px 18px", marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 14, fontFamily: "var(--font-display)" }}>
          {td.ratesLabel || "Approval / Accuracy Rates"}
        </div>
        {td.approvalRates.map((ar) => {
          const barColor = ar.rate < 25 ? "var(--red, #ef4444)" : ar.rate < 40 ? "var(--amber)" : "#60a5fa";
          return (
            <div key={ar.group} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--text2)", marginBottom: 3 }}>
                <span>{ar.group}</span>
                <span style={{ fontWeight: 600, color: barColor }}>{ar.rate}%</span>
              </div>
              <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4 }}>
                <div style={{ width: `${ar.rate}%`, height: "100%", background: barColor, borderRadius: 4, transition: "width 0.5s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Approval Rates Analysis Question */}
      {caseData.dataRoomQuestions?.approvalRates && (
        <DataRoomQuestion
          sectionKey="approvalRates"
          questionData={caseData.dataRoomQuestions.approvalRates}
          answer={dataRoomAnswers?.approvalRates}
          onAnswer={onDataRoomAnswer}
        />
      )}

      <button
        onClick={onNext}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: "var(--amber)", color: "#000", fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "all 0.2s",
        }}
      >
        Begin Investigation →
      </button>
    </div>
  );
}

// ── ClueQuestionCard Component ─────────────────────────────────────────────

function ClueQuestionCard({ clue, answer, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const q = clue.question;
  if (!q) return null;

  function handleSubmit() {
    if (!selected) return;
    setShowFeedback(true);
    onAnswer(clue.id, selected);
  }

  const isCorrect = showFeedback && selected === q.correctAnswer;
  const isWrong = showFeedback && selected !== q.correctAnswer;

  return (
    <div style={{
      padding: "18px 16px", borderRadius: 14,
      border: "1.5px solid var(--purple, #a855f7)", background: "rgba(168,85,247,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>🔍</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--purple, #a855f7)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Evidence Analysis
        </span>
      </div>

      {/* Evidence snippet */}
      <div style={{
        padding: "10px 14px", borderRadius: 10, background: "var(--surface2)",
        fontSize: 12, color: "var(--text2)", fontStyle: "italic", lineHeight: 1.6, marginBottom: 12,
      }}>
        "{q.evidenceSnippet}"
      </div>

      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: "0 0 12px", lineHeight: 1.5 }}>
        {q.prompt}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
        {q.choices.map((choice) => {
          const isSelected = selected === choice.id;
          let borderColor = isSelected ? "var(--purple, #a855f7)" : "var(--border)";
          let bgColor = isSelected ? "rgba(168,85,247,0.08)" : "transparent";
          if (showFeedback && isSelected && choice.id === q.correctAnswer) {
            borderColor = "var(--green, #10b981)";
            bgColor = "rgba(16,185,129,0.08)";
          } else if (showFeedback && isSelected && choice.id !== q.correctAnswer) {
            borderColor = "var(--red, #ef4444)";
            bgColor = "rgba(239,68,68,0.06)";
          }
          return (
            <button
              key={choice.id}
              onClick={() => { if (!isCorrect) setSelected(choice.id); setShowFeedback(false); }}
              style={{
                padding: "10px 14px", borderRadius: 10, cursor: isCorrect ? "default" : "pointer",
                border: `1.5px solid ${borderColor}`, background: bgColor,
                textAlign: "left", fontSize: 13, color: "var(--text)", transition: "all 0.15s",
              }}
            >
              <span style={{ fontWeight: 600, marginRight: 8, color: "var(--text3)" }}>{choice.id.toUpperCase()}.</span>
              {choice.text}
            </button>
          );
        })}
      </div>

      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: selected ? "var(--purple, #a855f7)" : "var(--surface2)",
            color: selected ? "#fff" : "var(--text3)", fontWeight: 700, fontSize: 13,
            cursor: selected ? "pointer" : "not-allowed", transition: "all 0.2s",
          }}
        >
          Submit Answer
        </button>
      )}

      {isCorrect && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, background: "rgba(16,185,129,0.08)",
          border: "1px solid var(--green, #10b981)", marginTop: 4,
        }}>
          <p style={{ fontSize: 12, color: "var(--green, #10b981)", fontWeight: 700, margin: "0 0 4px" }}>
            Clue Discovered!
          </p>
          <p style={{ fontSize: 12, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>
            {q.feedbackCorrect}
          </p>
        </div>
      )}

      {isWrong && (
        <div style={{
          padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.06)",
          border: "1px solid var(--red, #ef4444)", marginTop: 4,
        }}>
          <p style={{ fontSize: 12, color: "var(--red, #ef4444)", fontWeight: 700, margin: "0 0 4px" }}>Not quite — try again!</p>
          <p style={{ fontSize: 12, color: "var(--text2)", margin: 0, lineHeight: 1.5 }}>
            {q.feedbackWrong?.[selected] || "Think about what the evidence is really showing you."}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Phase 3: Investigation ──────────────────────────────────────────────────

function PhaseInvestigation({ caseData, discoveredClues, onClueClick, onClueAnswer, clueAnswers, activeClueQuestion, selectedClue, onCloseClue, onNext }) {
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 16px" }}>
        Investigation Board
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {caseData.clues.map((clue) => {
          const found = discoveredClues.includes(clue.id);
          const isQuestionShowing = activeClueQuestion === clue.id;
          const isSelected = selectedClue?.id === clue.id;

          return (
            <div key={clue.id}>
              {/* Clue card header (always visible) */}
              <div
                className="card"
                onClick={() => onClueClick(clue.id)}
                style={{
                  padding: "16px 14px", cursor: "pointer",
                  border: found ? "1.5px solid var(--amber)" : isQuestionShowing ? "1.5px solid var(--purple, #a855f7)" : "1.5px solid var(--border)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { if (!found && !isQuestionShowing) e.currentTarget.style.borderColor = "var(--text3)"; }}
                onMouseLeave={(e) => { if (!found && !isQuestionShowing) e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                {found ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>{clue.title}</div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                          background: clue.severity === "high" ? "rgba(239,68,68,0.12)" : "rgba(245,166,35,0.12)",
                          color: clue.severity === "high" ? "var(--red, #ef4444)" : "var(--amber)",
                        }}>
                          {clue.severity}
                        </span>
                        <span style={{ fontSize: 12, color: "var(--text3)", transform: isSelected ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: isSelected ? 99 : 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {clue.description}
                    </p>
                  </>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ fontSize: 22 }}>🔍</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text3)" }}>Click to Investigate</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{clue.category}</div>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                      background: "rgba(245,166,35,0.1)", color: "var(--amber)",
                    }}>
                      +{clue.points}
                    </span>
                  </div>
                )}
              </div>

              {/* Inline clue question (shows when investigating) */}
              {isQuestionShowing && !found && clue.question && (
                <div style={{ marginTop: 8 }}>
                  <ClueQuestionCard clue={clue} answer={clueAnswers?.[clue.id]} onAnswer={onClueAnswer} />
                </div>
              )}

              {/* Expanded detail (shows when clicking a discovered clue) */}
              {isSelected && found && (
                <div className="card" style={{ padding: "16px 16px", marginTop: 8, borderLeft: "4px solid var(--amber)" }}>
                  <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 12, marginTop: 0 }}>{clue.description}</p>
                  <div style={{
                    padding: "10px 14px", borderRadius: 10, background: "var(--surface2)",
                    fontSize: 12, color: "var(--text2)", fontStyle: "italic", lineHeight: 1.5, marginBottom: 12,
                  }}>
                    "{clue.evidence}"
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 11, padding: "3px 10px", borderRadius: 20,
                      background: "rgba(168,85,247,0.1)", color: "var(--purple, #a855f7)",
                    }}>
                      {clue.biasType}
                    </span>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
                      background: clue.severity === "high" ? "rgba(239,68,68,0.12)" : "rgba(245,166,35,0.12)",
                      color: clue.severity === "high" ? "var(--red, #ef4444)" : "var(--amber)",
                    }}>
                      {clue.severity}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>
          {discoveredClues.length}/{caseData.clues.length} clues discovered
        </span>
        <button
          onClick={onNext}
          style={{
            padding: "12px 24px", borderRadius: 12, border: "none",
            background: "var(--amber)", color: "#000", fontWeight: 700, fontSize: 14,
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          Go to Evidence Locker →
        </button>
      </div>
    </div>
  );
}

// ── Phase 4: Evidence Locker ────────────────────────────────────────────────

function PhaseEvidence({ caseData, discoveredClues, flaggedEvidence, evidenceNotes, expandedItems, setExpandedItems, onFlag, onNoteChange, onNext }) {
  const discoveredClueData = caseData.clues.filter((c) => discoveredClues.includes(c.id));

  function toggleExpand(id) {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 16px" }}>
        Evidence Locker
      </h2>

      {discoveredClueData.length === 0 ? (
        <div className="card" style={{ padding: "32px 20px", textAlign: "center", color: "var(--text3)" }}>
          No clues discovered yet. Go back to the Investigation phase to find clues.
        </div>
      ) : (
        discoveredClueData.map((clue) => {
          const isFlagged = flaggedEvidence.includes(clue.id);
          const isExpanded = expandedItems.has(clue.id);
          return (
            <div
              key={clue.id}
              className="card"
              style={{
                padding: 0, marginBottom: 10, overflow: "hidden",
                border: isFlagged ? "1.5px solid var(--amber)" : "1.5px solid var(--border)",
              }}
            >
              <button
                onClick={() => toggleExpand(clue.id)}
                style={{
                  width: "100%", padding: "14px 18px", background: "none", border: "none",
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer", textAlign: "left",
                }}
              >
                {isFlagged && <span style={{ color: "var(--amber)" }}>✓</span>}
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", flex: 1 }}>{clue.title}</span>
                <span style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 20,
                  background: "rgba(168,85,247,0.1)", color: "var(--purple, #a855f7)",
                }}>
                  {clue.biasType}
                </span>
                <span style={{ fontSize: 12, color: "var(--text3)", transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
              </button>
              {isExpanded && (
                <div style={{ padding: "0 18px 16px" }}>
                  <div style={{
                    padding: "10px 14px", borderRadius: 10, background: "var(--surface2)",
                    fontSize: 12, color: "var(--text2)", fontStyle: "italic", lineHeight: 1.5, marginBottom: 12,
                  }}>
                    "{clue.evidence}"
                  </div>
                  <textarea
                    placeholder="Write your analysis notes here..."
                    value={evidenceNotes[clue.id] || ""}
                    onChange={(e) => onNoteChange(clue.id, e.target.value)}
                    style={{
                      width: "100%", minHeight: 60, padding: "10px 12px", borderRadius: 10,
                      border: "1px solid var(--border)", background: "var(--surface)",
                      color: "var(--text)", fontSize: 13, resize: "vertical", marginBottom: 10,
                      fontFamily: "inherit",
                    }}
                  />
                  <button
                    onClick={() => onFlag(clue.id)}
                    style={{
                      padding: "8px 16px", borderRadius: 10,
                      border: isFlagged ? "1.5px solid var(--amber)" : "1.5px solid var(--border)",
                      background: isFlagged ? "rgba(245,166,35,0.1)" : "transparent",
                      color: isFlagged ? "var(--amber)" : "var(--text2)",
                      fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {isFlagged ? "✓ Flagged" : "Flag as Evidence"}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
        <span style={{ fontSize: 13, color: "var(--text2)" }}>
          {flaggedEvidence.length} pieces of evidence flagged
        </span>
        <button
          onClick={onNext}
          style={{
            padding: "12px 24px", borderRadius: 12, border: "none",
            background: "var(--amber)", color: "#000", fontWeight: 700, fontSize: 14,
            cursor: "pointer", transition: "all 0.2s",
          }}
        >
          Write Bias Report →
        </button>
      </div>
    </div>
  );
}

// ── Phase 5: Bias Report ────────────────────────────────────────────────────

function PhaseReport({ caseData, biases, mitigations, summary, submitted, onToggleBias, onMitigationChange, onSummaryChange, onSubmit }) {
  if (submitted) {
    return (
      <div className="card" style={{ padding: "32px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 10 }}>✅</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--green, #10b981)", marginBottom: 6 }}>
          Investigation Submitted
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)" }}>
          Your bias report has been submitted. Check the Case Review tab for your score.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text)", margin: "0 0 16px" }}>
        Bias Report
      </h2>

      {/* Identified Biases */}
      <div className="card" style={{ padding: "18px 18px", marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
          Identified Biases
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {caseData.biasesToFind.map((b) => {
            const active = biases.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => onToggleBias(b.id)}
                style={{
                  padding: "8px 14px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: active ? "rgba(239,68,68,0.12)" : "var(--surface2)",
                  color: active ? "var(--red, #ef4444)" : "var(--text2)",
                  fontWeight: active ? 700 : 500, fontSize: 12, transition: "all 0.2s",
                }}
              >
                {active ? "✓ " : ""}{b.name}
              </button>
            );
          })}
        </div>
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 10, marginBottom: 0 }}>
          Select all biases you identified in your investigation.
        </p>
      </div>

      {/* Mitigations */}
      {biases.length > 0 && (
        <div className="card" style={{ padding: "18px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
            Proposed Mitigations
          </div>
          {biases.map((biasId, idx) => {
            const biasInfo = caseData.biasesToFind.find((b) => b.id === biasId);
            if (!biasInfo) return null;
            return (
              <div key={biasId} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--red, #ef4444)", marginBottom: 6 }}>
                  {biasInfo.name}
                </div>
                <textarea
                  placeholder={`How would you fix "${biasInfo.name}"?`}
                  value={mitigations[idx] || ""}
                  onChange={(e) => onMitigationChange(idx, e.target.value)}
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
          placeholder="Write a summary of your investigation findings, the biases you discovered, and why they matter..."
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
        🔒 Submit Investigation
      </button>
    </div>
  );
}

// ── Phase 6: Case Review ────────────────────────────────────────────────────

function PhaseReview({ caseData, score, discoveredClues, submitted, dataRoomAnswers, clueAnswers }) {
  if (!score) {
    return (
      <div className="card" style={{ padding: "32px 20px", textAlign: "center", color: "var(--text3)" }}>
        Submit your investigation to see results.
      </div>
    );
  }

  const missedClues = caseData.clues.filter((c) => !discoveredClues.includes(c.id));

  // Use 5-component breakdown if analysis data exists, otherwise legacy 4-component
  const hasAnalysis = score.analysisAccuracy != null;
  const breakdown = hasAnalysis
    ? [
        { label: "Clues Found", value: score.cluesFound, max: 30 },
        { label: "Analysis Accuracy", value: score.analysisAccuracy, max: 15 },
        { label: "Bias Identification", value: score.biasIdentification, max: 25 },
        { label: "Evidence Quality", value: score.evidenceQuality, max: 10 },
        { label: "Mitigations", value: score.mitigations, max: 20 },
      ]
    : [
        { label: "Clues Found", value: score.cluesFound, max: 40 },
        { label: "Bias Identification", value: score.biasIdentification, max: 25 },
        { label: "Evidence Quality", value: score.evidenceQuality, max: 15 },
        { label: "Mitigations", value: score.mitigations, max: 20 },
      ];

  return (
    <div>
      <div className="card" style={{ padding: "28px 20px", textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: "var(--text)", fontFamily: "var(--font-display)" }}>
          {score.total}<span style={{ fontSize: 20, color: "var(--text3)" }}>/100</span>
        </div>
        <div style={{
          fontSize: 13, fontWeight: 700, color: "var(--amber)", marginTop: 6,
          padding: "4px 14px", borderRadius: 20, display: "inline-block",
          background: "rgba(245,166,35,0.1)",
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
                background: b.value >= b.max * 0.7 ? "var(--green, #10b981)" : b.value >= b.max * 0.4 ? "var(--amber)" : "var(--red, #ef4444)",
                transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Missed Clues */}
      {missedClues.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 12, fontFamily: "var(--font-display)" }}>
            Missed Clues
          </div>
          {missedClues.map((clue) => (
            <div
              key={clue.id}
              className="card"
              style={{ padding: "14px 16px", marginBottom: 8, border: "1.5px solid var(--amber)" }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
                {clue.title}
              </div>
              <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, margin: 0 }}>
                {clue.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
