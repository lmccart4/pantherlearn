// Upload Year-End Project hero images to Firebase Storage
// Source: /tmp/year-end-projects/*.jpg
// Target: gs://pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/
// URL format: https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/<file>

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC_DIR = '/tmp/year-end-projects';
const DEST_PREFIX = 'lesson-images/ai-literacy/year-end-projects';

async function upload() {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.jpg'));
  console.log(`Uploading ${files.length} images...`);
  const urls = {};

  for (const filename of files) {
    const localPath = path.join(SRC_DIR, filename);
    const destPath = `${DEST_PREFIX}/${filename}`;
    process.stdout.write(`  ${filename} ... `);
    try {
      await bucket.upload(localPath, {
        destination: destPath,
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000',
        },
        public: true,
      });
      const url = `https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/${destPath}`;
      urls[filename.replace('.jpg', '')] = url;
      console.log('OK');
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  fs.writeFileSync('/tmp/year-end-projects/urls.json', JSON.stringify(urls, null, 2));
  console.log('\nURLs written to /tmp/year-end-projects/urls.json');
  console.log(JSON.stringify(urls, null, 2));
}

upload().catch(e => { console.error(e); process.exit(1); });
