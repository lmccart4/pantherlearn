// src/components/grading/LessonView.jsx
import { useState } from "react";
import ChatLogCard from "./ChatLogCard";
import WrittenResponseCard from "./WrittenResponseCard";
import SearchSortBar from "./SearchSortBar";
import RubricScorerModal from "./RubricScorerModal";

export default function LessonView({ courseResponses, courseLogs, selectedLesson, activeTab, setSelectedStudent, helpers, courseId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [rubricTarget, setRubricTarget] = useState(null); // { studentId, studentName } or null
  const { getStudentName, getStudentEmail, getStudentPhoto, getLessonTitle, lessonMap } = helpers;

  // Find a rubric block on the currently-selected lesson (if any). Used to
  // show the per-student "Score Rubric" button on each student card.
  const selectedLessonObj = lessonMap?.[selectedLesson];
  const rubricBlock = (selectedLessonObj?.blocks || []).find((b) => b.type === "rubric");

  const lessonWritten = courseResponses.filter((r) => r.lessonId === selectedLesson);
  const lessonLogs = courseLogs.filter((l) => l.lessonId === selectedLesson);
  const uniqueStudentIds = [...new Set([...lessonWritten.map((r) => r.studentId), ...lessonLogs.map((l) => l.studentId)])];

  const getFilteredLogs = () => {
    const filtered = lessonLogs.filter((log) => {
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

  const filteredLogs = getFilteredLogs();

  const handleSelectStudent = (studentId) => setSelectedStudent(studentId);

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

      {/* Student cards */}
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
              <div style={{ display: "flex", gap: 10, fontSize: 12, alignItems: "center" }}>
                {written > 0 && <span style={{ color: "var(--amber)", fontWeight: 600 }}>✏️ {written}</span>}
                {chats > 0 && <span style={{ color: "var(--cyan)", fontWeight: 600 }}>💬 {chats}</span>}
                {rubricBlock && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setRubricTarget({ studentId: uid, studentName: getStudentName(uid) }); }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(245,166,35,0.2)"; e.currentTarget.style.borderColor = "var(--amber)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,166,35,0.08)"; e.currentTarget.style.borderColor = "rgba(245,166,35,0.4)"; }}
                    title="Score this student's rubric for this lesson"
                    style={{
                      fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
                      border: "1px solid rgba(245,166,35,0.4)", background: "rgba(245,166,35,0.08)",
                      color: "var(--amber)", cursor: "pointer", transition: "all 0.12s",
                    }}
                  >
                    📋 Score Rubric
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rubric scorer modal */}
      {rubricBlock && rubricTarget && courseId && (
        <RubricScorerModal
          rubricBlock={rubricBlock}
          studentId={rubricTarget.studentId}
          studentName={rubricTarget.studentName}
          courseId={courseId}
          lessonId={selectedLesson}
          onClose={() => setRubricTarget(null)}
          onSaved={() => { /* live updates flow through Firestore subscriptions; nothing else needed */ }}
        />
      )}

      {/* Content */}
      {activeTab === "written" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {lessonWritten.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No written responses for this lesson</div>
          ) : lessonWritten.map((item) => (
            <WrittenResponseCard key={item.id} item={item} helpers={helpers} onSelectStudent={handleSelectStudent} selectedLesson={selectedLesson} />
          ))}
        </div>
      ) : (
        <div>
          <SearchSortBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy} setSortBy={setSortBy} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filteredLogs.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No chat conversations for this lesson</div>
            ) : filteredLogs.map((log) => (
              <ChatLogCard key={log.id} log={log} helpers={helpers} onSelectStudent={handleSelectStudent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}