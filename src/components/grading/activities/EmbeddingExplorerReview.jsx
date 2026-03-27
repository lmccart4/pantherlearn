// src/components/grading/activities/EmbeddingExplorerReview.jsx
// Review component for the external Embedding Explorer activity.
// Reads from root-level "embedding_explorer" collection in Firestore.

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { createNotification } from "../../../lib/notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../../lib/gamification";

const GRADE_TIERS = [
  { label: "Missing", value: 0, xpKey: "written_missing", color: "var(--text3)", bg: "var(--surface2)" },
  { label: "Emerging", value: 0.55, xpKey: "written_emerging", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { label: "Approaching", value: 0.65, xpKey: "written_approaching", color: "var(--amber)", bg: "rgba(245,166,35,0.12)" },
  { label: "Developing", value: 0.85, xpKey: "written_developing", color: "var(--cyan)", bg: "rgba(34,211,238,0.12)" },
  { label: "Refining", value: 1.0, xpKey: "written_refining", color: "var(--green)", bg: "rgba(16,185,129,0.12)" },
];

const STAGE_META = [
  { key: "stage1", name: "The Sorting Game", icon: "🧩" },
  { key: "stage2", name: "Number Detectives", icon: "🔢" },
  { key: "stage3", name: "The Embedding Machine", icon: "🔬" },
  { key: "stage4", name: "Why It Matters", icon: "🌍" },
];

export default function EmbeddingExplorerReview({ activity, studentMap, courseId: parentCourseId }) {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [grading, setGrading] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "embedding_explorer"));
        const subs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        subs.sort((a, b) => (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0));
        setSubmissions(subs);

        // Build list of courseIds to check (parent + migrated sections)
        const courseIdsToCheck = [parentCourseId];
        try {
          const allCoursesSnap = await getDocs(collection(db, "courses"));
          allCoursesSnap.forEach((d) => {
            if (d.data().migratedFrom === parentCourseId) courseIdsToCheck.push(d.id);
          });
        } catch { /* ignore */ }

        // Fetch existing grades by checking known courseIds directly
        const existingGrades = {};
        await Promise.all(subs.map(async (sub) => {
          const uid = sub.studentId || sub.id;
          for (const cid of courseIdsToCheck) {
            try {
              const gradeDoc = await getDoc(doc(db, "progress", uid, "courses", cid, "activities", "embedding-explorer"));
              if (gradeDoc.exists()) {
                existingGrades[uid] = {
                  score: gradeDoc.data().activityScore,
                  label: gradeDoc.data().activityLabel,
                  courseId: cid,
                };
                break;
              }
            } catch { /* no grade */ }
          }
        }));
        setGrades(existingGrades);
      } catch (err) {
        console.error("Error fetching Embedding Explorer data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [parentCourseId]);

  const handleGrade = async (uid, tier) => {
    if (grading) return;
    setGrading(uid);
    try {
      const courseId = grades[uid]?.courseId || parentCourseId;
      const gradeRef = doc(db, "progress", uid, "courses", courseId, "activities", "embedding-explorer");
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "embedding-explorer",
        activityTitle: "Embedding Explorer",
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label, courseId } }));

      try {
        const config = await getXPConfig(courseId);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) await awardXP(uid, xpAmount, `activity_grade:embedding-explorer:${tier.label.toLowerCase()}`, courseId);
      } catch (xpErr) { console.warn("Could not award activity XP:", xpErr); }

      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `Embedding Explorer graded: ${tier.label}`,
          body: `Your Embedding Explorer received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "\uD83E\uDDEC",
          courseId,
        });
      } catch { /* non-critical */ }
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setGrading(null);
  };

  const handleReset = async (uid) => {
    const sub = submissions.find((s) => (s.studentId || s.id) === uid);
    const name = getName(uid);
    if (!window.confirm(`Reset ${name}'s Embedding Explorer? This will delete their submission and let them redo it.`)) return;
    try {
      if (sub) await deleteDoc(doc(db, "embedding_explorer", sub.id));
      const courseId = grades[uid]?.courseId || parentCourseId;
      await deleteDoc(doc(db, "progress", uid, "courses", courseId, "activities", "embedding-explorer"));
      setSubmissions((prev) => prev.filter((s) => (s.studentId || s.id) !== uid));
      setGrades((prev) => { const next = { ...prev }; delete next[uid]; return next; });
    } catch (err) {
      console.error("Failed to reset student:", err);
      alert("Failed to reset. Please try again.");
    }
  };

  const getUid = (sub) => sub.studentId || sub.id;
  const getName = (uid) => studentMap[uid]?.displayName || submissions.find((s) => getUid(s) === uid)?.displayName || uid.slice(0, 8) + "...";
  const getPhoto = (uid) => studentMap[uid]?.photoURL || submissions.find((s) => getUid(s) === uid)?.photoURL || "";
  const getEmail = (uid) => studentMap[uid]?.email || submissions.find((s) => getUid(s) === uid)?.email || "";

  const currentTier = (uid) => {
    const g = grades[uid];
    if (!g || g.score === null || g.score === undefined) return null;
    return GRADE_TIERS.find((t) => t.value === g.score) || null;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" style={{ height: 80 }} />)}
      </div>
    );
  }

  const submitted = submissions.filter((s) => s.submitted);
  const graded = Object.keys(grades).length;
  const ungraded = submitted.length - graded;
  const avgScore = submitted.length > 0
    ? Math.round(submitted.reduce((s, sub) => s + (sub.score || 0), 0) / submitted.length)
    : 0;

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Total", value: submissions.length, color: "var(--text)" },
          { label: "Avg Score", value: `${avgScore}/105`, color: "var(--cyan)" },
          { label: "Graded", value: graded, color: "var(--green)" },
          { label: "Needs Review", value: ungraded, color: ungraded > 0 ? "var(--amber)" : "var(--text3)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {submissions.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{"\uD83E\uDDEC"}</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No Embedding Explorer submissions yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Student scores will appear here once they complete the activity.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {submissions.map((sub) => {
            const uid = getUid(sub);
            const tier = currentTier(uid);
            const isExpanded = expandedStudent === uid;
            const pct = sub.maxScore > 0 ? Math.round((sub.score / sub.maxScore) * 100) : 0;

            return (
              <div key={sub.id} className="card" style={{
                padding: "16px 20px",
                borderColor: tier ? undefined : sub.submitted ? "rgba(245,166,35,0.15)" : undefined,
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {getPhoto(uid) ? (
                      <img src={getPhoto(uid)} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} referrerPolicy="no-referrer" />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text3)" }}>👤</div>
                    )}
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{getName(uid)}</span>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{getEmail(uid)}</div>
                    </div>
                  </div>
                  {tier ? (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, background: tier.bg, color: tier.color }}>
                      {tier.label}
                    </span>
                  ) : sub.submitted ? (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--blue-dim)", color: "var(--blue)", fontWeight: 600 }}>
                      Needs review
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "rgba(245,166,35,0.12)", color: "var(--amber)", fontWeight: 600 }}>
                      In progress
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 12, flexWrap: "wrap" }}>
                  <div><span style={{ color: "var(--text3)" }}>Score: </span><span style={{ fontWeight: 700, color: "var(--cyan)" }}>{sub.score || 0}/{sub.maxScore || 105}</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Percentage: </span><span style={{ fontWeight: 600 }}>{pct}%</span></div>
                  {sub.completedAt && (
                    <div><span style={{ color: "var(--text3)" }}>Completed: </span><span style={{ fontWeight: 600, color: "var(--text2)" }}>
                      {(sub.completedAt?.toDate ? sub.completedAt.toDate() : new Date(sub.completedAt)).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span></div>
                  )}
                  <button onClick={() => setExpandedStudent(isExpanded ? null : uid)}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--cyan)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "2px 8px" }}>
                    {isExpanded ? "\u25B2 Hide" : "\u25BC Stages"}
                  </button>
                </div>

                {/* Expanded stage breakdown */}
                {isExpanded && sub.stages && (
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 10 }}>Stage Breakdown</div>
                    {STAGE_META.map(({ key, name, icon }) => {
                      const stageData = sub.stages[key];
                      if (!stageData) return null;
                      const stagePct = stageData.max > 0 ? Math.round((stageData.score / stageData.max) * 100) : 0;
                      const barColor = stagePct >= 80 ? "#10b981" : stagePct >= 50 ? "#f59e0b" : "#ef4444";
                      return (
                        <div key={key} style={{ marginBottom: 8 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, marginBottom: 3 }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              <span>{icon}</span>
                              <span style={{ fontWeight: 500, color: "var(--text2)" }}>{name}</span>
                            </span>
                            <span style={{ fontWeight: 700, color: "var(--text2)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>
                              {stageData.score}/{stageData.max}
                            </span>
                          </div>
                          <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                            <div style={{ width: `${stagePct}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width 0.3s" }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Grading buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginRight: 4 }}>Grade:</span>
                  {GRADE_TIERS.map((t) => {
                    const isSelected = grades[uid]?.score === t.value;
                    const disabled = grading === uid || !sub.submitted;
                    return (
                      <button key={t.label} onClick={() => handleGrade(uid, t)}
                        disabled={disabled}
                        style={{
                          fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                          border: isSelected ? `2px solid ${t.color}` : "1px solid var(--border)",
                          background: isSelected ? t.bg : "transparent",
                          color: isSelected ? t.color : "var(--text3)",
                          cursor: disabled ? "default" : "pointer",
                          transition: "all 0.15s",
                          opacity: disabled ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { if (!isSelected && !disabled) { e.currentTarget.style.background = t.bg; e.currentTarget.style.color = t.color; } }}
                        onMouseLeave={(e) => { if (!isSelected && !disabled) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text3)"; } }}
                      >
                        {t.label} {Math.round(t.value * 100)}%
                      </button>
                    );
                  })}
                </div>

                {/* Reset */}
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => handleReset(uid)}
                    disabled={grading === uid}
                    style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 6,
                      border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.15)", color: "#ef4444",
                      cursor: grading === uid ? "default" : "pointer", transition: "all 0.15s",
                      opacity: grading === uid ? 0.5 : 1,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.25)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                  >
                    Reset Student
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
