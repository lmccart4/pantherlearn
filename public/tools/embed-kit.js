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

export function makeStateSaver({ delay = 2500, send } = {}) {
  const doSend = send || ((msg) => { try { window.parent.postMessage(msg, "*"); } catch (e) {} });
  let timer = null;
  let pending = null;
  let hasPending = false;
  function fire() {
    timer = null;
    if (!hasPending) return;
    hasPending = false;
    const state = pending;
    pending = null;
    doSend({ type: "html-activity-state", state });
  }
  return {
    save(state) {
      pending = state; hasPending = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(fire, delay);
    },
    flush() {
      if (timer) { clearTimeout(timer); timer = null; }
      fire();
    },
  };
}

export function makeTranslator(dict, initialLang = "en") {
  const api = {
    lang: initialLang,
    setLang(l) { api.lang = l; },
    t(key) {
      const entry = dict[key];
      if (!entry) return key;
      return entry[api.lang] ?? entry.en ?? key;
    },
  };
  return api;
}
