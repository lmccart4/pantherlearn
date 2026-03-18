/**
 * AI Literacy Unit 6, Lesson 1: Prompt Engineering Deep Dive
 * Order: 49 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'prompt-engineering-deep-dive',
  title: 'Prompt Engineering Deep Dive: The Art of Talking to AI',
  order: 49,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Apply the CRAFT framework to construct high-quality AI prompts',
      'Diagnose why weak prompts produce weak outputs',
      'Demonstrate the difference between novice and expert prompting',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You ask an AI "write me an essay" and get back something generic and useless. What went wrong — and whose fault is it?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: Why Prompting Is a Skill' },
    { type: 'text', id: id(), content: `AI doesn't read minds. It responds to exactly what you give it — no more, no less. The same AI model that produces garbage for one person produces brilliant output for another. The difference is almost always the prompt.\n\nThink of it like this: asking an AI to "write an essay" is like walking into a restaurant and saying "food please." You might get something edible. You definitely won't get what you actually wanted.\n\n**The CRAFT Framework** gives you a system for building prompts that consistently get high-quality results:\n\n- **C** — Context: Set the scene. Who are you? What's the situation?\n- **R** — Role: Give the AI a persona to inhabit. "Act as a science journalist..."\n- **A** — Action: Be specific about what you want done\n- **F** — Format: Tell it how to structure the output\n- **T** — Tone: Specify the voice and register` },
    { type: 'callout', id: id(), content: '**The Principle:** AI outputs are almost always a reflection of input quality. Garbage in, garbage out — but also: precision in, precision out.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Take this weak prompt: "Explain photosynthesis." Rewrite it using every element of CRAFT. Write out your improved prompt in full.' },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: Advanced Techniques' },
    { type: 'text', id: id(), content: `Beyond CRAFT, expert prompters use several advanced moves:\n\n**Chain of Thought**\nAsk the AI to "think step by step" before giving a final answer. This dramatically improves accuracy on reasoning tasks. Compare:\n- Weak: "What's 15% of 340?"\n- Strong: "Calculate 15% of 340. Show your reasoning step by step before giving the final answer."\n\n**Few-Shot Examples**\nShow the AI what you want by giving it 2-3 examples before making your request. The AI learns the pattern from your examples.\n\n**Constraints and Anti-Patterns**\nTell the AI what NOT to do. "Explain quantum entanglement to a 10-year-old. Do not use jargon. Do not mention Schrödinger's cat. Keep it under 100 words."\n\n**Iterative Refinement**\nYour first prompt is a draft. Get an output, then prompt again: "That's a good start. Now make it more [concise / specific / surprising / persuasive]. Focus especially on the second paragraph."` },
    { type: 'activity', id: id(), title: 'Prompt Battle', instructions: 'Round 1: Write the weakest possible prompt to get a biography of Marie Curie. Round 2: Write the best possible prompt using CRAFT + at least one advanced technique. Compare outputs side by side. What changed?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Paste your best CRAFT prompt from the Prompt Battle here. Then describe: what specifically in your prompt caused the improvement you saw?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Real-World Applications' },
    { type: 'text', id: id(), content: `Prompting isn't just a classroom skill. Here's where it applies:\n\n**At School:** Research assistance, essay feedback, concept explanation, study guides, practice problems\n**At Work:** Report drafting, data summarization, email writing, presentations\n**In Creative Work:** Brainstorming, worldbuilding, editing feedback, style experimentation\n**In Problem Solving:** Breaking down complex tasks, generating options, stress-testing ideas\n\nThe person who can reliably get AI to produce exactly what they need will have an edge — in school, in careers, and in life.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Write a prompt you\'d actually use — for something real in your life right now. Apply CRAFT and at least one advanced technique. Then explain what you were trying to accomplish and how your prompt achieves it.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What\'s the difference between someone who can "use AI" and someone who is genuinely skilled at working with AI? Where does prompting fit in that gap?' },
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
