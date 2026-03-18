/**
 * AI Literacy Unit 6, Lesson 3: AI-Assisted vs AI-Generated Writing
 * Order: 51 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-writing-line',
  title: 'Where\'s the Line? AI-Assisted vs. AI-Generated Writing',
  order: 51,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Distinguish between AI-assisted and AI-generated writing',
      'Evaluate the ethical and practical implications of each',
      'Develop a personal policy for AI use in your own writing',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Where do YOU draw the line between acceptable AI help and cheating on writing? Be honest.' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: A Spectrum, Not a Binary' },
    { type: 'text', id: id(), content: `AI and writing isn\'t on/off — it\'s a spectrum. Here are real scenarios, from least to most AI-involved:\n\n1. Using spell-check and grammar tools (Grammarly) — universally accepted\n2. Asking AI to suggest better word choices for a sentence you wrote\n3. Asking AI to give feedback on your draft\'s structure\n4. Asking AI to rewrite a paragraph you wrote to improve clarity\n5. Asking AI to write a paragraph on a topic, then heavily editing it\n6. Asking AI to write a full section from an outline you created\n7. Asking AI to write the whole essay from a prompt, then lightly editing\n8. Submitting AI output word-for-word as your own work\n\nMost people agree #1 is fine and #8 is academic dishonesty. The middle is where it gets complicated — and where honest conversations need to happen.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Look at the spectrum above. Where would you personally draw the line between acceptable and unacceptable for a school writing assignment? Explain your reasoning.' },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: What You Lose When AI Writes for You' },
    { type: 'text', id: id(), content: `Writing isn\'t just about producing a document. The process of writing IS the learning:\n\n**Writing forces thinking.** When you struggle to articulate something, you\'re discovering what you actually understand — and what you don\'t.\n\n**Writing builds voice.** Your writing style is a skill built over years of practice. If AI writes for you, you never develop it.\n\n**Writing is communication.** In jobs, in relationships, in advocacy — the ability to write clearly and persuasively is one of the most valuable skills you can have. It cannot be delegated to AI in your actual life.\n\n**Writing is evidence of learning.** When a teacher assigns an essay, they\'re not just collecting words — they\'re trying to see what you understand. AI output tells them nothing about you.` },
    { type: 'callout', id: id(), content: '**The Honest Question:** If AI writes your essay and you get an A, what did you actually learn? What can you do now that you couldn\'t do before?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Using AI to Become a Better Writer' },
    { type: 'text', id: id(), content: `Here\'s the flip: AI can make you a significantly better writer — if you use it right.\n\n**Feedback mode:** Write your draft first. Then ask AI: "What are the three weakest parts of this argument? What evidence am I missing? Where am I being vague?"\n\n**Comparison mode:** Write a paragraph. Ask AI to write one on the same point. Compare them. What did AI do better? What did you do better? Now write a third version that combines the best of both.\n\n**Unsticking mode:** When you\'re stuck mid-draft, describe to AI what you\'re trying to say. Often just articulating it in natural language breaks the block — and you write it yourself.\n\n**Editing mode:** After you\'re happy with your draft, ask AI to find grammatical issues, unclear sentences, or logical gaps. Evaluate each suggestion critically — don\'t accept all of them.` },
    { type: 'activity', id: id(), title: 'The Comparison Draft', instructions: 'Pick any topic and write a paragraph (5-7 sentences) expressing your genuine opinion on it. Then ask AI to write a paragraph on the same topic. Compare: what\'s stronger in yours? What\'s stronger in the AI\'s? Write a final version that takes the best of both — but is clearly YOUR voice.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'After the Comparison Draft activity: what did you keep from your original? What did you take from the AI version? What did you change in the final? What does this tell you about your strengths as a writer?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Write a personal AI writing policy — the rules you\'ll actually follow for yourself when it comes to using AI on writing assignments. Make them specific enough to be meaningful.' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
    const snap = await ref.get();
    if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
    await ref.set(lesson);
    console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
