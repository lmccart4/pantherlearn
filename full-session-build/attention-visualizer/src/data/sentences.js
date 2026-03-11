// src/data/sentences.js
// Pre-computed "attention weights" for sentences with ambiguous words.
// Each sentence has a target word and weights showing how much each
// other word "attends to" the target to help determine its meaning.

export const SCENARIOS = [
  // ===== STAGE 1: EXPLORE — Students observe attention patterns =====
  {
    stage: 1,
    id: "s1",
    sentence: "The bat flew out of the dark cave at sunset",
    words: ["The", "bat", "flew", "out", "of", "the", "dark", "cave", "at", "sunset"],
    targetIdx: 1, // "bat"
    meaning: "flying animal",
    attentionWeights: [0.02, 0, 0.35, 0.05, 0.02, 0.01, 0.15, 0.30, 0.02, 0.08],
    topAttenders: [
      { word: "flew", weight: 0.35, why: "'Flew' strongly signals this is a living creature that has wings" },
      { word: "cave", weight: 0.30, why: "'Cave' is a natural habitat for bats (the animal)" },
      { word: "dark", weight: 0.15, why: "'Dark' reinforces the nocturnal animal interpretation" },
    ],
    wrongMeaning: "sports equipment",
    explanation: "The words 'flew,' 'cave,' and 'dark' all point toward the animal meaning. A baseball bat can't fly or live in a cave!",
  },
  {
    stage: 1,
    id: "s2",
    sentence: "The player grabbed the bat and stepped up to the plate",
    words: ["The", "player", "grabbed", "the", "bat", "and", "stepped", "up", "to", "the", "plate"],
    targetIdx: 4, // "bat"
    meaning: "sports equipment",
    attentionWeights: [0.01, 0.25, 0.18, 0.01, 0, 0.01, 0.10, 0.02, 0.01, 0.01, 0.40],
    topAttenders: [
      { word: "plate", weight: 0.40, why: "'Plate' (home plate) is a strong baseball signal" },
      { word: "player", weight: 0.25, why: "'Player' indicates a sports context" },
      { word: "grabbed", weight: 0.18, why: "'Grabbed' suggests picking up a physical object" },
    ],
    wrongMeaning: "flying animal",
    explanation: "Now 'bat' means sports equipment. 'Player,' 'grabbed,' and 'plate' create a baseball context that the attention mechanism picks up on.",
  },
  {
    stage: 1,
    id: "s3",
    sentence: "She sat on the bank and watched the river flow by",
    words: ["She", "sat", "on", "the", "bank", "and", "watched", "the", "river", "flow", "by"],
    targetIdx: 4, // "bank"
    meaning: "riverbank (edge of water)",
    attentionWeights: [0.02, 0.08, 0.02, 0.01, 0, 0.01, 0.05, 0.01, 0.45, 0.30, 0.05],
    topAttenders: [
      { word: "river", weight: 0.45, why: "'River' directly indicates a natural water setting" },
      { word: "flow", weight: 0.30, why: "'Flow' reinforces the water/nature context" },
      { word: "sat", weight: 0.08, why: "You can 'sit on' a riverbank, but not typically on a financial bank" },
    ],
    wrongMeaning: "financial institution",
    explanation: "'River' and 'flow' are the strongest signals. The attention mechanism uses these to push 'bank' toward the riverbank meaning rather than the financial meaning.",
  },

  // ===== STAGE 2: PREDICT — Students predict which words matter before seeing weights =====
  {
    stage: 2,
    id: "s4",
    sentence: "The crane lifted the steel beam to the top of the building",
    words: ["The", "crane", "lifted", "the", "steel", "beam", "to", "the", "top", "of", "the", "building"],
    targetIdx: 1, // "crane"
    meaning: "construction machine",
    attentionWeights: [0.01, 0, 0.30, 0.01, 0.22, 0.20, 0.01, 0.01, 0.05, 0.01, 0.01, 0.17],
    topAttenders: [
      { word: "lifted", weight: 0.30, why: "'Lifted' describes the mechanical action of a construction crane" },
      { word: "steel", weight: 0.22, why: "'Steel' signals an industrial/construction context" },
      { word: "beam", weight: 0.20, why: "'Beam' is a construction material that a machine crane lifts" },
    ],
    wrongMeaning: "bird",
    explanation: "'Lifted,' 'steel,' and 'beam' form a strong construction context cluster. A bird crane doesn't lift steel beams!",
  },
  {
    stage: 2,
    id: "s5",
    sentence: "The spring water tasted fresh and pure from the mountain",
    words: ["The", "spring", "water", "tasted", "fresh", "and", "pure", "from", "the", "mountain"],
    targetIdx: 1, // "spring"
    meaning: "natural water source",
    attentionWeights: [0.01, 0, 0.35, 0.10, 0.12, 0.01, 0.08, 0.03, 0.01, 0.29],
    topAttenders: [
      { word: "water", weight: 0.35, why: "'Water' directly follows 'spring' and specifies this is a water source" },
      { word: "mountain", weight: 0.29, why: "Springs often originate in mountains — this reinforces the natural water meaning" },
      { word: "fresh", weight: 0.12, why: "'Fresh' describes the quality of spring water, not a metal coil or season" },
    ],
    wrongMeaning: "season / metal coil",
    explanation: "'Water' right next to 'spring' is the strongest signal, and 'mountain' confirms the natural source interpretation. Three possible meanings of 'spring' and context narrows it to one!",
  },
  {
    stage: 2,
    id: "s6",
    sentence: "The bright star of the movie signed autographs for fans",
    words: ["The", "bright", "star", "of", "the", "movie", "signed", "autographs", "for", "fans"],
    targetIdx: 2, // "star"
    meaning: "famous person / celebrity",
    attentionWeights: [0.01, 0.05, 0, 0.01, 0.01, 0.30, 0.20, 0.25, 0.02, 0.15],
    topAttenders: [
      { word: "movie", weight: 0.30, why: "'Movie' sets up an entertainment context where 'star' means celebrity" },
      { word: "autographs", weight: 0.25, why: "Only a person (celebrity) signs autographs, not a celestial object" },
      { word: "signed", weight: 0.20, why: "'Signed' requires a human agent, confirming the celebrity meaning" },
    ],
    wrongMeaning: "celestial body",
    explanation: "Even though 'bright' could describe a literal star, 'movie,' 'signed,' and 'autographs' overwhelmingly point to the celebrity meaning. Attention combines ALL these signals.",
  },

  // ===== STAGE 3: CHALLENGE — Trickier scenarios, competing contexts =====
  {
    stage: 3,
    id: "s7",
    sentence: "The patient doctor treated the patient with care and kindness",
    words: ["The", "patient", "doctor", "treated", "the", "patient", "with", "care", "and", "kindness"],
    targetIdx: 1, // first "patient"
    meaning: "calm/tolerant (adjective)",
    attentionWeights: [0.01, 0, 0.45, 0.10, 0.01, 0.15, 0.03, 0.15, 0.02, 0.08],
    topAttenders: [
      { word: "doctor", wordIdx: 2, weight: 0.45, why: "When 'patient' comes BEFORE 'doctor,' it's describing the doctor's personality — an adjective" },
      { word: "care", wordIdx: 7, weight: 0.15, why: "'Care' and 'kindness' reinforce the personality trait interpretation" },
      { word: "patient", wordIdx: 5, weight: 0.15, why: "The SECOND 'patient' (the noun) helps distinguish — if the first one is also a noun, the sentence has two subjects with no verb connecting them" },
    ],
    wrongMeaning: "person receiving treatment",
    explanation: "The same word appears twice with different meanings! Position matters: 'patient' before 'doctor' is an adjective; 'patient' after 'the' (second time) is a noun. Attention tracks word position, not just the word itself.",
  },
  {
    stage: 3,
    id: "s8",
    sentence: "I need to book a flight to Buffalo for the bills game",
    words: ["I", "need", "to", "book", "a", "flight", "to", "Buffalo", "for", "the", "bills", "game"],
    targetIdx: 3, // "book"
    meaning: "to reserve/purchase",
    attentionWeights: [0.05, 0.15, 0.02, 0, 0.02, 0.35, 0.02, 0.10, 0.02, 0.01, 0.12, 0.14],
    topAttenders: [
      { word: "flight", weight: 0.35, why: "'Book a flight' is a very common phrase — 'flight' pulls 'book' toward the reservation meaning" },
      { word: "need", weight: 0.15, why: "'Need to book' sets up a verb phrase — 'book' is an action, not a physical object" },
      { word: "game", weight: 0.14, why: "'Game' establishes this as travel planning, reinforcing the reservation meaning" },
    ],
    wrongMeaning: "physical book / reading material",
    explanation: "Multiple words work together: 'need to' sets up a verb, 'flight' specifies what's being booked, and the whole sentence is about travel planning. Attention doesn't just look at the nearest word — it considers the entire sentence!",
  },
  {
    stage: 3,
    id: "s9",
    sentence: "After the match the boxer felt light on his feet despite the heavy round",
    words: ["After", "the", "match", "the", "boxer", "felt", "light", "on", "his", "feet", "despite", "the", "heavy", "round"],
    targetIdx: 6, // "light"
    meaning: "not heavy / nimble",
    attentionWeights: [0.02, 0.01, 0.08, 0.01, 0.18, 0.12, 0, 0.05, 0.02, 0.20, 0.05, 0.01, 0.18, 0.07],
    topAttenders: [
      { word: "feet", weight: 0.20, why: "'Light on his feet' is an idiom meaning nimble/quick — 'feet' anchors this meaning" },
      { word: "boxer", weight: 0.18, why: "'Boxer' sets up a physical/athletic context where 'light' means nimble" },
      { word: "heavy", weight: 0.18, why: "'Heavy' creates a contrast — 'despite the heavy round' implies 'light' means the opposite of heavy/tired" },
    ],
    wrongMeaning: "brightness / illumination",
    explanation: "This is an idiom! 'Light on his feet' means nimble, not illuminated. The attention mechanism picks up on 'feet' (idiom anchor), 'boxer' (physical context), and 'heavy' (contrast word). Understanding idioms requires seeing the whole phrase together.",
  },
];

export const STAGE_INTROS = {
  1: {
    title: "Stage 1: Observe",
    subtitle: "Watch how attention shifts meaning",
    description: "You'll see sentences with ambiguous words. Watch how the attention arrows show which context words the model 'pays attention to' when determining meaning. The thicker the arrow, the more that word matters.",
    icon: "👀",
  },
  2: {
    title: "Stage 2: Predict",
    subtitle: "Which words matter most?",
    description: "Now YOU predict which context words the attention mechanism will focus on before seeing the weights. Can you think like an AI?",
    icon: "🎯",
  },
  3: {
    title: "Stage 3: Challenge",
    subtitle: "Idioms, repeated words, and tricky contexts",
    description: "These sentences are genuinely hard — even for AI! Same words appearing twice with different meanings, idioms, and competing interpretations. Let's see how well attention handles complexity.",
    icon: "⚡",
  },
};
