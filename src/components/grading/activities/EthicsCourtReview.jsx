// src/components/grading/activities/EthicsCourtReview.jsx
// Review component for AI Ethics Courtroom activity in the Grading Dashboard.

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { createNotification } from "../../../lib/notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../../lib/gamification";
import { GRADE_TIERS } from "../../../lib/gradeTiers";

export default function EthicsCourtReview({ studentMap, courseId: parentCourseId }) {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [grading, setGrading] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, "ethicsCourtroom"), orderBy("completedAt", "desc"))
        );

        const subs = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.submitted) subs.push({ id: d.id, ...data });
        });
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
          for (const cid of courseIdsToCheck) {
            try {
              const gradeDoc = await getDoc(doc(db, "progress", sub.uid, "courses", cid, "activities", "ethics-courtroom"));
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
        }));
        setGrades(existingGrades);
      } catch (err) {
        console.error("Error fetching Ethics Courtroom data:", err);
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
      const courseId = grades[uid]?.courseId || sub?.courseId || parentCourseId;
      if (!courseId) {
        alert("Cannot determine course for this student.");
        setGrading(null);
        return;
      }

      const gradeRef = doc(db, "progress", uid, "courses", courseId, "activities", "ethics-courtroom");
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "ethics-courtroom",
        activityTitle: "AI Ethics Courtroom",
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label, courseId } }));

      try {
        const config = await getXPConfig(courseId);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) await awardXP(uid, xpAmount, `activity_grade:ethics-courtroom:${tier.label.toLowerCase()}`, courseId);
      } catch (xpErr) { console.warn("Could not award activity XP:", xpErr); }

      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `Ethics Courtroom graded: ${tier.label}`,
          body: `Your AI Ethics Courtroom work received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "\u2696\uFE0F",
          courseId,
        });
      } catch { /* non-critical */ }
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setGrading(null);
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

  const graded = Object.keys(grades).length;
  const ungraded = submissions.length - graded;

  // Verdict distribution
  const liableCount = submissions.filter((s) => s.verdict === "liable").length;

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Submissions", value: submissions.length, color: "var(--text)" },
          { label: "Liable Verdicts", value: liableCount, color: "#ef4444" },
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
          <div style={{ fontSize: 36, marginBottom: 12 }}>{"\u2696\uFE0F"}</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No Ethics Courtroom submissions yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>
            Students can access at <span style={{ color: "var(--amber)", fontWeight: 600 }}>ai-ethics-courtroom-paps.firebaseapp.com</span>
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
                  ) : (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--blue-dim)", color: "var(--blue)", fontWeight: 600 }}>
                      Needs review
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 12, flexWrap: "wrap" }}>
                  <div><span style={{ color: "var(--text3)" }}>Case: </span><span style={{ fontWeight: 600 }}>{sub.caseTitle || sub.selectedCase}</span></div>
                  <div>
                    <span style={{ color: "var(--text3)" }}>Verdict: </span>
                    <span style={{ fontWeight: 700, color: sub.verdict === "liable" ? "#ef4444" : "var(--cyan)" }}>
                      {sub.verdict === "liable" ? "LIABLE" : "NOT LIABLE"}
                    </span>
                  </div>
                  <div><span style={{ color: "var(--text3)" }}>Confidence: </span><span style={{ fontWeight: 600 }}>{sub.confidence}%</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Words: </span><span style={{ fontWeight: 700, color: "var(--amber)" }}>{sub.totalWords || 0}</span></div>
                  <button onClick={() => setExpandedStudent(isExpanded ? null : sub.uid)}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--amber)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "2px 8px" }}>
                    {isExpanded ? "\u25B2 Hide" : "\u25BC Details"}
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 14, marginBottom: 12 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#ef4444", marginBottom: 4, letterSpacing: "0.05em" }}>Prosecution ({sub.prosecutionWords || 0} words)</div>
                        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, maxHeight: 120, overflow: "auto", background: "var(--surface)", padding: 8, borderRadius: 6 }}>
                          {sub.prosecutionArg || "(empty)"}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--cyan)", marginBottom: 4, letterSpacing: "0.05em" }}>Defense ({sub.defenseWords || 0} words)</div>
                        <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, maxHeight: 120, overflow: "auto", background: "var(--surface)", padding: 8, borderRadius: 6 }}>
                          {sub.defenseArg || "(empty)"}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--green)", marginBottom: 4, letterSpacing: "0.05em" }}>Expert Analysis ({sub.expertWords || 0} words)</div>
                      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, maxHeight: 100, overflow: "auto", background: "var(--surface)", padding: 8, borderRadius: 6 }}>
                        {sub.expertAnalysis || "(empty)"}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "var(--amber)", marginBottom: 4, letterSpacing: "0.05em" }}>Reflection ({sub.reflectionWords || 0} words)</div>
                      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5, maxHeight: 100, overflow: "auto", background: "var(--surface)", padding: 8, borderRadius: 6 }}>
                        {sub.reflection || "(empty)"}
                      </div>
                    </div>
                  </div>
                )}

                {/* Grading buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginRight: 4 }}>Grade:</span>
                  {GRADE_TIERS.map((t) => {
                    const isSelected = grades[sub.uid]?.score === t.value;
                    return (
                      <button key={t.label} onClick={() => handleGrade(sub.uid, t)}
                        disabled={grading === sub.uid}
                        style={{
                          fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                          border: isSelected ? `2px solid ${t.color}` : "1px solid var(--border)",
                          background: isSelected ? t.bg : "transparent",
                          color: isSelected ? t.color : "var(--text3)",
                          cursor: grading === sub.uid ? "default" : "pointer",
                          transition: "all 0.15s",
                          opacity: grading === sub.uid ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = t.bg; e.currentTarget.style.color = t.color; } }}
                        onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text3)"; } }}
                      >
                        {t.label} {Math.round(t.value * 100)}%
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
