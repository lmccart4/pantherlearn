// src/components/grading/RubricScorerModal.jsx
//
// Teacher-facing per-student rubric scorer.
// Opens for a specific (studentId, courseId, lessonId) where the lesson has a
// `rubric` block. Lets the teacher click 1–4 on each criterion, shows a live
// weighted total, and saves a `rubricScore` map onto the student's lesson
// progress doc. When present, `rubricScore` overrides the auto-computed
// lesson grade — see gradeCalc.computeRubricGrade + StudentProgress lookup.

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { doc, getDoc, updateDoc, deleteField, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { computeRubricGrade } from "../../lib/gradeCalc";

const LEVEL_TONE = {
  4: { color: "var(--green)",   bg: "rgba(16,185,129,0.12)" },
  3: { color: "var(--cyan)",    bg: "rgba(34,211,238,0.12)" },
  2: { color: "var(--amber)",   bg: "rgba(245,166,35,0.12)" },
  1: { color: "#ef4444",        bg: "rgba(239,68,68,0.12)" },
};

export default function RubricScorerModal({ rubricBlock, studentId, studentName, courseId, lessonId, onClose, onSaved }) {
  const { user } = useAuth();
  const [scores, setScores] = useState({}); // { 0: 4, 1: 3, ... }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [savedBy, setSavedBy] = useState(null);

  const criteria = rubricBlock?.criteria || [];

  useEffect(() => {
    (async () => {
      try {
        const ref = doc(db, "progress", studentId, "courses", courseId, "lessons", lessonId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const rs = data.rubricScore || {};
          const next = {};
          criteria.forEach((_, idx) => {
            if (typeof rs[`c${idx}`] === "number") next[idx] = rs[`c${idx}`];
          });
          setScores(next);
          setSavedAt(rs.gradedAt || null);
          setSavedBy(rs.gradedByName || rs.gradedBy || null);
        }
      } catch (e) {
        setError("Couldn't load this student's rubric — try reopening.");
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, courseId, lessonId]);

  const liveGrade = computeRubricGrade(rubricBlock, Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [`c${k}`, v])
  ));
  const allScored = criteria.length > 0 && criteria.every((_, idx) => scores[idx]);

  const save = async () => {
    if (!allScored || saving) return;
    setSaving(true);
    setError(null);
    try {
      const ref = doc(db, "progress", studentId, "courses", courseId, "lessons", lessonId);
      const payload = {
        "rubricScore.gradedAt": new Date().toISOString(),
        "rubricScore.gradedBy": "teacher",
        "rubricScore.gradedByUid": user?.uid || null,
        "rubricScore.gradedByName": user?.displayName || user?.email || null,
        "rubricScore.finalGrade": liveGrade?.grade ?? null,
      };
      criteria.forEach((_, idx) => {
        payload[`rubricScore.c${idx}`] = scores[idx];
      });
      await updateDoc(ref, payload);
      setSavedAt(new Date().toISOString());
      setSavedBy(user?.displayName || user?.email || "you");
      if (onSaved) onSaved({ studentId, lessonId, grade: liveGrade?.grade });
    } catch (e) {
      // updateDoc fails if the doc doesn't exist yet — fall back to setDoc-like
      // behavior via a single Firestore write using setDoc with merge.
      try {
        const { setDoc } = await import("firebase/firestore");
        const ref = doc(db, "progress", studentId, "courses", courseId, "lessons", lessonId);
        const rs = {
          gradedAt: new Date().toISOString(),
          gradedBy: "teacher",
          gradedByUid: user?.uid || null,
          gradedByName: user?.displayName || user?.email || null,
          finalGrade: liveGrade?.grade ?? null,
        };
        criteria.forEach((_, idx) => { rs[`c${idx}`] = scores[idx]; });
        await setDoc(ref, { rubricScore: rs }, { merge: true });
        setSavedAt(new Date().toISOString());
        setSavedBy(user?.displayName || user?.email || "you");
        if (onSaved) onSaved({ studentId, lessonId, grade: liveGrade?.grade });
      } catch (e2) {
        setError("Failed to save. Check your connection and try again.");
      }
    }
    setSaving(false);
  };

  const clear = async () => {
    if (saving) return;
    if (!window.confirm("Clear this student's rubric score? Their lesson grade will revert to auto-graded.")) return;
    setSaving(true);
    try {
      const ref = doc(db, "progress", studentId, "courses", courseId, "lessons", lessonId);
      await updateDoc(ref, { rubricScore: deleteField() });
      setScores({});
      setSavedAt(null);
      setSavedBy(null);
      if (onSaved) onSaved({ studentId, lessonId, grade: null });
    } catch (e) {
      setError("Failed to clear. Try again.");
    }
    setSaving(false);
  };

  return createPortal(
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: "min(820px, 100%)", maxHeight: "92vh", overflowY: "auto",
          padding: 0, borderColor: "var(--amber)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "18px 24px", borderBottom: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--surface2)", position: "sticky", top: 0, zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--amber)", textTransform: "uppercase" }}>
              📋 Rubric Scorer
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, marginTop: 2 }}>
              {studentName || "Student"}
            </div>
            {rubricBlock?.title && (
              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{rubricBlock.title}</div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: allScored ? "var(--green)" : "var(--text3)", lineHeight: 1 }}>
                {liveGrade?.grade != null ? `${liveGrade.grade}%` : "—"}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
                {allScored ? "Weighted total" : "Score every criterion"}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ fontSize: 22, padding: "4px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", cursor: "pointer" }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>Loading…</div>
          ) : criteria.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text3)" }}>
              This lesson's rubric block has no criteria.
            </div>
          ) : (
            <>
              {rubricBlock.intro && (
                <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14, fontStyle: "italic" }}>
                  {rubricBlock.intro}
                </div>
              )}

              {criteria.map((c, idx) => {
                const selected = scores[idx];
                return (
                  <div key={c.name || idx} style={{ marginBottom: 18, paddingBottom: 14, borderBottom: idx < criteria.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>
                        {c.name || `Criterion ${idx + 1}`}
                      </div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)" }}>
                        Weight: {c.weight}%
                      </div>
                    </div>

                    {/* Level options */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
                      {[...(c.levels || [])].sort((a, b) => b.score - a.score).map((lvl) => {
                        const isSelected = selected === lvl.score;
                        const tone = LEVEL_TONE[lvl.score] || LEVEL_TONE[3];
                        return (
                          <button
                            key={lvl.score}
                            onClick={() => setScores((s) => ({ ...s, [idx]: lvl.score }))}
                            disabled={saving}
                            style={{
                              textAlign: "left",
                              border: isSelected ? `2px solid ${tone.color}` : "1px solid var(--border)",
                              background: isSelected ? tone.bg : "transparent",
                              borderRadius: 8,
                              padding: "10px 12px",
                              cursor: saving ? "default" : "pointer",
                              transition: "all 0.12s",
                              opacity: saving ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = tone.bg; e.currentTarget.style.borderColor = tone.color; } }}
                            onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; } }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: tone.color, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                {lvl.label}
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)" }}>
                                {lvl.score}
                              </span>
                            </div>
                            <div style={{ fontSize: 11, lineHeight: 1.4, color: "var(--text2)" }}>
                              {lvl.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", color: "#f87171", fontSize: 12, marginBottom: 12 }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid var(--border)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          background: "var(--surface2)", position: "sticky", bottom: 0,
        }}>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>
            {savedAt ? (
              <>
                Saved {new Date(savedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                {savedBy ? <> by <strong style={{ color: "var(--text2)" }}>{savedBy}</strong></> : null}
              </>
            ) : (
              "Not yet scored"
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {savedAt && (
              <button
                onClick={clear}
                disabled={saving}
                style={{ fontSize: 12, fontWeight: 600, padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text3)", cursor: saving ? "default" : "pointer" }}
              >
                Clear rubric
              </button>
            )}
            <button
              onClick={onClose}
              disabled={saving}
              style={{ fontSize: 12, fontWeight: 600, padding: "8px 14px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", cursor: "pointer" }}
            >
              Close
            </button>
            <button
              onClick={save}
              disabled={!allScored || saving}
              style={{
                fontSize: 12, fontWeight: 700, padding: "8px 16px", borderRadius: 6,
                border: "none",
                background: allScored ? "var(--amber)" : "var(--surface2)",
                color: allScored ? "#1a1a1a" : "var(--text3)",
                cursor: (allScored && !saving) ? "pointer" : "default",
              }}
            >
              {saving ? "Saving…" : (savedAt ? "Update score" : "Save rubric")}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
