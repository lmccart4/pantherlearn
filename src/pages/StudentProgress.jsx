// src/pages/StudentProgress.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, getDocsFromServer, query, orderBy, where, doc, getDoc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { getLevelInfo, BADGES, awardXP, updateStudentGamification, getStudentGamification, getXPConfig, DEFAULT_XP_VALUES } from "../lib/gamification";
import StreakDisplay from "../components/StreakDisplay";
import { getWeightedOverall, CATEGORY_WEIGHTS, CATEGORY_LABELS, CATEGORY_COLORS, DEFAULT_CATEGORY } from "../lib/gradeCalc";

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

  // Grade override state
  const [pendingOverride, setPendingOverride] = useState(null); // { studentUid, lessonId, blockId, tier }
  const [gradeAllPending, setGradeAllPending] = useState(null); // { studentUid, lessonId, tier }
  const [savingGrade, setSavingGrade] = useState(false);
  const [confirmResetXP, setConfirmResetXP] = useState(null); // { studentUid, studentName }
  const [resettingXP, setResettingXP] = useState(false);
  const [xpConfig, setXpConfig] = useState(null);
  const [activityData, setActivityData] = useState({}); // { uid: { activityId: { activityScore, activityLabel, ... } } }

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
        const lessonsSnap = await getDocsFromServer(
          query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc"))
        );
        const lessonsList = lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setLessons(lessonsList);

        // Fetch only enrollments for this course (filtered)
        const enrollSnap = await getDocs(
          query(collection(db, "enrollments"), where("courseId", "==", selectedCourse))
        );
        const enrollRawData = enrollSnap.docs.map((d) => d.data());

        // Fetch only enrolled user docs in parallel (no full users collection scan)
        const enrolledUids = [...new Set(enrollRawData.map((d) => d.uid).filter(Boolean))];
        const userDocResults = await Promise.all(
          enrolledUids.map((uid) => getDoc(doc(db, "users", uid)).catch(() => null))
        );
        const usersMap = {};
        userDocResults.forEach((d, i) => {
          if (d?.exists()) {
            const data = d.data();
            usersMap[enrolledUids[i]] = { uid: enrolledUids[i], ...data };
            if (data.email) usersMap[data.email.toLowerCase()] = { uid: enrolledUids[i], ...data };
          }
        });

        const enrollMap = {};
        const enrolledStudents = [];
        enrollRawData.forEach((data) => {
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

        // One getDocs per student instead of one getDoc per (student × lesson)
        const progress = {};
        const progressPromises = dedupedStudents.map(async (student) => {
          progress[student.uid] = {};
          if (!student.hasLoggedIn) return;
          try {
            const lessonSnap = await getDocs(
              collection(db, "progress", student.uid, "courses", selectedCourse, "lessons")
            );
            const lessonDocsById = {};
            lessonSnap.forEach((d) => { lessonDocsById[d.id] = d; });
            lessonsList.forEach((lesson) => {
              const progDoc = lessonDocsById[lesson.id];
              if (progDoc?.exists()) {
                const data = progDoc.data();
                progress[student.uid][lesson.id] = { ...data.answers, _completed: data.completed || false, _completedAt: data.completedAt || null };
              } else {
                progress[student.uid][lesson.id] = {};
              }
            });
          } catch {
            lessonsList.forEach((lesson) => { progress[student.uid][lesson.id] = {}; });
          }
        });
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

        // Fetch activity grades for all students (weekly evidence + external activities)
        const actGrades = {};
        const actPromises = dedupedStudents.map(async (student) => {
          if (!student.hasLoggedIn) { actGrades[student.uid] = {}; return; }
          try {
            const actSnap = await getDocs(collection(db, "progress", student.uid, "courses", selectedCourse, "activities"));
            actGrades[student.uid] = {};
            actSnap.forEach((d) => { actGrades[student.uid][d.id] = d.data(); });
          } catch { actGrades[student.uid] = {}; }
        });
        await Promise.all(actPromises);
        setActivityData(actGrades);
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
      <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
      </div>
    );
  }

  // --- Helpers ---
  const getQuestions = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question");
  const getMCQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "multiple_choice");
  const getSAQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "short_answer");
  const getEmbedBlocks = (lesson) => (lesson.blocks || []).filter((b) => b.type === "embed" && b.scored);

  // --- NEW: Blended grade calculation ---
  const getStudentLessonGrade = (studentUid, lessonId) => {
    const answers = progressData[studentUid]?.[lessonId] || {};
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return null;

    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);
    const embeds = getEmbedBlocks(lesson);
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
        saItems.push({ type: "sa", prompt: q.prompt, points: a.writtenScore, max: 1, label: a.writtenLabel || tier?.label, tier, blockId: q.id, gradedBy: a.gradedBy ?? null, autogradeOriginal: a.autogradeOriginal ?? null });
      } else if (a?.submitted) {
        saItems.push({ type: "sa", prompt: q.prompt, points: null, max: 1, label: "Ungraded", tier: null, ungraded: true, blockId: q.id, gradedBy: null, autogradeOriginal: null });
      } else if (isPastDue) {
        saItems.push({ type: "sa", prompt: q.prompt, points: 0, max: 1, label: "Missing", tier: GRADE_TIERS[0], missing: true, blockId: q.id, gradedBy: null, autogradeOriginal: null });
      }
    });

    // Scored embeds: dynamically weighted — embeds = 50% of grade in mixed lessons
    const hasAnyProgress = Object.keys(answers).some((k) => !k.startsWith("_"));
    const nonEmbedPts = mc.length + sa.length + ((studentCompleted && reflection) ? 1 : 0);
    const embedPtsEach = (embeds.length > 0 && nonEmbedPts > 0) ? nonEmbedPts / embeds.length : 1;
    const embedItems = [];
    embeds.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted && a.writtenScore != null) {
        embedItems.push({ type: "embed", prompt: q.caption || "Activity", points: a.writtenScore * embedPtsEach, max: embedPtsEach, score: a.score, maxScore: a.maxScore });
      } else if (hasAnyProgress || isPastDue) {
        embedItems.push({ type: "embed", prompt: q.caption || "Activity", points: 0, max: embedPtsEach, missing: true });
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
      ...embedItems.filter((i) => i.points != null),
      ...(reflectionItem ? [reflectionItem] : []),
    ];
    if (gradedItems.length === 0) return null;

    const earned = gradedItems.reduce((sum, i) => sum + i.points, 0);
    const possible = gradedItems.reduce((sum, i) => sum + (i.max || 1), 0);
    const grade = Math.round((earned / possible) * 100);

    return {
      grade,
      earned: Math.round(earned * 100) / 100,
      possible,
      mcItems,
      saItems,
      embedItems,
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
    const lessonGrades = [];
    const lessonBreakdowns = [];
    const activityBreakdowns = [];

    lessons.forEach((lesson) => {
      const result = getStudentLessonGrade(studentUid, lesson.id);
      if (result) {
        lessonBreakdowns.push({ lessonId: lesson.id, title: lesson.title, category: lesson.gradeCategory || DEFAULT_CATEGORY, ...result });
        lessonGrades.push({
          percentage: result.grade,
          category: lesson.gradeCategory || DEFAULT_CATEGORY,
        });
      }
    });

    // Include activity & weekly evidence grades (always classwork)
    const activityPercentages = [];
    const studentActivities = activityData[studentUid] || {};
    Object.entries(studentActivities).forEach(([actId, data]) => {
      if (data.activityScore !== null && data.activityScore !== undefined) {
        const pct = Math.round(data.activityScore * 100);
        activityPercentages.push({ percentage: pct });
        activityBreakdowns.push({
          activityId: actId,
          title: data.activityTitle || actId,
          score: data.activityScore,
          label: data.activityLabel,
        });
      }
    });

    const weighted = getWeightedOverall(lessonGrades, activityPercentages);
    if (!weighted) return null;
    return {
      grade: weighted.overall,
      categories: weighted.categories,
      lessonBreakdowns,
      activityBreakdowns,
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
      setGradePopup({ studentUid, lessonId, x: rect.left, y: rect.bottom + 8, clickTop: rect.top - 8 });
    } else {
      setGradePopup({ studentUid, type: "overall", x: rect.left, y: rect.bottom + 8, clickTop: rect.top - 8 });
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
    if (!confirm(`Reset ${studentName}'s progress on "${lessonTitle}"?\n\nThis clears all their answers, completion status, and reflection. XP already earned is not affected.`)) return;
    try {
      const progressRef = doc(db, "progress", studentUid, "courses", selectedCourse, "lessons", lessonId);
      await deleteDoc(progressRef);

      // Also clear reflection if one exists
      try {
        const reflRef = doc(db, "courses", selectedCourse, "reflections", `${studentUid}_${lessonId}`);
        await deleteDoc(reflRef);
      } catch (reflErr) {
        // Reflection may not exist — that's fine
        console.warn("Could not delete reflection:", reflErr);
      }

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
      setReflectionData((prev) => {
        const updated = { ...prev };
        if (updated[studentUid]) {
          const studentReflections = { ...updated[studentUid] };
          delete studentReflections[lessonId];
          updated[studentUid] = studentReflections;
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to reset progress:", err);
      alert("Failed to reset progress. Check console for details.");
    }
  };

  // Reset a student's XP (and optionally badges/level)
  const handleResetXP = async () => {
    if (!confirmResetXP || resettingXP) return;
    const { studentUid } = confirmResetXP;
    setResettingXP(true);
    try {
      const gamRef = doc(db, "courses", selectedCourse, "gamification", studentUid);
      await setDoc(gamRef, {
        totalXP: 0,
        badges: [],
        badgesXPCredited: [],
        lessonsCompleted: 0,
        totalAnswered: 0,
        totalCorrect: 0,
        currentStreak: 0,
        longestStreak: 0,
        streakFreezes: 0,
        activityDates: [],
        perkUsage: {},
        resetAt: new Date(),
        resetBy: "teacher",
      });

      // Update local state
      setGamData((prev) => ({
        ...prev,
        [studentUid]: {
          totalXP: 0,
          badges: [],
          badgesXPCredited: [],
          lessonsCompleted: 0,
          totalAnswered: 0,
          totalCorrect: 0,
          currentStreak: 0,
          longestStreak: 0,
          streakFreezes: 0,
          activityDates: [],
          perkUsage: {},
        },
      }));

      setConfirmResetXP(null);
    } catch (err) {
      console.error("Failed to reset XP:", err);
      alert("Failed to reset XP. Please try again.");
    }
    setResettingXP(false);
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

  // --- Reset XP Confirmation Popup ---
  const renderConfirmResetXP = () => {
    if (!confirmResetXP) return null;
    const gam = gamData[confirmResetXP.studentUid] || {};
    return (
      <div style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
      }} onClick={() => setConfirmResetXP(null)}>
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 16,
          padding: "24px 28px", maxWidth: 380, width: "90%",
          boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ fontSize: 28, textAlign: "center", marginBottom: 8 }}>⚠️</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, textAlign: "center", marginBottom: 8 }}>
            Reset XP & Progress?
          </div>
          <div style={{ fontSize: 13, color: "var(--text2)", textAlign: "center", marginBottom: 16, lineHeight: 1.6 }}>
            This will reset <strong>{confirmResetXP.studentName}</strong>'s gamification data:
          </div>
          <div style={{
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "12px 16px", marginBottom: 16, fontSize: 12, color: "var(--text2)",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            <div>⚡ XP: <strong style={{ color: "var(--amber)" }}>{gam.totalXP || 0}</strong> → <strong>0</strong></div>
            <div>🏆 Badges: <strong>{(gam.badges || []).length}</strong> → <strong>0</strong></div>
            <div>🔥 Streak: <strong>{gam.currentStreak || 0}</strong> → <strong>0</strong></div>
            <div>📚 Lessons completed: <strong>{gam.lessonsCompleted || 0}</strong> → <strong>0</strong></div>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginBottom: 16, fontStyle: "italic" }}>
            This cannot be undone. Lesson answers and grades are not affected.
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleResetXP}
              disabled={resettingXP}
              style={{
                flex: 1, padding: "10px 16px", borderRadius: 8, border: "none",
                background: resettingXP ? "var(--surface2)" : "var(--red)",
                color: resettingXP ? "var(--text3)" : "#fff",
                fontWeight: 700, fontSize: 13, cursor: resettingXP ? "default" : "pointer",
              }}
            >
              {resettingXP ? "Resetting..." : "Reset Everything"}
            </button>
            <button
              onClick={() => setConfirmResetXP(null)}
              style={{
                padding: "10px 16px", borderRadius: 8,
                border: "1px solid var(--border)", background: "transparent",
                color: "var(--text)", fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Grade Override Handlers ---
  const OVERRIDE_OPTIONS = [
    { label: "Agent got it wrong", value: null },
    { label: "Data glitch", value: "glitch" },
    { label: "Mercy credit", value: "mercy" },
    { label: "Don't train on this", value: "ignore" },
  ];

  const handleGradeOverride = async (studentUid, lessonId, blockId, tier, overrideReason) => {
    setSavingGrade(true);
    try {
      const progressRef = doc(db, "progress", studentUid, "courses", selectedCourse, "lessons", lessonId);
      const updatePayload = {
        [`answers.${blockId}.writtenScore`]: tier.value,
        [`answers.${blockId}.writtenLabel`]: tier.label,
        [`answers.${blockId}.needsGrading`]: false,
        [`answers.${blockId}.gradedAt`]: new Date(),
        [`answers.${blockId}.gradedBy`]: "teacher",
      };
      if (overrideReason !== undefined) {
        updatePayload[`answers.${blockId}.overrideReason`] = overrideReason;
      }
      await updateDoc(progressRef, updatePayload);

      // Update local state so popup reflects the change immediately
      setProgressData((prev) => {
        const updated = { ...prev };
        if (updated[studentUid]?.[lessonId]?.[blockId]) {
          updated[studentUid] = { ...updated[studentUid] };
          updated[studentUid][lessonId] = { ...updated[studentUid][lessonId] };
          updated[studentUid][lessonId][blockId] = {
            ...updated[studentUid][lessonId][blockId],
            writtenScore: tier.value,
            writtenLabel: tier.label,
            needsGrading: false,
            gradedBy: "teacher",
            overrideReason: overrideReason ?? null,
          };
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to override grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setSavingGrade(false);
    setPendingOverride(null);
    setGradeAllPending(null);
  };

  const handleGradeTierClick = (studentUid, lessonId, blockId, tier, gradedBy, autogradeOriginal) => {
    const wasAutoGraded = !!(autogradeOriginal || gradedBy === "autograde-agent");
    if (wasAutoGraded) {
      setPendingOverride({ studentUid, lessonId, blockId, tier });
    } else {
      handleGradeOverride(studentUid, lessonId, blockId, tier, undefined);
    }
  };

  const handleGradeAll = (studentUid, lessonId, tier, saItems) => {
    const hasAutoGraded = saItems.some((item) => !!(item.autogradeOriginal || item.gradedBy === "autograde-agent"));
    if (hasAutoGraded) {
      setGradeAllPending({ studentUid, lessonId, tier, saItems });
    } else {
      // No auto-graded items, save all immediately
      saItems.forEach((item) => {
        if (!item.missing) {
          handleGradeOverride(studentUid, lessonId, item.blockId, tier, undefined);
        }
      });
    }
  };

  const handleGradeAllConfirm = (overrideReason) => {
    if (!gradeAllPending) return;
    const { studentUid, lessonId, tier, saItems } = gradeAllPending;
    saItems.forEach((item) => {
      if (!item.missing) {
        handleGradeOverride(studentUid, lessonId, item.blockId, tier, overrideReason);
      }
    });
    setGradeAllPending(null);
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
            <span>Weighted Overall</span>
            <span style={{ color: gradeColor(overall.grade) }}>{overall.grade}%</span>
          </div>
          {/* Category breakdown */}
          {overall.categories && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 4 }}>
              {["assessment", "classwork", "homework"].map((cat) => {
                const c = overall.categories[cat];
                if (!c || c.count === 0) return null;
                return (
                  <div key={cat} style={{ fontSize: 12 }}>
                    <span style={{ fontWeight: 700, color: CATEGORY_COLORS[cat] }}>
                      {CATEGORY_LABELS[cat]} ({Math.round(c.effectiveWeight * 100)}%)
                    </span>
                    {" "}
                    <span style={{ color: gradeColor(c.avg) }}>{c.avg != null ? `${Math.round(c.avg)}%` : "—"}</span>
                    <span style={{ color: "var(--text3)" }}> ({c.count})</span>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
          {overall.lessonBreakdowns.map((lb) => (
            <div key={lb.lessonId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0" }}>
              <span style={{ color: "var(--text2)", flex: 1 }}>
                {lb.title}
                <span style={{ fontSize: 10, marginLeft: 6, color: CATEGORY_COLORS[lb.category], fontWeight: 600 }}>
                  {CATEGORY_LABELS[lb.category]?.slice(0, 2).toUpperCase()}
                </span>
              </span>
              <span style={{ fontWeight: 600, color: gradeColor(lb.grade), marginLeft: 12 }}>
                {lb.grade}%
              </span>
            </div>
          ))}
          {overall.activityBreakdowns?.length > 0 && (
            <>
              <div style={{ height: 1, background: "var(--border)", margin: "6px 0" }} />
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Activities & Evidence
              </div>
              {overall.activityBreakdowns.map((ab) => {
                const tierInfo = getTierInfo(ab.score);
                return (
                  <div key={ab.activityId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 13, padding: "4px 0" }}>
                    <span style={{ color: "var(--text2)", flex: 1 }}>{ab.title}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 12 }}>
                      <span style={{
                        fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600,
                        background: tierInfo?.bg || "var(--surface2)", color: tierInfo?.color || "var(--text3)",
                      }}>{ab.label}</span>
                      <span style={{ fontWeight: 600, color: "var(--text)" }}>
                        {(ab.score * 100).toFixed(0)}%
                      </span>
                    </span>
                  </div>
                );
              })}
            </>
          )}
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Written Responses ({result.saGraded}/{result.saTotal} graded)
                </div>
                {result.saItems.filter((i) => !i.missing).length > 0 && (
                  <div style={{ display: "flex", gap: 2 }}>
                    <span style={{ fontSize: 10, color: "var(--text3)", marginRight: 4, alignSelf: "center" }}>All:</span>
                    {GRADE_TIERS.map((t) => (
                      <button key={t.label} onClick={() => handleGradeAll(gradePopup.studentUid, gradePopup.lessonId, t, result.saItems)}
                        disabled={savingGrade}
                        style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4, border: "1px solid var(--border)",
                          background: "transparent", color: t.color, cursor: savingGrade ? "wait" : "pointer", lineHeight: 1,
                        }}>
                        {t.label[0]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grade All override reason picker */}
              {gradeAllPending && gradeAllPending.lessonId === gradePopup.lessonId && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 0", borderBottom: "1px solid var(--border)", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", width: "100%", marginBottom: 2 }}>
                    Set all to <strong style={{ color: gradeAllPending.tier.color }}>{gradeAllPending.tier.label}</strong> — why?
                  </span>
                  {OVERRIDE_OPTIONS.map((opt) => (
                    <button key={opt.label} onClick={() => handleGradeAllConfirm(opt.value)}
                      disabled={savingGrade}
                      style={{
                        fontSize: 10, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border)",
                        background: "var(--bg)", color: "var(--text2)", cursor: savingGrade ? "wait" : "pointer",
                      }}>
                      {opt.label}
                    </button>
                  ))}
                  <button onClick={() => setGradeAllPending(null)}
                    style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, border: "none", background: "none", color: "var(--text3)", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              )}

              {result.saItems.map((item, i) => {
                const itemWasAutoGraded = !!(item.autogradeOriginal || item.gradedBy === "autograde-agent");
                const graderIcon = item.gradedBy === "teacher" ? "👩‍🏫" : item.gradedBy === "autograde-agent" ? "🤖" : null;
                const graderLabel = item.gradedBy === "teacher"
                  ? (itemWasAutoGraded ? "Teacher override" : "Teacher")
                  : item.gradedBy === "autograde-agent" ? "Auto-graded" : null;
                return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2, padding: "4px 0", borderBottom: i < result.saItems.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                    <span style={{ color: "var(--text2)", flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
                      {item.prompt?.slice(0, 50)}{item.prompt?.length > 50 ? "..." : ""}
                      {graderIcon && (
                        <span title={graderLabel} style={{
                          fontSize: 9, padding: "1px 5px", borderRadius: 4, fontWeight: 600, whiteSpace: "nowrap",
                          background: item.gradedBy === "autograde-agent" ? "rgba(139,92,246,0.12)" : "rgba(59,130,246,0.12)",
                          color: item.gradedBy === "autograde-agent" ? "#8b5cf6" : "#3b82f6",
                        }}>
                          {graderIcon} {graderLabel}
                        </span>
                      )}
                    </span>
                    {item.missing ? (
                      <span style={{ fontSize: 10, fontStyle: "italic", color: "var(--text3)", marginLeft: 8 }}>missing</span>
                    ) : (
                      <div style={{ display: "flex", gap: 2, marginLeft: 8 }}>
                        {GRADE_TIERS.map((t) => {
                          const isActive = item.points === t.value && !item.ungraded;
                          return (
                            <button key={t.label}
                              onClick={() => handleGradeTierClick(gradePopup.studentUid, gradePopup.lessonId, item.blockId, t, item.gradedBy, item.autogradeOriginal)}
                              disabled={savingGrade}
                              style={{
                                fontSize: 9, fontWeight: 700, padding: "2px 5px", borderRadius: 4, lineHeight: 1,
                                border: isActive ? "none" : "1px solid var(--border)",
                                background: isActive ? t.bg : "transparent",
                                color: isActive ? t.color : "var(--text3)",
                                cursor: savingGrade ? "wait" : "pointer",
                              }}>
                              {t.label[0]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Per-item override reason picker */}
                  {pendingOverride && pendingOverride.blockId === item.blockId && pendingOverride.lessonId === gradePopup.lessonId && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 3, padding: "4px 0" }}>
                      <span style={{ fontSize: 10, color: "var(--text3)", width: "100%", marginBottom: 2 }}>
                        Changing to <strong style={{ color: pendingOverride.tier.color }}>{pendingOverride.tier.label}</strong> — why?
                      </span>
                      {OVERRIDE_OPTIONS.map((opt) => (
                        <button key={opt.label}
                          onClick={() => handleGradeOverride(pendingOverride.studentUid, pendingOverride.lessonId, pendingOverride.blockId, pendingOverride.tier, opt.value)}
                          disabled={savingGrade}
                          style={{
                            fontSize: 10, padding: "3px 8px", borderRadius: 6, border: "1px solid var(--border)",
                            background: "var(--bg)", color: "var(--text2)", cursor: savingGrade ? "wait" : "pointer",
                          }}>
                          {opt.label}
                        </button>
                      ))}
                      <button onClick={() => setPendingOverride(null)}
                        style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, border: "none", background: "none", color: "var(--text3)", cursor: "pointer" }}>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );})}
            </>
          )}

          {result.embedItems.length > 0 && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 8 }}>
                Activities ({result.embedItems.filter(i => !i.missing).length}/{result.embedItems.length})
              </div>
              {result.embedItems.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "4px 0", borderBottom: i < result.embedItems.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ color: "var(--text2)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.prompt}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
                    {item.missing ? (
                      <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600, background: "var(--surface2)", color: "var(--text3)" }}>Missing</span>
                    ) : (
                      <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, fontWeight: 600, background: "rgba(16,185,129,0.12)", color: "var(--green)" }}>{item.score}/{item.maxScore}</span>
                    )}
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{(item.points ?? 0).toFixed(1)} / {item.max}</span>
                  </span>
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

    // Position popup — flip above the click target if not enough room below
    const spaceBelow = window.innerHeight - gradePopup.y;
    const spaceAbove = gradePopup.clickTop || gradePopup.y; // clickTop = top of the clicked element
    const preferredHeight = 400;
    const margin = 16; // minimum gap from viewport edge
    let top, maxH;

    if (spaceBelow >= preferredHeight + margin) {
      // Enough room below — show below
      top = gradePopup.y;
      maxH = Math.min(preferredHeight, spaceBelow - margin);
    } else if (spaceAbove >= preferredHeight + margin) {
      // Flip above
      maxH = Math.min(preferredHeight, spaceAbove - margin);
      top = spaceAbove - maxH;
    } else {
      // Neither side has full room — use whichever side is bigger
      if (spaceBelow >= spaceAbove) {
        top = gradePopup.y;
        maxH = spaceBelow - margin;
      } else {
        maxH = spaceAbove - margin;
        top = spaceAbove - maxH;
      }
    }

    const popupStyle = {
      position: "fixed",
      left: Math.min(gradePopup.x, window.innerWidth - 420),
      top,
      width: 400,
      maxHeight: maxH,
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
            {(gam.totalXP > 0 || (gam.badges || []).length > 0) && (
              <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 16 }}>
                <button
                  onClick={() => setConfirmResetXP({ studentUid: s.uid, studentName: s.displayName })}
                  style={{
                    fontSize: 11, fontWeight: 600, padding: "6px 12px", borderRadius: 6,
                    border: "1px solid var(--border)", background: "transparent",
                    color: "var(--text3)", cursor: "pointer", transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "transparent"; }}
                  title="Reset XP, badges, and streaks"
                >
                  Reset XP
                </button>
              </div>
            )}
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

        <h3 className="section-heading" style={{ marginBottom: 12 }}>Lesson Grades</h3>
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
                  const cardWasAutoGraded = !!(a.autogradeOriginal || a.gradedBy === "autograde-agent");
                  return (
                    <div key={q.id} style={{
                      marginTop: 10, background: "var(--bg)", borderRadius: 8,
                      padding: "10px 14px", border: "1px solid var(--border)",
                    }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", flex: 1 }}>
                          Written: {q.prompt?.slice(0, 60)}{q.prompt?.length > 60 ? "..." : ""}
                        </div>
                        <div style={{ display: "flex", gap: 3, marginLeft: 8 }}>
                          {GRADE_TIERS.map((t) => {
                            const isActive = tier && a.writtenScore === t.value;
                            return (
                              <button key={t.label}
                                onClick={() => handleGradeTierClick(s.uid, lesson.id, q.id, t, a.gradedBy, a.autogradeOriginal)}
                                disabled={savingGrade}
                                style={{
                                  fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 5, lineHeight: 1,
                                  border: isActive ? "none" : "1px solid var(--border)",
                                  background: isActive ? t.bg : "transparent",
                                  color: isActive ? t.color : "var(--text3)",
                                  cursor: savingGrade ? "wait" : "pointer",
                                  transition: "all 0.15s",
                                }}
                                title={t.label}>
                                {t.label.slice(0, 3)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Override reason picker for this card */}
                      {pendingOverride && pendingOverride.blockId === q.id && pendingOverride.lessonId === lesson.id && pendingOverride.studentUid === s.uid && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "6px 0", borderBottom: "1px solid var(--border)", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: "var(--text3)", width: "100%", marginBottom: 2 }}>
                            Changing to <strong style={{ color: pendingOverride.tier.color }}>{pendingOverride.tier.label}</strong> — why?
                          </span>
                          {OVERRIDE_OPTIONS.map((opt) => (
                            <button key={opt.label}
                              onClick={() => handleGradeOverride(s.uid, lesson.id, q.id, pendingOverride.tier, opt.value)}
                              disabled={savingGrade}
                              style={{
                                fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)",
                                background: "var(--surface2)", color: "var(--text2)", cursor: savingGrade ? "wait" : "pointer",
                              }}>
                              {opt.label}
                            </button>
                          ))}
                          <button onClick={() => setPendingOverride(null)}
                            style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "none", background: "none", color: "var(--text3)", cursor: "pointer" }}>
                            Cancel
                          </button>
                        </div>
                      )}

                      <div style={{ fontSize: 13, lineHeight: 1.6, color: "var(--text2)" }}>{a.answer}</div>
                      {a.feedback && (
                        <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6, fontStyle: "italic" }}>
                          Feedback: {a.feedback}
                        </div>
                      )}
                      {/* Grader badge */}
                      {a.gradedBy && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                            background: a.gradedBy === "autograde-agent" ? "rgba(139,92,246,0.12)" : "rgba(59,130,246,0.12)",
                            color: a.gradedBy === "autograde-agent" ? "#8b5cf6" : "#3b82f6",
                          }}>
                            {a.gradedBy === "autograde-agent" ? "🤖 Auto-graded" : "👩‍🏫 Teacher"}
                          </span>
                          {cardWasAutoGraded && a.gradedBy === "teacher" && (
                            <span style={{ fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>overridden</span>
                          )}
                        </div>
                      )}
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

        <h2 className="section-heading" style={{ marginBottom: 6 }}>{lesson.title}</h2>
        <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 24 }}>
          {mc.length} multiple choice · {sa.length} written response · {filteredStudents.length} students
        </p>

        {mc.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 className="section-heading" style={{ marginBottom: 12 }}>Question Performance</h3>
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

        <h3 className="section-heading" style={{ marginBottom: 12 }}>Student Results</h3>
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
    <main id="main-content" className="page-wrapper">
        <h1 className="page-title" style={{ marginBottom: 8 }}>
          Student Progress
        </h1>
        <p className="page-subtitle" style={{ marginBottom: 28 }}>
          Track grades, question performance, and student engagement.
        </p>

        {loading ? (
          <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
            {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ width: 130, height: 36, borderRadius: 8 }} />)}
          </div>
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
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
                  {[1,2,3,4].map((i) => <div key={i} className="skeleton" style={{ height: 82, borderRadius: 12 }} />)}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[1,2,3,4,5,6].map((i) => <div key={i} className="skeleton skeleton-line" style={{ height: 52, borderRadius: 10 }} />)}
                </div>
              </div>
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

                <h3 className="section-heading" style={{ marginBottom: 12 }}>📚 Lessons</h3>
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

                <h3 className="section-heading" style={{ marginBottom: 12 }}>👥 Students</h3>
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

      {/* Grade breakdown popup */}
      {renderGradePopup()}
      {/* Manual completion confirmation popup */}
      {renderConfirmComplete()}
      {/* Reset XP confirmation modal */}
      {renderConfirmResetXP()}
    </main>
  );
}
