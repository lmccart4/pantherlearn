const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('courses').doc('physics').collection('lessons')
    .where('visible', '==', true).get();
  
  for (const doc of snap.docs) {
    const d = doc.data();
    const blocks = d.blocks || [];
    const ids = blocks.map(b => b.id).filter(Boolean);
    const seen = new Set();
    for (const id of ids) {
      if (seen.has(id)) {
        console.log('DUPLICATE in lesson: ' + d.title + ' (id: ' + doc.id + ')');
        console.log('Duplicate block ID: ' + id);
        // Find all blocks with this ID
        const dups = blocks.filter(b => b.id === id);
        dups.forEach((b, i) => {
          console.log('  Occurrence ' + (i+1) + ': type=' + b.type + (b.scored ? ' scored=true' : '') + (b.url ? ' url=' + b.url : ''));
        });
      }
      seen.add(id);
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
