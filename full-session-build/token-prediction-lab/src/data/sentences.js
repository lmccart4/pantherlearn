// src/data/sentences.js
// Each round has a partial sentence, possible next tokens with probabilities,
// and metadata about what concept it teaches.

export const ROUNDS = [
  // ===== STAGE 1: EASY — High-confidence predictions =====
  {
    stage: 1,
    id: "r1",
    partial: "The cat sat on the",
    tokens: [
      { word: "mat", prob: 0.42, isTop: true },
      { word: "floor", prob: 0.25 },
      { word: "chair", prob: 0.18 },
      { word: "table", prob: 0.10 },
      { word: "dog", prob: 0.05 },
    ],
    insight: "Common phrases from training data make some tokens much more likely. 'The cat sat on the mat' is a classic English sentence the model has seen many times.",
    concept: "frequency",
  },
  {
    stage: 1,
    id: "r2",
    partial: "She opened the door and walked",
    tokens: [
      { word: "in", prob: 0.38, isTop: true },
      { word: "inside", prob: 0.28 },
      { word: "out", prob: 0.18 },
      { word: "away", prob: 0.12 },
      { word: "slowly", prob: 0.04 },
    ],
    insight: "'Walked in' and 'walked inside' are both natural completions. The model assigns probability based on how often it saw these patterns in training data.",
    concept: "frequency",
  },
  {
    stage: 1,
    id: "r3",
    partial: "The sun rises in the",
    tokens: [
      { word: "east", prob: 0.65, isTop: true },
      { word: "morning", prob: 0.22 },
      { word: "sky", prob: 0.08 },
      { word: "west", prob: 0.03 },
      { word: "dark", prob: 0.02 },
    ],
    insight: "Factual knowledge gets encoded in the model's weights during training. 'East' is dominant because the training data consistently pairs 'sun rises' with 'east.'",
    concept: "knowledge",
  },
  {
    stage: 1,
    id: "r4",
    partial: "Happy birthday to",
    tokens: [
      { word: "you", prob: 0.82, isTop: true },
      { word: "me", prob: 0.08 },
      { word: "my", prob: 0.05 },
      { word: "the", prob: 0.03 },
      { word: "our", prob: 0.02 },
    ],
    insight: "Some patterns are SO common that one token dominates almost completely. The model is extremely confident here because this phrase appears thousands of times in training data.",
    concept: "confidence",
  },

  // ===== STAGE 2: MEDIUM — Context matters =====
  {
    stage: 2,
    id: "r5",
    partial: "The baseball player picked up the",
    tokens: [
      { word: "bat", prob: 0.45, isTop: true },
      { word: "ball", prob: 0.30 },
      { word: "glove", prob: 0.15 },
      { word: "helmet", prob: 0.07 },
      { word: "phone", prob: 0.03 },
    ],
    insight: "Context word 'baseball' activates sports-related tokens. Without 'baseball,' the word 'bat' might have lower probability because it could mean an animal. This is attention at work!",
    concept: "attention",
  },
  {
    stage: 2,
    id: "r6",
    partial: "The biologist carefully studied the",
    tokens: [
      { word: "specimen", prob: 0.28, isTop: true },
      { word: "data", prob: 0.22 },
      { word: "cells", prob: 0.20 },
      { word: "results", prob: 0.18 },
      { word: "bat", prob: 0.12 },
    ],
    insight: "Notice how 'bat' appears here too — but now it means the animal, not the sports equipment! The attention mechanism uses 'biologist' and 'studied' to shift meaning. Same token, different context.",
    concept: "attention",
  },
  {
    stage: 2,
    id: "r7",
    partial: "After the storm, the streets were",
    tokens: [
      { word: "flooded", prob: 0.35, isTop: true },
      { word: "empty", prob: 0.25 },
      { word: "wet", prob: 0.20 },
      { word: "dark", prob: 0.12 },
      { word: "beautiful", prob: 0.08 },
    ],
    insight: "Multiple tokens are plausible here — 'flooded,' 'empty,' and 'wet' are all reasonable. When the model isn't confident, it spreads probability more evenly. This is called high entropy.",
    concept: "entropy",
  },
  {
    stage: 2,
    id: "r8",
    partial: "The chef added a pinch of",
    tokens: [
      { word: "salt", prob: 0.52, isTop: true },
      { word: "pepper", prob: 0.20 },
      { word: "sugar", prob: 0.13 },
      { word: "cinnamon", prob: 0.10 },
      { word: "love", prob: 0.05 },
    ],
    insight: "'A pinch of salt' is a very common phrase, but the model still assigns some probability to other spices. It's hedging its bets because multiple completions make sense in a cooking context.",
    concept: "frequency",
  },

  // ===== STAGE 3: HARD — Subtle context, competing options =====
  {
    stage: 3,
    id: "r9",
    partial: "The bank of the river was covered in",
    tokens: [
      { word: "mud", prob: 0.30, isTop: true },
      { word: "grass", prob: 0.25 },
      { word: "flowers", prob: 0.18 },
      { word: "snow", prob: 0.15 },
      { word: "money", prob: 0.02 },
      { word: "sand", prob: 0.10 },
    ],
    insight: "'Bank of the river' — the attention mechanism has to figure out that 'bank' means a riverbank, not a financial bank. The words 'river' and 'covered in' strongly push away financial meanings. Notice 'money' has only 2% probability!",
    concept: "disambiguation",
  },
  {
    stage: 3,
    id: "r10",
    partial: "Despite studying all night, the student felt",
    tokens: [
      { word: "tired", prob: 0.28, isTop: true },
      { word: "confident", prob: 0.25 },
      { word: "prepared", prob: 0.22 },
      { word: "anxious", prob: 0.18 },
      { word: "hungry", prob: 0.07 },
    ],
    insight: "This is tricky! 'Despite' creates tension — studying all night could lead to feeling tired OR confident. The probabilities are very close because the context genuinely supports multiple emotional states. The model captures this ambiguity.",
    concept: "ambiguity",
  },
  {
    stage: 3,
    id: "r11",
    partial: "In 2024, the most popular programming language was",
    tokens: [
      { word: "Python", prob: 0.45, isTop: true },
      { word: "JavaScript", prob: 0.30 },
      { word: "Java", prob: 0.10 },
      { word: "C++", prob: 0.08 },
      { word: "Rust", prob: 0.07 },
    ],
    insight: "The model's knowledge has a cutoff date! It predicts based on what was true in its training data. If this question were about 2030, the model would still guess based on 2024 patterns — it can't actually know the future.",
    concept: "knowledge_cutoff",
  },
  {
    stage: 3,
    id: "r12",
    partial: "The tiny kitten bravely chased the enormous",
    tokens: [
      { word: "dog", prob: 0.35, isTop: true },
      { word: "bear", prob: 0.15 },
      { word: "bird", prob: 0.12 },
      { word: "mouse", prob: 0.10 },
      { word: "butterfly", prob: 0.18 },
      { word: "truck", prob: 0.10 },
    ],
    insight: "'Tiny' and 'enormous' create a size contrast that the model picks up on. 'Bravely' suggests the kitten is doing something unusual or risky. The model combines ALL these context clues through attention to distribute probability.",
    concept: "attention",
  },

  // ===== STAGE 4: BOSS ROUND — Temperature & generation =====
  {
    stage: 4,
    id: "r13",
    partial: "Once upon a time, in a kingdom far away, there lived a",
    tokens: [
      { word: "princess", prob: 0.25, isTop: true },
      { word: "king", prob: 0.20 },
      { word: "dragon", prob: 0.18 },
      { word: "young", prob: 0.15 },
      { word: "brave", prob: 0.12 },
      { word: "lonely", prob: 0.10 },
    ],
    insight: "In creative writing, the probabilities are more spread out — the model has seen many different fairy tales. At low temperature (conservative), it always picks 'princess.' At high temperature (creative), it might pick 'dragon' or 'lonely.' Temperature controls how much the model 'takes risks.'",
    concept: "temperature",
    hasTemperature: true,
  },
  {
    stage: 4,
    id: "r14",
    partial: "The scientist discovered that the ancient artifact was actually a",
    tokens: [
      { word: "weapon", prob: 0.20, isTop: true },
      { word: "map", prob: 0.18 },
      { word: "key", prob: 0.17 },
      { word: "clock", prob: 0.15 },
      { word: "musical", prob: 0.12 },
      { word: "hoax", prob: 0.10 },
      { word: "living", prob: 0.08 },
    ],
    insight: "With so many plausible options, the model's choice depends heavily on temperature. Low temperature = predictable ('weapon'). High temperature = surprising ('living'). This is why the same prompt can generate different stories each time!",
    concept: "temperature",
    hasTemperature: true,
  },
];

// Concept explanations shown between stages
export const STAGE_INTROS = {
  1: {
    title: "Stage 1: Pattern Recognition",
    subtitle: "How well do you know common English patterns?",
    description: "A language model predicts the next word by recognizing patterns from its training data. Common phrases get high probability. Let's see if you can predict like an AI!",
    icon: "🔮",
  },
  2: {
    title: "Stage 2: Context is Everything",
    subtitle: "The same word means different things in different contexts",
    description: "Now it gets harder. The attention mechanism looks at ALL the words in the sentence to figure out what should come next. Context changes everything!",
    icon: "🧠",
  },
  3: {
    title: "Stage 3: Ambiguity & Knowledge",
    subtitle: "When the model isn't sure — and when it gets things wrong",
    description: "Sometimes multiple words are equally good. Sometimes the model's training data creates blind spots. Can you spot when the AI is uncertain vs. confident?",
    icon: "⚡",
  },
  4: {
    title: "Boss Round: Temperature Control",
    subtitle: "You control how creative the AI gets",
    description: "In this final stage, you'll see how 'temperature' affects generation. Low temperature = safe, predictable choices. High temperature = creative, surprising choices. Adjust the dial and watch probabilities shift!",
    icon: "🔥",
  },
};
