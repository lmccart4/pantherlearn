// src/components/grading/CourseOverview.jsx
import { useState } from "react";
import ChatLogCard from "./ChatLogCard";
import WrittenResponseCard from "./WrittenResponseCard";
import SearchSortBar from "./SearchSortBar";

export default function CourseOverview({ courseResponses, courseLogs, activeTab, setSelectedLesson, helpers }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const { getStudentName, getStudentEmail, getLessonTitle } = helpers;

  const totalWritten = courseResponses.length;
  const totalConversations = courseLogs.length;
  const totalMessages = courseLogs.reduce((sum, log) => sum + log.messageCount, 0);

  const lessonIds = [...new Set([
    ...courseResponses.map((r) => r.lessonId),
    ...courseLogs.map((l) => l.lessonId),
  ])];

  const getFilteredLogs = () => {
    const filtered = courseLogs.filter((log) => {
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

  return (
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

      {/* Recent activity */}
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--text2)", marginBottom: 12 }}>
        {activeTab === "written" ? "✏️ Written Responses" : "💬 Recent Conversations"}
      </h3>
      {activeTab === "written" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {courseResponses.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No written responses to review yet</div>
          ) : courseResponses.map((item) => (
            <WrittenResponseCard key={item.id} item={item} helpers={helpers} onSelectStudent={() => {}} selectedLesson={null} />
          ))}
        </div>
      ) : (
        <div>
          <SearchSortBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} sortBy={sortBy} setSortBy={setSortBy} placeholder="Search by student, lesson, or message content..." />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {getFilteredLogs().length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No chat conversations yet</div>
            ) : getFilteredLogs().map((log) => (
              <ChatLogCard key={log.id} log={log} helpers={helpers} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}