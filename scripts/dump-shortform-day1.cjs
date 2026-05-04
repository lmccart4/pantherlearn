const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc('short-form-video-day1-deconstruction').get();
  const blocks = d.data().blocks || [];
  console.log(`Total: ${blocks.length} blocks  visible=${d.data().visible}`);
  blocks.forEach((b, i) => {
    if (['video','image','external_link'].includes(b.type)) {
      console.log(`  [${String(i).padStart(2)}] ${(b.type||'').padEnd(15)} id=${(b.id||'').padEnd(28)} ${b.url||''}`);
    }
  });
})();
