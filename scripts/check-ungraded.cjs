const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSES = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI Literacy P4' },
  { id: 'DacjJ93vUDcwqc260OP3', label: 'AI Literacy P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'AI Literacy P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'AI Literacy P9' },
  { id: 'physics', label: 'Physics' },
  { id: 'digital-literacy', label: 'Digital Literacy' },
];

async function main() {
  for (const course of COURSES) {
    const snap = await db.collection('courses').doc(course.id).collection('lessons')
      .where('visible', '==', true).get();
    
    const lessons = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    lessons.sort((a, b) => (a.order || 999) - (b.order || 999));
    
    const noGradeBlocks = lessons.filter(l => {
      const blocks = l.blocks || [];
      const mc = blocks.filter(b => b.type === 'question' && b.questionType === 'multiple_choice');
      const sa = blocks.filter(b => b.type === 'question' && b.questionType === 'short_answer');
      const embeds = blocks.filter(b => b.type === 'embed' && b.scored);
      return mc.length === 0 && sa.length === 0 && embeds.length === 0;
    });
    
    if (noGradeBlocks.length > 0) {
      console.log('\n' + course.label + ' — lessons with NO grade-able blocks (visible):');
      noGradeBlocks.forEach(l => {
        const activityTypes = ['bias_detective','space_rescue','momentum_mystery_lab','embedding_explorer','prompt_duel','recipe_bot','ai_training_sim','data_labeling_lab','ai_ethics_courtroom','guess_who','chatbot_workshop'];
        const blocks = l.blocks || [];
        const hasActivity = blocks.some(b => activityTypes.includes(b.type));
        const blockTypes = [...new Set(blocks.map(b => b.type))];
        console.log('  [order:' + (l.order || '?') + '] ' + l.title + 
          ' | gradeCategory:' + (l.gradeCategory || 'none') +
          ' | ' + (hasActivity ? 'HAS_ACTIVITY_BLOCK' : 'no activities') +
          ' | blocks: ' + blockTypes.join(','));
      });
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
