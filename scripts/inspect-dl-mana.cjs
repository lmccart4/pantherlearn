const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  // Check digital-literacy course doc for mana settings
  const cdoc = await db.collection('courses').doc('digital-literacy').get();
  console.log('=== courses/digital-literacy ===');
  console.log('All fields:', Object.keys(cdoc.data()).join(', '));
  for (const [k, v] of Object.entries(cdoc.data())) {
    if (/mana|pool|gamif/i.test(k)) console.log(`  ${k}:`, JSON.stringify(v).slice(0,300));
  }
  // Check settings subcollection
  console.log('\n=== courses/digital-literacy/settings ===');
  const settings = await db.collection('courses').doc('digital-literacy').collection('settings').get();
  for (const d of settings.docs) {
    console.log(`  ${d.id}:`, JSON.stringify(d.data()).slice(0,400));
  }
  // Compare with another course (physics) to see what the "off" state looks like
  console.log('\n=== compare: courses/physics ===');
  const psettings = await db.collection('courses').doc('physics').collection('settings').get();
  for (const d of psettings.docs) {
    console.log(`  ${d.id}:`, JSON.stringify(d.data()).slice(0,400));
  }
})();
