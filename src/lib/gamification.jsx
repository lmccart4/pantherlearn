// src/lib/gamification.jsx
// UPDATED: 35-level polynomial rank system with teacher-configurable perks.
// XP curve: base × level^1.5 — early levels come fast, later ones require sustained effort.
// Preserves all existing badge, streak, and XP functionality.

import { doc, getDoc, setDoc, collection, getDocs, query, where, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// ─── Default XP Values (used when no course-specific config exists) ───
export const DEFAULT_XP_VALUES = {
  mc_correct: 20,
  mc_incorrect: 5,
  short_answer: 15,
  chat_message: 5,
  lesson_complete: 50,
  perfect_lesson: 100,
  streak_bonus: 25,
};

// ─── Default Behavior Rewards ───
export const DEFAULT_BEHAVIOR_REWARDS = [
  { id: "participation", label: "Brave Participation", xp: 10, icon: "🙋" },
  { id: "helping_peer", label: "Helped a Peer", xp: 15, icon: "🤝" },
  { id: "great_question", label: "Great Question", xp: 10, icon: "💡" },
  { id: "teamwork", label: "Outstanding Teamwork", xp: 15, icon: "⭐" },
  { id: "on_task", label: "Stayed On Task", xp: 5, icon: "🎯" },
];

// ─── Default Multiplier Config ───
export const DEFAULT_MULTIPLIER_CONFIG = {
  streakMultipliers: {
    5: 1.25,
    10: 1.5,
    20: 1.75,
    30: 2.0,
  },
  qualityMultipliers: {
    satisfactory: 1.0,
    proficient: 1.25,
    exemplary: 1.5,
  },
};

// ─── 35-Level Rank System ───
// XP curve: BASE_XP × level^1.5 (polynomial growth)
// Level 1 = 0 XP, Level 2 = 50 XP, Level 5 ≈ 559 XP, Level 10 ≈ 1,581 XP,
// Level 20 ≈ 4,472 XP, Level 35 ≈ 10,352 XP
const BASE_XP = 50;

function calculateXPForLevel(level) {
  if (level <= 1) return 0;
  return Math.round(BASE_XP * Math.pow(level, 1.5));
}

// Rank tier names — every 5 levels is a new tier
const RANK_TIERS = [
  { tier: 1, minLevel: 1,  maxLevel: 5,  name: "Novice",             color: "#8B9DAF", icon: "🐾" },
  { tier: 2, minLevel: 6,  maxLevel: 10, name: "Apprentice",         color: "#2ecc71", icon: "🌿" },
  { tier: 3, minLevel: 11, maxLevel: 15, name: "Adept",              color: "#3498db", icon: "💎" },
  { tier: 4, minLevel: 16, maxLevel: 20, name: "Veteran",            color: "#9b59b6", icon: "🔮" },
  { tier: 5, minLevel: 21, maxLevel: 25, name: "Champion",           color: "#e67e22", icon: "🏆" },
  { tier: 6, minLevel: 26, maxLevel: 30, name: "Legend",             color: "#e74c3c", icon: "🔥" },
  { tier: 7, minLevel: 31, maxLevel: 34, name: "Mythic",             color: "#a855f7", icon: "⚡" },
  { tier: 8, minLevel: 35, maxLevel: 35, name: "Panther Ascendant",  color: "#f1c40f", icon: "👑" },
];

// Generate the full 35-level array
export const LEVELS = Array.from({ length: 35 }, (_, i) => {
  const level = i + 1;
  const tier = RANK_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel);
  return {
    level,
    xpRequired: calculateXPForLevel(level),
    name: `${tier.name} ${level - tier.minLevel + 1}`,  // e.g. "Apprentice 1", "Journeyman 3"
    tierName: tier.name,
    tierIcon: tier.icon,
    tierColor: tier.color,
    tier: tier.tier,
  };
});

export { RANK_TIERS };

// Alias for backward compatibility with XPControls.jsx
export const DEFAULT_LEVEL_THRESHOLDS = LEVELS;

