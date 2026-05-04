const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(key),
  storageBucket: 'pantherlearn-d6f7c.firebasestorage.app'
});

const bucket = admin.storage().bucket();
const SRC_DIR = '/tmp/dl-may2026-images';
const DEST_PREFIX = 'lesson-images/digital-literacy/';

(async () => {
  const files = fs.readdirSync(SRC_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  console.log(`Uploading ${files.length} images to gs://${bucket.name}/${DEST_PREFIX}\n`);
  let ok = 0, fail = 0;
  for (const f of files) {
    const localPath = path.join(SRC_DIR, f);
    const destPath = DEST_PREFIX + f;
    try {
      await bucket.upload(localPath, {
        destination: destPath,
        public: true,
        metadata: {
          contentType: f.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg',
          cacheControl: 'public, max-age=86400'
        }
      });
      console.log(`✓ ${f} → ${destPath}`);
      ok++;
    } catch (e) {
      console.error(`✗ ${f}: ${e.message}`);
      fail++;
    }
  }
  console.log(`\nDone: ${ok} uploaded, ${fail} failed`);
  process.exit(fail > 0 ? 1 : 0);
})();
