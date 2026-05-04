const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC = '/tmp/task14-images';
const DEST = 'lesson-images/physics/electrostatics';
const FILES = [
  'electroscope-labeled.jpg',
  'grounding-vdg-floor-vs-crate.jpg',
  'final-level-setup.jpg',
];

(async () => {
  for (const f of FILES) {
    const src = path.join(SRC, f);
    const dest = `${DEST}/${f}`;
    process.stdout.write(`  ${f} ... `);
    try {
      await bucket.upload(src, {
        destination: dest,
        metadata: { contentType: 'image/jpeg', cacheControl: 'public, max-age=31536000' },
        public: true,
      });
      console.log('OK');
      console.log(`     https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/${dest}`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
})();
