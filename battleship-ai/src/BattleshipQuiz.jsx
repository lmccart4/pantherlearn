import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { SchematicFleet, ShipSchematicPanel, ShipSilhouette, ShipOverlay } from "./ShipSchematics";

// ═══════════════════════════════════════════════════════════════
// BATTLESHIP QUIZ FRAMEWORK — "OPERATION RED TIDE"
// Cold War Naval Command Center Aesthetic
// Reusable quiz engine: swap questions JSON for any subject
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// AI LITERACY — FOUNDATIONS OF GENERATIVE AI (Lessons 1–9)
// Covering: Intro to GenAI, Strengths & Limitations, Training Data,
//   Bias, Prompt Engineering, Data Labeling, Embeddings, Neural Networks
// ═══════════════════════════════════════════════════════════════
const SAMPLE_QUESTIONS = [
  // ── LESSON 1: INTRO TO GENERATIVE AI ───────────────────────
  {
    id: "ai1",
    type: "multiple_choice",
    prompt: "You typed 'The dog barked at the...' into an AI chat. How did the AI choose its response?",
    options: [
      "It used probability to predict the most likely next word based on patterns",
      "It understood the scene and imagined what came next",
      "It randomly picked words from a dictionary",
      "It asked a human for help behind the scenes"
    ],
    correctIndex: 0,
    explanation: "AI uses probability and pattern recognition to predict the most likely next word. It doesn't understand meaning — it's read millions of sentences and recognizes what typically comes next."
  },
  {
    id: "ai2",
    type: "true_false",
    prompt: "AI generates text by truly understanding the meaning of words, just like a human reader.",
    correctAnswer: false,
    explanation: "AI doesn't understand meaning. It uses statistical patterns from millions of text examples to predict probable next words. It recognizes patterns, not meaning — which is why it can produce confident-sounding text that is factually wrong."
  },
  {
    id: "ai3",
    type: "multiple_choice",
    prompt: "An AI image generator asked to draw 'the keys are on the table' produces a single key balanced on a table. What BEST explains this?",
    options: [
      "The AI is broken and needs to be fixed",
      "The AI abstracted the key details but missed the real-world meaning",
      "The AI understood perfectly — that's the correct interpretation",
      "The AI was being creative with its interpretation"
    ],
    correctIndex: 1,
    explanation: "AI uses abstraction — focusing on essential details while ignoring context. It processed 'keys' and 'table' but missed the real-world meaning of how keys actually sit on a table. AI doesn't have lived experience to fill in those gaps."
  },
  {
    id: "ai4",
    type: "multiple_choice",
    prompt: "Which prompt would MOST LIKELY produce the most useful AI response?",
    options: [
      "Help me with my project",
      "Write something about the ocean",
      "Help me create a 5-slide presentation about ocean pollution for my 9th grade science class, including at least 2 statistics",
      "Tell me everything you know about water"
    ],
    correctIndex: 2,
    explanation: "Specific prompts with details about format (5 slides), topic (ocean pollution), audience (9th grade), and requirements (2 statistics) give AI much more to work with. Vague prompts produce vague, unfocused responses."
  },

  // ── LESSON 2: HOW SMART IS IT, REALLY? ─────────────────────
  {
    id: "ai5",
    type: "multiple_choice",
    prompt: "Which type of task does AI generally handle BEST?",
    options: [
      "Structured writing tasks like ads, reviews, and summaries",
      "Writing original jokes that are genuinely funny",
      "Reporting accurate facts about local school board meetings",
      "Understanding cultural context and authentic representation"
    ],
    correctIndex: 0,
    explanation: "AI excels at structured, pattern-based tasks like writing ads, product reviews, and summaries. These follow predictable templates AI can replicate well. It struggles with subjective creativity, factual accuracy, and local/cultural knowledge."
  },
  {
    id: "ai6",
    type: "multiple_choice",
    prompt: "What is an AI hallucination?",
    options: [
      "When AI generates information that sounds confident but is actually incorrect or made up",
      "When AI refuses to answer a question",
      "When AI accidentally shows you an image",
      "When AI repeats the same answer over and over"
    ],
    correctIndex: 0,
    explanation: "A hallucination is when AI generates confident-sounding information that is actually incorrect or fabricated. It happens because AI predicts likely-sounding words based on patterns — it doesn't verify facts against reality."
  },
  {
    id: "ai7",
    type: "true_false",
    prompt: "AI struggles with current events because its training data has a cutoff date — it hasn't seen information published after that point.",
    correctAnswer: true,
    explanation: "AI models are trained on data collected up to a specific date. They have no way to access or learn from events that happened after their training cutoff, which is why they can't reliably discuss recent news."
  },
  {
    id: "ai8",
    type: "multiple_choice",
    prompt: "A student uses AI to write a news article about a local school board meeting. What is the BIGGEST risk?",
    options: [
      "The article will be too long",
      "The article will be too formal",
      "The AI might hallucinate facts, quotes, or details about the meeting",
      "The AI won't include a catchy headline"
    ],
    correctIndex: 2,
    explanation: "The biggest risk is hallucination — AI might invent facts, fabricate quotes, or get details completely wrong about a real event. This is especially dangerous in journalism where accuracy matters. AI wasn't at the meeting and can't verify what actually happened."
  },

  // ── LESSON 3: INPUTS & TRAINING DATA ───────────────────────
  {
    id: "ai9",
    type: "multiple_choice",
    prompt: "What is tokenization in AI?",
    options: [
      "Translating text into a different language",
      "Encrypting text so it can't be read by humans",
      "Removing unnecessary words from a sentence",
      "Breaking text into smaller pieces (tokens) that AI can process"
    ],
    correctIndex: 3,
    explanation: "Tokenization is the process of breaking text into smaller pieces called tokens — whole words, word parts, or punctuation — so that AI can process them as numbers. For example, 'cooking' becomes 'cook' + 'ing'."
  },
  {
    id: "ai10",
    type: "multiple_choice",
    prompt: "Why do AI models break words into sub-word pieces instead of keeping whole words?",
    options: [
      "To make the text shorter and save storage space",
      "To remove unnecessary words from input",
      "To automatically translate words into English",
      "To help the model handle new or unfamiliar words by recognizing common word parts"
    ],
    correctIndex: 3,
    explanation: "Sub-word tokenization lets AI handle words it hasn't seen before by recognizing familiar parts. For example, even if AI never saw 'unbreakable,' it can process 'un' + 'break' + 'able' because it knows those parts from other words."
  },
  {
    id: "ai11",
    type: "multiple_choice",
    prompt: "If an AI was mostly trained on English-language websites, what would MOST LIKELY happen when someone asks it a question in Navajo?",
    options: [
      "It would answer perfectly using universal language rules",
      "It would automatically translate the question to English first",
      "It would refuse to read the question entirely",
      "It would struggle because its training data doesn't include much Navajo text"
    ],
    correctIndex: 3,
    explanation: "AI's abilities are shaped by its training data. If Navajo is underrepresented in that data, the model won't have learned its patterns — even though Navajo is a real language spoken by 170,000+ people. The AI's definition of 'language' is limited to what it was trained on."
  },
  {
    id: "ai12",
    type: "true_false",
    prompt: "Using 'everything on the internet' as training data eliminates bias because the internet contains all perspectives equally.",
    correctAnswer: false,
    explanation: "The internet itself is not balanced — certain languages, cultures, and perspectives are heavily overrepresented while others are underrepresented. Training on internet data inherits these imbalances, creating bias in the AI model."
  },

  // ── LESSON 4: BIAS IN THE MACHINE ──────────────────────────
  {
    id: "ai13",
    type: "multiple_choice",
    prompt: "A recipe chatbot trained mostly on English-language food blogs from the US is asked for a traditional jollof rice recipe. What is the MOST likely problem?",
    options: [
      "The chatbot won't understand the question",
      "The chatbot will give an Americanized version that doesn't reflect authentic West African traditions",
      "The chatbot will refuse to answer about international food",
      "The chatbot will give a perfect authentic recipe"
    ],
    correctIndex: 1,
    explanation: "When training data is dominated by one culture's perspective, AI represents dishes through that filtered lens. A chatbot trained on US food blogs would likely produce an Americanized version of jollof rice rather than an authentic West African recipe."
  },
  {
    id: "ai14",
    type: "multiple_choice",
    prompt: "What is the BEST strategy for reducing bias in a chatbot's training data?",
    options: [
      "Use only one trusted author as the data source",
      "Use only verified professional or academic sources",
      "Use many different sources from diverse cultures, languages, and perspectives",
      "Remove all cultural references from the training data"
    ],
    correctIndex: 2,
    explanation: "No single data source is unbiased. The best strategy is to use many different sources from diverse cuisines, cultures, languages, and perspectives. A diverse collection helps balance out the biases present in any individual source."
  },
  {
    id: "ai15",
    type: "multiple_choice",
    prompt: "An AI hiring tool rejects most applicants from certain neighborhoods, even though location isn't supposed to matter. What is MOST likely happening?",
    options: [
      "The AI learned patterns from biased historical data that connected location to hiring decisions",
      "The AI is randomly making errors",
      "The AI is intentionally discriminating",
      "The applicants from those neighborhoods are less qualified"
    ],
    correctIndex: 0,
    explanation: "AI models learn from historical data. If past hiring decisions were influenced by bias, the AI picks up those same patterns and repeats them — even when the bias isn't intentional or obvious."
  },
  {
    id: "ai16",
    type: "multiple_choice",
    prompt: "In the foreign country language-learning analogy, choosing WHERE you stay determines what words you learn. This is most similar to:",
    options: [
      "Choosing which programming language to write AI in",
      "Choosing what color the AI interface will be",
      "Choosing how fast the AI processes information",
      "Choosing what training data to feed the AI model"
    ],
    correctIndex: 3,
    explanation: "Just like your location determines what words you learn, the choice of training data determines what AI knows. If you only stay in a restaurant, you learn food words. If AI is only trained on certain data, it only learns those patterns."
  },

  // ── LESSON 5: IS IT BIASED? ────────────────────────────────
  {
    id: "ai17",
    type: "multiple_choice",
    prompt: "Which of the following is one of the four types of bias to look for in AI responses?",
    options: [
      "Relied on a stereotype — used a common but oversimplified idea",
      "Used too many big words",
      "Gave a response that was too short",
      "Included too many statistics"
    ],
    correctIndex: 0,
    explanation: "The four types of bias to look for are: relied on a stereotype, assumed one identity, left out other perspectives, and language that didn't feel inclusive. Stereotypes are oversimplified ideas about groups that AI can reproduce from its training data."
  },
  {
    id: "ai18",
    type: "multiple_choice",
    prompt: "An AI asked for Thanksgiving recipe suggestions only recommends turkey, stuffing, and pumpkin pie. Which types of bias are present?",
    options: [
      "Assumed one identity AND left out other perspectives",
      "No bias — those are traditional Thanksgiving foods",
      "Only 'used non-inclusive language'",
      "The AI was just being efficient with its suggestions"
    ],
    correctIndex: 0,
    explanation: "The AI assumed everyone celebrates Thanksgiving the same way (assumed one identity) and ignored diverse traditions — Indigenous perspectives, vegan options, non-American traditions, and dishes from various cultural backgrounds (left out perspectives)."
  },
  {
    id: "ai19",
    type: "true_false",
    prompt: "Writing a more specific prompt (adding details about culture, dietary needs, etc.) can reduce bias in AI responses, but may not eliminate it completely.",
    correctAnswer: true,
    explanation: "Specific prompts make it harder for AI to fall back on generic, biased defaults. However, even with specific prompts, AI may still lean toward well-known or popular examples rather than truly diverse options. Prompting helps but isn't a complete solution."
  },
  {
    id: "ai20",
    type: "multiple_choice",
    prompt: "Bias in AI shows up in what the model includes AND:",
    options: [
      "How fast it responds",
      "What it leaves out",
      "How many words it uses",
      "What font it displays"
    ],
    correctIndex: 1,
    explanation: "Bias isn't just about what AI says — it's also about what it doesn't say. When AI consistently leaves out certain perspectives, cultures, or voices, that absence is a form of bias. What's missing matters as much as what's present."
  },

  // ── LESSON 6: BIAS DETECTIVE & DATA LABELING ───────────────
  {
    id: "ai21",
    type: "multiple_choice",
    prompt: "A hiring AI weights 'university prestige' at 28% but 'technical skills' at only 12%. Why is this problematic?",
    options: [
      "University prestige is always the best predictor of job performance",
      "It disadvantages graduates from HBCUs, community colleges, and state schools — correlating with race and socioeconomic status",
      "Technical skills don't matter for software engineering jobs",
      "12% is still a reasonable weight for technical skills"
    ],
    correctIndex: 1,
    explanation: "Overweighting university prestige disadvantages graduates from HBCUs, community colleges, and state schools. Since access to prestigious universities correlates with race and socioeconomic status, this launders privilege into 'merit' and perpetuates inequality."
  },
  {
    id: "ai22",
    type: "true_false",
    prompt: "In data labeling, 'ground truth' is always an objective, undeniable fact.",
    correctAnswer: false,
    explanation: "Ground truth in data labeling is often just 'whatever most people said' — it's majority opinion, not objective fact. When labeling sarcasm, emotions, or offensive content, reasonable people disagree. If labelers are mostly from one demographic, that group's perspective becomes the 'correct' answer."
  },
  {
    id: "ai23",
    type: "multiple_choice",
    prompt: "The AI systems you use daily (ChatGPT, TikTok, Instagram filters) were all built on labels created by:",
    options: [
      "Real people, often working under time pressure for low pay",
      "A single team of AI researchers at one company",
      "Fully automated computer programs with no human involvement",
      "Government agencies that verify every label"
    ],
    correctIndex: 0,
    explanation: "All major AI systems rely on human-labeled training data. Workers on platforms like Amazon Mechanical Turk often earn $2-6/hour. Workers in Kenya who labeled ChatGPT's training data earned about $2/hour. This hidden human labor is essential but often exploited."
  },
  {
    id: "ai24",
    type: "true_false",
    prompt: "If two data labelers disagree on whether a social media post is 'toxic,' it means one of them is wrong.",
    correctAnswer: false,
    explanation: "Disagreement between labelers is normal and expected — it doesn't mean someone is wrong. People interpret language differently based on their backgrounds, experiences, and perspectives. This subjectivity is one of the biggest challenges in creating AI training data."
  },

  // ── LESSON 7: PROMPT ENGINEERING (GUESS WHO?) ──────────────
  {
    id: "ai25",
    type: "multiple_choice",
    prompt: "What are the four keys to writing better AI prompts?",
    options: [
      "Speed, length, volume, repetition",
      "Specificity, constraints, context, iteration",
      "Grammar, spelling, punctuation, formatting",
      "Politeness, brevity, simplicity, urgency"
    ],
    correctIndex: 1,
    explanation: "The four keys are: Be Specific (detail what you want), Set Constraints (format, length, audience, tone), Give Context (your situation), and Iterate (build on responses with follow-up adjustments)."
  },
  {
    id: "ai26",
    type: "multiple_choice",
    prompt: "In the Guess Who? game, a question like 'Does your person look normal?' is a BAD question because:",
    options: [
      "It's too polite for a competitive game",
      "The game doesn't allow questions about appearance",
      "It would eliminate too many people at once",
      "It's too vague and subjective — it eliminates almost nobody"
    ],
    correctIndex: 3,
    explanation: "Just like vague prompts produce vague AI responses, vague questions in Guess Who? don't narrow down possibilities. 'Does your person have facial hair?' is specific and can eliminate half the board. Precise questions get precise answers — in games and in AI."
  },
  {
    id: "ai27",
    type: "true_false",
    prompt: "Few-shot prompting means giving AI 2-3 examples of what you want so it can recognize the pattern and follow it.",
    correctAnswer: true,
    explanation: "Few-shot prompting teaches AI a pattern by showing examples. Instead of just describing what you want, you provide 2-3 completed examples, and AI recognizes the pattern to generate similar outputs. It's like teaching by demonstration."
  },

  // ── LESSON 8: EMBEDDINGS ───────────────────────────────────
  {
    id: "ai28",
    type: "multiple_choice",
    prompt: "What is an embedding in AI?",
    options: [
      "A way to hide secret messages inside AI responses",
      "A physical chip embedded inside the computer",
      "A way of representing words as a list of numbers that captures their meaning",
      "A tool for translating between programming languages"
    ],
    correctIndex: 2,
    explanation: "An embedding turns words into lists of numbers (vectors) that capture their meaning. Similar words get similar numbers — 'happy' and 'joyful' would be close together in number-space, while 'happy' and 'refrigerator' would be far apart."
  },
  {
    id: "ai29",
    type: "multiple_choice",
    prompt: "In embedding space, words like 'dog' and 'puppy' would be:",
    options: [
      "Far apart because they are spelled differently",
      "In the exact same position because they are synonyms",
      "Close together because they have similar meanings",
      "Impossible to compare because one is shorter"
    ],
    correctIndex: 2,
    explanation: "Embeddings capture meaning, not spelling. Since 'dog' and 'puppy' have very similar meanings, their numerical representations (vectors) would be close together in embedding space — like nearby cities having similar GPS coordinates."
  },
  {
    id: "ai30",
    type: "true_false",
    prompt: "If the embedding for 'doctor' is closer to 'man' than to 'woman,' this reflects bias in the AI's training data — not a fact about the real world.",
    correctAnswer: true,
    explanation: "Embedding bias occurs when training data overrepresents certain associations. If training text more often pairs 'doctor' with male pronouns, the embedding will reflect that pattern. This is a data bias problem, not a reflection of reality — and it can perpetuate stereotypes in AI applications."
  },
  {
    id: "ai31",
    type: "multiple_choice",
    prompt: "Which analogy BEST explains how embeddings work?",
    options: [
      "A dictionary that lists definitions alphabetically",
      "GPS coordinates where nearby cities have similar coordinates, and words with similar meanings have similar numbers",
      "A filing cabinet that stores documents in folders",
      "A phone book that matches names to phone numbers"
    ],
    correctIndex: 1,
    explanation: "Embeddings work like GPS coordinates — just as Philadelphia and Camden have similar coordinates because they're physically close, words like 'happy' and 'joyful' have similar number patterns because they're close in meaning-space."
  },

  // ── LESSON 9: NEURAL NETWORKS ──────────────────────────────
  {
    id: "ai32",
    type: "multiple_choice",
    prompt: "In a neural network, where does the 'knowledge' live?",
    options: [
      "In the code the programmer writes",
      "In the input data it receives each time",
      "In the weights — the strength of connections between neurons",
      "In the output layer only"
    ],
    correctIndex: 2,
    explanation: "A neural network's knowledge is stored in its weights — the strength of connections between neurons. Strong connections mean 'this input matters a lot' and weak connections mean 'ignore this.' When the network learns, it adjusts these weights."
  },
  {
    id: "ai33",
    type: "multiple_choice",
    prompt: "A neural network trained to classify animals figured out that teeth shape and eye position matter most — without being told. How is this different from regular programming?",
    options: [
      "It isn't different — all programs discover patterns on their own",
      "Neural networks can only classify animals, not other things",
      "Regular programs are faster at discovering patterns than neural networks",
      "In regular programming, you explicitly program rules; neural networks discover patterns on their own from examples"
    ],
    correctIndex: 3,
    explanation: "This is the fundamental difference: in traditional programming, humans write explicit rules ('if teeth are sharp, classify as predator'). Neural networks discover which features matter by learning from examples — nobody told it to look at teeth or eyes."
  },
  {
    id: "ai34",
    type: "true_false",
    prompt: "A neural network that is 95% accurate on its training data is guaranteed to be 95% accurate on new, unseen data.",
    correctAnswer: false,
    explanation: "A network can memorize its training data without truly learning the underlying patterns — this is called overfitting. High accuracy on training data doesn't guarantee the same performance on new data. That's why AI researchers always test models on data the network has never seen before."
  },
  {
    id: "ai35",
    type: "true_false",
    prompt: "When a neural network learns, it downloads new code or instructions — similar to installing a software update.",
    correctAnswer: false,
    explanation: "Neural networks don't download new code when they learn. Learning means adjusting the weights (connection strengths) between neurons — strengthening connections that lead to correct outputs and weakening ones that don't. This mirrors how the human brain strengthens neural pathways through practice."
  }
];

