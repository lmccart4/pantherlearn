const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const lessonsToCheck = [
    { courseId: 'physics', lessonId: 'w20-download-prep', embedIds: ['b6ff6e1d', 'f4ea3432'], title: 'Momentum Conservation' },
    { courseId: 'physics', lessonId: 'w22-disproving-crazy-idea', embedIds: ['cgjefed'], title: 'Disproving a Crazy Idea' },
    { courseId: 'digital-literacy', lessonId: 'ai-is-everywhere', embedIds: ['vb3gp4e'], title: 'AI Is Everywhere' },
  ];
  
  for (const lesson of lessonsToCheck) {
    console.log('\n--- ' + lesson.title + ' (' + lesson.courseId + ') ---');
    
    const enrollSnap = await db.collection('enrollments').where('courseId', '==', lesson.courseId).get();
    let studentsChecked = 0;
    let studentsWithAnyAnswer = 0;
    let studentsWithEmbedScore = 0;
    
    for (const enrollDoc of enrollSnap.docs) {
      const uid = enrollDoc.data().uid;
      if (!uid) continue;
      studentsChecked++;
      
      const progRef = db.collection('progress').doc(uid).collection('courses').doc(lesson.courseId).collection('lessons').doc(lesson.lessonId);
      const progSnap = await progRef.get();
      if (!progSnap.exists) continue;
      
      const answers = progSnap.data().answers || {};
      if (Object.keys(answers).filter(k => k !== '_completed').length > 0) studentsWithAnyAnswer++;
      
      for (const embedId of lesson.embedIds) {
        const embedAnswer = answers[embedId];
        if (embedAnswer) {
          studentsWithEmbedScore++;
          console.log('  Student has embed answer for ' + embedId + ':');
          console.log('    submitted:' + embedAnswer.submitted + ' writtenScore:' + embedAnswer.writtenScore + ' score:' + embedAnswer.score);
          break;
        }
      }
    }
    
    console.log('Students enrolled: ' + studentsChecked);
    console.log('Students with any answers: ' + studentsWithAnyAnswer);
    console.log('Students with embed score: ' + studentsWithEmbedScore);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
