const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  // Sample existing lesson with dueDate set
  const sample = await db.collection('courses').doc('digital-literacy').collection('lessons')
    .where('dueDate', '!=', null).limit(3).get();
  for (const d of sample.docs) {
    const data = d.data();
    console.log(`${d.id}: dueDate=${JSON.stringify(data.dueDate)} (type: ${typeof data.dueDate})`);
  }
})();
