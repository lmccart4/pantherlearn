// src/lib/pantherlearn.js
// PantherLearn bridge for score reporting via postMessage.
// Reads URL params injected by PantherLearn's EmbedBlock iframe.

const params = new URLSearchParams(window.location.search);

export const studentId = params.get("studentId") || "anonymous";
export const courseId = params.get("courseId") || "";
export const blockId = params.get("blockId") || "";
export const lessonId = params.get("lessonId") || "";

/**
 * Send score back to PantherLearn parent window.
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
  if (window.parent !== window) {
    window.parent.postMessage(payload, "*");
  }
  console.log("[PantherLearn Bridge] Score reported:", payload);
  return payload;
}
