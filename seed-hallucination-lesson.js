// seed-hallucination-lesson.js
// Seeds the Hallucination Lab lesson into PantherLearn (all four course periods).
// Run from your pantherlearn directory: node seed-hallucination-lesson.js

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, 'Functions/') + '/');
const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const lesson = {
  title: "The Hallucination Lab",
  subtitle: "When AI Lies Confidently",
  course: "AI Literacy",
  unit: "Foundations of Generative AI",
  order: 11,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════════════════
    // WARM UP (~10 min)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "b1",
      type: "text",
      content: "Read this paragraph:\n\n*\"The Great Wall of China, completed in 214 BC by Emperor Qin Shi Huang, is the only man-made structure visible from space. Stretching over 13,000 miles, it was built primarily to keep out the Mongol Empire and took over 2 million workers to construct, with an estimated 400,000 dying during the process.\"*\n\nThis paragraph sounds confident, specific, and authoritative. But **at least 3 claims in it are wrong or misleading.**"
    },
    {
      id: "b2",
      type: "question",
      questionType: "short_answer",
      prompt: "Which claims in the paragraph above do you think might be wrong or misleading? List as many as you can and explain why you're suspicious.",
      placeholder: "I think the claim about ___ might be wrong because..."
    },
    {
      id: "b3",
      type: "callout",
      icon: "🤯",
      style: "insight",
      content: "**Here's the truth:**\n\n1. The Great Wall is **NOT** visible from space with the naked eye — this is one of the most persistent myths about it.\n2. It wasn't \"completed\" in 214 BC — construction spanned many dynasties over roughly 2,000 years.\n3. It wasn't built specifically to keep out the Mongols — the earliest walls predate the Mongol Empire by over 1,000 years.\n\nThis paragraph reads exactly like something an AI might write: confident, detailed, and partially wrong. When AI generates text like this, we call the false parts **hallucinations**."
    },
    {
      id: "b4",
      type: "definition",
      term: "Hallucination (AI)",
      definition: "When an AI model generates information that sounds confident and plausible but is actually false, fabricated, or inaccurate. This happens because the model predicts probable-sounding text rather than checking facts against a source of truth."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN ACTIVITY (~25 min)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main Activity: The Hallucination Lab",
      subtitle: "~25 minutes",
      icon: "📚"
    },
    {
      id: "b5",
      type: "text",
      content: "Now you'll experience hallucinations firsthand. You'll prompt an AI chatbot about real topics — but the AI has been set up to **subtly mix false information into its responses.**\n\nYour job each round:\n1. **Chat** — Ask the AI about a topic using the suggested prompt (or your own)\n2. **Investigate** — Read the response carefully and flag sentences you think are hallucinations\n3. **Classify** — Label each flagged claim by hallucination type (wrong date, fake study, invented detail, etc.)\n\nThe hallucinations get harder to spot as you progress through three stages. Can you catch them all?"
    },
    {
      id: "b6",
      type: "embed",
      url: "https://hallucination-lab-paps.web.app",
      caption: "Hallucination Lab — 6 investigations across 3 difficulty stages",
      height: 760,
      scored: true
    },

    // ═══════════════════════════════════════════════════════
    // SOCRATIC WRAP UP (~5 min)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Socratic Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "b7",
      type: "question",
      questionType: "short_answer",
      prompt: "Think back to what you learned about token prediction — a language model picks the 'most likely next word' based on patterns in its training data. How does this explain WHY hallucinations happen? Connect token prediction to what you experienced today.",
      placeholder: "Hallucinations happen because..."
    },
    {
      id: "b8",
      type: "question",
      questionType: "short_answer",
      prompt: "A student uses ChatGPT to research a topic for a school paper. The AI gives them 5 sources with author names and publication dates. Based on what you learned today, what should the student do before citing those sources? Why?",
      placeholder: "The student should..."
    },
    {
      id: "b9",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why are AI hallucinations particularly dangerous compared to other types of misinformation?",
      options: [
        "Because AI always lies on sensitive topics",
        "Because they're mixed with accurate information and stated with complete confidence, making them hard to distinguish from truth",
        "Because AI is intentionally programmed to deceive people",
        "Because hallucinations only happen with obscure facts most people can't verify"
      ],
      correctIndex: 1,
      explanation: "AI hallucinations are dangerous precisely because they're embedded in mostly-accurate responses and delivered with total confidence. The model doesn't signal uncertainty — it states false claims the same way it states true ones. This makes critical thinking and fact-checking essential whenever you use AI-generated content."
    },
    {
      id: "b10",
      type: "vocab_list",
      title: "Key Vocabulary",
      terms: [
        {
          term: "Hallucination",
          definition: "When an AI generates false or fabricated information that sounds confident and plausible. Named by analogy to psychological hallucinations — experiencing something that isn't there."
        },
        {
          term: "Confabulation",
          definition: "A related term from psychology — when someone fills memory gaps with fabricated information without intending to deceive. AI does something structurally similar."
        },
        {
          term: "Grounding",
          definition: "A technique for reducing hallucinations by connecting AI responses to verified source documents or databases (retrieval-augmented generation). Forces the model to cite its sources."
        },
        {
          term: "Fact-checking",
          definition: "The process of verifying claims against reliable, primary sources — the most important skill for working with AI-generated content."
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

  const lessonId = "hallucination-lab";

  for (const course of courses) {
    await db.collection('courses').doc(course.courseId)
      .collection('lessons').doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
