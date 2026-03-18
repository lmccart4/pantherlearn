const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('courses').doc('digital-literacy').collection('lessons')
    .where('visible', '==', true).get();
  
  for (const doc of snap.docs) {
    const d = doc.data();
    const blocks = d.blocks || [];
    const scoredEmbeds = blocks.filter(b => b.type === 'embed' && b.scored);
    if (scoredEmbeds.length === 0) continue;
    console.log('Lesson: ' + d.title + ' (id: ' + doc.id + ')');
    console.log('order: ' + d.order + ' gradeCategory: ' + (d.gradeCategory || 'NOT SET'));
    scoredEmbeds.forEach(b => {
      console.log('  Scored embed: id=' + b.id + ' url=' + (b.url || 'NO URL') + ' height=' + b.height);
    });
    
    // Check if there are students with answers for this embed
    const enrollSnap = await db.collection('enrollments').where('courseId', '==', 'digital-literacy').limit(5).get();
    let answersFound = 0;
    for (const enrollDoc of enrollSnap.docs) {
      const uid = enrollDoc.data().uid;
      if (!uid) continue;
      const progDoc = await db.collection('progress').doc(uid).collection('courses').doc('digital-literacy').collection('lessons').doc(doc.id).get();
      if (progDoc.exists()) {
        const answers = progDoc.data().answers || {};
        scoredEmbeds.forEach(eb => {
          if (answers[eb.id]) answersFound++;
        });
      }
    }
    console.log('  Student answers found for embed IDs (sample): ' + answersFound);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
