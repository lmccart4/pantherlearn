// upload-phys-u1-images.cjs — upload Unit 1 lesson images to Firebase Storage (public).
// Uses the admin cert (reliable here; the shared Pixel uploader relies on ADC).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/upload-phys-u1-images.cjs /tmp/phys-u1-images
const admin = require('firebase-admin');
const { readFileSync, readdirSync, existsSync, writeFileSync } = require('fs');
const { join, extname } = require('path');

admin.initializeApp({
  credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')),
  storageBucket: 'pantherlearn-d6f7c.firebasestorage.app',
});
const bucket = admin.storage().bucket();
const BUCKET = 'pantherlearn-d6f7c.firebasestorage.app';

(async () => {
  const dir = process.argv[2] || '/tmp/phys-u1-images';
  if (!existsSync(dir)) { console.error('No dir:', dir); process.exit(1); }
  const files = readdirSync(dir).filter(f => ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase()));
  const results = [];
  for (const file of files) {
    const storagePath = `lesson-images/physics/${file}`;
    const ct = /\.png$/i.test(file) ? 'image/png' : 'image/jpeg';
    const ref = bucket.file(storagePath);
    await ref.save(readFileSync(join(dir, file)), { metadata: { contentType: ct, metadata: { generatedBy: 'lachlan', unit: 'phys-u1' } } });
    await ref.makePublic();
    const url = `https://storage.googleapis.com/${BUCKET}/${storagePath}`;
    results.push({ file, url });
    console.log(`${file}  →  ${url}`);
  }
  writeFileSync('/tmp/phys-u1-image-urls.json', JSON.stringify(results, null, 2));
  console.log(`\nUploaded ${results.length} images. URLs → /tmp/phys-u1-image-urls.json`);
  process.exit(0);
})().catch(e => { console.error('UPLOAD FAILED:', e.message); process.exit(1); });