// ─── Perk Definitions ───
// Default perks unlocked at tier milestones (every 5 levels).
// Teachers can enable/disable and customize these per course.
export const DEFAULT_PERKS = [
  {
    id: "seating_choice",
    unlockLevel: 5,
    tier: 1,
    icon: "💺",
    name: "Seating Choice",
    description: "Choose your seat for the week",
    type: "passive",        // passive = always active once unlocked
    usesPerSemester: null,  // null = unlimited
    category: "comfort",
  },
  {
    id: "background_music",
    unlockLevel: 10,
    tier: 2,
    icon: "🎵",
    name: "DJ Privileges",
    description: "Pick background music during independent work",
    type: "passive",
    usesPerSemester: null,
    category: "comfort",
  },
  {
    id: "early_dismissal",
    unlockLevel: 15,
    tier: 3,
    icon: "🚪",
    name: "Early Dismissal Pass",
    description: "Leave class 2 minutes early",
    type: "consumable",     // consumable = limited uses, tracked
    usesPerSemester: 1,
    category: "privilege",
  },
  {
    id: "design_question",
    unlockLevel: 20,
    tier: 4,
    icon: "✏️",
    name: "Question Designer",
    description: "Design a quiz question for the class",
    type: "consumable",
    usesPerSemester: 2,
    category: "academic",
  },
  {
    id: "homework_pass",
    unlockLevel: 25,
    tier: 5,
    icon: "🎟️",
    name: "Homework Pass",
    description: "Skip one homework assignment",
    type: "consumable",
    usesPerSemester: 1,
    category: "academic",
  },
  {
    id: "bonus_xp_aura",
    unlockLevel: 30,
    tier: 6,
    icon: "✨",
    name: "XP Aura",
    description: "Earn 10% bonus XP on all activities for a week",
    type: "consumable",
    usesPerSemester: 2,
    category: "progression",
  },
  {
    id: "mentor_status",
    unlockLevel: 35,
    tier: 7,
    icon: "👑",
    name: "Mentor Status",
    description: "Help design next unit's activities & earn bonus XP for helping peers",
    type: "passive",
    usesPerSemester: null,
    category: "leadership",
  },
];

// ─── Badge Definitions ───
export const BADGES = [
  { id: "first_lesson", icon: "📘", name: "First Steps", description: "Complete your first lesson", rarity: "common", hidden: false, check: (g) => (g.lessonsCompleted || 0) >= 1 },
  { id: "five_lessons", icon: "📚", name: "Bookworm", description: "Complete 5 lessons", rarity: "common", hidden: false, check: (g) => (g.lessonsCompleted || 0) >= 5 },
  { id: "ten_lessons", icon: "🎓", name: "Scholar", description: "Complete 10 lessons", rarity: "uncommon", hidden: false, check: (g) => (g.lessonsCompleted || 0) >= 10 },
  { id: "perfect_score", icon: "💯", name: "Perfectionist", description: "Get 100% on any lesson", rarity: "uncommon", hidden: false, check: (g) => g.hasPerfectLesson === true },
  { id: "three_streak", icon: "🔥", name: "On Fire", description: "Reach a 3-day streak", rarity: "common", hidden: false, check: (g) => (g.currentStreak || 0) >= 3 },
  { id: "seven_streak", icon: "⚡", name: "Unstoppable", description: "Reach a 7-day streak", rarity: "uncommon", hidden: false, check: (g) => (g.currentStreak || 0) >= 7 },
  { id: "thirty_streak", icon: "👑", name: "Streak Royalty", description: "Reach a 30-day streak", rarity: "legendary", hidden: false, check: (g) => (g.currentStreak || 0) >= 30 },
  { id: "fifty_questions", icon: "✅", name: "Quiz Machine", description: "Answer 50 questions", rarity: "common", hidden: false, check: (g) => (g.totalAnswered || 0) >= 50 },
  { id: "hundred_questions", icon: "🏆", name: "Centurion", description: "Answer 100 questions", rarity: "uncommon", hidden: false, check: (g) => (g.totalAnswered || 0) >= 100 },
  { id: "five_hundred_questions", icon: "🐾", name: "Panther Power", description: "Answer 500 questions", rarity: "rare", hidden: false, check: (g) => (g.totalAnswered || 0) >= 500 },
  // Level-based badges updated for new system
  { id: "level_five", icon: "⬆️", name: "Rising Star", description: "Reach Level 5", rarity: "uncommon", hidden: false, check: (g) => getLevelInfo(g.totalXP || 0).current.level >= 5 },
  { id: "level_ten", icon: "🌿", name: "Journeyman", description: "Reach Level 10", rarity: "rare", hidden: false, check: (g) => getLevelInfo(g.totalXP || 0).current.level >= 10 },
  { id: "level_twenty", icon: "🔮", name: "Veteran", description: "Reach Level 20", rarity: "epic", hidden: false, check: (g) => getLevelInfo(g.totalXP || 0).current.level >= 20 },
  { id: "level_thirty_five", icon: "👑", name: "Panther Elite", description: "Reach Level 35 — the pinnacle", rarity: "legendary", hidden: false, check: (g) => getLevelInfo(g.totalXP || 0).current.level >= 35 },
  // Hidden badges
  { id: "night_owl", icon: "🦉", name: "Night Owl", description: "Complete a lesson after 9 PM", rarity: "rare", hidden: true, check: (g) => g.hasNightOwl === true },
  { id: "early_bird", icon: "🐦", name: "Early Bird", description: "Complete a lesson before 7 AM", rarity: "rare", hidden: true, check: (g) => g.hasEarlyBird === true },
  { id: "speed_demon", icon: "⚡", name: "Speed Demon", description: "Answer 10 questions correctly in under 2 minutes", rarity: "epic", hidden: true, check: (g) => g.hasSpeedDemon === true },
];

