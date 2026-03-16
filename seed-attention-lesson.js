// seed-attention-lesson.js
// Seeds the Attention Visualizer lesson into PantherLearn (all three course periods).
// Run from your pantherlearn directory: node seed-attention-lesson.js
//
// Deploy the attention-visualizer app first:
//   cd full-session-build/attention-visualizer && npm run build && cd ../..
//   firebase deploy --only hosting:attention-visualizer

import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(resolve(__dirname, 'Functions/') + '/');
const admin = require('firebase-admin');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const lesson = {
  title: "Seeing Attention in Action",
  subtitle: "The Attention Visualizer",
  course: "AI Literacy",
  unit: "Foundations of Generative AI",
  order: 10,
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
      content: "Read these two sentences:\n\n1. **\"I need to go to the bank to deposit my check.\"**\n2. **\"We sat on the bank and watched the ducks swim by.\"**\n\nThe word **\"bank\"** appears in both sentences. But it means something completely different each time."
    },
    {
      id: "b2",
      type: "question",
      questionType: "short_answer",
      prompt: "Without looking anything up: which SPECIFIC words in each sentence tell you what 'bank' means? List at least 2 words for each sentence.",
      placeholder: "In sentence 1, the words ___ and ___ tell me bank means...\nIn sentence 2, the words ___ and ___ tell me bank means..."
    },
    {
      id: "b3",
      type: "callout",
      icon: "🧠",
      style: "insight",
      content: "**You just did what the attention mechanism does!** You looked at the OTHER words in each sentence and used them to figure out the meaning of an ambiguous word. The attention mechanism does the same thing — it assigns 'weights' to each word showing how much it matters for understanding the target word."
    },
    {
      id: "b4",
      type: "text",
      content: "Remember from our previous lessons:\n\n- **Embeddings** give each word a set of numbers representing its meaning in vector space\n- **Neural networks** process relationships between words layer by layer\n- **Attention** is the specific mechanism that dynamically updates a word's meaning by looking at all other words in context\n\nToday, you'll actually SEE attention in action — with weighted arrows showing which words the model focuses on when deciding meaning."
    },

    // ═══════════════════════════════════════════════════════
    // MAIN ACTIVITY (~25 min)
    // ═══════════════════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      title: "Main Activity: Attention Visualizer",
      subtitle: "~25 minutes",
      icon: "📚"
    },
    {
      id: "b5",
      type: "definition",
      term: "Attention Weight",
      definition: "A number (0% to 100%) showing how much one word 'pays attention to' another word when determining meaning. Higher weight = that word matters more for understanding the target word. All weights for a given word sum to 100%."
    },
    {
      id: "b6",
      type: "text",
      content: "You'll work through **9 sentences** across **3 stages**:\n\n**Stage 1 — Observe:** Watch attention arrows light up to show which context words matter most. Can you see why those words are the important ones?\n\n**Stage 2 — Predict:** Before seeing the weights, click the words YOU think the attention mechanism will focus on. Then compare your prediction to what the model actually does.\n\n**Stage 3 — Challenge:** Tricky sentences — idioms, repeated words with different meanings, and competing interpretations. These are the genuinely hard cases."
    },
    {
      id: "b7",
      type: "embed",
      url: "https://attention-visualizer-paps.web.app",
      caption: "Attention Visualizer — 9 sentences across 3 stages",
      height: 720,
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
      id: "b8",
      type: "question",
      questionType: "short_answer",
      prompt: "In the activity, the same word ('bat,' 'bank,' 'crane') had completely different attention patterns depending on the sentence. In your own words, explain WHY the attention weights changed — what was different between the sentences?",
      placeholder: "The attention weights changed because..."
    },
    {
      id: "b9",
      type: "question",
      questionType: "short_answer",
      prompt: "The Challenge stage included 'The patient doctor treated the patient with care.' The word 'patient' appeared twice with different meanings (adjective vs. noun). Why is this especially hard for an AI, and how does the attention mechanism help solve it?",
      placeholder: "This is hard because the same word appears twice... Attention helps because..."
    },
    {
      id: "b10",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Consider the sentence: 'She saw the man with the telescope.' This is genuinely ambiguous — she could have used a telescope to see the man, OR she saw a man who had a telescope. How would an attention-based language model handle this ambiguity?",
      options: [
        "It can't process ambiguous sentences — they cause errors",
        "It randomly picks one meaning each time",
        "It looks at surrounding context (previous sentences, topic, other details) to assign higher weight to the more likely interpretation",
        "It always picks the first meaning in its training data"
      ],
      correctIndex: 2,
      explanation: "Attention handles ambiguity by consulting ALL surrounding context, not just the immediate words. In a real conversation or document, the sentences before and after would provide clues — a previous mention of stargazing would push toward telescope-as-tool; a previous mention of a spy would push toward telescope-as-possession. Without that broader context, even powerful models struggle with sentences like this."
    },
    {
      id: "b11",
      type: "vocab_list",
      title: "Key Vocabulary",
      terms: [
        {
          term: "Attention Weight",
          definition: "A number (0%–100%) showing how much one word 'pays attention to' another when determining meaning. All weights for a given word sum to 100%."
        },
        {
          term: "Context Window",
          definition: "All the words the model can 'see' at once when making predictions. Longer context windows let the model consider more surrounding text."
        },
        {
          term: "Disambiguation",
          definition: "The process of determining which meaning of an ambiguous word is intended, based on surrounding context. Example: 'bank' → financial institution vs. edge of a river."
        },
        {
          term: "Positional Encoding",
          definition: "The way a transformer tracks word ORDER in a sentence, since attention itself doesn't care about position. 'The patient doctor' and 'the doctor's patient' have identical words but completely different meanings because of order."
        },
        {
          term: "Self-Attention",
          definition: "When a model attends to other words within the SAME sequence to understand context. This is what you saw in the activity — each word 'looking at' every other word to update its own meaning."
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

  const lessonId = "attention-visualizer";

  for (const course of courses) {
    await db.collection('courses').doc(course.courseId)
      .collection('lessons').doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  console.log('\nDone. Deploy the activity if you haven\'t already:');
  console.log('  firebase deploy --only hosting:attention-visualizer');

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
