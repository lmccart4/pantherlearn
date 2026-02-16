// src/lib/aiBaselines.jsx
// Generates "canonical" AI responses for short-answer questions at lesson-creation time.
// These baselines are stored on the block and used during grading to detect copy-paste from AI.
//
// Uses the same sendChatMessage API that chatbot blocks use (routed through your backend),
// plus optional direct calls to other providers if API keys are configured.

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// ═══════════════════════════════════════════
// PROVIDER CONFIGS
// ═══════════════════════════════════════════

// Each provider generates a response to the same prompt so we can compare
// student answers against multiple AI "voices"
const BASELINE_SYSTEM_PROMPT = `You are a student completing a classroom assignment. Answer the question directly and thoroughly. Write naturally as if you are a knowledgeable student — do not include disclaimers, caveats, or mention that you are an AI. Just answer the question.`;

/**
 * Generate a baseline AI response using the app's existing chat API.
 * This goes through your Firebase backend / Cloud Function.
 */
async function generateViaAppAPI(prompt, getToken) {
  try {
    // Dynamic import to avoid circular deps
    const { sendChatMessage } = await import("./api");
    const authToken = await getToken();
    const response = await sendChatMessage({
      authToken,
      courseId: "__baseline__",
      lessonId: "__baseline__",
      blockId: "__baseline__",
      systemPrompt: BASELINE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });
    return { provider: "gemini", text: response };
  } catch (err) {
    console.warn("Baseline generation via app API failed:", err.message);
    return null;
  }
}

/**
 * Generate a baseline via OpenAI-compatible endpoint.
 * Uses VITE_OPENAI_API_KEY env var if available.
 */
async function generateViaOpenAI(prompt) {
  const apiKey = import.meta.env?.VITE_OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: BASELINE_SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });
    const data = await res.json();
    return { provider: "openai", text: data.choices?.[0]?.message?.content || "" };
  } catch (err) {
    console.warn("OpenAI baseline failed:", err.message);
    return null;
  }
}

/**
 * Generate a baseline via Anthropic.
 * Uses VITE_ANTHROPIC_API_KEY env var if available.
 */
async function generateViaAnthropic(prompt) {
  const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: BASELINE_SYSTEM_PROMPT,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    return { provider: "anthropic", text: data.content?.[0]?.text || "" };
  } catch (err) {
    console.warn("Anthropic baseline failed:", err.message);
    return null;
  }
}

// ═══════════════════════════════════════════
// MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════

/**
 * Generate AI baselines for a short-answer question.
 * Tries multiple providers and returns all successful responses.
 *
 * @param {string} prompt - The question prompt
 * @param {function} getToken - Auth token getter (for app API)
 * @returns {Array<{provider: string, text: string, generatedAt: string}>}
 */
export async function generateBaselines(prompt, getToken) {
  if (!prompt || prompt.trim().length < 10) return [];

  // Run all providers in parallel — each one that fails returns null
  const results = await Promise.all([
    generateViaAppAPI(prompt, getToken),
    generateViaOpenAI(prompt),
    generateViaAnthropic(prompt),
  ]);

  return results
    .filter((r) => r && r.text && r.text.length > 20)
    .map((r) => ({
      ...r,
      generatedAt: new Date().toISOString(),
    }));
}

/**
 * Generate baselines for all short-answer blocks in a lesson that don't already have them.
 * Saves results directly to the lesson doc in Firestore.
 *
 * @param {string} courseId
 * @param {string} lessonId
 * @param {Array} blocks - The lesson's blocks array
 * @param {function} getToken - Auth token getter
 * @returns {Array} Updated blocks array with baselines attached
 */
export async function generateLessonBaselines(courseId, lessonId, blocks, getToken) {
  if (!blocks || !Array.isArray(blocks)) return blocks;

  let updated = false;
  const updatedBlocks = [...blocks];

  for (let i = 0; i < updatedBlocks.length; i++) {
    const block = updatedBlocks[i];
    // Only generate for short-answer questions that don't already have baselines
    if (
      block.type === "question" &&
      block.questionType === "short_answer" &&
      block.prompt &&
      (!block.aiBaselines || block.aiBaselines.length === 0)
    ) {
      console.log(`Generating AI baselines for block "${block.prompt.slice(0, 50)}..."`);
      const baselines = await generateBaselines(block.prompt, getToken);
      if (baselines.length > 0) {
        updatedBlocks[i] = { ...block, aiBaselines: baselines };
        updated = true;
        console.log(`  → Got ${baselines.length} baseline(s) from: ${baselines.map((b) => b.provider).join(", ")}`);
      }
    }
  }

  // Persist to Firestore if any baselines were generated
  if (updated && courseId && lessonId) {
    try {
      const lessonRef = doc(db, "courses", courseId, "lessons", lessonId);
      await updateDoc(lessonRef, { blocks: updatedBlocks });
      console.log("Baselines saved to Firestore.");
    } catch (err) {
      console.error("Failed to save baselines:", err);
    }
  }

  return updatedBlocks;
}

