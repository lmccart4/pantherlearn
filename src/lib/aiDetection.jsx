// src/lib/aiDetection.jsx
// Lightweight AI-generated text detection for student written responses.
// Uses heuristic analysis — no external API calls.
// Returns confidence scores and flags for teacher review.

// ═══════════════════════════════════════════
// COMMON AI PHRASES & PATTERNS
// ═══════════════════════════════════════════

const AI_PHRASES = [
  // Hedging / filler patterns
  "it's important to note that",
  "it is important to note",
  "it's worth noting that",
  "it is worth mentioning",
  "it should be noted",
  "in today's world",
  "in today's society",
  "in today's digital age",
  "in the realm of",
  "in the world of",
  "it's crucial to",
  "it is essential to",
  "it is important to understand",
  // Transition / structure
  "moreover",
  "furthermore",
  "additionally",
  "in conclusion",
  "to summarize",
  "in summary",
  "first and foremost",
  "last but not least",
  "on the other hand",
  "having said that",
  // Filler qualifiers
  "a myriad of",
  "a plethora of",
  "a wide range of",
  "a variety of factors",
  "multifaceted",
  "encompasses a wide",
  "plays a crucial role",
  "plays a vital role",
  "serves as a testament",
  "is a testament to",
  // AI-typical closings
  "in this rapidly evolving",
  "as we move forward",
  "as technology continues to evolve",
  "the landscape of",
  "navigate the complexities",
  "foster a deeper understanding",
  "holistic approach",
  "paradigm shift",
  "leverage the power",
  "delve into",
  "tapestry",
  "bustling",
  "underscores the importance",
  "crucial role in shaping",
  "pivotal role",
  "nuanced understanding",
  "intricate interplay",
  "ever-evolving landscape",
];

// Phrases that are less suspicious individually but notable in combination
const MILD_AI_PHRASES = [
  "however",
  "therefore",
  "consequently",
  "nevertheless",
  "significantly",
  "ultimately",
  "essentially",
  "fundamentally",
  "specifically",
  "particularly",
];

// ═══════════════════════════════════════════
// ANALYSIS FUNCTIONS
// ═══════════════════════════════════════════

/**
 * Check for known AI-typical phrases.
 * Returns { score: 0-1, matches: string[] }
 */
function analyzeAIPhrases(text) {
  const lower = text.toLowerCase();
  const strongMatches = AI_PHRASES.filter((p) => lower.includes(p));
  const mildMatches = MILD_AI_PHRASES.filter((p) => {
    // Only count mild phrases if they appear multiple times or at sentence starts
    const regex = new RegExp(`(?:^|\\. )${p}\\b`, "gi");
    return (lower.match(regex) || []).length >= 1;
  });

  const wordCount = text.split(/\s+/).length;
  // Normalize: more phrases per word = more suspicious
  const strongWeight = strongMatches.length * 3;
  const mildWeight = mildMatches.length * 0.5;
  const density = (strongWeight + mildWeight) / Math.max(wordCount / 50, 1);

  return {
    score: Math.min(density / 5, 1),
    matches: [...strongMatches, ...mildMatches.map((m) => `(${m})`)],
  };
}

/**
 * Analyze sentence structure uniformity.
 * AI text tends to have very consistent sentence lengths.
 * Returns { score: 0-1, avgLength, stdDev }
 */
function analyzeSentenceUniformity(text) {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  if (sentences.length < 3) return { score: 0, avgLength: 0, stdDev: 0 };

  const lengths = sentences.map((s) => s.split(/\s+/).length);
  const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, l) => sum + (l - avg) ** 2, 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  // Low std deviation relative to avg = suspiciously uniform
  const coeffOfVariation = avg > 0 ? stdDev / avg : 0;

  // AI typically has CoV of 0.15-0.3, humans are 0.4-0.8+
  let score = 0;
  if (coeffOfVariation < 0.2) score = 0.9;
  else if (coeffOfVariation < 0.3) score = 0.6;
  else if (coeffOfVariation < 0.4) score = 0.3;
  else score = 0;

  return { score, avgLength: Math.round(avg), stdDev: Math.round(stdDev * 10) / 10 };
}

/**
 * Analyze vocabulary sophistication relative to text length.
 * AI text often has unnaturally high vocabulary diversity for short texts.
 * Returns { score: 0-1, uniqueRatio }
 */
function analyzeVocabulary(text) {
  const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
  if (words.length < 20) return { score: 0, uniqueRatio: 0 };

  const unique = new Set(words);
  const ratio = unique.size / words.length;

  // High school students typically: 0.45-0.6 unique ratio
  // AI text typically: 0.6-0.75+
  let score = 0;
  if (ratio > 0.75) score = 0.7;
  else if (ratio > 0.68) score = 0.4;
  else if (ratio > 0.63) score = 0.2;

  return { score, uniqueRatio: Math.round(ratio * 100) / 100 };
}

