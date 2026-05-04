const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  const ref = db.collection('courses').doc('digital-literacy').collection('mana').doc('pool');
  const before = (await ref.get()).data();
  console.log('Before:', { enabled: before.enabled, currentMP: before.currentMP });
  await ref.update({ enabled: false, lastUpdated: new Date() });
  const after = (await ref.get()).data();
  console.log('After:', { enabled: after.enabled, currentMP: after.currentMP });
  console.log('\n50 MP balance preserved (in case it was real earnings). Just toggled enabled flag.');
})();
