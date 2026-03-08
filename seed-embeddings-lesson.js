// seed-embeddings-lesson.js
// Run from your pantherlearn directory: node seed-embeddings-lesson.js
// This creates the Embeddings lesson for Foundations of Generative AI unit
// Deploy after deploying the Embedding Explorer standalone app

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, 'Functions/') + '/');
const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const lesson = {
  title: "How AI Understands Meaning: Intro to Embeddings",
  course: "AI Literacy",
  unit: "Foundations of Generative AI",
  order: 7,
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
      id: "b0",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain what an embedding is and why AI needs to turn words into numbers",
        "Demonstrate that similar words have similar embeddings (close in number-space)",
        "Identify real-world applications of embeddings (search, recommendations, translation)",
        "Recognize how embedding bias can reflect biases in training data"
      ]
    },
    {
      id: "b1",
      type: "text",
      content: "Have you ever wondered how Spotify knows what song to play next? Or how Google finishes your sentences before you're done typing? Or how your phone knows that when you search \"funny cat videos\" and \"hilarious kitten clips,\" you want the same thing — even though those are completely different words?\n\nThe answer is something called **embeddings** — and by the end of today, you'll understand how they work."
    },
    {
      id: "b2",
      type: "callout",
      icon: "🤔",
      style: "insight",
      content: "**Think About This:**\n\nComputers only understand numbers. They don't speak English, Spanish, or any human language. So how does an AI \"understand\" that the word *happy* and the word *joyful* mean almost the same thing?"
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "How do you think a computer could figure out that \"happy\" and \"joyful\" mean similar things, even though they're completely different words? Take your best guess — there are no wrong answers here!",
      placeholder: "I think the computer might..."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN INSTRUCTION (~25 min)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main Instruction",
      subtitle: "~25 minutes",
      icon: "📚"
    },
    {
      id: "b3",
      type: "text",
      content: "Here's the big idea: AI takes every word and converts it into a **list of numbers**. These numbers capture the *meaning* of the word — not how it's spelled, not how it sounds, but what it actually *means*.\n\nWords with similar meanings get similar numbers. Words with different meanings get different numbers. It's like giving every word a GPS coordinate in \"meaning space.\""
    },
    {
      id: "d1",
      type: "definition",
      term: "Embedding",
      definition: "A way of representing words, sentences, or other data as a list of numbers (called a vector) that captures their meaning. Similar things get similar numbers, so AI can measure how related two concepts are."
    },
    {
      id: "b4",
      type: "callout",
      icon: "🗺️",
      style: "tip",
      content: "**Analogy:** Think of it like a map. On a real map, cities that are close together (like Philadelphia and Camden) have similar GPS coordinates. In embedding space, words that are similar in meaning (like \"dog\" and \"puppy\") have similar number coordinates."
    },
    {
      id: "b5",
      type: "text",
      content: "Now it's time to see this in action. In the activity below, you'll:\n\n1. **Sort words** by similarity on a grid (and see how AI does the same thing)\n2. **Decode vectors** — the number lists that represent word meaning\n3. **Explore an embedding plot** — type words and watch them cluster by meaning\n4. **Connect it to the real world** — see how Spotify, Google, and other tools use embeddings\n\nYou'll earn points as you go and get a final score at the end. Let's go! 🚀"
    },

    // ── THE EMBEDDING EXPLORER ACTIVITY ──────────────────
    {
      id: "embed-explorer",
      type: "embed",
      url: "https://embedding-explorer-paps.web.app",
      caption: "🧬 The Embedding Explorer — Interactive Activity",
      height: 800
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP (~5 min)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words, explain what an embedding is to someone who has never heard of AI. Use an analogy or real-world example to make it click.",
      placeholder: "An embedding is like..."
    },
    {
      id: "q3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following is the BEST description of what embeddings do?",
      options: [
        "They translate English words into other languages",
        "They turn words into numbers that capture meaning, so similar words have similar numbers",
        "They count how many times a word appears in a document",
        "They convert text into images"
      ],
      correctIndex: 1,
      explanation: "Embeddings represent meaning as numbers. They don't translate, count, or create images — they capture the relationships between concepts so AI can measure similarity."
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "We learned that embeddings can carry biases from their training data (like \"doctor\" being closer to \"man\" than \"woman\"). Why is this a problem, and what could we do about it?",
      placeholder: "This is a problem because..."
    },
    {
      id: "vocab1",
      type: "vocab_list",
      title: "Key Vocabulary",
      terms: [
        {
          term: "Embedding",
          definition: "A representation of data (like words) as a list of numbers that captures meaning. Similar items have similar number patterns."
        },
        {
          term: "Vector",
          definition: "A list of numbers that represents a point in space. In AI, word vectors are the numerical representation of a word's meaning."
        },
        {
          term: "Similarity / Distance",
          definition: "How close or far apart two embeddings are in number-space. Small distance = similar meaning. Large distance = different meaning."
        },
        {
          term: "Embedding Bias",
          definition: "When embeddings reflect unfair patterns from training data, like associating certain jobs with certain genders."
        },
        {
          term: "Dimensionality",
          definition: "The number of values in an embedding vector. Real AI embeddings might have hundreds or thousands of dimensions — our activity used just 2-3 for simplicity."
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
  ];

  const lessonId = "embeddings-intro";

  for (const course of courses) {
    await db.collection('courses').doc(course.courseId)
      .collection('lessons').doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
