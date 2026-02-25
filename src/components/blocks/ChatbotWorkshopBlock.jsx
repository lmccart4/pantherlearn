// src/components/blocks/ChatbotWorkshopBlock.jsx
// In-lesson block that launches the Build-a-Chatbot Workshop for a course.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { getStudentBotProjects } from "../../lib/botStore";

export default function ChatbotWorkshopBlock({ block, courseId, lessonId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(null);

  // Fetch how many bot projects this student has for this course
  useEffect(() => {
    if (!user) return;
    getStudentBotProjects(db, user.uid, courseId)
      .then((projects) => setProjectCount(projects.length))
      .catch(() => setProjectCount(0));
  }, [user, courseId]);

  return (
    <div className="card" style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{
          fontSize: 28, width: 52, height: 52, borderRadius: 12,
          background: "rgba(139, 92, 246, 0.12)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {block.icon || "🤖"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            {block.title || "Build-a-Chatbot Workshop"}
          </div>
          {projectCount !== null && projectCount > 0 && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
              {projectCount} bot{projectCount !== 1 ? "s" : ""} created
            </div>
          )}
        </div>
      </div>

      {block.instructions && (
        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
          {block.instructions}
        </p>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/chatbot-workshop/${courseId}`)}
          style={{ flex: 1, padding: "12px 20px", fontSize: 15, fontWeight: 700 }}
        >
          Open Workshop →
        </button>
        <button
          onClick={() => navigate(`/bot-arcade/${courseId}`)}
          style={{
            padding: "12px 20px", fontSize: 14, fontWeight: 600,
            background: "none", border: "1px solid var(--border, rgba(255,255,255,0.12))",
            borderRadius: 10, color: "var(--text3)", cursor: "pointer",
            transition: "all 0.15s", whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.color = "var(--amber)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border, rgba(255,255,255,0.12))"; e.currentTarget.style.color = "var(--text3)"; }}
        >
          🎮 Arcade
        </button>
      </div>
    </div>
  );
}
