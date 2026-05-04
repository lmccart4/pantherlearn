const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  for (const id of ['psa-day2-storyboard-design','psa-day3-production']) {
    const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc(id).get();
    const block = (d.data().blocks || []).find(b => b.id === 'callout-due');
    if (block) console.log(`\n${id}/callout-due:\n${block.content}\n`);
  }
})();
