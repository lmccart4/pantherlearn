const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const doc = await db.collection('courses').doc('physics').collection('lessons').doc('w20-download-prep').get();
  const d = doc.data();
  const blocks = d.blocks || [];
  
  console.log('Lesson: ' + d.title);
  console.log('Total blocks: ' + blocks.length);
  console.log('');
  
  const scoredBlocks = blocks.filter(b => b.scored || (b.type === 'question'));
  console.log('Scored/question blocks:');
  scoredBlocks.forEach(b => {
    console.log('  type:' + b.type + ' id:' + b.id + ' questionType:' + (b.questionType || 'n/a') + (b.scored ? ' SCORED' : ''));
  });
  
  // Check for the duplicate IDs
  const ids = blocks.map(b => b.id);
  const seen = {};
  ids.forEach((id, i) => {
    if (seen[id] !== undefined) {
      console.log('\nDUPLICATE: block ' + seen[id] + ' and block ' + i + ' share id:' + id);
      console.log('  Block ' + seen[id] + ': type=' + blocks[seen[id]].type);
      console.log('  Block ' + i + ': type=' + blocks[i].type);
    } else {
      seen[id] = i;
    }
  });
  
  // Check if students have answers to any blocks in this lesson
  const enrollSnap = await db.collection('enrollments').where('courseId', '==', 'physics').limit(5).get();
  let studentsWithProgress = 0;
  let studentsWithAnswers = 0;
  for (const enrollDoc of enrollSnap.docs) {
    const uid = enrollDoc.data().uid;
    if (!uid) continue;
    const progRef = db.collection('progress').doc(uid).collection('courses').doc('physics').collection('lessons').doc('w20-download-prep');
    const progSnap = await progRef.get();
    if (progSnap.exists) {
      studentsWithProgress++;
      const answers = progSnap.data().answers || {};
      if (Object.keys(answers).length > 0) studentsWithAnswers++;
    }
  }
  console.log('\nStudents with progress (sample 5): ' + studentsWithProgress);
  console.log('Students with answers: ' + studentsWithAnswers);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
