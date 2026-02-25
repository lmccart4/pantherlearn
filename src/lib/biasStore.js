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
 * Scoring:
 *   Clues found:        0-40 points (weighted by clue point values)
 *   Bias identification: 0-25 points
 *   Evidence quality:    0-15 points (notes with >20 chars)
 *   Mitigations:         0-20 points (mitigations with >30 chars)
 */
export function calculateScore(investigation, caseData) {
  if (!caseData) {
    return { cluesFound: 0, biasIdentification: 0, evidenceQuality: 0, mitigations: 0, total: 0, xpEarned: 0 };
  }

  // Clues found (0-40)
  const totalCluePoints = caseData.clues.reduce((sum, c) => sum + c.points, 0);
  const foundCluePoints = (investigation.discoveredClues || []).reduce((sum, clueId) => {
    const clue = caseData.clues.find((c) => c.id === clueId);
    return sum + (clue ? clue.points : 0);
  }, 0);
  const cluesFound = Math.round((foundCluePoints / totalCluePoints) * 40);

  // Bias identification (0-25)
  const identifiedBiases = investigation.biasReport?.identifiedBiases || [];
  const biasIdentification = Math.round(
    (identifiedBiases.length / caseData.biasesToFind.length) * 25
  );

  // Evidence quality (0-15) — based on notes written
  const notes = investigation.evidenceNotes || {};
  const notesWithContent = Object.values(notes).filter(
    (n) => n && n.length > 20
  ).length;
  const evidenceQuality = Math.min(
    15,
    Math.round((notesWithContent / Math.max(1, caseData.clues.length)) * 15)
  );

  // Mitigations (0-20)
  const mitigations = investigation.biasReport?.mitigations || [];
  const mitigationsWithContent = mitigations.filter(
    (m) => m && m.length > 30
  ).length;
  const mitigationScore = Math.round(
    (mitigationsWithContent / caseData.biasesToFind.length) * 20
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
