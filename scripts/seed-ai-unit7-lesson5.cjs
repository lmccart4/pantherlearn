/**
 * AI Literacy Unit 7, Lesson 5: Student Choice Mini-Project
 * Order: 59 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-futures-choice-project',
  title: 'Your AI Future: Mini-Project (Choose Your Path)',
  order: 59,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Overview' },
    { type: 'objectives', id: 'obj-1', items: [
      'Apply your AI literacy knowledge to a self-directed creative or analytical project',
      'Demonstrate understanding of AI\'s impact through a format of your choice',
      'Produce something you\'re genuinely proud of',
    ]},
    { type: 'text', id: id(), content: `This is your chance to take what you know and do something with it. Choose one of four tracks below. You\'ll have class time to work — this is a real project, not a worksheet.\n\n**All tracks share the same goal:** Show that you understand how AI intersects with the real world, using evidence and your own analysis.` },
    { type: 'section_header', id: 'sh-tracks', label: 'Choose Your Track' },
    { type: 'callout', id: id(), variant: 'info', content: `**Track A — Debate**\nPick an AI policy question from this unit (or propose your own). Write a structured debate argument: a 3–4 paragraph position paper arguing FOR or AGAINST a specific AI policy. Must include:\n- A clear thesis\n- At least two specific pieces of evidence (real cases, studies, or examples from class)\n- An acknowledgment of the strongest counterargument and why you still hold your position\n\n*You will present your argument to the class in 3–4 minutes.*` },
    { type: 'callout', id: id(), variant: 'info', content: `**Track B — Research**\nPick any topic at the intersection of AI and society that interests you. Write a 400–600 word research brief that:\n- Explains what\'s happening (the facts)\n- Analyzes why it matters\n- Identifies who benefits and who bears risk\n- Ends with your recommendation or verdict\n\nYou must use at least two real sources (not AI-generated). AI can help you understand and organize — not write the brief for you.` },
    { type: 'callout', id: id(), variant: 'info', content: `**Track C — Design**\nDesign something that helps people understand an AI concept or issue. Options:\n- An infographic explaining a complex AI topic to someone who knows nothing about it\n- A one-page "user guide" for interacting ethically with AI tools\n- A visual timeline of AI regulation milestones\n- A mock "AI impact label" (like a nutrition label) for a specific AI product\n\nMust include a 3–4 sentence explanation of your design choices — what you included, what you left out, and why.` },
    { type: 'callout', id: id(), variant: 'info', content: `**Track D — Creative**\nCreate a piece of creative writing (fiction, poem, short story, or personal essay) that explores a theme from this unit. Options:\n- A short story set in a world where one specific AI policy was enacted (or wasn\'t)\n- A personal essay about how your thinking about AI has changed over this course\n- A fictional "day in the life" of someone in an AI-transformed career\n- A poem or lyrical piece about human-AI collaboration, automation, or the future\n\nMinimum 300 words. Must connect to at least one specific concept from class.` },
    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Choice' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'Which track are you choosing for your mini-project?',
      options: ['Track A — Debate', 'Track B — Research', 'Track C — Design', 'Track D — Creative'],
      correct: null },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What specific topic or question will your project focus on? Write 2–3 sentences describing what you\'re making and why you chose this topic.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'When you\'re done, paste your completed project here (or describe it if it\'s a visual). This is your submission.' },
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
