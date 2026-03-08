// src/pages/MyGrades.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getStudentEnrolledCourseIds } from "../lib/enrollment";
import { getLevelInfo, getStudentGamification } from "../lib/gamification";

const WRITTEN_LABELS = {
  0: { label: "Missing", color: "var(--text3)" },
  0.55: { label: "Emerging", color: "#ef4444" },
  0.65: { label: "Approaching", color: "var(--amber)" },
  0.85: { label: "Developing", color: "var(--cyan)" },
  1.0: { label: "Refining", color: "var(--green)" },
};

export default function MyGrades() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [reflections, setReflections] = useState({});
  const [activityData, setActivityData] = useState({}); // { activityId: { activityScore, activityLabel, activityTitle, ... } }
  const [gamification, setGamification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);

  // Fetch enrolled courses
  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      try {
        const enrolledIds = await getStudentEnrolledCourseIds(user.uid);
        const q = query(collection(db, "courses"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const enrolled = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((c) => !c.hidden && enrolledIds.has(c.id));
        setCourses(enrolled);
        if (enrolled.length > 0) setSelectedCourse(enrolled[0].id);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [user]);

  // Fetch lesson data + progress when course changes
  useEffect(() => {
    if (!selectedCourse || !user) return;
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Lessons (visible only)
        const lessonsSnap = await getDocs(
          query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc"))
        );
        const lessonsList = lessonsSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((l) => l.visible !== false);
        setLessons(lessonsList);

        // Progress for each lesson
        const progress = {};
        const promises = lessonsList.map((lesson) =>
          getDoc(doc(db, "progress", user.uid, "courses", selectedCourse, "lessons", lesson.id))
            .then((progDoc) => {
              progress[lesson.id] = {
                answers: progDoc.exists() ? (progDoc.data().answers || {}) : {},
                completed: progDoc.exists() ? !!progDoc.data().completed : false,
              };
            })
            .catch(() => { progress[lesson.id] = { answers: {}, completed: false }; })
        );
        await Promise.all(promises);
        setProgressData(progress);

        // Reflections — query only this student's reflections (enforced by Firestore rules)
        const refMap = {};
        try {
          const refsSnap = await getDocs(
            query(
              collection(db, "courses", selectedCourse, "reflections"),
              where("studentId", "==", user.uid)
            )
          );
          refsSnap.forEach((d) => {
            const data = d.data();
            refMap[data.lessonId] = data;
          });
        } catch (e) { /* no reflections yet */ }
        setReflections(refMap);

        // Activity grades (Bias Detective, Prompt Duel, Weekly Evidence, etc.)
        const actMap = {};
        try {
          const actSnap = await getDocs(
            collection(db, "progress", user.uid, "courses", selectedCourse, "activities")
          );
          actSnap.forEach((d) => { actMap[d.id] = d.data(); });
        } catch (e) { /* no activities yet */ }
        setActivityData(actMap);

        // Gamification
        try {
          const gData = await getStudentGamification(user.uid, selectedCourse);
          setGamification(gData);
        } catch (e) { setGamification(null); }

      } catch (err) {
        console.error("Error fetching grade data:", err);
      }
      setDataLoading(false);
    };
    fetchData();
  }, [selectedCourse, user]);

  // --- Helpers ---
  const getMCQuestions = (lesson) =>
    (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "multiple_choice");

  const getSAQuestions = (lesson) =>
    (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "short_answer");

  // Does this lesson have a reflection? (only if lesson has been completed by this student)
  const lessonHasReflection = (lessonId) => {
    return progressData[lessonId]?.completed;
  };

  const getLessonGrade = (lessonId) => {
    const answers = progressData[lessonId]?.answers || {};
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return null;

    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);
    const hasReflection = lessonHasReflection(lessonId);

    let totalPoints = mc.length + sa.length + (hasReflection ? 1 : 0);
    if (totalPoints === 0) return null;

    let earnedPoints = 0;

    // MC: 1 point each if correct
    mc.forEach((q) => {
      if (answers[q.id]?.submitted && answers[q.id]?.correct) earnedPoints += 1;
    });

    // Written: writtenScore (0 to 1) per question, only if graded
    sa.forEach((q) => {
      const a = answers[q.id];
      if (a?.writtenScore !== undefined && a?.writtenScore !== null) {
        earnedPoints += a.writtenScore;
      }
      // If not yet graded, it still counts in totalPoints (so grade shows impact of ungraded work)
    });

    // Reflection: 1 point if valid
    if (hasReflection) {
      const ref = reflections[lessonId];
      if (ref?.valid) earnedPoints += 1;
    }

    return {
      earnedPoints,
      totalPoints,
      grade: Math.round((earnedPoints / totalPoints) * 100),
      mc, sa, hasReflection,
    };
  };

  const getOverall = () => {
    let totalPoints = 0, earnedPoints = 0;
    lessons.forEach((lesson) => {
      const result = getLessonGrade(lesson.id);
      if (result) {
        totalPoints += result.totalPoints;
        earnedPoints += result.earnedPoints;
      }
    });
    // Include activity & weekly evidence grades (same logic as StudentProgress)
    Object.entries(activityData).forEach(([actId, data]) => {
      if (data.activityScore !== null && data.activityScore !== undefined) {
        earnedPoints += data.activityScore;
        totalPoints += 1;
      }
    });
    if (totalPoints === 0) return null;
    return { totalPoints, earnedPoints, grade: Math.round((earnedPoints / totalPoints) * 100) };
  };

  const getCompletionCount = () =>
    lessons.filter((l) => progressData[l.id]?.completed).length;

  const getReflectionCount = () =>
    Object.values(reflections).filter((r) => r.valid).length;

  const gradeColor = (grade) => {
    if (grade === null || grade === undefined) return "var(--text3)";
    if (grade >= 80) return "var(--green)";
    if (grade >= 60) return "var(--amber)";
    return "var(--red)";
  };

  if (loading) {
    return (
      <main id="main-content" className="page-wrapper page-wrapper--narrow">
        <div className="page-header">
          <div className="skeleton skeleton-line" style={{ width: 180, height: 28, marginBottom: 8 }} />
          <div className="skeleton skeleton-line" style={{ width: 280, height: 14 }} />
        </div>
        <div className="mg-stats">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton-card" style={{ height: 90 }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton skeleton-card" style={{ height: 56, marginBottom: 8, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
            <div className="skeleton skeleton-line" style={{ width: `${40 + i * 6}%`, height: 14, marginBottom: 0 }} />
            <div style={{ marginLeft: "auto" }}>
              <div className="skeleton skeleton-rect" style={{ width: 48, height: 24, borderRadius: 12 }} />
            </div>
          </div>
        ))}
      </main>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="page-wrapper empty-state" style={{ paddingTop: 120 }}>
        <div className="empty-state-icon">📊</div>
        <h2 className="empty-state-title">No Courses Yet</h2>
        <p className="empty-state-text">Join a course to see your grades here.</p>
      </div>
    );
  }

  const overall = getOverall();
  const completedCount = getCompletionCount();
  const reflectionCount = getReflectionCount();
  const level = gamification ? getLevelInfo(gamification.totalXP || 0) : null;

  // Group lessons by unit
  const unitGroups = [];
  let currentUnit = null;
  let currentGroup = null;
  for (const lesson of lessons) {
    const unit = lesson.unit || "General";
    if (unit !== currentUnit) {
      currentUnit = unit;
      currentGroup = { unit, lessons: [] };
      unitGroups.push(currentGroup);
    }
    currentGroup.lessons.push(lesson);
  }

  return (
    <main id="main-content" className="page-wrapper page-wrapper--narrow">

        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">📊 My Grades</h1>
          <p className="page-subtitle">Track your progress and grades across your courses.</p>
        </div>

        {/* Course tabs */}
        {courses.length > 1 && (
          <div className="tab-bar" style={{ marginBottom: 24 }}>
            {courses.map((c) => (
              <button
                key={c.id}
                className={`tab-item ${selectedCourse === c.id ? "active" : ""}`}
                onClick={() => setSelectedCourse(c.id)}
              >
                {c.icon || "📚"} {c.title}
              </button>
            ))}
          </div>
        )}

        {dataLoading ? (
          <div>
            <div className="mg-stats">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton skeleton-card" style={{ height: 90 }} />
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-card" style={{ height: 56, marginBottom: 8 }} />
            ))}
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div className="mg-stats">
              <div className="card mg-stat">
                <div className="mg-stat-icon">📊</div>
                <div className="mg-stat-value" style={{ color: overall ? gradeColor(overall.grade) : "var(--text3)" }}>
                  {overall ? `${overall.grade}%` : "—"}
                </div>
                <div className="mg-stat-label">Overall Grade</div>
              </div>
              <div className="card mg-stat">
                <div className="mg-stat-icon">✅</div>
                <div className="mg-stat-value" style={{ color: "var(--cyan)" }}>
                  {completedCount}/{lessons.length}
                </div>
                <div className="mg-stat-label">Lessons Done</div>
              </div>
              <div className="card mg-stat">
                <div className="mg-stat-icon">💭</div>
                <div className="mg-stat-value" style={{ color: reflectionCount > 0 ? "var(--green)" : "var(--text3)" }}>
                  {reflectionCount}/{completedCount || 0}
                </div>
                <div className="mg-stat-label">Reflections</div>
              </div>
              {level && (
                <div className="card mg-stat">
                  <div className="mg-stat-icon">⚡</div>
                  <div className="mg-stat-value" style={{ color: "var(--amber)" }}>
                    {gamification?.totalXP || 0}
                  </div>
                  <div className="mg-stat-label">Total XP</div>
                </div>
              )}
            </div>

            {/* Lesson breakdown by unit */}
            {unitGroups.map((group) => (
              <div key={group.unit} className="mg-unit-group">
                <h3 className="mg-unit-title">{group.unit}</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {group.lessons.map((lesson) => {
                    const result = getLessonGrade(lesson.id);
                    const prog = progressData[lesson.id] || {};
                    const answers = prog.answers || {};
                    const reflection = reflections[lesson.id];
                    const mc = getMCQuestions(lesson);
                    const sa = getSAQuestions(lesson);

                    const mcAnswered = mc.filter((q) => answers[q.id]?.submitted).length;
                    const mcCorrect = mc.filter((q) => answers[q.id]?.submitted && answers[q.id]?.correct).length;
                    const saGraded = sa.filter((q) => answers[q.id]?.writtenScore !== undefined && answers[q.id]?.writtenScore !== null).length;
                    const saSubmitted = sa.filter((q) => answers[q.id]?.submitted).length;

                    return (
                      <div key={lesson.id} className="card mg-lesson-card">
                        <div className="mg-lesson-header">
                          <div className="mg-lesson-info">
                            <div className="mg-lesson-title-row">
                              {prog.completed && <span style={{ fontSize: 14 }}>✅</span>}
                              <div className="mg-lesson-title">{lesson.title}</div>
                            </div>
                            <div className="mg-lesson-meta">
                              {mc.length > 0 && (
                                <span>{mcCorrect}/{mc.length} MC correct</span>
                              )}
                              {sa.length > 0 && (
                                <span>
                                  {saGraded}/{sa.length} written graded
                                  {saSubmitted > saGraded && (
                                    <span style={{ color: "var(--amber)" }}> · {saSubmitted - saGraded} pending</span>
                                  )}
                                </span>
                              )}
                              {reflection && (
                                <span style={{ color: reflection.valid ? "var(--green)" : "var(--red)" }}>
                                  {reflection.valid ? "💭 Reflected" : "💭 Skipped"}
                                </span>
                              )}
                              {prog.completed && !reflection && (
                                <span>💭 No reflection</span>
                              )}
                            </div>
                          </div>

                          <div className="mg-grade">
                            {result ? (
                              <div className="mg-grade-value" style={{ color: gradeColor(result.grade) }}>
                                {result.grade}%
                              </div>
                            ) : (
                              <div style={{ fontSize: 13, color: "var(--text3)", fontStyle: "italic" }}>No items</div>
                            )}
                            {result && (
                              <div className="mg-grade-detail">
                                {Math.round(result.earnedPoints * 10) / 10}/{result.totalPoints} pts
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Detail breakdown for lessons with content */}
                        {result && (mc.length > 0 || sa.length > 0) && (
                          <div className="mg-breakdown">
                            <div className="mg-indicators">
                              {/* MC dots */}
                              {mc.map((q, i) => {
                                const a = answers[q.id];
                                const status = !a?.submitted ? "unanswered" : a.correct ? "correct" : "incorrect";
                                return (
                                  <div
                                    key={q.id}
                                    title={`MC ${i + 1}: ${status}`}
                                    className={`mg-mc-dot mg-mc-dot--${status}`}
                                  >
                                    {i + 1}
                                  </div>
                                );
                              })}
                              {/* Written response indicators */}
                              {sa.map((q, i) => {
                                const a = answers[q.id];
                                const hasScore = a?.writtenScore !== undefined && a?.writtenScore !== null;
                                const tierInfo = hasScore ? WRITTEN_LABELS[a.writtenScore] : null;
                                return (
                                  <div
                                    key={q.id}
                                    title={`Written ${i + 1}: ${tierInfo ? tierInfo.label : a?.submitted ? "Pending review" : "Not submitted"}${a?.feedback ? ` — ${a.feedback}` : ""}`}
                                    className="mg-written-pill"
                                    style={{
                                      background: tierInfo ? "rgba(16,185,129,0.1)" : a?.submitted ? "rgba(245,166,35,0.1)" : "var(--surface2)",
                                      color: tierInfo ? tierInfo.color : a?.submitted ? "var(--amber)" : "var(--text3)",
                                    }}
                                  >
                                    ✏️{tierInfo ? ` ${tierInfo.label.slice(0, 3)}` : a?.submitted ? " ⏳" : ""}
                                    {a?.feedback && " 💬"}
                                  </div>
                                );
                              })}
                              {/* Feedback from grading (shown inline) */}
                              {sa.some((q) => answers[q.id]?.feedback) && (
                                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                                  {sa.filter((q) => answers[q.id]?.feedback).map((q) => {
                                    const a = answers[q.id];
                                    return (
                                      <div key={`fb-${q.id}`} className="mg-feedback-row">
                                        <span className="mg-feedback-icon">💬 </span>
                                        {a.feedback}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                              {/* Reflection indicator */}
                              {result.hasReflection && (
                                <div
                                  title={`Reflection: ${reflection?.valid ? "Complete" : reflection ? "Skipped" : "Missing"}`}
                                  className="mg-reflection-pill"
                                  style={{
                                    background: reflection?.valid ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)",
                                    color: reflection?.valid ? "var(--green)" : "var(--red)",
                                  }}
                                >
                                  💭{reflection?.valid ? " ✓" : " ✗"}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {/* Activities & Evidence grades */}
            {Object.keys(activityData).length > 0 && (
              <div className="mg-unit-group">
                <h3 className="mg-unit-title">Activities & Evidence</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Object.entries(activityData)
                    .sort((a, b) => (a[1].activityTitle || a[0]).localeCompare(b[1].activityTitle || b[0]))
                    .map(([actId, data]) => {
                      const hasScore = data.activityScore !== null && data.activityScore !== undefined;
                      const tierInfo = hasScore ? WRITTEN_LABELS[data.activityScore] : null;
                      const gradePercent = hasScore ? Math.round(data.activityScore * 100) : null;

                      return (
                        <div key={actId} className="card mg-activity-card">
                          <div className="mg-activity-row">
                            <div className="mg-lesson-info">
                              <div className="mg-activity-title">
                                {data.activityTitle || actId}
                              </div>
                              <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                                {hasScore ? (
                                  <span style={{ fontWeight: 700, color: tierInfo?.color || "var(--text3)" }}>
                                    {data.activityLabel || tierInfo?.label || "Graded"}
                                  </span>
                                ) : (
                                  <span style={{ color: "var(--amber)" }}>Pending review</span>
                                )}
                              </div>
                            </div>
                            <div className="mg-grade">
                              {hasScore ? (
                                <div className="mg-grade-value" style={{ color: gradeColor(gradePercent) }}>
                                  {gradePercent}%
                                </div>
                              ) : (
                                <div style={{ fontSize: 13, color: "var(--amber)", fontStyle: "italic" }}>Pending</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}
    </main>
  );
}
