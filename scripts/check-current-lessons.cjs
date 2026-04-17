const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
(async () => {
  const all = await db.collection('courses').get();
  for (const c of all.docs) {
    const lessons = await db.collection('courses').doc(c.id).collection('lessons').get();
    lessons.forEach(d => {
      const x = d.data();
      if ((x.title || '').toLowerCase().includes('feed architect')) {
        console.log(`${c.data().title || c.id} | U:${x.unit || '?'} | due:${x.dueDate || '-'} | ${x.title}`);
      }
    });
  }
  process.exit(0);
})();