// ─── Rarity Colors ───
export const RARITY_COLORS = {
  common: { bg: "#3a3a4a", border: "#555", label: "Common" },
  uncommon: { bg: "#1a3a2a", border: "#2ecc71", label: "Uncommon" },
  rare: { bg: "#1a2a4a", border: "#3498db", label: "Rare" },
  epic: { bg: "#2a1a4a", border: "#9b59b6", label: "Epic" },
  legendary: { bg: "#3a2a1a", border: "#f39c12", label: "Legendary" },
};

// ─── Level Helpers ───
export function getLevelInfo(totalXP) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
      break;
    }
  }
  const xpInLevel = totalXP - current.xpRequired;
  const xpForNext = next ? next.xpRequired - current.xpRequired : 0;
  const progress = next && xpForNext > 0 ? Math.min(xpInLevel / xpForNext, 1) : 1;
  return {
    current,
    next,
    // Flat aliases so Dashboard can use level.level, level.tierName, etc.
    level: current.level,
    tierName: current.tierName,
    tierIcon: current.tierIcon,
    tierColor: current.tierColor,
    xpIntoLevel: xpInLevel,
    xpInLevel,
    xpForNext,
    progress,   // 0–1 ratio (Dashboard does progress * 100 for the bar width)
  };
}

// Get the rank tier info for a given level
export function getRankTier(level) {
  return RANK_TIERS.find(t => level >= t.minLevel && level <= t.maxLevel) || RANK_TIERS[0];
}

// Get next tier milestone from current level
export function getNextTierMilestone(level) {
  const currentTier = getRankTier(level);
  const nextTier = RANK_TIERS.find(t => t.tier === currentTier.tier + 1);
  if (!nextTier) return null;
  return {
    level: nextTier.minLevel,
    tierName: nextTier.name,
    xpRequired: calculateXPForLevel(nextTier.minLevel),
  };
}

// ─── Perk Helpers ───

// Get all perks a student has unlocked at their current level
export function getUnlockedPerks(level, coursePerks = null) {
  const perks = coursePerks || DEFAULT_PERKS;
  return perks.filter(p => p.enabled !== false && level >= p.unlockLevel);
}

// Get the next perk the student will unlock
export function getNextPerk(level, coursePerks = null) {
  const perks = coursePerks || DEFAULT_PERKS;
  return perks
    .filter(p => p.enabled !== false && level < p.unlockLevel)
    .sort((a, b) => a.unlockLevel - b.unlockLevel)[0] || null;
}

// Check if a student can use a consumable perk
export function canUsePerk(perkId, studentPerkUsage = {}, coursePerks = null) {
  const perks = coursePerks || DEFAULT_PERKS;
  const perk = perks.find(p => p.id === perkId);
  if (!perk || perk.type !== "consumable") return false;
  const used = studentPerkUsage[perkId] || 0;
  return used < (perk.usesPerSemester || 0);
}

