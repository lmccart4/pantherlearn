// src/pages/GradingDashboard.jsx
// Optimized: lazy-loads data by course → section → lesson instead of fetching everything upfront.
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy, where, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import CourseOverview from "../components/grading/CourseOverview";
import LessonView from "../components/grading/LessonView";
import StudentView from "../components/grading/StudentView";

export default function GradingDashboard() {
  const { userRole } = useAuth();

  // Navigation state
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedSection] = useState("all");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("written");

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
            if (answer.needsGrading && answer.submitted && answer.writtenScore == null) {
              writtenResponses.push({
                id: `${progressDoc.ref.path}-${blockId}`,
                studentId: uid, lessonId, courseId: selectedCourse, blockId,
                answer: answer.answer, submittedAt: answer.submittedAt,
                writtenScore: answer.writtenScore ?? null, writtenLabel: answer.writtenLabel ?? null,
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
              if (answer.needsGrading && answer.submitted && answer.writtenScore == null) {
                writtenResponses.push({
                  id: `${d.ref.path}-${blockId}`,
                  studentId: uid, lessonId: d.id, courseId: selectedCourse, blockId,
                  answer: answer.answer, submittedAt: answer.submittedAt,
                  writtenScore: answer.writtenScore ?? null, writtenLabel: answer.writtenLabel ?? null,
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
  }, [enrollments, selectedSection, loadingCourse]);

  // ─── Handle lesson selection ───
  function handleSelectLesson(lessonId) {
    setSelectedLesson(lessonId);
    setSelectedStudent(null);
    loadResponses(lessonId, selectedSection);
  }

  if (userRole !== "teacher") {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
        <p style={{ color: "var(--text2)", marginTop: 8 }}>This page is only available to teachers.</p>
      </div>
    );
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
    <main id="main-content" className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Grading Dashboard
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15, marginBottom: 28 }}>
          Review student written responses and AI chat activity.
        </p>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
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

              </div>

              {/* Content type tabs */}
              <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, width: "fit-content" }}>
                <button className={`top-nav-link ${activeTab === "written" ? "active" : ""}`}
                  onClick={() => { setActiveTab("written"); setSelectedLesson(null); setSelectedStudent(null); }}>
                  ✏️ Written ({totalWritten})
                </button>
                <button className={`top-nav-link ${activeTab === "chats" ? "active" : ""}`}
                  onClick={() => { setActiveTab("chats"); setSelectedLesson(null); setSelectedStudent(null); }}>
                  💬 Chats ({totalConversations})
                </button>
              </div>
            </div>

            {/* Loading indicator for responses */}
            {loadingLesson && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 13, color: "var(--text3)" }}>
                <div className="spinner" style={{ width: 16, height: 16 }} />
                Loading responses...
              </div>
            )}

            {(selectedLesson || selectedStudent) && renderBreadcrumb()}

            {viewLevel === "student" ? (
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
      </div>
    </main>
  );
}
