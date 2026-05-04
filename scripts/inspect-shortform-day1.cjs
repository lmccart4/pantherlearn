const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc('short-form-video-day1-deconstruction').get();
  const blocks = d.data().blocks || [];
  blocks.forEach((b, i) => {
    const preview = JSON.stringify(b).slice(0, 200);
    if (preview.toLowerCase().includes('latin') || preview.toLowerCase().includes('teacher') || preview.toLowerCase().includes('placeholder') || preview.toLowerCase().includes('luke pick') || preview.toLowerCase().includes('abuela') || preview.toLowerCase().includes('barbershop')) {
      console.log(`\n[BLOCK ${i}] ${b.id} (${b.type})`);
      console.log(JSON.stringify(b, null, 2));
    }
  });
})();
