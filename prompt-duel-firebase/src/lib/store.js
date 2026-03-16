// src/lib/store.js
// Prompt Duel Firestore persistence — uses Firebase Auth UID for PantherLearn integration
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  increment,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const LEADERBOARD_COL = "promptDuelLeaderboard";
const GAME_HISTORY_COL = "promptDuelHistory";

// Save a completed game session (uses Firebase Auth UID as document ID)
export async function saveGameResult(user, courseId, result) {
  const {
    totalScore,
    xpEarned,
    rank,
    totalPlayers,
    roundResults,
  } = result;

  const uid = user.uid;
  const displayName = user.displayName || user.email || "Unknown";

  // Update leaderboard entry keyed by UID (upsert)
  const lbRef = doc(db, LEADERBOARD_COL, uid);
  const existing = await getDoc(lbRef);

  if (existing.exists()) {
    const data = existing.data();
    await updateDoc(lbRef, {
      name: displayName,
      email: user.email || "",
      photoURL: user.photoURL || "",
      totalXP: increment(xpEarned),
      gamesPlayed: increment(1),
      bestScore: Math.max(data.bestScore || 0, totalScore),
      lastPlayed: serverTimestamp(),
    });
  } else {
    await setDoc(lbRef, {
      name: displayName,
      email: user.email || "",
      photoURL: user.photoURL || "",
      uid,
      totalXP: xpEarned,
      gamesPlayed: 1,
      bestScore: totalScore,
      lastPlayed: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }

  // Save individual game history with courseId for grading integration
  const histRef = doc(collection(db, GAME_HISTORY_COL));
  await setDoc(histRef, {
    uid,
    playerName: displayName,
    email: user.email || "",
    photoURL: user.photoURL || "",
    courseId: courseId || null,
    totalScore,
    xpEarned,
    rank,
    totalPlayers,
    rounds: roundResults.map((rr) => ({
      round: rr.round,
      bestScore: rr.bestScore,
      iterations: rr.iterations.length,
    })),
    playedAt: serverTimestamp(),
  });

  // Sync XP to PantherLearn gamification system
  await syncXPToPantherLearn(uid, xpEarned, courseId);

  return { uid };
}

// Get top N leaderboard entries
export async function getLeaderboard(n = 20) {
  const q = query(
    collection(db, LEADERBOARD_COL),
    orderBy("bestScore", "desc"),
    limit(n)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d, i) => ({
    id: d.id,
    rank: i + 1,
    ...d.data(),
  }));
}

// Get a specific player's stats by UID
export async function getPlayerStats(uid) {
  const ref = doc(db, LEADERBOARD_COL, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Get game history for a specific student in a specific course
export async function getStudentGameHistory(uid, courseId) {
  const q = query(
    collection(db, GAME_HISTORY_COL),
    where("uid", "==", uid),
    where("courseId", "==", courseId),
    orderBy("playedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── PantherLearn XP Bridge ──────────────────────────────────────
// Pushes XP into PantherLearn's course-scoped gamification system

export async function syncXPToPantherLearn(uid, xpAmount, courseId) {
  if (!uid || !xpAmount) return;
  try {
    // Update global user XP
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      "moduleXP.promptDuel": increment(xpAmount),
      lastActivity: serverTimestamp(),
    });

    // Update course-scoped gamification if courseId provided
    if (courseId) {
      const gamRef = doc(db, "courses", courseId, "gamification", uid);
      const gamDoc = await getDoc(gamRef);
      if (gamDoc.exists()) {
        await updateDoc(gamRef, {
          totalXP: increment(xpAmount),
          lastActivity: serverTimestamp(),
        });
      } else {
        await setDoc(gamRef, {
          totalXP: xpAmount,
          lastActivity: serverTimestamp(),
        }, { merge: true });
      }
    }
  } catch (e) {
    console.warn("[PantherLearn XP sync] Failed:", e.message);
    // Non-critical — don't break the game if PantherLearn sync fails
  }
}
