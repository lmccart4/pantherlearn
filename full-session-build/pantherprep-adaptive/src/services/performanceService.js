// src/services/performanceService.js
// Firestore service layer for the PantherPrep Adaptive Engine
// Handles all reads/writes to performanceLog, adaptiveProfile, and questionPool

import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";

// ============================================================
// PERFORMANCE LOG — granular per-answer tracking
// ============================================================

/**
 * Log a single answer to the performance log.
 * Called after each question is answered in any module.
 *
 * @param {string} uid - Student's Firebase UID
 * @param {Object} answer - Answer data matching performanceLog schema
 * @returns {Promise<string>} - Document ID of the new log entry
 */
export async function logAnswer(uid, answer) {
  if (!db || !uid) return null;
  try {
    const ref = collection(db, "performanceLog", uid, "answers");
    const docRef = await addDoc(ref, {
      uid,
      questionId: answer.questionId,
      moduleId: answer.moduleId,
      course: answer.course,
      domain: answer.domain,
      skill: answer.skill,
      difficulty: answer.difficulty || "M",
      correct: answer.correct,
      selectedAnswer: answer.selectedAnswer || "",
      correctAnswer: answer.correctAnswer || "",
      errorCode: answer.errorCode || null,
      errorCategory: answer.errorCategory || null,
      timeSpent: answer.timeSpent || 0,
      timestamp: serverTimestamp(),
      sessionId: answer.sessionId || "",
    });
    return docRef.id;
  } catch (e) {
    console.warn("logAnswer error:", e);
    return null;
  }
}

/**
 * Log a batch of answers at once (e.g., after completing a practice set).
 *
 * @param {string} uid
 * @param {Object[]} answers - Array of answer objects
 * @returns {Promise<number>} - Number of answers logged
 */
export async function logAnswerBatch(uid, answers) {
  if (!db || !uid || !answers.length) return 0;
  try {
    const batch = writeBatch(db);
    const colRef = collection(db, "performanceLog", uid, "answers");
    let count = 0;

    for (const answer of answers) {
      const docRef = doc(colRef);
      batch.set(docRef, {
        uid,
        questionId: answer.questionId,
        moduleId: answer.moduleId,
        course: answer.course,
        domain: answer.domain,
        skill: answer.skill,
        difficulty: answer.difficulty || "M",
        correct: answer.correct,
        selectedAnswer: answer.selectedAnswer || "",
        correctAnswer: answer.correctAnswer || "",
        errorCode: answer.errorCode || null,
        errorCategory: answer.errorCategory || null,
        timeSpent: answer.timeSpent || 0,
        timestamp: Timestamp.now(),
        sessionId: answer.sessionId || "",
      });
      count++;
    }

    await batch.commit();
    return count;
  } catch (e) {
    console.warn("logAnswerBatch error:", e);
    return 0;
  }
}

/**
 * Get a student's recent answers.
 *
 * @param {string} uid
 * @param {number} limitN - Max results (default 100)
 * @returns {Promise<Object[]>}
 */
export async function getRecentAnswers(uid, limitN = 100) {
  if (!db || !uid) return [];
  try {
    const q = query(
      collection(db, "performanceLog", uid, "answers"),
      orderBy("timestamp", "desc"),
      limit(limitN)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn("getRecentAnswers error:", e);
    return [];
  }
}

/**
 * Get answers filtered by course and optionally by domain/skill.
 *
 * @param {string} uid
 * @param {string} course
 * @param {Object} filters - Optional { domain, skill }
 * @returns {Promise<Object[]>}
 */
export async function getAnswersByCourse(uid, course, filters = {}) {
  if (!db || !uid) return [];
  try {
    let q = query(
      collection(db, "performanceLog", uid, "answers"),
      where("course", "==", course),
      orderBy("timestamp", "desc"),
      limit(500)
    );
    const snap = await getDocs(q);
    let results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Client-side filtering for additional constraints
    if (filters.domain) {
      results = results.filter((r) => r.domain === filters.domain);
    }
    if (filters.skill) {
      results = results.filter((r) => r.skill === filters.skill);
    }
    return results;
  } catch (e) {
    console.warn("getAnswersByCourse error:", e);
    return [];
  }
}

// ============================================================
// ADAPTIVE PROFILE — computed mastery state per student
// ============================================================

/**
 * Get a student's adaptive profile.
 *
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export async function getAdaptiveProfile(uid) {
  if (!db || !uid) return null;
  try {
    const snap = await getDoc(doc(db, "adaptiveProfile", uid));
    return snap.exists() ? { uid, ...snap.data() } : null;
  } catch (e) {
    console.warn("getAdaptiveProfile error:", e);
    return null;
  }
}

/**
 * Save/update a student's adaptive profile.
 *
 * @param {string} uid
 * @param {Object} profile - Full or partial profile data
 * @returns {Promise<boolean>}
 */
export async function saveAdaptiveProfile(uid, profile) {
  if (!db || !uid) return false;
  try {
    await setDoc(
      doc(db, "adaptiveProfile", uid),
      {
        ...profile,
        uid,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.warn("saveAdaptiveProfile error:", e);
    return false;
  }
}

/**
 * Get all adaptive profiles (for teacher dashboard).
 *
 * @returns {Promise<Object[]>}
 */
export async function getAllAdaptiveProfiles() {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "adaptiveProfile"));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  } catch (e) {
    console.warn("getAllAdaptiveProfiles error:", e);
    return [];
  }
}

// ============================================================
// QUESTION POOL — normalized question bank for adaptive practice
// ============================================================

/**
 * Get questions from the pool matching criteria.
 *
 * @param {Object} criteria - { course, domain?, skill?, difficulty?, limit? }
 * @returns {Promise<Object[]>}
 */
export async function getQuestions(criteria) {
  if (!db) return [];
  try {
    const constraints = [where("course", "==", criteria.course)];

    if (criteria.domain) {
      constraints.push(where("domain", "==", criteria.domain));
    }
    if (criteria.skill) {
      constraints.push(where("skill", "==", criteria.skill));
    }
    if (criteria.difficulty) {
      constraints.push(where("difficulty", "==", criteria.difficulty));
    }

    const q = query(
      collection(db, "questionPool"),
      ...constraints,
      limit(criteria.limit || 50)
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn("getQuestions error:", e);
    return [];
  }
}

/**
 * Add a question to the pool.
 *
 * @param {Object} question - Question data matching questionPool schema
 * @returns {Promise<string|null>} - Document ID
 */
export async function addQuestion(question) {
  if (!db) return null;
  try {
    const docRef = await addDoc(collection(db, "questionPool"), question);
    return docRef.id;
  } catch (e) {
    console.warn("addQuestion error:", e);
    return null;
  }
}

/**
 * Batch-add questions to the pool.
 *
 * @param {Object[]} questions
 * @returns {Promise<number>} - Count added
 */
export async function addQuestionBatch(questions) {
  if (!db || !questions.length) return 0;
  try {
    const batch = writeBatch(db);
    let count = 0;
    for (const q of questions) {
      const ref = doc(collection(db, "questionPool"));
      batch.set(ref, q);
      count++;
      // Firestore batches max at 500
      if (count % 500 === 0) {
        await batch.commit();
      }
    }
    if (count % 500 !== 0) {
      await batch.commit();
    }
    return count;
  } catch (e) {
    console.warn("addQuestionBatch error:", e);
    return 0;
  }
}

// ============================================================
// UTILITY HELPERS
// ============================================================

/**
 * Get today's date as ISO string (UTC).
 */
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Calculate days between two ISO date strings.
 */
export function daysBetween(dateA, dateB) {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}
