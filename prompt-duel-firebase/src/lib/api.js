import { GEMINI_PROXY_URL } from "./firebase";

// ── Call the Cloud Function proxy ─────────────────────────────
async function callProxy(action, payload) {
  const resp = await fetch(GEMINI_PROXY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
    throw new Error(err.error || `Proxy error: ${resp.status}`);
  }

  const data = await resp.json();
  return data.text || "";
}

// ── Generate output from student's prompt ─────────────────────
export async function generateFromPrompt(studentPrompt, challenge) {
  return callProxy("generate", {
    studentPrompt,
    targetOutput: challenge.targetOutput,
    targetWordCount: challenge.targetOutput.split(" ").length,
  });
}

// ── Judge how close the output is to the target ───────────────
export async function judgeOutput(challenge, studentPrompt, aiOutput) {
  const raw = await callProxy("judge", {
    targetOutput: challenge.targetOutput,
    studentPrompt,
    aiOutput,
    bannedWords: challenge.bannedWords,
  });

  try {
    const jsonStr = raw.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(jsonStr);
    return {
      score: Math.max(1, Math.min(10, Math.round(parsed.score || 1))),
      feedback: parsed.feedback || "No feedback available.",
      matched: parsed.matched || [],
      missed: parsed.missed || [],
    };
  } catch (e) {
    console.warn("[Judge] Parse failed, raw:", raw);
    const scoreMatch = raw.match(/"score"\s*:\s*(\d+)/);
    return {
      score: scoreMatch ? Math.min(10, parseInt(scoreMatch[1])) : 5,
      feedback: "Scoring completed but detailed feedback unavailable.",
      matched: [],
      missed: [],
    };
  }
}

// ── Test connection to Cloud Function ─────────────────────────
export async function testConnection() {
  try {
    const result = await callProxy("generate", {
      studentPrompt: "Say OK",
      targetOutput: "OK",
      targetWordCount: 1,
    });
    return { ok: result.length > 0 };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ── Banned word enforcement ───────────────────────────────────
export function findBannedWords(text, banned) {
  const lower = text.toLowerCase();
  return banned.filter((word) => {
    const re = new RegExp(
      `\\b${word.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "i"
    );
    return re.test(lower);
  });
}

// ── Utilities ─────────────────────────────────────────────────
export function getDifficultyColor(d) {
  switch (d) {
    case "easy": return "#22c55e";
    case "medium": return "#f59e0b";
    case "hard": return "#ef4444";
    case "expert": return "#a855f7";
    case "legendary": return "#ec4899";
    default: return "#94a3b8";
  }
}

export function xpToLevel(xp) {
  const t = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7500, 10000];
  let level = 1;
  for (let i = 1; i < t.length; i++) {
    if (xp >= t[i]) level = i + 1;
    else break;
  }
  const cur = t[Math.min(level - 1, t.length - 1)];
  const nxt = t[Math.min(level, t.length - 1)];
  return { level, progress: nxt > cur ? ((xp - cur) / (nxt - cur)) * 100 : 100 };
}
