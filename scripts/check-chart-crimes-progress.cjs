const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const lessonId = 'data-literacy-5-chart-crimes';
  const courseId = 'digital-literacy';
  
  const enrollSnap = await db.collection('enrollments').where('courseId', '==', courseId).get();
  let studentsChecked = 0;
  let withProgress = 0;
  let completed = 0;
  
  for (const enrollDoc of enrollSnap.docs) {
    const uid = enrollDoc.data().uid;
    if (!uid) continue;
    studentsChecked++;
    
    const progRef = db.collection('progress').doc(uid).collection('courses').doc(courseId).collection('lessons').doc(lessonId);
    const progSnap = await progRef.get();
    if (progSnap.exists) {
      withProgress++;
      if (progSnap.data().completed) completed++;
    }
  }
  
  console.log('Students enrolled: ' + studentsChecked);
  console.log('Students with progress on chart-crimes: ' + withProgress);
  console.log('Students who completed: ' + completed);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
