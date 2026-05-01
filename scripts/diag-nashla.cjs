const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

(async () => {
  const courseId = 'DacjJ93vUDcwqc260OP3'; // P5

  // Find Nashla
  const enrollSnap = await db.collection('enrollments').where('courseId', '==', courseId).get();
  const students = [];
  for (const doc of enrollSnap.docs) {
    const d = doc.data();
    const uid = d.uid || d.studentUid;
    if (!uid) continue;
    const userSnap = await db.collection('users').doc(uid).get();
    const u = userSnap.data() || {};
    const name = (u.displayName || u.name || u.email || '').toLowerCase();
    if (name.includes('nashla')) students.push({ uid, ...u });
  }
  console.log('Nashla candidates:', JSON.stringify(students, null, 2));

  // Find "AI in the Real World" lesson(s) in P5
  const lessonsSnap = await db.collection('courses').doc(courseId).collection('lessons').get();
  const matches = [];
  lessonsSnap.docs.forEach(d => {
    const data = d.data();
    const title = data.title || '';
    const unit = data.unit || '';
    if (title.toLowerCase().includes('real world') || unit.toLowerCase().includes('real world') || title.toLowerCase().includes('ai in the real')) {
      matches.push({ id: d.id, title, unit, visible: data.visible, dueDate: data.dueDate, blocks: (data.blocks || []).length });
    }
  });
  console.log('\nLesson matches:', JSON.stringify(matches, null, 2));
})();
