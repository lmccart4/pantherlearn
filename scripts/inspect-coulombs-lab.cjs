const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

(async () => {
  const ref = db.collection('courses').doc('physics').collection('lessons').doc('coulombs-law-data-lab');
  const snap = await ref.get();
  const blocks = snap.data().blocks || [];
  blocks.forEach((b, i) => {
    const summary = b.label || b.title || b.prompt || b.content || b.caption || b.url || '';
    console.log(`${String(i).padStart(2)}. [${b.type}] ${b.id}  ${String(summary).slice(0, 110).replace(/\n/g, ' ')}`);
  });
  process.exit(0);
})();
