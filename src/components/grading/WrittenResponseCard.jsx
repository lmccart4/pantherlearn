// src/components/grading/WrittenResponseCard.jsx
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { analyzeResponse } from "../../lib/aiDetection";
import { compareToBaselines } from "../../lib/aiBaselines";
import { createNotification } from "../../lib/notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../lib/gamification";

const GRADE_TIERS = [
  { label: "Missing", value: 0, xpKey: "written_missing", color: "var(--text3)", bg: "var(--surface2)" },
  { label: "Emerging", value: 0.55, xpKey: "written_emerging", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { label: "Approaching", value: 0.65, xpKey: "written_approaching", color: "var(--amber)", bg: "rgba(245,166,35,0.12)" },
  { label: "Developing", value: 0.85, xpKey: "written_developing", color: "var(--cyan)", bg: "rgba(34,211,238,0.12)" },
  { label: "Refining", value: 1.0, xpKey: "written_refining", color: "var(--green)", bg: "rgba(16,185,129,0.12)" },
];

const OVERRIDE_OPTIONS = [
  { label: "Agent got it wrong", value: null },
  { label: "Data glitch", value: "glitch" },
  { label: "Mercy credit", value: "mercy" },
  { label: "Don't train on this", value: "ignore" },
];

export default function WrittenResponseCard({ item, helpers, onSelectStudent, selectedLesson }) {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const [grading, setGrading] = useState(false);
  const [savedGrade, setSavedGrade] = useState(item.writtenScore ?? null);
  const [pendingTier, setPendingTier] = useState(null);
  const { getStudentName, getStudentEmail, getStudentPhoto, getBlockPrompt, lessonMap, responses } = helpers;

  const wasAutoGraded = !!(item.autogradeOriginal || item.gradedBy === "autograde-agent");

  // Build per-student writing history for comparison
  const history = responses
    .filter((r) => r.studentId === item.studentId && r.id !== item.id && r.answer)
    .map((r) => r.answer);

  // Look up AI baselines from the lesson block
  const lessonInfo = lessonMap[item.lessonId];
  const block = (lessonInfo?.blocks || []).find((b) => b.id === item.blockId);
  const aiBaselines = block?.aiBaselines || [];

  const analysis = analyzeResponse(item.answer, {
    submittedAt: item.submittedAt,
    previousResponses: history,
    aiBaselines,
    compareToBaselines,
  });

  const handleGradeClick = (tier) => {
    if (grading) return;
    // If item was auto-graded, show override reason selector before saving
    if (wasAutoGraded) {
      setPendingTier(tier);
    } else {
      saveGrade(tier, undefined);
    }
  };

  const handleOverrideSelect = (overrideReason) => {
    if (!pendingTier) return;
    saveGrade(pendingTier, overrideReason);
    setPendingTier(null);
  };

  const saveGrade = async (tier, overrideReason) => {
    if (grading) return;
    setGrading(true);
    try {
      // Update only the grading fields using dot-notation so the student's
      // original answer, submitted flag, and submittedAt are preserved.
      // autogradeOriginal is NOT included here — Firestore merge: true preserves it.
      const progressRef = doc(
        db, "progress", item.studentId, "courses", item.courseId, "lessons", item.lessonId
      );
      const updatePayload = {
        [`answers.${item.blockId}.writtenScore`]: tier.value,
        [`answers.${item.blockId}.writtenLabel`]: tier.label,
        [`answers.${item.blockId}.needsGrading`]: false,
        [`answers.${item.blockId}.gradedAt`]: new Date(),
        [`answers.${item.blockId}.gradedBy`]: "teacher",
      };
      if (overrideReason !== undefined) {
        updatePayload[`answers.${item.blockId}.overrideReason`] = overrideReason;
      }
      // Clear any pending review request when teacher grades/re-grades
      updatePayload[`answers.${item.blockId}.reviewRequested`] = false;
      updatePayload[`answers.${item.blockId}.reviewNote`] = null;
      await updateDoc(progressRef, updatePayload);

      setSavedGrade(tier.value);

      // Award XP based on grade tier
      let xpAmount = 0;
      try {
        const config = await getXPConfig(item.courseId);
        xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) {
          await awardXP(item.studentId, xpAmount, `written_grade:${tier.label.toLowerCase()}`, item.courseId);
        }
      } catch (xpErr) {
        console.warn("Could not award written response XP:", xpErr);
      }

      // Notify student that their response was graded
      try {
        const prompt = getBlockPrompt(item.lessonId, item.blockId);
        const shortPrompt = prompt?.length > 50 ? prompt.slice(0, 50) + "…" : (prompt || "a question");
        await createNotification(item.studentId, {
          type: "grade_result",
          title: `Response graded: ${tier.label}`,
          body: `Your answer to "${shortPrompt}" received ${tier.label} (${Math.round(tier.value * 100)}%)${xpAmount > 0 ? ` — +${xpAmount} XP` : ""}`,
          icon: "📝",
          link: `/course/${item.courseId}/lesson/${item.lessonId}`,
          courseId: item.courseId,
        });
      } catch (notifErr) {
        console.warn("Could not send grade notification:", notifErr);
      }
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setGrading(false);
  };

  const currentTier = savedGrade !== null ? GRADE_TIERS.find((t) => t.value === savedGrade) : null;

  return (
    <div className="card" style={{ padding: "16px 20px", borderColor: analysis.risk === "high" ? "rgba(239,68,68,0.25)" : analysis.risk === "medium" ? "rgba(245,166,35,0.25)" : undefined }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {getStudentPhoto(item.studentId) ? (
            <img src={getStudentPhoto(item.studentId)} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)" }} />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text3)" }}>👤</div>
          )}
          <div>
            <span style={{ fontWeight: 600, fontSize: 14, cursor: "pointer", color: "var(--text)" }}
              onClick={() => onSelectStudent(item.studentId, item.lessonId, selectedLesson)}>
              {getStudentName(item.studentId)}
            </span>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>{getStudentEmail(item.studentId)}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {analysis.risk !== "none" && (
            <span
              onClick={(e) => { e.stopPropagation(); setIsAnalysisExpanded(!isAnalysisExpanded); }}
              style={{
                fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, cursor: "pointer",
                background: analysis.risk === "high" ? "var(--red-dim)" : analysis.risk === "medium" ? "var(--amber-dim)" : "var(--surface2)",
                color: analysis.color, transition: "opacity 0.15s",
              }}
              title="Click for details"
            >
              {analysis.label}
            </span>
          )}
          {currentTier ? (
            <span style={{
              fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600,
              background: currentTier.bg, color: currentTier.color,
            }}>
              {currentTier.label}
            </span>
          ) : (
            <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--blue-dim)", color: "var(--blue)", fontWeight: 600 }}>
              Needs review
            </span>
          )}
        </div>
      </div>

      {/* AI detection detail panel */}
      {isAnalysisExpanded && analysis.risk !== "none" && (
        <div style={{
          background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
          padding: "12px 16px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>AI Detection Analysis</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              Confidence: {Math.round(analysis.overallScore * 100)}%
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {analysis.details.filter((d) => d.score > 0).map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "var(--text3)", width: 130, flexShrink: 0 }}>{d.name}</span>
                <div style={{ flex: 1, height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${d.score * 100}%`, height: "100%", borderRadius: 3,
                    background: d.score > 0.6 ? "var(--red)" : d.score > 0.3 ? "var(--amber)" : "var(--text3)",
                    transition: "width 0.3s",
                  }} />
                </div>
                <span style={{ fontSize: 10, color: "var(--text3)", width: 28, textAlign: "right" }}>
                  {Math.round(d.score * 100)}
                </span>
              </div>
            ))}
          </div>

          {analysis.flags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {analysis.flags.map((flag, i) => (
                <span key={i} style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 4,
                  background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)",
                }}>
                  {flag}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>
            <span>Heuristic analysis only — not definitive. Use as a starting point for conversation with the student.</span>
            {aiBaselines.length > 0 ? (
              <span style={{ fontStyle: "normal", color: "var(--green)", fontWeight: 600 }}>
                ✓ AI baselines active ({aiBaselines.map((b) => b.provider).join(", ")})
              </span>
            ) : (
              <span style={{ fontStyle: "normal", color: "var(--text3)" }}>
                ○ No AI baselines — re-save lesson to generate
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
        {getBlockPrompt(item.lessonId, item.blockId)}
      </div>
      <div style={{ background: "var(--bg)", borderRadius: 8, padding: 14, fontSize: 15, lineHeight: 1.6, marginBottom: 12, border: "1px solid var(--border)" }}>
        {item.answer}
      </div>

      {/* Agent feedback (shown when auto-graded) */}
      {item.feedback && wasAutoGraded && (
        <div style={{
          background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", borderRadius: 8,
          padding: "10px 14px", marginBottom: 12, fontSize: 12, lineHeight: 1.5, color: "var(--text2)",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            🤖 Agent Feedback
          </span>
          <div style={{ marginTop: 4, fontStyle: "italic" }}>{item.feedback}</div>
        </div>
      )}

      {/* Grading buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginRight: 4 }}>Grade:</span>
        {GRADE_TIERS.map((tier) => {
          const isSelected = savedGrade === tier.value;
          const isPending = pendingTier?.value === tier.value;
          return (
            <button
              key={tier.label}
              onClick={() => handleGradeClick(tier)}
              disabled={grading}
              style={{
                fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                border: (isSelected || isPending) ? `2px solid ${tier.color}` : "1px solid var(--border)",
                background: (isSelected || isPending) ? tier.bg : "transparent",
                color: (isSelected || isPending) ? tier.color : "var(--text3)",
                cursor: grading ? "default" : "pointer",
                transition: "all 0.15s",
                opacity: grading ? 0.5 : 1,
              }}
              onMouseEnter={(e) => { if (!isSelected && !isPending) { e.currentTarget.style.background = tier.bg; e.currentTarget.style.color = tier.color; } }}
              onMouseLeave={(e) => { if (!isSelected && !isPending) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text3)"; } }}
            >
              {tier.label} {Math.round(tier.value * 100)}%
            </button>
          );
        })}
        {item.gradedBy && !pendingTier && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, marginLeft: 4,
            background: item.gradedBy === "autograde-agent" ? "rgba(139,92,246,0.12)" : "rgba(59,130,246,0.12)",
            color: item.gradedBy === "autograde-agent" ? "#8b5cf6" : "#3b82f6",
          }}>
            {item.gradedBy === "autograde-agent" ? "🤖 Auto-graded" : "👩‍🏫 Teacher"}
          </span>
        )}
        {item.reviewRequested && (
          <span style={{
            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, marginLeft: 4,
            background: "rgba(245,166,35,0.12)", color: "var(--amber)",
          }}>
            🔍 Review Requested
          </span>
        )}
      </div>

      {/* Student review note */}
      {item.reviewRequested && item.reviewNote && (
        <div style={{
          padding: "8px 12px", marginBottom: 8, borderRadius: 6,
          background: "rgba(245,166,35,0.06)", border: "1px solid rgba(245,166,35,0.15)",
          fontSize: 12, lineHeight: 1.5, color: "var(--text2)",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Student Note
          </span>
          <div style={{ marginTop: 4 }}>{item.reviewNote}</div>
        </div>
      )}

      {/* Override reason selector — shown when teacher re-grades an auto-graded item */}
      {pendingTier && wasAutoGraded && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 8,
          padding: "8px 12px", background: "var(--bg)", borderRadius: 8, border: "1px solid var(--border)",
        }}>
          <span style={{ fontSize: 11, color: "var(--text2)", fontWeight: 600, marginRight: 2 }}>Why override?</span>
          {OVERRIDE_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => handleOverrideSelect(opt.value)}
              style={{
                fontSize: 10, fontWeight: 600, padding: "4px 10px", borderRadius: 12,
                border: "1px solid var(--border)", background: "transparent", color: "var(--text2)",
                cursor: "pointer", transition: "all 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.borderColor = "var(--text3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => setPendingTier(null)}
            style={{
              fontSize: 10, padding: "4px 8px", borderRadius: 12,
              border: "1px solid var(--border)", background: "transparent", color: "var(--text3)",
              cursor: "pointer", marginLeft: 2,
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {item.submittedAt && (
        <div style={{ fontSize: 11, color: "var(--text3)" }}>
          Submitted {new Date(item.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          {currentTier && (
            <span> · Graded: <span style={{ color: currentTier.color, fontWeight: 600 }}>{currentTier.label}</span></span>
          )}
        </div>
      )}
    </div>
  );
}
