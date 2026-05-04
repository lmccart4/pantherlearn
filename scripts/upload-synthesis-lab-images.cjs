const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC = '/tmp/synthesis-lab-images';
const DEST = 'lesson-images/physics/electrostatics/synthesis-lab';
const FILES = [
  'station1-mystery-sphere.jpg',
  'station2-tape-pair.jpg',
  'station3-bending-water.jpg',
  'station4-aluminum-can.jpg',
  'station5-two-step-chain.jpg',
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
