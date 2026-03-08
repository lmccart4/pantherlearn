// src/services/adaptiveEngine.js
// Core adaptive logic: mastery calculation, spaced repetition, recommendations
//
// Uses a modified SM-2 algorithm adapted for test prep:
// - Mastery is weighted toward recent performance (exponential decay)
// - Ease factor adjusts based on error patterns, not just correct/incorrect
// - Interval scheduling determines when a skill should be reviewed
// - Recommendations are prioritized by a composite score of mastery, recency, and error severity

import {
  getRecentAnswers,
  getAdaptiveProfile,
  saveAdaptiveProfile,
  todayISO,
  daysBetween,
} from "./performanceService";

// ============================================================
// CONSTANTS
// ============================================================

const DEFAULT_EASE = 2.0;
const MIN_EASE = 1.3;
const MAX_EASE = 2.5;
const DECAY_HALFLIFE = 14; // answers older than 14 days count half as much
const MIN_ANSWERS_FOR_MASTERY = 3; // need at least 3 answers to compute mastery
const MAX_RECOMMENDATIONS = 10;

// Difficulty weights for mastery calculation
const DIFFICULTY_WEIGHT = { F: 0.7, M: 1.0, C: 1.4 };

// Error severity multipliers (how much each error type hurts ease)
const ERROR_SEVERITY = {
  content_gap: 0.25, // biggest hit — they don't know it
  strategy_gap: 0.2,
  misread_trap: 0.15,
  time_pressure: 0.1,
  careless: 0.05, // smallest hit — they know it, just slipped
};

// ============================================================
// MASTERY CALCULATION
// ============================================================

/**
 * Calculate time-decayed mastery for a set of answers on a single skill.
 * More recent answers weigh more heavily.
 *
 * @param {Object[]} answers - Answers filtered to one skill, sorted newest-first
 * @returns {{ mastery: number, weightedCorrect: number, weightedTotal: number }}
 */
function calcSkillMastery(answers) {
  if (!answers.length) return { mastery: 0, weightedCorrect: 0, weightedTotal: 0 };

  const now = Date.now();
  let weightedCorrect = 0;
  let weightedTotal = 0;

  for (const ans of answers) {
    const ansTime = ans.timestamp?.toDate?.()
      ? ans.timestamp.toDate().getTime()
      : ans.timestamp?.seconds
      ? ans.timestamp.seconds * 1000
      : now;

    const daysAgo = (now - ansTime) / (1000 * 60 * 60 * 24);
    const recencyWeight = Math.pow(0.5, daysAgo / DECAY_HALFLIFE);
    const diffWeight = DIFFICULTY_WEIGHT[ans.difficulty] || 1.0;
    const weight = recencyWeight * diffWeight;

    weightedTotal += weight;
    if (ans.correct) {
      weightedCorrect += weight;
    }
  }

  const mastery = weightedTotal > 0 ? weightedCorrect / weightedTotal : 0;
  return { mastery, weightedCorrect, weightedTotal };
}

/**
 * Count error patterns for a set of answers.
 *
 * @param {Object[]} answers
 * @returns {Object} - { content_gap: n, careless: n, ... }
 */
function countErrorPatterns(answers) {
  const counts = {
    content_gap: 0,
    careless: 0,
    time_pressure: 0,
    misread_trap: 0,
    strategy_gap: 0,
  };
  for (const ans of answers) {
    if (!ans.correct && ans.errorCategory && counts[ans.errorCategory] !== undefined) {
      counts[ans.errorCategory]++;
    }
  }
  return counts;
}

/**
 * Calculate SM-2 ease factor based on recent performance and error patterns.
 *
 * @param {number} currentEase - Previous ease factor
 * @param {Object[]} recentAnswers - Last 5-10 answers for this skill
 * @returns {number} - New ease factor
 */
