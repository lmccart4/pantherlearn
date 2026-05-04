// src/components/blocks/MomentumMysteryLabBlock.jsx
// In-lesson block that launches the Momentum Mystery Lab activity for a course.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { getStudentBestAttempt } from "../../lib/momentumStore";
import "./MomentumMysteryLabBlock.css";

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
    <div className="card mml-block">
      <div className="mml-head">
        <div className="mml-icon" aria-hidden>{block.icon || "🔭"}</div>
        <div className="mml-title-wrap">
          <div className="mml-title">{block.title || "Momentum Mystery Lab"}</div>
          {bestAttempt && (
            <div className="mml-meta">
              Best: {bestAttempt.bestXP} XP — {bestAttempt.activityLabel}
            </div>
          )}
        </div>
      </div>

      {block.instructions && (
        <p className="mml-instructions">{block.instructions}</p>
      )}

      <button className="btn btn-primary mml-go" onClick={() => navigate(`/momentum-mystery-lab/${courseId}`)}>
        Open Lab →
      </button>
    </div>
  );
}
