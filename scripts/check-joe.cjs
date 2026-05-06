const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')), projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
(async () => {
  // Find Joe Student's uid
  const users = await db.collection('users').where('displayName', '>=', 'Joe').where('displayName', '<=', 'Joe~').limit(5).get();
  console.log('Joe matches:');
  users.forEach(d => console.log(' ', d.id, '|', d.data().email, '|', d.data().displayName));

  // Try to find any progress doc with bulb checkpoint
  for (const u of users.docs) {
    const p = await db.doc(`progress/${u.id}/courses/physics/lessons/circuit-discovery`).get();
    if (p.exists) {
      console.log('\nProgress for', u.data().displayName, ':');
      const ans = p.data().answers || {};
      console.log('  answer keys:', Object.keys(ans));
      if (ans['checkpoint-bulb']) console.log('  checkpoint-bulb:', JSON.stringify(ans['checkpoint-bulb'], null, 2));
    }
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
