// src/components/blocks/BiasDetectiveBlock.jsx
// In-lesson block that launches the AI Bias Detective activity for a course.
// Follows the same pattern as ChatbotWorkshopBlock.jsx.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { getStudentInvestigations } from "../../lib/biasStore";
import "./BiasDetectiveBlock.css";

export default function BiasDetectiveBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";
  const navigate = useNavigate();
  const [investigationCount, setInvestigationCount] = useState(null);

  useEffect(() => {
    if (!user) return;
    getStudentInvestigations(db, courseId, user.uid)
      .then((investigations) => setInvestigationCount(investigations.length))
      .catch(() => setInvestigationCount(0));
  }, [user, courseId]);

  return (
    <div className="card bd-block">
      <div className="bd-head">
        <div className="bd-icon" aria-hidden>{block.icon || "\u{1F50D}"}</div>
        <div className="bd-title-wrap">
          <div className="bd-title">{block.title || "AI Bias Detective"}</div>
          {investigationCount !== null && investigationCount > 0 && (
            <div className="bd-meta">
              {investigationCount} investigation{investigationCount !== 1 ? "s" : ""} started
            </div>
          )}
        </div>
      </div>

      {block.instructions && (
        <p className="bd-instructions">{block.instructions}</p>
      )}

      <div className="bd-actions">
        <button
          className="btn btn-primary bd-go"
          onClick={() => navigate(`/bias-detective/${courseId}`)}
        >
          Open Investigation →
        </button>
        {isTeacher && (
          <button
            className="bd-dashboard"
            onClick={() => navigate(`/bias-detective-dashboard/${courseId}`)}
          >
            📊 Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
