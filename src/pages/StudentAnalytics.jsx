// src/pages/StudentAnalytics.jsx
// Teacher-only analytics dashboard: engagement heatmap, completion trends,
// question difficulty, at-risk student identification, grade distributions.
// No chart library — pure CSS bars and color-coded grids.

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getLevelInfo } from "../lib/gamification";
import { formatEngagementTime } from "../hooks/useEngagementTimer";

// ─── Helpers ───

const gradeColor = (g) => {
  if (g == null) return "var(--text3)";
  if (g >= 80) return "var(--green)";
  if (g >= 60) return "var(--amber)";
  return "var(--red)";
};

const engagementColor = (seconds, median) => {
  if (!seconds) return "var(--surface2)";
  const ratio = median > 0 ? seconds / median : 1;
  if (ratio >= 1.3) return "rgba(16,185,129,0.35)";   // well above avg
  if (ratio >= 0.7) return "rgba(34,211,238,0.25)";    // near avg
  if (ratio >= 0.3) return "rgba(245,166,35,0.25)";    // below avg
  return "rgba(239,68,68,0.2)";                         // very low
};

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

// ─── Component ───

export default function StudentAnalytics() {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [gamData, setGamData] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [tab, setTab] = useState("engagement");

  // ── Fetch courses ──
  useEffect(() => {
    if (userRole !== "teacher") return;
    const fetchCourses = async () => {
      const q = query(collection(db, "courses"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const c = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden);
      setCourses(c);
      if (c.length > 0) setSelectedCourse(c[0].id);
      setLoading(false);
    };
    fetchCourses();
  }, [userRole]);

  // ── Fetch all data when course changes ──
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchAll = async () => {
      setDataLoading(true);
      try {
        // Lessons
        const lessonsSnap = await getDocs(
          query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc"))
        );
        const lessonsList = lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLessons(lessonsList);

        // Users map
        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnap.forEach((d) => {
          const data = d.data();
          usersMap[d.id] = { uid: d.id, ...data };
          if (data.email) usersMap[data.email.toLowerCase()] = { uid: d.id, ...data };
        });

        // Enrolled students
        const enrollSnap = await getDocs(collection(db, "enrollments"));
        const enrolledStudents = [];
        const seen = new Set();
        enrollSnap.forEach((d) => {
          const data = d.data();
          if (data.courseId !== selectedCourse) return;
          const userMatch = data.uid ? usersMap[data.uid] : usersMap[data.email?.toLowerCase()];
          const uid = userMatch?.uid || data.uid;
          if (!uid || seen.has(uid)) return;
          seen.add(uid);
          enrolledStudents.push({
            uid,
            displayName: userMatch?.displayName || data.name || data.email || "Unknown",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            hasLoggedIn: !!userMatch,
          });
        });
        setStudents(enrolledStudents);

        // Progress for every student × lesson (includes engagementTime)
        const progress = {};
        const progressPromises = [];
        for (const student of enrolledStudents) {
          progress[student.uid] = {};
          if (!student.hasLoggedIn) continue;
          for (const lesson of lessonsList) {
            progressPromises.push(
              getDoc(doc(db, "progress", student.uid, "courses", selectedCourse, "lessons", lesson.id))
                .then((progDoc) => {
                  if (progDoc.exists()) {
                    const d = progDoc.data();
                    progress[student.uid][lesson.id] = {
                      answers: d.answers || {},
                      completed: d.completed || false,
                      completedAt: d.completedAt || null,
                      engagementTime: d.engagementTime || 0,
                    };
                  }
                })
                .catch(() => {})
            );
          }
        }
        await Promise.all(progressPromises);
        setProgressData(progress);

        // Gamification
        const gam = {};
        const gamPromises = enrolledStudents.filter((s) => s.hasLoggedIn).map((s) =>
          getDoc(doc(db, "courses", selectedCourse, "gamification", s.uid))
            .then((gamDoc) => { gam[s.uid] = gamDoc.exists() ? gamDoc.data() : {}; })
            .catch(() => { gam[s.uid] = {}; })
        );
        await Promise.all(gamPromises);
        setGamData(gam);

      } catch (err) {
        console.error("Analytics data error:", err);
      }
      setDataLoading(false);
    };
    fetchAll();
  }, [selectedCourse]);

  // ── Computed analytics ──
  const analytics = useMemo(() => {
    if (!students.length || !lessons.length) return null;

    const visibleLessons = lessons.filter((l) => l.visible !== false);
    const activeStudents = students.filter((s) => s.hasLoggedIn);

    // Per-lesson engagement medians
    const lessonEngagement = {};
    for (const lesson of visibleLessons) {
      const times = activeStudents
        .map((s) => progressData[s.uid]?.[lesson.id]?.engagementTime || 0)
        .filter((t) => t > 0);
      lessonEngagement[lesson.id] = {
        median: median(times),
        avg: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
        count: times.length,
      };
    }

    // Per-student grade computation
    const studentGrades = {};
    for (const s of activeStudents) {
      let totalEarned = 0, totalPossible = 0;
      const lessonGrades = {};
      for (const lesson of visibleLessons) {
        const prog = progressData[s.uid]?.[lesson.id];
        if (!prog) continue;
        const mc = (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "multiple_choice");
        const sa = (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "short_answer");
        let earned = 0, possible = mc.length + sa.length;
        mc.forEach((q) => { if (prog.answers[q.id]?.submitted && prog.answers[q.id]?.correct) earned += 1; });
        sa.forEach((q) => {
          const a = prog.answers[q.id];
          if (a?.writtenScore !== undefined && a?.writtenScore !== null) earned += a.writtenScore;
        });
        if (possible > 0) {
          lessonGrades[lesson.id] = Math.round((earned / possible) * 100);
          totalEarned += earned;
          totalPossible += possible;
        }
      }
      studentGrades[s.uid] = {
        overall: totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : null,
        lessons: lessonGrades,
      };
    }

    // Completion rates per lesson
    const completionRates = {};
    for (const lesson of visibleLessons) {
      const completed = activeStudents.filter((s) => progressData[s.uid]?.[lesson.id]?.completed).length;
      completionRates[lesson.id] = activeStudents.length > 0
        ? Math.round((completed / activeStudents.length) * 100)
        : 0;
    }

    // Question difficulty (MC only — which questions are students getting wrong)
    const questionDifficulty = [];
    for (const lesson of visibleLessons) {
      const mc = (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "multiple_choice");
      for (const q of mc) {
        let attempted = 0, correct = 0;
        for (const s of activeStudents) {
          const a = progressData[s.uid]?.[lesson.id]?.answers?.[q.id];
          if (a?.submitted) {
            attempted++;
            if (a.correct) correct++;
          }
        }
        if (attempted > 0) {
          questionDifficulty.push({
            lessonTitle: lesson.title,
            prompt: q.prompt,
            accuracy: Math.round((correct / attempted) * 100),
            attempted,
            correct,
          });
        }
      }
    }
    questionDifficulty.sort((a, b) => a.accuracy - b.accuracy);

    // At-risk students: low grade OR low engagement OR low completion
    const atRisk = [];
    for (const s of activeStudents) {
      const grade = studentGrades[s.uid]?.overall;
      const completedCount = visibleLessons.filter((l) => progressData[s.uid]?.[l.id]?.completed).length;
      const completionRate = visibleLessons.length > 0 ? Math.round((completedCount / visibleLessons.length) * 100) : 0;
      const totalEngagement = visibleLessons.reduce((sum, l) => sum + (progressData[s.uid]?.[l.id]?.engagementTime || 0), 0);
      const xp = gamData[s.uid]?.totalXP || 0;
      const streak = gamData[s.uid]?.currentStreak || 0;
      const reasons = [];
      if (grade !== null && grade < 60) reasons.push(`Grade: ${grade}%`);
      if (completionRate < 50 && visibleLessons.length >= 2) reasons.push(`Completion: ${completionRate}%`);
      if (totalEngagement < 120 && visibleLessons.length >= 2) reasons.push("Very low engagement");
      if (reasons.length > 0) {
        atRisk.push({ ...s, grade, completionRate, totalEngagement, xp, streak, reasons });
      }
    }
    atRisk.sort((a, b) => (a.grade ?? 0) - (b.grade ?? 0));

    // Grade distribution (histogram buckets)
    const distribution = { "0-19": 0, "20-39": 0, "40-59": 0, "60-79": 0, "80-100": 0 };
    for (const s of activeStudents) {
      const g = studentGrades[s.uid]?.overall;
      if (g == null) continue;
      if (g < 20) distribution["0-19"]++;
      else if (g < 40) distribution["20-39"]++;
      else if (g < 60) distribution["40-59"]++;
      else if (g < 80) distribution["60-79"]++;
      else distribution["80-100"]++;
    }

    return {
      visibleLessons,
      activeStudents,
      lessonEngagement,
      studentGrades,
      completionRates,
      questionDifficulty,
      atRisk,
      distribution,
    };
  }, [students, lessons, progressData, gamData]);

  if (userRole !== "teacher") {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

  const TABS = [
    { id: "engagement", label: "Engagement", icon: "⏱️" },
    { id: "completion", label: "Completion", icon: "✅" },
    { id: "difficulty", label: "Question Difficulty", icon: "🎯" },
    { id: "at-risk", label: "At-Risk Students", icon: "⚠️" },
    { id: "distribution", label: "Grade Distribution", icon: "📊" },
  ];

  return (
    <div className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            📈 Class Analytics
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>
            Engagement trends, completion patterns, and at-risk identification.
          </p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, marginBottom: 20, flexWrap: "wrap" }}>
            {courses.map((c) => (
              <button key={c.id}
                className={`top-nav-link ${selectedCourse === c.id ? "active" : ""}`}
                onClick={() => setSelectedCourse(c.id)}>
                {c.icon} {c.title}
              </button>
            ))}
          </div>
        )}

        {/* Tab selector */}
        <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, marginBottom: 24, flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.id}
              className={`top-nav-link ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}
              style={{ fontSize: 13 }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
        ) : !analytics ? (
          <div style={{ textAlign: "center", color: "var(--text3)", padding: 60 }}>No data yet.</div>
        ) : (
          <>
            {tab === "engagement" && <EngagementTab analytics={analytics} progressData={progressData} />}
            {tab === "completion" && <CompletionTab analytics={analytics} progressData={progressData} />}
            {tab === "difficulty" && <DifficultyTab analytics={analytics} />}
            {tab === "at-risk" && <AtRiskTab analytics={analytics} />}
            {tab === "distribution" && <DistributionTab analytics={analytics} />}
          </>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB: Engagement Heatmap
// ═══════════════════════════════════════════════

function EngagementTab({ analytics, progressData }) {
  const { visibleLessons, activeStudents, lessonEngagement } = analytics;

  // Sort students by total engagement (descending)
  const sorted = [...activeStudents].sort((a, b) => {
    const aTotal = visibleLessons.reduce((s, l) => s + (progressData[a.uid]?.[l.id]?.engagementTime || 0), 0);
    const bTotal = visibleLessons.reduce((s, l) => s + (progressData[b.uid]?.[l.id]?.engagementTime || 0), 0);
    return bTotal - aTotal;
  });

  return (
    <div>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 16 }}>
        Each cell shows time a student spent on a lesson. Color intensity reflects deviation from the class median.
      </p>

      {/* Legend */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, fontSize: 11, color: "var(--text3)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(239,68,68,0.2)", display: "inline-block" }} /> Very low
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(245,166,35,0.25)", display: "inline-block" }} /> Below avg
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(34,211,238,0.25)", display: "inline-block" }} /> Near avg
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 14, height: 14, borderRadius: 3, background: "rgba(16,185,129,0.35)", display: "inline-block" }} /> Above avg
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, minWidth: 140, textAlign: "left" }}>Student</th>
              {visibleLessons.map((l) => (
                <th key={l.id} style={{ ...thStyle, minWidth: 70, writingMode: "vertical-lr", textOrientation: "mixed", height: 100, paddingBottom: 8 }}
                  title={`Median: ${formatEngagementTime(lessonEngagement[l.id]?.median || 0)}`}>
                  {(l.title || "Untitled").slice(0, 20)}
                </th>
              ))}
              <th style={{ ...thStyle, minWidth: 70 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const total = visibleLessons.reduce((sum, l) => sum + (progressData[s.uid]?.[l.id]?.engagementTime || 0), 0);
              return (
                <tr key={s.uid}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>
                    {s.displayName?.split(" ")[0] || s.firstName || "—"}
                  </td>
                  {visibleLessons.map((l) => {
                    const time = progressData[s.uid]?.[l.id]?.engagementTime || 0;
                    const med = lessonEngagement[l.id]?.median || 0;
                    return (
                      <td key={l.id} style={{
                        ...tdStyle,
                        background: engagementColor(time, med),
                        textAlign: "center",
                        fontFamily: "var(--font-body)",
                        fontSize: 11,
                      }}
                        title={`${s.displayName}: ${formatEngagementTime(time)} (median: ${formatEngagementTime(med)})`}>
                        {time > 0 ? formatEngagementTime(time) : "—"}
                      </td>
                    );
                  })}
                  <td style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: "var(--cyan)" }}>
                    {formatEngagementTime(total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Footer with medians */}
          <tfoot>
            <tr>
              <td style={{ ...tdStyle, fontWeight: 700, color: "var(--text2)" }}>Median</td>
              {visibleLessons.map((l) => (
                <td key={l.id} style={{ ...tdStyle, textAlign: "center", fontWeight: 600, color: "var(--text2)" }}>
                  {formatEngagementTime(lessonEngagement[l.id]?.median || 0)}
                </td>
              ))}
              <td style={tdStyle} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB: Completion Rates
// ═══════════════════════════════════════════════

function CompletionTab({ analytics, progressData }) {
  const { visibleLessons, activeStudents, completionRates } = analytics;

  return (
    <div>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>
        Lesson completion rates across the class. Low rates may indicate lessons that are too long or confusing.
      </p>

      {/* Bar chart */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visibleLessons.map((l) => {
          const rate = completionRates[l.id] || 0;
          const completed = activeStudents.filter((s) => progressData[s.uid]?.[l.id]?.completed).length;
          return (
            <div key={l.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>
                  {l.title || "Untitled"}
                </span>
                <span style={{ fontSize: 12, color: "var(--text2)" }}>
                  {completed}/{activeStudents.length} ({rate}%)
                </span>
              </div>
              <div style={{ height: 20, background: "var(--surface2)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${rate}%`,
                  borderRadius: 6,
                  background: rate >= 80 ? "var(--green)" : rate >= 50 ? "var(--amber)" : "var(--red)",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Straggler list */}
      {(() => {
        const incomplete = [];
        for (const s of activeStudents) {
          const notDone = visibleLessons.filter((l) => !progressData[s.uid]?.[l.id]?.completed);
          if (notDone.length > 0 && notDone.length <= visibleLessons.length) {
            incomplete.push({ ...s, missing: notDone.length, lessons: notDone.map((l) => l.title).slice(0, 3) });
          }
        }
        incomplete.sort((a, b) => b.missing - a.missing);
        if (incomplete.length === 0) return null;

        return (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text2)" }}>
              Incomplete Lessons by Student
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {incomplete.slice(0, 15).map((s) => (
                <div key={s.uid} className="card" style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{s.displayName}</span>
                  <span style={{ fontSize: 12, color: "var(--amber)" }}>
                    {s.missing} missing: {s.lessons.join(", ")}{s.missing > 3 ? "..." : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB: Question Difficulty
// ═══════════════════════════════════════════════

function DifficultyTab({ analytics }) {
  const { questionDifficulty } = analytics;

  if (questionDifficulty.length === 0) {
    return <div style={{ textAlign: "center", color: "var(--text3)", padding: 60 }}>No MC question data yet.</div>;
  }

  return (
    <div>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>
        Questions sorted by accuracy (lowest first). Questions below 50% may need revisiting in class.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {questionDifficulty.map((q, i) => (
          <div key={i} className="card" style={{ padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 2 }}>{q.lessonTitle}</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {q.prompt}
                </div>
              </div>
              <div style={{
                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                color: gradeColor(q.accuracy), flexShrink: 0,
              }}>
                {q.accuracy}%
              </div>
            </div>
            <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${q.accuracy}%`,
                borderRadius: 4,
                background: gradeColor(q.accuracy),
                transition: "width 0.5s ease",
              }} />
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
              {q.correct}/{q.attempted} students correct
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB: At-Risk Students
// ═══════════════════════════════════════════════

function AtRiskTab({ analytics }) {
  const { atRisk, activeStudents } = analytics;

  return (
    <div>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>
        Students flagged for low grades (&lt;60%), low completion (&lt;50%), or very low engagement.
        {atRisk.length === 0 && " No at-risk students detected."}
      </p>

      {atRisk.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--green)" }}>
            All students are on track!
          </div>
          <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 6 }}>
            {activeStudents.length} students analyzed — no risk indicators found.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {atRisk.map((s) => (
            <div key={s.uid} className="card" style={{ padding: "14px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{s.displayName}</span>
                <span style={{
                  fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700,
                  color: gradeColor(s.grade),
                }}>
                  {s.grade != null ? `${s.grade}%` : "—"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {s.reasons.map((r, i) => (
                  <span key={i} style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6,
                    background: "rgba(239,68,68,0.1)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.2)",
                  }}>
                    {r}
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "var(--text3)" }}>
                <span>⏱️ {formatEngagementTime(s.totalEngagement)} total</span>
                <span>⚡ {s.xp} XP</span>
                <span>🔥 {s.streak}-day streak</span>
                <span>✅ {s.completionRate}% complete</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// TAB: Grade Distribution
// ═══════════════════════════════════════════════

function DistributionTab({ analytics }) {
  const { distribution, activeStudents, studentGrades, visibleLessons } = analytics;
  const maxCount = Math.max(...Object.values(distribution), 1);
  const totalGraded = Object.values(distribution).reduce((a, b) => a + b, 0);

  // Per-lesson average for trend line
  const lessonAvgs = visibleLessons.map((l) => {
    const grades = activeStudents
      .map((s) => studentGrades[s.uid]?.lessons?.[l.id])
      .filter((g) => g != null);
    return {
      title: l.title,
      avg: grades.length > 0 ? Math.round(grades.reduce((a, b) => a + b, 0) / grades.length) : null,
      count: grades.length,
    };
  });

  const bucketColors = {
    "0-19": "var(--red)",
    "20-39": "#ef4444",
    "40-59": "var(--amber)",
    "60-79": "var(--cyan)",
    "80-100": "var(--green)",
  };

  return (
    <div>
      <p style={{ color: "var(--text2)", fontSize: 13, marginBottom: 20 }}>
        Overall grade distribution across {totalGraded} graded student{totalGraded !== 1 ? "s" : ""}.
      </p>

      {/* Histogram */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 180, marginBottom: 8 }}>
        {Object.entries(distribution).map(([bucket, count]) => (
          <div key={bucket} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700,
              color: count > 0 ? "var(--text)" : "var(--text3)", marginBottom: 4,
            }}>
              {count}
            </div>
            <div style={{
              width: "100%",
              height: `${maxCount > 0 ? (count / maxCount) * 140 : 0}px`,
              minHeight: count > 0 ? 4 : 0,
              background: bucketColors[bucket],
              borderRadius: "6px 6px 0 0",
              transition: "height 0.5s ease",
              opacity: 0.8,
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {Object.keys(distribution).map((bucket) => (
          <div key={bucket} style={{ flex: 1, textAlign: "center", fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>
            {bucket}%
          </div>
        ))}
      </div>

      {/* Per-lesson averages */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, marginBottom: 12, color: "var(--text2)" }}>
          Average Grade by Lesson
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lessonAvgs.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 500, minWidth: 180, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {l.title}
              </span>
              <div style={{ flex: 1, height: 16, background: "var(--surface2)", borderRadius: 4, overflow: "hidden" }}>
                {l.avg != null && (
                  <div style={{
                    height: "100%", width: `${l.avg}%`, borderRadius: 4,
                    background: gradeColor(l.avg), transition: "width 0.5s ease",
                  }} />
                )}
              </div>
              <span style={{
                fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700,
                color: l.avg != null ? gradeColor(l.avg) : "var(--text3)", minWidth: 40, textAlign: "right",
              }}>
                {l.avg != null ? `${l.avg}%` : "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Shared table styles ───
const thStyle = {
  padding: "8px 6px",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--text3)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: "1px solid var(--border)",
};
const tdStyle = {
  padding: "6px 6px",
  fontSize: 12,
  borderBottom: "1px solid var(--surface2)",
  color: "var(--text)",
};
