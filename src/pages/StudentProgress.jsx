// src/pages/StudentProgress.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getLevelInfo, BADGES } from "../lib/gamification";

export default function StudentProgress() {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [gamData, setGamData] = useState({});
  const [enrollments, setEnrollments] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  // View state
  const [view, setView] = useState("overview"); // overview | student | lesson
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sectionFilter, setSectionFilter] = useState("all");

  // Fetch courses on mount
  useEffect(() => {
    if (userRole !== "teacher") return;
    const fetchCourses = async () => {
      const q = query(collection(db, "courses"), orderBy("order", "asc"));
      const snap = await getDocs(q);
      const c = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCourses(c);
      if (c.length > 0) setSelectedCourse(c[0].id);
      setLoading(false);
    };
    fetchCourses();
  }, [userRole]);

  // Fetch everything when course changes
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

        // Students — pull from enrollments first, supplement with users collection
        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnap.forEach((d) => {
          const data = d.data();
          usersMap[d.id] = { uid: d.id, ...data };
          if (data.email) usersMap[data.email.toLowerCase()] = { uid: d.id, ...data };
        });

        // Enrollments
        const enrollSnap = await getDocs(collection(db, "enrollments"));
        const enrollMap = {};
        const enrolledStudents = [];
        enrollSnap.forEach((d) => {
          const data = d.data();
          if (data.courseId === selectedCourse) {
            const key = data.uid || data.email;
            enrollMap[key] = data;

            // Build student entry from enrollment + user data if available
            const userMatch = data.uid ? usersMap[data.uid] : usersMap[data.email?.toLowerCase()];
            enrolledStudents.push({
              uid: userMatch?.uid || data.uid || data.email?.replace(/[.@]/g, "_"),
              displayName: userMatch?.displayName || data.name || data.email || "Unknown",
              email: data.email || userMatch?.email || "",
              photoURL: userMatch?.photoURL || data.photoUrl || "",
              section: data.section || "",
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              hasLoggedIn: !!userMatch,
            });
          }
        });
        setEnrollments(enrollMap);

        // If no enrollments, fall back to all students from users collection
        const studentsList = enrolledStudents.length > 0
          ? enrolledStudents
          : Object.values(usersMap).filter((u) => u.role === "student" && u.uid);

        // Deduplicate by uid
        const seen = new Set();
        const dedupedStudents = studentsList.filter((s) => {
          if (seen.has(s.uid)) return false;
          seen.add(s.uid);
          return true;
        });
        setStudents(dedupedStudents);

        // Progress for each student × lesson (parallelized)
        const progress = {};
        const progressPromises = [];
        for (const student of dedupedStudents) {
          progress[student.uid] = {};
          if (!student.hasLoggedIn) continue;
          for (const lesson of lessonsList) {
            progressPromises.push(
              getDoc(doc(db, "progress", student.uid, "courses", selectedCourse, "lessons", lesson.id))
                .then((progDoc) => {
                  progress[student.uid][lesson.id] = progDoc.exists() ? (progDoc.data().answers || {}) : {};
                })
                .catch(() => { progress[student.uid][lesson.id] = {}; })
            );
          }
        }
        await Promise.all(progressPromises);
        setProgressData(progress);

        // Gamification data (parallelized)
        const gam = {};
        const gamPromises = [];
        for (const student of dedupedStudents) {
          if (!student.hasLoggedIn) { gam[student.uid] = {}; continue; }
          gamPromises.push(
            getDoc(doc(db, "gamification", student.uid))
              .then((gamDoc) => { gam[student.uid] = gamDoc.exists() ? gamDoc.data() : {}; })
              .catch(() => { gam[student.uid] = {}; })
          );
        }
        await Promise.all(gamPromises);
        setGamData(gam);
      } catch (err) {
        console.error("Error fetching progress data:", err);
      }
      setDataLoading(false);
    };
    fetchAll();
  }, [selectedCourse]);

  if (userRole !== "teacher") {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
      </div>
    );
  }

  // --- Helpers ---
  const getQuestions = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question");
  const getMCQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "multiple_choice");
  const getSAQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "short_answer");

  const getStudentLessonGrade = (studentUid, lessonId) => {
    const answers = progressData[studentUid]?.[lessonId] || {};
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return null;
    const mc = getMCQuestions(lesson);
    if (mc.length === 0) return null;
    let answered = 0, correct = 0;
    mc.forEach((q) => {
      if (answers[q.id]?.submitted) { answered++; if (answers[q.id]?.correct) correct++; }
    });
    if (answered === 0) return null;
    return { answered, correct, total: mc.length, grade: Math.round((correct / answered) * 100) };
  };

  const getStudentOverall = (studentUid) => {
    let totalMC = 0, answered = 0, correct = 0;
    lessons.forEach((lesson) => {
      const mc = getMCQuestions(lesson);
      totalMC += mc.length;
      const answers = progressData[studentUid]?.[lesson.id] || {};
      mc.forEach((q) => {
        if (answers[q.id]?.submitted) { answered++; if (answers[q.id]?.correct) correct++; }
      });
    });
    if (answered === 0) return null;
    return { totalMC, answered, correct, grade: Math.round((correct / answered) * 100) };
  };

  const getStudentSection = (student) => {
    if (student.section) return student.section;
    const enroll = enrollments[student.uid] || enrollments[student.email?.toLowerCase()];
    return enroll?.section || "—";
  };

  const gradeColor = (grade) => {
    if (grade === null || grade === undefined) return "var(--text3)";
    if (grade >= 80) return "var(--green)";
    if (grade >= 60) return "var(--amber)";
    return "var(--red)";
  };

  // Sections for filter
  const sections = [...new Set(
    students.map((s) => getStudentSection(s)).filter((s) => s !== "—")
  )];

  const filteredStudents = sectionFilter === "all"
    ? students
    : students.filter((s) => getStudentSection(s) === sectionFilter);

  // =================== BREADCRUMB ===================
  const currentCourse = courses.find((c) => c.id === selectedCourse);
  const currentLesson = lessons.find((l) => l.id === selectedLesson);
  const currentStudent = students.find((s) => s.uid === selectedStudent);

  const renderBreadcrumb = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text3)", marginBottom: 20, flexWrap: "wrap" }}>
      <button onClick={() => { setView("overview"); setSelectedStudent(null); setSelectedLesson(null); }}
        style={{ background: "none", border: "none", color: view === "overview" ? "var(--text)" : "var(--amber)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, padding: 0, fontWeight: 600 }}>
        {currentCourse?.icon} {currentCourse?.title || "Course"}
      </button>
      {(view === "lesson" || (view === "student" && selectedLesson)) && currentLesson && (
        <>
          <span style={{ color: "var(--text3)" }}>›</span>
          <button onClick={() => { setView("lesson"); setSelectedStudent(null); }}
            style={{ background: "none", border: "none", color: view === "lesson" && !selectedStudent ? "var(--text)" : "var(--amber)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, padding: 0, fontWeight: 600 }}>
            {currentLesson.title}
          </button>
        </>
      )}
      {view === "student" && currentStudent && (
        <>
          <span style={{ color: "var(--text3)" }}>›</span>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>{currentStudent.displayName}</span>
        </>
      )}
    </div>
  );

  // =================== STUDENT DRILLDOWN ===================
  const renderStudentDrilldown = () => {
    const s = students.find((st) => st.uid === selectedStudent);
    if (!s) return null;
    const overall = getStudentOverall(s.uid);
    const gam = gamData[s.uid] || {};
    const level = getLevelInfo(gam.totalXP || 0);
    const earnedBadges = BADGES.filter((b) => (gam.badges || []).includes(b.id));

    return (
      <div>
        {renderBreadcrumb()}

        {/* Student header */}
        <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", marginBottom: 20 }}>
          {s.photoURL ? (
            <img src={s.photoURL} alt="" style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid var(--border)" }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "var(--text3)" }}>👤</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{s.displayName}</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>{s.email} · {getStudentSection(s)}</div>
          </div>
          <div style={{ display: "flex", gap: 20, textAlign: "center" }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: overall ? gradeColor(overall.grade) : "var(--text3)" }}>
                {overall ? `${overall.grade}%` : "—"}
              </div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>Overall</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--amber)" }}>{gam.totalXP || 0}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>XP</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--red)" }}>{gam.currentStreak || 0}d</div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>Streak</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--cyan)" }}>Lv{level.current.level}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>{level.current.name}</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {earnedBadges.map((b) => (
              <span key={b.id} title={b.description} style={{
                background: "var(--surface)", border: "1px solid var(--amber)",
                borderRadius: 8, padding: "6px 10px", fontSize: 12, display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 16 }}>{b.icon}</span> {b.name}
              </span>
            ))}
          </div>
        )}

        {/* Per-lesson breakdown */}
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>Lesson Grades</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lessons.map((lesson) => {
            const result = getStudentLessonGrade(s.uid, lesson.id);
            const answers = progressData[s.uid]?.[lesson.id] || {};
            const mc = getMCQuestions(lesson);
            const sa = getSAQuestions(lesson);
            const saAnswered = sa.filter((q) => answers[q.id]?.submitted).length;

            return (
              <div key={lesson.id} className="card" style={{ padding: "14px 20px", cursor: "pointer" }}
                onClick={() => { setSelectedLesson(lesson.id); setView("lesson"); }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{lesson.title}</div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
                    color: result ? gradeColor(result.grade) : "var(--text3)",
                  }}>
                    {result ? `${result.grade}%` : "—"}
                  </div>
                </div>

                {/* Progress bar */}
                {mc.length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                      <div style={{
                        width: `${result ? (result.answered / result.total) * 100 : 0}%`,
                        height: "100%", background: result ? gradeColor(result.grade) : "var(--surface2)",
                        borderRadius: 3, transition: "width 0.3s",
                      }} />
                    </div>
                  </div>
                )}

                {/* Question details */}
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text3)", flexWrap: "wrap" }}>
                  {mc.length > 0 && (
                    <span>MC: {result ? `${result.correct}/${result.answered} correct` : "not started"} (of {mc.length})</span>
                  )}
                  {sa.length > 0 && (
                    <span>Written: {saAnswered}/{sa.length} submitted</span>
                  )}
                </div>

                {/* Individual MC question results */}
                {result && (
                  <div style={{ display: "flex", gap: 4, marginTop: 10, flexWrap: "wrap" }}>
                    {mc.map((q, i) => {
                      const a = answers[q.id];
                      if (!a?.submitted) return (
                        <div key={q.id} title={`Q${i + 1}: Not answered`} style={{
                          width: 28, height: 28, borderRadius: 6, background: "var(--surface2)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, color: "var(--text3)", fontWeight: 600,
                        }}>{i + 1}</div>
                      );
                      return (
                        <div key={q.id} title={`Q${i + 1}: ${a.correct ? "Correct" : "Incorrect"}`} style={{
                          width: 28, height: 28, borderRadius: 6,
                          background: a.correct ? "var(--green-dim)" : "var(--red-dim)",
                          border: `1px solid ${a.correct ? "var(--green)" : "var(--red)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 700, color: a.correct ? "var(--green)" : "var(--red)",
                        }}>
                          {a.correct ? "✓" : "✗"}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Written response previews */}
                {sa.map((q) => {
                  const a = answers[q.id];
                  if (!a?.submitted) return null;
                  return (
                    <div key={q.id} style={{
                      marginTop: 10, background: "var(--bg)", borderRadius: 8,
                      padding: "10px 14px", border: "1px solid var(--border)",
                    }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 4 }}>
                        Written Response: {q.prompt?.slice(0, 60)}{q.prompt?.length > 60 ? "..." : ""}
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text2)" }}>{a.answer}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // =================== LESSON DRILLDOWN ===================
  const renderLessonDrilldown = () => {
    const lesson = lessons.find((l) => l.id === selectedLesson);
    if (!lesson) return null;
    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);

    // Per-question stats
    const questionStats = mc.map((q, i) => {
      let attempted = 0, correct = 0;
      filteredStudents.forEach((s) => {
        const a = progressData[s.uid]?.[lesson.id]?.[q.id];
        if (a?.submitted) { attempted++; if (a.correct) correct++; }
      });
      return { ...q, index: i, attempted, correct, accuracy: attempted > 0 ? Math.round((correct / attempted) * 100) : null };
    });

    return (
      <div>
        {renderBreadcrumb()}

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{lesson.title}</h2>
        <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 24 }}>
          {mc.length} multiple choice · {sa.length} written response · {filteredStudents.length} students
        </p>

        {/* Question performance */}
        {mc.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>Question Performance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {questionStats.map((qs) => (
                <div key={qs.id} className="card" style={{ padding: "12px 18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", marginBottom: 4 }}>Q{qs.index + 1}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.5 }}>{qs.prompt}</div>
                    </div>
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div style={{
                        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22,
                        color: gradeColor(qs.accuracy),
                      }}>
                        {qs.accuracy !== null ? `${qs.accuracy}%` : "—"}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>{qs.correct}/{qs.attempted} correct</div>
                    </div>
                  </div>
                  {/* Bar chart */}
                  <div style={{ height: 8, background: "var(--surface2)", borderRadius: 4, overflow: "hidden", display: "flex" }}>
                    <div style={{ width: `${qs.attempted > 0 ? (qs.correct / filteredStudents.length) * 100 : 0}%`, background: "var(--green)", transition: "width 0.3s" }} />
                    <div style={{ width: `${qs.attempted > 0 ? ((qs.attempted - qs.correct) / filteredStudents.length) * 100 : 0}%`, background: "var(--red)", transition: "width 0.3s" }} />
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                    <span style={{ color: "var(--green)" }}>● Correct</span>
                    <span style={{ color: "var(--red)" }}>● Incorrect</span>
                    <span>● Not attempted: {filteredStudents.length - qs.attempted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Student results table — clicking a student drills in */}
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>Student Results</h3>
        <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Student</th>
                <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Grade</th>
                {mc.map((q, i) => (
                  <th key={q.id} style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text3)", fontSize: 11 }}>Q{i + 1}</th>
                ))}
                {sa.length > 0 && <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text3)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Written</th>}
              </tr>
            </thead>
            <tbody>
              {[...filteredStudents].sort((a, b) => {
                const aLast = (a.lastName || a.displayName?.split(" ").pop() || "").toLowerCase();
                const bLast = (b.lastName || b.displayName?.split(" ").pop() || "").toLowerCase();
                return aLast.localeCompare(bLast);
              }).map((s, i) => {
                const result = getStudentLessonGrade(s.uid, lesson.id);
                const answers = progressData[s.uid]?.[lesson.id] || {};
                const saAnswered = sa.filter((q) => answers[q.id]?.submitted).length;
                return (
                  <tr key={s.uid}
                    style={{ borderBottom: i < filteredStudents.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "var(--surface)", cursor: "pointer" }}
                    onClick={() => { setSelectedStudent(s.uid); setView("student"); }}>
                    <td style={{ padding: "8px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {s.photoURL ? (
                          <img src={s.photoURL} alt="" style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid var(--border)" }} />
                        ) : (
                          <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text3)" }}>👤</div>
                        )}
                        <span style={{ fontWeight: 500 }}>{s.displayName}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "8px", fontFamily: "var(--font-display)", fontWeight: 700, color: result ? gradeColor(result.grade) : "var(--text3)" }}>
                      {result ? `${result.grade}%` : "—"}
                    </td>
                    {mc.map((q) => {
                      const a = answers[q.id];
                      return (
                        <td key={q.id} style={{ textAlign: "center", padding: "8px" }}>
                          {a?.submitted ? (
                            <span style={{ fontWeight: 700, color: a.correct ? "var(--green)" : "var(--red)" }}>
                              {a.correct ? "✓" : "✗"}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text3)" }}>—</span>
                          )}
                        </td>
                      );
                    })}
                    {sa.length > 0 && (
                      <td style={{ textAlign: "center", padding: "8px", fontSize: 12, color: saAnswered > 0 ? "var(--cyan)" : "var(--text3)" }}>
                        {saAnswered}/{sa.length}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // =================== MAIN RENDER ===================
  return (
    <div className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Student Progress
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15, marginBottom: 28 }}>
          Track grades, question performance, and student engagement.
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
        ) : (
          <>
            {/* Course tabs + section filter */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, width: "fit-content" }}>
                {courses.map((c) => (
                  <button key={c.id}
                    className={`top-nav-link ${selectedCourse === c.id ? "active" : ""}`}
                    onClick={() => { setSelectedCourse(c.id); setView("overview"); setSelectedStudent(null); setSelectedLesson(null); }}>
                    {c.icon} {c.title}
                  </button>
                ))}
              </div>
              {sections.length > 0 && (
                <select value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                  <option value="all">All sections</option>
                  {sections.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>

            {dataLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
            ) : view === "student" ? (
              renderStudentDrilldown()
            ) : view === "lesson" ? (
              renderLessonDrilldown()
            ) : (
              /* =================== OVERVIEW =================== */
              <div>
                {/* Class stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
                  {(() => {
                    let totalGrades = 0, gradeSum = 0;
                    filteredStudents.forEach((s) => {
                      const o = getStudentOverall(s.uid);
                      if (o) { totalGrades++; gradeSum += o.grade; }
                    });
                    const avgGrade = totalGrades > 0 ? Math.round(gradeSum / totalGrades) : null;
                    const avgXP = filteredStudents.length > 0
                      ? Math.round(filteredStudents.reduce((sum, s) => sum + (gamData[s.uid]?.totalXP || 0), 0) / filteredStudents.length) : 0;

                    return [
                      { label: "Students", value: filteredStudents.length, color: "var(--cyan)", icon: "👥" },
                      { label: "Class Average", value: avgGrade !== null ? `${avgGrade}%` : "—", color: avgGrade !== null ? gradeColor(avgGrade) : "var(--text3)", icon: "📊" },
                      { label: "Lessons", value: lessons.length, color: "var(--amber)", icon: "📚" },
                      { label: "Avg XP", value: avgXP, color: "var(--amber)", icon: "⚡" },
                    ].map((s) => (
                      <div key={s.label} className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{s.label}</div>
                      </div>
                    ));
                  })()}
                </div>

                {/* Lesson cards — clickable to drill into lesson */}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>📚 Lessons</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 28 }}>
                  {lessons.map((lesson) => {
                    const mc = getMCQuestions(lesson);
                    let totalAttempted = 0;
                    filteredStudents.forEach((s) => {
                      const r = getStudentLessonGrade(s.uid, lesson.id);
                      if (r) totalAttempted++;
                    });
                    const avgGrade = totalAttempted > 0
                      ? Math.round(filteredStudents.reduce((sum, s) => { const r = getStudentLessonGrade(s.uid, lesson.id); return sum + (r ? r.grade : 0); }, 0) / totalAttempted)
                      : null;

                    return (
                      <div key={lesson.id} className="card" style={{ cursor: "pointer", padding: "14px 16px", transition: "border-color 0.2s" }}
                        onClick={() => { setSelectedLesson(lesson.id); setView("lesson"); }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{lesson.title}</div>
                        <div style={{
                          fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700,
                          color: avgGrade !== null ? gradeColor(avgGrade) : "var(--text3)", marginBottom: 4,
                        }}>
                          {avgGrade !== null ? `${avgGrade}%` : "—"}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>
                          {mc.length} questions · {totalAttempted}/{filteredStudents.length} attempted
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Student roster — clickable to drill into student */}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>👥 Students</h3>
                {filteredStudents.length === 0 ? (
                  <div className="card" style={{ textAlign: "center", padding: 40 }}>
                    <p>No students found</p>
                    <p style={{ color: "var(--text2)", fontSize: 13, marginTop: 6 }}>Sync rosters from Google Classroom to see students here.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
                          <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Student</th>
                          <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Section</th>
                          <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Overall</th>
                          {lessons.map((l) => (
                            <th key={l.id} style={{
                              textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text3)", fontSize: 10,
                              textTransform: "uppercase", letterSpacing: "0.04em", maxWidth: 70, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                              cursor: "pointer",
                            }} onClick={() => { setSelectedLesson(l.id); setView("lesson"); }}>
                              {l.title?.length > 10 ? l.title.slice(0, 10) + "…" : l.title}
                            </th>
                          ))}
                          <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase" }}>XP</th>
                          <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase" }}>🔥</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents
                          .sort((a, b) => {
                            const aLast = (a.lastName || a.displayName?.split(" ").pop() || "").toLowerCase();
                            const bLast = (b.lastName || b.displayName?.split(" ").pop() || "").toLowerCase();
                            return aLast.localeCompare(bLast);
                          })
                          .map((s, i) => {
                          const overall = getStudentOverall(s.uid);
                          const gam = gamData[s.uid] || {};
                          return (
                            <tr key={s.uid}
                              style={{ borderBottom: i < filteredStudents.length - 1 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "transparent" : "var(--surface)", cursor: "pointer" }}
                              onClick={() => { setSelectedStudent(s.uid); setView("student"); }}>
                              <td style={{ padding: "10px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  {s.photoURL ? (
                                    <img src={s.photoURL} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)" }} />
                                  ) : (
                                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--text3)" }}>👤</div>
                                  )}
                                  <div>
                                    <div style={{ fontWeight: 600 }}>{s.displayName}</div>
                                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td style={{ textAlign: "center", padding: "10px 8px", fontSize: 12, color: "var(--text3)" }}>{getStudentSection(s)}</td>
                              <td style={{ textAlign: "center", padding: "10px 8px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: overall ? gradeColor(overall.grade) : "var(--text3)" }}>
                                {overall ? `${overall.grade}%` : "—"}
                              </td>
                              {lessons.map((l) => {
                                const r = getStudentLessonGrade(s.uid, l.id);
                                return (
                                  <td key={l.id} style={{ textAlign: "center", padding: "10px 8px", fontSize: 12, fontWeight: 600, color: r ? gradeColor(r.grade) : "var(--text3)" }}>
                                    {r ? `${r.grade}%` : "—"}
                                  </td>
                                );
                              })}
                              <td style={{ textAlign: "center", padding: "10px 8px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--amber)" }}>{gam.totalXP || 0}</td>
                              <td style={{ textAlign: "center", padding: "10px 8px", fontSize: 12, color: (gam.currentStreak || 0) > 0 ? "var(--red)" : "var(--text3)" }}>{(gam.currentStreak || 0) > 0 ? gam.currentStreak : "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
