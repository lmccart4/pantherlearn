const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function checkCourse(courseId, label) {
  const snap = await db.collection('courses').doc(courseId).collection('lessons').where('visible', '==', true).get();
  console.log('\n' + label + ' (' + courseId + '): ' + snap.size + ' visible lessons');
  const lessons = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  lessons.sort((a, b) => (a.order || 999) - (b.order || 999));
  lessons.forEach(l => {
    const blocks = l.blocks || [];
    const mcBlocks = blocks.filter(b => b.type === 'question' && b.questionType === 'multiple_choice');
    const saBlocks = blocks.filter(b => b.type === 'question' && b.questionType === 'short_answer');
    const embedBlocks = blocks.filter(b => b.type === 'embed');
    const scoredEmbeds = embedBlocks.filter(b => b.scored);
    const activityTypes = ['bias_detective','space_rescue','momentum_mystery_lab','embedding_explorer','prompt_duel','recipe_bot','ai_training_sim','data_labeling_lab','ai_ethics_courtroom'];
    const hasActivity = blocks.some(b => activityTypes.includes(b.type));
    const blocksWithoutId = blocks.filter(b => !b.id);
    
    console.log('  ' + (l.order || '?') + '. ' + (l.title || '(no title)') + 
      ' [MC:' + mcBlocks.length + ' SA:' + saBlocks.length + ' Embed:' + embedBlocks.length + '(scored:' + scoredEmbeds.length + ')' +
      (hasActivity ? ' ACT' : '') +
      (blocksWithoutId.length > 0 ? ' MISSING_IDS:' + blocksWithoutId.length : '') +
      ']');
  });
  return lessons;
}

async function main() {
  const allLessons = {};
  allLessons['ai-p4'] = await checkCourse('Y9Gdhw5MTY8wMFt6Tlvj', 'AI Literacy P4');
  allLessons['ai-p5'] = await checkCourse('DacjJ93vUDcwqc260OP3', 'AI Literacy P5');
  allLessons['ai-p7'] = await checkCourse('M2MVSXrKuVCD9JQfZZyp', 'AI Literacy P7');
  allLessons['ai-p9'] = await checkCourse('fUw67wFhAtobWFhjwvZ5', 'AI Literacy P9');
  allLessons['physics'] = await checkCourse('physics', 'Physics');
  allLessons['digital-literacy'] = await checkCourse('digital-literacy', 'Digital Literacy');
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
