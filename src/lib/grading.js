// src/lib/grading.js
// Shared grading constants and helpers used across all grading components.

import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { createNotification } from "./notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "./gamification";

/**
 * Canonical grade-tier definitions used by every grading surface.
 * Each tier has a display label, a numeric value (0–1), an XP config key,
 * and colour / background tokens for consistent badge rendering.
 */
export const GRADE_TIERS = [
  { label: "Missing", value: 0, xpKey: "written_missing", color: "var(--text3)", bg: "var(--surface2)" },
  { label: "Emerging", value: 0.55, xpKey: "written_emerging", color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
  { label: "Approaching", value: 0.65, xpKey: "written_approaching", color: "var(--amber)", bg: "rgba(245,166,35,0.12)" },
  { label: "Developing", value: 0.85, xpKey: "written_developing", color: "var(--cyan)", bg: "rgba(34,211,238,0.12)" },
  { label: "Refining", value: 1.0, xpKey: "written_refining", color: "var(--green)", bg: "rgba(16,185,129,0.12)" },
];

/**
 * Persist a grade, award XP, and send a student notification in one call.
 *
 * @param {Object} params
 * @param {string} params.uid          – Student UID
 * @param {Object} params.tier         – One of the GRADE_TIERS entries
 * @param {string} params.activityType – e.g. "bias-detective", "prompt-duel"
 * @param {string} params.activityTitle – Human-readable title shown in notifications
 * @param {string} params.courseId     – Course the grade belongs to
 * @param {string} [params.lessonId]   – Optional lesson ID (for written responses)
 * @param {string} [params.blockId]    – Optional block ID (for written responses)
 * @param {string} [params.icon]       – Emoji icon for the notification
 * @param {string} [params.link]       – Optional deep-link for the notification
 * @param {Object} [params.extraData]  – Any additional fields to merge into the grade doc
 * @returns {Promise<{ xpAmount: number }>} The amount of XP awarded (0 if none)
 */
export async function saveGrade({
  uid,
  tier,
  activityType,
  activityTitle,
  courseId,
  lessonId,
  blockId,
  icon = "📝",
  link,
  extraData = {},
}) {
  // 1. Write the grade document
  const gradeRef = doc(
    db,
    "progress", uid,
    "courses", courseId,
    "activities", activityType,
  );

  await setDoc(gradeRef, {
    activityScore: tier.value,
    activityLabel: tier.label,
    activityType,
    activityTitle,
    gradedAt: new Date(),
    ...extraData,
  }, { merge: true });

  // 2. Award XP based on the tier's xpKey
  let xpAmount = 0;
  try {
    const config = await getXPConfig(courseId);
    xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
    if (xpAmount > 0) {
      await awardXP(uid, xpAmount, `activity_grade:${activityType}:${tier.label.toLowerCase()}`, courseId);
    }
  } catch (xpErr) {
    console.warn(`Could not award ${activityType} XP:`, xpErr);
  }

  // 3. Notify the student
  try {
    await createNotification(uid, {
      type: "grade_result",
      title: `${activityTitle} graded: ${tier.label}`,
      body: `Your ${activityTitle} received ${tier.label} (${Math.round(tier.value * 100)}%)${xpAmount > 0 ? ` — +${xpAmount} XP` : ""}`,
      icon,
      ...(link ? { link } : {}),
      courseId,
    });
  } catch {
    // Notification delivery is non-critical
  }

  return { xpAmount };
}
