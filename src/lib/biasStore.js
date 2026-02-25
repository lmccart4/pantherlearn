// src/lib/biasStore.js
// Firestore helpers for the AI Bias Detective activity.
// Follows the same pattern as botStore.js — all functions take db as first param.

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

/**
 * Create a new bias investigation for a student in a course.
 */
export async function createInvestigation(db, courseId, { studentId, studentName, caseId }) {
  const ref = doc(collection(db, "courses", courseId, "biasInvestigations"));
  const data = {
    studentId,
    studentName: studentName || "Anonymous",
    caseId,
    status: "active",
    currentPhase: "briefing",
    discoveredClues: [],
    flaggedEvidence: [],
    evidenceNotes: {},
    biasReport: {
      identifiedBiases: [],
      mitigations: [],
      summary: "",
    },
    dataRoomAnswers: {},
    clueAnswers: {},
    score: null,
    startedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    submittedAt: null,
  };
  await setDoc(ref, data);
  return { id: ref.id, ...data };
}

/**
 * Get all investigations for a student in a course.
 */
export async function getStudentInvestigations(db, courseId, studentId) {
  const q = query(
    collection(db, "courses", courseId, "biasInvestigations"),
    where("studentId", "==", studentId),
    orderBy("startedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Get a single investigation by ID.
 */
export async function getInvestigation(db, courseId, investigationId) {
  const ref = doc(db, "courses", courseId, "biasInvestigations", investigationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Update an investigation with partial data.
 */
export async function updateInvestigation(db, courseId, investigationId, updates) {
  const ref = doc(db, "courses", courseId, "biasInvestigations", investigationId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an investigation (for restarting).
 */
export async function deleteInvestigation(db, courseId, investigationId) {
  const ref = doc(db, "courses", courseId, "biasInvestigations", investigationId);
  await deleteDoc(ref);
}

/**
 * Get all investigations in a course (teacher query).
 */
export async function getCourseInvestigations(db, courseId) {
  const snap = await getDocs(
    collection(db, "courses", courseId, "biasInvestigations")
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Calculate score for an investigation.
 *
 * New 5-component scoring (when MC answers exist):
 *   Clues found:         0-30 points (weighted by clue point values)
 *   Analysis accuracy:   0-15 points (correct first-attempts / total questions answered)
 *   Bias identification: 0-25 points
 *   Evidence quality:    0-10 points (notes with >20 chars)
 *   Mitigations:         0-20 points (mitigations with >30 chars)
 *
 * Legacy 4-component scoring (no MC data — backward compat):
 *   Clues found:        0-40 points
 *   Bias identification: 0-25 points
 *   Evidence quality:    0-15 points
 *   Mitigations:         0-20 points
 */
export function calculateScore(investigation, caseData) {
  if (!caseData) {
    return { cluesFound: 0, biasIdentification: 0, evidenceQuality: 0, mitigations: 0, total: 0, xpEarned: 0 };
  }

  const hasAnalysisData =
    (investigation.dataRoomAnswers && Object.keys(investigation.dataRoomAnswers).length > 0) ||
    (investigation.clueAnswers && Object.keys(investigation.clueAnswers).length > 0);

  // Clue point calculation (shared)
  const totalCluePoints = caseData.clues.reduce((sum, c) => sum + c.points, 0);
  const foundCluePoints = (investigation.discoveredClues || []).reduce((sum, clueId) => {
    const clue = caseData.clues.find((c) => c.id === clueId);
    return sum + (clue ? clue.points : 0);
  }, 0);

  // Bias identification (0-25, unchanged)
  const identifiedBiases = investigation.biasReport?.identifiedBiases || [];
  const biasIdentification = Math.round(
    (identifiedBiases.length / caseData.biasesToFind.length) * 25
  );

  // Mitigations (0-20, unchanged)
  const mits = investigation.biasReport?.mitigations || [];
  const mitsWithContent = mits.filter((m) => m && m.length > 30).length;
  const mitigationScore = Math.round(
    (mitsWithContent / caseData.biasesToFind.length) * 20
  );

  if (hasAnalysisData) {
    // ── New 5-component scoring ──
    // Clues found (0-30)
    const cluesFound = Math.round((foundCluePoints / totalCluePoints) * 30);

    // Analysis accuracy (0-15) — correct first-attempts across all MC questions
    const drAnswers = investigation.dataRoomAnswers || {};
    const clueAnswers = investigation.clueAnswers || {};
    const allAnswers = [...Object.values(drAnswers), ...Object.values(clueAnswers)];
    const totalAnswered = allAnswers.length;
    const correctFirstAttempts = allAnswers.filter(
      (a) => a && a.correct && a.firstAnswer === a.answer
    ).length;
    const analysisAccuracy = totalAnswered > 0
      ? Math.round((correctFirstAttempts / totalAnswered) * 15)
      : 0;

    // Evidence quality (0-10)
    const notes = investigation.evidenceNotes || {};
    const notesWithContent = Object.values(notes).filter(
      (n) => n && n.length > 20
    ).length;
    const evidenceQuality = Math.min(
      10,
      Math.round((notesWithContent / Math.max(1, caseData.clues.length)) * 10)
    );

    const total = cluesFound + analysisAccuracy + biasIdentification + evidenceQuality + mitigationScore;

    return {
      cluesFound,
      analysisAccuracy,
      biasIdentification,
      evidenceQuality,
      mitigations: mitigationScore,
      total,
      xpEarned: total,
    };
  } else {
    // ── Legacy 4-component scoring ──
    const cluesFound = Math.round((foundCluePoints / totalCluePoints) * 40);

    const notes = investigation.evidenceNotes || {};
    const notesWithContent = Object.values(notes).filter(
      (n) => n && n.length > 20
    ).length;
    const evidenceQuality = Math.min(
      15,
      Math.round((notesWithContent / Math.max(1, caseData.clues.length)) * 15)
    );

    const total = cluesFound + biasIdentification + evidenceQuality + mitigationScore;

    return {
      cluesFound,
      biasIdentification,
      evidenceQuality,
      mitigations: mitigationScore,
      total,
      xpEarned: total,
    };
  }
}