// ── SHIP DEFINITIONS ────────────────────────────────────────
const SHIPS = [
  { name: "Carrier", size: 5, code: "CV", bonus: 500 },
  { name: "Battleship", size: 4, code: "BB", bonus: 400 },
  { name: "Cruiser", size: 3, code: "CA", bonus: 300 },
  { name: "Submarine", size: 3, code: "SS", bonus: 300 },
  { name: "Patrol Boat", size: 2, code: "PT", bonus: 200 },
];

const GRID_SIZE = 8;
const LETTERS = "ABCDEFGH";

// ── UTILITY FUNCTIONS ───────────────────────────────────────
function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function canPlaceShip(grid, row, col, size, horizontal) {
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (r >= GRID_SIZE || c >= GRID_SIZE || grid[r][c] !== null) return false;
  }
  return true;
}

function placeShipsRandomly() {
  const grid = createEmptyGrid();
  const placements = [];
  for (const ship of SHIPS) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 500) {
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (canPlaceShip(grid, row, col, ship.size, horizontal)) {
        const cells = [];
        for (let i = 0; i < ship.size; i++) {
          const r = horizontal ? row : row + i;
          const c = horizontal ? col + i : col;
          grid[r][c] = ship.code;
          cells.push([r, c]);
        }
        placements.push({ ...ship, cells, hits: 0, horizontal });
        placed = true;
      }
      attempts++;
    }
  }
  return { grid, placements };
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffle MC option order so correct answer isn't always in the same position
function shuffleQuestionOptions(questions) {
  return questions.map(q => {
    if (q.type !== "multiple_choice") return q;
    const indices = q.options.map((_, i) => i);
    const shuffled = shuffleArray(indices);
    return {
      ...q,
      options: shuffled.map(i => q.options[i]),
      correctIndex: shuffled.indexOf(q.correctIndex),
    };
  });
}

