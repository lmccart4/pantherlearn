const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const courses = [
    { id: 'DacjJ93vUDcwqc260OP3', label: 'P5' },
    { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'P7' },
    { id: 'fUw67wFhAtobWFhjwvZ5', label: 'P9' },
  ];

  // Match: the same 20 Unit 5-7 lessons we enhanced in P4
  const lessonIds = [
    'ai-in-healthcare','ai-in-law','ai-in-art','ai-in-climate','ai-in-hiring','ai-in-policing','ai-in-education','ai-real-world-synthesis',
    'prompt-engineering-deep-dive','ai-as-research-partner','ai-writing-line','building-with-ai','ai-tool-ethics','personal-ai-workflow',
    'careers-in-ai','human-ai-collaboration','jobs-ai-will-wont-replace','ai-policy-regulation','ai-futures-choice-project','course-reflection-synthesis',
  ];
  const deleteIds = [
    'ai-and-your-career','ai-policy-lab','final-project-launch','final-project-presentations','cb1e0c38','baa8f813','ai-values-corporate-power'
  ];
  const april8Ids = ['ai-everywhere-edtech','ai-agents-from-chatbots','ai-when-should-ai-think','ai-dead-classroom'];

  for (const course of courses) {
    console.log('\n=================== ' + course.label + ' (' + course.id + ') ===================');

    console.log('\n-- Enhancement targets (20 lessons) --');
    for (const id of lessonIds) {
      const doc = await db.doc('courses/' + course.id + '/lessons/' + id).get();
      if (!doc.exists) { console.log('  MISSING: ' + id); continue; }
      const d = doc.data();
      const blocks = d.blocks || [];
      const emptyHeaders = blocks.filter(b => b.type === 'section_header' && (!b.title || String(b.title).trim() === '')).length;
      console.log('  ' + id + ': ' + blocks.length + ' blocks, ' + emptyHeaders + ' empty headers, unit=' + (d.unit || 'none') + ', visible=' + (d.visible !== false));
    }

    console.log('\n-- Deletion targets (7 lessons) --');
    for (const id of deleteIds) {
      const doc = await db.doc('courses/' + course.id + '/lessons/' + id).get();
      if (!doc.exists) { console.log('  MISSING: ' + id); continue; }
      const d = doc.data();
      console.log('  ' + id + ': ' + (d.blocks || []).length + ' blocks, visible=' + (d.visible !== false));
    }

    console.log('\n-- April 8 lessons (4 lessons) --');
    for (const id of april8Ids) {
      const doc = await db.doc('courses/' + course.id + '/lessons/' + id).get();
      if (!doc.exists) { console.log('  MISSING: ' + id); continue; }
      const d = doc.data();
      console.log('  ' + id + ': ' + (d.blocks || []).length + ' blocks, unit=' + (d.unit || 'none'));
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