/**
 * Check for overly structured/formatted responses.
 * AI loves numbered lists, bullet points, headers in free-form answers.
 * Returns { score: 0-1, signals: string[] }
 */
function analyzeStructure(text) {
  const signals = [];
  const lines = text.split("\n").filter((l) => l.trim());

  // Numbered list detection
  const numberedLines = lines.filter((l) => /^\s*\d+[\.\)]\s/.test(l));
  if (numberedLines.length >= 3) signals.push(`${numberedLines.length} numbered items`);

  // Bullet point detection
  const bulletLines = lines.filter((l) => /^\s*[-•*]\s/.test(l));
  if (bulletLines.length >= 3) signals.push(`${bulletLines.length} bullet points`);

  // Header-like patterns
  const headerLines = lines.filter((l) => /^#{1,3}\s|^[A-Z][A-Za-z\s]+:$/.test(l.trim()));
  if (headerLines.length >= 2) signals.push(`${headerLines.length} headers/sections`);

  // Suspiciously long for a student short answer (>300 words)
  const wordCount = text.split(/\s+/).length;
  if (wordCount > 300) signals.push(`${wordCount} words (unusually long)`);

  // Perfect paragraph structure (3+ paragraphs all roughly same length)
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 20);
  if (paragraphs.length >= 3) {
    const pLengths = paragraphs.map((p) => p.split(/\s+/).length);
    const pAvg = pLengths.reduce((a, b) => a + b, 0) / pLengths.length;
    const pStd = Math.sqrt(pLengths.reduce((s, l) => s + (l - pAvg) ** 2, 0) / pLengths.length);
    if (pAvg > 0 && pStd / pAvg < 0.25) {
      signals.push("uniform paragraph lengths");
    }
  }

  const score = Math.min(signals.length / 3, 1);
  return { score, signals };
}

/**
 * Behavioral analysis: check submission timing and paste patterns.
 * Returns { score: 0-1, signals: string[] }
 */
function analyzeBehavior(text, submittedAt, startedAt) {
  const signals = [];
  let score = 0;

  const wordCount = text.split(/\s+/).length;

  // If we have timing data
  if (submittedAt && startedAt) {
    const elapsed = (new Date(submittedAt) - new Date(startedAt)) / 1000;
    const wordsPerSecond = wordCount / Math.max(elapsed, 1);

    // Average typing: ~0.5-1.0 words/sec. Paste: instant = very high wps
    if (wordsPerSecond > 5 && wordCount > 30) {
      signals.push(`submitted ${wordCount} words in ${Math.round(elapsed)}s (likely pasted)`);
      score += 0.5;
    } else if (wordsPerSecond > 2 && wordCount > 50) {
      signals.push("fast submission speed");
      score += 0.3;
    }
  }

  // Very long response for a typical student question
  if (wordCount > 250) {
    signals.push(`${wordCount} words (above typical student range)`);
    score += 0.2;
  }

  return { score: Math.min(score, 1), signals };
}

/**
 * Compare a response against a student's writing history.
 * Looks for sudden quality jumps or style shifts.
 * Returns { score: 0-1, signals: string[] }
 */
function compareToHistory(text, previousResponses) {
  if (!previousResponses || previousResponses.length < 2) {
    return { score: 0, signals: [] };
  }

  const signals = [];
  let score = 0;

  const currentWords = text.split(/\s+/).length;
  const currentUnique = new Set(text.toLowerCase().match(/\b[a-z]+\b/g) || []).size;
  const currentRatio = currentUnique / Math.max(currentWords, 1);

  // Average stats from history
  const historyStats = previousResponses.map((r) => {
    const words = r.split(/\s+/).length;
    const unique = new Set(r.toLowerCase().match(/\b[a-z]+\b/g) || []).size;
    return { words, ratio: unique / Math.max(words, 1) };
  });

  const avgWords = historyStats.reduce((s, h) => s + h.words, 0) / historyStats.length;
  const avgRatio = historyStats.reduce((s, h) => s + h.ratio, 0) / historyStats.length;

  // Length jump: >3x their average
  if (currentWords > avgWords * 3 && currentWords > 50) {
    signals.push(`${currentWords} words vs avg ${Math.round(avgWords)} (${Math.round(currentWords / avgWords)}x longer)`);
    score += 0.4;
  }

  // Vocabulary jump
  if (currentRatio > avgRatio * 1.3 && currentRatio > 0.6) {
    signals.push("vocabulary complexity jump");
    score += 0.3;
  }

  return { score: Math.min(score, 1), signals };
}

// ═══════════════════════════════════════════
// MAIN ANALYSIS FUNCTION
// ═══════════════════════════════════════════

/**
 * Analyze a student's written response for AI-generation indicators.
 *
 * @param {string} text - The student's response
 * @param {object} options - Optional context
 * @param {string} options.submittedAt - ISO timestamp of submission
 * @param {string} options.startedAt - ISO timestamp when student started
 * @param {string[]} options.previousResponses - Array of student's prior written answers
 * @param {Array} options.aiBaselines - AI baseline responses from lesson block (from aiBaselines.jsx)
 * @param {function} options.compareToBaselines - The comparison function (passed in to avoid circular import)
 * @returns {object} Analysis result
 */
