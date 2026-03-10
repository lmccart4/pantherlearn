// src/components/grading/activities/MomentumMysteryLabReview.jsx
// Read-only teacher view for Momentum Mystery Lab in the Grading Dashboard.
// Grades are auto-computed from XP — no manual grading needed.

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getCourseAttempts, xpToGrade } from "../../../lib/momentumStore";

// Maps activityScore to a color for display
function gradeColor(score) {
  if (score >= 1.0) return "var(--green)";
  if (score >= 0.8) return "var(--cyan)";
  if (score >= 0.6) return "var(--amber)";
  return "#ef4444";
}

function gradeBackground(score) {
  if (score >= 1.0) return "rgba(16,185,129,0.12)";
  if (score >= 0.8) return "rgba(34,211,238,0.12)";
  if (score >= 0.6) return "rgba(245,166,35,0.12)";
  return "rgba(239,68,68,0.12)";
}

export default function MomentumMysteryLabReview({ activity, studentMap, courseId }) {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState([]);
  const [grades, setGrades] = useState({});

  useEffect(() => {
    if (!courseId) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const raw = await getCourseAttempts(db, courseId);
        const sorted = raw.sort((a, b) => (b.bestXP ?? 0) - (a.bestXP ?? 0));
        setAttempts(sorted);

        // Fetch existing gradebook entries for display
        const existingGrades = {};
        for (const attempt of sorted) {
          const uid = attempt.studentId;
          if (!uid) continue;
          try {
            const gradeDoc = await getDoc(
              doc(db, "progress", uid, "courses", courseId, "activities", "momentum-mystery-lab")
            );
            if (gradeDoc.exists()) existingGrades[uid] = gradeDoc.data();
          } catch { /* no grade yet */ }
        }
        setGrades(existingGrades);
      } catch (err) {
        console.error("Error fetching Momentum Mystery Lab data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [courseId]);

  const getName = (attempt) =>
    studentMap?.[attempt.studentId]?.displayName || attempt.studentName || attempt.studentId?.slice(0, 8) + "...";
  const getPhoto = (attempt) => studentMap?.[attempt.studentId]?.photoURL || "";

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" style={{ height: 80 }} />)}
      </div>
    );
  }

  const synced = attempts.filter((a) => a.activityScore != null).length;
  const withBadge = attempts.filter((a) => a.badgeEarned).length;
  const avgXP = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.bestXP ?? 0), 0) / attempts.length)
    : 0;

  return (
    <div>
      {/* Summary stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Students", value: attempts.length, color: "var(--text)" },
          { label: "Synced", value: synced, color: "var(--text)" },
          { label: "Avg Best XP", value: avgXP, color: "var(--amber)" },
          { label: "Badge Earned", value: withBadge, color: "var(--green)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {attempts.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🔭</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No Momentum Mystery Lab attempts yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>
            Student scores will appear here after they sync their results.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {attempts.map((attempt) => {
            const uid = attempt.studentId;
            const grade = grades[uid];
            const score = grade?.activityScore ?? attempt.activityScore;
            const label = grade?.activityLabel ?? attempt.activityLabel;
            const bestXP = attempt.bestXP ?? 0;
            const cleared = attempt.cleared ?? 0;
            const synced = score != null;
            const completedAt = attempt.completedAt?.toDate?.() || attempt.completedAt;

            return (
              <div key={uid} className="card" style={{ padding: "16px 20px" }}>
                {/* Header row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {getPhoto(attempt) ? (
                      <img src={getPhoto(attempt)} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} referrerPolicy="no-referrer" />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text3)" }}>👤</div>
                    )}
                    <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{getName(attempt)}</span>
                  </div>
                  {synced ? (
                    <span style={{
                      fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600,
                      color: gradeColor(score), background: gradeBackground(score),
                    }}>
                      {label}
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--surface2)", color: "var(--text3)", fontWeight: 600 }}>
                      Not synced
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", gap: 20, fontSize: 12, flexWrap: "wrap", color: "var(--text2)" }}>
                  <div>
                    <span style={{ color: "var(--text3)" }}>Best XP: </span>
                    <span style={{ fontWeight: 700, color: "var(--amber)" }}>{bestXP}</span>
                    <span style={{ color: "var(--text3)", fontSize: 11 }}> / 750</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text3)" }}>Cases Cleared: </span>
                    <span style={{ fontWeight: 700 }}>{cleared}/5</span>
                  </div>
                  <div>
                    <span style={{ color: "var(--text3)" }}>Attempts: </span>
                    <span style={{ fontWeight: 700 }}>{attempt.attemptNumber ?? 1}</span>
                  </div>
                  {attempt.badgeEarned && (
                    <div style={{ color: "var(--green)", fontWeight: 600 }}>🔭 Momentum Detective</div>
                  )}
                  {completedAt && (
                    <div style={{ marginLeft: "auto" }}>
                      <span style={{ color: "var(--text3)" }}>Synced: </span>
                      <span style={{ fontWeight: 600, color: "var(--text2)" }}>
                        {new Date(completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  )}
                </div>

                {/* XP bar */}
                {synced && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{ height: 6, borderRadius: 3, background: "var(--surface2)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(100, (bestXP / 750) * 100)}%`,
                        background: gradeColor(score),
                        borderRadius: 3,
                        transition: "width 0.4s ease",
                      }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 16, textAlign: "center" }}>
        Grades are auto-computed from best XP. Students must click &quot;Sync to PantherLearn&quot; in the game to record their score.
      </p>
    </div>
  );
}