// ── ENEMY AI (Hunt/Target) ──────────────────────────────────
// Tracks: mode (hunt = random, target = finishing a hit ship),
// hitStack for adjacent cells to check, and all previous shots.
function createEnemyAI() {
  return {
    mode: "hunt", // "hunt" or "target"
    hitStack: [],  // cells to try next when targeting
    allShots: [],  // [{row,col}]
    firstHit: null,
    direction: null,
  };
}

function enemyAIFire(ai, playerGrid, playerPlacements) {
  const alreadyShot = (r, c) => ai.allShots.some(s => s.row === r && s.col === c);
  const inBounds = (r, c) => r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

  let row, col;

  if (ai.mode === "target" && ai.hitStack.length > 0) {
    // Try cells from the hit stack
    let found = false;
    while (ai.hitStack.length > 0) {
      const next = ai.hitStack.pop();
      if (inBounds(next.row, next.col) && !alreadyShot(next.row, next.col)) {
        row = next.row;
        col = next.col;
        found = true;
        break;
      }
    }
    if (!found) {
      ai.mode = "hunt";
      ai.firstHit = null;
      ai.direction = null;
    }
  }

  if (ai.mode === "hunt" || row === undefined) {
    // Checkerboard pattern for efficiency — only target cells where (r+c) % 2 === 0 first
    const candidates = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!alreadyShot(r, c)) {
          candidates.push({ row: r, col: c, priority: (r + c) % 2 === 0 ? 1 : 0 });
        }
      }
    }
    // Prefer checkerboard cells, but fall back to any
    const preferred = candidates.filter(c => c.priority === 1);
    const pool = preferred.length > 0 ? preferred : candidates;
    if (pool.length === 0) return null; // no cells left
    const pick = pool[Math.floor(Math.random() * pool.length)];
    row = pick.row;
    col = pick.col;
  }

  ai.allShots.push({ row, col });
  const cellValue = playerGrid[row][col];
  const hit = cellValue !== null;

  let sunkShip = null;
  if (hit) {
    // Update placements
    const updatedPlacements = playerPlacements.map(ship => {
      if (ship.code === cellValue) {
        const updated = { ...ship, hits: ship.hits + 1 };
        if (updated.hits >= updated.size) sunkShip = updated;
        return updated;
      }
      return ship;
    });

    // Switch to target mode
    if (!ai.firstHit) ai.firstHit = { row, col };
    ai.mode = "target";

    // Add adjacent cells to hit stack
    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      if (inBounds(nr, nc) && !alreadyShot(nr, nc)) {
        ai.hitStack.push({ row: nr, col: nc });
      }
    }

    if (sunkShip) {
      // Ship sunk — clear hit stack for that ship, go back to hunt if nothing left
      ai.hitStack = [];
      ai.firstHit = null;
      ai.direction = null;
      // Check if there are other un-sunk hits to follow up on
      const unsunkHits = ai.allShots.filter(s => {
        const val = playerGrid[s.row][s.col];
        if (!val) return false;
        const ship = updatedPlacements.find(sh => sh.code === val);
        return ship && ship.hits < ship.size;
      });
      if (unsunkHits.length > 0) {
        ai.mode = "target";
        for (const h of unsunkHits) {
          for (const [dr, dc] of dirs) {
            const nr = h.row + dr;
            const nc = h.col + dc;
            if (inBounds(nr, nc) && !alreadyShot(nr, nc)) {
              ai.hitStack.push({ row: nr, col: nc });
            }
          }
        }
      } else {
        ai.mode = "hunt";
      }
    }

    return { row, col, hit: true, sunkShip, updatedPlacements };
  }

  return { row, col, hit: false, sunkShip: null, updatedPlacements: null };
}


// ── SOUND EFFECTS (Web Audio API) ───────────────────────────
// Layered synthesis for a cinematic Cold War naval warfare feel
const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || window.webkitAudioContext) : null;
let audioCtx = null;
let masterGain = null;
function getAudioCtx() {
  if (!audioCtx && AudioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}
function getMasterGain(ctx) {
  if (!masterGain && ctx) {
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    // Restore saved volume
    const saved = localStorage.getItem("battleship-volume");
    const muted = localStorage.getItem("battleship-muted") === "true";
    masterGain.gain.value = muted ? 0 : (saved !== null ? Number(saved) / 100 : 0.5);
  }
  return masterGain;
}

// Helper: white noise buffer
function noiseBuffer(ctx, duration) {
  const len = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// SONAR PING — targeting lock confirmed
// Two-tone descending sonar ping with metallic reverb tail
function playPing() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // Primary ping tone
    const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
    o1.type = "sine";
    o1.frequency.setValueAtTime(1600, t);
    o1.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
    g1.gain.setValueAtTime(0.2, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o1.connect(g1); g1.connect(dest);
    o1.start(t); o1.stop(t + 0.5);
    // Echo ping (delayed, quieter)
    const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
    o2.type = "sine";
    o2.frequency.setValueAtTime(1200, t + 0.12);
    o2.frequency.exponentialRampToValueAtTime(900, t + 0.2);
    g2.gain.setValueAtTime(0, t);
    g2.gain.setValueAtTime(0.08, t + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    o2.connect(g2); g2.connect(dest);
    o2.start(t + 0.12); o2.stop(t + 0.7);
  } catch(e) {}
}

// EXPLOSION HIT — shell strikes steel (layered: thud + crunch + fire crackle)
function playHit() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // 1) Deep impact thud (low sine burst)
    const thud = ctx.createOscillator(); const gThud = ctx.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(90, t);
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    gThud.gain.setValueAtTime(0.35, t);
    gThud.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    thud.connect(gThud); gThud.connect(dest);
    thud.start(t); thud.stop(t + 0.5);
    // 2) Metal crunch (filtered noise burst)
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.5);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 800; bp.Q.value = 2;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0.3, t);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    nSrc.connect(bp); bp.connect(gN); gN.connect(dest);
    nSrc.start(t); nSrc.stop(t + 0.5);
    // 3) Fire crackle (high noise tail)
    const nSrc2 = ctx.createBufferSource(); nSrc2.buffer = noiseBuffer(ctx, 0.8);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
    const gN2 = ctx.createGain();
    gN2.gain.setValueAtTime(0, t);
    gN2.gain.setValueAtTime(0.06, t + 0.1);
    gN2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    nSrc2.connect(hp); hp.connect(gN2); gN2.connect(dest);
    nSrc2.start(t + 0.05); nSrc2.stop(t + 0.8);
  } catch(e) {}
}

// SPLASH — shell hits open water (deep plunge + spray hiss)
function playSplash() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // 1) Water plunge (low thump)
    const plunge = ctx.createOscillator(); const gP = ctx.createGain();
    plunge.type = "sine";
    plunge.frequency.setValueAtTime(120, t);
    plunge.frequency.exponentialRampToValueAtTime(40, t + 0.25);
    gP.gain.setValueAtTime(0.12, t);
    gP.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    plunge.connect(gP); gP.connect(dest);
    plunge.start(t); plunge.stop(t + 0.3);
    // 2) Spray hiss (shaped noise)
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.6);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2500;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(8000, t);
    lp.frequency.exponentialRampToValueAtTime(2000, t + 0.5);
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0, t);
    gN.gain.linearRampToValueAtTime(0.12, t + 0.04);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    nSrc.connect(hp); hp.connect(lp); lp.connect(gN); gN.connect(dest);
    nSrc.start(t); nSrc.stop(t + 0.6);
  } catch(e) {}
}

// SHIP SUNK — massive hull breach & sinking (deep groan + explosion + bubbles)
function playSunk() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // 1) Deep hull groan (descending sawtooth)
    const groan = ctx.createOscillator(); const gG = ctx.createGain();
    groan.type = "sawtooth";
    groan.frequency.setValueAtTime(200, t);
    groan.frequency.exponentialRampToValueAtTime(35, t + 1.2);
    gG.gain.setValueAtTime(0.18, t);
    gG.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    const lpG = ctx.createBiquadFilter(); lpG.type = "lowpass"; lpG.frequency.value = 400;
    groan.connect(lpG); lpG.connect(gG); gG.connect(dest);
    groan.start(t); groan.stop(t + 1.2);
    // 2) Explosion burst (noise + low sine)
    const boom = ctx.createOscillator(); const gB = ctx.createGain();
    boom.type = "sine";
    boom.frequency.setValueAtTime(60, t);
    boom.frequency.exponentialRampToValueAtTime(20, t + 0.6);
    gB.gain.setValueAtTime(0.3, t);
    gB.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    boom.connect(gB); gB.connect(dest);
    boom.start(t); boom.stop(t + 0.6);
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.8);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 500; bp.Q.value = 1;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0.25, t);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    nSrc.connect(bp); bp.connect(gN); gN.connect(dest);
    nSrc.start(t); nSrc.stop(t + 0.8);
    // 3) Sinking bubbles (modulated sine)
    const bub = ctx.createOscillator(); const gBub = ctx.createGain();
    bub.type = "sine";
    bub.frequency.setValueAtTime(300, t + 0.5);
    bub.frequency.setValueAtTime(400, t + 0.6);
    bub.frequency.setValueAtTime(250, t + 0.7);
    bub.frequency.setValueAtTime(350, t + 0.8);
    bub.frequency.setValueAtTime(200, t + 0.9);
    bub.frequency.exponentialRampToValueAtTime(100, t + 1.4);
    gBub.gain.setValueAtTime(0, t);
    gBub.gain.setValueAtTime(0.06, t + 0.5);
    gBub.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    bub.connect(gBub); gBub.connect(dest);
    bub.start(t + 0.5); bub.stop(t + 1.4);
  } catch(e) {}
}

// ALARM — enemy incoming fire (urgent klaxon, two pulses)
function playAlarm() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // Two-pulse klaxon
    for (let p = 0; p < 2; p++) {
      const offset = p * 0.22;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(380, t + offset);
      o.frequency.linearRampToValueAtTime(520, t + offset + 0.08);
      o.frequency.linearRampToValueAtTime(380, t + offset + 0.16);
      g.gain.setValueAtTime(0.14, t + offset);
      g.gain.setValueAtTime(0.14, t + offset + 0.14);
      g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1500;
      o.connect(lp); lp.connect(g); g.connect(dest);
      o.start(t + offset); o.stop(t + offset + 0.2);
    }
    // Impact rumble underneath
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.6);
    const lp2 = ctx.createBiquadFilter(); lp2.type = "lowpass"; lp2.frequency.value = 200;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0.15, t + 0.1);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    nSrc.connect(lp2); lp2.connect(gN); gN.connect(dest);
    nSrc.start(t + 0.1); nSrc.stop(t + 0.6);
  } catch(e) {}
}

