// Upload Prompt Battle target images to Firebase Storage
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC_DIR = '/tmp/prompt-battle-targets';
const DEST_PREFIX = 'lesson-images/ai-literacy/prompt-battle';

async function upload() {
  const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.jpg'));
  console.log(`Uploading ${files.length} images...`);

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
      console.log('OK');
      console.log(`    https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/${destPath}`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
}

upload().catch(console.error);