function calcEase(currentEase, recentAnswers) {
  if (!recentAnswers.length) return currentEase;

  const correct = recentAnswers.filter((a) => a.correct).length;
  const total = recentAnswers.length;
  const pct = correct / total;

  // Base ease adjustment from SM-2: q is quality (0-5)
  // We map percentage to quality: 100% → 5, 0% → 0
  const q = pct * 5;
  let newEase = currentEase + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));

  // Additional penalty from error patterns
  const errors = countErrorPatterns(recentAnswers);
  for (const [category, count] of Object.entries(errors)) {
    if (count > 0 && ERROR_SEVERITY[category]) {
      newEase -= ERROR_SEVERITY[category] * Math.min(count, 3);
    }
  }

  return Math.max(MIN_EASE, Math.min(MAX_EASE, newEase));
}

/**
 * Calculate next review interval using modified SM-2.
 *
 * @param {number} ease - Current ease factor
 * @param {number} currentInterval - Previous interval in days
 * @param {boolean} lastCorrect - Was the most recent answer correct?
 * @returns {number} - New interval in days
 */
function calcInterval(ease, currentInterval, lastCorrect) {
  if (!lastCorrect) {
    // Reset to 1 day on failure
    return 1;
  }
  if (currentInterval === 0) return 1;
  if (currentInterval === 1) return 3;
  return Math.round(currentInterval * ease);
}

// ============================================================
// PROFILE RECOMPUTATION
// ============================================================

/**
 * Recompute a student's full adaptive profile from their answer log.
 * This is the main entry point called after a student completes a session.
 *
 * @param {string} uid
 * @returns {Promise<Object>} - Updated profile
 */
export async function recomputeProfile(uid) {
  // Load existing profile (for previous ease/interval values)
  const existingProfile = await getAdaptiveProfile(uid);
  const existingSkills = existingProfile?.skills || {};

  // Load all recent answers (last 500)
  const allAnswers = await getRecentAnswers(uid, 500);
  if (!allAnswers.length) return existingProfile;

  // Group answers by skill
  const bySkill = {};
  for (const ans of allAnswers) {
    const key = ans.skill || "unknown";
    if (!bySkill[key]) bySkill[key] = [];
    bySkill[key].push(ans);
  }

  // Compute per-skill mastery
  const skills = {};
  for (const [skillKey, answers] of Object.entries(bySkill)) {
    const { mastery, weightedCorrect, weightedTotal } = calcSkillMastery(answers);
    const total = answers.length;
    const correct = answers.filter((a) => a.correct).length;
    const errorPatterns = countErrorPatterns(answers);

    // Get previous SM-2 state
    const prev = existingSkills[skillKey] || {
      ease: DEFAULT_EASE,
      interval: 0,
    };

    // Use last 8 answers for ease calculation
    const recentForEase = answers.slice(0, 8);
    const newEase = calcEase(prev.ease, recentForEase);
    const lastCorrect = answers[0]?.correct ?? true;
    const newInterval = calcInterval(newEase, prev.interval, lastCorrect);

    // Calculate next review date
    const today = todayISO();
    const lastSeen = answers[0]?.timestamp;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

    skills[skillKey] = {
      correct,
      total,
      mastery: Math.round(mastery * 1000) / 1000,
      ease: Math.round(newEase * 100) / 100,
      interval: newInterval,
      nextReview: nextReviewDate.toISOString().split("T")[0],
      lastSeen,
      errorPatterns,
    };
  }

  // Compute per-domain rollups
  const domains = {};
  for (const [skillKey, skillData] of Object.entries(skills)) {
    // Find the domain for this skill from the answer data
    const sampleAnswer = bySkill[skillKey]?.[0];
    const domain = sampleAnswer?.domain || "Unknown";

    if (!domains[domain]) {
      domains[domain] = {
        mastery: 0,
        totalCorrect: 0,
        totalAnswers: 0,
        skillMasteries: [],
        weakestSkills: [],
        strongestSkills: [],
      };
    }

    domains[domain].totalCorrect += skillData.correct;
    domains[domain].totalAnswers += skillData.total;
    domains[domain].skillMasteries.push({
      skill: skillKey,
      mastery: skillData.mastery,
    });
  }

  // Finalize domain rollups
  for (const [domainKey, domainData] of Object.entries(domains)) {
    const masteries = domainData.skillMasteries;
    domainData.mastery =
      masteries.length > 0
        ? Math.round(
            (masteries.reduce((sum, s) => sum + s.mastery, 0) / masteries.length) * 1000
          ) / 1000
        : 0;

    // Sort skills by mastery
    masteries.sort((a, b) => a.mastery - b.mastery);
    domainData.weakestSkills = masteries.slice(0, 3).map((s) => s.skill);
    domainData.strongestSkills = masteries
      .slice(-3)
      .reverse()
      .map((s) => s.skill);

    // Clean up temp data
    delete domainData.skillMasteries;
  }

  // Generate recommendations
  const recommendations = generateRecommendations(skills, domains);

  // Calculate weekly stats
  const weeklyStats = calcWeeklyStats(allAnswers, domains, existingProfile);

  // Calculate streak
  const streakDays = calcStreak(allAnswers);

  // Build full profile
  const profile = {
    uid,
    totalAnswers: allAnswers.length,
    totalCorrect: allAnswers.filter((a) => a.correct).length,
    streakDays,
    lastActiveDate: todayISO(),
    skills,
    domains,
    recommendations,
    weeklyStats,
  };

  // Save to Firestore
  await saveAdaptiveProfile(uid, profile);
  return profile;
}

