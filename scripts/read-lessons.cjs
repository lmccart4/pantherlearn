const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const targets = [
    { courseId: 'physics', lessonId: '61c57995' },
    { courseId: 'physics', lessonId: '7eb3eec6' },
    { courseId: 'Y9Gdhw5MTY8wMFt6Tlvj', lessonId: '15d68c40' },
    { courseId: 'Y9Gdhw5MTY8wMFt6Tlvj', lessonId: 'real-vs-ai-quiz' },
  ];
  
  for (const t of targets) {
    const doc = await db.collection('courses').doc(t.courseId).collection('lessons').doc(t.lessonId).get();
    const d = doc.data();
    console.log(`\n=== ${d.title} (${t.courseId}) ===`);
    (d.blocks || []).forEach(b => console.log(`  [${b.type}] ${b.label || b.content?.substring(0,80) || b.url || b.id}`));
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
