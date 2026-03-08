// src/lib/embeddingStore.js
// Firestore helpers for the Embedding Explorer ("The Word Vault") activity.
// Follows the same pattern as biasStore.js — all functions take db as first param.

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
 * Create a new embedding exploration for a student in a course.
 */
export async function createExploration(db, courseId, { studentId, studentName, caseId }) {
  const ref = doc(collection(db, "courses", courseId, "embeddingExplorations"));
  const data = {
    studentId,
    studentName: studentName || "Anonymous",
    caseId,
    status: "active",
    currentPhase: "briefing",
    labAnswers: {},
    discoveredInsights: [],
    insightAnswers: {},
    flaggedFindings: [],
    findingNotes: {},
    engineerReport: {
      identifiedFindings: [],
      explanations: [],
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
 * Get all explorations for a student in a course.
 */
export async function getStudentExplorations(db, courseId, studentId) {
  const q = query(
    collection(db, "courses", courseId, "embeddingExplorations"),
    where("studentId", "==", studentId),
    orderBy("startedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Get a single exploration by ID.
 */
export async function getExploration(db, courseId, explorationId) {
  const ref = doc(db, "courses", courseId, "embeddingExplorations", explorationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

/**
 * Update an exploration with partial data.
 */
export async function updateExploration(db, courseId, explorationId, updates) {
  const ref = doc(db, "courses", courseId, "embeddingExplorations", explorationId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an exploration (for restarting).
 */
export async function deleteExploration(db, courseId, explorationId) {
  const ref = doc(db, "courses", courseId, "embeddingExplorations", explorationId);
  await deleteDoc(ref);
}

/**
 * Get all explorations in a course (teacher query).
 */
export async function getCourseExplorations(db, courseId) {
  const snap = await getDocs(
    collection(db, "courses", courseId, "embeddingExplorations")
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Calculate score for an exploration.
 *
 * 5-component scoring (100 points total):
 *   Insights Found:      0-25 points (weighted by insight point values)
 *   Analysis Accuracy:   0-20 points (correct first-attempts on MC questions)
 *   Key Findings:        0-25 points (correct finding selections in report)
 *   Evidence Quality:    0-10 points (notes with >20 chars in Pattern Locker)
 *   Engineer's Report:   0-20 points (explanations >30 chars + summary)
 */
export function calculateScore(exploration, caseData) {
  if (!caseData) {
    return { insightsFound: 0, analysisAccuracy: 0, findingsId: 0, evidenceQuality: 0, engineerReport: 0, total: 0, xpEarned: 0 };
  }

  // Insights Found (0-25) — weighted by insight point values
  const totalInsightPoints = caseData.insights.reduce((sum, ins) => sum + ins.points, 0);
  const foundInsightPoints = (exploration.discoveredInsights || []).reduce((sum, insId) => {
    const ins = caseData.insights.find((i) => i.id === insId);
    return sum + (ins ? ins.points : 0);
  }, 0);
  const insightsFound = totalInsightPoints > 0
    ? Math.round((foundInsightPoints / totalInsightPoints) * 25)
    : 0;

  // Analysis Accuracy (0-20) — correct first-attempts across all MC questions
  const labAnswers = exploration.labAnswers || {};
  const insightAnswers = exploration.insightAnswers || {};
  const allAnswers = [...Object.values(labAnswers), ...Object.values(insightAnswers)];
  const totalAnswered = allAnswers.length;
  const correctFirstAttempts = allAnswers.filter(
    (a) => a && a.correct && a.firstAnswer === a.answer
  ).length;
  const analysisAccuracy = totalAnswered > 0
    ? Math.round((correctFirstAttempts / totalAnswered) * 20)
    : 0;

  // Key Findings (0-25) — correct finding selections in report
  const totalFindings = caseData.findingsToIdentify?.length || 1;
  const identifiedFindings = exploration.engineerReport?.identifiedFindings || [];
  const correctFindings = identifiedFindings.filter(
    (fId) => caseData.findingsToIdentify?.some((f) => f.id === fId)
  ).length;
  const findingsId = Math.round((correctFindings / totalFindings) * 25);

  // Evidence Quality (0-10) — notes with >20 chars in Pattern Locker
  const notes = exploration.findingNotes || {};
  const notesWithContent = Object.values(notes).filter(
    (n) => n && n.length > 20
  ).length;
  const evidenceQuality = Math.min(
    10,
    Math.round((notesWithContent / Math.max(1, caseData.insights.length)) * 10)
  );

  // Engineer's Report (0-20) — explanations >30 chars + summary
  const explanations = exploration.engineerReport?.explanations || [];
  const explanationsWithContent = explanations.filter((e) => e && e.length > 30).length;
  const hasSummary = (exploration.engineerReport?.summary || "").length > 30;
  const explanationScore = Math.min(12, Math.round((explanationsWithContent / Math.max(1, totalFindings)) * 12));
  const summaryScore = hasSummary ? 8 : 0;
  const engineerReportScore = explanationScore + summaryScore;

  const total = insightsFound + analysisAccuracy + findingsId + evidenceQuality + engineerReportScore;

  return {
    insightsFound,
    analysisAccuracy,
    findingsId,
    evidenceQuality,
    engineerReport: engineerReportScore,
    total,
    xpEarned: total,
  };
}
