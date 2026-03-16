// seed-token-prediction-lab-lesson.js
// Lesson 18 — Prompt Engineering & Applied AI unit
// Wraps the existing Token Prediction Lab activity with lesson context.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "How AI Predicts: The Token Game",
  course: "AI Literacy",
  unit: "Prompt Engineering and Applied AI",
  order: 20,
  visible: false,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain how language models predict the next token based on context and probability",
        "Identify how context changes which words are most likely to come next",
        "Understand what temperature does — how it controls randomness vs. predictability in AI output",
        "Connect token prediction to why prompt wording matters so much"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "In the creativity unit, you used AI to generate music, remix art, and co-write stories. You saw that AI output depends heavily on what you give it.\n\nBut *why*? Why does changing a few words in your prompt completely change the output?\n\nToday you're going to see the answer firsthand. You'll play a prediction game where YOU try to guess the same thing an AI guesses: **what word comes next?**"
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Complete this sentence: \"The cat sat on the ___\". What word did you pick? Why that word and not another?",
      placeholder: "I picked... because..."
    },
    {
      id: "wu-reveal",
      type: "callout",
      icon: "💡",
      style: "insight",
      content: "**That's exactly what AI does.** Every time a language model generates text, it's answering this question billions of times: *\"Given everything that came before, what's the most likely next word?\"*\n\nThe difference is that you used intuition. AI uses math — specifically, probability distributions over its entire vocabulary. Today you'll see how that works."
    },

    // ═══════════════════════════════════════════════════════
    // ACTIVITY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "Token Prediction Lab",
      subtitle: "~25 minutes",
      icon: "🎯"
    },
    {
      id: "activity-intro",
      type: "text",
      content: "In this activity, you'll see a sentence and try to predict what word (token) comes next — just like an AI would. You'll see how confident the AI is in its prediction and whether you agree.\n\nThe lab has 4 stages that get progressively harder:"
    },
    {
      id: "stages-callout",
      type: "callout",
      icon: "📊",
      style: "objective",
      content: "**Stage 1 (Easy):** Common phrases — high confidence, obvious answers\n**Stage 2 (Medium):** Context-dependent — the same word means different things\n**Stage 3 (Hard):** Ambiguous context — multiple valid answers compete\n**Stage 4 (Boss):** Temperature control — YOU adjust how \"creative\" the AI gets"
    },
    {
      id: "activity-block",
      type: "activity",
      title: "Launch Token Prediction Lab",
      icon: "🧪",
      instructions: "1. Open the Token Prediction Lab (your teacher will share the link)\n2. Work through all 4 stages\n3. For each round: read the context, make your prediction, then see what the AI predicts\n4. Pay attention to the **probability bars** — they show how confident the AI is\n5. In Stage 4, experiment with the **temperature slider** — see how it changes predictions\n\n**Goal:** Beat the AI's predictions as often as you can!"
    },
    {
      id: "context-callout",
      type: "callout",
      icon: "🔗",
      style: "tip",
      content: "**Key thing to watch for:** How does adding more context change the AI's top prediction? Notice how \"The baseball player picked up the ___\" makes \"bat\" much more likely than \"The animal picked up the ___\" does — even though both sentences could end with \"bat.\""
    },

    // ═══════════════════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When you increased the temperature in Stage 4, what happened?",
      options: [
        "The AI became more accurate and predictable",
        "The AI chose less likely words — more surprising and creative, but sometimes nonsensical",
        "The AI stopped generating text entirely",
        "Nothing changed — temperature has no effect"
      ],
      correctIndex: 1,
      explanation: "Higher temperature = more randomness. The AI is more willing to pick lower-probability words, which can feel creative but also produces more errors. Lower temperature = safer, more predictable output."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "short_answer",
      prompt: "Why does this matter for prompt engineering? If AI is just predicting the most likely next word, how does changing your prompt change the output?",
      placeholder: "Changing the prompt matters because..."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why does \"The doctor said the patient should take ___\" produce different results than \"The chef said the dish needed ___\"?",
      options: [
        "The AI searches the internet for each prompt separately",
        "The context words (doctor/patient vs. chef/dish) shift which words are most probable in the AI's prediction",
        "The AI understands the meaning of both sentences like a human would",
        "It's random — the AI gives different results every time regardless of prompt"
      ],
      correctIndex: 1,
      explanation: "Context is everything. The surrounding words shift the entire probability distribution — making medical terms likely in one sentence and cooking terms likely in the other. This is why prompt wording matters so much."
    },
    {
      id: "reflect-q4",
      type: "question",
      questionType: "short_answer",
      prompt: "How does understanding token prediction change the way you'd write prompts for AI? Give a specific example.",
      placeholder: "Now that I know AI predicts the next word, I would..."
    },
    {
      id: "bridge",
      type: "callout",
      icon: "➡️",
      style: "insight",
      content: "**Bridge to next lesson:** Now that you understand *how* AI generates text (token by token, word by word), you're ready to learn *how to control it*. Next lesson: systematic prompt engineering techniques."
    },

    // ═══════════════════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      title: "Vocabulary",
      subtitle: "",
      icon: "📖"
    },
    {
      id: "vocab1",
      type: "vocab_list",
      terms: [
        {
          term: "Token",
          definition: "The smallest unit of text an AI processes — usually a word or part of a word. 'Running' might be one token; 'unbelievable' might be split into 'un', 'believ', 'able'."
        },
        {
          term: "Next-Token Prediction",
          definition: "The core mechanism of language models: given all previous tokens, predict the probability distribution over what comes next. This is repeated token by token to generate text."
        },
        {
          term: "Temperature",
          definition: "A setting that controls randomness in AI output. Low temperature (0.0-0.3) = predictable, safe, repetitive. High temperature (0.7-1.0) = creative, surprising, but more error-prone."
        },
        {
          term: "Probability Distribution",
          definition: "A list of all possible next tokens with a percentage chance assigned to each. The AI samples from this distribution to pick the next word."
        },
        {
          term: "Context Window",
          definition: "The amount of preceding text the AI can 'see' when making its prediction. More context = better predictions, but every model has a limit."
        }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "Period 9" },
  ];
  const lessonId = "token-prediction-lab";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
