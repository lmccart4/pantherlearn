// src/lib/momentumStore.js
// ─────────────────────────────────────────────────────────────
// Firestore data layer for the Momentum Mystery Lab activity.
// Path: courses/{courseId}/momentumAttempts/{uid}
// One document per student per course, tracking their best attempt.
// ─────────────────────────────────────────────────────────────

import {
  doc, getDoc, setDoc, collection, getDocs, serverTimestamp
} from "firebase/firestore";

// ─── Grading Scale ───────────────────────────────────────────
// Maps best XP to a 0-1 activityScore and display label.
const GRADE_THRESHOLDS = [
  { min: 600, activityScore: 1.0,  activityLabel: "Expert (100%)" },
  { min: 500, activityScore: 0.9,  activityLabel: "Advanced (90%)" },
  { min: 400, activityScore: 0.8,  activityLabel: "Proficient (80%)" },
  { min: 300, activityScore: 0.7,  activityLabel: "Developing (70%)" },
  { min: 200, activityScore: 0.6,  activityLabel: "Emerging (60%)" },
  { min: 0,   activityScore: 0.5,  activityLabel: "Beginning (50%)" },
];

export function xpToGrade(xp) {
  const tier = GRADE_THRESHOLDS.find((t) => xp >= t.min);
  return tier
    ? { activityScore: tier.activityScore, activityLabel: tier.activityLabel }
    : { activityScore: 0.5, activityLabel: "Beginning (50%)" };
}

// ─── Sync an attempt ─────────────────────────────────────────
// Upserts the student's best attempt document.
// Returns the computed grade and whether this was a new best score.
export async function syncMomentumAttempt(db, courseId, uid, studentName, { xp, cleared, attemptNumber }) {
  const ref = doc(db, "courses", courseId, "momentumAttempts", uid);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : null;

  const prevBest = existing?.bestXP ?? 0;
  const bestXP = Math.max(prevBest, xp);
  const isNewBest = xp > prevBest;
  const { activityScore, activityLabel } = xpToGrade(bestXP);
  const badgeEarned = cleared >= 4;

  await setDoc(ref, {
    studentId: uid,
    studentName,
    bestXP,
    lastXP: xp,
    cleared,
    attemptNumber,
    activityScore,
    activityLabel,
    badgeEarned,
    completedAt: serverTimestamp(),
  }, { merge: true });

  return { activityScore, activityLabel, badgeEarned, isNewBest, bestXP };
}

// ─── Fetch a single student's best attempt ───────────────────
export async function getStudentBestAttempt(db, courseId, uid) {
  const snap = await getDoc(doc(db, "courses", courseId, "momentumAttempts", uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// ─── Fetch all students' attempts for a course ───────────────
export async function getCourseAttempts(db, courseId) {
  const snap = await getDocs(collection(db, "courses", courseId, "momentumAttempts"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
