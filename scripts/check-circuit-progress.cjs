const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')), projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
(async () => {
  const lesson = await db.doc('courses/physics/lessons/circuit-discovery').get();
  console.log('Lesson exists:', lesson.exists, '| visible:', lesson.data()?.visible, '| blocks:', lesson.data()?.blocks?.length);
  const prog = await db.collectionGroup('lessons').where('lessonId', '==', 'circuit-discovery').limit(5).get();
  console.log('Progress docs (collectionGroup lessonId match):', prog.size);
  const sub = await db.collectionGroup('submissions').where('lessonId', '==', 'circuit-discovery').limit(5).get();
  console.log('Submission docs:', sub.size);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
