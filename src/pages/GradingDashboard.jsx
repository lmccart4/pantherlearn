// src/pages/GradingDashboard.jsx
import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, collectionGroup, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { renderMarkdown } from "../lib/utils";
import { analyzeResponse } from "../lib/aiDetection";
import { compareToBaselines } from "../lib/aiBaselines";

export default function GradingDashboard() {
  const { userRole } = useAuth();
  const [responses, setResponses] = useState([]);
  const [chatLogGroups, setChatLogGroups] = useState([]);
  const [studentMap, setStudentMap] = useState({});
  const [lessonMap, setLessonMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("written");
  const [expandedChat, setExpandedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [expandedAnalysis, setExpandedAnalysis] = useState(null);

  useEffect(() => {
    if (userRole !== "teacher") return;

    const fetchData = async () => {
      try {
        // --- Fetch all users for name lookup ---
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

        // --- Fetch all courses and lessons for name lookup ---
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

        // --- Fetch written responses ---
        const progressSnapshot = await getDocs(collectionGroup(db, "lessons"));
        const writtenResponses = [];
        progressSnapshot.forEach((d) => {
          const data = d.data();
          if (data.answers) {
            Object.entries(data.answers).forEach(([blockId, answer]) => {
              if (answer.needsGrading && answer.submitted) {
                // Extract courseId from path: progress/{uid}/courses/{courseId}/lessons/{lessonId}
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

        // --- Fetch chat logs (now under courses/{courseId}/chatLogs) ---
        const allLogs = [];

        for (const courseDoc of coursesSnapshot.docs) {
          const courseId = courseDoc.id;

          // Get all lesson docs under this course's chatLogs
          let chatLessonDocs;
          try {
            chatLessonDocs = await getDocs(collection(db, "courses", courseId, "chatLogs"));
          } catch (e) {
            continue; // No chatLogs subcollection yet
          }

          for (const lessonDoc of chatLessonDocs.docs) {
            const lessonId = lessonDoc.id;

            // Each lessonDoc has subcollections named by blockId
            // We need to check known block IDs from the lesson data
            const lessonInfo = lessons[lessonId];
            const chatBlocks = (lessonInfo?.blocks || []).filter((b) => b.type === "chatbot");

            for (const chatBlock of chatBlocks) {
              const blockId = chatBlock.id;
              let studentDocs;
              try {
                studentDocs = await getDocs(
                  collection(db, "courses", courseId, "chatLogs", lessonId, blockId)
                );
              } catch (e) {
                continue;
              }

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

  // --- Helpers ---
  const getStudentName = (uid) => studentMap[uid]?.displayName || uid.slice(0, 8) + "...";
  const getStudentEmail = (uid) => studentMap[uid]?.email || "";
  const getStudentPhoto = (uid) => studentMap[uid]?.photoURL || "";
  const getLessonTitle = (lessonId) => lessonMap[lessonId]?.title || lessonId;
  const getCourseTitle = (lessonId) => lessonMap[lessonId]?.courseTitle || "";
  const getBlockPrompt = (lessonId, blockId) => {
    const blocks = lessonMap[lessonId]?.blocks || [];
    const block = blocks.find((b) => b.id === blockId);
    return block?.prompt || block?.title || blockId;
  };

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // --- Filtered data by selected course ---
  const courseResponses = responses.filter((r) => r.courseId === selectedCourse);
  const courseLogs = chatLogGroups.filter((l) => l.courseId === selectedCourse);

  // Group by lesson
  const lessonIds = [...new Set([
    ...courseResponses.map((r) => r.lessonId),
    ...courseLogs.map((l) => l.lessonId),
  ])];

  // --- Stats ---
  const totalWritten = courseResponses.length;
  const totalConversations = courseLogs.length;
  const totalMessages = courseLogs.reduce((sum, log) => sum + log.messageCount, 0);

  // --- Filter & sort chat logs ---
  const getFilteredLogs = (logs) => {
    const filtered = logs.filter((log) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const name = getStudentName(log.studentId).toLowerCase();
      const email = getStudentEmail(log.studentId).toLowerCase();
      const lesson = getLessonTitle(log.lessonId).toLowerCase();
      const block = log.blockTitle.toLowerCase();
      const hasMessageMatch = log.messages.some((m) => m.content.toLowerCase().includes(term));
      return name.includes(term) || email.includes(term) || lesson.includes(term) || block.includes(term) || hasMessageMatch;
    });
    return [...filtered].sort((a, b) => {
      if (sortBy === "recent") return b.lastUpdated - a.lastUpdated;
      if (sortBy === "messages") return b.messageCount - a.messageCount;
      if (sortBy === "student") return getStudentName(a.studentId).localeCompare(getStudentName(b.studentId));
      return 0;
    });
  };

  // Current course/lesson/student references
  const currentCourse = courses.find((c) => c.id === selectedCourse);
  const currentLessonTitle = selectedLesson ? getLessonTitle(selectedLesson) : null;
  const currentStudentName = selectedStudent ? getStudentName(selectedStudent) : null;

  // Determine view level
  const viewLevel = selectedStudent ? "student" : selectedLesson ? "lesson" : "course";

  // --- Breadcrumb ---
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

  // --- Render a chat log card ---
  const renderChatLog = (log) => {
    const isExpanded = expandedChat === log.id;
    const photo = getStudentPhoto(log.studentId);
    const lastUserMsg = [...log.messages].reverse().find((m) => m.role === "user");

    return (
      <div key={log.id} className="card" style={{
        padding: 0, overflow: "hidden",
        borderColor: isExpanded ? "rgba(245,166,35,0.3)" : undefined,
      }}>
        <div
          onClick={() => setExpandedChat(isExpanded ? null : log.id)}
          style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "16px 20px", cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {photo ? (
            <img src={photo} alt="" style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--border)", flexShrink: 0 }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--surface2)", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--text3)", flexShrink: 0 }}>👤</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{getStudentName(log.studentId)}</span>
              <span style={{ fontSize: 11, color: "var(--text3)", padding: "1px 8px", background: "var(--surface2)", borderRadius: 4 }}>
                {log.messageCount} {log.messageCount === 1 ? "message" : "messages"}
              </span>
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span>{getLessonTitle(log.lessonId)}</span>
              <span style={{ color: "var(--border)" }}>·</span>
              <span style={{ color: "var(--cyan)" }}>{log.blockTitle}</span>
            </div>
            {!isExpanded && lastUserMsg && (
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                "{lastUserMsg.content}"
              </div>
            )}
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{formatTime(log.lastUpdated)}</div>
            <div style={{ fontSize: 16, color: "var(--text3)", marginTop: 4, transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>▾</div>
          </div>
        </div>
        {isExpanded && (
          <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px", borderBottom: "1px solid var(--border)", fontSize: 12, color: "var(--text3)" }}>
              <span>{getStudentEmail(log.studentId)} · {log.messages.length} total messages</span>
              <span>Last active: {log.lastUpdated?.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
            </div>
            <div style={{ padding: "16px 20px", maxHeight: 500, overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              {log.messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", flexDirection: msg.role === "user" ? "row-reverse" : "row", gap: 10 }}>
                  <div style={{ fontSize: 16, flexShrink: 0, marginTop: 4 }}>{msg.role === "assistant" ? "🤖" : "👤"}</div>
                  <div style={{
                    maxWidth: "80%", padding: "10px 14px", borderRadius: 12, fontSize: 14, lineHeight: 1.65,
                    background: msg.role === "user" ? "var(--amber-dim)" : "var(--surface)",
                    border: msg.role === "user" ? "1px solid rgba(245,166,35,0.15)" : "1px solid var(--border)",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
                      {msg.role === "assistant" ? "AI" : getStudentName(log.studentId)}
                    </div>
                    <div className="chat-text" dangerouslySetInnerHTML={{ __html: typeof renderMarkdown === "function" ? renderMarkdown(msg.content) : msg.content }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- Render written response card ---
  // Build per-student writing history for comparison
  const getStudentHistory = (studentId, excludeId) => {
    return responses
      .filter((r) => r.studentId === studentId && r.id !== excludeId && r.answer)
      .map((r) => r.answer);
  };

  const renderWrittenResponse = (item) => {
    const history = getStudentHistory(item.studentId, item.id);
    // Look up AI baselines from the lesson block
    const lessonInfo = lessonMap[item.lessonId];
    const block = (lessonInfo?.blocks || []).find((b) => b.id === item.blockId);
    const aiBaselines = block?.aiBaselines || [];

    const analysis = analyzeResponse(item.answer, {
      submittedAt: item.submittedAt,
      previousResponses: history,
      aiBaselines,
      compareToBaselines,
    });
    const isAnalysisExpanded = expandedAnalysis === item.id;

    return (
      <div key={item.id} className="card" style={{ padding: "16px 20px", borderColor: analysis.risk === "high" ? "rgba(239,68,68,0.25)" : analysis.risk === "medium" ? "rgba(245,166,35,0.25)" : undefined }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {getStudentPhoto(item.studentId) ? (
              <img src={getStudentPhoto(item.studentId)} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)" }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text3)" }}>👤</div>
            )}
            <div>
              <span style={{ fontWeight: 600, fontSize: 14, cursor: "pointer", color: "var(--text)" }}
                onClick={() => { setSelectedStudent(item.studentId); if (!selectedLesson) setSelectedLesson(item.lessonId); }}>
                {getStudentName(item.studentId)}
              </span>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>{getStudentEmail(item.studentId)}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {analysis.risk !== "none" && (
              <span
                onClick={(e) => { e.stopPropagation(); setExpandedAnalysis(isAnalysisExpanded ? null : item.id); }}
                style={{
                  fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, cursor: "pointer",
                  background: analysis.risk === "high" ? "var(--red-dim)" : analysis.risk === "medium" ? "var(--amber-dim)" : "var(--surface2)",
                  color: analysis.color, transition: "opacity 0.15s",
                }}
                title="Click for details"
              >
                {analysis.label}
              </span>
            )}
            <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--blue-dim)", color: "var(--blue)", fontWeight: 600 }}>
              Needs review
            </span>
          </div>
        </div>

        {/* AI detection detail panel */}
        {isAnalysisExpanded && analysis.risk !== "none" && (
          <div style={{
            background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
            padding: "12px 16px", marginBottom: 12,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>AI Detection Analysis</span>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                Confidence: {Math.round(analysis.overallScore * 100)}%
              </span>
            </div>

            {/* Score bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
              {analysis.details.filter((d) => d.score > 0).map((d) => (
                <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", width: 130, flexShrink: 0 }}>{d.name}</span>
                  <div style={{ flex: 1, height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{
                      width: `${d.score * 100}%`, height: "100%", borderRadius: 3,
                      background: d.score > 0.6 ? "var(--red)" : d.score > 0.3 ? "var(--amber)" : "var(--text3)",
                      transition: "width 0.3s",
                    }} />
                  </div>
                  <span style={{ fontSize: 10, color: "var(--text3)", width: 28, textAlign: "right" }}>
                    {Math.round(d.score * 100)}
                  </span>
                </div>
              ))}
            </div>

            {/* Specific flags */}
            {analysis.flags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {analysis.flags.map((flag, i) => (
                  <span key={i} style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 4,
                    background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)",
                  }}>
                    {flag}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>
              <span>Heuristic analysis only — not definitive. Use as a starting point for conversation with the student.</span>
              {aiBaselines.length > 0 ? (
                <span style={{ fontStyle: "normal", color: "var(--green)", fontWeight: 600 }}>
                  ✓ AI baselines active ({aiBaselines.map((b) => b.provider).join(", ")})
                </span>
              ) : (
                <span style={{ fontStyle: "normal", color: "var(--text3)" }}>
                  ○ No AI baselines — re-save lesson to generate
                </span>
              )}
            </div>
          </div>
        )}

        <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
          {getBlockPrompt(item.lessonId, item.blockId)}
        </div>
        <div style={{ background: "var(--bg)", borderRadius: 8, padding: 14, fontSize: 15, lineHeight: 1.6, marginBottom: 12, border: "1px solid var(--border)" }}>
          {item.answer}
        </div>
        {item.submittedAt && (
          <div style={{ fontSize: 11, color: "var(--text3)" }}>
            Submitted {new Date(item.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
          </div>
        )}
      </div>
    );
  };

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

            {/* Breadcrumb */}
            {(selectedLesson || selectedStudent) && renderBreadcrumb()}

            {/* ====== STUDENT VIEW ====== */}
            {viewLevel === "student" ? (() => {
              const studentWritten = courseResponses.filter((r) => r.studentId === selectedStudent);
              const studentLogs = courseLogs.filter((l) => l.studentId === selectedStudent);
              const photo = getStudentPhoto(selectedStudent);

              return (
                <div>
                  {/* Student header */}
                  <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", marginBottom: 24 }}>
                    {photo ? (
                      <img src={photo} alt="" style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid var(--border)" }} />
                    ) : (
                      <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--text3)" }}>👤</div>
                    )}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{currentStudentName}</div>
                      <div style={{ fontSize: 13, color: "var(--text3)" }}>{getStudentEmail(selectedStudent)}</div>
                    </div>
                    <div style={{ display: "flex", gap: 20, textAlign: "center" }}>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>{studentWritten.length}</div>
                        <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600 }}>Written</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--cyan)" }}>{studentLogs.length}</div>
                        <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600 }}>Chats</div>
                      </div>
                    </div>
                  </div>

                  {activeTab === "written" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {studentWritten.length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No written responses from this student</div>
                      ) : studentWritten.map(renderWrittenResponse)}
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {studentLogs.length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No chat conversations from this student</div>
                      ) : studentLogs.map(renderChatLog)}
                    </div>
                  )}
                </div>
              );
            })()

            /* ====== LESSON VIEW ====== */
            : viewLevel === "lesson" ? (() => {
              const lessonWritten = courseResponses.filter((r) => r.lessonId === selectedLesson);
              const lessonLogs = courseLogs.filter((l) => l.lessonId === selectedLesson);
              const uniqueStudentIds = [...new Set([...lessonWritten.map((r) => r.studentId), ...lessonLogs.map((l) => l.studentId)])];

              return (
                <div>
                  {/* Lesson stats */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                    {[
                      { label: "Written Responses", value: lessonWritten.length, color: "var(--amber)" },
                      { label: "Chat Conversations", value: lessonLogs.length, color: "var(--cyan)" },
                      { label: "Students", value: uniqueStudentIds.length, color: "var(--green)" },
                    ].map((stat) => (
                      <div key={stat.label} className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                        <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Student cards for this lesson */}
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>Students</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 24 }}>
                    {uniqueStudentIds.map((uid) => {
                      const written = lessonWritten.filter((r) => r.studentId === uid).length;
                      const chats = lessonLogs.filter((l) => l.studentId === uid).length;
                      const photo = getStudentPhoto(uid);
                      return (
                        <div key={uid} className="card" style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 20px", cursor: "pointer" }}
                          onClick={() => setSelectedStudent(uid)}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                          {photo ? (
                            <img src={photo} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} />
                          ) : (
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "var(--text3)" }}>👤</div>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{getStudentName(uid)}</div>
                            <div style={{ fontSize: 11, color: "var(--text3)" }}>{getStudentEmail(uid)}</div>
                          </div>
                          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                            {written > 0 && <span style={{ color: "var(--amber)", fontWeight: 600 }}>✏️ {written}</span>}
                            {chats > 0 && <span style={{ color: "var(--cyan)", fontWeight: 600 }}>💬 {chats}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* All content for this lesson */}
                  {activeTab === "written" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {lessonWritten.length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No written responses for this lesson</div>
                      ) : lessonWritten.map(renderWrittenResponse)}
                    </div>
                  ) : (
                    <div>
                      {/* Search & sort */}
                      <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                          <input type="text" placeholder="Search conversations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }}
                            onFocus={(e) => (e.target.style.borderColor = "var(--amber)")} onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                        </div>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                          <option value="recent">Most Recent</option>
                          <option value="messages">Most Messages</option>
                          <option value="student">Student Name</option>
                        </select>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {getFilteredLogs(lessonLogs).length === 0 ? (
                          <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No chat conversations for this lesson</div>
                        ) : getFilteredLogs(lessonLogs).map(renderChatLog)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()

            /* ====== COURSE OVERVIEW ====== */
            : (
              <div>
                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
                  {[
                    { label: "Written Responses", value: totalWritten, color: "var(--amber)", icon: "✏️" },
                    { label: "Chat Conversations", value: totalConversations, color: "var(--cyan)", icon: "💬" },
                    { label: "Student Messages", value: totalMessages, color: "var(--green)", icon: "📨" },
                  ].map((stat) => (
                    <div key={stat.label} className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Lesson cards */}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>📚 Lessons</h3>
                {lessonIds.length === 0 ? (
                  <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)", marginBottom: 28 }}>
                    No student submissions yet for this course
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 28 }}>
                    {lessonIds.map((lessonId) => {
                      const written = courseResponses.filter((r) => r.lessonId === lessonId).length;
                      const chats = courseLogs.filter((l) => l.lessonId === lessonId).length;
                      return (
                        <div key={lessonId} className="card" style={{ cursor: "pointer", padding: "14px 16px", transition: "border-color 0.2s" }}
                          onClick={() => setSelectedLesson(lessonId)}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--amber)"}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}>
                          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10 }}>{getLessonTitle(lessonId)}</div>
                          <div style={{ display: "flex", gap: 16, fontSize: 12 }}>
                            {written > 0 && <span style={{ color: "var(--amber)", fontWeight: 600 }}>✏️ {written} written</span>}
                            {chats > 0 && <span style={{ color: "var(--cyan)", fontWeight: 600 }}>💬 {chats} chats</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Recent activity — all content for this course */}
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>
                  {activeTab === "written" ? "✏️ Written Responses" : "💬 Recent Conversations"}
                </h3>
                {activeTab === "written" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {courseResponses.length === 0 ? (
                      <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No written responses to review yet</div>
                    ) : courseResponses.map(renderWrittenResponse)}
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                      <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                        <input type="text" placeholder="Search by student, lesson, or message content..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }}
                          onFocus={(e) => (e.target.style.borderColor = "var(--amber)")} onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
                      </div>
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13 }}>
                        <option value="recent">Most Recent</option>
                        <option value="messages">Most Messages</option>
                        <option value="student">Student Name</option>
                      </select>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {getFilteredLogs(courseLogs).length === 0 ? (
                        <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No chat conversations yet</div>
                      ) : getFilteredLogs(courseLogs).map(renderChatLog)}
                    </div>
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
