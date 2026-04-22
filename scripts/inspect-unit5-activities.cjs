const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const slugs = ['ai-in-healthcare','ai-in-law','ai-in-art','ai-in-climate','ai-in-hiring','ai-in-policing','ai-in-education','ai-real-world-synthesis'];
(async () => {
  for (const slug of slugs) {
    const doc = await db.doc(`courses/Y9Gdhw5MTY8wMFt6Tlvj/lessons/${slug}`).get();
    const blocks = doc.data().blocks || [];
    console.log(`\n━━━ ${slug}`);
    blocks.forEach((b,i)=>{
      if (['sorting','chatbot','section_header'].includes(b.type)) {
        console.log(`  [${i}] ${b.type}: ${JSON.stringify(b).slice(0,400)}`);
      } else if (b.type==='question') {
        const p = (b.prompt||b.question||'').slice(0,140).replace(/\n/g,' ');
        console.log(`  [${i}] Q(${b.questionType}): ${p}`);
      }
    });
  }
  process.exit(0);
})();
