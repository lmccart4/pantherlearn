const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  const lessons = (await db.collection('courses').doc('digital-literacy').collection('lessons').limit(20).get()).docs;
  const urls = [];
  for (const d of lessons) {
    for (const b of d.data().blocks||[]) {
      if (b.type==='image' && b.url) urls.push(b.url);
      if (b.imageUrl) urls.push(b.imageUrl);
    }
  }
  const unique = [...new Set(urls)].slice(0,8);
  unique.forEach(u => console.log(u));
})();
