// src/utils/adaptiveBridge.js
// Drop-in integration for existing PantherPrep modules.
//
// USAGE IN EXISTING MODULES:
// 1. Import this file in any module that tracks student answers
// 2. Call adaptiveBridge.init(uid, course, moduleId) when the module loads
// 3. Call adaptiveBridge.recordAnswer({...}) after each question is answered
// 4. Call adaptiveBridge.finishSession() when the student completes the module
//
// This bridges the gap between the existing localStorage/inline tracking
// and the new Firestore-based adaptive engine.

import { logAnswer, logAnswerBatch } from "../services/performanceService";
import { recomputeProfile } from "../services/adaptiveEngine";

class AdaptiveBridge {
  constructor() {
    this.uid = null;
    this.course = null;
    this.moduleId = null;
    this.sessionId = null;
    this.answers = [];
    this.startTime = null;
    this.questionStartTime = null;
    this.initialized = false;
  }

  /**
   * Initialize the bridge for a session.
   * Call this when the module loads and the user is authenticated.
   *
   * @param {string} uid - Firebase UID
   * @param {string} course - e.g. "psat89_math", "sat_rw"
   * @param {string} moduleId - e.g. "psat_nmsqt_rw_3"
   */
  init(uid, course, moduleId) {
    this.uid = uid;
    this.course = course;
    this.moduleId = moduleId;
    this.sessionId = `${moduleId}_${Date.now()}`;
    this.answers = [];
    this.startTime = Date.now();
    this.questionStartTime = Date.now();
    this.initialized = true;
    console.log(`[Adaptive] Initialized for ${course}/${moduleId}`);
  }

  /**
   * Mark the start of a new question (for time tracking).
   * Call this when a new question is displayed.
   */
  startQuestion() {
    this.questionStartTime = Date.now();
  }

  /**
   * Record a student's answer.
   * Call this after each question is answered.
   *
   * @param {Object} data
   * @param {string} data.questionId - Unique question identifier
   * @param {string} data.domain - e.g. "Algebra", "Information & Ideas"
   * @param {string} data.skill - e.g. "linear_equations", "transitions"
   * @param {string} data.difficulty - "F" | "M" | "C"
   * @param {boolean} data.correct - Whether the answer was correct
   * @param {string} data.selectedAnswer - What the student chose
   * @param {string} data.correctAnswer - What was right
   * @param {string} [data.errorCode] - Module-specific error code
   * @param {string} [data.errorCategory] - "content_gap" | "careless" | "time_pressure" | "misread_trap" | "strategy_gap"
   */
  recordAnswer(data) {
    if (!this.initialized) {
      console.warn("[Adaptive] Not initialized. Call init() first.");
      return;
    }

    const timeSpent = this.questionStartTime
      ? Math.round((Date.now() - this.questionStartTime) / 1000)
      : 0;

    const answer = {
      questionId: data.questionId || `${this.moduleId}_q${this.answers.length + 1}`,
      moduleId: this.moduleId,
      course: this.course,
      domain: data.domain || "Unknown",
      skill: data.skill || "unknown",
      difficulty: data.difficulty || "M",
      correct: !!data.correct,
      selectedAnswer: data.selectedAnswer || "",
      correctAnswer: data.correctAnswer || "",
      errorCode: data.errorCode || null,
      errorCategory: data.errorCategory || this._inferErrorCategory(data),
      timeSpent,
      sessionId: this.sessionId,
    };

    this.answers.push(answer);
    this.questionStartTime = Date.now(); // Reset for next question

    console.log(`[Adaptive] Recorded: ${answer.skill} ${answer.correct ? "✓" : "✗"} (${timeSpent}s)`);
    return answer;
  }

  /**
   * Infer error category from available data when not explicitly provided.
   * This is a heuristic fallback — explicit categorization is always better.
   */
  _inferErrorCategory(data) {
    if (data.correct) return null;

    // Map common module error codes to categories
    const codeMap = {
      // Math error codes
      SIGN_ERROR: "careless",
      WRONG_METHOD: "strategy_gap",
      MISREAD: "misread_trap",
      TRAP: "misread_trap",
      TIME_PRESSURE: "time_pressure",
      CALCULATION: "careless",
      CONCEPT: "content_gap",
      FORMULA: "content_gap",

      // R&W error codes
      VOCAB: "content_gap",
      SCOPE: "misread_trap",
      REVERSAL: "misread_trap",
      PARTIAL: "misread_trap",
      GRAMMAR: "content_gap",
      RUSHED: "time_pressure",
    };

    if (data.errorCode && codeMap[data.errorCode]) {
      return codeMap[data.errorCode];
    }

    // Heuristic: if they spent very little time, probably rushed
    if (data.timeSpent !== undefined && data.timeSpent < 10) {
      return "time_pressure";
    }

    // Default to content_gap for unknown errors
    return "content_gap";
  }

