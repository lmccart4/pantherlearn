const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
(async () => {
  const p = (await db.doc('progress/IERHiKJqyabsjsZkCW4cMA7bXIE3/courses/DacjJ93vUDcwqc260OP3/lessons/ai-real-world-synthesis').get()).data();
  const chatAns = p.answers['b-igvmmvob-oe83'];
  console.log('Chatbot answer keys:', Object.keys(chatAns));
  console.log('Chatbot answer:', JSON.stringify(chatAns, null, 2).slice(0, 2000));
  console.log('\nTop-level progress keys:', Object.keys(p));
})();
