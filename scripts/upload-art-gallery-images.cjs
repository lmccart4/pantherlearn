// Upload AI Literacy Unit 5 Art Gallery images to Firebase Storage
// Target: gs://pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/unit5-art-gallery/

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const bucket = admin.storage().bucket('pantherlearn-d6f7c.firebasestorage.app');

const SRC_DIR = path.join(__dirname, '../dist/lesson-images/ai-literacy/unit5-art-gallery');
const DEST_PREFIX = 'lesson-images/ai-literacy/unit5-art-gallery';

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
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  console.log('\nDone. URLs follow this pattern:');
  console.log(`https://firebasestorage.googleapis.com/v0/b/pantherlearn-d6f7c.firebasestorage.app/o/lesson-images%2Fai-literacy%2Funit5-art-gallery%2F<filename>?alt=media`);
}

upload().catch(console.error);
