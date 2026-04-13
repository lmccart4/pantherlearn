const params = new URLSearchParams(window.location.search);

export const studentId = params.get("studentId") || "anonymous";
export const courseId = params.get("courseId") || "";
export const blockId = params.get("blockId") || "";
export const lessonId = params.get("lessonId") || "";

export function reportScore(activityId, score, maxScore, meta = {}) {
  // gameComplete must be explicit — undefined is treated as complete by
  // EmbedBlock, but an explicit boolean is safer and gets audited correctly.
  // Per .claude/rules/scored-embed-checklist.md: interim saves use false,
  // final saves use true; EmbedBlock flips `submitted` on true.
  const { gameComplete = true, ...rest } = meta;
  const payload = {
    type: "activityScore",
    activityId,
    studentId,
    courseId,
    blockId,
    lessonId,
    score,
    maxScore,
    gameComplete,
    completedAt: new Date().toISOString(),
    ...rest,
  };
  if (window.parent !== window) {
    window.parent.postMessage(payload, "*");
  }
  console.log("[PantherLearn Bridge] Score reported:", payload);
  return payload;
}
