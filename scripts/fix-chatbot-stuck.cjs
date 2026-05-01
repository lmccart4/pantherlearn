const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const SECTIONS = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'P4' },
  { id: 'DacjJ93vUDcwqc260OP3', label: 'P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'P9' },
];
const LESSON_ID = 'ai-real-world-synthesis';
const NASHLA_UID = 'IERHiKJqyabsjsZkCW4cMA7bXIE3';

(async () => {
  // Get the lesson blocks (use any section — content is the same)
  const lessonSnap = await db.doc(`courses/${SECTIONS[0].id}/lessons/${LESSON_ID}`).get();
  const blocks = (lessonSnap.data().blocks || []);
  const requiredQ = blocks.filter(b => b.type === 'question').map(b => b.id);
  const requiredEmbed = blocks.filter(b => (b.type === 'embed' || b.type === 'connect_four') && b.scored).map(b => b.id);
  const requiredChatbot = blocks.filter(b => b.type === 'chatbot').map(b => b.id);
  const requiredChecklist = blocks.filter(b => b.type === 'checklist').map(b => b.id);
  const requiredSlide = blocks.filter(b => b.type === 'slide_submit').map(b => b.id);

  console.log(`Required: ${requiredQ.length}q, ${requiredEmbed.length}embed, ${requiredChatbot.length}chatbot, ${requiredChecklist.length}checklist, ${requiredSlide.length}slide\n`);

  // Flip Nashla
  await db.doc(`progress/${NASHLA_UID}/courses/DacjJ93vUDcwqc260OP3/lessons/${LESSON_ID}`).set({
    completed: true,
    completedAt: new Date(),
  }, { merge: true });
  console.log('✅ Nashla flipped to completed=true\n');

  const stuck = [];
  for (const section of SECTIONS) {
    const enrollSnap = await db.collection('enrollments').where('courseId', '==', section.id).get();
    for (const eDoc of enrollSnap.docs) {
      const uid = eDoc.data().uid || eDoc.data().studentUid;
      if (!uid) continue;
      const progSnap = await db.doc(`progress/${uid}/courses/${section.id}/lessons/${LESSON_ID}`).get();
      if (!progSnap.exists) continue;
      const p = progSnap.data();
      if (p.completed) continue;
      const answers = p.answers || {};
      // Check if all required tasks are submitted (chatbot counts as submitted via answers.submitted)
      const allQ = requiredQ.every(id => answers[id]?.submitted);
      const allE = requiredEmbed.every(id => answers[id]?.submitted);
      const allC = requiredChatbot.every(id => answers[id]?.submitted);
      const allCh = requiredChecklist.every(id => answers[id]); // approx
      const allS = requiredSlide.every(id => answers[id]?.submitted);
      const hasChatbotMessages = requiredChatbot.some(id => answers[id]?.messages?.length > 0);
      // Stuck = everything done in answers BUT not completed
      if (allQ && allE && allC && allCh && allS && hasChatbotMessages) {
        const u = (await db.doc(`users/${uid}`).get()).data() || {};
        stuck.push({ section: section.label, uid, name: u.displayName || u.email });
      }
    }
  }

  console.log(`\nStuck students (all tasks done, lesson not completed):`);
  stuck.forEach(s => console.log(`  ${s.section}: ${s.name} (${s.uid})`));
  console.log(`\nTotal: ${stuck.length}`);
})().catch(e => { console.error(e); process.exit(1); });
