/**
 * Batch seed lab extension lessons that failed due to ESM/require issues.
 * These are new lessons — no student data, safe to use .set() directly.
 * Extracts lesson data by reading the JS files and evaluating them safely.
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

// Manual extraction approach: read each file, find the lesson const, eval it
const DRAFTS = path.join(process.env.HOME, 'Lachlan/drafts/seed-scripts');

async function seedFromFile(filename, lessonId, courseId = 'physics') {
  const filePath = path.join(DRAFTS, filename);
  let content = fs.readFileSync(filePath, 'utf8');

  // Remove import statements
  content = content.replace(/^import .*$/gm, '');
  // Remove initializeApp
  content = content.replace(/initializeApp\(.*\);?/g, '');
  // Remove getFirestore
  content = content.replace(/const db = .*$/gm, '');
  // Remove createRequire
  content = content.replace(/.*createRequire.*$/gm, '');
  content = content.replace(/.*require\(.*$/gm, '');
  // Remove async function seed and everything after
  content = content.replace(/async function seed[\s\S]*$/, '');

  // Eval the lesson variable
  try {
    const fn = new Function(`
      ${content}
      return lesson;
    `);
    const lesson = fn();

    if (!lesson || !lesson.title) {
      console.error(`❌ ${filename}: Could not extract lesson data`);
      return;
    }

    // Ensure visible: false
    lesson.visible = false;
    lesson.createdAt = admin.firestore.FieldValue.serverTimestamp();

    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
    const snap = await ref.get();
    if (snap.exists) {
      console.log(`SKIP ${lessonId} — already exists`);
      return;
    }

    await ref.set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${courseId}/${lessonId} (${lesson.blocks.length} blocks)`);
  } catch (e) {
    console.error(`❌ ${filename}: ${e.message}`);
  }
}

async function main() {
  await seedFromFile('seed-energy-lab-extension.js', 'energy-lab-extension');
  await seedFromFile('seed-momentum-lab-extension.js', 'momentum-lab-extension');
  await seedFromFile('seed-magnetism-lab-extension.js', 'magnetism-lab-extension');
  await seedFromFile('seed-sci-process-lab-extension.js', 'sci-process-lab-extension');
  await seedFromFile('seed-circuits-lab-extension.js', 'circuits-lab-extension');

  console.log('\nDone. All lab extension lessons seeded.');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