// ============================================================
// RECOMMENDATION ENGINE
// ============================================================

/**
 * Generate prioritized practice recommendations.
 *
 * Priority scoring:
 * 1. Skills due for review (nextReview <= today) get a base boost
 * 2. Lower mastery = higher priority
 * 3. Content gap errors are weighted more than careless errors
 * 4. Skills with very few answers get a "needs data" boost
 *
 * @param {Object} skills - Per-skill data from profile
 * @param {Object} domains - Per-domain rollups
 * @returns {Object[]} - Sorted recommendations
 */
function generateRecommendations(skills, domains) {
  const today = todayISO();
  const recs = [];

  for (const [skillKey, skillData] of Object.entries(skills)) {
    // Skip skills with very high mastery and not due for review
    if (skillData.mastery > 0.9 && skillData.nextReview > today) continue;

    let priorityScore = 0;
    let reason = "";

    // Factor 1: Low mastery (0-40 points)
    const masteryPenalty = (1 - skillData.mastery) * 40;
    priorityScore += masteryPenalty;
    if (skillData.mastery < 0.4) {
      reason = `Low mastery (${Math.round(skillData.mastery * 100)}%)`;
    }

    // Factor 2: Due for review (0-25 points)
    if (skillData.nextReview <= today) {
      const overdueDays = daysBetween(skillData.nextReview, today);
      priorityScore += Math.min(25, 10 + overdueDays * 2);
      if (!reason) reason = `Due for review (${overdueDays}d overdue)`;
    }

    // Factor 3: Error pattern severity (0-20 points)
    const errors = skillData.errorPatterns || {};
    let errorScore = 0;
    for (const [cat, count] of Object.entries(errors)) {
      errorScore += (ERROR_SEVERITY[cat] || 0) * count * 10;
    }
    priorityScore += Math.min(20, errorScore);
    if (errors.content_gap > 2 && !reason) {
      reason = `Frequent content gaps (${errors.content_gap} occurrences)`;
    }
    if (errors.misread_trap > 2 && !reason) {
      reason = `Falling for traps (${errors.misread_trap} occurrences)`;
    }

    // Factor 4: Insufficient data (0-15 points)
    if (skillData.total < MIN_ANSWERS_FOR_MASTERY) {
      priorityScore += 15;
      if (!reason) reason = `Needs more practice (only ${skillData.total} answers)`;
    }

    if (!reason) reason = `Review recommended (${Math.round(skillData.mastery * 100)}% mastery)`;

    // Determine suggested difficulty
    let suggestedDifficulty = "M";
    if (skillData.mastery < 0.3) suggestedDifficulty = "F";
    else if (skillData.mastery > 0.7) suggestedDifficulty = "C";

    // Determine question count
    let questionCount = 5;
    if (skillData.mastery < 0.3) questionCount = 8;
    else if (skillData.mastery > 0.7) questionCount = 3;

    // Find the domain
    const domain = findDomainForSkill(skillKey, domains) || "Unknown";

    recs.push({
      skill: skillKey,
      domain,
      reason,
      priority: Math.round(priorityScore),
      suggestedDifficulty,
      questionCount,
    });
  }

  // Sort by priority descending, take top N
  recs.sort((a, b) => b.priority - a.priority);
  return recs.slice(0, MAX_RECOMMENDATIONS).map((r, i) => ({
    ...r,
    priority: i + 1, // re-rank 1-based
  }));
}

