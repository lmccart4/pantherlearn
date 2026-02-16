// src/pages/GradingDashboard.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, collectionGroup } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import CourseOverview from "../components/grading/CourseOverview";
import LessonView from "../components/grading/LessonView";
import StudentView from "../components/grading/StudentView";

export default function GradingDashboard() {
  const { userRole } = useAuth();
  const [responses, setResponses] = useState([]);
  const [chatLogGroups, setChatLogGroups] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [lessonMap, setLessonMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("written");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (userRole !== "teacher") return;

    const fetchData = async () => {
      try {
        // Fetch all users for name lookup
        const usersSnapshot = await getDocs(collection(db, "users"));
        const users = {};
        usersSnapshot.forEach((d) => {
          const data = d.data();
          users[d.id] = {
            displayName: data.displayName || data.email || d.id,
            email: data.email || "",
            photoURL: data.photoURL || "",
          };
        });
        setStudentMap(users);

        // Fetch all courses and lessons
        const coursesSnapshot = await getDocs(collection(db, "courses"));
        const coursesList = coursesSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCourses(coursesList);
        if (coursesList.length > 0 && !selectedCourse) setSelectedCourse(coursesList[0].id);

        const lessons = {};
        for (const courseDoc of coursesSnapshot.docs) {
          const courseData = courseDoc.data();
          const lessonsSnapshot = await getDocs(
            query(collection(db, "courses", courseDoc.id, "lessons"), orderBy("order", "asc"))
          );
          lessonsSnapshot.forEach((lessonDoc) => {
            const lessonData = lessonDoc.data();
            lessons[lessonDoc.id] = {
              title: lessonData.title || lessonDoc.id,
              courseTitle: courseData.title || courseDoc.id,
              blocks: lessonData.blocks || [],
            };
          });
        }
        setLessonMap(lessons);

        // Fetch written responses
        const progressSnapshot = await getDocs(collectionGroup(db, "lessons"));
        const writtenResponses = [];
        progressSnapshot.forEach((d) => {
          const data = d.data();
          if (data.answers) {
            Object.entries(data.answers).forEach(([blockId, answer]) => {
              if (answer.needsGrading && answer.submitted) {
                const pathParts = d.ref.path.split("/");
                const courseIdx = pathParts.indexOf("courses");
                const courseId = courseIdx >= 0 ? pathParts[courseIdx + 1] : "";
                writtenResponses.push({
                  id: `${d.ref.path}-${blockId}`,
                  studentId: d.ref.parent.parent.parent.parent.id,
                  lessonId: d.id,
                  courseId,
                  blockId,
                  answer: answer.answer,
                  submittedAt: answer.submittedAt,
                  path: d.ref.path,
                });
              }
            });
          }
        });
        setResponses(writtenResponses);

        // Fetch chat logs
        const allLogs = [];
        for (const courseDoc of coursesSnapshot.docs) {
          const courseId = courseDoc.id;
          let chatLessonDocs;
          try {
            chatLessonDocs = await getDocs(collection(db, "courses", courseId, "chatLogs"));
          } catch (e) { continue; }

          for (const lessonDoc of chatLessonDocs.docs) {
            const lessonId = lessonDoc.id;
            const lessonInfo = lessons[lessonId];
            const chatBlocks = (lessonInfo?.blocks || []).filter((b) => b.type === "chatbot");

            for (const chatBlock of chatBlocks) {
              const blockId = chatBlock.id;
              let studentDocs;
              try {
                studentDocs = await getDocs(
                  collection(db, "courses", courseId, "chatLogs", lessonId, blockId)
                );
              } catch (e) { continue; }

              studentDocs.forEach((studentDoc) => {
                const data = studentDoc.data();
                if (data.messages && data.messages.length > 0) {
                  allLogs.push({
                    id: `${courseId}-${lessonId}-${blockId}-${studentDoc.id}`,
                    studentId: studentDoc.id,
                    courseId,
                    lessonId,
                    blockId,
                    blockTitle: chatBlock.title || blockId,
                    messages: data.messages,
                    messageCount: data.messageCount || data.messages.filter((m) => m.role === "user").length,
                    lastUpdated: data.lastUpdated?.toDate?.() || new Date(),
                  });
                }
              });
            }
          }
        }
        setChatLogGroups(allLogs);
      } catch (err) {
        console.error("Error fetching grading data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [userRole]);

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

  // Filtered data by selected course
  const courseResponses = responses.filter((r) => r.courseId === selectedCourse);
  const courseLogs = chatLogGroups.filter((l) => l.courseId === selectedCourse);
  const currentCourse = courses.find((c) => c.id === selectedCourse);
  const currentLessonTitle = selectedLesson ? getLessonTitle(selectedLesson) : null;
  const currentStudentName = selectedStudent ? getStudentName(selectedStudent) : null;
  const viewLevel = selectedStudent ? "student" : selectedLesson ? "lesson" : "course";

  // Stats
  const totalWritten = courseResponses.length;
  const totalConversations = courseLogs.length;

  // Breadcrumb
  const renderBreadcrumb = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text3)", marginBottom: 20, flexWrap: "wrap" }}>
      <button onClick={() => { setSelectedLesson(null); setSelectedStudent(null); }}
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

  return (
    <div className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Grading Dashboard
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15, marginBottom: 28 }}>
          Review student written responses and AI chat activity.
        </p>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
        ) : (
          <>
            {/* Course tabs + content type tabs */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, width: "fit-content" }}>
                {courses.map((c) => (
                  <button key={c.id}
                    className={`top-nav-link ${selectedCourse === c.id ? "active" : ""}`}
                    onClick={() => { setSelectedCourse(c.id); setSelectedLesson(null); setSelectedStudent(null); }}>
                    {c.icon} {c.title}
                  </button>
                ))}
              </div>
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
                setSelectedLesson={setSelectedLesson}
                helpers={helpers}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}