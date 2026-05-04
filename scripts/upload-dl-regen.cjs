const admin = require('firebase-admin');
const fs = require('fs');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(key),
  storageBucket: 'pantherlearn-d6f7c.firebasestorage.app'
});
const bucket = admin.storage().bucket();
const SRC = '/tmp/dl-may2026-images-regen';
const DEST = 'lesson-images/digital-literacy/';
(async () => {
  const files = fs.readdirSync(SRC).filter(f => f.endsWith('.jpg'));
  for (const f of files) {
    await bucket.upload(`${SRC}/${f}`, {
      destination: DEST + f,
      public: true,
      metadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=86400' }
    });
    console.log('✓ overwrote', f);
  }
  process.exit(0);
})();
