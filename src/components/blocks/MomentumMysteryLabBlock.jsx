// src/components/blocks/MomentumMysteryLabBlock.jsx
// In-lesson block that launches the Momentum Mystery Lab activity for a course.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { getStudentBestAttempt } from "../../lib/momentumStore";

export default function MomentumMysteryLabBlock({ block, courseId, lessonId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bestAttempt, setBestAttempt] = useState(null);

  useEffect(() => {
    if (!user || !courseId) return;
    getStudentBestAttempt(db, courseId, user.uid)
      .then((attempt) => setBestAttempt(attempt))
      .catch(() => setBestAttempt(null));
  }, [user, courseId]);

  return (
    <div className="card" style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{
          fontSize: 28, width: 52, height: 52, borderRadius: 12,
          background: "rgba(96, 165, 250, 0.12)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {block.icon || "\u{1F52D}"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            {block.title || "Momentum Mystery Lab"}
          </div>
          {bestAttempt && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
              Best: {bestAttempt.bestXP} XP — {bestAttempt.activityLabel}
            </div>
          )}
        </div>
      </div>

      {block.instructions && (
        <p style={{ color: "var(--text2)", fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
          {block.instructions}
        </p>
      )}

      <button
        className="btn btn-primary"
        onClick={() => navigate(`/momentum-mystery-lab/${courseId}`)}
        style={{ width: "100%", padding: "12px 20px", fontSize: 15, fontWeight: 700 }}
      >
        Open Lab →
      </button>
    </div>
  );
}
