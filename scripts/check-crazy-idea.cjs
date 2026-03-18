const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('courses').doc('physics').collection('lessons')
    .where('visible', '==', true).get();
  
  for (const doc of snap.docs) {
    const d = doc.data();
    if (!d.title.includes('Disproving')) continue;
    console.log('Lesson: ' + d.title + ' (id: ' + doc.id + ')');
    console.log('gradeCategory: ' + (d.gradeCategory || 'NOT SET'));
    console.log('dueDate: ' + (d.dueDate || 'none'));
    console.log('order: ' + (d.order || 'NOT SET'));
    
    const blocks = d.blocks || [];
    const embedBlocks = blocks.filter(b => b.type === 'embed');
    const scoredEmbeds = blocks.filter(b => b.type === 'embed' && b.scored);
    console.log('Embed blocks: ' + embedBlocks.length + ' (scored: ' + scoredEmbeds.length + ')');
    scoredEmbeds.forEach(b => {
      console.log('  Scored embed id:' + b.id + ' url:' + (b.url || 'NO URL'));
    });
  }
  
  // Also check AI Literacy for similar order:999 lessons
  const aiSnap = await db.collection('courses').doc('Y9Gdhw5MTY8wMFt6Tlvj').collection('lessons')
    .where('visible', '==', true).get();
  
  for (const doc of aiSnap.docs) {
    const d = doc.data();
    if (d.order !== 999) continue;
    console.log('\nAI Lit order:999 - ' + d.title + ' (id: ' + doc.id + ')');
    console.log('gradeCategory: ' + (d.gradeCategory || 'NOT SET'));
    const blocks = d.blocks || [];
    const mc = blocks.filter(b => b.type === 'question' && b.questionType === 'multiple_choice');
    const sa = blocks.filter(b => b.type === 'question' && b.questionType === 'short_answer');
    console.log('MC:' + mc.length + ' SA:' + sa.length);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