export function analyzeResponse(text, options = {}) {
  if (!text || text.trim().length < 20) {
    return {
      overallScore: 0,
      risk: "none",
      label: "",
      color: "",
      details: [],
      flags: [],
    };
  }

  const phrases = analyzeAIPhrases(text);
  const uniformity = analyzeSentenceUniformity(text);
  const vocab = analyzeVocabulary(text);
  const structure = analyzeStructure(text);
  const behavior = analyzeBehavior(text, options.submittedAt, options.startedAt);
  const history = compareToHistory(text, options.previousResponses);

  // Baseline comparison (if baselines exist)
  let baselineResult = { score: 0, bestMatch: null, details: [] };
  if (options.aiBaselines && options.aiBaselines.length > 0 && options.compareToBaselines) {
    baselineResult = options.compareToBaselines(text, options.aiBaselines);
  }

  // Weighted composite score — baselines get highest weight when available
  const hasBaselines = baselineResult.score > 0;
  const weights = hasBaselines
    ? { phrases: 0.15, uniformity: 0.10, vocab: 0.05, structure: 0.10, behavior: 0.10, history: 0.10, baseline: 0.40 }
    : { phrases: 0.30, uniformity: 0.15, vocab: 0.10, structure: 0.15, behavior: 0.15, history: 0.15, baseline: 0 };

  const overallScore =
    phrases.score * weights.phrases +
    uniformity.score * weights.uniformity +
    vocab.score * weights.vocab +
    structure.score * weights.structure +
    behavior.score * weights.behavior +
    history.score * weights.history +
    baselineResult.score * weights.baseline;

  // Collect all flags
  const flags = [];
  if (baselineResult.bestMatch && baselineResult.score > 0.2) {
    flags.push(`${Math.round(baselineResult.bestMatch.similarity * 100)}% match to ${baselineResult.bestMatch.provider} baseline`);
  }
  if (phrases.matches.length > 0) flags.push(...phrases.matches.slice(0, 5).map((m) => `AI phrase: "${m}"`));
  if (uniformity.score > 0.5) flags.push(`Uniform sentence length (avg ${uniformity.avgLength} words, σ=${uniformity.stdDev})`);
  if (vocab.score > 0.3) flags.push(`High vocabulary diversity (${vocab.uniqueRatio})`);
  if (structure.signals.length > 0) flags.push(...structure.signals.map((s) => `Structure: ${s}`));
  if (behavior.signals.length > 0) flags.push(...behavior.signals);
  if (history.signals.length > 0) flags.push(...history.signals.map((s) => `vs history: ${s}`));

  // Classify risk
  let risk, label, color;
  if (overallScore >= 0.6) {
    risk = "high";
    label = "⚠️ Likely AI-generated";
    color = "var(--red)";
  } else if (overallScore >= 0.35) {
    risk = "medium";
    label = "⚡ Some AI indicators";
    color = "var(--amber)";
  } else if (overallScore >= 0.15) {
    risk = "low";
    label = "🔎 Minor flags";
    color = "var(--text3)";
  } else {
    risk = "none";
    label = "";
    color = "";
  }

  // Build detail rows
  const detailRows = [
    { name: "AI Phrases", score: phrases.score, weight: weights.phrases },
    { name: "Sentence Uniformity", score: uniformity.score, weight: weights.uniformity },
    { name: "Vocabulary", score: vocab.score, weight: weights.vocab },
    { name: "Structure", score: structure.score, weight: weights.structure },
    { name: "Behavior", score: behavior.score, weight: weights.behavior },
    { name: "vs History", score: history.score, weight: weights.history },
  ];
  if (hasBaselines) {
    detailRows.unshift({ name: "AI Baseline Match", score: baselineResult.score, weight: weights.baseline });
  }

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    risk,
    label,
    color,
    details: detailRows,
    flags,
    baselineDetails: baselineResult.details,
  };
}

/**
 * Batch-analyze all of a student's responses to build history context.
 * Call this once per student, then use the results for per-response analysis.
 *
 * @param {object} progressData - { lessonId: { blockId: { answer, submitted, needsGrading } } }
 * @returns {{ responses: Array<{lessonId, blockId, text}>, texts: string[] }}
 */
export function extractStudentWrittenHistory(progressData) {
  const responses = [];
  if (!progressData) return { responses, texts: [] };

  Object.entries(progressData).forEach(([lessonId, answers]) => {
    Object.entries(answers).forEach(([blockId, data]) => {
      if (data.submitted && data.needsGrading && data.answer) {
        responses.push({ lessonId, blockId, text: data.answer });
      }
    });
  });

  return { responses, texts: responses.map((r) => r.text) };
}
