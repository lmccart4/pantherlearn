const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const courses = ['physics', 'digital-literacy', 'Y9Gdhw5MTY8wMFt6Tlvj'];
  const labels = { 'physics': 'Physics', 'digital-literacy': 'Digital Literacy', 'Y9Gdhw5MTY8wMFt6Tlvj': 'AI Literacy (P4)' };

  for (const courseId of courses) {
    const snap = await db.collection('courses/' + courseId + '/lessons').get();
    console.log('\n' + labels[courseId] + ' (' + snap.size + ' lessons):');
    const lessons = [];
    snap.docs.forEach(doc => {
      const d = doc.data();
      const vis = d.visible === false ? false : true;
      lessons.push({ id: doc.id, title: d.title || '(no title)', visible: vis, dueDate: d.dueDate || null, order: d.order || 999 });
    });
    lessons.sort((a, b) => a.order - b.order);
    lessons.forEach(l => {
      const icon = l.visible ? '✅' : '👁️';
      const due = l.dueDate ? ' [due: ' + l.dueDate + ']' : '';
      console.log('  ' + icon + ' ' + l.title + due + ' (order: ' + l.order + ')');
    });
  }
}
main().then(() => process.exit(0));
