// Reusable scaffold for PantherLearn scored, bilingual, persistent HTML tool embeds.
// Pure helpers are testable with Node; DOM/postMessage helpers run in the browser.

export function buildScorePayload(score, maxScore, gameComplete) {
  return {
    type: "activityScore",
    score: Math.max(0, score),
    maxScore,
    gameComplete: gameComplete !== false,
    completedAt: new Date().toISOString(),
  };
}

export function sendActivityScore(score, maxScore, gameComplete, target) {
  const t = target || (typeof window !== "undefined" ? window.parent : null);
  if (!t || maxScore <= 0) return;
  try { t.postMessage(buildScorePayload(score, maxScore, gameComplete), "*"); } catch (e) { /* no-op */ }
}