// ═══════════════════════════════════════════
// SIMILARITY COMPARISON (used at grading time)
// ═══════════════════════════════════════════

/**
 * Build a word frequency vector (bag of words) from text.
 */
function wordFrequency(text) {
  const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
  const freq = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
  return freq;
}

/**
 * Compute cosine similarity between two word frequency vectors.
 * Returns 0-1 where 1 = identical word distribution.
 */
function cosineSimilarity(freqA, freqB) {
  const allWords = new Set([...Object.keys(freqA), ...Object.keys(freqB)]);
  let dot = 0, magA = 0, magB = 0;
  for (const word of allWords) {
    const a = freqA[word] || 0;
    const b = freqB[word] || 0;
    dot += a * b;
    magA += a * a;
    magB += b * b;
  }
  const magnitude = Math.sqrt(magA) * Math.sqrt(magB);
  return magnitude > 0 ? dot / magnitude : 0;
}

/**
 * Compute n-gram overlap between two texts.
 * Catches longer shared phrases that word frequency misses.
 */
function ngramOverlap(textA, textB, n = 3) {
  const getNgrams = (text) => {
    const words = text.toLowerCase().match(/\b[a-z]{2,}\b/g) || [];
    const ngrams = new Set();
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.add(words.slice(i, i + n).join(" "));
    }
    return ngrams;
  };

  const ngramsA = getNgrams(textA);
  const ngramsB = getNgrams(textB);
  if (ngramsA.size === 0 || ngramsB.size === 0) return 0;

  let overlap = 0;
  for (const ng of ngramsA) {
    if (ngramsB.has(ng)) overlap++;
  }
  return overlap / Math.min(ngramsA.size, ngramsB.size);
}

/**
 * Compare a student's answer against stored AI baselines.
 * Returns { score: 0-1, bestMatch: { provider, similarity }, details }
 *
 * @param {string} studentText - The student's written response
 * @param {Array<{provider: string, text: string}>} baselines - AI baseline responses
 * @returns {object}
 */
export function compareToBaselines(studentText, baselines) {
  if (!baselines || baselines.length === 0 || !studentText || studentText.length < 20) {
    return { score: 0, bestMatch: null, details: [] };
  }

  const studentFreq = wordFrequency(studentText);
  const details = [];
  let bestScore = 0;
  let bestMatch = null;

  for (const baseline of baselines) {
    const baselineFreq = wordFrequency(baseline.text);
    const cosine = cosineSimilarity(studentFreq, baselineFreq);
    const trigram = ngramOverlap(studentText, baseline.text, 3);
    const bigram = ngramOverlap(studentText, baseline.text, 2);

    // Weighted combo: cosine catches topical similarity, n-grams catch phrasing
    const combined = cosine * 0.4 + trigram * 0.35 + bigram * 0.25;

    details.push({
      provider: baseline.provider,
      cosine: Math.round(cosine * 100) / 100,
      trigram: Math.round(trigram * 100) / 100,
      bigram: Math.round(bigram * 100) / 100,
      combined: Math.round(combined * 100) / 100,
    });

    if (combined > bestScore) {
      bestScore = combined;
      bestMatch = { provider: baseline.provider, similarity: Math.round(combined * 100) / 100 };
    }
  }

  // Map combined score to a 0-1 detection score
  // 0.5+ combined is very suspicious, 0.3-0.5 is moderate
  let score = 0;
  if (bestScore >= 0.55) score = 1.0;
  else if (bestScore >= 0.45) score = 0.8;
  else if (bestScore >= 0.35) score = 0.5;
  else if (bestScore >= 0.25) score = 0.2;

  return { score, bestMatch, details };
}
