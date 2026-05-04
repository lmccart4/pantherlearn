// src/components/blocks/SpaceRescueBlock.jsx
// In-lesson block that launches the Space Rescue Mission activity for a course.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import "./SpaceRescueBlock.css";

export default function SpaceRescueBlock({ block, courseId, lessonId }) {
  const { user, userRole } = useAuth();
  const isTeacher = userRole === "teacher";
  const navigate = useNavigate();
  const [levelsCompleted, setLevelsCompleted] = useState(null);

  useEffect(() => {
    if (!user || !courseId) return;
    const fetchProgress = async () => {
      try {
        const q = query(
          collection(db, "courses", courseId, "spaceRescue"),
          where("uid", "==", user.uid),
          orderBy("completedAt", "desc"),
          limit(1)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setLevelsCompleted(data.levelsCompleted || 0);
        } else {
          setLevelsCompleted(0);
        }
      } catch {
        setLevelsCompleted(0);
      }
    };
    fetchProgress();
  }, [user, courseId]);

  return (
    <div className="card sr-block">
      <div className="sr-head">
        <div className="sr-icon" aria-hidden>{block.icon || "🧑‍🚀"}</div>
        <div className="sr-title-wrap">
          <div className="sr-title">{block.title || "Space Rescue Mission"}</div>
          {levelsCompleted !== null && levelsCompleted > 0 && (
            <div className="sr-meta">{levelsCompleted} of 4 missions completed</div>
          )}
        </div>
      </div>

      {block.instructions && (
        <p className="sr-instructions">{block.instructions}</p>
      )}

      <div className="sr-actions">
        <button className="btn btn-primary sr-go" onClick={() => navigate(`/space-rescue/${courseId}`)}>
          Launch Mission →
        </button>
      </div>
    </div>
  );
}
