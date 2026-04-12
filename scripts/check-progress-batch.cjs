const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const courseId = 'Y9Gdhw5MTY8wMFt6Tlvj'; // P4
  const lessonIds = [
    'ai-and-your-career',
    'ai-policy-lab',
    'final-project-launch',
    'final-project-presentations',
    'cb1e0c38',
    'baa8f813',
    'ai-values-corporate-power',
  ];

  // Get all enrollments for this course
  const enrollSnap = await db.collection('enrollments').where('courseId', '==', courseId).get();
  console.log('P4 enrollments: ' + enrollSnap.size);

  for (const lessonId of lessonIds) {
    let hits = 0;
    let hitDetails = [];
    for (const doc of enrollSnap.docs) {
      const uid = doc.data().uid || doc.data().studentUid;
      if (!uid) continue;
      const progSnap = await db.collection('progress').doc(uid)
        .collection('courses').doc(courseId)
        .collection('lessons').doc(lessonId).get();
      if (progSnap.exists) {
        const d = progSnap.data();
        const hasData = d.completed || (d.answers && Object.keys(d.answers).length > 0) || (d.scores && Object.keys(d.scores).length > 0);
        if (hasData) {
          hits++;
          hitDetails.push({ uid, completed: !!d.completed, answers: d.answers ? Object.keys(d.answers).length : 0 });
        }
      }
    }
    console.log('\n' + lessonId + ': ' + hits + ' students with progress');
    if (hits > 0) hitDetails.forEach(h => console.log('  ', h));
  }

  // Also check migratedFrom lookups for parent course
  console.log('\n--- Also checking parent ai-literacy course ---');
  for (const lessonId of lessonIds) {
    let hits = 0;
    for (const doc of enrollSnap.docs) {
      const uid = doc.data().uid || doc.data().studentUid;
      if (!uid) continue;
      const progSnap = await db.collection('progress').doc(uid)
        .collection('courses').doc('ai-literacy')
        .collection('lessons').doc(lessonId).get();
      if (progSnap.exists) {
        const d = progSnap.data();
        if (d.completed || (d.answers && Object.keys(d.answers).length > 0)) hits++;
      }
    }
    console.log(lessonId + ' (parent): ' + hits);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
