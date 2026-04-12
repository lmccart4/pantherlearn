const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const courseId = 'Y9Gdhw5MTY8wMFt6Tlvj';
  const snap = await db.collection('courses/' + courseId + '/lessons').get();
  const rows = [];
  snap.docs.forEach(doc => {
    const d = doc.data();
    const blocks = Array.isArray(d.blocks) ? d.blocks : [];
    const blockTypes = {};
    blocks.forEach(b => {
      const t = b.type || 'unknown';
      blockTypes[t] = (blockTypes[t] || 0) + 1;
    });
    rows.push({
      id: doc.id,
      title: d.title || '(no title)',
      visible: d.visible !== false,
      order: d.order ?? 999,
      unit: d.unit || null,
      gradeCategory: d.gradeCategory || null,
      dueDate: d.dueDate || null,
      blockCount: blocks.length,
      blockTypes,
      createdAt: d.createdAt?.toDate?.()?.toISOString?.() || null,
      updatedAt: d.updatedAt?.toDate?.()?.toISOString?.() || null,
    });
  });

  rows.sort((a, b) => a.order - b.order);
  const hidden = rows.filter(r => !r.visible);

  console.log('P4 HIDDEN LESSONS — ' + hidden.length);
  console.log('===========================================');
  hidden.forEach(l => {
    const types = Object.entries(l.blockTypes).map(([k, v]) => k + ':' + v).join(', ');
    console.log('\n[' + l.order + '] ' + l.title);
    console.log('    id: ' + l.id);
    console.log('    unit: ' + (l.unit || '(none)') + ' | cat: ' + (l.gradeCategory || '(none)'));
    console.log('    blocks: ' + l.blockCount + ' (' + types + ')');
    console.log('    created: ' + (l.createdAt || '?') + ' | updated: ' + (l.updatedAt || '?'));
  });
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
