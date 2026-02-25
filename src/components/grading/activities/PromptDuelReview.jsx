// src/components/grading/activities/PromptDuelReview.jsx
// Review component for Prompt Duel activity in the Grading Dashboard.
// Loaded lazily via the activity registry.

import { useState, useEffect } from "react";
import { collection, getDocs, query, where, orderBy, doc, setDoc, getDoc } from "firebase/firestore";
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

export default function PromptDuelReview({ activity, studentMap }) {
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState([]); // aggregated per-student
  const [grades, setGrades] = useState({}); // { uid: { score, label } }
  const [grading, setGrading] = useState(null);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const [studentHistory, setStudentHistory] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const histSnap = await getDocs(
          query(collection(db, "promptDuelHistory"), orderBy("playedAt", "desc"))
        );

        // Aggregate by student UID
        const byStudent = {};
        histSnap.forEach((d) => {
          const data = d.data();
          const uid = data.uid;
          if (!uid) return;
          if (!byStudent[uid]) {
            byStudent[uid] = {
              uid,
              playerName: data.playerName || "Unknown",
              email: data.email || "",
              photoURL: data.photoURL || "",
              gamesPlayed: 0,
              bestScore: 0,
              totalXP: 0,
              lastPlayed: null,
              bestRank: Infinity,
              games: [],
            };
          }
          byStudent[uid].gamesPlayed += 1;
          byStudent[uid].bestScore = Math.max(byStudent[uid].bestScore, data.totalScore || 0);
          byStudent[uid].totalXP += data.xpEarned || 0;
          if (data.rank && data.rank < byStudent[uid].bestRank) byStudent[uid].bestRank = data.rank;
          const playedAt = data.playedAt?.toDate?.() || data.playedAt;
          if (!byStudent[uid].lastPlayed || (playedAt && playedAt > byStudent[uid].lastPlayed)) {
            byStudent[uid].lastPlayed = playedAt;
          }
          byStudent[uid].games.push({ id: d.id, ...data, playedAt });
        });

        const sorted = Object.values(byStudent).sort((a, b) => b.bestScore - a.bestScore);
        setGameData(sorted);

        const histMap = {};
        sorted.forEach((s) => { histMap[s.uid] = s.games; });
        setStudentHistory(histMap);

        // Fetch existing grades — check all courses since Prompt Duel is cross-course
        const existingGrades = {};
        for (const student of sorted) {
          try {
            // Try fetching from all courses the student might be enrolled in
            const coursesSnap = await getDocs(collection(db, "progress", student.uid, "courses"));
            for (const courseDoc of coursesSnap.docs) {
              try {
                const gradeDoc = await getDoc(doc(db, "progress", student.uid, "courses", courseDoc.id, "activities", "prompt-duel"));
                if (gradeDoc.exists()) {
                  existingGrades[student.uid] = {
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
        console.error("Error fetching Prompt Duel data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleGrade = async (uid, tier) => {
    if (grading) return;
    setGrading(uid);
    try {
      // Determine the courseId — use existing grade's course, or the student's game courseId
      const existingCourseId = grades[uid]?.courseId;
      const gameCourseId = studentHistory[uid]?.[0]?.courseId;
      const courseId = existingCourseId || gameCourseId;

      if (!courseId) {
        alert("Cannot determine course for this student. Make sure they selected a course when playing.");
        setGrading(null);
        return;
      }

      const gradeRef = doc(db, "progress", uid, "courses", courseId, "activities", "prompt-duel");
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "prompt-duel",
        activityTitle: "Prompt Duel",
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label, courseId } }));

      // Award XP
      try {
        const config = await getXPConfig(courseId);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) {
          await awardXP(uid, xpAmount, `activity_grade:prompt-duel:${tier.label.toLowerCase()}`, courseId);
        }
      } catch (xpErr) {
        console.warn("Could not award activity XP:", xpErr);
      }

      // Notify student
      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `Prompt Duel graded: ${tier.label}`,
          body: `Your Prompt Duel performance received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "⚔️",
          courseId,
        });
      } catch { /* non-critical */ }
    } catch (err) {
      console.error("Failed to save grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setGrading(null);
  };

  const getName = (uid) => studentMap[uid]?.displayName || gameData.find((g) => g.uid === uid)?.playerName || uid.slice(0, 8) + "...";
  const getPhoto = (uid) => studentMap[uid]?.photoURL || gameData.find((g) => g.uid === uid)?.photoURL || "";
  const getEmail = (uid) => studentMap[uid]?.email || gameData.find((g) => g.uid === uid)?.email || "";

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
  const ungraded = gameData.length - graded;

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Students", value: gameData.length, color: "var(--text)" },
          { label: "Total Games", value: gameData.reduce((s, d) => s + d.gamesPlayed, 0), color: "var(--text)" },
          { label: "Graded", value: graded, color: "var(--green)" },
          { label: "Needs Review", value: ungraded, color: ungraded > 0 ? "var(--amber)" : "var(--text3)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {gameData.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚔️</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No Prompt Duel games yet</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>
            Students can play at <span style={{ color: "var(--amber)", fontWeight: 600 }}>prompt-duel-paps.web.app</span>
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {gameData.map((student) => {
            const tier = currentTier(student.uid);
            const isExpanded = expandedStudent === student.uid;
            const games = studentHistory[student.uid] || [];

            return (
              <div key={student.uid} className="card" style={{
                padding: "16px 20px",
                borderColor: tier ? undefined : "rgba(245,166,35,0.15)",
              }}>
                {/* Student header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {getPhoto(student.uid) ? (
                      <img src={getPhoto(student.uid)} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text3)" }}>👤</div>
                    )}
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{getName(student.uid)}</span>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{getEmail(student.uid)}</div>
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
                <div style={{ display: "flex", gap: 20, marginBottom: 12, fontSize: 12 }}>
                  <div><span style={{ color: "var(--text3)" }}>Games: </span><span style={{ fontWeight: 700 }}>{student.gamesPlayed}</span></div>
                  <div><span style={{ color: "var(--text3)" }}>Best Score: </span><span style={{ fontWeight: 700, color: "var(--amber)" }}>{student.bestScore}</span></div>
                  <div><span style={{ color: "var(--text3)" }}>XP Earned: </span><span style={{ fontWeight: 700, color: "var(--amber)" }}>⚡ {student.totalXP}</span></div>
                  {student.lastPlayed && (
                    <div><span style={{ color: "var(--text3)" }}>Last: </span><span style={{ fontWeight: 600, color: "var(--text2)" }}>
                      {new Date(student.lastPlayed).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span></div>
                  )}
                  <button onClick={() => setExpandedStudent(isExpanded ? null : student.uid)}
                    style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--amber)", fontSize: 11, fontWeight: 600, cursor: "pointer", padding: "2px 8px" }}>
                    {isExpanded ? "▲ Hide" : "▼ History"}
                  </button>
                </div>

                {/* Expanded game history */}
                {isExpanded && games.length > 0 && (
                  <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text2)", marginBottom: 8 }}>Game History</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {games.slice(0, 10).map((game, i) => (
                        <div key={game.id || i} style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "8px 12px", borderRadius: 6, background: "var(--surface)",
                          border: "1px solid var(--border)", fontSize: 12,
                        }}>
                          <div style={{ display: "flex", gap: 16 }}>
                            <span style={{ color: "var(--text3)" }}>
                              {game.playedAt ? new Date(game.playedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—"}
                            </span>
                            <span style={{ fontWeight: 600 }}>Score: {game.totalScore}</span>
                            <span style={{ color: "var(--text3)" }}>Rank: #{game.rank}/{game.totalPlayers}</span>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            {(game.rounds || []).map((r, ri) => (
                              <span key={ri} style={{
                                fontSize: 10, padding: "1px 6px", borderRadius: 4,
                                background: r.bestScore >= 7 ? "rgba(16,185,129,0.12)" : r.bestScore >= 4 ? "rgba(245,166,35,0.12)" : "rgba(239,68,68,0.12)",
                                color: r.bestScore >= 7 ? "var(--green)" : r.bestScore >= 4 ? "var(--amber)" : "#ef4444",
                                fontWeight: 600,
                              }}>R{r.round}: {r.bestScore}/10</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grading buttons */}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
