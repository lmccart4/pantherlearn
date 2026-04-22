const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const slugs = ['ai-in-healthcare','ai-in-law','ai-in-art','ai-in-climate','ai-in-hiring','ai-in-policing','ai-in-education','ai-real-world-synthesis'];
(async () => {
  for (const slug of slugs) {
    const doc = await db.doc(`courses/Y9Gdhw5MTY8wMFt6Tlvj/lessons/${slug}`).get();
    const blocks = doc.data().blocks || [];
    const imgs = blocks.filter(b => b.type==='image').map(b => (b.src||b.url||'NONE').split('/').slice(-2).join('/'));
    const activities = blocks.filter(b => ['sorting','chatbot','matching','drag_drop'].includes(b.type)).map(b => `${b.type}${b.scored?'(scored)':''}`);
    console.log(`${slug}: imgs=[${imgs.join(', ')}] activity=[${activities.join(',')||'none'}]`);
  }
  process.exit(0);
})();
