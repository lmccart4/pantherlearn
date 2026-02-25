// src/components/grading/activities/BiasDetectiveReview.jsx
// Review component for AI Bias Detective in the Grading Dashboard.
// Shows all student investigations with expandable detail panels.

import { useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { CASES } from "../../../lib/biasCases";
import { calculateScore } from "../../../lib/biasStore";
import { createNotification } from "../../../lib/notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../../lib/gamification";

const GRADE_TIERS = [
  { label: "Missing", value: 0, xpKey: "written_missing", color: "var(--text3)", bg: "var(--surface2)" },
  { label: "Emerging", value: 0.55, xpKey: "written_emerging", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { label: "Approaching", value: 0.65, xpKey: "written_approaching", color: "var(--amber)", bg: "rgba(245,166,35,0.12)" },
  { label: "Developing", value: 0.85, xpKey: "written_developing", color: "var(--cyan)", bg: "rgba(34,211,238,0.12)" },
  { label: "Refining", value: 1.0, xpKey: "written_refining", color: "var(--green)", bg: "rgba(16,185,129,0.12)" },
];

export default function BiasDetectiveReview({ activity, studentMap, courseId }) {
  const [loading, setLoading] = useState(true);
  const [investigations, setInvestigations] = useState([]);
  const [grades, setGrades] = useState({});
  const [grading, setGrading] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "courses", courseId, "biasInvestigations"));
        const raw = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        // Aggregate by student — keep best investigation per case
        const byStudent = {};
        raw.forEach((inv) => {
          const uid = inv.studentId;
          if (!uid) return;
          if (!byStudent[uid]) {
            byStudent[uid] = {
              uid,
              studentName: inv.studentName || "Unknown",
              investigations: [],
              bestScore: 0,
              totalSubmitted: 0,
              lastUpdated: null,
            };
          }
          const caseData = CASES.find((c) => c.id === inv.caseId);
          const score = inv.score || (inv.status === "submitted" && caseData ? calculateScore(inv, caseData) : null);
          const enriched = { ...inv, caseData, computedScore: score };
          byStudent[uid].investigations.push(enriched);
          if (inv.status === "submitted") byStudent[uid].totalSubmitted += 1;
          if (score?.total > byStudent[uid].bestScore) byStudent[uid].bestScore = score.total;
          const updated = inv.updatedAt?.toDate?.() || inv.updatedAt;
          if (!byStudent[uid].lastUpdated || (updated && updated > byStudent[uid].lastUpdated)) {
            byStudent[uid].lastUpdated = updated;
          }
        });

        const sorted = Object.values(byStudent).sort((a, b) => b.bestScore - a.bestScore);
        setInvestigations(sorted);

        // Fetch existing grades
        const existingGrades = {};
        for (const student of sorted) {
          try {
            const gradeDoc = await getDoc(doc(db, "progress", student.uid, "courses", courseId, "activities", "bias-detective"));
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
        console.error("Error fetching Bias Detective data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [courseId]);

  const handleGrade = async (uid, tier) => {
    if (grading) return;
    setGrading(uid);
    try {
      const gradeRef = doc(db, "progress", uid, "courses", courseId, "activities", "bias-detective");
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "bias-detective",
        activityTitle: "AI Bias Detective",
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label } }));

      // Award XP
      try {
        const config = await getXPConfig(courseId);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) {
          await awardXP(uid, xpAmount, `activity_grade:bias-detective:${tier.label.toLowerCase()}`, courseId);
        }
      } catch (xpErr) {
        console.warn("Could not award activity XP:", xpErr);
      }

      // Notify student
      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `Bias Detective graded: ${tier.label}`,
          body: `Your AI Bias Detective investigation received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "🔍",
          courseId,
        });
      } catch { /* non-critical */ }
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setGrading(null);
  };

  const getName = (uid) => studentMap[uid]?.displayName || investigations.find((s) => s.uid === uid)?.studentName || uid.slice(0, 8) + "...";
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
  const submitted = investigations.filter((s) => s.totalSubmitted > 0).length;
  const ungraded = submitted - graded;

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Students", value: investigations.length, color: "var(--text)" },
          { label: "Submitted", value: submitted, color: "var(--text)" },
          { label: "Graded", value: graded, color: "var(--green)" },
          { label: "Needs Review", value: ungraded, color: ungraded > 0 ? "var(--amber)" : "var(--text3)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {investigations.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No Bias Detective investigations yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Student investigations will appear here once they start a case.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {investigations.map((student) => {
            const tier = currentTier(student.uid);
            const isExpanded = expandedStudent === student.uid;

            return (
              <div key={student.uid} className="card" style={{
                padding: "16px 20px",
                borderColor: tier ? undefined : student.totalSubmitted > 0 ? "rgba(245,166,35,0.15)" : undefined,
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
                  ) : student.totalSubmitted > 0 ? (
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
                  <div><span style={{ color: "var(--text3)" }}>Cases: </span><span style={{ fontWeight: 700 }}>{student.investigations.length}</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Submitted: </span><span style={{ fontWeight: 700 }}>{student.totalSubmitted}</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Best Score: </span><span style={{ fontWeight: 700, color: "var(--amber)" }}>{student.bestScore}/100</span></div>
                  {student.lastUpdated && (
                    <div><span style={{ color: "var(--text3)" }}>Last: </span><span style={{ fontWeight: 600, color: "var(--text2)" }}>
                      {new Date(student.lastUpdated).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span></div>
                  )}
                  <button onClick={() => { setExpandedStudent(isExpanded ? null : student.uid); setExpandedSection(null); }}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--amber)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "2px 8px" }}>
                    {isExpanded ? "▲ Hide" : "▼ Details"}
                  </button>
                </div>

                {/* Expanded investigation details */}
                {isExpanded && (
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 8 }}>Investigations</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {student.investigations.map((inv) => {
                        const isInvExpanded = expandedSection === inv.id;
                        return (
                          <div key={inv.id} style={{ borderRadius: 6, background: "var(--surface)", border: "1px solid var(--border)", overflow: "hidden" }}>
                            <button
                              onClick={() => setExpandedSection(isInvExpanded ? null : inv.id)}
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                width: "100%", padding: "10px 12px", background: "none", border: "none",
                                cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 12,
                              }}
                            >
                              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <span>{inv.caseData?.emoji || "📋"}</span>
                                <span style={{ fontWeight: 600, color: "var(--text)" }}>{inv.caseData?.title || inv.caseId}</span>
                                <span style={{
                                  fontSize: 10, padding: "1px 8px", borderRadius: 4,
                                  background: inv.status === "submitted" ? "rgba(16,185,129,0.12)" : "rgba(245,166,35,0.12)",
                                  color: inv.status === "submitted" ? "var(--green)" : "var(--amber)",
                                  fontWeight: 600,
                                }}>
                                  {inv.status === "submitted" ? "Submitted" : "Active"}
                                </span>
                              </div>
                              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                {inv.computedScore && (
                                  <span style={{
                                    fontWeight: 700,
                                    color: inv.computedScore.total >= 70 ? "var(--green)" : inv.computedScore.total >= 50 ? "var(--amber)" : "var(--red, #ef4444)",
                                  }}>
                                    {inv.computedScore.total}/100
                                  </span>
                                )}
                                <span style={{ color: "var(--text3)" }}>{isInvExpanded ? "▲" : "▼"}</span>
                              </div>
                            </button>

                            {isInvExpanded && inv.computedScore && (
                              <div style={{ padding: "0 12px 12px", fontSize: 12 }}>
                                {/* Score breakdown bars */}
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 6 }}>Score Breakdown</div>
                                  {(inv.computedScore.analysisAccuracy != null
                                    ? [
                                        ["Clues", inv.computedScore.cluesFound, 30],
                                        ["Analysis", inv.computedScore.analysisAccuracy, 15],
                                        ["Bias ID", inv.computedScore.biasIdentification, 25],
                                        ["Evidence", inv.computedScore.evidenceQuality, 10],
                                        ["Mitigations", inv.computedScore.mitigations, 20],
                                      ]
                                    : [
                                        ["Clues", inv.computedScore.cluesFound, 40],
                                        ["Bias ID", inv.computedScore.biasIdentification, 25],
                                        ["Evidence", inv.computedScore.evidenceQuality, 15],
                                        ["Mitigations", inv.computedScore.mitigations, 20],
                                      ]
                                  ).map(([label, val, max]) => (
                                    <div key={label} style={{ marginBottom: 4 }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>
                                        <span>{label}</span>
                                        <span>{val}/{max}</span>
                                      </div>
                                      <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                                        <div style={{ width: `${(val / max) * 100}%`, height: "100%", background: "var(--amber)", borderRadius: 3, transition: "width 0.3s" }} />
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Bias report */}
                                {inv.biasReport?.summary && (
                                  <div style={{ marginBottom: 10 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>Summary</div>
                                    <div style={{ background: "var(--bg)", borderRadius: 6, padding: 10, fontSize: 12, lineHeight: 1.5, color: "var(--text2)" }}>
                                      {inv.biasReport.summary}
                                    </div>
                                  </div>
                                )}

                                {/* Identified biases */}
                                {inv.biasReport?.identifiedBiases?.length > 0 && (
                                  <div style={{ marginBottom: 10 }}>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>Identified Biases</div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                      {inv.biasReport.identifiedBiases.map((b) => (
                                        <span key={b} style={{
                                          fontSize: 11, padding: "2px 8px", borderRadius: 4,
                                          background: "rgba(176,142,255,0.12)", color: "var(--purple, #b08eff)",
                                          fontWeight: 600,
                                        }}>
                                          {inv.caseData?.biasesToFind?.find((bf) => bf.id === b)?.label || b}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Mitigations */}
                                {inv.biasReport?.mitigations?.filter((m) => m && m.length > 0).length > 0 && (
                                  <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>Mitigations</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                      {inv.biasReport.mitigations.filter((m) => m && m.length > 0).map((m, i) => (
                                        <div key={i} style={{ background: "var(--bg)", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: "var(--text2)" }}>
                                          {m}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Clues discovered */}
                                <div style={{ marginTop: 10 }}>
                                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 4 }}>
                                    Clues Discovered ({(inv.discoveredClues || []).length}/{inv.caseData?.clues?.length || 0})
                                  </div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {(inv.discoveredClues || []).map((clueId) => {
                                      const clue = inv.caseData?.clues?.find((c) => c.id === clueId);
                                      return (
                                        <span key={clueId} style={{
                                          fontSize: 10, padding: "2px 8px", borderRadius: 4,
                                          background: "rgba(245,166,35,0.12)", color: "var(--amber)",
                                          fontWeight: 600,
                                        }}>
                                          {clue?.title || clueId}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Grading buttons — only show if student has submitted */}
                {student.totalSubmitted > 0 && (
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
