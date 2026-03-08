// PantherLearn integration — Firebase auth + Firestore score saving
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

export async function saveProgress(user, stage, scores, maxScores) {
  if (!user) return;

  const totalScore = Object.values(scores).reduce((s, v) => s + v, 0);
  const totalMax = Object.values(maxScores).reduce((s, v) => s + v, 0);
  const completed = stage > 3;

  const data = {
    studentId: user.uid,
    displayName: user.displayName || "",
    email: user.email || "",
    photoURL: user.photoURL || "",
    score: totalScore,
    maxScore: totalMax,
    currentStage: stage,
    stages: {
      stage1: { score: scores.stage1, max: maxScores.stage1 },
      stage2: { score: scores.stage2, max: maxScores.stage2 },
      stage3: { score: scores.stage3, max: maxScores.stage3 },
      stage4: { score: scores.stage4, max: maxScores.stage4 },
    },
    submitted: completed,
    updatedAt: serverTimestamp(),
  };

  if (completed) {
    data.completedAt = serverTimestamp();
  }

  await setDoc(doc(db, "embedding_explorer", user.uid), data, { merge: true });
  console.log(`📊 Progress saved (stage ${stage}):`, data);
}

export async function loadProgress(user) {
  if (!user) return null;
  try {
    const snap = await getDoc(doc(db, "embedding_explorer", user.uid));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.currentStage == null) return null;
    return {
      stage: data.currentStage,
      scores: {
        stage1: data.stages?.stage1?.score ?? 0,
        stage2: data.stages?.stage2?.score ?? 0,
        stage3: data.stages?.stage3?.score ?? 0,
        stage4: data.stages?.stage4?.score ?? 0,
      },
    };
  } catch (err) {
    console.warn("Could not load progress:", err);
    return null;
  }
}
