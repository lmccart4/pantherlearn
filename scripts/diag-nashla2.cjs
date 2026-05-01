const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

(async () => {
  const courseId = 'DacjJ93vUDcwqc260OP3';
  const lessonId = 'ai-real-world-synthesis';
  const uid = 'IERHiKJqyabsjsZkCW4cMA7bXIE3';

  const lessonSnap = await db.doc(`courses/${courseId}/lessons/${lessonId}`).get();
  const lesson = lessonSnap.data();
  console.log('Lesson:', lesson.title, '— gradesReleased:', lesson.gradesReleased);
  console.log('\nBlocks (gating-relevant):');
  for (const b of (lesson.blocks || [])) {
    if (['question','chatbot','checklist','embed','connect_four','slide_submit','chatbot_workshop'].includes(b.type)) {
      console.log(`  [${b.type}${b.scored ? ' SCORED' : ''}] id=${b.id} title=${(b.title||b.prompt||b.label||'').slice(0,60)}`);
    }
  }

  console.log('\nNashla progress:');
  const progSnap = await db.doc(`progress/${uid}/courses/${courseId}/lessons/${lessonId}`).get();
  if (!progSnap.exists) { console.log('  (no progress doc)'); return; }
  const p = progSnap.data();
  console.log('  completed:', p.completed, 'completedAt:', p.completedAt);
  console.log('  answers keys:', Object.keys(p.answers || {}));
  for (const [k,v] of Object.entries(p.answers || {})) {
    const summary = { submitted: v.submitted, score: v.score, maxScore: v.maxScore, gameComplete: v.gameComplete, hasResponse: v.response !== undefined, hasChecked: !!v.checked };
    console.log('   ', k, JSON.stringify(summary));
  }
  console.log('  chatLogs keys:', Object.keys(p.chatLogs || {}));
  for (const [k,v] of Object.entries(p.chatLogs || {})) {
    console.log('   ', k, 'len=', Array.isArray(v) ? v.length : typeof v);
  }
})();
