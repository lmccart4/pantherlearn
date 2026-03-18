const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const doc = await db.collection('courses').doc('digital-literacy').collection('lessons').doc('ai-is-everywhere').get();
  const d = doc.data();
  const blocks = d.blocks || [];
  
  console.log('Lesson: ' + d.title);
  console.log('visible: ' + d.visible + ' order: ' + d.order + ' gradeCategory: ' + (d.gradeCategory || 'NOT SET'));
  console.log('Total blocks: ' + blocks.length);
  
  blocks.forEach((b, i) => {
    if (b.type === 'embed') {
      console.log('\nBlock ' + i + ': type=embed id=' + b.id + ' scored=' + (b.scored || false));
      console.log('  URL: ' + (b.url || 'NO URL').slice(0, 80));
    }
  });
  
  // Check if any students have progress for this lesson (by checking a few)
  const enrollSnap = await db.collection('enrollments').where('courseId', '==', 'digital-literacy').limit(5).get();
  let withProgress = 0;
  for (const enrollDoc of enrollSnap.docs) {
    const uid = enrollDoc.data().uid;
    if (!uid) continue;
    const progRef = db.collection('progress').doc(uid).collection('courses').doc('digital-literacy').collection('lessons').doc('ai-is-everywhere');
    const progSnap = await progRef.get();
    if (progSnap.exists) withProgress++;
  }
  console.log('\nStudents with progress (sample): ' + withProgress);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
