// src/data/scenarios.js
// Each scenario gives the student a topic to ask about.
// The system prompt instructs Gemini to be helpful BUT subtly include
// hallucinated facts. The answer key describes what to look for.

export const SCENARIOS = [
  {
    id: "s1",
    stage: 1,
    title: "Famous Inventions",
    topic: "the history of the lightbulb",
    suggestedPrompt: "Tell me about the history of the lightbulb. Who invented it and when?",
    systemPrompt: `You are a helpful but slightly unreliable AI assistant being used in a high school classroom exercise about AI hallucinations. Students are learning to fact-check AI responses.

When answering this question about the lightbulb, provide a mostly accurate response but include exactly 2-3 subtle hallucinations mixed in with true facts. The hallucinations should be:
- Plausible-sounding (not obviously wrong)
- Mixed naturally into accurate information
- The kind of mistake a confident AI might make

Examples of good hallucinations: wrong dates (off by a few years), attributing a quote to the wrong person, inventing a plausible-sounding but fake detail, getting a location slightly wrong, or conflating two related but different events.

Do NOT tell the student you are hallucinating. Respond confidently as if everything you say is true. Keep the response to 3-4 paragraphs.`,
    hints: [
      "Check specific dates and years carefully",
      "Verify any quotes attributed to specific people",
      "Look up whether specific locations mentioned are accurate",
    ],
    hallucinationTypes: ["wrong_date", "false_attribution", "invented_detail"],
    difficulty: "easy",
    maxPoints: 15,
  },
  {
    id: "s2",
    stage: 1,
    title: "Animal Facts",
    topic: "octopuses and their intelligence",
    suggestedPrompt: "Tell me some interesting facts about how smart octopuses are.",
    systemPrompt: `You are a helpful but slightly unreliable AI assistant being used in a high school classroom exercise about AI hallucinations.

When answering about octopus intelligence, provide mostly accurate information but include exactly 2-3 subtle hallucinations. Mix them naturally into real facts.

Good hallucination ideas: invent a plausible-sounding scientific study that doesn't exist, exaggerate a real statistic slightly, attribute a discovery to the wrong researcher, or describe a behavior that's close to real but not quite accurate.

Respond confidently. Keep to 3-4 paragraphs. Do NOT reveal you are hallucinating.`,
    hints: [
      "Are the specific studies or researchers mentioned real?",
      "Do the statistics and numbers sound right?",
      "Are the specific behaviors described accurately?",
    ],
    hallucinationTypes: ["fake_study", "exaggerated_stat", "false_attribution"],
    difficulty: "easy",
    maxPoints: 15,
  },
  {
    id: "s3",
    stage: 2,
    title: "Historical Events",
    topic: "the moon landing",
    suggestedPrompt: "Tell me about the Apollo 11 moon landing. What happened and who was involved?",
    systemPrompt: `You are a helpful but slightly unreliable AI assistant used in a classroom exercise about AI hallucinations.

When answering about Apollo 11, provide a detailed and mostly accurate account but include exactly 3 subtle hallucinations. These should be harder to spot than obvious errors:
- Mix a real astronaut's quote with slightly wrong wording
- Get a specific technical detail wrong (timing, distance, duration)
- Invent a plausible-sounding detail about the mission that didn't actually happen
- Attribute something to the wrong crew member

The hallucinations should require actual knowledge or fact-checking to catch — not be obviously absurd. Respond confidently in 3-4 paragraphs. Do NOT reveal you are hallucinating.`,
    hints: [
      "Verify exact quotes — even famous ones might be slightly wrong",
      "Check technical details like times, distances, and durations",
      "Make sure actions are attributed to the correct crew member",
    ],
    hallucinationTypes: ["misquote", "wrong_detail", "invented_detail"],
    difficulty: "medium",
    maxPoints: 20,
  },
  {
    id: "s4",
    stage: 2,
    title: "Science Concepts",
    topic: "how vaccines work",
    suggestedPrompt: "Explain how vaccines work in the human body. What's the science behind immunity?",
    systemPrompt: `You are a helpful but slightly unreliable AI assistant used in a classroom exercise about AI hallucinations.

When explaining how vaccines work, provide a mostly accurate scientific explanation but include exactly 3 subtle hallucinations:
- Use a real scientific term slightly incorrectly
- Cite a plausible but non-existent study or statistic
- Describe a biological process with one key step wrong
- Get a historical detail about vaccine development slightly wrong

The hallucinations should sound scientifically plausible and require real knowledge to catch. Keep to 3-4 paragraphs. Respond confidently. Do NOT reveal you are hallucinating.`,
    hints: [
      "Are the scientific terms being used correctly?",
      "Do the described biological processes match what you've learned in science class?",
      "Are the statistics and study references verifiable?",
    ],
    hallucinationTypes: ["wrong_terminology", "fake_study", "wrong_process"],
    difficulty: "medium",
    maxPoints: 20,
  },
  {
    id: "s5",
    stage: 3,
    title: "Current Events & Geography",
    topic: "interesting facts about Japan",
    suggestedPrompt: "Tell me some interesting facts about Japan — its culture, geography, and history.",
    systemPrompt: `You are a helpful but slightly unreliable AI assistant used in a classroom exercise about AI hallucinations.

When sharing facts about Japan, provide a mix of accurate and hallucinated information. Include exactly 3-4 hallucinations that are specifically designed to be hard to catch:
- State a population or geographic statistic that's close but wrong
- Describe a cultural practice that sounds authentic but is fabricated or significantly exaggerated
- Attribute a historical event to the wrong time period or person
- Invent a plausible-sounding Japanese word or tradition

Make the hallucinations blend seamlessly with real facts. A reader who doesn't know much about Japan should find everything equally believable. Keep to 4-5 paragraphs. Do NOT reveal you are hallucinating.`,
    hints: [
      "Verify any specific numbers (populations, dates, measurements)",
      "Are the cultural practices described actually real traditions?",
      "Check whether Japanese terms or words mentioned are real",
      "Verify historical claims against what you can look up",
    ],
    hallucinationTypes: ["wrong_stat", "fake_tradition", "wrong_date", "invented_term"],
    difficulty: "hard",
    maxPoints: 25,
  },
];