// VICTORY — fleet destroyed (triumphant brass fanfare + war drums)
function playVictory() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // Brass-like fanfare (stacked oscillators with harmonics)
    const fanfare = [
      { freq: 262, time: 0, dur: 0.3 },    // C4
      { freq: 330, time: 0.15, dur: 0.3 },  // E4
      { freq: 392, time: 0.3, dur: 0.35 },  // G4
      { freq: 523, time: 0.5, dur: 0.6 },   // C5 (held)
    ];
    fanfare.forEach(({ freq, time, dur }) => {
      // Fundamental
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.value = freq;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = freq * 3;
      g.gain.setValueAtTime(0, t + time);
      g.gain.linearRampToValueAtTime(0.12, t + time + 0.04);
      g.gain.setValueAtTime(0.12, t + time + dur - 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
      o.connect(lp); lp.connect(g); g.connect(dest);
      o.start(t + time); o.stop(t + time + dur);
      // Octave above (brightness)
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = "triangle";
      o2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, t + time);
      g2.gain.linearRampToValueAtTime(0.04, t + time + 0.04);
      g2.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
      o2.connect(g2); g2.connect(dest);
      o2.start(t + time); o2.stop(t + time + dur);
    });
    // War drum hits (4 beats)
    [0, 0.15, 0.3, 0.5].forEach((time) => {
      const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.15);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 150;
      const gD = ctx.createGain();
      gD.gain.setValueAtTime(0.2, t + time);
      gD.gain.exponentialRampToValueAtTime(0.001, t + time + 0.15);
      nSrc.connect(lp); lp.connect(gD); gD.connect(dest);
      nSrc.start(t + time); nSrc.stop(t + time + 0.15);
    });
  } catch(e) {}
}


// ── BACKGROUND MUSIC (Web Audio API) ────────────────────────
// Ambient Cold War submarine tension: drone + sonar sweeps + filtered noise pad
// Returns a handle with a stop() method for cleanup
function startMusic() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return null;
    const dest = getMasterGain(ctx);
    const nodes = []; // track all nodes for cleanup

    // --- 1) SUBMARINE DRONE: two detuned sawtooth oscillators through lowpass ---
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.06;
    const droneLp = ctx.createBiquadFilter();
    droneLp.type = "lowpass"; droneLp.frequency.value = 120; droneLp.Q.value = 2;

    const drone1 = ctx.createOscillator();
    drone1.type = "sawtooth"; drone1.frequency.value = 55; // A1
    const drone2 = ctx.createOscillator();
    drone2.type = "sawtooth"; drone2.frequency.value = 55.8; // slightly detuned for beating

    drone1.connect(droneLp); drone2.connect(droneLp);
    droneLp.connect(droneGain); droneGain.connect(dest);
    drone1.start(); drone2.start();
    nodes.push(drone1, drone2);

    // Slow sub-bass LFO to modulate drone volume (breathing effect)
    const droneLfo = ctx.createOscillator();
    droneLfo.type = "sine"; droneLfo.frequency.value = 0.15; // one cycle every ~7s
    const droneLfoGain = ctx.createGain();
    droneLfoGain.gain.value = 0.025; // subtle modulation depth
    droneLfo.connect(droneLfoGain);
    droneLfoGain.connect(droneGain.gain);
    droneLfo.start();
    nodes.push(droneLfo);

    // --- 2) SONAR SWEEP: periodic ping that fades in/out every ~8s ---
    const sonarGain = ctx.createGain();
    sonarGain.gain.value = 0;
    const sonarBp = ctx.createBiquadFilter();
    sonarBp.type = "bandpass"; sonarBp.frequency.value = 1000; sonarBp.Q.value = 12;
    const sonarOsc = ctx.createOscillator();
    sonarOsc.type = "sine"; sonarOsc.frequency.value = 900;

    // Slow frequency LFO for sweep (800-1200 Hz range)
    const sonarFreqLfo = ctx.createOscillator();
    sonarFreqLfo.type = "sine"; sonarFreqLfo.frequency.value = 0.08;
    const sonarFreqDepth = ctx.createGain();
    sonarFreqDepth.gain.value = 200;
    sonarFreqLfo.connect(sonarFreqDepth);
    sonarFreqDepth.connect(sonarOsc.frequency);

    // Amplitude LFO — makes the sonar fade in/out periodically
    const sonarAmpLfo = ctx.createOscillator();
    sonarAmpLfo.type = "sine"; sonarAmpLfo.frequency.value = 0.12; // ~8s cycle
    const sonarAmpDepth = ctx.createGain();
    sonarAmpDepth.gain.value = 0.025;
    sonarAmpLfo.connect(sonarAmpDepth);
    sonarAmpDepth.connect(sonarGain.gain);

    sonarOsc.connect(sonarBp); sonarBp.connect(sonarGain); sonarGain.connect(dest);
    sonarOsc.start(); sonarFreqLfo.start(); sonarAmpLfo.start();
    nodes.push(sonarOsc, sonarFreqLfo, sonarAmpLfo);

    // --- 3) TENSION PAD: filtered noise with slow amplitude modulation ---
    // Use a ScriptProcessorNode replacement: looping noise buffer
    const padDuration = 8; // seconds of noise buffer (loops)
    const padBuf = noiseBuffer(ctx, padDuration);
    const padSrc = ctx.createBufferSource();
    padSrc.buffer = padBuf; padSrc.loop = true;

    const padLp = ctx.createBiquadFilter();
    padLp.type = "lowpass"; padLp.frequency.value = 400; padLp.Q.value = 1;
    const padHp = ctx.createBiquadFilter();
    padHp.type = "highpass"; padHp.frequency.value = 80;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.035;

    // Slow amplitude modulation for eerie breathing effect
    const padLfo = ctx.createOscillator();
    padLfo.type = "sine"; padLfo.frequency.value = 0.1; // ~10s cycle
    const padLfoDepth = ctx.createGain();
    padLfoDepth.gain.value = 0.015;
    padLfo.connect(padLfoDepth);
    padLfoDepth.connect(padGain.gain);

    padSrc.connect(padHp); padHp.connect(padLp); padLp.connect(padGain); padGain.connect(dest);
    padSrc.start(); padLfo.start();
    nodes.push(padSrc, padLfo);

    // --- 4) LOW HEARTBEAT: very subtle rhythmic pulse ---
    const heartOsc = ctx.createOscillator();
    heartOsc.type = "sine"; heartOsc.frequency.value = 40; // sub-bass thump
    const heartGain = ctx.createGain();
    heartGain.gain.value = 0;
    const heartLfo = ctx.createOscillator();
    heartLfo.type = "square"; heartLfo.frequency.value = 0.8; // ~48 bpm
    const heartLfoGain = ctx.createGain();
    heartLfoGain.gain.value = 0.04;
    heartLfo.connect(heartLfoGain);
    heartLfoGain.connect(heartGain.gain);

    const heartLp = ctx.createBiquadFilter();
    heartLp.type = "lowpass"; heartLp.frequency.value = 80;
    heartOsc.connect(heartLp); heartLp.connect(heartGain); heartGain.connect(dest);
    heartOsc.start(); heartLfo.start();
    nodes.push(heartOsc, heartLfo);

    return {
      nodes,
      gains: [droneGain, sonarGain, padGain, heartGain],
      stop() {
        // Fade out over 1.5s then disconnect
        const t = ctx.currentTime;
        [droneGain, sonarGain, padGain, heartGain].forEach(g => {
          try { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 1.5); } catch(e) {}
        });
        setTimeout(() => {
          nodes.forEach(n => { try { n.stop(); } catch(e) {} });
          nodes.forEach(n => { try { n.disconnect(); } catch(e) {} });
          [droneGain, sonarGain, padGain, heartGain, droneLp, sonarBp, padLp, padHp, heartLp, droneLfoGain, sonarFreqDepth, sonarAmpDepth, padLfoDepth, heartLfoGain].forEach(n => { try { n.disconnect(); } catch(e) {} });
        }, 1600);
      },
    };
  } catch(e) { return null; }
}


