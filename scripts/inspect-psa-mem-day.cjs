const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  for (const id of ['psa-day1-topic-research','psa-day4-polish-showcase']) {
    const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc(id).get();
    const blocks = d.data().blocks || [];
    console.log(`\n========== ${id} ==========`);
    blocks.forEach((b, i) => {
      const blob = JSON.stringify(b);
      if (blob.toLowerCase().includes('memorial') || blob.toLowerCase().includes('weekend') || blob.toLowerCase().includes('5/2') || blob.toLowerCase().includes('homework') || blob.toLowerCase().includes('due')) {
        console.log(`\n[${i}] ${b.id} (${b.type}${b.style?', '+b.style:''})`);
        console.log(JSON.stringify(b, null, 2).slice(0, 800));
      }
    });
  }
})().catch(e => { console.error(e); process.exit(1); });
