const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC = '/tmp/synthesis-lab-student';
const DEST = 'lesson-images/physics/electrostatics/synthesis-lab/student';
const FILES = [
  'station1-setup.jpg',
  'station2-setup.jpg',
  'station3-setup.jpg',
  'station4-setup.jpg',
  'station5-setup.jpg',
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