/**
 * Find which domain a skill belongs to.
 */
function findDomainForSkill(skillKey, domains) {
  for (const [domainKey, domainData] of Object.entries(domains)) {
    if (
      domainData.weakestSkills?.includes(skillKey) ||
      domainData.strongestSkills?.includes(skillKey)
    ) {
      return domainKey;
    }
  }
  return null;
}

// ============================================================
// PRACTICE SET GENERATION
// ============================================================

/**
 * Generate an adaptive practice set for a student.
 * Uses recommendations to select questions weighted by need.
 *
 * @param {string} uid
 * @param {string} course - Which course to pull from
 * @param {number} totalQuestions - How many questions in the set (default 15)
 * @param {Function} getQuestionsFn - Injected question fetcher (for testability)
 * @returns {Promise<Object>} - { questions: [], focusSkills: [], difficulty: string }
 */
export async function generatePracticeSet(uid, course, totalQuestions = 15, getQuestionsFn) {
  const profile = await getAdaptiveProfile(uid);
  if (!profile?.recommendations?.length) {
    // No adaptive data — return a balanced set
    return {
      questions: [],
      focusSkills: [],
      difficulty: "mixed",
      message: "No adaptive data yet. Complete some modules first!",
    };
  }

  const recs = profile.recommendations;
  const focusSkills = recs.slice(0, 3).map((r) => r.skill);

  // Allocate questions per recommendation
  const allocations = [];
  let remaining = totalQuestions;

  for (const rec of recs) {
    if (remaining <= 0) break;
    const count = Math.min(rec.questionCount, remaining);
    allocations.push({
      skill: rec.skill,
      domain: rec.domain,
      difficulty: rec.suggestedDifficulty,
      count,
    });
    remaining -= count;
  }

  // If we have remaining slots, add mixed review from strongest skills
  if (remaining > 0 && profile.skills) {
    const strongSkills = Object.entries(profile.skills)
      .filter(([_, s]) => s.mastery > 0.7)
      .sort((a, b) => b[1].mastery - a[1].mastery)
      .slice(0, 3);

    for (const [skillKey] of strongSkills) {
      if (remaining <= 0) break;
      const count = Math.min(2, remaining);
      allocations.push({
        skill: skillKey,
        domain: findDomainForSkill(skillKey, profile.domains) || "Unknown",
        difficulty: "C",
        count,
      });
      remaining -= count;
    }
  }

  // Fetch questions for each allocation
  let questions = [];
  if (getQuestionsFn) {
    for (const alloc of allocations) {
      const pool = await getQuestionsFn({
        course,
        skill: alloc.skill,
        difficulty: alloc.difficulty,
        limit: alloc.count * 2, // fetch extra for randomization
      });
      // Shuffle and take needed count
      const shuffled = pool.sort(() => Math.random() - 0.5);
      questions.push(...shuffled.slice(0, alloc.count));
    }
  }

  // Final shuffle so students don't see all same-skill questions in a row
  questions = questions.sort(() => Math.random() - 0.5);

  return {
    questions,
    focusSkills,
    difficulty: "adaptive",
    allocations,
    totalRequested: totalQuestions,
    totalFilled: questions.length,
  };
}

// ============================================================
// WEEKLY STATS & STREAKS
// ============================================================

/**
 * Calculate weekly statistics from recent answers.
 */
