// src/lib/guessWhoAI.js
// Heuristic AI opponent for Guess Who — trait-based, zero API cost.
// Only works with DEFAULT_CHARACTERS (40 faces). Custom character sets are not supported.

export const AI_BOT_UID = "ai-bot";
export const AI_BOT_NAME = "AI Opponent";

// ─── Character Traits (tagged from visual inspection of all 40 faces) ───

const CHARACTER_TRAITS = {
  c00: { gender: "male",   ageGroup: "older",  hairLength: "short",  hairColor: "white", hairTexture: "straight", facialHair: true,  facialTattoos: false, bodyTattoos: false },
  c01: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c02: { gender: "female", ageGroup: "middle", hairLength: "short",  hairColor: "black", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c03: { gender: "male",   ageGroup: "young",  hairLength: "medium", hairColor: "brown", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c04: { gender: "male",   ageGroup: "middle", hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: true,  bodyTattoos: false },
  c05: { gender: "female", ageGroup: "young",  hairLength: "medium", hairColor: "brown", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c06: { gender: "male",   ageGroup: "young",  hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c07: { gender: "male",   ageGroup: "middle", hairLength: "short",  hairColor: "gray",  hairTexture: "straight", facialHair: true,  facialTattoos: false, bodyTattoos: false },
  c08: { gender: "male",   ageGroup: "young",  hairLength: "short",  hairColor: "black", hairTexture: "curly",    facialHair: false, facialTattoos: false, bodyTattoos: false },
  c09: { gender: "female", ageGroup: "young",  hairLength: "medium", hairColor: "brown", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c10: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "brown", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: true  },
  c11: { gender: "male",   ageGroup: "young",  hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c12: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c13: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "red",   hairTexture: "curly",    facialHair: false, facialTattoos: false, bodyTattoos: false },
  c14: { gender: "female", ageGroup: "young",  hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c15: { gender: "male",   ageGroup: "older",  hairLength: "bald",   hairColor: "gray",  hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c16: { gender: "female", ageGroup: "older",  hairLength: "medium", hairColor: "gray",  hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c17: { gender: "female", ageGroup: "older",  hairLength: "short",  hairColor: "gray",  hairTexture: "curly",    facialHair: false, facialTattoos: false, bodyTattoos: false },
  c18: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "brown", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c19: { gender: "male",   ageGroup: "middle", hairLength: "short",  hairColor: "black", hairTexture: "curly",    facialHair: true,  facialTattoos: true,  bodyTattoos: false },
  c20: { gender: "male",   ageGroup: "young",  hairLength: "medium", hairColor: "brown", hairTexture: "curly",    facialHair: true,  facialTattoos: false, bodyTattoos: false },
  c21: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c22: { gender: "female", ageGroup: "young",  hairLength: "medium", hairColor: "black", hairTexture: "curly",    facialHair: false, facialTattoos: false, bodyTattoos: false },
  c23: { gender: "male",   ageGroup: "young",  hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: true,  facialTattoos: false, bodyTattoos: false },
  c24: { gender: "female", ageGroup: "older",  hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c25: { gender: "female", ageGroup: "young",  hairLength: "short",  hairColor: "black", hairTexture: "curly",    facialHair: false, facialTattoos: false, bodyTattoos: false },
  c26: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "black", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c27: { gender: "male",   ageGroup: "middle", hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: true,  bodyTattoos: false },
  c28: { gender: "male",   ageGroup: "older",  hairLength: "short",  hairColor: "black", hairTexture: "curly",    facialHair: true,  facialTattoos: true,  bodyTattoos: false },
  c29: { gender: "female", ageGroup: "older",  hairLength: "short",  hairColor: "gray",  hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c30: { gender: "male",   ageGroup: "middle", hairLength: "short",  hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c31: { gender: "male",   ageGroup: "young",  hairLength: "short",  hairColor: "black", hairTexture: "curly",    facialHair: true,  facialTattoos: false, bodyTattoos: false },
  c32: { gender: "female", ageGroup: "middle", hairLength: "medium", hairColor: "black", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c33: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "brown", hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c34: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "black", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c35: { gender: "female", ageGroup: "young",  hairLength: "long",   hairColor: "blonde",hairTexture: "wavy",     facialHair: false, facialTattoos: true,  bodyTattoos: false },
  c36: { gender: "female", ageGroup: "older",  hairLength: "short",  hairColor: "gray",  hairTexture: "wavy",     facialHair: false, facialTattoos: false, bodyTattoos: false },
  c37: { gender: "male",   ageGroup: "middle", hairLength: "long",   hairColor: "black", hairTexture: "curly",    facialHair: true,  facialTattoos: false, bodyTattoos: false },
  c38: { gender: "female", ageGroup: "older",  hairLength: "short",  hairColor: "white", hairTexture: "straight", facialHair: false, facialTattoos: false, bodyTattoos: false },
  c39: { gender: "male",   ageGroup: "young",  hairLength: "medium", hairColor: "brown", hairTexture: "curly",    facialHair: false, facialTattoos: false, bodyTattoos: false },
};

// ─── Trait lookup ───

function getTraits(characterId) {
  return CHARACTER_TRAITS[characterId] || null;
}

// ─── Answer a question from the human ───
// Parses the question text against the bot's secret character traits.
// Returns "yes" or "no".

export function answerFromTraits(secretId, questionText) {
  const traits = getTraits(secretId);
  if (!traits) return Math.random() < 0.5 ? "yes" : "no";

  const q = questionText.toLowerCase();

  // Gender
  if (/\b(male|man|boy|guy|he)\b/.test(q)) return traits.gender === "male" ? "yes" : "no";
  if (/\b(female|woman|girl|gal|she)\b/.test(q)) return traits.gender === "female" ? "yes" : "no";

  // Age
  if (/\b(old|older|elderly|senior)\b/.test(q)) return traits.ageGroup === "older" ? "yes" : "no";
  if (/\b(young|youth)\b/.test(q)) return traits.ageGroup === "young" ? "yes" : "no";
  if (/\b(middle.?aged?)\b/.test(q)) return traits.ageGroup === "middle" ? "yes" : "no";

  // Facial hair (check before generic "hair" patterns)
  if (/\b(facial hair|beard|goatee|mustache|stubble)\b/.test(q)) return traits.facialHair ? "yes" : "no";

  // Tattoos — check "face" context first
  if (/\btattoo/.test(q) && /\bface\b|\bfacial\b/.test(q)) return traits.facialTattoos ? "yes" : "no";
  if (/\btattoo/.test(q)) return (traits.facialTattoos || traits.bodyTattoos) ? "yes" : "no";

  // Bald
  if (/\b(bald|balding|no hair)\b/.test(q)) return traits.hairLength === "bald" ? "yes" : "no";

  // Hair length
  if (/\blong hair\b|\bhair.{0,6}long\b/.test(q)) return traits.hairLength === "long" ? "yes" : "no";
  if (/\bshort hair\b|\bhair.{0,6}short\b/.test(q)) return traits.hairLength === "short" || traits.hairLength === "bald" ? "yes" : "no";
  if (/\bmedium.{0,6}hair\b|\bhair.{0,6}medium\b/.test(q)) return traits.hairLength === "medium" ? "yes" : "no";

  // Hair texture
  if (/\bcurly\b/.test(q)) return traits.hairTexture === "curly" ? "yes" : "no";
  if (/\bwavy\b/.test(q)) return traits.hairTexture === "wavy" ? "yes" : "no";
  if (/\bstraight hair\b|\bhair.{0,6}straight\b/.test(q)) return traits.hairTexture === "straight" ? "yes" : "no";

  // Hair color — check multi-word patterns first
  if (/\bred hair\b|\bredhead\b|\bginger\b|\bhair.{0,6}red\b/.test(q)) return traits.hairColor === "red" ? "yes" : "no";
  if (/\bblond|blonde\b/.test(q)) return traits.hairColor === "blonde" ? "yes" : "no";
  if (/\bgr[ae]y hair\b|\bhair.{0,6}gr[ae]y\b|\bwhite hair\b|\bhair.{0,6}white\b|\bgr[ae]y.{0,3}white\b/.test(q)) {
    return (traits.hairColor === "gray" || traits.hairColor === "white") ? "yes" : "no";
  }
  if (/\bblack hair\b|\bhair.{0,6}black\b|\bdark hair\b|\bhair.{0,6}dark\b/.test(q)) return traits.hairColor === "black" ? "yes" : "no";
  if (/\bbrown hair\b|\bhair.{0,6}brown\b/.test(q)) return traits.hairColor === "brown" ? "yes" : "no";

  // Glasses (none currently have them, but handle the question)
  if (/\bglasses\b|\bspectacles\b/.test(q)) return "no";

  // Couldn't parse — random answer
  return Math.random() < 0.5 ? "yes" : "no";
}

// ─── Bot question selection ───
// Each question is a { text, traitKey, traitTest } where traitTest(traitValue) → boolean

const QUESTION_POOL = [
  { text: "Is your person male?",                       traitKey: "gender",        traitTest: v => v === "male" },
  { text: "Is your person female?",                     traitKey: "gender",        traitTest: v => v === "female" },
  { text: "Does your person look older?",               traitKey: "ageGroup",      traitTest: v => v === "older" },
  { text: "Is your person young?",                      traitKey: "ageGroup",      traitTest: v => v === "young" },
  { text: "Does your person have facial hair?",         traitKey: "facialHair",    traitTest: v => v === true },
  { text: "Does your person have tattoos on their face?", traitKey: "facialTattoos", traitTest: v => v === true },
  { text: "Does your person have any visible tattoos?", traitKey: "_anyTattoos",   traitTest: (_, t) => t.facialTattoos || t.bodyTattoos },
  { text: "Does your person have long hair?",           traitKey: "hairLength",    traitTest: v => v === "long" },
  { text: "Does your person have short hair?",          traitKey: "hairLength",    traitTest: v => v === "short" || v === "bald" },
  { text: "Does your person have curly hair?",          traitKey: "hairTexture",   traitTest: v => v === "curly" },
  { text: "Does your person have wavy hair?",           traitKey: "hairTexture",   traitTest: v => v === "wavy" },
  { text: "Does your person have black hair?",          traitKey: "hairColor",     traitTest: v => v === "black" },
  { text: "Does your person have brown hair?",          traitKey: "hairColor",     traitTest: v => v === "brown" },
  { text: "Does your person have gray or white hair?",  traitKey: "hairColor",     traitTest: v => v === "gray" || v === "white" },
  { text: "Does your person have red hair?",            traitKey: "hairColor",     traitTest: v => v === "red" },
  { text: "Does your person have blonde hair?",         traitKey: "hairColor",     traitTest: v => v === "blonde" },
  { text: "Is your person bald?",                       traitKey: "hairLength",    traitTest: v => v === "bald" },
];

// Pick the question whose yes/no split is closest to 50/50 among remaining characters.
// `remainingIds` = character IDs the bot hasn't eliminated (excluding its own secret).
// `askedTraitKeys` = set of traitKey strings already asked, to avoid repeats.

export function pickBestQuestion(remainingIds, askedTraitKeys = new Set()) {
  const n = remainingIds.length;
  if (n <= 1) return null; // Should guess instead

  let bestQ = null;
  let bestScore = Infinity; // Lower = more balanced = better

  for (const q of QUESTION_POOL) {
    if (askedTraitKeys.has(q.traitKey)) continue;

    let yesCount = 0;
    for (const id of remainingIds) {
      const traits = getTraits(id);
      if (!traits) continue;
      const matches = q.traitKey === "_anyTattoos"
        ? q.traitTest(null, traits)
        : q.traitTest(traits[q.traitKey]);
      if (matches) yesCount++;
    }

    // Score = distance from perfect 50/50 split
    const score = Math.abs(yesCount - (n - yesCount));

    // Skip questions that don't split at all (all yes or all no)
    if (yesCount === 0 || yesCount === n) continue;

    if (score < bestScore) {
      bestScore = score;
      bestQ = q;
    }
  }

  // If all trait questions are exhausted or non-splitting, fall back to first unused
  if (!bestQ) {
    for (const q of QUESTION_POOL) {
      if (!askedTraitKeys.has(q.traitKey)) return q;
    }
    // Absolutely nothing left — shouldn't happen with 40 characters
    return QUESTION_POOL[0];
  }

  return bestQ;
}

// ─── Determine which characters to eliminate after receiving an answer ───
// Returns array of character IDs to eliminate.

export function getEliminationsForAnswer(remainingIds, question, answer) {
  const toEliminate = [];
  for (const id of remainingIds) {
    const traits = getTraits(id);
    if (!traits) continue;
    const matches = question.traitKey === "_anyTattoos"
      ? question.traitTest(null, traits)
      : question.traitTest(traits[question.traitKey]);
    // If answer was "yes", eliminate characters that DON'T match
    // If answer was "no", eliminate characters that DO match
    if (answer === "yes" && !matches) toEliminate.push(id);
    if (answer === "no" && matches) toEliminate.push(id);
  }
  return toEliminate;
}

// ─── Determine if the bot should guess and which character ───

export function getBotGuessTarget(remainingIds, botSecretId) {
  // Filter out the bot's own secret from candidates
  const candidates = remainingIds.filter(id => id !== botSecretId);
  if (candidates.length === 1) return candidates[0];
  if (candidates.length === 0) return null;
  return null; // Not ready to guess yet
}

// ─── Extract trait keys the bot has already asked about from move history ───

export function getAskedTraitKeys(moves) {
  const asked = new Set();
  for (const move of moves) {
    if (move.type !== "question" || move.playerUid !== AI_BOT_UID) continue;
    const q = (move.text || "").toLowerCase();
    // Match the question back to a QUESTION_POOL entry
    for (const poolQ of QUESTION_POOL) {
      if (poolQ.text.toLowerCase() === q) {
        asked.add(poolQ.traitKey);
        break;
      }
    }
  }
  return asked;
}

// ─── Match a bot question text back to a QUESTION_POOL entry ───

export function findQuestionByText(text) {
  const lower = (text || "").toLowerCase();
  return QUESTION_POOL.find(q => q.text.toLowerCase() === lower) || null;
}

// ─── Check if a character set supports AI play ───

export function supportsAI(characters) {
  if (!characters || characters.length === 0) return false;
  // At least half the characters must have trait data
  const withTraits = characters.filter(c => CHARACTER_TRAITS[c.id]);
  return withTraits.length >= characters.length * 0.5;
}
