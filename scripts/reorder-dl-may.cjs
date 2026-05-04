const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const newOrders = {
  'infographic-day1-topic-data': 60.5,
  'infographic-day2-design': 60.6,
  'infographic-day3-polish-showcase': 60.7,
};

(async () => {
  for (const [id, order] of Object.entries(newOrders)) {
    await db.collection('courses').doc('digital-literacy').collection('lessons').doc(id).update({ order });
    console.log(`✓ ${id} order=${order}`);
  }
  process.exit(0);
})();
