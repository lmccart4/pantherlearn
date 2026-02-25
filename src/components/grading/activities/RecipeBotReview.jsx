// src/components/grading/activities/RecipeBotReview.jsx
// ─────────────────────────────────────────────────────────────
// Teacher review component for RecipeBot Data Curation Lab.
// Shows all student submissions with expandable detail panels.
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function RecipeBotReview({ activity, studentMap }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const snap = await getDocs(collection(db, activity.collection));
        const subs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        subs.sort((a, b) => {
          const aTime = a[activity.timestampField]?.toDate?.() || new Date(0);
          const bTime = b[activity.timestampField]?.toDate?.() || new Date(0);
          return bTime - aTime;
        });
        setSubmissions(subs);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [activity]);

  const getName = (sub) => {
    const uid = sub[activity.userIdField];
    if (studentMap[uid]?.displayName) return studentMap[uid].displayName;
    return sub.displayName || sub.email || uid?.slice(0, 8) + "...";
  };

  const getPhoto = (sub) => {
    const uid = sub[activity.userIdField];
    return studentMap[uid]?.photoURL || "";
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const getStageProgress = (sub) => {
    const completed = sub.stageCompleted || {};
    return Object.values(completed).filter(Boolean).length;
  };

  const getCleaningAccuracy = (sub) => {
    const decisions = Object.values(sub.cleaningDecisions || {});
    if (decisions.length === 0) return "—";
    const correct = decisions.filter((d) => d.isCorrect).length;
    return `${correct}/${decisions.length} (${Math.round((correct / decisions.length) * 100)}%)`;
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (submissions.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 60 }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🤖🍳</div>
        <p style={{ fontSize: 16, fontWeight: 600 }}>No submissions yet</p>
        <p style={{ color: "var(--text2)", fontSize: 14, marginTop: 8 }}>
          Student submissions will appear here once they start the lab.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Submissions", value: submissions.length },
          { label: "Completed", value: submissions.filter((s) => activity.completionCheck(s)).length, color: "var(--green)" },
          {
            label: "Avg Score",
            value: submissions.length > 0
              ? Math.round(submissions.reduce((sum, s) => sum + activity.scoreCalculator(s), 0) / submissions.length)
              : 0,
          },
          {
            label: "Used Problematic Sources",
            value: submissions.filter((s) => (s.selectedSources || []).some((src) => src.category === "problematic")).length,
            color: "var(--red)",
          },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: stat.color || "var(--text)" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Student list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {submissions.map((sub) => {
          const score = activity.scoreCalculator(sub);
          const isExpanded = expandedStudent === sub.id;
          const stagesComplete = getStageProgress(sub);

          return (
            <div key={sub.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
              {/* Header row */}
              <button
                onClick={() => { setExpandedStudent(isExpanded ? null : sub.id); setExpandedSection(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  fontFamily: "var(--font-body)", textAlign: "left",
                }}
              >
                {getPhoto(sub) ? (
                  <img src={getPhoto(sub)} alt="" style={{ width: 32, height: 32, borderRadius: "50%" }} referrerPolicy="no-referrer" />
                ) : (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    {getName(sub).charAt(0)}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{getName(sub)}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    {stagesComplete}/5 stages · {formatDate(sub[activity.timestampField])}
                  </div>
                </div>
                <div style={{
                  fontSize: 18, fontWeight: 700, fontFamily: "var(--font-display)",
                  color: score >= 70 ? "var(--green)" : score >= 50 ? "var(--amber)" : "var(--red)",
                  minWidth: 50, textAlign: "right",
                }}>
                  {score}
                </div>
                <span style={{ fontSize: 12, color: "var(--text3)", marginLeft: 4 }}>/100</span>
                <span style={{
                  fontSize: 16, color: "var(--text3)", marginLeft: 8,
                  transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                }}>▼</span>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "0 16px 16px" }}>
                  {/* Section toggles */}
                  {[
                    { key: "sources", label: "📂 Source Selection", count: (sub.selectedSources || []).length + " sources" },
                    { key: "bias", label: "🔍 Bias Analysis" },
                    { key: "cleaning", label: "🧹 Data Cleaning", count: getCleaningAccuracy(sub) },
                    { key: "testing", label: "🤖 Model Testing", count: (sub.testResults || []).length + " prompts tested" },
                    { key: "reflections", label: "💭 Reflections" },
                  ].map((section) => (
                    <div key={section.key}>
                      <button
                        onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", padding: "12px 0", background: "none", border: "none",
                          borderBottom: "1px solid var(--border)", cursor: "pointer",
                          fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 500,
                        }}
                      >
                        <span>{section.label}</span>
                        <span style={{ fontSize: 12, color: "var(--text3)" }}>
                          {section.count || ""} {expandedSection === section.key ? "▲" : "▼"}
                        </span>
                      </button>

                      {expandedSection === section.key && (
                        <div style={{ padding: "12px 0", fontSize: 13, lineHeight: 1.6 }}>
                          {section.key === "sources" && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {(sub.selectedSources || []).map((s, i) => (
                                <span key={i} style={{
                                  padding: "4px 10px", borderRadius: 6, fontSize: 12,
                                  background: s.category === "problematic" ? "var(--red-dim, #fde8e8)" : "var(--bg)",
                                  color: s.category === "problematic" ? "var(--red)" : "var(--text)",
                                  border: "1px solid " + (s.category === "problematic" ? "var(--red)" : "var(--border)"),
                                }}>
                                  {s.name || s.id} ({s.cost} credits)
                                </span>
                              ))}
                              {(sub.selectedSources || []).length === 0 && (
                                <span style={{ color: "var(--text3)", fontStyle: "italic" }}>No sources selected</span>
                              )}
                            </div>
                          )}

                          {section.key === "bias" && (
                            <div style={{ background: "var(--bg)", borderRadius: 8, padding: 14 }}>
                              {sub.biasNotes || <span style={{ color: "var(--text3)", fontStyle: "italic" }}>No bias analysis written</span>}
                            </div>
                          )}

                          {section.key === "cleaning" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                              {Object.entries(sub.cleaningDecisions || {}).map(([sampleId, decision]) => (
                                <div key={sampleId} style={{
                                  display: "flex", alignItems: "center", gap: 8, fontSize: 12,
                                  padding: "6px 10px", borderRadius: 6, background: "var(--bg)",
                                }}>
                                  <span style={{ color: decision.isCorrect ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                                    {decision.isCorrect ? "✓" : "✗"}
                                  </span>
                                  <span style={{ flex: 1 }}>Sample {sampleId}</span>
                                  <span style={{ color: "var(--text3)" }}>
                                    Flagged: {decision.selectedIssue || "none"}
                                  </span>
                                </div>
                              ))}
                              {Object.keys(sub.cleaningDecisions || {}).length === 0 && (
                                <span style={{ color: "var(--text3)", fontStyle: "italic" }}>No cleaning decisions made</span>
                              )}
                            </div>
                          )}

                          {section.key === "testing" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {(sub.testResults || []).map((result, i) => (
                                <div key={i} style={{ background: "var(--bg)", borderRadius: 8, padding: 12 }}>
                                  <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 6, color: "var(--text2)" }}>
                                    Prompt: "{result.prompt}"
                                  </div>
                                  <div style={{ fontSize: 13, whiteSpace: "pre-wrap" }}>{result.response}</div>
                                </div>
                              ))}
                              {(sub.testResults || []).length === 0 && (
                                <span style={{ color: "var(--text3)", fontStyle: "italic" }}>No prompts tested</span>
                              )}
                            </div>
                          )}

                          {section.key === "reflections" && (
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                              {Object.entries(sub.reflections || {}).filter(([, v]) => v && v.trim()).map(([key, value]) => (
                                <div key={key} style={{ background: "var(--bg)", borderRadius: 8, padding: 12 }}>
                                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4, textTransform: "capitalize" }}>
                                    {key.replace(/_/g, " ")}
                                  </div>
                                  <div style={{ fontSize: 13 }}>{value}</div>
                                </div>
                              ))}
                              {Object.values(sub.reflections || {}).filter((r) => r && r.trim()).length === 0 && (
                                <span style={{ color: "var(--text3)", fontStyle: "italic" }}>No reflections written</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
