// src/components/blocks/ChatbotWorkshopBlock.jsx
// In-lesson block that launches the Build-a-Chatbot Workshop for a course.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { getStudentBotProjects } from "../../lib/botStore";
import "./ChatbotWorkshopBlock.css";

export default function ChatbotWorkshopBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";
  const navigate = useNavigate();
  const [projectCount, setProjectCount] = useState(null);

  useEffect(() => {
    if (!user) return;
    getStudentBotProjects(db, user.uid, courseId)
      .then((projects) => setProjectCount(projects.length))
      .catch(() => setProjectCount(0));
  }, [user, courseId]);

  return (
    <div className="card cw-block">
      <div className="cw-head">
        <div className="cw-icon" aria-hidden>{block.icon || "🤖"}</div>
        <div className="cw-title-wrap">
          <div className="cw-title">{block.title || "Build-a-Chatbot Workshop"}</div>
          {projectCount !== null && projectCount > 0 && (
            <div className="cw-meta">
              {projectCount} bot{projectCount !== 1 ? "s" : ""} created
            </div>
          )}
        </div>
      </div>

      {block.instructions && (
        <p className="cw-instructions">{block.instructions}</p>
      )}

      <div className="cw-actions">
        <button className="btn btn-primary cw-go" onClick={() => navigate(`/chatbot-workshop/${courseId}`)}>
          Open Workshop →
        </button>
        <button className="cw-secondary cw-arcade" onClick={() => navigate(`/bot-arcade/${courseId}`)}>
          🎮 Arcade
        </button>
        {isTeacher && (
          <button className="cw-secondary cw-dashboard" onClick={() => navigate(`/chatbot-dashboard/${courseId}`)}>
            📊 Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
