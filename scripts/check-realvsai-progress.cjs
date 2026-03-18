const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const courseIds = ['Y9Gdhw5MTY8wMFt6Tlvj', 'DacjJ93vUDcwqc260OP3', 'M2MVSXrKuVCD9JQfZZyp', 'fUw67wFhAtobWFhjwvZ5'];
const lessonId = 'real-vs-ai-quiz';

async function main() {
  for (const courseId of courseIds) {
    const enrollSnap = await db.collection('enrollments').where('courseId', '==', courseId).get();
    let withScore = 0;
    let withCompletion = 0;
    
    for (const enrollDoc of enrollSnap.docs) {
      const uid = enrollDoc.data().uid;
      if (!uid) continue;
      const progRef = db.collection('progress').doc(uid).collection('courses').doc(courseId).collection('lessons').doc(lessonId);
      const progSnap = await progRef.get();
      if (!progSnap.exists) continue;
      const answers = progSnap.data().answers || {};
      if (progSnap.data().completed) withCompletion++;
      
      // Check all embed answer keys
      for (const [key, val] of Object.entries(answers)) {
        if (val.writtenScore != null || val.score != null) {
          withScore++;
          break;
        }
      }
    }
    
    console.log(courseId + ': ' + withCompletion + ' completed, ' + withScore + ' with embed score');
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
