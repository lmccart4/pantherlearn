/**
 * AI Literacy Unit 6, Lesson 6: Personal AI Workflow Design
 * Order: 54 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'personal-ai-workflow',
  title: 'Design Your AI Workflow: Build a System That Actually Works for You',
  order: 54,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Audit how you currently use (or don\'t use) AI tools',
      'Identify high-value opportunities to integrate AI into your personal workflows',
      'Design a practical, sustainable AI workflow you\'ll actually use',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Right now, how do you actually use AI in your daily life — school, personal, creative? Be honest about what you use, how often, and for what.' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: What a Workflow Actually Is' },
    { type: 'text', id: id(), content: `A **workflow** is just a repeatable system for getting something done. Workflows reduce friction, improve consistency, and save mental energy for the parts that actually require your thinking.\n\nThe people getting the most value from AI aren\'t using it randomly. They\'ve figured out where AI plugs into their existing processes and created habits around it.\n\n**Examples of AI workflows that actually stick:**\n\n**The Morning Catch-Up:** Paste overnight news summaries into AI and ask for a 5-minute brief on what matters in a specific domain.\n\n**The Unsticker:** Whenever stuck on a problem for more than 10 minutes, describe it to AI and ask for three different approaches you haven\'t tried.\n\n**The Pre-Write Dump:** Before writing anything important, brain-dump your thoughts in messy notes, then ask AI to identify themes and suggest a structure. You write from that structure.\n\n**The Feedback Loop:** After completing any significant work, paste it and ask AI for the three most important things to improve before submitting.\n\n**The Learning Accelerator:** After a confusing class or reading, ask AI to explain the two things you understood least and give you three practice questions.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Which of the workflow examples above is most useful to you personally right now? Why?' },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: Audit Your Current Approach' },
    { type: 'activity', id: id(), title: 'AI Audit', instructions: 'List every task you regularly do at school or in your personal life where you currently struggle, waste time, or feel stuck. For each one, ask: could AI help with this? How specifically? Make two columns: "Tasks AI could help with" and "Tasks AI wouldn\'t help or could make worse."' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'From your audit: what is the single highest-value place AI could fit into your workflow that you\'re currently not using it for? What\'s stopped you from using it there?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Design Your System' },
    { type: 'text', id: id(), content: `A good personal AI workflow has three elements:\n\n**1. Trigger** — What event or situation causes you to reach for AI? Be specific.\n*Example: "Whenever I sit down to write a paper and have a blank page."\n\n**2. Action** — Exactly what do you do? What do you type? What tool do you use?\n*Example: "I open Claude and say: I need to write a [type] about [topic]. I have these rough ideas: [dump]. Give me 3 possible structures."\n\n**3. Guardrail** — What do you do to make sure AI helps rather than replaces your thinking?\n*Example: "I choose the structure myself and write all the content. AI only shapes the skeleton."` },
    { type: 'callout', id: id(), content: '**The Test of a Good Workflow:** After using it for a week, do you feel sharper and more capable — or do you feel dependent and hollowed out? The first means you built something good. The second means you\'re outsourcing instead of amplifying.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Design your personal AI workflow using the three elements: Trigger, Action, Guardrail. Write it out completely. This is something you will actually try to use.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Looking back at this whole unit — prompt engineering, research, writing, building, ethics, workflow — what is the one most valuable thing you\'re taking with you? What will you actually do differently?' },
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
