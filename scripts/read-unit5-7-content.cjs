const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const LESSON_IDS = [
  // Unit 5
  'ai-in-healthcare','ai-in-law','ai-in-art','ai-in-climate',
  'ai-in-hiring','ai-in-policing','ai-in-education','ai-real-world-synthesis',
  // Unit 6
  'prompt-engineering-deep-dive','ai-as-research-partner','ai-writing-line',
  'building-with-ai','ai-tool-ethics','personal-ai-workflow',
  // Unit 7
  'careers-in-ai','human-ai-collaboration','jobs-ai-will-wont-replace',
  'ai-policy-regulation','ai-futures-choice-project','course-reflection-synthesis',
];

async function main() {
  const snap = await db.collection('courses').doc('Y9Gdhw5MTY8wMFt6Tlvj').collection('lessons').get();
  const lessons = {};
  snap.docs.forEach(d => { lessons[d.id] = d.data(); });

  for (const id of LESSON_IDS) {
    const l = lessons[id];
    if (!l) { console.log(`MISSING: ${id}`); continue; }
    const textBlocks = (l.blocks || []).filter(b => b.type === 'text').map(b => b.content?.substring(0, 200));
    console.log(`\n--- ${l.title} (${id}) ---`);
    textBlocks.slice(0, 2).forEach(t => console.log(t));
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
