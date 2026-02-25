// src/components/blocks/BiasDetectiveBlock.jsx
// In-lesson block that launches the AI Bias Detective activity for a course.
// Follows the same pattern as ChatbotWorkshopBlock.jsx.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { getStudentInvestigations } from "../../lib/biasStore";

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
    <div className="card" style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{
          fontSize: 28, width: 52, height: 52, borderRadius: 12,
          background: "rgba(96, 165, 250, 0.12)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {block.icon || "\u{1F50D}"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            {block.title || "AI Bias Detective"}
          </div>
          {investigationCount !== null && investigationCount > 0 && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
              {investigationCount} investigation{investigationCount !== 1 ? "s" : ""} started
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
          onClick={() => navigate(`/bias-detective/${courseId}`)}
          style={{ flex: 1, padding: "12px 20px", fontSize: 15, fontWeight: 700 }}
        >
          Open Investigation →
        </button>
        {isTeacher && (
          <button
            onClick={() => navigate(`/bias-detective-dashboard/${courseId}`)}
            style={{
              padding: "12px 20px", fontSize: 14, fontWeight: 600,
              background: "none", border: "1px solid var(--border, rgba(255,255,255,0.12))",
              borderRadius: 10, color: "var(--text3)", cursor: "pointer",
              transition: "all 0.15s", whiteSpace: "nowrap",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border, rgba(255,255,255,0.12))"; e.currentTarget.style.color = "var(--text3)"; }}
          >
            {"📊"} Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
