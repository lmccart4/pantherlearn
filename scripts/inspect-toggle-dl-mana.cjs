const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  // List all mana docs under digital-literacy
  const manaCol = db.collection('courses').doc('digital-literacy').collection('mana');
  const docs = await manaCol.get();
  console.log(`Found ${docs.size} mana doc(s):\n`);
  for (const d of docs.docs) {
    const data = d.data();
    console.log(`  ${d.id}: enabled=${data.enabled}  currentMP=${data.currentMP || 0}  poolName=${data.poolName||'(unnamed)'}`);
  }

  // Check teacher pool / per-section mana
  console.log('\nFor compare — physics:');
  const phy = await db.collection('courses').doc('physics').collection('mana').get();
  for (const d of phy.docs) {
    console.log(`  ${d.id}: enabled=${d.data().enabled}`);
  }
})();
