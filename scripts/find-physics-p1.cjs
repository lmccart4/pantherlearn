const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

(async () => {
  // Get Luke's UID by email
  const luke = await admin.auth().getUserByEmail('lucamccarthy@paps.net').catch(() => null);
  if (luke) console.log('Luke uid:', luke.uid);

  // Find physics courses owned by Luke
  const snap = await db.collection('courses').where('ownerUid', '==', luke?.uid || '').get();
  snap.forEach(d => {
    const c = d.data();
    if ((c.title || '').toLowerCase().includes('phys') || (c.subject || '').toLowerCase().includes('phys')) {
      console.log(`\n${d.id}`);
      console.log('  title:', c.title);
      console.log('  period:', c.period);
      console.log('  enrollCode:', c.enrollCode);
      console.log('  coTeachers:', c.coTeachers || []);
      console.log('  ownerUid:', c.ownerUid);
    }
  });
  process.exit(0);
})();
