const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const slugs = new Set([
  'ai-in-healthcare','ai-in-law','ai-in-art','ai-in-climate',
  'ai-in-hiring','ai-in-policing','ai-in-education','ai-real-world-synthesis'
]);
const COURSE = 'Y9Gdhw5MTY8wMFt6Tlvj'; // AI Lit P4 (canonical)

(async () => {
  const snap = await db.collection(`courses/${COURSE}/lessons`).get();
  const found = {};
  snap.docs.forEach(doc => {
    const d = doc.data();
    if (slugs.has(d.slug) || slugs.has(doc.id)) {
      found[d.slug || doc.id] = { id: doc.id, data: d };
    }
  });

  for (const slug of slugs) {
    const entry = found[slug];
    if (!entry) { console.log(`\n=== ${slug}: NOT FOUND in P4`); continue; }
    const d = entry.data;
    const blocks = d.blocks || [];
    const types = {};
    let scoredEmbed=false, embedCount=0, imageBlocks=0, imageUrls=0, questions=0, scoredQs=0, embedSrcs=[];
    for (const b of blocks) {
      types[b.type] = (types[b.type]||0)+1;
      if (b.type==='embed' || b.type==='external_embed') { embedCount++; if (b.scored) scoredEmbed=true; if (b.src||b.url) embedSrcs.push((b.src||b.url).slice(-50)); }
      if (b.type==='image') imageBlocks++;
      if (b.imageUrl) imageUrls++;
      if (b.type==='question') { questions++; if (b.scored) scoredQs++; }
    }
    console.log(`\n=== ${slug} | "${d.title}"`);
    console.log(`    id:${entry.id}  blocks:${blocks.length}  visible:${d.visible}  unit:${d.unit||'-'}  scored:${d.scored}`);
    console.log(`    types: ${JSON.stringify(types)}`);
    console.log(`    embeds:${embedCount} scoredEmbed:${scoredEmbed} imgBlocks:${imageBlocks} blocksWImageUrl:${imageUrls} Qs:${questions} scoredQs:${scoredQs}`);
    if (embedSrcs.length) console.log(`    embedSrcs: ${embedSrcs.join(' | ')}`);
  }
  process.exit(0);
})();
