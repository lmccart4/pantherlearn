// src/components/grading/activities/DataLabelingReview.jsx
// Review component for Data Labeling Lab activity in the Grading Dashboard.

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { createNotification } from "../../../lib/notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../../lib/gamification";
import { GRADE_TIERS } from "../../../lib/gradeTiers";

export default function DataLabelingReview({ studentMap, courseId: parentCourseId }) {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [grading, setGrading] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "dataLabelingLab"));

        const subs = [];
        snap.forEach((d) => {
          subs.push({ id: d.id, ...d.data() });
        });
        subs.sort((a, b) => (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0));
        setSubmissions(subs);

        // Build list of courseIds to check (parent + sections)
        const courseIdsToCheck = [parentCourseId];
        try {
          const allCoursesSnap = await getDocs(collection(db, "courses"));
          allCoursesSnap.forEach((d) => {
            if (d.data().migratedFrom === parentCourseId) courseIdsToCheck.push(d.id);
          });
        } catch { /* ignore */ }

        // Fetch existing grades by checking known courseIds directly
        const existingGrades = {};
        for (const sub of subs) {
          for (const cid of courseIdsToCheck) {
            try {
              const gradeDoc = await getDoc(doc(db, "progress", sub.uid, "courses", cid, "activities", "data-labeling-lab"));
              if (gradeDoc.exists()) {
                existingGrades[sub.uid] = {
                  score: gradeDoc.data().activityScore,
                  label: gradeDoc.data().activityLabel,
                  courseId: cid,
                };
                break;
              }
            } catch { /* no grade */ }
          }
        }
        setGrades(existingGrades);
      } catch (err) {
        console.error("Error fetching Data Labeling Lab data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [parentCourseId]);

  const handleGrade = async (uid, tier) => {
    if (grading) return;
    setGrading(uid);
    try {
      const sub = submissions.find((s) => s.uid === uid);
      const courseId = grades[uid]?.courseId || parentCourseId;
      if (!courseId) {
        alert("Cannot determine course for this student.");
        setGrading(null);
        return;
      }

      const gradeRef = doc(db, "progress", uid, "courses", courseId, "activities", "data-labeling-lab");
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "data-labeling-lab",
        activityTitle: "Data Labeling Lab",
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label, courseId } }));

      try {
        const config = await getXPConfig(courseId);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) await awardXP(uid, xpAmount, `activity_grade:data-labeling-lab:${tier.label.toLowerCase()}`, courseId);
      } catch (xpErr) { console.warn("Could not award activity XP:", xpErr); }

      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `Data Labeling Lab graded: ${tier.label}`,
          body: `Your Data Labeling Lab work received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "\uD83C\uDFF7\uFE0F",
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
    const sub = submissions.find((s) => s.uid === uid);
    const name = studentMap[uid]?.displayName || sub?.displayName || uid.slice(0, 8) + "...";
    if (!window.confirm(`Reset ${name}'s Data Labeling Lab? This will delete their submission and let them start over.`)) return;
    try {
      // Doc ID in Firestore may differ from uid — use the actual doc id
      if (sub) await deleteDoc(doc(db, "dataLabelingLab", sub.id));
      const courseId = grades[uid]?.courseId || parentCourseId;
      if (courseId) {
        await deleteDoc(doc(db, "progress", uid, "courses", courseId, "activities", "data-labeling-lab"));
      }
      setSubmissions((prev) => prev.filter((s) => s.uid !== uid));
      setGrades((prev) => { const next = { ...prev }; delete next[uid]; return next; });
    } catch (err) {
      console.error("Failed to reset student:", err);
      alert("Failed to reset student. Please try again.");
    }
  };

  const getName = (uid) => studentMap[uid]?.displayName || submissions.find((s) => s.uid === uid)?.displayName || uid.slice(0, 8) + "...";
  const getPhoto = (uid) => studentMap[uid]?.photoURL || submissions.find((s) => s.uid === uid)?.photoURL || "";
  const getEmail = (uid) => studentMap[uid]?.email || submissions.find((s) => s.uid === uid)?.email || "";

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
  const avgAccuracy = submitted.length > 0
    ? Math.round(submitted.reduce((s, sub) => s + (sub.accuracy || 0), 0) / submitted.length)
    : 0;

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Total", value: submissions.length, color: "var(--text)" },
          { label: "Avg Accuracy", value: `${avgAccuracy}%`, color: "var(--cyan)" },
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
          <div style={{ fontSize: 36, marginBottom: 12 }}>{"\uD83C\uDFF7\uFE0F"}</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No Data Labeling Lab submissions yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>
            Students can access at <span style={{ color: "var(--amber)", fontWeight: 600 }}>data-labeling-lab-paps.firebaseapp.com</span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {submissions.map((sub) => {
            const tier = currentTier(sub.uid);
            const isExpanded = expandedStudent === sub.uid;

            return (
              <div key={sub.id} className="card" style={{
                padding: "16px 20px",
                borderColor: tier ? undefined : "rgba(245,166,35,0.15)",
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {getPhoto(sub.uid) ? (
                      <img src={getPhoto(sub.uid)} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text3)" }}>{"\uD83D\uDC64"}</div>
                    )}
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{getName(sub.uid)}</span>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{getEmail(sub.uid)}</div>
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
                  <div><span style={{ color: "var(--text3)" }}>Items Labeled: </span><span style={{ fontWeight: 600 }}>{sub.labeledCount || 0}/{sub.totalItems || 0}</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Accuracy: </span><span style={{ fontWeight: 700, color: "var(--cyan)" }}>{sub.accuracy || 0}%</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Time Used: </span><span style={{ fontWeight: 600 }}>{Math.floor((sub.timeUsed || 0) / 60)}m {(sub.timeUsed || 0) % 60}s</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Reflection Words: </span><span style={{ fontWeight: 700, color: "var(--amber)" }}>{sub.reflectionWordCount || 0}</span></div>
                  <button onClick={() => setExpandedStudent(isExpanded ? null : sub.uid)}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--amber)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "2px 8px" }}>
                    {isExpanded ? "\u25B2 Hide" : "\u25BC Details"}
                  </button>
                </div>

                {/* Expanded reflections */}
                {isExpanded && sub.reflections && (
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 10 }}>Reflection Responses</div>
                    {Object.entries(sub.reflections).map(([key, value]) => (
                      <div key={key} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--amber)", marginBottom: 3, letterSpacing: "0.05em" }}>
                          Reflection {key.replace("r", "")}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, background: "var(--surface)", padding: 8, borderRadius: 6, maxHeight: 100, overflow: "auto" }}>
                          {value || "(empty)"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Grading buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginRight: 4 }}>Grade:</span>
                  {GRADE_TIERS.map((t) => {
                    const isSelected = grades[sub.uid]?.score === t.value;
                    const disabled = grading === sub.uid || !sub.submitted;
                    return (
                      <button key={t.label} onClick={() => handleGrade(sub.uid, t)}
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
                {/* Reset button */}
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => handleReset(sub.uid)}
                    disabled={grading === sub.uid}
                    style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 14px", borderRadius: 6,
                      border: "1px solid rgba(239,68,68,0.5)", background: "rgba(239,68,68,0.15)", color: "#ef4444",
                      cursor: grading === sub.uid ? "default" : "pointer", transition: "all 0.15s",
                      opacity: grading === sub.uid ? 0.5 : 1,
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