function calcWeeklyStats(allAnswers, domains, existingProfile) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const oneWeekMs = oneWeekAgo.getTime();

  const weekAnswers = allAnswers.filter((a) => {
    const ts = a.timestamp?.toDate?.()
      ? a.timestamp.toDate().getTime()
      : a.timestamp?.seconds
      ? a.timestamp.seconds * 1000
      : 0;
    return ts >= oneWeekMs;
  });

  const answersThisWeek = weekAnswers.length;
  const correctThisWeek = weekAnswers.filter((a) => a.correct).length;

  // Count unique sessions this week
  const sessionIds = new Set(weekAnswers.map((a) => a.sessionId).filter(Boolean));
  const sessionsThisWeek = sessionIds.size;

  // Dominant error category this week
  const errorCounts = countErrorPatterns(weekAnswers);
  const dominantErrorCategory =
    Object.entries(errorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Compare domain mastery to previous week (from existing profile)
  const prevDomains = existingProfile?.domains || {};
  const improvingDomains = [];
  const decliningDomains = [];

  for (const [dk, dd] of Object.entries(domains)) {
    const prevMastery = prevDomains[dk]?.mastery || 0;
    if (dd.mastery > prevMastery + 0.05) improvingDomains.push(dk);
    else if (dd.mastery < prevMastery - 0.05) decliningDomains.push(dk);
  }

  return {
    answersThisWeek,
    correctThisWeek,
    sessionsThisWeek,
    dominantErrorCategory,
    improvingDomains,
    decliningDomains,
  };
}

/**
 * Calculate current streak in days.
 */
function calcStreak(allAnswers) {
  if (!allAnswers.length) return 0;

  // Get unique active dates
  const dates = new Set();
  for (const ans of allAnswers) {
    const ts = ans.timestamp?.toDate?.()
      ? ans.timestamp.toDate()
      : ans.timestamp?.seconds
      ? new Date(ans.timestamp.seconds * 1000)
      : null;
    if (ts) {
      dates.add(ts.toISOString().split("T")[0]);
    }
  }

  const sortedDates = [...dates].sort().reverse();
  if (!sortedDates.length) return 0;

  // Check if today or yesterday is in the list (grace period)
  const today = todayISO();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().split("T")[0];

  if (sortedDates[0] !== today && sortedDates[0] !== yesterdayISO) {
    return 0; // streak broken
  }

  let streak = 1;
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = daysBetween(sortedDates[i + 1], sortedDates[i]);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ============================================================
// SKILL TAXONOMY LOOKUPS
// ============================================================

export const MATH_SKILLS = {
  Algebra: [
    "linear_equations",
    "linear_inequalities",
    "systems_of_equations",
    "linear_functions",
    "absolute_value",
  ],
  "Advanced Math": [
    "quadratic_equations",
    "quadratic_formula",
    "polynomial_operations",
    "exponential_functions",
    "radical_equations",
    "rational_expressions",
  ],
  "Problem Solving & Data": [
    "ratios_rates",
    "percentages",
    "unit_conversion",
    "scatterplots",
    "linear_regression",
    "probability",
    "statistics_central_tendency",
    "statistics_spread",
    "two_way_tables",
    "expected_value",
  ],
  "Geometry & Trig": [
    "area_perimeter",
    "volume",
    "triangles",
    "circles",
    "coordinate_geometry",
    "right_triangle_trig",
    "unit_circle",
  ],
};

export const RW_SKILLS = {
  "Information & Ideas": [
    "central_ideas",
    "details_evidence",
    "inferences",
    "quantitative_evidence",
    "text_structure",
  ],
  "Craft & Structure": [
    "vocabulary_in_context",
    "purpose_function",
    "cross_text_connections",
    "point_of_view",
  ],
  "Expression of Ideas": ["transitions", "rhetorical_synthesis", "organization"],
  "Standard English Conventions": [
    "subject_verb_agreement",
    "pronoun_clarity",
    "modifiers",
    "parallelism",
    "verb_tense",
    "punctuation_boundaries",
    "comma_usage",
    "colon_usage",
    "possessives",
  ],
};

/**
 * Get the human-readable label for a skill key.
 */
export function skillLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Find which domain a skill key belongs to.
 */
export function domainForSkill(skillKey) {
  for (const [domain, skills] of Object.entries({ ...MATH_SKILLS, ...RW_SKILLS })) {
    if (skills.includes(skillKey)) return domain;
  }
  return "Unknown";
}
