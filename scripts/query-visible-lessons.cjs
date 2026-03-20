const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const courses = [
    { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI Literacy P4' },
    { id: 'DacjJ93vUDcwqc260OP3', label: 'AI Literacy P5' },
    { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'AI Literacy P7' },
    { id: 'fUw67wFhAtobWFhjwvZ5', label: 'AI Literacy P9' },
    { id: 'physics', label: 'Physics' },
    { id: 'digital-literacy', label: 'Digital Literacy' },
  ];

  for (const course of courses) {
    const snap = await db.collection('courses/' + course.id + '/lessons').get();
    const lessons = [];
    snap.docs.forEach(doc => {
      const d = doc.data();
      lessons.push({
        id: doc.id,
        title: d.title || '(no title)',
        visible: d.visible !== false,
        order: d.order ?? 999,
        gradeCategory: d.gradeCategory || null,
        dueDate: d.dueDate || null,
        unit: d.unit || null,
      });
    });
    lessons.sort((a, b) => a.order - b.order);

    const visible = lessons.filter(l => l.visible);
    const hidden = lessons.filter(l => !l.visible);

    console.log('\n========================================');
    console.log(course.label + ' — ' + snap.size + ' total lessons (' + visible.length + ' visible, ' + hidden.length + ' hidden)');
    console.log('========================================');
    console.log('\nVISIBLE LESSONS:');
    visible.forEach(l => {
      const due = l.dueDate ? ' [due: ' + l.dueDate + ']' : '';
      const cat = l.gradeCategory ? ' [cat: ' + l.gradeCategory + ']' : '';
      const unit = l.unit ? ' [unit: ' + l.unit + ']' : '';
      console.log('  [' + l.order + '] ' + l.title + due + cat + unit + ' (' + l.id + ')');
    });
    if (hidden.length > 0) {
      console.log('\nHIDDEN LESSONS (' + hidden.length + '):');
      hidden.forEach(l => {
        const cat = l.gradeCategory ? ' [cat: ' + l.gradeCategory + ']' : '';
        console.log('  [' + l.order + '] ' + l.title + cat + ' (' + l.id + ')');
      });
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
