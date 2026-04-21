/**
 * AI Literacy Unit 6, Lesson 2: AI as a Research Partner
 * Order: 50 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-as-research-partner',
  title: 'AI as a Research Partner: Fast, Useful, and Sometimes Wrong',
  order: 50,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Use AI effectively as a starting point for research — not an ending point',
      'Identify when AI-generated information requires verification',
      'Build a personal research workflow that combines AI speed with human judgment',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Have you ever used AI to research something and then found out the information was wrong? What happened? If not — what\'s your current research process?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: What AI Is Good at in Research' },
    { type: 'text', id: id(), content: `AI is genuinely useful as a research tool — but only if you use it for the right things:\n\n**What AI does well:**\n- Explaining complex concepts in plain language\n- Generating a starting list of questions to investigate\n- Summarizing large amounts of text quickly\n- Suggesting search terms, angles, and subtopics you hadn\'t thought of\n- Synthesizing multiple perspectives on a debated topic\n- Translating jargon-heavy sources into readable summaries\n\n**What AI does poorly:**\n- Citing real, accurate sources (it frequently hallucinates citations)\n- Knowing what happened after its training cutoff\n- Distinguishing between authoritative and low-quality sources\n- Catching its own factual errors — it states wrong things with full confidence` },
    { type: 'callout', id: id(), content: '**The Hallucination Problem in Research:** AI will confidently cite papers, studies, and statistics that don\'t exist. A lawyer was fined by a federal judge in 2023 for submitting court briefs with AI-generated fake case citations. The lawyer didn\'t verify a single one.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'You\'re writing a paper on climate policy and ask AI for three academic sources. It gives you three citations with authors, journal names, and page numbers. What should you do first?',
      options: [
        'Use them directly — the AI is reliable for academic citations',
        'Check each citation actually exists before using it — AI frequently invents plausible-looking sources',
        'Only use them if the journal names sound familiar',
        'Ask the AI if it\'s sure the sources are real',
      ], correctIndex: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: The Research Partner Workflow' },
    { type: 'text', id: id(), content: `Here\'s a workflow that uses AI\'s strengths without falling into its traps:\n\n**Step 1 — Orient (AI)**\nAsk AI to explain the topic broadly. What are the key concepts? What are the main debates? What terms should you know? This builds your mental map fast.\n\n**Step 2 — Question (AI)**\nAsk AI: "What are the best questions to investigate about this topic?" or "What are five angles a researcher might take?" Use these to guide your real research.\n\n**Step 3 — Find Real Sources (Human)**\nUse Google Scholar, your school library, or credible news sources to find actual articles. Do NOT use AI-generated citations.\n\n**Step 4 — Understand (AI)**\nPaste complex source text into AI and ask it to explain, summarize, or identify the main argument. This saves time reading dense academic language.\n\n**Step 5 — Synthesize (You)**\nYou make the connections. You form the argument. AI helps you process information faster — the thinking is still yours.` },
    { type: 'activity', id: id(), title: 'Research Sprint', instructions: 'Pick a topic you\'re curious about (anything — not just school-related). Use the 5-step workflow above. Document each step: what you asked AI, what it gave you, what you verified, what you found on your own. Time yourself — 15 minutes total.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Describe one thing AI gave you in your Research Sprint that turned out to be wrong, incomplete, or needed verification. How did you catch it?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Knowing When to Trust It' },
    { type: 'text', id: id(), content: `Not all AI outputs need the same level of verification:\n\n**High trust (still verify occasionally):**\nExplanations of well-established concepts, math, logical reasoning, summarizing text you provide\n\n**Medium trust (verify before using):**\nHistorical facts, scientific claims, statistics, named people and organizations\n\n**Low trust (always verify):**\nCitations and sources, recent events, niche topics, anything with specific numbers or dates, legal or medical information` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Build your personal AI research rule. Complete this sentence: "I will use AI for research to _______, but I will always verify _______ because _______."' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'How does using AI as a research tool change what skills a student needs? What becomes more important? What becomes less important?' },
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
