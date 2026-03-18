const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('courses').doc('physics').collection('lessons')
    .where('visible', '==', true).get();
  
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.title.includes('Change a System')) continue;
    const blocks = d.blocks || [];
    console.log('Lesson: ' + d.title + ' (id: ' + doc.id + ')');
    console.log('Total blocks: ' + blocks.length);
    const mc = blocks.filter(b => b.type === 'question' && b.questionType === 'multiple_choice');
    const sa = blocks.filter(b => b.type === 'question' && b.questionType === 'short_answer');
    console.log('MC questions: ' + mc.length);
    console.log('SA questions: ' + sa.length);
    console.log('gradeCategory: ' + (d.gradeCategory || 'NOT SET'));
    
    // Check if IDs are unique
    const ids = blocks.map(b => b.id).filter(Boolean);
    const unique = new Set(ids);
    console.log('Total block IDs: ' + ids.length + ', Unique: ' + unique.size);
    if (ids.length !== unique.size) {
      console.log('DUPLICATE IDs PRESENT');
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
