const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function peek(lessonId, courseId = 'Y9Gdhw5MTY8wMFt6Tlvj') {
  const doc = await db.doc('courses/' + courseId + '/lessons/' + lessonId).get();
  if (!doc.exists) { console.log('NOT FOUND: ' + lessonId); return; }
  const d = doc.data();
  console.log('\n════════════════════════════════════════════');
  console.log('LESSON: ' + (d.title || '(no title)'));
  console.log('id: ' + lessonId + ' | order: ' + d.order + ' | unit: ' + (d.unit || '(none)'));
  console.log('visible: ' + (d.visible !== false) + ' | scored: ' + d.scored);
  console.log('════════════════════════════════════════════');
  const blocks = Array.isArray(d.blocks) ? d.blocks : [];
  blocks.forEach((b, i) => {
    let preview = '';
    if (b.type === 'section_header') preview = b.title || b.text || '';
    else if (b.type === 'text' || b.type === 'callout') preview = (b.content || b.text || '').slice(0, 120).replace(/\n/g, ' ');
    else if (b.type === 'question') preview = (b.prompt || b.question || '').slice(0, 100).replace(/\n/g, ' ') + ' [' + (b.questionType || '?') + ']';
    else if (b.type === 'image') preview = (b.src || b.url || '').slice(0, 80);
    else if (b.type === 'objectives') preview = (Array.isArray(b.items) ? b.items.length : (Array.isArray(b.objectives) ? b.objectives.length : '?')) + ' objectives';
    else if (b.type === 'activity') preview = (b.title || b.description || '').slice(0, 100);
    else if (b.type === 'vocab_list') preview = (Array.isArray(b.terms) ? b.terms.length : '?') + ' terms';
    else preview = Object.keys(b).filter(k => k !== 'type' && k !== 'id').join(',');
    console.log('  ' + i + '. [' + b.type + '] ' + preview);
  });
}

async function main() {
  const targets = process.argv.slice(2);
  for (const t of targets) await peek(t);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
