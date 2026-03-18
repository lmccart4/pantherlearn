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
    
    const missingCategory = lessons.filter(l => !l.gradeCategory);
    if (missingCategory.length > 0) {
      console.log('\n[' + course.label + '] Lessons missing gradeCategory:');
      missingCategory.forEach(l => console.log('  ' + l.title + ' | order:' + (l.order || '?')));
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
