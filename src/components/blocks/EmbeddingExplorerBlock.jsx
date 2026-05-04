// src/components/blocks/EmbeddingExplorerBlock.jsx
// In-lesson block that launches the Embedding Explorer ("The Word Vault") activity.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { getStudentExplorations } from "../../lib/embeddingStore";
import "./EmbeddingExplorerBlock.css";

export default function EmbeddingExplorerBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";
  const navigate = useNavigate();
  const [explorationCount, setExplorationCount] = useState(null);

  useEffect(() => {
    if (!user) return;
    getStudentExplorations(db, courseId, user.uid)
      .then((explorations) => setExplorationCount(explorations.length))
      .catch(() => setExplorationCount(0));
  }, [user, courseId]);

  return (
    <div className="card ee-block">
      <div className="ee-head">
        <div className="ee-icon" aria-hidden>{block.icon || "🔢"}</div>
        <div className="ee-title-wrap">
          <div className="ee-title">{block.title || "The Word Vault"}</div>
          {explorationCount !== null && explorationCount > 0 && (
            <div className="ee-meta">
              {explorationCount} project{explorationCount !== 1 ? "s" : ""} started
            </div>
          )}
        </div>
      </div>

      {block.instructions && (
        <p className="ee-instructions">{block.instructions}</p>
      )}

      <div className="ee-actions">
        <button
          className="btn btn-primary ee-go"
          onClick={() => navigate(`/embedding-explorer/${courseId}`)}
        >
          Open Word Vault →
        </button>
        {isTeacher && (
          <button
            className="ee-dashboard"
            onClick={() => navigate(`/embedding-explorer-dashboard/${courseId}`)}
          >
            📊 Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
