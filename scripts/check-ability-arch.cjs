const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('courses').doc('physics').collection('lessons')
    .where('visible', '==', true).get();
  
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.title.includes('Ability Architect')) continue;
    console.log('Lesson: ' + d.title + ' (id: ' + doc.id + ')');
    console.log('gradeCategory: ' + (d.gradeCategory || 'NOT SET'));
    console.log('dueDate: ' + (d.dueDate || 'none'));
    console.log('Blocks:');
    (d.blocks || []).forEach((b, i) => {
      console.log('  ' + i + '. type:' + b.type + ' id:' + (b.id || 'NO_ID') + (b.scored ? ' SCORED' : ''));
    });
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
