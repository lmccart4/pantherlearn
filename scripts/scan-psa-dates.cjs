const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
const ids = ['psa-day1-topic-research','psa-day2-storyboard-design','psa-day3-production','psa-day4-polish-showcase'];
const patterns = /5\/2[2-9]|memorial\s*day|weekend\s*(homework|research)/i;
(async () => {
  for (const id of ids) {
    const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc(id).get();
    const blocks = d.data().blocks || [];
    let hits = 0;
    blocks.forEach((b, i) => {
      const blob = JSON.stringify(b);
      if (patterns.test(blob)) {
        hits++;
        const matches = blob.match(/5\/2[2-9]|[Mm]emorial\s*[Dd]ay|[Ww]eekend\s*(homework|research)/g);
        console.log(`  ${id} [${i}] ${b.id} (${b.type}): ${matches ? matches.join(', ') : ''}`);
      }
    });
    if (hits === 0) console.log(`  ${id}: clean`);
  }
})().catch(e=>{console.error(e);process.exit(1);});
