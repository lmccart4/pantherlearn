const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC = '/tmp/task14-levels-v2';
const DEST = 'lesson-images/physics/electrostatics';
const FILES = [
  'task14-level1-setup.jpg',
  'task14-level2-setup.jpg',
  'task14-level3-setup.jpg',
  'task14-level4-setup.jpg',
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
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
})();
