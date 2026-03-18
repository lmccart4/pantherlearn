/**
 * AI Literacy Unit 7, Lesson 6: Course Reflection and Synthesis
 * Order: 60 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'course-reflection-synthesis',
  title: 'Where You Started, Where You Are: Course Reflection',
  order: 60,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Before We Begin' },
    { type: 'objectives', id: 'obj-1', items: [
      'Reflect honestly on how your understanding of AI has changed',
      'Identify the most important things you learned and why they matter',
      'Articulate what you\'ll carry forward from this course',
    ]},
    { type: 'text', id: id(), content: `This is the last lesson of the course. No new content. No new concepts to learn.\n\nThis is for you to stop, look back, and think about what actually happened here — because reflection is how learning becomes permanent.` },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: Then and Now' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think back to the very first week of this course. What did you think AI was? What did you think it could and couldn\'t do? Be honest about your starting point.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What is the single biggest thing that changed in how you think about AI? What specifically caused that shift?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What is one thing you believed about AI at the start of this course that you now think was wrong or incomplete?' },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: What Stuck' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'We covered a lot: how AI works, creativity, information, society, real-world domains, hands-on tools, and the future. What was the most important thing you learned? Why that one?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What\'s one lesson or concept from this course that you\'ve already used in your real life — or that you\'ve thought about outside of school?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What is one question about AI that this course raised for you that you still don\'t have a good answer to? What would you need to learn or experience to start answering it?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Going Forward' },
    { type: 'callout', id: id(), content: '**A Note:** You\'re leaving this class with something most people your age don\'t have — a real framework for thinking about AI. Not just "AI is cool" or "AI is scary," but an actual ability to analyze, evaluate, and form your own positions. That\'s not nothing. That\'s genuinely rare.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'In one year, how do you think AI will have changed? What will be different about your life, your school, or your community?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Write a 3–5 sentence message to yourself to read in 5 years. What do you want to remind yourself about AI, about this moment, or about what you believe right now?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Last one: what advice would you give to a student who\'s about to start this course next year? What should they know going in?' },
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
