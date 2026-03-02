// src/components/blocks/SpaceRescueBlock.jsx
// In-lesson block that launches the Space Rescue Mission activity for a course.

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

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
    <div className="card" style={{ padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
        <div style={{
          fontSize: 28, width: 52, height: 52, borderRadius: 12,
          background: "rgba(0, 212, 255, 0.12)", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {block.icon || "🧑‍🚀"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18 }}>
            {block.title || "Space Rescue Mission"}
          </div>
          {levelsCompleted !== null && levelsCompleted > 0 && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
              {levelsCompleted} of 4 missions completed
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
          onClick={() => navigate(`/space-rescue/${courseId}`)}
          style={{ flex: 1, padding: "12px 20px", fontSize: 15, fontWeight: 700 }}
        >
          Launch Mission →
        </button>
      </div>
    </div>
  );
}
