// src/pages/MomentumMysteryLab.jsx
// ─────────────────────────────────────────────────────────────
// Wrapper page that integrates the standalone Momentum Mystery Lab
// game component with PantherLearn's Firebase backend.
// Handles score syncing, gradebook writes, XP awards, and badge unlock.
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { useParams } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { syncMomentumAttempt } from "../lib/momentumStore";
import { awardXP, updateStudentGamification } from "../lib/gamification";
import { createNotification } from "../lib/notifications";
import MomentumMysteryLabGame from "../momentum-mystery-lab";

export default function MomentumMysteryLab() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [syncState, setSyncState] = useState(null); // null | "syncing" | "synced" | "error"

  const handleSync = async ({ xp, cleared, attemptNumber }) => {
    if (!user || !courseId || syncState === "syncing") return;
    setSyncState("syncing");
    try {
      const { activityScore, activityLabel, badgeEarned, isNewBest, bestXP } =
        await syncMomentumAttempt(db, courseId, user.uid, user.displayName || "Student", {
          xp, cleared, attemptNumber,
        });

      // Write to the gradebook (progress collection) — always update with latest best
      const gradeRef = doc(
        db, "progress", user.uid, "courses", courseId, "activities", "momentum-mystery-lab"
      );
      await setDoc(gradeRef, {
        activityScore,
        activityLabel,
        activityType: "momentum-mystery-lab",
        activityTitle: "Momentum Mystery Lab",
        bestXP,
        gradedAt: new Date(),
      }, { merge: true });

      // Award PantherLearn XP proportional to grade (50–100 XP), only on a new best
      if (isNewBest) {
        await awardXP(user.uid, Math.round(activityScore * 100), "momentum_mystery_lab", courseId);
      }

      // Unlock badge if student cleared 4+ cases
      if (badgeEarned) {
        await updateStudentGamification(user.uid, { momentumBadgeEarned: true }, courseId);
      }

      // Notify the student
      await createNotification(user.uid, {
        type: "grade_result",
        title: `Momentum Mystery Lab: ${activityLabel}`,
        body: `Your best score of ${bestXP} XP earned you ${activityLabel}.`,
        icon: "🔭",
        courseId,
      });

      setSyncState("synced");
    } catch (err) {
      console.error("Momentum Mystery Lab sync error:", err);
      setSyncState("error");
    }
  };

  return (
    <MomentumMysteryLabGame
      onSync={handleSync}
      syncState={syncState}
    />
  );
}
