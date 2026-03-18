const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function main() {
  // Check a lesson with a known embed
  const snap = await db.collection('courses').doc('Y9Gdhw5MTY8wMFt6Tlvj').collection('lessons').doc('attention-visualizer').get();
  const data = snap.data();
  console.log('Attention Visualizer blocks:');
  (data.blocks || []).forEach((b, i) => {
    if (b.type === 'embed') console.log(i, JSON.stringify(b, null, 2));
  });
  
  const snap2 = await db.collection('courses').doc('Y9Gdhw5MTY8wMFt6Tlvj').collection('lessons').doc('36da9be4').get();
  const data2 = snap2.data();
  console.log('\nIs It Biased? all blocks:');
  (data2.blocks || []).forEach((b, i) => console.log(i, b.type, b.id || '', (b.content || b.url || b.label || '').substring(0, 80)));
  
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
