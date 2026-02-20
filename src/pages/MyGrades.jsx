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
      <div className="page-container" style={{ display: "flex", justifyContent: "center", paddingTop: 120 }}>
        <div className="spinner" />
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <p style={{ fontSize: 40, marginBottom: 12 }}>📊</p>
        <h2 style={{ fontFamily: "var(--font-display)" }}>No Courses Yet</h2>
        <p style={{ color: "var(--text2)", marginTop: 8 }}>Join a course to see your grades here.</p>
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
    <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            📊 My Grades
          </h1>
          <p style={{ color: "var(--text2)", fontSize: 14 }}>Track your progress and grades across your courses.</p>
        </div>

        {/* Course tabs */}
        {courses.length > 1 && (
          <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, marginBottom: 24, flexWrap: "wrap" }}>
            {courses.map((c) => (
              <button
                key={c.id}
                className={`top-nav-link ${selectedCourse === c.id ? "active" : ""}`}
                onClick={() => setSelectedCourse(c.id)}
              >
                {c.icon || "📚"} {c.title}
              </button>
            ))}
          </div>
        )}

        {dataLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}>
            <div className="spinner" />
          </div>
        ) : (
          <>
            {/* Stats cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12, marginBottom: 28 }}>
              <div className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>📊</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: overall ? gradeColor(overall.grade) : "var(--text3)" }}>
                  {overall ? `${overall.grade}%` : "—"}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Overall Grade</div>
              </div>
              <div className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>✅</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--cyan)" }}>
                  {completedCount}/{lessons.length}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Lessons Done</div>
              </div>
              <div className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>💭</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: reflectionCount > 0 ? "var(--green)" : "var(--text3)" }}>
                  {reflectionCount}/{completedCount || 0}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Reflections</div>
              </div>
              {level && (
                <div className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>⚡</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--amber)" }}>
                    {gamification?.totalXP || 0}
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>Total XP</div>
                </div>
              )}
            </div>

            {/* Lesson breakdown by unit */}
            {unitGroups.map((group) => (
              <div key={group.unit} style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text2)", marginBottom: 10 }}>
                  {group.unit}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {group.lessons.map((lesson) => {
                    const result = getLessonGrade(lesson.id);
                    const prog = progressData[lesson.id] || {};
                    const answers = prog.answers || {};
                    const reflection = reflections[lesson.id];
                    const mc = getMCQuestions(lesson);
                    const sa = getSAQuestions(lesson);

                    // Count answered MC
                    const mcAnswered = mc.filter((q) => answers[q.id]?.submitted).length;
                    const mcCorrect = mc.filter((q) => answers[q.id]?.submitted && answers[q.id]?.correct).length;
                    // Count graded SA
                    const saGraded = sa.filter((q) => answers[q.id]?.writtenScore !== undefined && answers[q.id]?.writtenScore !== null).length;
                    const saSubmitted = sa.filter((q) => answers[q.id]?.submitted).length;

                    return (
                      <div key={lesson.id} className="card" style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                          {/* Left: lesson info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              {prog.completed && <span style={{ fontSize: 14 }}>✅</span>}
                              <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {lesson.title}
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text3)", flexWrap: "wrap" }}>
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
                                <span style={{ color: "var(--text3)" }}>💭 No reflection</span>
                              )}
                            </div>
                          </div>

                          {/* Right: grade */}
                          <div style={{ textAlign: "right", flexShrink: 0 }}>
                            {result ? (
                              <div style={{
                                fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                                color: gradeColor(result.grade),
                              }}>
                                {result.grade}%
                              </div>
                            ) : (
                              <div style={{ fontSize: 13, color: "var(--text3)", fontStyle: "italic" }}>No items</div>
                            )}
                            {result && (
                              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                                {Math.round(result.earnedPoints * 10) / 10}/{result.totalPoints} pts
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Detail breakdown for lessons with content */}
                        {result && (mc.length > 0 || sa.length > 0) && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
                            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                              {/* MC dots */}
                              {mc.map((q, i) => {
                                const a = answers[q.id];
                                const status = !a?.submitted ? "unanswered" : a.correct ? "correct" : "incorrect";
                                return (
                                  <div
                                    key={q.id}
                                    title={`MC ${i + 1}: ${status}`}
                                    style={{
                                      width: 24, height: 24, borderRadius: 6, fontSize: 11,
                                      fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                                      background: status === "correct" ? "rgba(16,185,129,0.15)"
                                        : status === "incorrect" ? "rgba(239,68,68,0.15)"
                                        : "var(--surface2)",
                                      color: status === "correct" ? "var(--green)"
                                        : status === "incorrect" ? "var(--red)"
                                        : "var(--text3)",
                                    }}
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
                                    title={`Written ${i + 1}: ${tierInfo ? tierInfo.label : a?.submitted ? "Pending review" : "Not submitted"}`}
                                    style={{
                                      height: 24, borderRadius: 6, fontSize: 10,
                                      fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                                      padding: "0 8px",
                                      background: tierInfo ? "rgba(16,185,129,0.1)" : a?.submitted ? "rgba(245,166,35,0.1)" : "var(--surface2)",
                                      color: tierInfo ? tierInfo.color : a?.submitted ? "var(--amber)" : "var(--text3)",
                                    }}
                                  >
                                    ✏️{tierInfo ? ` ${tierInfo.label.slice(0, 3)}` : a?.submitted ? " ⏳" : ""}
                                  </div>
                                );
                              })}
                              {/* Reflection indicator */}
                              {result.hasReflection && (
                                <div
                                  title={`Reflection: ${reflection?.valid ? "Complete" : reflection ? "Skipped" : "Missing"}`}
                                  style={{
                                    height: 24, borderRadius: 6, fontSize: 10,
                                    fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
                                    padding: "0 8px",
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
          </>
        )}
      </div>
    </main>
  );
}