// ── SHIP DRAWING (Canvas) ───────────────────────────────────
// Draws top-down ship silhouettes in CRT green style
function drawShip(ctx, x, y, cellSize, size, horizontal, code, isHit, isSunk) {
  const color = isSunk ? "rgba(255, 42, 42, 0.4)" : isHit ? "rgba(255, 42, 42, 0.6)" : "rgba(57, 255, 20, 0.5)";
  const borderColor = isSunk ? "rgba(255, 42, 42, 0.5)" : isHit ? "rgba(255, 42, 42, 0.7)" : "rgba(57, 255, 20, 0.7)";
  const glowColor = isSunk ? "rgba(255, 42, 42, 0.15)" : "rgba(57, 255, 20, 0.15)";

  ctx.save();

  const totalW = horizontal ? cellSize * size : cellSize;
  const totalH = horizontal ? cellSize : cellSize * size;
  const pad = 3;

  // Glow
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;

  // Hull shape — pointed bow
  ctx.beginPath();
  if (horizontal) {
    // Points right
    ctx.moveTo(x + pad, y + pad + 4);
    ctx.lineTo(x + totalW - pad - 6, y + pad);
    ctx.lineTo(x + totalW - pad, y + totalH / 2);
    ctx.lineTo(x + totalW - pad - 6, y + totalH - pad);
    ctx.lineTo(x + pad, y + totalH - pad - 4);
    ctx.quadraticCurveTo(x + pad - 2, y + totalH / 2, x + pad, y + pad + 4);
  } else {
    // Points up
    ctx.moveTo(x + pad + 4, y + pad);
    ctx.lineTo(x + totalW - pad - 4, y + pad);
    ctx.quadraticCurveTo(x + totalW / 2, y + pad - 2, x + pad + 4, y + pad);
    ctx.moveTo(x + pad + 4, y + pad);
    ctx.lineTo(x + pad, y + pad + 6);
    ctx.lineTo(x + pad, y + totalH - pad - 6);
    ctx.lineTo(x + totalW / 2, y + totalH - pad);
    ctx.lineTo(x + totalW - pad, y + totalH - pad - 6);
    ctx.lineTo(x + totalW - pad, y + pad + 6);
    ctx.lineTo(x + totalW - pad - 4, y + pad);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Bridge / superstructure detail
  const bridgeColor = isSunk ? "rgba(255, 42, 42, 0.3)" : "rgba(57, 255, 20, 0.35)";
  if (horizontal) {
    const bx = x + cellSize * Math.floor(size / 2) + cellSize * 0.2;
    const by = y + totalH * 0.25;
    ctx.fillStyle = bridgeColor;
    ctx.fillRect(bx, by, cellSize * 0.6, totalH * 0.5);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, by, cellSize * 0.6, totalH * 0.5);
  } else {
    const bx = x + totalW * 0.25;
    const by = y + cellSize * Math.floor(size / 2) + cellSize * 0.2;
    ctx.fillStyle = bridgeColor;
    ctx.fillRect(bx, by, totalW * 0.5, cellSize * 0.6);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, by, totalW * 0.5, cellSize * 0.6);
  }

  // Ship code label
  ctx.font = `bold ${Math.max(8, cellSize * 0.28)}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = isSunk ? "rgba(255, 42, 42, 0.6)" : "rgba(57, 255, 20, 0.8)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(code, x + totalW / 2, y + totalH / 2);

  ctx.restore();
}


// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function CRTOverlay() {
  return (
    <>
      <div className="ocean-bg" />
      <div className="vignette" />
      <div className="crt-overlay" />
    </>
  );
}

function Header({ subtitle }) {
  return (
    <div className="header">
      <div className="header-classification">⚠ TOP SECRET // OPERATION RED TIDE</div>
      <h1>BATTLESHIP<br />COMMAND</h1>
      <div className="header-subtitle">{subtitle || "NORTH ATLANTIC THEATRE — AI LITERACY & FOUNDATIONS DIVISION"}</div>
    </div>
  );
}

function VolumeSlider({ volume, onVolumeChange, muted, onToggleMute }) {
  const icon = muted || volume === 0 ? "\u{1F507}" : volume > 50 ? "\u{1F50A}" : "\u{1F509}";
  return (
    <div className="status-item volume-control">
      <button className="volume-icon" onClick={onToggleMute} title={muted ? "Unmute" : "Mute"}>{icon}</button>
      <input type="range" className="volume-slider" min={0} max={100}
        value={muted ? 0 : volume}
        onChange={e => onVolumeChange(Number(e.target.value))} />
    </div>
  );
}

function StatusBar({ phase, turnNumber, score, accuracy, questionsLeft, totalQuestions, volume, onVolumeChange, muted, onToggleMute }) {
  const phaseName = phase === "targeting" ? "SELECT TARGET" : phase === "answering" ? "INTEL CHECK" : "RESOLVING";
  return (
    <div className="status-bar">
      <div className="status-item">
        <div className="status-dot" />
        <div>
          <div className="status-label">Status</div>
          <div className="phase-indicator">
            <span className={`phase-dot ${phase}`} />
            <span style={{ color: phase === "answering" ? "var(--soviet-gold)" : "var(--crt-green)" }}>{phaseName}</span>
          </div>
        </div>
      </div>
      <div className="status-item"><div><div className="status-label">Turn</div><div className="status-value">{turnNumber}</div></div></div>
      <div className="status-item"><div><div className="status-label">Score</div><div className="score-display">{score}</div></div></div>
      <div className="status-item"><div><div className="status-label">Accuracy</div><div className="status-value">{accuracy}%</div></div></div>
      <div className="status-item"><div><div className="status-label">Intel Remaining</div><div className={`status-value ${questionsLeft <= 5 ? "warning" : ""}`}>{questionsLeft}/{totalQuestions}</div></div></div>
      <VolumeSlider volume={volume} onVolumeChange={onVolumeChange} muted={muted} onToggleMute={onToggleMute} />
    </div>
  );
}

function generateBlipPool() {
  const pool = [];
  const used = new Set();
  while (pool.length < 3) {
    const row = Math.floor(Math.random() * 8);
    const col = Math.floor(Math.random() * 8);
    const k = `${row}-${col}`;
    if (used.has(k)) continue;
    used.add(k);
    const bx = (col + 1.5) / 9 * 100 - 50;
    const by = (row + 1.5) / 9 * 100 - 50;
    const angle = (Math.atan2(by, bx) * 180 / Math.PI + 360) % 360;
    pool.push({ row, col, angle, k });
  }
  return pool;
}

function RadarBlips() {
  const [activeBlips, setActiveBlips] = useState([]);
  const mountTime = useRef(Date.now());
  const poolRef = useRef(generateBlipPool());
  const triggeredRef = useRef(new Set());
  const lastAngleRef = useRef(0);
  const lastRotationRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - mountTime.current;
      const sweepAngle = (elapsed % 6000) / 6000 * 360;
      const rotation = Math.floor(elapsed / 6000);
      const last = lastAngleRef.current;

      // Refresh blip pool every 2 rotations
      if (rotation !== lastRotationRef.current && rotation % 2 === 0) {
        poolRef.current = generateBlipPool();
        triggeredRef.current.clear();
      }
      lastRotationRef.current = rotation;

      poolRef.current.forEach(blip => {
        const tk = `${blip.k}-${rotation}`;
        if (triggeredRef.current.has(tk)) return;

        let crossed;
        if (sweepAngle >= last) {
          crossed = blip.angle >= last && blip.angle < sweepAngle;
        } else {
          crossed = blip.angle >= last || blip.angle < sweepAngle;
        }

        if (crossed) {
          triggeredRef.current.add(tk);
          setActiveBlips(prev => [
            ...prev.filter(b => Date.now() - b.at < 5500),
            { row: blip.row, col: blip.col, at: Date.now(), id: `${Date.now()}-${blip.k}` },
          ]);
        }
      });

      lastAngleRef.current = sweepAngle;
    }, 80);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      {activeBlips.map(b => (
        <div
          key={b.id}
          className="radar-blip"
          style={{
            left: `${(b.col + 1.5) / 9 * 100}%`,
            top: `${(b.row + 1.5) / 9 * 100}%`,
          }}
        />
      ))}
    </>
  );
}

function BattleGrid({ gridData, shots, targetCell, onCellClick, onCellHover, disabled, explosions, showShips, shipPlacements, shipCanvas }) {
  return (
    <div className="grid-wrapper">
      <div className="battle-grid">
        <div className="grid-label grid-corner" />
        {Array.from({ length: GRID_SIZE }, (_, i) => <div key={`ch-${i}`} className="grid-label">{i + 1}</div>)}
        {Array.from({ length: GRID_SIZE }, (_, row) => (
          <React.Fragment key={`row-${row}`}>
            <div className="grid-label">{LETTERS[row]}</div>
            {Array.from({ length: GRID_SIZE }, (_, col) => {
              const shot = shots.find(s => s.row === row && s.col === col);
              const hasShip = showShips && gridData && gridData[row][col] !== null;
              let cellClass = "grid-cell";
              if (shot) {
                if (shot.sunk) cellClass += " cell-sunk";
                else if (shot.hit) cellClass += " cell-hit";
                else cellClass += " cell-miss";
              } else if (hasShip && showShips) {
                // Check if this ship is sunk
                const shipCode = gridData[row][col];
                const ship = shipPlacements?.find(s => s.code === shipCode);
                if (ship && ship.hits >= ship.size) cellClass += " cell-ship-sunk";
                else cellClass += " cell-ship";
              }
              if (targetCell && targetCell.row === row && targetCell.col === col && !shot) cellClass += " cell-targeting";
              if (disabled || shot) cellClass += " disabled";
              return (
                <div key={`cell-${row}-${col}`} className={cellClass}
                  onClick={() => !disabled && !shot && onCellClick && onCellClick(row, col)}
                  onMouseEnter={() => !disabled && !shot && onCellHover && onCellHover(row, col)}
                  onMouseLeave={() => onCellHover && onCellHover(null, null)} />
              );
            })}
          </React.Fragment>
        ))}
        {/* Sunk ship image overlays — in separate container */}
        <div className="ship-overlay-container">
          {showShips && shipPlacements?.filter(s => s.hits >= s.size).map(ship => (
            <ShipOverlay key={`overlay-${ship.code}`}
              shipCode={ship.code}
              row={ship.cells[0][0]}
              col={ship.cells[0][1]}
              size={ship.size}
              horizontal={ship.horizontal}
              isSunk
              noLabels
            />
          ))}
        </div>
      </div>
      <div className="radar-scope" />
      <div className="radar-overlay"><div className="radar-sweep" /></div>
      <div className="sonar-container">
        <RadarBlips />
      </div>
      <div className="explosion-overlay">
        {(explosions || []).map((e, i) => (
          <div key={i} className={`explosion-ring ${e.hit ? "hit" : "miss"}`}
            style={{ left: `${(e.col+1)/(GRID_SIZE+1)*100}%`, top: `${(e.row+1)/(GRID_SIZE+1)*100}%`, transform: "translate(-50%, -50%)" }} />
        ))}
      </div>
    </div>
  );
}

function TargetReadout({ targetCell }) {
  if (!targetCell) return <div className="target-readout">AWAITING TARGET COORDINATES...</div>;
  return (
    <div className="target-readout target-locked">
      <div className="target-locked-coord">
        TARGET LOCKED: <span className="coord">{LETTERS[targetCell.row]}{targetCell.col + 1}</span>
      </div>
      <div className="target-confirm-msg">▼ CLICK AGAIN TO FIRE ▼</div>
    </div>
  );
}

function QuestionPanel({ question, questionIndex, totalQuestions, onAnswer, answered, selectedAnswer, wasCorrect }) {
  if (!question) return null;
  const ismc = question.type === "multiple_choice";
  const istf = question.type === "true_false";
  return (
    <div className="question-panel">
      <div className="question-header">
        <div className="question-number">Intel Intercept #{questionIndex + 1}</div>
        <div className="question-type-badge">{ismc ? "Multiple Choice" : "True / False"}</div>
      </div>
      <div className="question-prompt">{question.prompt}</div>
      {ismc && <div>
        {question.options.map((opt, i) => {
          let cls = "option-btn";
          if (answered) {
            if (i === question.correctIndex) cls += " correct";
            else if (i === selectedAnswer && !wasCorrect) cls += " incorrect";
            else cls += " reveal-correct";
          }
          return <button key={i} className={cls} onClick={() => !answered && onAnswer(i)} disabled={answered}>
            <span className="option-letter">{String.fromCharCode(65 + i)}.</span> {opt}
          </button>;
        })}
      </div>}
      {istf && <div className="tf-buttons">
        {[true, false].map(val => {
          let cls = "tf-btn";
          if (answered) {
            if (val === question.correctAnswer) cls += " correct";
            else if (val === selectedAnswer && !wasCorrect) cls += " incorrect";
          }
          return <button key={String(val)} className={cls} onClick={() => !answered && onAnswer(val)} disabled={answered}>
            {val ? "TRUE" : "FALSE"}
          </button>;
        })}
      </div>}
      {answered && question.explanation && (
        <div className="explanation-box"><strong style={{ color: "var(--crt-green)" }}>INTEL: </strong>{question.explanation}</div>
      )}
    </div>
  );
}

function FleetStatus({ placements, label }) {
  return (
    <div className="intel-panel">
      <div className="intel-title">{label || "Enemy Fleet Status"}</div>
      {placements.map(ship => {
        const isSunk = ship.hits >= ship.size;
        return (
          <div key={ship.code + ship.name} className="ship-row">
            <ShipSilhouette shipCode={ship.code} isSunk={isSunk} />
            <div className={`ship-name ${isSunk ? "sunk" : ""}`}>{ship.name}</div>
            <div className="ship-cells">
              {Array.from({ length: ship.size }, (_, i) => (
                <div key={i} className={`ship-cell-indicator ${isSunk ? "sunk-cell" : i < ship.hits ? "damaged" : ""}`} />
              ))}
            </div>
            {isSunk && <span style={{ fontSize: 9, color: "var(--soviet-red)", letterSpacing: 1 }}>SUNK</span>}
          </div>
        );
      })}
    </div>
  );
}

function GridLegend() {
  return (
    <div className="intel-panel">
      <div className="intel-title">Grid Legend</div>
      <div className="legend-row"><div className="legend-swatch swatch-empty" /><span>Unexplored</span></div>
      <div className="legend-row"><div className="legend-swatch swatch-hit">✕</div><span style={{ color: "#ff4444" }}>Hit — Enemy ship detected</span></div>
      <div className="legend-row"><div className="legend-swatch swatch-miss">●</div><span style={{ color: "#5eaad4" }}>Miss — Open water</span></div>
      <div className="legend-row"><div className="legend-swatch swatch-sunk">☠</div><span style={{ color: "#ff6a3d" }}>Sunk — Ship destroyed</span></div>
    </div>
  );
}

function MessageLog({ messages }) {
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages]);
  return (
    <div className="intel-panel">
      <div className="intel-title">Combat Log</div>
      <div className="message-log" ref={logRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`log-entry log-${msg.type}`}>
            <span className="log-time">{msg.time}</span>{msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── INTRO SCREEN ────────────────────────────────────────────
function IntroScreen({ onStart, user, authError, onSignIn, onSignOut }) {
  return (
    <div className="overlay-screen">
      <CRTOverlay />
      <div className="overlay-content" style={{ zIndex: 101 }}>
        <div className="header-classification" style={{ marginBottom: 16 }}>⚠ EYES ONLY // CINCLANTFLT</div>
        <h2 style={{ color: "var(--crt-green)", textShadow: "0 0 20px var(--crt-green-glow)", animation: "glowPulse 3s ease-in-out infinite" }}>
          OPERATION<br />RED TIDE
        </h2>
        <p style={{ color: "var(--crt-green-dim)", fontSize: 13, lineHeight: 1.7, margin: "16px 0", maxWidth: 460, marginInline: "auto" }}>
          COMINT has detected a Soviet naval formation in the North Atlantic.
          Your mission: locate and destroy all enemy vessels before they sink your fleet.
          <br /><br />
          Each turn, you select a target and decode intercepted intelligence on{" "}
          <span style={{ color: "var(--crt-green)" }}>AI literacy, bias, and neural networks</span>.
          Correct intel authorizes your strike. Wrong answers cancel your attack.
          <br /><br />
          <span style={{ color: "var(--soviet-red)" }}>WARNING:</span> The enemy returns fire every turn regardless. Protect your fleet.
        </p>

        {/* Auth section */}
        {!user ? (
          <div className="auth-section">
            <button className="google-sign-in-btn" onClick={onSignIn}>
              Sign In with Google
            </button>
            {authError && (
              <div className="auth-error">{authError}</div>
            )}
            <div className="auth-hint">Use your @paps.net school account</div>
          </div>
        ) : (
          <div className="auth-section">
            <div className="auth-status">
              <span className="auth-user">{user.displayName || user.email}</span>
              <button className="auth-signout" onClick={onSignOut}>Sign Out</button>
            </div>
          </div>
        )}

        <SchematicFleet ships={SHIPS} currentShipIdx={-1} placements={[]} compact />
        <button className="start-btn" onClick={onStart} disabled={!user}>BEGIN OPERATION</button>
      </div>
    </div>
  );
}


// ── PLACEMENT PHASE ─────────────────────────────────────────
function PlacementPhase({ onComplete }) {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [placements, setPlacements] = useState([]);
  const [currentShipIdx, setCurrentShipIdx] = useState(0);
  const [horizontal, setHorizontal] = useState(true);
  const [hoverCells, setHoverCells] = useState([]);

  const currentShip = currentShipIdx < SHIPS.length ? SHIPS[currentShipIdx] : null;
  const allPlaced = placements.length === SHIPS.length;

  // Keyboard shortcuts: H = horizontal, V = vertical, R = toggle
  useEffect(() => {
    const handler = (e) => {
      if (allPlaced) return;
      const k = e.key.toLowerCase();
      if (k === "h") setHorizontal(true);
      else if (k === "v") setHorizontal(false);
      else if (k === "r") setHorizontal(h => !h);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allPlaced]);

  const handleCellHover = useCallback((row, col) => {
    if (!currentShip || allPlaced) { setHoverCells([]); return; }
    const cells = [];
    let valid = true;
    for (let i = 0; i < currentShip.size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      if (r >= GRID_SIZE || c >= GRID_SIZE || grid[r][c] !== null) { valid = false; break; }
      cells.push([r, c]);
    }
    setHoverCells(valid ? cells : []);
  }, [currentShip, horizontal, grid, allPlaced]);

  const handleCellClick = useCallback((row, col) => {
    if (!currentShip || allPlaced) return;
    if (!canPlaceShip(grid, row, col, currentShip.size, horizontal)) return;

    const newGrid = grid.map(r => [...r]);
    const cells = [];
    for (let i = 0; i < currentShip.size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      newGrid[r][c] = currentShip.code;
      cells.push([r, c]);
    }
    setGrid(newGrid);
    setPlacements(prev => [...prev, { ...currentShip, cells, hits: 0, horizontal }]);
    setCurrentShipIdx(prev => prev + 1);
    setHoverCells([]);
  }, [currentShip, horizontal, grid, allPlaced]);

  const handleRandomize = useCallback(() => {
    const { grid: newGrid, placements: newPlacements } = placeShipsRandomly();
    setGrid(newGrid);
    setPlacements(newPlacements);
    setCurrentShipIdx(SHIPS.length);
    setHoverCells([]);
  }, []);

  const handleReset = useCallback(() => {
    setGrid(createEmptyGrid());
    setPlacements([]);
    setCurrentShipIdx(0);
    setHoverCells([]);
  }, []);

  return (
    <>
      <CRTOverlay />
      <div className="app-container">
        <Header subtitle="FLEET DEPLOYMENT — POSITION YOUR VESSELS" />
        <div className="placement-layout">
          {/* Left column: Ship schematics */}
          <SchematicFleet
            ships={SHIPS}
            currentShipIdx={currentShipIdx}
            placements={placements}
            onSelect={(idx) => {
              if (idx < placements.length || idx > placements.length) return;
              setCurrentShipIdx(idx);
            }}
          />

          {/* Right column: Controls + Grid */}
          <div className="placement-main">
            <div style={{ margin: "12px 0", color: "var(--crt-green-dim)", fontSize: 13, letterSpacing: 1 }}>
              {currentShip ? (
                <>Deploying: <span style={{ color: "var(--crt-green)", fontWeight: "bold" }}>{currentShip.name} ({currentShip.size} cells)</span> — Click grid to place</>
              ) : allPlaced ? (
                <span style={{ color: "var(--crt-green)" }}>All vessels deployed. Ready for combat.</span>
              ) : null}
            </div>

            <div className="placement-controls">
              <button className="placement-action-btn" onClick={() => setHorizontal(h => !h)} disabled={allPlaced}>
                ↻ ROTATE (R)
              </button>
              <button className="placement-action-btn" onClick={handleRandomize}>Random</button>
              <button className="placement-action-btn" onClick={handleReset}>Reset</button>
            </div>

            <div className="grid-panel" style={{ display: "inline-block" }}>
              <div className="grid-panel-title">Your Fleet — Deployment Grid</div>
              <div className="battle-grid">
                <div className="grid-label grid-corner" />
                {Array.from({ length: GRID_SIZE }, (_, i) => <div key={`ch-${i}`} className="grid-label">{i + 1}</div>)}
                {Array.from({ length: GRID_SIZE }, (_, row) => (
                  <React.Fragment key={`row-${row}`}>
                    <div className="grid-label">{LETTERS[row]}</div>
                    {Array.from({ length: GRID_SIZE }, (_, col) => {
                      const hasShip = grid[row][col] !== null;
                      const isHover = hoverCells.some(([r, c]) => r === row && c === col);
                      let cls = "grid-cell";
                      if (hasShip) cls += " cell-ship";
                      return (
                        <div key={`cell-${row}-${col}`} className={cls}
                          style={isHover ? { background: "rgba(57,255,20,0.2)", borderColor: "rgba(57,255,20,0.4)" } : {}}
                          onClick={() => handleCellClick(row, col)}
                          onMouseEnter={() => handleCellHover(row, col)}
                          onMouseLeave={() => setHoverCells([])}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
                {/* Ship image overlays — in separate container to avoid disrupting grid auto-placement */}
                <div className="ship-overlay-container">
                  {placements.map(ship => (
                    <ShipOverlay key={ship.code}
                      shipCode={ship.code}
                      row={ship.cells[0][0]}
                      col={ship.cells[0][1]}
                      size={ship.size}
                      horizontal={ship.horizontal}
                      noLabels
                    />
                  ))}
                </div>
              </div>
            </div>

            {allPlaced && (
              <div style={{ marginTop: 20 }}>
                <button className="start-btn" onClick={() => onComplete(grid, placements)}>
                  COMMENCE OPERATION
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


// ── GAME OVER SCREEN ────────────────────────────────────────
function GameOverScreen({ stats, user, onRestart }) {
  const { outcome } = stats;
  const isVictory = outcome === "decisive_victory" || outcome === "attrition_victory";

  const outcomeConfig = {
    decisive_victory: {
      badge: "✦ MISSION COMPLETE ✦",
      badgeStyle: { borderColor: "var(--crt-green)", color: "var(--crt-green)", background: "rgba(57,255,20,0.1)" },
      title: "ENEMY FLEET\nDESTROYED",
      subtitle: null,
      className: "victory",
    },
    attrition_victory: {
      badge: "✦ TACTICAL VICTORY ✦",
      badgeStyle: { borderColor: "var(--soviet-gold)", color: "var(--soviet-gold)", background: "rgba(255,204,0,0.1)" },
      title: "VICTORY BY\nATTRITION",
      subtitle: "All intel exhausted. Fleet command has assessed the engagement — enemy losses exceed our own. Tactical victory declared.",
      className: "victory",
    },
    withdrawal: {
      badge: "OPERATION CONCLUDED",
      badgeStyle: {},
      title: "FLEET\nWITHDRAWING",
      subtitle: "Ammunition depleted. Fleet withdrawing to regroup with main formation. Enemy remains operational.",
      className: "defeat",
    },
    defeat: {
      badge: "☭ MISSION FAILED",
      badgeStyle: {},
      title: "FLEET\nDESTROYED",
      subtitle: "Your fleet has been sunk. The enemy escapes.",
      className: "defeat",
    },
  };

  const cfg = outcomeConfig[outcome];

  return (
    <div className="overlay-screen">
      <CRTOverlay />
      <div className={`overlay-content ${cfg.className}`} style={{ zIndex: 101 }}>
        <div className="header-classification" style={cfg.badgeStyle}>{cfg.badge}</div>
        {user && (
          <div style={{ fontSize: 11, color: "var(--crt-green-dim)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            OPERATOR: {user.displayName || user.email}
          </div>
        )}
        <h2>{cfg.title.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
        {cfg.subtitle && (
          <p style={{ color: isVictory ? "var(--crt-green-dim)" : "var(--soviet-red)", fontSize: 12, opacity: 0.7, marginBottom: 8, maxWidth: 400, marginInline: "auto", lineHeight: 1.6 }}>
            {cfg.subtitle}
          </p>
        )}

        {/* Damage comparison */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, margin: "16px 0", fontSize: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--crt-green)", fontSize: 24, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>{stats.playerHitsDealt}</div>
            <div style={{ color: "var(--crt-green-dim)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Hits Dealt</div>
          </div>
          <div style={{ textAlign: "center", alignSelf: "center", color: "var(--crt-green-dim)", fontSize: 11 }}>vs</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--soviet-red)", fontSize: 24, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>{stats.enemyHitsDealt}</div>
            <div style={{ color: "var(--crt-green-dim)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Hits Received</div>
          </div>
        </div>

        <div className="overlay-stats" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.accuracy}%</div>
            <div className="overlay-stat-label">Intel Accuracy</div>
          </div>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.enemyShipsSunk}/{SHIPS.length}</div>
            <div className="overlay-stat-label">Enemy Sunk</div>
          </div>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.playerShipsSurvived}/{SHIPS.length}</div>
            <div className="overlay-stat-label">Your Fleet Survived</div>
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ background: "rgba(57,255,20,0.04)", border: "1px solid var(--panel-border)", padding: 16, margin: "12px 0", textAlign: "left" }}>
          <div style={{ fontSize: 10, color: "var(--crt-green-dim)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Score Breakdown</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--crt-green-dim)", padding: "4px 0" }}>
            <span>Combat Points</span><span style={{ color: "var(--crt-green)" }}>{stats.combatScore}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--crt-green-dim)", padding: "4px 0" }}>
            <span>Fleet Survival Bonus</span><span style={{ color: "var(--crt-green)" }}>+{stats.survivalBonus}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--crt-green-dim)", padding: "4px 0" }}>
            <span>{outcome === "decisive_victory" ? "Decisive Victory Bonus" : outcome === "attrition_victory" ? "Attrition Victory Bonus" : "Victory Bonus"}</span>
            <span style={{ color: stats.victoryBonus > 0 ? "var(--soviet-gold)" : "var(--crt-green-dim)" }}>+{stats.victoryBonus}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "var(--crt-green)", fontWeight: "bold", padding: "8px 0 0", borderTop: "1px solid var(--panel-border)", marginTop: 4 }}>
            <span>TOTAL SCORE</span><span>{stats.totalScore}</span>
          </div>
        </div>

        {/* Grade bracket */}
        {(() => {
          const t = stats.totalScore;
          const grade = t >= 2500 ? { pct: "100%", label: "REFINING", color: "var(--crt-green)" }
            : t >= 1800 ? { pct: "85%", label: "DEVELOPING", color: "var(--crt-green)" }
            : t >= 1200 ? { pct: "75%", label: "APPROACHING", color: "var(--soviet-gold)" }
            : t >= 600 ? { pct: "65%", label: "EMERGING", color: "var(--soviet-gold)" }
            : { pct: "55%", label: "MISSING", color: "var(--soviet-red)" };
          return (
            <div style={{ textAlign: "center", margin: "12px 0 4px", padding: "12px 16px", background: "rgba(57,255,20,0.04)", border: `1px solid ${grade.color}33` }}>
              <div style={{ fontSize: 9, color: "var(--crt-green-dim)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Mission Grade</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 36, fontWeight: 700, color: grade.color, lineHeight: 1 }}>{grade.pct}</div>
              <div style={{ fontSize: 10, color: grade.color, letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>{grade.label}</div>
            </div>
          );
        })()}

        <button className="start-btn" onClick={onRestart}>NEW OPERATION</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN GAME COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function BattleshipQuiz({ questions = SAMPLE_QUESTIONS, onGameOver, user, authError, onSignIn, onSignOut }) {
  const [gameState, setGameState] = useState("intro"); // intro | placement | playing | enemyAttack | gameover
  const [enemyGrid, setEnemyGrid] = useState(null);
  const [enemyPlacements, setEnemyPlacements] = useState([]);
  const [playerGrid, setPlayerGrid] = useState(null);
  const [playerPlacements, setPlayerPlacements] = useState([]);

  const [shots, setShots] = useState([]); // player shots on enemy grid
  const [playerShots, setPlayerShots] = useState([]); // enemy shots on player grid

  const [phase, setPhase] = useState("targeting"); // targeting | answering
  const [targetCell, setTargetCell] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(false);

  const [score, setScore] = useState(0);
  const [turnNumber, setTurnNumber] = useState(1);
  const [messages, setMessages] = useState([]);
  const [explosions, setExplosions] = useState([]);

  const [enemyAttackResult, setEnemyAttackResult] = useState(null);
  const enemyAIRef = useRef(null);

  // ── AUDIO: volume + music ──
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("battleship-volume");
    return saved !== null ? Number(saved) : 50;
  });
  const [muted, setMuted] = useState(() => localStorage.getItem("battleship-muted") === "true");
  const musicRef = useRef(null);

  // Sync master gain whenever volume/muted changes
  useEffect(() => {
    if (masterGain) {
      masterGain.gain.value = muted ? 0 : volume / 100;
    }
    localStorage.setItem("battleship-volume", String(volume));
    localStorage.setItem("battleship-muted", String(muted));
  }, [volume, muted]);

  // Start music when battle begins, stop on game over or unmount
  useEffect(() => {
    if (gameState === "playing" && !musicRef.current) {
      // Small delay so audio context is active (user gesture already happened)
      const id = setTimeout(() => { musicRef.current = startMusic(); }, 300);
      return () => clearTimeout(id);
    }
    if (gameState === "gameover" || gameState === "intro") {
      if (musicRef.current) { musicRef.current.stop(); musicRef.current = null; }
    }
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (musicRef.current) { musicRef.current.stop(); musicRef.current = null; } };
  }, []);

  const handleVolumeChange = useCallback((v) => { setVolume(v); if (v > 0) setMuted(false); }, []);
  const handleToggleMute = useCallback(() => setMuted(m => !m), []);

  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  const questionsLeft = questionQueue.length - currentQuestionIdx;

  const addMessage = useCallback((text, type = "system") => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setMessages(prev => [...prev.slice(-50), { text, type, time }]);
  }, []);

  // ── START GAME (from intro) ────────
  const goToPlacement = useCallback(() => {
    setGameState("placement");
  }, []);

  // ── PLACEMENT COMPLETE ─────────────
  const handlePlacementComplete = useCallback((pGrid, pPlacements) => {
    const enemy = placeShipsRandomly();
    setEnemyGrid(enemy.grid);
    setEnemyPlacements(enemy.placements);
    setPlayerGrid(pGrid);
    setPlayerPlacements(pPlacements);
    setShots([]);
    setPlayerShots([]);
    setPhase("targeting");
    setTargetCell(null);
    setHoverCell(null);
    setQuestionQueue(shuffleQuestionOptions(shuffleArray(questions)));
    setCurrentQuestionIdx(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setWasCorrect(false);
    setScore(0);
    setTurnNumber(1);
    setMessages([]);
    setExplosions([]);
    setEnemyAttackResult(null);
    enemyAIRef.current = createEnemyAI();
    setGameState("playing");
    setTimeout(() => {
      addMessage("OPERATION RED TIDE initiated. Locate and destroy all enemy vessels.", "system");
      addMessage("⚠ Enemy fleet will return fire every turn. Protect your ships.", "system");
      addMessage("Select a target on the grid to begin.", "system");
    }, 100);
  }, [questions, addMessage]);

  // ── CELL CLICK (targeting) ─────────
  const handleCellClick = useCallback((row, col) => {
    if (phase !== "targeting") return;
    if (targetCell && targetCell.row === row && targetCell.col === col) {
      playPing();
      setPhase("answering");
      addMessage(`Targeting ${LETTERS[row]}${col + 1} — awaiting intel verification...`, "system");
    } else {
      setTargetCell({ row, col });
    }
  }, [phase, targetCell, addMessage]);

  const handleCellHover = useCallback((row, col) => {
    if (row === null) setHoverCell(null);
    else setHoverCell({ row, col });
  }, []);

  // ── ANSWER QUESTION ────────────────
  const handleAnswer = useCallback((answer) => {
    const q = questionQueue[currentQuestionIdx];
    let correct = false;
    if (q.type === "multiple_choice") correct = answer === q.correctIndex;
    else correct = answer === q.correctAnswer;
    setSelectedAnswer(answer);
    setWasCorrect(correct);
    setAnswered(true);
    setQuestionsAnswered(prev => prev + 1);
    if (correct) setCorrectAnswers(prev => prev + 1);
  }, [questionQueue, currentQuestionIdx]);

  // ── ENEMY FIRES ────────────────────
  const doEnemyFire = useCallback(() => {
    if (!playerGrid || !enemyAIRef.current) return;
    const result = enemyAIFire(enemyAIRef.current, playerGrid, playerPlacements);
    if (!result) return;

    setPlayerShots(prev => [...prev, { row: result.row, col: result.col, hit: result.hit }]);

    if (result.updatedPlacements) {
      setPlayerPlacements(result.updatedPlacements);
    }

    if (result.hit) {
      playAlarm();
      if (result.sunkShip) {
        addMessage(`☭ ENEMY SUNK YOUR ${result.sunkShip.name.toUpperCase()} at ${LETTERS[result.row]}${result.col + 1}!`, "sunk");
      } else {
        addMessage(`⚠ INCOMING! Enemy hit at ${LETTERS[result.row]}${result.col + 1}!`, "enemy");
      }
    } else {
      addMessage(`Enemy fired at ${LETTERS[result.row]}${result.col + 1}. Missed.`, "miss");
    }

    setEnemyAttackResult(result);
    setTimeout(() => setEnemyAttackResult(null), 1500);

    // Check if all player ships sunk
    const plc = result.updatedPlacements || playerPlacements;
    const allPlayerSunk = plc.every(s => s.hits >= s.size);
    if (allPlayerSunk) {
      setTimeout(() => setGameState("gameover"), 1800);
    }
  }, [playerGrid, playerPlacements, addMessage]);

  // ── CONTINUE AFTER ANSWER ──────────
  const handleContinue = useCallback(() => {
    if (!targetCell || !enemyGrid) return;
    const { row, col } = targetCell;

    if (wasCorrect) {
      const cellValue = enemyGrid[row][col];
      const hit = cellValue !== null;
      let sunkShip = null;
      const newPlacements = enemyPlacements.map(ship => {
        if (hit && ship.code === cellValue) {
          const updated = { ...ship, hits: ship.hits + 1 };
          if (updated.hits >= updated.size) sunkShip = updated;
          return updated;
        }
        return ship;
      });
      const shotRecord = { row, col, hit, sunk: !!sunkShip };
      setShots(prev => [...prev, shotRecord]);
      setEnemyPlacements(newPlacements);
      setExplosions(prev => [...prev, { row, col, hit }]);
      setTimeout(() => setExplosions(prev => prev.filter(e => e.row !== row || e.col !== col)), 1000);

      if (hit) {
        playHit();
        if (sunkShip) {
          playSunk();
          addMessage(`DIRECT HIT on ${LETTERS[row]}${col + 1}! ${sunkShip.name} SUNK!`, "sunk");
          setScore(prev => prev + 200);
          setShots(prev => prev.map(s => {
            if (sunkShip.cells.some(c => c[0] === s.row && c[1] === s.col)) return { ...s, sunk: true };
            return s;
          }));
        } else {
          addMessage(`DIRECT HIT at ${LETTERS[row]}${col + 1}!`, "hit");
          setScore(prev => prev + 100);
        }
      } else {
        playSplash();
        addMessage(`Miss at ${LETTERS[row]}${col + 1}. No contact.`, "miss");
        setScore(prev => prev + 25);
      }

      // Check win
      const allEnemySunk = newPlacements.every(s => s.hits >= s.size);
      if (allEnemySunk) {
        playVictory();
        // Still do enemy fire before ending
        setTimeout(() => {
          doEnemyFire();
          setTimeout(() => setGameState("gameover"), 1500);
        }, 800);
        setCurrentQuestionIdx(prev => prev + 1);
        setPhase("targeting");
        setTargetCell(null);
        setAnswered(false);
        setSelectedAnswer(null);
        setWasCorrect(false);
        setTurnNumber(prev => prev + 1);
        return;
      }
    } else {
      addMessage(`Intel verification FAILED. Attack cancelled.`, "miss");
    }

    // Enemy fires every turn
    setTimeout(() => doEnemyFire(), 600);

    // Advance turn
    setCurrentQuestionIdx(prev => prev + 1);
    setPhase("targeting");
    setTargetCell(null);
    setAnswered(false);
    setSelectedAnswer(null);
    setWasCorrect(false);
    setTurnNumber(prev => prev + 1);

    // Check if out of questions
    if (currentQuestionIdx + 1 >= questionQueue.length) {
      // Determine if attrition victory or withdrawal
      const pHits = enemyPlacements.reduce((sum, s) => sum + s.hits, 0);
      const eHits = playerPlacements.reduce((sum, s) => sum + s.hits, 0);
      if (pHits > eHits) {
        addMessage("All intel exhausted. Damage assessment favors our forces — tactical victory.", "system");
      } else {
        addMessage("Ammunition depleted. Fleet withdrawing to regroup with main formation.", "system");
      }
      setTimeout(() => setGameState("gameover"), 2500);
    }
  }, [wasCorrect, targetCell, enemyGrid, enemyPlacements, currentQuestionIdx, questionQueue, addMessage, doEnemyFire]);

  // ── COMPUTE FINAL STATS ────────────
  const computeStats = useCallback(() => {
    const enemyShipsSunk = enemyPlacements.filter(s => s.hits >= s.size).length;
    const playerShipsSurvived = playerPlacements.filter(s => s.hits < s.size).length;
    const playerAllSunk = playerPlacements.every(s => s.hits >= s.size);
    const allEnemySunk = enemyPlacements.every(s => s.hits >= s.size);
    const survivalBonus = playerPlacements.filter(s => s.hits < s.size).reduce((sum, s) => sum + s.bonus, 0);

    // Count total hits dealt vs received
    const playerHitsDealt = enemyPlacements.reduce((sum, s) => sum + s.hits, 0);
    const enemyHitsDealt = playerPlacements.reduce((sum, s) => sum + s.hits, 0);

    // Determine outcome
    let outcome; // "decisive_victory" | "attrition_victory" | "withdrawal" | "defeat"
    let victoryBonus = 0;
    if (allEnemySunk) {
      outcome = "decisive_victory";
      victoryBonus = 500;
    } else if (playerAllSunk) {
      outcome = "defeat";
      victoryBonus = 0;
    } else if (playerHitsDealt > enemyHitsDealt) {
      outcome = "attrition_victory";
      victoryBonus = 250;
    } else {
      outcome = "withdrawal";
      victoryBonus = 0;
    }

    return {
      combatScore: score,
      survivalBonus,
      victoryBonus,
      totalScore: score + survivalBonus + victoryBonus,
      accuracy,
      enemyShipsSunk,
      playerShipsSurvived,
      playerAllSunk,
      playerHitsDealt,
      enemyHitsDealt,
      outcome,
      turns: turnNumber,
    };
  }, [score, accuracy, enemyPlacements, playerPlacements, turnNumber]);

  // ── REPORT SCORE ON GAME OVER ──────
  useEffect(() => {
    if (gameState === "gameover" && onGameOver) {
      onGameOver(computeStats());
    }
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── RENDER ─────────────────────────
  if (gameState === "intro") {
    return (<IntroScreen onStart={goToPlacement} user={user} authError={authError} onSignIn={onSignIn} onSignOut={onSignOut} />);
  }

  if (gameState === "placement") {
    return (<PlacementPhase onComplete={handlePlacementComplete} />);
  }

  if (gameState === "gameover") {
    const stats = computeStats();
    return (
      <GameOverScreen stats={stats} user={user} onRestart={() => setGameState("intro")} />
    );
  }

  const currentQuestion = questionQueue[currentQuestionIdx];
  const displayTarget = phase === "targeting" ? (hoverCell || targetCell) : targetCell;

  return (
    <>
      <CRTOverlay />
      {enemyAttackResult && enemyAttackResult.hit && (
        <div className="enemy-attack-overlay">
          <div className="enemy-attack-msg">
            <h3 style={{ color: enemyAttackResult.sunkShip ? "var(--soviet-red)" : "var(--soviet-gold)" }}>
              {enemyAttackResult.sunkShip ? `☭ ${enemyAttackResult.sunkShip.name} SUNK!` : "⚠ INCOMING HIT!"}
            </h3>
            <p>{LETTERS[enemyAttackResult.row]}{enemyAttackResult.col + 1} — {enemyAttackResult.sunkShip ? "Your vessel has been destroyed" : "Your fleet is under fire"}</p>
          </div>
        </div>
      )}
      <div className="app-container">
        <Header />
        <StatusBar phase={phase} turnNumber={turnNumber} score={score} accuracy={accuracy} questionsLeft={questionsLeft} totalQuestions={questionQueue.length} volume={volume} onVolumeChange={handleVolumeChange} muted={muted} onToggleMute={handleToggleMute} />

        {phase === "answering" && currentQuestion && (
          <div style={{ marginBottom: 12 }}>
            <QuestionPanel question={currentQuestion} questionIndex={currentQuestionIdx}
              totalQuestions={questionQueue.length} onAnswer={handleAnswer}
              answered={answered} selectedAnswer={selectedAnswer} wasCorrect={wasCorrect} />
            {answered && (
              <>
                <div className={`result-banner ${wasCorrect ? "hit-banner" : "miss-banner"}`}>
                  {wasCorrect ? "✦ INTEL VERIFIED — STRIKE AUTHORIZED ✦" : "✕ INTEL FAILED — ATTACK CANCELLED ✕"}
                </div>
                <button className="continue-btn" onClick={handleContinue}>
                  {wasCorrect ? "FIRE!" : "CONTINUE"}
                </button>
              </>
            )}
          </div>
        )}

        <div className="main-layout">
          <div>
            <div className="grid-panel">
              <div className="grid-panel-title">Enemy Waters — Tactical Display</div>
              <BattleGrid gridData={enemyGrid} shots={shots} targetCell={displayTarget}
                onCellClick={handleCellClick} onCellHover={handleCellHover}
                disabled={phase !== "targeting"} explosions={explosions} showShips={false} />
              <TargetReadout targetCell={displayTarget} />
            </div>
          </div>

          <div className="sidebar">
            <GridLegend />
            <FleetStatus placements={enemyPlacements} label="Enemy Fleet Status" />

            {/* Player fleet with live damage */}
            <div className="intel-panel">
              <div className="intel-title">Your Fleet</div>
              {/* Mini grid showing player ships and hits */}
              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)", aspectRatio: "1", gap: 1, background: "rgba(57,255,20,0.04)", border: "1px solid var(--panel-border)", marginBottom: 8, overflow: "hidden" }}>
                {Array.from({ length: GRID_SIZE }, (_, row) =>
                  Array.from({ length: GRID_SIZE }, (_, col) => {
                    const hasShip = playerGrid && playerGrid[row][col] !== null;
                    const shot = playerShots.find(s => s.row === row && s.col === col);
                    const isSunkShip = hasShip && playerPlacements.find(s => s.code === playerGrid[row][col])?.hits >= playerPlacements.find(s => s.code === playerGrid[row][col])?.size;
                    let bg = "var(--ocean-grid)";
                    let content = null;
                    if (shot && shot.hit) {
                      bg = isSunkShip ? "rgba(255,42,42,0.2)" : "rgba(255,42,42,0.4)";
                      content = <span style={{ fontSize: 7, color: "var(--hit-red)" }}>✕</span>;
                    } else if (shot) {
                      bg = "rgba(26,74,110,0.3)";
                    }
                    return (
                      <div key={`${row}-${col}`} style={{ aspectRatio: "1", background: bg, border: "1px solid rgba(57,255,20,0.02)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5, opacity: isSunkShip && !shot ? 0.3 : 1 }}>
                        {content}
                      </div>
                    );
                  })
                )}
                {/* Ship image overlays — in separate container */}
                <div className="ship-overlay-container mini-overlay">
                  {playerPlacements.map(ship => {
                    const isSunk = ship.hits >= ship.size;
                    return (
                      <ShipOverlay key={`mini-${ship.code}`}
                        shipCode={ship.code}
                        row={ship.cells[0][0]}
                        col={ship.cells[0][1]}
                        size={ship.size}
                        horizontal={ship.horizontal}
                        isSunk={isSunk}
                        isHit={ship.hits > 0 && !isSunk}
                        mini
                        noLabels
                      />
                    );
                  })}
                </div>
              </div>
              {/* Ship list with survival bonus values */}
              {playerPlacements.map(ship => {
                const isSunk = ship.hits >= ship.size;
                return (
                  <div key={ship.code} className="ship-row">
                    <ShipSilhouette shipCode={ship.code} isSunk={isSunk} />
                    <div className={`ship-name ${isSunk ? "sunk" : ""}`}>{ship.name}</div>
                    <div className="ship-cells">
                      {Array.from({ length: ship.size }, (_, i) => (
                        <div key={i} className={`ship-cell-indicator ${isSunk ? "sunk-cell" : i < ship.hits ? "damaged" : ""}`} />
                      ))}
                    </div>
                    <span style={{ fontSize: 9, color: isSunk ? "rgba(255,42,42,0.4)" : "var(--crt-green-dim)", letterSpacing: 1, minWidth: 40, textAlign: "right" }}>
                      {isSunk ? "LOST" : `+${ship.bonus}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <MessageLog messages={messages} />

            <div className="intel-panel">
              <div className="intel-title">Intel Accuracy</div>
              <div className="accuracy-bar-container">
                <div className="accuracy-bar-bg">
                  <div className="accuracy-bar-fill" style={{ width: `${accuracy}%` }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10, color: "var(--crt-green-dim)" }}>{correctAnswers}/{questionsAnswered} correct</span>
                <span style={{ fontSize: 10, color: "var(--crt-green-dim)" }}>{accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
