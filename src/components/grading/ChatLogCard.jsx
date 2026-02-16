// src/components/grading/ChatLogCard.jsx
import { useState } from "react";
import { renderMarkdown } from "../../lib/utils";

export default function ChatLogCard({ log, helpers }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getStudentName, getStudentEmail, getStudentPhoto, getLessonTitle } = helpers;

  const photo = getStudentPhoto(log.studentId);
  const lastUserMsg = [...log.messages].reverse().find((m) => m.role === "user");

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="card" style={{
      padding: 0, overflow: "hidden",
      borderColor: isExpanded ? "rgba(245,166,35,0.3)" : undefined,
    }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
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
}