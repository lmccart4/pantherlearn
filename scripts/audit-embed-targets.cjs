const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const targets = [
    // AI Literacy
    { courseId: 'Y9Gdhw5MTY8wMFt6Tlvj', lessonId: '36da9be4', tool: 'Bias Detection' },
    { courseId: 'Y9Gdhw5MTY8wMFt6Tlvj', lessonId: 'ai-ethics-accountability', tool: 'Ethics Cards' },
    { courseId: 'Y9Gdhw5MTY8wMFt6Tlvj', lessonId: 'whos-making-choices', tool: 'Decision Tree' },
    { courseId: 'Y9Gdhw5MTY8wMFt6Tlvj', lessonId: 'prompt-workshop', tool: 'Prompt Sandbox' },
    // Physics
    { courseId: 'physics', lessonId: 'coulombs-law', tool: "Coulomb's Law Explorer" },
    { courseId: 'physics', lessonId: 'work-energy-discovery', tool: 'Equation Solvers' },
    { courseId: 'physics', lessonId: 'w20-download-prep', tool: 'Virtual Labs' },
  ];

  for (const t of targets) {
    const doc = await db.collection('courses').doc(t.courseId).collection('lessons').doc(t.lessonId).get();
    if (!doc.exists) { console.log(`\n❌ ${t.tool} → ${t.lessonId} NOT FOUND`); continue; }
    const d = doc.data();
    const blocks = d.blocks || [];
    const embeds = blocks.filter(b => b.type === 'embed');
    console.log(`\n[${t.tool}] → "${d.title}" (${t.lessonId})`);
    console.log(`  visible: ${d.visible} | blocks: ${blocks.length} | embeds already: ${embeds.length}`);
    console.log(`  Block types: ${[...new Set(blocks.map(b => b.type))].join(', ')}`);
    if (embeds.length) embeds.forEach(e => console.log(`  embed: ${e.url}`));
  }

  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
