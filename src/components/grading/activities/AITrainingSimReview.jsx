// src/components/grading/activities/AITrainingSimReview.jsx
// Review component for AI Training Simulator activity in the Grading Dashboard.

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, setDoc, getDoc } from "firebase/firestore";
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

export default function AITrainingSimReview({ activity, studentMap }) {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState({});
  const [grading, setGrading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(
          query(collection(db, "aiTrainingSim"), orderBy("completedAt", "desc"))
        );

        const subs = [];
        snap.forEach((d) => {
          const data = d.data();
          if (data.submitted) subs.push({ id: d.id, ...data });
        });
        setSubmissions(subs);

        // Fetch existing grades
        const existingGrades = {};
        for (const sub of subs) {
          try {
            const coursesSnap = await getDocs(collection(db, "progress", sub.uid, "courses"));
            for (const courseDoc of coursesSnap.docs) {
              try {
                const gradeDoc = await getDoc(doc(db, "progress", sub.uid, "courses", courseDoc.id, "activities", "ai-training-sim"));
                if (gradeDoc.exists()) {
                  existingGrades[sub.uid] = {
                    score: gradeDoc.data().activityScore,
                    label: gradeDoc.data().activityLabel,
                    courseId: courseDoc.id,
                  };
                  break;
                }
              } catch { /* no grade */ }
            }
          } catch { /* no progress */ }
        }
        setGrades(existingGrades);
      } catch (err) {
        console.error("Error fetching AI Training Sim data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleGrade = async (uid, tier) => {
    if (grading) return;
    setGrading(uid);
    try {
      const sub = submissions.find((s) => s.uid === uid);
      const courseId = grades[uid]?.courseId || sub?.courseId;
      if (!courseId) {
        alert("Cannot determine course for this student.");
        setGrading(null);
        return;
      }

      const gradeRef = doc(db, "progress", uid, "courses", courseId, "activities", "ai-training-sim");
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "ai-training-sim",
        activityTitle: "AI Training Simulator",
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label, courseId } }));

      try {
        const config = await getXPConfig(courseId);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) await awardXP(uid, xpAmount, `activity_grade:ai-training-sim:${tier.label.toLowerCase()}`, courseId);
      } catch (xpErr) { console.warn("Could not award activity XP:", xpErr); }

      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `AI Training Sim graded: ${tier.label}`,
          body: `Your AI Training Simulator work received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "\uD83E\uDDE0",
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

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Completions", value: submissions.length, color: "var(--text)" },
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
          <div style={{ fontSize: 36, marginBottom: 12 }}>{"\uD83E\uDDE0"}</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No AI Training Simulator completions yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>
            Students can access at <span style={{ color: "var(--amber)", fontWeight: 600 }}>ai-training-sim-paps.firebaseapp.com</span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {submissions.map((sub) => {
            const tier = currentTier(sub.uid);
            const completedAt = sub.completedAt?.toDate?.() || sub.completedAt;

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
                <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 12 }}>
                  <div><span style={{ color: "var(--text3)" }}>Status: </span><span style={{ fontWeight: 700, color: "var(--green)" }}>Completed</span></div>
                  {completedAt && (
                    <div><span style={{ color: "var(--text3)" }}>Completed: </span><span style={{ fontWeight: 600, color: "var(--text2)" }}>
                      {new Date(completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </span></div>
                  )}
                </div>

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
