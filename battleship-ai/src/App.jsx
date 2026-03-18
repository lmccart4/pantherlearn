import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, signInWithGoogle, logOut } from './lib/firebase';
import { reportScore, courseId as urlCourseId } from './lib/pantherlearn';
import BattleshipQuiz from './BattleshipQuiz';

// Map total score → grade tier (matches PantherLearn's 5-bucket system)
function getGradeTier(totalScore) {
  if (totalScore >= 2500) return { value: 1.0, label: "Refining", percent: 100 };
  if (totalScore >= 1800) return { value: 0.85, label: "Developing", percent: 85 };
  if (totalScore >= 1200) return { value: 0.65, label: "Approaching", percent: 75 };
  if (totalScore >= 600)  return { value: 0.55, label: "Emerging", percent: 65 };
  return { value: 0, label: "Missing", percent: 55 };
}

// ?preview=true bypasses auth for agent visual QA (read-only, no scores saved)
const PREVIEW_MODE = new URLSearchParams(window.location.search).get("preview") === "true";
const PREVIEW_USER = PREVIEW_MODE ? { uid: "preview", email: "preview@paps.net", displayName: "Preview User" } : null;

export default function App() {
  const [user, setUser] = useState(PREVIEW_MODE ? PREVIEW_USER : null);
  const [loading, setLoading] = useState(!PREVIEW_MODE);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (PREVIEW_MODE) return; // skip auth listener in preview
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email || "";
        if (!email.toLowerCase().endsWith("@paps.net")) {
          setAuthError("Access restricted to @paps.net accounts only.");
          await logOut();
          setUser(null);
          setLoading(false);
          return;
        }
        setAuthError(null);
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setAuthError("Sign-in failed. Please try again.");
      }
    }
  };

  const handleSignOut = async () => {
    await logOut();
    setAuthError(null);
  };

  const handleGameOver = async (stats) => {
    if (PREVIEW_MODE) return; // no score saving in preview
    const tier = getGradeTier(stats.totalScore);

    // Backward-compatible LMS bridge (postMessage to parent)
    reportScore("battleship-ai", stats.totalScore, 5000, {
      grade: tier.percent,
      accuracy: stats.accuracy,
      enemyShipsSunk: stats.enemyShipsSunk,
      playerShipsSurvived: stats.playerShipsSurvived,
      outcome: stats.outcome,
      combatScore: stats.combatScore,
      survivalBonus: stats.survivalBonus,
      victoryBonus: stats.victoryBonus,
    });

    if (!user) return;

    try {
      // 1. Always save raw score to battleship-scores (standalone lookup)
      const rawDocId = `${user.uid}_${Date.now()}`;
      await setDoc(doc(db, "battleship-scores", rawDocId), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        grade: tier.percent,
        totalScore: stats.totalScore,
        accuracy: stats.accuracy,
        outcome: stats.outcome,
        enemyShipsSunk: stats.enemyShipsSunk,
        playerShipsSurvived: stats.playerShipsSurvived,
        combatScore: stats.combatScore,
        survivalBonus: stats.survivalBonus,
        victoryBonus: stats.victoryBonus,
        completedAt: serverTimestamp(),
      });

      // 2. If embedded with a courseId, auto-grade into the PantherLearn gradebook
      if (urlCourseId) {
        const gradeRef = doc(db, "progress", user.uid, "courses", urlCourseId, "activities", "battleship-ai");
        const reviewRef = doc(db, "courses", urlCourseId, "battleshipAI", user.uid);

        // Check existing grade — only update if new score is higher (best-score policy)
        const existing = await getDoc(gradeRef);
        const existingScore = existing.exists() ? (existing.data().activityScore ?? -1) : -1;

        if (tier.value > existingScore) {
          // Write auto-grade to progress/{uid}/courses/{courseId}/activities/battleship-ai
          await setDoc(gradeRef, {
            activityScore: tier.value,
            activityLabel: tier.label,
            activityType: "battleship-ai",
            activityTitle: "Battleship AI Literacy",
            gradedAt: serverTimestamp(),
          }, { merge: true });

          // Write raw data to courses/{courseId}/battleshipAI/{uid} for teacher review
          await setDoc(reviewRef, {
            uid: user.uid,
            studentId: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            score: stats.totalScore,
            totalScore: stats.totalScore,
            accuracy: stats.accuracy,
            outcome: stats.outcome,
            enemyShipsSunk: stats.enemyShipsSunk,
            playerShipsSurvived: stats.playerShipsSurvived,
            combatScore: stats.combatScore,
            survivalBonus: stats.survivalBonus,
            victoryBonus: stats.victoryBonus,
            completedAt: serverTimestamp(),
          }, { merge: true });

          console.log("[Firestore] Auto-grade saved for", user.email, "→", tier.label, `(${tier.percent}%) [new best]`);
        } else {
          console.log("[Firestore] Score logged for", user.email, "→", tier.label, `(${tier.percent}%) [kept existing ${Math.round(existingScore * 100)}%]`);
        }
      } else {
        console.log("[Firestore] Score saved for", user.email, "(standalone — no courseId)");
      }
    } catch (err) {
      console.error("[Firestore] Failed to save score:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0a0e14", color: "#39ff14", fontFamily: "'Rajdhani', sans-serif", fontSize: 14, letterSpacing: 2 }}>
        INITIALIZING...
      </div>
    );
  }

  return (
    <BattleshipQuiz
      onGameOver={handleGameOver}
      user={user}
      authError={authError}
      onSignIn={handleSignIn}
      onSignOut={handleSignOut}
    />
  );
}
