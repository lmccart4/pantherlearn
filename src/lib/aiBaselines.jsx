// src/lib/aiBaselines.jsx
// Generates "canonical" AI responses for short-answer questions at lesson-creation time.
// These baselines are stored on the block and used during grading to detect copy-paste from AI.
//
// All AI generation is done server-side via the generateBaselines Cloud Function.
// API keys are NEVER exposed to the frontend.

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

// ═══════════════════════════════════════════
// CLOUD FUNCTION URL
// ═══════════════════════════════════════════

const BASELINES_URL =
  import.meta.env.VITE_BASELINES_URL || "https://us-central1-pantherlearn-d6f7c.cloudfunctions.net/generateBaselines";

// ═══════════════════════════════════════════
// MAIN GENERATION FUNCTION
// ═══════════════════════════════════════════

/**
 * Generate AI baselines for a short-answer question.
 * Calls the generateBaselines Cloud Function which handles all provider API keys server-side.
 *
 * @param {string} prompt - The question prompt
 * @param {function} getToken - Auth token getter (for Cloud Function auth)
 * @returns {Array<{provider: string, text: string, generatedAt: string}>}
 */
export async function generateBaselines(prompt, getToken) {
  if (!prompt || prompt.trim().length < 10) return [];

  try {
    const authToken = await getToken();
    const response = await fetch(BASELINES_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.warn("Baseline generation failed:", data.error);
      return [];
    }

    return (data.baselines || []).filter((r) => r && r.text && r.text.length > 20);
  } catch (err) {
    console.warn("Baseline generation failed:", err.message);
    return [];
  }
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
// Note: These are pure math functions — no API keys needed.
// They run entirely in the browser during grading.

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
