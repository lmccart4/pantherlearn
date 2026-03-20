const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  // Get lessons ordered by order, pick a few visible ones
  const snap = await db.collection('courses').doc('Y9Gdhw5MTY8wMFt6Tlvj').collection('lessons')
    .orderBy('order').get();
  
  const visible = snap.docs.filter(d => d.data().visible !== false).slice(-3);
  
  for (const doc of visible) {
    const d = doc.data();
    console.log(`\n=== ${d.title} (order ${d.order}, id: ${doc.id}) ===`);
    (d.blocks || []).slice(0, 20).forEach(b => {
      if (b.type === 'text') console.log(`  [text] ${b.content?.substring(0, 120)}`);
      else if (b.type === 'question') console.log(`  [question/${b.questionType}] ${b.prompt?.substring(0, 80)}`);
      else if (b.type === 'callout') console.log(`  [callout/${b.variant}] ${b.content?.substring(0, 80)}`);
      else console.log(`  [${b.type}] ${b.label || b.title || b.id}`);
    });
    if ((d.blocks||[]).length > 20) console.log(`  ... +${d.blocks.length - 20} more blocks`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
