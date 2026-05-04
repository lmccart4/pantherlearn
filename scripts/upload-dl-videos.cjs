const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({
  credential: admin.credential.cert(key),
  storageBucket: 'pantherlearn-d6f7c.firebasestorage.app'
});
const bucket = admin.storage().bucket();
const SRC = '/Users/lukemccarthy/Lachlan/projects/dl-may2026/short-form-video-clips';
const DEST = 'lesson-videos/digital-literacy/';
(async () => {
  const files = fs.readdirSync(SRC).filter(f => f.endsWith('.mp4'));
  for (const f of files) {
    await bucket.upload(`${SRC}/${f}`, {
      destination: DEST + f,
      public: true,
      metadata: { contentType: 'video/mp4', cacheControl: 'public, max-age=86400' }
    });
    const url = `https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/${DEST}${f}`;
    console.log(`✓ ${f} → ${url}`);
  }
  process.exit(0);
})();
