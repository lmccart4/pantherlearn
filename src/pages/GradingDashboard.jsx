// src/pages/GradingDashboard.jsx
// Optimized: lazy-loads data by course → section → lesson instead of fetching everything upfront.
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import { db, signInWithClassroom } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { fetchClassroomCourses, fetchClassroomStudents, createCourseWork, listStudentSubmissions, patchStudentGrade } from "../lib/classroom";
import CourseOverview from "../components/grading/CourseOverview";
import LessonView from "../components/grading/LessonView";
import StudentView from "../components/grading/StudentView";
import ActivitiesTab from "../components/grading/ActivitiesTab";
import WeeklyEvidenceTab from "../components/grading/WeeklyEvidenceTab";

export default function GradingDashboard() {
  const { userRole } = useAuth();

  // Navigation state
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("written");
  const [showGraded, setShowGraded] = useState(false);

  // Data state
  const [lessonMap, setLessonMap] = useState({});
  const [courseLessons, setCourseLessons] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [sections] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [responses, setResponses] = useState([]);
  const [chatLogGroups, setChatLogGroups] = useState([]);
  const [classChatCount, setClassChatCount] = useState(0);

  // Loading state
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingCourse, setLoadingCourse] = useState(false);
  const [loadingLesson, setLoadingLesson] = useState(false);

  // Google Classroom sync state
  const [syncModal, setSyncModal] = useState(false);
  const [syncStep, setSyncStep] = useState("idle"); // idle | picking | syncing | done
  const [syncToken, setSyncToken] = useState(null);
  const [classroomCourses, setClassroomCourses] = useState([]);
  const [syncLog, setSyncLog] = useState([]);
  const [syncSummary, setSyncSummary] = useState(null);

  // Use refs to avoid stale closures in loadResponses
  const enrollmentsRef = useRef([]);
  const courseLessonsRef = useRef([]);
  const lessonMapRef = useRef({});

  // Keep refs in sync
  useEffect(() => { enrollmentsRef.current = enrollments; }, [enrollments]);
  useEffect(() => { courseLessonsRef.current = courseLessons; }, [courseLessons]);
  useEffect(() => { lessonMapRef.current = lessonMap; }, [lessonMap]);

  // ─── Step 1: Load courses on mount ───
  useEffect(() => {
    if (userRole !== "teacher") return;
    const fetchCourses = async () => {
      try {
        const snap = await getDocs(collection(db, "courses"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden);
        setCourses(list);
        if (list.length > 0) setSelectedCourse(list[0].id);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
      setLoadingCourses(false);
    };
    fetchCourses();
  }, [userRole]);

  // ─── Step 2: When course changes, load enrollments + lessons + user map ───
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchCourseData = async () => {
      setLoadingCourse(true);
      setResponses([]);
      setChatLogGroups([]);
      setSelectedLesson(null);
      setSelectedStudent(null);
      setEnrollments([]);

      try {
        // Fetch enrollments for THIS course only (not all enrollments)
        const enrollSnap = await getDocs(
          query(collection(db, "enrollments"), where("courseId", "==", selectedCourse))
        );
        const courseEnrollments = [];
        const enrolledUids = new Set();
        enrollSnap.forEach((d) => {
          const data = d.data();
          const uid = data.uid || data.email?.replace(/[.@]/g, "_");
          if (uid) enrolledUids.add(uid);
          courseEnrollments.push({
            uid,
            displayName: data.name || data.email || "Unknown",
            email: data.email || "",
            photoURL: "",
            section: data.section || "",
            hasLoggedIn: false,
          });
        });

        // Fetch only enrolled users (not ALL users in the system)
        const users = {};
        const uidBatches = [...enrolledUids];
        for (let i = 0; i < uidBatches.length; i++) {
          try {
            const userDoc = await getDoc(doc(db, "users", uidBatches[i]));
            if (userDoc.exists()) {
              const data = userDoc.data();
              users[userDoc.id] = {
                uid: userDoc.id,
                displayName: data.displayName || data.email || userDoc.id,
                email: data.email || "",
                photoURL: data.photoURL || "",
                role: data.role || "student",
              };
            }
          } catch (e) { /* user doc may not exist */ }
        }
        setStudentMap(users);

        // Enrich enrollment data with user profile info
        courseEnrollments.forEach((e) => {
          const userMatch = users[e.uid];
          if (userMatch) {
            e.displayName = userMatch.displayName;
            e.email = userMatch.email || e.email;
            e.photoURL = userMatch.photoURL;
            e.hasLoggedIn = true;
          }
        });

        // Deduplicate by uid
        const seen = new Set();
        const deduped = courseEnrollments.filter((e) => {
          if (seen.has(e.uid)) return false;
          seen.add(e.uid);
          return true;
        });
        setEnrollments(deduped);

        // Fetch lessons for this course
        const lessonsSnap = await getDocs(
          query(collection(db, "courses", selectedCourse, "lessons"), orderBy("order", "asc"))
        );
        const lessons = {};
        const lessonsList = [];
        lessonsSnap.forEach((d) => {
          const data = d.data();
          lessons[d.id] = {
            title: data.title || d.id,
            courseTitle: courses.find((c) => c.id === selectedCourse)?.title || selectedCourse,
            blocks: data.blocks || [],
            order: data.order || 0,
          };
          lessonsList.push({ id: d.id, title: data.title || d.id, order: data.order || 0 });
        });
        setLessonMap((prev) => ({ ...prev, ...lessons }));
        setCourseLessons(lessonsList);

        // Fetch ClassChat conversation count for the "Student Messages" stat card
        try {
          const chatsSnap = await getDocs(collection(db, "courses", selectedCourse, "chats"));
          setClassChatCount(chatsSnap.size);
        } catch (e) {
          setClassChatCount(0);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
      }
      setLoadingCourse(false);
    };
    fetchCourseData();
  }, [selectedCourse]);

  // ─── Step 3: Load responses for filtered students, scoped to lesson if selected ───
  // TODO: The current filter (needsGrading && submitted && writtenScore == null) excludes
  // already-graded items, including auto-graded ones. For the teacher override flow to work
  // on auto-graded responses, add a "Show graded" toggle or separate tab that loads items
  // where gradedBy === "autograde-agent" && writtenScore != null, so teachers can review
  // and override auto-grades.
  async function loadResponses(lessonId, section) {
    if (!selectedCourse) return;
    setLoadingLesson(true);

    const currentEnrollments = enrollmentsRef.current;
    const currentCourseLessons = courseLessonsRef.current;
    const currentLessonMap = lessonMapRef.current;
    const sectionToUse = section !== undefined ? section : selectedSection;

    // Get student UIDs filtered by section
    const filteredStudents = sectionToUse === "all"
      ? currentEnrollments
      : currentEnrollments.filter((e) => e.section === sectionToUse);
    const studentUids = filteredStudents.map((e) => e.uid).filter(Boolean);

    try {
      const writtenResponses = [];

      if (lessonId) {
        // Fetch specific lesson responses — parallel reads for all students
        const results = await Promise.allSettled(
          studentUids.map(async (uid) => {
            const progressRef = doc(db, "progress", uid, "courses", selectedCourse, "lessons", lessonId);
            const progressDoc = await getDoc(progressRef);
            return { uid, progressDoc };
          })
        );
        for (const result of results) {
          if (result.status !== "fulfilled") continue;
          const { uid, progressDoc } = result.value;
          if (!progressDoc.exists()) continue;
          const data = progressDoc.data();
          if (!data.answers) continue;
          Object.entries(data.answers).forEach(([blockId, answer]) => {
            const needsReview = answer.needsGrading && answer.submitted && answer.writtenScore == null;
            const isAutoGraded = answer.gradedBy === "autograde-agent" && answer.writtenScore != null;
            if (needsReview || (showGraded && isAutoGraded)) {
              writtenResponses.push({
                id: `${progressDoc.ref.path}-${blockId}`,
                studentId: uid, lessonId, courseId: selectedCourse, blockId,
                answer: answer.answer, submittedAt: answer.submittedAt,
                writtenScore: answer.writtenScore ?? null, writtenLabel: answer.writtenLabel ?? null,
                gradedBy: answer.gradedBy ?? null,
                autogradeOriginal: answer.autogradeOriginal ?? null,
                feedback: answer.feedback ?? null,
                path: progressDoc.ref.path,
              });
            }
          });
        }
      } else {
        // Fetch all lessons per student — parallel batch queries
        const results = await Promise.allSettled(
          studentUids.map(async (uid) => {
            const lessonDocs = await getDocs(
              collection(db, "progress", uid, "courses", selectedCourse, "lessons")
            );
            return { uid, lessonDocs };
          })
        );
        for (const result of results) {
          if (result.status !== "fulfilled") continue;
          const { uid, lessonDocs } = result.value;
          lessonDocs.forEach((d) => {
            const data = d.data();
            if (!data.answers) return;
            Object.entries(data.answers).forEach(([blockId, answer]) => {
              const needsReview = answer.needsGrading && answer.submitted && answer.writtenScore == null;
              const isAutoGraded = answer.gradedBy === "autograde-agent" && answer.writtenScore != null;
              if (needsReview || (showGraded && isAutoGraded)) {
                writtenResponses.push({
                  id: `${d.ref.path}-${blockId}`,
                  studentId: uid, lessonId: d.id, courseId: selectedCourse, blockId,
                  answer: answer.answer, submittedAt: answer.submittedAt,
                  writtenScore: answer.writtenScore ?? null, writtenLabel: answer.writtenLabel ?? null,
                  gradedBy: answer.gradedBy ?? null,
                  autogradeOriginal: answer.autogradeOriginal ?? null,
                  feedback: answer.feedback ?? null,
                  path: d.ref.path,
                });
              }
            });
          });
        }
      }
      setResponses(writtenResponses);

      // Fetch chat logs scoped to lesson if selected
      const allLogs = [];
      const lessonsToCheck = lessonId ? [lessonId] : currentCourseLessons.map((l) => l.id);

      for (const lid of lessonsToCheck) {
        const lessonInfo = currentLessonMap[lid];
        const chatBlocks = (lessonInfo?.blocks || []).filter((b) => b.type === "chatbot");

        for (const chatBlock of chatBlocks) {
          const blockId = chatBlock.id;
          try {
            const studentDocs = await getDocs(
              collection(db, "courses", selectedCourse, "chatLogs", lid, blockId)
            );
            studentDocs.forEach((studentDoc) => {
              if (!studentUids.includes(studentDoc.id)) return;
              const data = studentDoc.data();
              if (data.messages && data.messages.length > 0) {
                allLogs.push({
                  id: `${selectedCourse}-${lid}-${blockId}-${studentDoc.id}`,
                  studentId: studentDoc.id,
                  courseId: selectedCourse,
                  lessonId: lid,
                  blockId,
                  blockTitle: chatBlock.title || blockId,
                  messages: data.messages,
                  messageCount: data.messageCount || data.messages.filter((m) => m.role === "user").length,
                  lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
                });
              }
            });
          } catch (e) { continue; }
        }
      }
      setChatLogGroups(allLogs);
    } catch (err) {
      console.error("Error fetching responses:", err);
    }
    setLoadingLesson(false);
  }

  // ─── Auto-load responses when course data is ready ───
  useEffect(() => {
    if (!loadingCourse && enrollments.length > 0) {
      loadResponses(selectedLesson, selectedSection);
    }
  }, [enrollments, selectedSection, loadingCourse, showGraded]);

  // ─── Handle lesson selection ───
  function handleSelectLesson(lessonId) {
    setSelectedLesson(lessonId);
    setSelectedStudent(null);
    loadResponses(lessonId, selectedSection);
  }

  if (userRole !== "teacher") {
    return (
      <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
        <p style={{ color: "var(--text2)", marginTop: 8 }}>This page is only available to teachers.</p>
      </div>
    );
  }

  // ─── Google Classroom Sync ───
  async function handleSyncToClassroom() {
    setSyncModal(true);
    setSyncStep("picking");
    setSyncLog([]);
    setSyncSummary(null);
    try {
      const token = await signInWithClassroom();
      setSyncToken(token);
      const gcCourses = await fetchClassroomCourses(token);
      setClassroomCourses(gcCourses);
    } catch (err) {
      setSyncLog([`Error: ${err.message}`]);
      setSyncStep("done");
    }
  }

  async function executeSyncForCourse(classroomCourseId) {
    setSyncStep("syncing");
    const log = [];
    let totalGrades = 0;
    let totalLessons = 0;

    try {
      // 1. Fetch Classroom students and match by email
      log.push("Fetching Classroom roster...");
      setSyncLog([...log]);
      const gcStudents = await fetchClassroomStudents(syncToken, classroomCourseId);

      // Build email → classroomUserId map
      const emailToClassroomId = {};
      gcStudents.forEach((s) => {
        if (s.email) emailToClassroomId[s.email.toLowerCase()] = s.userId;
      });

      // Build pantherlearn uid → email map from enrollments
      const uidToEmail = {};
      enrollments.forEach((e) => {
        if (e.email) uidToEmail[e.uid || e.id] = e.email.toLowerCase();
      });

      log.push(`Matched ${Object.keys(emailToClassroomId).length} Classroom students`);
      setSyncLog([...log]);

      // 2. Fetch ALL progress for enrolled students in this course
      const currentEnrollments = enrollmentsRef.current;
      const studentUids = currentEnrollments.map((e) => e.uid || e.id);

      // Collect per-lesson per-student grades
      const lessonGrades = {}; // { lessonId: { uid: [scores] } }

      const results = await Promise.allSettled(
        studentUids.map(async (uid) => {
          const lessonDocs = await getDocs(
            collection(db, "progress", uid, "courses", selectedCourse, "lessons")
          );
          return { uid, lessonDocs };
        })
      );

      for (const result of results) {
        if (result.status !== "fulfilled") continue;
        const { uid, lessonDocs } = result.value;
        lessonDocs.forEach((d) => {
          const data = d.data();
          if (!data.answers) return;
          Object.values(data.answers).forEach((answer) => {
            if (answer.writtenScore != null) {
              if (!lessonGrades[d.id]) lessonGrades[d.id] = {};
              if (!lessonGrades[d.id][uid]) lessonGrades[d.id][uid] = [];
              lessonGrades[d.id][uid].push(answer.writtenScore);
            }
          });
        });
      }

      // 3. For each lesson with grades, create assignment and push grades
      const currentLessonMap = lessonMapRef.current;
      const lessonsWithGrades = Object.keys(lessonGrades).filter(
        (lid) => currentLessonMap[lid] && Object.keys(lessonGrades[lid]).length > 0
      );

      log.push(`Found ${lessonsWithGrades.length} lessons with grades to sync`);
      setSyncLog([...log]);

      for (const lessonId of lessonsWithGrades) {
        const lessonTitle = currentLessonMap[lessonId]?.title || lessonId;

        // Create assignment
        log.push(`Creating assignment: ${lessonTitle}...`);
        setSyncLog([...log]);
        const courseWork = await createCourseWork(syncToken, classroomCourseId, lessonTitle, 100);

        // Get auto-created submissions
        const submissions = await listStudentSubmissions(syncToken, classroomCourseId, courseWork.id);

        // Build classroomUserId → submissionId map
        const userToSubmission = {};
        submissions.forEach((s) => {
          userToSubmission[s.userId] = s.id;
        });

        // Push grades for each matched student
        let lessonGradeCount = 0;
        for (const [uid, scores] of Object.entries(lessonGrades[lessonId])) {
          const email = uidToEmail[uid];
          if (!email) continue;
          const classroomUserId = emailToClassroomId[email];
          if (!classroomUserId) continue;
          const submissionId = userToSubmission[classroomUserId];
          if (!submissionId) continue;

          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          const grade = Math.round(avg * 100);

          try {
            await patchStudentGrade(syncToken, classroomCourseId, courseWork.id, submissionId, grade);
            lessonGradeCount++;
          } catch (err) {
            log.push(`  Warning: could not grade ${email}: ${err.message}`);
            setSyncLog([...log]);
          }
        }

        log.push(`  Synced ${lessonGradeCount} grades for "${lessonTitle}"`);
        setSyncLog([...log]);
        totalGrades += lessonGradeCount;
        totalLessons++;
      }

      setSyncSummary({ totalGrades, totalLessons });
      log.push(`\nDone! Synced ${totalGrades} grades across ${totalLessons} lessons.`);
      setSyncLog([...log]);
    } catch (err) {
      log.push(`Error: ${err.message}`);
      setSyncLog([...log]);
    }
    setSyncStep("done");
  }

  // Helpers
  const getStudentName = (uid) => studentMap[uid]?.displayName || uid.slice(0, 8) + "...";
  const getStudentEmail = (uid) => studentMap[uid]?.email || "";
  const getStudentPhoto = (uid) => studentMap[uid]?.photoURL || "";
  const getLessonTitle = (lessonId) => lessonMap[lessonId]?.title || lessonId;
  const getBlockPrompt = (lessonId, blockId) => {
    const blocks = lessonMap[lessonId]?.blocks || [];
    const block = blocks.find((b) => b.id === blockId);
    return block?.prompt || block?.title || blockId;
  };

  const helpers = { getStudentName, getStudentEmail, getStudentPhoto, getLessonTitle, getBlockPrompt, lessonMap, responses };

  const courseResponses = responses;
  const courseLogs = chatLogGroups;
  const currentCourse = courses.find((c) => c.id === selectedCourse);
  const currentLessonTitle = selectedLesson ? getLessonTitle(selectedLesson) : null;
  const currentStudentName = selectedStudent ? getStudentName(selectedStudent) : null;
  const viewLevel = selectedStudent ? "student" : selectedLesson ? "lesson" : "course";

  const totalWritten = courseResponses.length;
  const totalConversations = courseLogs.length;

  // Breadcrumb
  const renderBreadcrumb = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text3)", marginBottom: 20, flexWrap: "wrap" }}>
      <button onClick={() => { setSelectedLesson(null); setSelectedStudent(null); loadResponses(null, selectedSection); }}
        style={{ background: "none", border: "none", color: viewLevel === "course" ? "var(--text)" : "var(--amber)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, padding: 0, fontWeight: 600 }}>
        {currentCourse?.icon} {currentCourse?.title || "Course"}
      </button>
      {selectedLesson && (
        <>
          <span style={{ color: "var(--text3)" }}>›</span>
          <button onClick={() => { setSelectedStudent(null); }}
            style={{ background: "none", border: "none", color: viewLevel === "lesson" ? "var(--text)" : "var(--amber)", cursor: "pointer", fontFamily: "var(--font-body)", fontSize: 13, padding: 0, fontWeight: 600 }}>
            {currentLessonTitle}
          </button>
        </>
      )}
      {selectedStudent && (
        <>
          <span style={{ color: "var(--text3)" }}>›</span>
          <span style={{ color: "var(--text)", fontWeight: 600 }}>{currentStudentName}</span>
        </>
      )}
    </div>
  );

  const isLoading = loadingCourses || loadingCourse;

  return (
    <main id="main-content" className="page-wrapper">
        <h1 className="page-title" style={{ marginBottom: 8 }}>
          Grading Dashboard
        </h1>
        <p className="page-subtitle" style={{ marginBottom: 28 }}>
          Review student written responses and AI chat activity.
        </p>

        {isLoading ? (
          <div>
            {/* Tab bar skeleton */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-rect" style={{ width: 100, height: 34, borderRadius: 8 }} />
              ))}
            </div>
            {/* Stat cards skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-card" style={{ height: 80 }} />
              ))}
            </div>
            {/* Response rows skeleton */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton skeleton-card" style={{ height: 64, marginBottom: 8, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
                <div className="skeleton skeleton-circle" style={{ width: 32, height: 32 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton skeleton-line" style={{ width: `${40 + i * 8}%`, height: 14, marginBottom: 4 }} />
                  <div className="skeleton skeleton-line" style={{ width: "30%", height: 11 }} />
                </div>
                <div className="skeleton skeleton-rect" style={{ width: 60, height: 28, borderRadius: 6 }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Course tabs + section filter + content type tabs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Course tabs */}
                <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, width: "fit-content" }}>
                  {courses.map((c) => (
                    <button key={c.id}
                      className={`top-nav-link ${selectedCourse === c.id ? "active" : ""}`}
                      onClick={() => { setSelectedCourse(c.id); }}>
                      {c.icon} {c.title}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSyncToClassroom}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
                    border: "1px solid var(--border)", background: "transparent", color: "var(--text2)",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface2)"; e.currentTarget.style.borderColor = "var(--text3)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "var(--border)"; }}
                >
                  Sync to Classroom
                </button>
              </div>

              {/* Content type tabs */}
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, width: "fit-content" }}>
                <button className={`top-nav-link ${activeTab === "written" ? "active" : ""}`}
                  onClick={() => { setActiveTab("written"); setSelectedLesson(null); setSelectedStudent(null); }}>
                  ✏️ Written ({totalWritten})
                </button>
                <button className={`top-nav-link ${activeTab === "chats" ? "active" : ""}`}
                  onClick={() => { setActiveTab("chats"); setSelectedLesson(null); setSelectedStudent(null); }}>
                  💬 Chats ({totalConversations})
                </button>
                <button className={`top-nav-link ${activeTab === "activities" ? "active" : ""}`}
                  onClick={() => { setActiveTab("activities"); setSelectedLesson(null); setSelectedStudent(null); }}>
                  🧪 Activities
                </button>
                <button className={`top-nav-link ${activeTab === "evidence" ? "active" : ""}`}
                  onClick={() => { setActiveTab("evidence"); setSelectedLesson(null); setSelectedStudent(null); }}>
                  📸 Evidence
                </button>
              </div>
              {activeTab === "written" && (
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text3)", cursor: "pointer", userSelect: "none" }}>
                  <input
                    type="checkbox"
                    checked={showGraded}
                    onChange={(e) => setShowGraded(e.target.checked)}
                    style={{ accentColor: "var(--blue)" }}
                  />
                  Show auto-graded
                </label>
              )}
              </div>
            </div>

            {/* Loading indicator for responses */}
            {loadingLesson && activeTab !== "activities" && activeTab !== "evidence" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 13, color: "var(--text3)" }}>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Loading responses...
              </div>
            )}

            {activeTab !== "activities" && activeTab !== "evidence" && (selectedLesson || selectedStudent) && renderBreadcrumb()}

            {activeTab === "evidence" ? (
              <WeeklyEvidenceTab selectedCourse={selectedCourse} studentMap={studentMap} />
            ) : activeTab === "activities" ? (
              <ActivitiesTab selectedCourse={selectedCourse} studentMap={studentMap} courses={courses} />
            ) : viewLevel === "student" ? (
              <StudentView
                courseResponses={courseResponses}
                courseLogs={courseLogs}
                selectedStudent={selectedStudent}
                activeTab={activeTab}
                helpers={helpers}
              />
            ) : viewLevel === "lesson" ? (
              <LessonView
                courseResponses={courseResponses}
                courseLogs={courseLogs}
                selectedLesson={selectedLesson}
                activeTab={activeTab}
                setSelectedStudent={setSelectedStudent}
                helpers={helpers}
              />
            ) : (
              <CourseOverview
                courseResponses={courseResponses}
                courseLogs={courseLogs}
                activeTab={activeTab}
                setSelectedLesson={handleSelectLesson}
                setSelectedStudent={setSelectedStudent}
                classChatCount={classChatCount}
                helpers={helpers}
              />
            )}
          </>
        )}

      {/* Google Classroom Sync Modal */}
      {syncModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => { if (syncStep !== "syncing") { setSyncModal(false); setSyncStep("idle"); } }}>
          <div className="card" style={{
            width: 520, maxHeight: "80vh", overflow: "auto", padding: 24,
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-display)", fontSize: 18 }}>Sync to Google Classroom</h3>
              {syncStep !== "syncing" && (
                <button onClick={() => { setSyncModal(false); setSyncStep("idle"); }}
                  style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "var(--text3)" }}>x</button>
              )}
            </div>

            {syncStep === "picking" && classroomCourses.length > 0 && (
              <div>
                <p style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}>
                  Select which Google Classroom course to sync grades to:
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {classroomCourses.map((gc) => (
                    <button key={gc.id} onClick={() => executeSyncForCourse(gc.id)}
                      className="card" style={{
                        padding: "10px 14px", cursor: "pointer", textAlign: "left",
                        border: "1px solid var(--border)", background: "var(--bg)",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.background = "var(--surface2)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg)"; }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{gc.name}</div>
                      {gc.section && <div style={{ fontSize: 12, color: "var(--text3)" }}>{gc.section}</div>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {syncStep === "picking" && classroomCourses.length === 0 && syncLog.length === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text3)" }}>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Connecting to Google Classroom...
              </div>
            )}

            {(syncStep === "syncing" || syncStep === "done") && (
              <div>
                <div style={{
                  background: "var(--bg)", borderRadius: 8, padding: 12, fontSize: 12,
                  fontFamily: "monospace", maxHeight: 300, overflow: "auto", lineHeight: 1.6,
                  border: "1px solid var(--border)",
                }}>
                  {syncLog.map((line, i) => (
                    <div key={i} style={{ color: line.startsWith("Error") || line.startsWith("  Warning") ? "var(--red)" : "var(--text2)" }}>
                      {line}
                    </div>
                  ))}
                  {syncStep === "syncing" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text3)", marginTop: 4 }}>
                      <div className="spinner" style={{ width: 12, height: 12 }} /> Working...
                    </div>
                  )}
                </div>

                {syncSummary && (
                  <div style={{
                    marginTop: 12, padding: "10px 14px", borderRadius: 8,
                    background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                    fontSize: 13, color: "var(--green)", fontWeight: 600,
                  }}>
                    Synced {syncSummary.totalGrades} grades across {syncSummary.totalLessons} lessons
                  </div>
                )}

                {syncStep === "done" && (
                  <button onClick={() => { setSyncModal(false); setSyncStep("idle"); }}
                    style={{
                      marginTop: 12, fontSize: 13, fontWeight: 600, padding: "8px 20px",
                      borderRadius: 8, border: "none", background: "var(--blue)", color: "#fff",
                      cursor: "pointer",
                    }}>
                    Close
                  </button>
                )}
              </div>
            )}

            {syncLog.length > 0 && syncStep === "picking" && (
              <div style={{ marginTop: 12, fontSize: 12, color: "var(--red)" }}>
                {syncLog.map((line, i) => <div key={i}>{line}</div>)}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
