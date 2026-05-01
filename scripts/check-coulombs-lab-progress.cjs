const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

(async () => {
  const lessonRef = db.collection('courses').doc('physics').collection('lessons').doc('coulombs-law-data-lab');
  const snap = await lessonRef.get();
  if (!snap.exists) { console.log('Lesson not found'); process.exit(0); }
  const d = snap.data();
  console.log('visible:', d.visible, 'order:', d.order, 'block count:', (d.blocks||[]).length);

  // Check progress
  const prog = await db.collectionGroup('progress').where('lessonId', '==', 'coulombs-law-data-lab').limit(5).get();
  console.log('progress docs found:', prog.size);
  prog.forEach(p => console.log(' -', p.ref.path));

  // Also check via lessonProgress collection (alternate name)
  const lp = await db.collectionGroup('lessonProgress').where('lessonId', '==', 'coulombs-law-data-lab').limit(5).get().catch(()=>({size:0}));
  console.log('lessonProgress docs:', lp.size);

  process.exit(0);
})();
