// src/lib/pantherlearn.js
// PantherLearn postMessage bridge for embedded activities.
// Reads URL params passed by PantherLearn's embed block,
// and sends score data back to the parent window on completion.

const params = new URLSearchParams(window.location.search);

export const studentId = params.get("studentId") || "anonymous";
export const courseId = params.get("courseId") || "";
export const blockId = params.get("blockId") || "";
export const lessonId = params.get("lessonId") || "";

/**
 * Send the final activity score back to PantherLearn.
 * PantherLearn's EmbedBlock listener picks this up and writes it to Firestore.
 *
 * @param {string} activityId — unique identifier for this activity
 * @param {number} score — student's score
 * @param {number} maxScore — maximum possible score
 * @param {Object} [meta] — optional extra data (breakdown, time, etc.)
 */
export function reportScore(activityId, score, maxScore, meta = {}) {
  const payload = {
    type: "activityScore",
    activityId,
    studentId,
    courseId,
    blockId,
    lessonId,
    score,
    maxScore,
    completedAt: new Date().toISOString(),
    ...meta,
  };

  // Send to parent (PantherLearn iframe host)
  if (window.parent !== window) {
    window.parent.postMessage(payload, "*");
  }

  console.log(`[PantherLearn Bridge] Score reported:`, payload);
  return payload;
}