// Record perk usage for a student
export async function usePerk(uid, perkId, courseId) {
  const ref = courseId
    ? doc(db, "courses", courseId, "gamification", uid)
    : doc(db, "gamification", uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};
  const perkUsage = data.perkUsage || {};
  const courseUsage = perkUsage[courseId] || {};
  courseUsage[perkId] = (courseUsage[perkId] || 0) + 1;
  perkUsage[courseId] = courseUsage;
  await updateDoc(ref, { perkUsage });
  return courseUsage[perkId];
}

// ─── Teacher Perk Configuration ───

// Load teacher's perk config for a course (which perks are enabled, custom perks, etc.)
export async function loadCoursePerks(courseId) {
  try {
    const ref = doc(db, "courses", courseId, "settings", "perks");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return snap.data().perks || DEFAULT_PERKS;
    }
    return DEFAULT_PERKS;
  } catch (err) {
    console.error("Error loading course perks:", err);
    return DEFAULT_PERKS;
  }
}

// Save teacher's perk config for a course
export async function saveCoursePerks(courseId, perks) {
  try {
    const ref = doc(db, "courses", courseId, "settings", "perks");
    await setDoc(ref, { perks, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (err) {
    console.error("Error saving course perks:", err);
    return false;
  }
}

// ─── Perk Redemption Requests ───
// Students request to use consumable perks; teachers approve/deny

export async function requestPerkRedemption(uid, perkId, courseId, studentName) {
  try {
    const ref = doc(collection(db, "courses", courseId, "perkRequests"));
    await setDoc(ref, {
      uid,
      perkId,
      studentName,
      status: "pending",  // pending | approved | denied
      requestedAt: new Date(),
    });
    return true;
  } catch (err) {
    console.error("Error requesting perk:", err);
    return false;
  }
}

export async function approvePerkRedemption(courseId, requestId, uid, perkId) {
  try {
    // Update request status
    const reqRef = doc(db, "courses", courseId, "perkRequests", requestId);
    await updateDoc(reqRef, { status: "approved", resolvedAt: new Date() });
    // Deduct usage
    await usePerk(uid, perkId, courseId);
    return true;
  } catch (err) {
    console.error("Error approving perk:", err);
    return false;
  }
}

export async function denyPerkRedemption(courseId, requestId) {
  try {
    const reqRef = doc(db, "courses", courseId, "perkRequests", requestId);
    await updateDoc(reqRef, { status: "denied", resolvedAt: new Date() });
    return true;
  } catch (err) {
    console.error("Error denying perk:", err);
    return false;
  }
}

// ─── XP Config Helpers ───

export async function loadXPConfig(courseId) {
  const defaults = {
    xpValues: DEFAULT_XP_VALUES,
    behaviorRewards: DEFAULT_BEHAVIOR_REWARDS,
    multiplierConfig: DEFAULT_MULTIPLIER_CONFIG,
    levelThresholds: DEFAULT_LEVEL_THRESHOLDS,
    activeMultiplier: null,
  };
  try {
    const ref = doc(db, "courses", courseId, "settings", "xpConfig");
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return {
        xpValues: data.xpValues || defaults.xpValues,
        behaviorRewards: data.behaviorRewards || defaults.behaviorRewards,
        multiplierConfig: data.multiplierConfig || defaults.multiplierConfig,
        levelThresholds: data.levelThresholds || defaults.levelThresholds,
        activeMultiplier: data.activeMultiplier || defaults.activeMultiplier,
      };
    }
    return defaults;
  } catch (err) {
    console.error("Error loading XP config:", err);
    return defaults;
  }
}

export async function saveXPConfig(courseId, config) {
  try {
    const ref = doc(db, "courses", courseId, "settings", "xpConfig");
    await setDoc(ref, { ...config, updatedAt: new Date() }, { merge: true });
    return true;
  } catch (err) {
    console.error("Error saving XP config:", err);
    return false;
  }
}

// ─── Streak Calculation ───
// Weekends (Sat/Sun) don't count — they never break a streak and aren't required.
// A streak is consecutive weekdays (Mon–Fri) with activity.
export function calculateStreak(activityDates) {
  if (!activityDates || activityDates.length === 0) return 0;

  const dates = activityDates
    .map((d) => {
      const date = d instanceof Date ? d : d?.toDate?.() ? d.toDate() : new Date(d);
      return isNaN(date.getTime()) ? null : date;
    })
    .filter(Boolean)
    .sort((a, b) => b - a);

  if (dates.length === 0) return 0;

  const toDateStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const isWeekend = (d) => { const day = new Date(d).getDay(); return day === 0 || day === 6; };

  // Get unique activity days (excluding weekends — they don't count toward streak)
  const uniqueDays = [...new Set(dates.map(toDateStr))]
    .filter((d) => !isWeekend(d))
    .sort()
    .reverse();

  if (uniqueDays.length === 0) return 0;

  // Find the most recent weekday (today or the last weekday if today is a weekend)
  const now = new Date();
  let checkDate = new Date(now);
  // If it's a weekend, roll back to Friday — weekends can't break streaks
  while (isWeekend(toDateStr(checkDate))) {
    checkDate = new Date(checkDate.getTime() - 86400000);
  }

  const today = toDateStr(checkDate);
  const prevWeekday = getPreviousWeekday(today);

  // Streak is alive if most recent activity was today or the previous weekday
  if (uniqueDays[0] !== today && uniqueDays[0] !== prevWeekday) return 0;

  // Count consecutive weekdays with activity
  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const expected = getPreviousWeekday(uniqueDays[i - 1]);
    if (uniqueDays[i] === expected) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Helper: get the previous weekday (skipping Sat/Sun) from a date string
function getPreviousWeekday(dateStr) {
  let d = new Date(dateStr);
  do {
    d = new Date(d.getTime() - 86400000);
  } while (d.getDay() === 0 || d.getDay() === 6);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Award XP ───
export async function awardXP(uid, amount, source, courseId) {
  try {
    const ref = courseId
      ? doc(db, "courses", courseId, "gamification", uid)
      : doc(db, "gamification", uid);
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : { totalXP: 0 };

    // Check for active multiplier
    let multiplier = 1;
    if (courseId) {
      const courseRef = doc(db, "courses", courseId);
      const courseSnap = await getDoc(courseRef);
      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        if (courseData.xpMultiplier && courseData.xpMultiplierExpires) {
          const expires = courseData.xpMultiplierExpires?.toDate?.() || new Date(courseData.xpMultiplierExpires);
          if (expires > new Date()) {
            multiplier = courseData.xpMultiplier;
          }
        }
      }
    }

    const finalAmount = Math.round(amount * multiplier);
    const newTotal = (data.totalXP || 0) + finalAmount;

    // Track activity date for streaks (deduplicated per day)
    const today = new Date().toISOString().slice(0, 10);
    const existingDates = data.activityDates || [];
    const isNewDay = !existingDates.includes(today);
    const updatedDates = isNewDay ? [...existingDates, today] : existingDates;

    // Recalculate streak from activity dates
    const currentStreak = calculateStreak(updatedDates);
    const longestStreak = Math.max(currentStreak, data.longestStreak || 0);

    // Award streak freezes: +1 for every 7-day streak milestone, max 3
    let streakFreezes = data.streakFreezes || 0;
    if (isNewDay && currentStreak > 0 && currentStreak % 7 === 0 && streakFreezes < 3) {
      streakFreezes = Math.min(streakFreezes + 1, 3);
    }

    await setDoc(ref, {
      ...data,
      totalXP: newTotal,
      lastXPSource: source,
      lastXPAmount: finalAmount,
      lastXPAt: new Date(),
      activityDates: updatedDates,
      currentStreak,
      longestStreak,
      streakFreezes,
    }, { merge: true });

    return { newTotal, awarded: finalAmount, multiplier, currentStreak };
  } catch (err) {
    console.error("Error awarding XP:", err);
    return null;
  }
}

// ─── Multiplier Events — teachers can trigger Double/Triple XP events ───
export async function setActiveMultiplier(courseId, multiplier, durationMinutes, label) {
  const ref = doc(db, "courses", courseId, "settings", "xpConfig");
  const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);
  await setDoc(ref, {
    activeMultiplier: {
      value: multiplier,
      label: label || `${multiplier}x XP`,
      expiresAt,
      startedAt: new Date(),
    },
  }, { merge: true });
}

export async function clearActiveMultiplier(courseId) {
  const ref = doc(db, "courses", courseId, "settings", "xpConfig");
  await setDoc(ref, { activeMultiplier: null }, { merge: true });
}

// ─── Calculate effective XP with all multipliers ───
export function calculateEffectiveXP(baseXP, config, currentStreak = 0) {
  let multiplier = 1.0;

  // Streak multiplier
  if (config?.multiplierConfig?.streakMultipliers) {
    const thresholds = Object.keys(config.multiplierConfig.streakMultipliers)
      .map(Number)
      .sort((a, b) => b - a);
    for (const threshold of thresholds) {
      if (currentStreak >= threshold) {
        multiplier *= config.multiplierConfig.streakMultipliers[threshold];
        break;
      }
    }
  }

  // Active event multiplier (Double XP day, etc.)
  if (config?.activeMultiplier) {
    const expires = config.activeMultiplier.expiresAt?.toDate?.()
      ? config.activeMultiplier.expiresAt.toDate()
      : new Date(config.activeMultiplier.expiresAt);
    if (expires > new Date()) {
      multiplier *= config.activeMultiplier.value;
    }
  }

  return Math.round(baseXP * multiplier);
}

// ─── Update Student Gamification Data ───
export async function updateStudentGamification(uid, updates, courseId) {
  const ref = courseId
    ? doc(db, "courses", courseId, "gamification", uid)
    : doc(db, "gamification", uid);
  const current = await getStudentGamification(uid, courseId);
  const merged = { ...current, ...updates };

  // Recalculate streak
  merged.currentStreak = calculateStreak(merged.activityDates);
  merged.longestStreak = Math.max(merged.currentStreak, current.longestStreak || 0);

  // Check badges
  const newBadges = [];
  const earnedBadges = BADGES.filter((b) => b.check(merged)).map((b) => {
    if (!(current.badges || []).includes(b.id)) newBadges.push(b);
    return b.id;
  });
  merged.badges = earnedBadges;

  await setDoc(ref, { ...merged, lastUpdated: new Date() }, { merge: true });
  return { gamification: merged, newBadges };
}

// ─── Get Student Gamification Data ───
export async function getStudentGamification(uid, courseId) {
  try {
    const ref = courseId
      ? doc(db, "courses", courseId, "gamification", uid)
      : doc(db, "gamification", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
    return { totalXP: 0, totalAnswered: 0, totalCorrect: 0, currentStreak: 0, longestStreak: 0, badges: [], streakFreezes: 0, perkUsage: {}, activityDates: [], lessonsCompleted: 0 };
  } catch (err) {
    console.error("Error loading gamification data:", err);
    return { totalXP: 0, totalAnswered: 0, totalCorrect: 0, currentStreak: 0, longestStreak: 0, badges: [], streakFreezes: 0, perkUsage: {}, activityDates: [], lessonsCompleted: 0 };
  }
}

// ─── Get XP Config (alias for loadXPConfig, used by Dashboard) ───
export async function getXPConfig(courseId) {
  return loadXPConfig(courseId);
}

// ─── Award Behavior XP (from teacher roster) ───
export async function awardBehaviorXP(uid, behaviorReward, courseId) {
  return awardXP(uid, behaviorReward.xp, `behavior:${behaviorReward.id}`, courseId);
}

// ─── Leaderboard ───
export async function getLeaderboard(courseId, limit = 50) {
  try {
    const ref = courseId
      ? collection(db, "courses", courseId, "gamification")
      : collection(db, "gamification");
    const snap = await getDocs(ref);

    // Get user docs to check roles
    const usersSnap = await getDocs(collection(db, "users"));
    const usersMap = {};
    usersSnap.forEach((d) => { usersMap[d.id] = d.data(); });

    const entries = [];
    snap.forEach((d) => {
      const data = d.data();
      const uid = d.id;
      const userData = usersMap[uid];

      // Exclude teachers
      if (userData?.role === "teacher") return;

      entries.push({
        uid,
        ...data,
        // Merge user doc fields for display
        displayName: data.displayName || userData?.displayName || userData?.name || null,
        nickname: data.nickname || userData?.nickname || null,
        photoURL: data.photoURL || userData?.photoURL || null,
      });
    });

    entries.sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));
    return entries.slice(0, limit);
  } catch (err) {
    console.error("Error loading leaderboard:", err);
    return [];
  }
}
