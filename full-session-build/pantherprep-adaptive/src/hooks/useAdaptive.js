// src/hooks/useAdaptive.js
// React hook for consuming adaptive engine data in components.
// Provides loading state, profile data, and action methods.

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getAdaptiveProfile,
  logAnswer,
  logAnswerBatch,
  getRecentAnswers,
  getAnswersByCourse,
  getQuestions,
} from "../services/performanceService";
import {
  recomputeProfile,
  generatePracticeSet,
} from "../services/adaptiveEngine";

/**
 * Hook: useAdaptiveProfile
 * Loads and manages a student's adaptive profile.
 *
 * @param {string} uid - Student UID
 * @returns {{ profile, loading, error, refresh }}
 */
export function useAdaptiveProfile(uid) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const p = await getAdaptiveProfile(uid);
      setProfile(p);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const refresh = useCallback(async () => {
    // Recompute from scratch and reload
    if (!uid) return;
    setLoading(true);
    try {
      const updated = await recomputeProfile(uid);
      setProfile(updated);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  return { profile, loading, error, refresh };
}

/**
 * Hook: useAnswerLogger
 * Provides methods for logging answers and triggering profile updates.
 *
 * @param {string} uid
 * @returns {{ logSingle, logBatch, recompute }}
 */
export function useAnswerLogger(uid) {
  const pendingRef = useRef([]);
  const timerRef = useRef(null);

  /**
   * Log a single answer immediately.
   */
  const logSingle = useCallback(
    async (answer) => {
      if (!uid) return;
      return logAnswer(uid, answer);
    },
    [uid]
  );

  /**
   * Log a batch of answers (e.g., after completing a practice set).
   * Automatically triggers profile recomputation.
   */
  const logBatch = useCallback(
    async (answers) => {
      if (!uid || !answers.length) return;
      const count = await logAnswerBatch(uid, answers);
      if (count > 0) {
        // Recompute profile after batch
        await recomputeProfile(uid);
      }
      return count;
    },
    [uid]
  );

  /**
   * Queue an answer for deferred batch logging.
   * Flushes after 5 seconds of inactivity or when 10 answers are queued.
   */
  const queueAnswer = useCallback(
    (answer) => {
      pendingRef.current.push(answer);

      // Clear existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Flush if we hit 10
      if (pendingRef.current.length >= 10) {
        const batch = [...pendingRef.current];
        pendingRef.current = [];
        logAnswerBatch(uid, batch).then(() => recomputeProfile(uid));
        return;
      }

      // Otherwise set a 5-second debounce
      timerRef.current = setTimeout(() => {
        if (pendingRef.current.length > 0) {
          const batch = [...pendingRef.current];
          pendingRef.current = [];
          logAnswerBatch(uid, batch).then(() => recomputeProfile(uid));
        }
      }, 5000);
    },
    [uid]
  );

  /**
   * Flush any pending queued answers immediately.
   */
  const flush = useCallback(async () => {
    if (pendingRef.current.length > 0) {
      const batch = [...pendingRef.current];
      pendingRef.current = [];
      if (timerRef.current) clearTimeout(timerRef.current);
      await logAnswerBatch(uid, batch);
      await recomputeProfile(uid);
    }
  }, [uid]);

  /**
   * Force a profile recomputation.
   */
  const recompute = useCallback(async () => {
    if (!uid) return null;
    return recomputeProfile(uid);
  }, [uid]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      // Flush on unmount
      if (pendingRef.current.length > 0 && uid) {
        logAnswerBatch(uid, [...pendingRef.current]);
        pendingRef.current = [];
      }
    };
  }, [uid]);

  return { logSingle, logBatch, queueAnswer, flush, recompute };
}

/**
 * Hook: useAdaptivePractice
 * Generates and manages an adaptive practice session.
 *
 * @param {string} uid
 * @param {string} course
 * @param {number} questionCount
 * @returns {{ practiceSet, loading, generate, currentQuestion, submitAnswer, results }}
 */
export function useAdaptivePractice(uid, course, questionCount = 15) {
  const [practiceSet, setPracticeSet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const { queueAnswer, flush } = useAnswerLogger(uid);

  /**
   * Generate a new adaptive practice set.
   */
  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const set = await generatePracticeSet(uid, course, questionCount, getQuestions);
      setPracticeSet(set);
      setCurrentIndex(0);
      setAnswers([]);
      setStartTime(Date.now());
    } catch (e) {
      console.warn("generatePracticeSet error:", e);
    } finally {
      setLoading(false);
    }
  }, [uid, course, questionCount]);

  /**
   * Submit an answer for the current question.
   */
  const submitAnswer = useCallback(
    (selectedAnswer) => {
      if (!practiceSet?.questions?.length) return;
      const question = practiceSet.questions[currentIndex];
      if (!question) return;

      const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      const correct = selectedAnswer === question.correctAnswer;

      const answerData = {
        questionId: question.id,
        moduleId: question.moduleId || "adaptive",
        course,
        domain: question.domain,
        skill: question.skill,
        difficulty: question.difficulty,
        correct,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        errorCode: null,
        errorCategory: null,
        timeSpent,
        sessionId: `adaptive_${Date.now()}`,
      };

      // Queue for batch logging
      queueAnswer(answerData);

      // Track locally
      setAnswers((prev) => [...prev, { ...answerData, question }]);

      // Advance to next question
      setCurrentIndex((prev) => prev + 1);
      setStartTime(Date.now());
    },
    [practiceSet, currentIndex, startTime, course, queueAnswer]
  );

  /**
   * Get current question.
   */
  const currentQuestion =
    practiceSet?.questions?.[currentIndex] || null;

  /**
   * Check if practice is complete.
   */
  const isComplete =
    practiceSet?.questions?.length > 0 &&
    currentIndex >= practiceSet.questions.length;

  /**
   * Get results summary.
   */
  const results = isComplete
    ? {
        total: answers.length,
        correct: answers.filter((a) => a.correct).length,
        pct: Math.round(
          (answers.filter((a) => a.correct).length / answers.length) * 100
        ),
        answers,
        focusSkills: practiceSet.focusSkills,
        byDomain: groupBy(answers, "domain"),
        bySkill: groupBy(answers, "skill"),
      }
    : null;

  // Flush queued answers when practice completes
  useEffect(() => {
    if (isComplete) {
      flush();
    }
  }, [isComplete, flush]);

  return {
    practiceSet,
    loading,
    generate,
    currentQuestion,
    currentIndex,
    submitAnswer,
    isComplete,
    results,
    totalQuestions: practiceSet?.questions?.length || 0,
  };
}

/**
 * Hook: useRecentAnswers
 * Loads a student's recent answer history.
 */
export function useRecentAnswers(uid, limitN = 50) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getRecentAnswers(uid, limitN)
      .then(setAnswers)
      .finally(() => setLoading(false));
  }, [uid, limitN]);

  return { answers, loading };
}

// ============================================================
// HELPERS
// ============================================================

function groupBy(arr, key) {
  const groups = {};
  for (const item of arr) {
    const k = item[key] || "Unknown";
    if (!groups[k]) groups[k] = { correct: 0, total: 0, items: [] };
    groups[k].total++;
    if (item.correct) groups[k].correct++;
    groups[k].items.push(item);
  }
  return groups;
}
