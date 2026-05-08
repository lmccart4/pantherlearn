const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC = '/tmp/circuit-symbol-imgs';
const DEST = 'lesson-images/physics/circuit-symbols';
const FILES = [
  'bulb.png',
  'diode.png',
  'battery.png',
  'resistor.png',
  'voltmeter.png',
  'ammeter.png',
  'rect-v.png',
  'zigzag-v.png',
];

(async () => {
  for (const f of FILES) {
    const src = path.join(SRC, f);
    const dest = `${DEST}/${f}`;
    process.stdout.write(`  ${f} ... `);
    try {
      await bucket.upload(src, {
        destination: dest,
        metadata: { contentType: 'image/png', cacheControl: 'public, max-age=31536000' },
        public: true,
      });
      console.log('OK');
      console.log(`     https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/${dest}`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
})();