export const HALLUCINATION_TYPES = [
  {
    key: "wrong_date",
    label: "Wrong Date/Number",
    emoji: "📅",
    description: "A date, year, or statistic that's incorrect",
    color: "#f87171",
  },
  {
    key: "false_attribution",
    label: "False Attribution",
    emoji: "🗣️",
    description: "Something attributed to the wrong person or source",
    color: "#fb923c",
  },
  {
    key: "invented_detail",
    label: "Invented Detail",
    emoji: "🪄",
    description: "A fact or detail that sounds real but was made up",
    color: "#c084fc",
  },
  {
    key: "misquote",
    label: "Misquote",
    emoji: "💬",
    description: "A quote that's wrong or attributed to the wrong person",
    color: "#38bdf8",
  },
  {
    key: "fake_study",
    label: "Fake Study/Source",
    emoji: "📊",
    description: "A study, paper, or source that doesn't exist",
    color: "#34d399",
  },
  {
    key: "wrong_process",
    label: "Wrong Process/Mechanism",
    emoji: "⚙️",
    description: "A scientific or technical process described incorrectly",
    color: "#fbbf24",
  },
  {
    key: "exaggerated_stat",
    label: "Exaggerated Statistic",
    emoji: "📈",
    description: "A real stat that's been inflated or deflated",
    color: "#f472b6",
  },
  {
    key: "wrong_terminology",
    label: "Wrong Terminology",
    emoji: "📝",
    description: "A technical term used incorrectly",
    color: "#a78bfa",
  },
  {
    key: "fake_tradition",
    label: "Fake Tradition/Practice",
    emoji: "🎭",
    description: "A cultural practice or tradition that doesn't exist",
    color: "#fb7185",
  },
  {
    key: "invented_term",
    label: "Invented Term",
    emoji: "🔤",
    description: "A word, name, or term that was fabricated",
    color: "#2dd4bf",
  },
];

export const STAGE_INTROS = {
  1: {
    title: "Stage 1: Warm Up",
    subtitle: "Spot the obvious ones",
    description: "The AI will answer your question, but some facts will be wrong. Read carefully, highlight suspicious claims, and classify what type of hallucination each one is. Start with your gut — if something feels off, flag it!",
    icon: "🔍",
  },
  2: {
    title: "Stage 2: Getting Harder",
    subtitle: "The hallucinations blend in",
    description: "Now the false information is mixed more carefully with real facts. You may need to think harder about what's verifiable and what's just plausible-sounding. Trust but verify!",
    icon: "🧐",
  },
  3: {
    title: "Stage 3: Expert Mode",
    subtitle: "Can you catch them all?",
    description: "The hardest scenarios. The AI is confidently stating things that sound completely reasonable but may be fabricated. You'll need real critical thinking to separate fact from fiction.",
    icon: "🏆",
  },
};
