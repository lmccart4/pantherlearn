// src/components/grading/activities/SpaceRescueReview.jsx
// Review component for Space Rescue Mission in the Grading Dashboard.
// Shows all student attempts with level completions, throw logs, and grading.

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { calculateSpaceRescueScore } from "../../../pages/SpaceRescueMission";
import { createNotification } from "../../../lib/notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../../lib/gamification";
import { GRADE_TIERS } from "../../../lib/grading";

export default function SpaceRescueReview({ activity, studentMap, courseId }) {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [grading, setGrading] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "courses", courseId, "spaceRescue"));
        const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Aggregate by student — keep best submission and all attempts
        const byStudent = {};
        raw.forEach((sub) => {
          const uid = sub.uid;
          if (!uid) return;
          if (!byStudent[uid]) {
            byStudent[uid] = {
              uid,
              studentName: sub.studentName || "Unknown",
              attempts: [],
              levelsCompleted: 0,
              completedLevelIds: [],
              bestScore: 0,
              lastUpdated: null,
            };
          }
          byStudent[uid].attempts.push(sub);
          // Track best state
          if ((sub.levelsCompleted || 0) > byStudent[uid].levelsCompleted) {
            byStudent[uid].levelsCompleted = sub.levelsCompleted || 0;
            byStudent[uid].completedLevelIds = sub.completedLevelIds || [];
          }
          const score = calculateSpaceRescueScore(sub);
          if (score > byStudent[uid].bestScore) byStudent[uid].bestScore = score;
          const updated = sub.completedAt?.toDate?.() || sub.completedAt;
          if (!byStudent[uid].lastUpdated || (updated && updated > byStudent[uid].lastUpdated)) {
            byStudent[uid].lastUpdated = updated;
          }
        });

        const sorted = Object.values(byStudent).sort((a, b) => b.bestScore - a.bestScore);
        setStudents(sorted);

        // Fetch existing grades
        const existingGrades = {};
        for (const student of sorted) {
          try {
            const gradeDoc = await getDoc(doc(db, "progress", student.uid, "courses", courseId, "activities", "space-rescue"));
            if (gradeDoc.exists()) {
              existingGrades[student.uid] = {
                score: gradeDoc.data().activityScore,
                label: gradeDoc.data().activityLabel,
              };
            }
          } catch { /* no grade */ }
        }
        setGrades(existingGrades);
      } catch (err) {
        console.error("Error fetching Space Rescue data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [courseId]);

  const handleGrade = async (uid, tier) => {
    if (grading) return;
    setGrading(uid);
    try {
      const gradeRef = doc(db, "progress", uid, "courses", courseId, "activities", "space-rescue");
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "space-rescue",
        activityTitle: "Space Rescue Mission",
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label } }));

      // Award XP
      try {
        const config = await getXPConfig(courseId);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) {
          await awardXP(uid, xpAmount, `activity_grade:space-rescue:${tier.label.toLowerCase()}`, courseId);
        }
      } catch (xpErr) {
        console.warn("Could not award activity XP:", xpErr);
      }

      // Notify student
      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `Space Rescue graded: ${tier.label}`,
          body: `Your Space Rescue Mission received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "🧑‍🚀",
          courseId,
        });
      } catch { /* non-critical */ }
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setGrading(null);
  };

  const getName = (uid) => studentMap[uid]?.displayName || students.find((s) => s.uid === uid)?.studentName || uid.slice(0, 8) + "...";
  const getPhoto = (uid) => studentMap[uid]?.photoURL || "";

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
  const withAttempts = students.filter((s) => s.levelsCompleted > 0).length;
  const ungraded = withAttempts - graded;

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Students", value: students.length, color: "var(--text)" },
          { label: "Completed 1+", value: withAttempts, color: "var(--text)" },
          { label: "Graded", value: graded, color: "var(--green)" },
          { label: "Needs Review", value: ungraded, color: ungraded > 0 ? "var(--amber)" : "var(--text3)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {students.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🧑‍🚀</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No Space Rescue attempts yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Student missions will appear here once they begin playing.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {students.map((student) => {
            const tier = currentTier(student.uid);
            const isExpanded = expandedStudent === student.uid;

            return (
              <div key={student.uid} className="card" style={{
                padding: "16px 20px",
                borderColor: tier ? undefined : student.levelsCompleted > 0 ? "rgba(245,166,35,0.15)" : undefined,
              }}>
                {/* Student header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {getPhoto(student.uid) ? (
                      <img src={getPhoto(student.uid)} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} referrerPolicy="no-referrer" />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text3)" }}>👤</div>
                    )}
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{getName(student.uid)}</span>
                    </div>
                  </div>
                  {tier ? (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, background: tier.bg, color: tier.color }}>
                      {tier.label}
                    </span>
                  ) : student.levelsCompleted > 0 ? (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--blue-dim)", color: "var(--blue)", fontWeight: 600 }}>
                      Needs review
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--surface2)", color: "var(--text3)", fontWeight: 600 }}>
                      In progress
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 20, marginBottom: 12, fontSize: 12, flexWrap: "wrap" }}>
                  <div><span style={{ color: "var(--text3)" }}>Missions: </span><span style={{ fontWeight: 700 }}>{student.levelsCompleted}/4</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Attempts: </span><span style={{ fontWeight: 700 }}>{student.attempts.length}</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Score: </span><span style={{ fontWeight: 700, color: "var(--amber)" }}>{student.bestScore}/100</span></div>
                  {student.lastUpdated && (
                    <div><span style={{ color: "var(--text3)" }}>Last: </span><span style={{ fontWeight: 600, color: "var(--text2)" }}>
                      {new Date(student.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span></div>
                  )}
                  <button onClick={() => setExpandedStudent(isExpanded ? null : student.uid)}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--amber)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "2px 8px" }}>
                    {isExpanded ? "▲ Hide" : "▼ Details"}
                  </button>
                </div>

                {/* Expanded attempt details */}
                {isExpanded && (
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 8 }}>
                      Completed Missions
                    </div>
                    {/* Level completion badges */}
                    <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
                      {[1, 2, 3, 4].map((lvl) => {
                        const completed = (student.completedLevelIds || []).includes(lvl);
                        return (
                          <span key={lvl} style={{
                            fontSize: 11, padding: "4px 10px", borderRadius: 6,
                            background: completed ? "rgba(0,255,163,0.12)" : "var(--surface2)",
                            color: completed ? "#10b981" : "var(--text3)",
                            fontWeight: 600, border: `1px solid ${completed ? "rgba(0,255,163,0.2)" : "var(--border)"}`,
                          }}>
                            Mission {lvl} {completed ? "✓" : "—"}
                          </span>
                        );
                      })}
                    </div>

                    {/* Recent attempts */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>
                      Recent Attempts ({Math.min(student.attempts.length, 8)})
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {student.attempts.slice(0, 8).map((attempt, i) => (
                        <div key={attempt.id || i} style={{
                          borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)",
                          padding: "8px 12px", fontSize: 12,
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              <span style={{
                                fontSize: 10, padding: "1px 8px", borderRadius: 4,
                                background: attempt.success ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                                color: attempt.success ? "var(--green)" : "#ef4444",
                                fontWeight: 600,
                              }}>
                                {attempt.success ? "Success" : "Failed"}
                              </span>
                              <span style={{ fontWeight: 600, color: "var(--text)" }}>
                                Mission {attempt.levelId}: {attempt.levelTitle}
                              </span>
                            </div>
                            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "monospace" }}>
                              v={attempt.finalVelocity?.toFixed(4)} m/s
                            </span>
                          </div>
                          {/* Throw log summary */}
                          {attempt.throwLog && attempt.throwLog.length > 0 && (
                            <div style={{ marginTop: 4, display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {attempt.throwLog.map((t, j) => (
                                <span key={j} style={{
                                  fontSize: 10, padding: "1px 6px", borderRadius: 3,
                                  background: "rgba(0,200,255,0.08)", color: "var(--cyan)",
                                }}>
                                  {t.object} {t.mass}kg @ {t.throwSpeed?.toFixed(1)}m/s
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grading buttons — only show if student has completed at least one level */}
                {student.levelsCompleted > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginRight: 4 }}>Grade:</span>
                    {GRADE_TIERS.map((t) => {
                      const isSelected = grades[student.uid]?.score === t.value;
                      return (
                        <button key={t.label} onClick={() => handleGrade(student.uid, t)}
                          disabled={grading === student.uid}
                          style={{
                            fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                            border: isSelected ? `2px solid ${t.color}` : "1px solid var(--border)",
                            background: isSelected ? t.bg : "transparent",
                            color: isSelected ? t.color : "var(--text3)",
                            cursor: grading === student.uid ? "default" : "pointer",
                            transition: "all 0.15s",
                            opacity: grading === student.uid ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = t.bg; e.currentTarget.style.color = t.color; } }}
                          onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text3)"; } }}
                        >
                          {t.label} {Math.round(t.value * 100)}%
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
