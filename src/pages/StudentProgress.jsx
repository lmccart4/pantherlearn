// src/pages/StudentProgress.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getLevelInfo, BADGES, awardXP, updateStudentGamification, getStudentGamification, getXPConfig, DEFAULT_XP_VALUES } from "../lib/gamification";
import StreakDisplay from "../components/StreakDisplay";

const GRADE_TIERS = [
  { label: "Missing", value: 0, color: "var(--text3)", bg: "var(--surface2)" },
  { label: "Emerging", value: 0.55, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { label: "Approaching", value: 0.65, color: "var(--amber)", bg: "rgba(245,166,35,0.12)" },
  { label: "Developing", value: 0.85, color: "var(--cyan)", bg: "rgba(34,211,238,0.12)" },
  { label: "Refining", value: 1.0, color: "var(--green)", bg: "rgba(16,185,129,0.12)" },
];

function getTierInfo(score) {
  if (score === null || score === undefined) return null;
  for (let i = GRADE_TIERS.length - 1; i >= 0; i--) {
    if (score >= GRADE_TIERS[i].value) return GRADE_TIERS[i];
  }
  return GRADE_TIERS[0];
}

export default function StudentProgress() {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [gamData, setGamData] = useState({});
  const [enrollments, setEnrollments] = useState({});
  const [reflectionData, setReflectionData] = useState({}); // { studentUid: { lessonId: { valid, response, ... } } }
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [view, setView] = useState("overview");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sectionFilter] = useState("all");
  const [gradePopup, setGradePopup] = useState(null); // { studentUid, lessonId, x, y } or { studentUid, type: "overall", x, y }
  const [confirmComplete, setConfirmComplete] = useState(null); // { studentUid, lessonId, studentName, x, y }
  const [completingLesson, setCompletingLesson] = useState(false);
  const [xpConfig, setXpConfig] = useState(null);

  // Fetch courses on mount
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

  // Fetch everything when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchAll = async () => {
      setDataLoading(true);
      try {
        const lessonsSnap = await getDocs(
          query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc"))
        );
        const lessonsList = lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLessons(lessonsList);

        const usersSnap = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnap.forEach((d) => {
          const data = d.data();
          usersMap[d.id] = { uid: d.id, ...data };
          if (data.email) usersMap[data.email.toLowerCase()] = { uid: d.id, ...data };
        });

        const enrollSnap = await getDocs(collection(db, "enrollments"));
        const enrollMap = {};
        const enrolledStudents = [];
        enrollSnap.forEach((d) => {
          const data = d.data();
          if (data.courseId === selectedCourse) {
            const key = data.uid || data.email;
            enrollMap[key] = data;
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

        const studentsList = enrolledStudents.length > 0
          ? enrolledStudents
          : Object.values(usersMap).filter((u) => u.role === "student" && u.uid);

        const seen = new Set();
        const dedupedStudents = studentsList.filter((s) => {
          if (seen.has(s.uid)) return false;
          seen.add(s.uid);
          return true;
        });
        setStudents(dedupedStudents);

        const progress = {};
        const progressPromises = [];
        for (const student of dedupedStudents) {
          progress[student.uid] = {};
          if (!student.hasLoggedIn) continue;
          for (const lesson of lessonsList) {
            progressPromises.push(
              getDoc(doc(db, "progress", student.uid, "courses", selectedCourse, "lessons", lesson.id))
                .then((progDoc) => {
                  if (progDoc.exists()) {
                    const data = progDoc.data();
                    progress[student.uid][lesson.id] = { ...data.answers, _completed: data.completed || false, _completedAt: data.completedAt || null };
                  } else {
                    progress[student.uid][lesson.id] = {};
                  }
                })
                .catch(() => { progress[student.uid][lesson.id] = {}; })
            );
          }
        }
        await Promise.all(progressPromises);
        setProgressData(progress);

        const gam = {};
        const gamPromises = [];
        for (const student of dedupedStudents) {
          if (!student.hasLoggedIn) { gam[student.uid] = {}; continue; }
          gamPromises.push(
            getDoc(doc(db, "courses", selectedCourse, "gamification", student.uid))
              .then((gamDoc) => { gam[student.uid] = gamDoc.exists() ? gamDoc.data() : {}; })
              .catch(() => { gam[student.uid] = {}; })
          );
        }
        await Promise.all(gamPromises);
        setGamData(gam);

        // Reflections for all students in this course
        const refs = {};
        try {
          const refsSnap = await getDocs(collection(db, "courses", selectedCourse, "reflections"));
          refsSnap.forEach((d) => {
            const data = d.data();
            if (data.studentId && data.lessonId) {
              if (!refs[data.studentId]) refs[data.studentId] = {};
              refs[data.studentId][data.lessonId] = data;
            }
          });
        } catch (e) { /* no reflections collection yet */ }
        setReflectionData(refs);
      } catch (err) {
        console.error("Error fetching progress data:", err);
      }
      setDataLoading(false);
    };
    fetchAll();
  }, [selectedCourse]);

  // Load XP config for the selected course
  useEffect(() => {
    if (selectedCourse) getXPConfig(selectedCourse).then(setXpConfig).catch(() => setXpConfig(null));
  }, [selectedCourse]);

  const getXPValue = (key) => xpConfig?.xpValues?.[key] ?? DEFAULT_XP_VALUES[key] ?? 0;

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

  // --- NEW: Blended grade calculation ---
  const getStudentLessonGrade = (studentUid, lessonId) => {
    const answers = progressData[studentUid]?.[lessonId] || {};
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return null;

    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);
    const today = new Date().toISOString().split("T")[0];
    const isPastDue = lesson.dueDate && lesson.dueDate < today;
    const studentCompleted = progressData[studentUid]?.[lessonId]?._completed || false;
    const reflection = reflectionData[studentUid]?.[lessonId];

    // MC: each submitted answer = 1 point if correct, 0 if incorrect
    // After due date, unsubmitted MC = 0 points
    const mcItems = [];
    mc.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        mcItems.push({ type: "mc", prompt: q.prompt, points: a.correct ? 1 : 0, max: 1, correct: a.correct });
      } else if (isPastDue) {
        mcItems.push({ type: "mc", prompt: q.prompt, points: 0, max: 1, correct: false, missing: true });
      }
    });

    // Written: each graded answer = writtenScore points (0 to 1), ungraded excluded unless past due
    const saItems = [];
    sa.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted && a.writtenScore !== undefined && a.writtenScore !== null) {
        const tier = getTierInfo(a.writtenScore);
        saItems.push({ type: "sa", prompt: q.prompt, points: a.writtenScore, max: 1, label: a.writtenLabel || tier?.label, tier });
      } else if (a?.submitted) {
        saItems.push({ type: "sa", prompt: q.prompt, points: null, max: 1, label: "Ungraded", tier: null, ungraded: true });
      } else if (isPastDue) {
        saItems.push({ type: "sa", prompt: q.prompt, points: 0, max: 1, label: "Missing", tier: GRADE_TIERS[0], missing: true });
      }
    });

    // Reflection: 1 point if valid, 0 if skipped, excluded if not yet completed (unless past due)
    let reflectionItem = null;
    if (reflection) {
      reflectionItem = {
        type: "reflection",
        prompt: "What did I learn today?",
        points: reflection.valid ? 1 : 0,
        max: 1,
        valid: reflection.valid,
        skipped: reflection.skipped || !reflection.valid,
        response: reflection.response || "",
      };
    } else if (isPastDue) {
      reflectionItem = {
        type: "reflection",
        prompt: "What did I learn today?",
        points: 0,
        max: 1,
        valid: false,
        missing: true,
      };
    }

    const gradedItems = [
      ...mcItems,
      ...saItems.filter((i) => !i.ungraded),
      ...(reflectionItem ? [reflectionItem] : []),
    ];
    if (gradedItems.length === 0) return null;

    const earned = gradedItems.reduce((sum, i) => sum + i.points, 0);
    const possible = gradedItems.length;
    const grade = Math.round((earned / possible) * 100);

    return {
      grade,
      earned: Math.round(earned * 100) / 100,
      possible,
      mcItems,
      saItems,
      reflectionItem,
      mcCorrect: mcItems.filter((i) => i.correct).length,
      mcTotal: mcItems.length,
      mcPossible: mc.length,
      saGraded: saItems.filter((i) => !i.ungraded).length,
      saTotal: sa.length,
      saUngraded: saItems.filter((i) => i.ungraded).length,
    };
  };

  const getStudentOverall = (studentUid) => {
    let totalEarned = 0, totalPossible = 0;
    const lessonBreakdowns = [];

    lessons.forEach((lesson) => {
      const result = getStudentLessonGrade(studentUid, lesson.id);
      if (result) {
        totalEarned += result.earned;
        totalPossible += result.possible;
        lessonBreakdowns.push({ lessonId: lesson.id, title: lesson.title, ...result });
      }
    });

    if (totalPossible === 0) return null;
    return {
      grade: Math.round((totalEarned / totalPossible) * 100),
      earned: Math.round(totalEarned * 100) / 100,
      possible: totalPossible,
      lessonBreakdowns,
    };
  };

  const gradeColor = (grade) => {
    if (grade === null || grade === undefined) return "var(--text3)";
    if (grade >= 80) return "var(--green)";
    if (grade >= 60) return "var(--amber)";
    return "var(--red)";
  };

  const filteredStudents = students;

  // --- Toggle reflection for a student (manual override) ---
  const handleToggleReflection = async (e, studentUid, lessonId, currentlyValid) => {
    e.stopPropagation();
    const newValid = !currentlyValid;
    try {
      const reflRef = doc(db, "courses", selectedCourse, "reflections", `${studentUid}_${lessonId}`);
      await setDoc(reflRef, {
        studentId: studentUid,
        lessonId,
        response: newValid ? "(manually credited)" : "(manually removed)",
        valid: newValid,
        skipped: !newValid,
        savedAt: new Date(),
        manualOverride: true,
      });

      // Update local state
      setReflectionData((prev) => ({
        ...prev,
        [studentUid]: {
          ...prev[studentUid],
          [lessonId]: { studentId: studentUid, lessonId, valid: newValid, skipped: !newValid, manualOverride: true },
        },
      }));
    } catch (err) {
      console.error("Failed to toggle reflection:", err);
      alert("Failed to save reflection. Check console for details.");
    }
  };

  // --- Grade popup handler ---
  const handleGradeClick = (e, studentUid, lessonId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    if (lessonId) {
      setGradePopup({ studentUid, lessonId, x: rect.left, y: rect.bottom + 8 });
    } else {
      setGradePopup({ studentUid, type: "overall", x: rect.left, y: rect.bottom + 8 });
    }
  };

  // Close popup on outside click
  useEffect(() => {
    if (!gradePopup) return;
    const close = () => setGradePopup(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [gradePopup]);

  // --- Manual lesson completion ---
  const handleManualComplete = (e, studentUid, lessonId, studentName) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setConfirmComplete({ studentUid, lessonId, studentName, x: rect.left, y: rect.bottom + 8 });
  };

  const confirmManualComplete = async () => {
    if (!confirmComplete || completingLesson) return;
    const { studentUid, lessonId } = confirmComplete;
    setCompletingLesson(true);
    try {
      // 1. Mark lesson as complete in progress doc
      const progressRef = doc(db, "progress", studentUid, "courses", selectedCourse, "lessons", lessonId);
      await setDoc(progressRef, {
        completed: true,
        completedAt: new Date(),
        manuallyCompleted: true,
        completedBy: "teacher",
      }, { merge: true });

      // 2. Award lesson_complete XP (same as student self-completion)
      const baseXP = getXPValue("lesson_complete");
      const xpResult = await awardXP(studentUid, baseXP, "lesson_complete", selectedCourse);

      // 3. Increment lessonsCompleted + check badges
      const currentGam = await getStudentGamification(studentUid, selectedCourse);
      await updateStudentGamification(studentUid, {
        lessonsCompleted: (currentGam.lessonsCompleted || 0) + 1,
      }, selectedCourse);

      // 4. Optimistically update local state
      setProgressData((prev) => ({
        ...prev,
        [studentUid]: {
          ...prev[studentUid],
          [lessonId]: {
            ...prev[studentUid]?.[lessonId],
            _completed: true,
            _completedAt: new Date(),
          },
        },
      }));
      setGamData((prev) => ({
        ...prev,
        [studentUid]: {
          ...prev[studentUid],
          totalXP: xpResult?.newTotal ?? ((prev[studentUid]?.totalXP || 0) + baseXP),
          lessonsCompleted: (prev[studentUid]?.lessonsCompleted || 0) + 1,
        },
      }));

      setConfirmComplete(null);
    } catch (err) {
      console.error("Failed to mark lesson complete:", err);
      alert("Failed to mark lesson complete. Check console for details.");
    }
    setCompletingLesson(false);
  };

  // Reset a student's progress on a specific lesson
  const handleResetProgress = async (e, studentUid, lessonId, studentName) => {
    e.stopPropagation();
    const lessonTitle = lessons.find((l) => l.id === lessonId)?.title || lessonId;
    if (!confirm(`Reset ${studentName}'s progress on "${lessonTitle}"?\n\nThis clears all their answers and completion status. XP already earned is not affected.`)) return;
    try {
      const progressRef = doc(db, "progress", studentUid, "courses", selectedCourse, "lessons", lessonId);
      await deleteDoc(progressRef);
      // Clear from local state
      setProgressData((prev) => {
        const updated = { ...prev };
        if (updated[studentUid]) {
          const studentData = { ...updated[studentUid] };
          delete studentData[lessonId];
          updated[studentUid] = studentData;
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to reset progress:", err);
      alert("Failed to reset progress. Check console for details.");
    }
  };

  useEffect(() => {
    if (!confirmComplete) return;
    const close = () => setConfirmComplete(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [confirmComplete]);

  const renderConfirmComplete = () => {
    if (!confirmComplete) return null;
    const xpAmount = getXPValue("lesson_complete");
    return (
      <div style={{
        position: "fixed",
        left: Math.min(confirmComplete.x, window.innerWidth - 320),
        top: Math.min(confirmComplete.y, window.innerHeight - 200),
        width: 300,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "16px 20px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        zIndex: 1000,
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
          Mark Lesson Complete?
        </div>
        <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 4 }}>
          {confirmComplete.studentName}
        </div>
        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 12 }}>
          This will award <span style={{ color: "var(--amber)", fontWeight: 700 }}>{xpAmount} XP</span> for lesson completion.
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={confirmManualComplete}
            disabled={completingLesson}
            style={{
              flex: 1, padding: "8px 16px", borderRadius: 8, border: "none",
              background: completingLesson ? "var(--surface2)" : "var(--amber)",
              color: completingLesson ? "var(--text3)" : "#1a1a1a",
              fontWeight: 700, fontSize: 12, cursor: completingLesson ? "default" : "pointer",
            }}
          >
            {completingLesson ? "Saving..." : "Confirm"}
          </button>
          <button
            onClick={() => setConfirmComplete(null)}
            style={{
              padding: "8px 16px", borderRadius: 8,
              border: "1px solid var(--border)", background: "transparent",
              color: "var(--text)", fontWeight: 600, fontSize: 12, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  // --- Grade Breakdown Popup ---
  const renderGradePopup = () => {
    if (!gradePopup) return null;

    let breakdown;
    let title;

    if (gradePopup.type === "overall") {
      const overall = getStudentOverall(gradePopup.studentUid);
      if (!overall) return null;
      title = "Overall Grade Breakdown";
      breakdown = (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            <span>Total</span>
            <span style={{ color: gradeColor(overall.grade) }}>{overall.earned} / {overall.possible} pts = {overall.grade}%</span>
          </div>
          <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
          {overall.lessonBreakdowns.map((lb) => (
            <div key={lb.lessonId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
              <span style={{ color: "var(--text2)", flex: 1 }}>{lb.title}</span>
              <span style={{ fontWeight: 600, color: gradeColor(lb.grade), marginLeft: 12 }}>
                {lb.earned}/{lb.possible} ({lb.grade}%)
              </span>
            </div>
          ))}
        </div>
      );
    } else {
      const result = getStudentLessonGrade(gradePopup.studentUid, gradePopup.lessonId);
      if (!result) return null;
      const lesson = lessons.find((l) => l.id === gradePopup.lessonId);
      title = lesson?.title || "Grade Breakdown";
      breakdown = (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
            <span>Total</span>
            <span style={{ color: gradeColor(result.grade) }}>{result.earned} / {result.possible} pts = {result.grade}%</span>
          </div>
          <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />

          {result.mcItems.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>
                Multiple Choice ({result.mcCorrect}/{result.mcTotal} correct)
              </div>
              {result.mcItems.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "2px 0" }}>
                  <span style={{ color: "var(--text2)", flex: 1 }}>{item.prompt?.slice(0, 50)}{item.prompt?.length > 50 ? "..." : ""}</span>
                  <span style={{ fontWeight: 600, color: item.correct ? "var(--green)" : "var(--red)", marginLeft: 8 }}>
                    {item.correct ? "1.0" : "0.0"} / 1
                  </span>
                </div>
              ))}
            </>
          )}

          {result.saItems.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 8 }}>
                Written Responses ({result.saGraded}/{result.saTotal} graded)
              </div>
              {result.saItems.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "2px 0" }}>
                  <span style={{ color: "var(--text2)", flex: 1 }}>{item.prompt?.slice(0, 50)}{item.prompt?.length > 50 ? "..." : ""}</span>
                  {item.ungraded ? (
                    <span style={{ fontSize: 11, fontStyle: "italic", color: "var(--text3)", marginLeft: 8 }}>ungraded</span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                      <span style={{
                        fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                        background: item.tier?.bg || "var(--surface2)", color: item.tier?.color || "var(--text3)",
                      }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>{item.points.toFixed(2)} / 1</span>
                    </span>
                  )}
                </div>
              ))}
            </>
          )}

          {result.reflectionItem && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 8 }}>
                Daily Reflection
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "2px 0" }}>
                <span style={{ color: "var(--text2)" }}>What did I learn today?</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                  <span style={{
                    fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                    background: result.reflectionItem.missing ? "var(--surface2)"
                      : result.reflectionItem.valid ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                    color: result.reflectionItem.missing ? "var(--text3)"
                      : result.reflectionItem.valid ? "var(--green)" : "#ef4444",
                  }}>
                    {result.reflectionItem.missing ? "Missing" : result.reflectionItem.valid ? "Completed" : "Skipped"}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text)" }}>{result.reflectionItem.points.toFixed(1)} / 1</span>
                </span>
              </div>
            </>
          )}
        </div>
      );
    }

    // Position popup
    const popupStyle = {
      position: "fixed",
      left: Math.min(gradePopup.x, window.innerWidth - 420),
      top: Math.min(gradePopup.y, window.innerHeight - 300),
      width: 400,
      maxHeight: 400,
      overflowY: "auto",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 12,
      padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      zIndex: 1000,
    };

    return (
      <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{title}</div>
          <button onClick={() => setGradePopup(null)} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
        </div>
        {breakdown}
      </div>
    );
  };

  // --- Clickable grade cell ---
  const GradeCell = ({ studentUid, lessonId, style }) => {
    const result = lessonId ? getStudentLessonGrade(studentUid, lessonId) : getStudentOverall(studentUid);
    return (
      <span
        onClick={(e) => { if (result) handleGradeClick(e, studentUid, lessonId); }}
        style={{
          ...style,
          cursor: result ? "pointer" : "default",
          textDecoration: result ? "underline dotted" : "none",
          textUnderlineOffset: 3,
        }}
        title={result ? "Click for breakdown" : ""}
      >
        {result ? `${result.grade}%` : "—"}
      </span>
    );
  };

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

        <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", marginBottom: 20 }}>
          {s.photoURL ? (
            <img src={s.photoURL} alt="" style={{ width: 52, height: 52, borderRadius: "50%", border: "2px solid var(--border)" }} />
          ) : (
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "var(--text3)" }}>👤</div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{s.displayName}</div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>{s.email}</div>
          </div>
          <div style={{ display: "flex", gap: 20, textAlign: "center" }}>
            <div>
              <GradeCell studentUid={s.uid} lessonId={null} style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: overall ? gradeColor(overall.grade) : "var(--text3)" }} />
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>Overall</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--amber)" }}>{gam.totalXP || 0}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>XP</div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <StreakDisplay
                currentStreak={gam.currentStreak || 0}
                longestStreak={gam.longestStreak || 0}
                streakFreezes={gam.streakFreezes || 0}
                compact
              />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: "var(--cyan)" }}>Lv{level.current.level}</div>
              <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.06em" }}>{level.current.name}</div>
            </div>
          </div>
        </div>

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

        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>Lesson Grades</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lessons.map((lesson) => {
            const result = getStudentLessonGrade(s.uid, lesson.id);
            const answers = progressData[s.uid]?.[lesson.id] || {};
            const mc = getMCQuestions(lesson);
            const sa = getSAQuestions(lesson);

            return (
              <div key={lesson.id} className="card" style={{ padding: "14px 20px", cursor: "pointer" }}
                onClick={() => { setSelectedLesson(lesson.id); setView("lesson"); }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{lesson.title}</div>
                  <GradeCell studentUid={s.uid} lessonId={lesson.id} style={{
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18,
                    color: result ? gradeColor(result.grade) : "var(--text3)",
                  }} />
                </div>

                {result && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ height: 6, background: "var(--surface2)", borderRadius: 3 }}>
                      <div style={{
                        width: `${(result.earned / result.possible) * 100}%`,
                        height: "100%", background: gradeColor(result.grade),
                        borderRadius: 3, transition: "width 0.3s",
                      }} />
                    </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text3)", flexWrap: "wrap" }}>
                  {mc.length > 0 && (
                    <span>MC: {result ? `${result.mcCorrect}/${result.mcTotal} correct` : "not started"} (of {mc.length})</span>
                  )}
                  {sa.length > 0 && (
                    <span>Written: {result ? `${result.saGraded} graded` : "0"}/{sa.length}{result?.saUngraded > 0 ? ` (${result.saUngraded} pending)` : ""}</span>
                  )}
                </div>

                {result && result.mcItems.length > 0 && (
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

                {sa.map((q) => {
                  const a = answers[q.id];
                  if (!a?.submitted) return null;
                  const tier = a.writtenScore !== undefined && a.writtenScore !== null ? getTierInfo(a.writtenScore) : null;
                  return (
                    <div key={q.id} style={{
                      marginTop: 10, background: "var(--bg)", borderRadius: 8,
                      padding: "10px 14px", border: "1px solid var(--border)",
                    }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)" }}>
                          Written: {q.prompt?.slice(0, 60)}{q.prompt?.length > 60 ? "..." : ""}
                        </div>
                        {tier ? (
                          <span style={{
                            fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: 600,
                            background: tier.bg, color: tier.color,
                          }}>{a.writtenLabel || tier.label} ({Math.round(a.writtenScore * 100)}%)</span>
                        ) : (
                          <span style={{ fontSize: 10, fontStyle: "italic", color: "var(--text3)" }}>Awaiting grade</span>
                        )}
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
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 22, color: gradeColor(qs.accuracy) }}>
                        {qs.accuracy !== null ? `${qs.accuracy}%` : "—"}
                      </div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>{qs.correct}/{qs.attempted} correct</div>
                    </div>
                  </div>
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
                {sa.map((q, i) => (
                  <th key={q.id} style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text3)", fontSize: 11 }}>W{i + 1}</th>
                ))}
                <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text3)", fontSize: 11 }}>💭</th>
                <th style={{ textAlign: "center", padding: "10px 8px", fontWeight: 600, color: "var(--text3)", fontSize: 11 }}>✅</th>
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
                    <td style={{ textAlign: "center", padding: "8px" }}>
                      <GradeCell studentUid={s.uid} lessonId={lesson.id} style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        color: result ? gradeColor(result.grade) : "var(--text3)",
                      }} />
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
                    {sa.map((q) => {
                      const a = answers[q.id];
                      if (!a?.submitted) return <td key={q.id} style={{ textAlign: "center", padding: "8px", color: "var(--text3)" }}>—</td>;
                      const tier = a.writtenScore !== undefined && a.writtenScore !== null ? getTierInfo(a.writtenScore) : null;
                      return (
                        <td key={q.id} style={{ textAlign: "center", padding: "8px" }}>
                          {tier ? (
                            <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600, background: tier.bg, color: tier.color }}>
                              {a.writtenLabel || tier.label}
                            </span>
                          ) : (
                            <span style={{ fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>pending</span>
                          )}
                        </td>
                      );
                    })}
                    {(() => {
                      const ref = reflectionData[s.uid]?.[lesson.id];
                      const isValid = ref?.valid || false;
                      return (
                        <td style={{ textAlign: "center", padding: "8px" }}
                          onClick={(e) => handleToggleReflection(e, s.uid, lesson.id, isValid)}
                          title={ref ? (isValid ? "Click to remove credit" : "Click to give credit") : "Click to give credit"}>
                          {ref ? (
                            <span style={{
                              fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600, cursor: "pointer",
                              background: isValid ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                              color: isValid ? "var(--green)" : "#ef4444",
                            }}>
                              {isValid ? "✓" : "Skipped"}
                            </span>
                          ) : (
                            <span style={{ color: "var(--text3)", cursor: "pointer" }}>—</span>
                          )}
                        </td>
                      );
                    })()}
                    {(() => {
                      const completed = progressData[s.uid]?.[lesson.id]?._completed || false;
                      const hasProgress = !!progressData[s.uid]?.[lesson.id];
                      return (
                        <td style={{ textAlign: "center", padding: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
                            {completed ? (
                              <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600, background: "rgba(16,185,129,0.12)", color: "var(--green)" }}>✓</span>
                            ) : (
                              <span
                                onClick={(e) => handleManualComplete(e, s.uid, lesson.id, s.displayName)}
                                title="Mark as complete (+XP)"
                                style={{
                                  color: "var(--amber)", cursor: "pointer", fontSize: 10,
                                  padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                                  border: "1px dashed var(--amber)",
                                  background: "rgba(245,166,35,0.08)",
                                }}
                              >
                                + Complete
                              </span>
                            )}
                            {hasProgress && (
                              <span
                                onClick={(e) => handleResetProgress(e, s.uid, lesson.id, s.displayName)}
                                title="Reset progress"
                                style={{ cursor: "pointer", fontSize: 11, opacity: 0.5, transition: "opacity 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                                onMouseLeave={(e) => e.currentTarget.style.opacity = 0.5}
                              >
                                🔄
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })()}
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
            </div>

            {dataLoading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
            ) : view === "student" ? (
              renderStudentDrilldown()
            ) : view === "lesson" ? (
              renderLessonDrilldown()
            ) : (
              <div>
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

                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>📚 Lessons</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 28 }}>
                  {lessons.map((lesson) => {
                    let totalAttempted = 0, gradeSum = 0;
                    filteredStudents.forEach((s) => {
                      const r = getStudentLessonGrade(s.uid, lesson.id);
                      if (r) { totalAttempted++; gradeSum += r.grade; }
                    });
                    const avgGrade = totalAttempted > 0 ? Math.round(gradeSum / totalAttempted) : null;
                    const mc = getMCQuestions(lesson);
                    const sa = getSAQuestions(lesson);

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
                          {mc.length} MC · {sa.length} written · {totalAttempted}/{filteredStudents.length} attempted
                        </div>
                      </div>
                    );
                  })}
                </div>

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
                              <td style={{ textAlign: "center", padding: "10px 8px" }}>
                                <GradeCell studentUid={s.uid} lessonId={null} style={{
                                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15,
                                  color: overall ? gradeColor(overall.grade) : "var(--text3)",
                                }} />
                              </td>
                              {lessons.map((l) => {
                                const r = getStudentLessonGrade(s.uid, l.id);
                                return (
                                  <td key={l.id} style={{ textAlign: "center", padding: "10px 8px" }}>
                                    <GradeCell studentUid={s.uid} lessonId={l.id} style={{
                                      fontSize: 12, fontWeight: 600,
                                      color: r ? gradeColor(r.grade) : "var(--text3)",
                                    }} />
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

      {/* Grade breakdown popup */}
      {renderGradePopup()}
      {/* Manual completion confirmation popup */}
      {renderConfirmComplete()}
    </div>
  );
}