  /**
   * Finish the current session.
   * Flushes all queued answers to Firestore and triggers profile recomputation.
   * Call this when the student completes the module or navigates away.
   *
   * @returns {Promise<Object>} - { answerCount, profile }
   */
  async finishSession() {
    if (!this.initialized || !this.uid) {
      console.warn("[Adaptive] Cannot finish — not initialized or no UID.");
      return { answerCount: 0, profile: null };
    }

    console.log(`[Adaptive] Finishing session: ${this.answers.length} answers`);

    let answerCount = 0;
    let profile = null;

    try {
      // Batch write all answers
      if (this.answers.length > 0) {
        answerCount = await logAnswerBatch(this.uid, this.answers);
      }

      // Recompute adaptive profile
      profile = await recomputeProfile(this.uid);

      console.log(`[Adaptive] Session complete. ${answerCount} answers saved, profile updated.`);
    } catch (e) {
      console.warn("[Adaptive] finishSession error:", e);
    }

    // Reset
    this.answers = [];
    this.initialized = false;

    return { answerCount, profile };
  }

  /**
   * Get session stats without finishing.
   */
  getSessionStats() {
    const total = this.answers.length;
    const correct = this.answers.filter((a) => a.correct).length;
    const elapsed = this.startTime ? Math.round((Date.now() - this.startTime) / 1000) : 0;

    // Group by domain
    const byDomain = {};
    for (const a of this.answers) {
      if (!byDomain[a.domain]) byDomain[a.domain] = { correct: 0, total: 0 };
      byDomain[a.domain].total++;
      if (a.correct) byDomain[a.domain].correct++;
    }

    // Group by error category
    const errorBreakdown = {};
    for (const a of this.answers) {
      if (!a.correct && a.errorCategory) {
        errorBreakdown[a.errorCategory] = (errorBreakdown[a.errorCategory] || 0) + 1;
      }
    }

    return {
      total,
      correct,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
      elapsed,
      byDomain,
      errorBreakdown,
      answers: this.answers,
    };
  }
}

// Singleton instance
const adaptiveBridge = new AdaptiveBridge();
export default adaptiveBridge;

// ============================================================
// CONVENIENCE: Error category classifier for manual tagging
// ============================================================

/**
 * Helper for building error categorization UI.
 * Returns the 5 categories with descriptions for student self-tagging.
 */
export const ERROR_CATEGORIES = [
  {
    key: "content_gap",
    label: "Content Gap",
    emoji: "📚",
    description: "I didn't know the concept or rule",
    color: "#f87171",
  },
  {
    key: "careless",
    label: "Careless Error",
    emoji: "😤",
    description: "I knew it but made a silly mistake",
    color: "#fbbf24",
  },
  {
    key: "time_pressure",
    label: "Time Pressure",
    emoji: "⏱",
    description: "I ran out of time or rushed",
    color: "#fb923c",
  },
  {
    key: "misread_trap",
    label: "Misread / Trap",
    emoji: "🪤",
    description: "I fell for a trick or misread the question",
    color: "#c084fc",
  },
  {
    key: "strategy_gap",
    label: "Strategy Gap",
    emoji: "🧭",
    description: "I used the wrong approach or method",
    color: "#38bdf8",
  },
];

// ============================================================
// CONVENIENCE: Skill mapper for common module question types
// ============================================================

/**
 * Maps module-specific question IDs/types to skill taxonomy keys.
 * Extend this as you add more modules.
 */
export const SKILL_MAP = {
  // PSAT NMSQT Math
  linear_eq: "linear_equations",
  linear_ineq: "linear_inequalities",
  systems: "systems_of_equations",
  quadratic: "quadratic_equations",
  quad_formula: "quadratic_formula",
  polynomial: "polynomial_operations",
  exponential: "exponential_functions",
  radical: "radical_equations",
  rational: "rational_expressions",
  ratio: "ratios_rates",
  percent: "percentages",
  scatter: "scatterplots",
  regression: "linear_regression",
  prob: "probability",
  mean_med: "statistics_central_tendency",
  spread: "statistics_spread",
  two_way: "two_way_tables",
  ev: "expected_value",
  area: "area_perimeter",
  volume: "volume",
  triangle: "triangles",
  circle: "circles",
  coord: "coordinate_geometry",
  trig: "right_triangle_trig",

  // SAT / PSAT R&W
  central: "central_ideas",
  evidence: "details_evidence",
  inference: "inferences",
  quant_ev: "quantitative_evidence",
  text_struct: "text_structure",
  vocab: "vocabulary_in_context",
  purpose: "purpose_function",
  cross_text: "cross_text_connections",
  pov: "point_of_view",
  transition: "transitions",
  rhet_synth: "rhetorical_synthesis",
  org: "organization",
  sva: "subject_verb_agreement",
  pronoun: "pronoun_clarity",
  modifier: "modifiers",
  parallel: "parallelism",
  tense: "verb_tense",
  boundary: "punctuation_boundaries",
  comma: "comma_usage",
  colon: "colon_usage",
  possessive: "possessives",
};

/**
 * Look up the canonical skill key for a module-specific identifier.
 */
export function mapSkill(moduleSkillId) {
  return SKILL_MAP[moduleSkillId] || moduleSkillId;
}
