const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const manifest = require('/Users/lukemccarthy/Lachlan/references/lesson-images/manifest.json');
  const enhancedIds = new Set(manifest.lessons.map(l => l.lessonId));
  
  const courses = ['physics', 'digital-literacy', 'Y9Gdhw5MTY8wMFt6Tlvj'];
  const courseNames = { 'physics': 'Physics', 'digital-literacy': 'DigLit', 'Y9Gdhw5MTY8wMFt6Tlvj': 'AI Lit' };
  let totalVisible = 0, needsImages = 0;
  const unenhanced = [];
  
  for (const courseId of courses) {
    const snap = await db.collection('courses').doc(courseId).collection('lessons').get();
    for (const doc of snap.docs) {
      const d = doc.data();
      if (d.visible === false) continue;
      totalVisible++;
      const imageBlocks = (d.blocks || []).filter(b => b.type === 'image').length;
      if (imageBlocks === 0 && !enhancedIds.has(doc.id)) {
        needsImages++;
        unenhanced.push({ course: courseNames[courseId], id: doc.id, title: d.title, blocks: (d.blocks||[]).length });
      }
    }
  }
  
  unenhanced.forEach(l => console.log(`[${l.course}] ${l.title} (${l.blocks} blocks) — ${l.id}`));
  console.log('\nTotal visible:', totalVisible, '| Zero images + untracked:', needsImages);
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
