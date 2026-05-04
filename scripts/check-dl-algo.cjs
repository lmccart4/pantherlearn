const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  const ids = ['algorithm-tiktok','algorithm-influencer-economics','algorithm-discrimination','algorithm-breaking-the-loop','algorithm-platform-power','algorithm-audit','algorithm-audit-toolkit','algorithm-economy-practice','algorithm-economy-review','entrepreneurship-marketing','entrepreneurship-pitch-deck','entrepreneurship-pitch-practice','entrepreneurship-pitch-day','portfolio-how-web-works','portfolio-css-layout','portfolio-planning','portfolio-build','portfolio-showcase','algorithm-how-it-works','algorithm-attention-economy','algorithm-filter-bubbles','feed-architect','algorithm-virality'];
  for (const id of ids) {
    const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc(id).get();
    if (!d.exists) continue;
    const data = d.data();
    // get warmup text or first text block
    const blocks = data.blocks || [];
    const firstText = blocks.find(b => b.type==='text' && b.content) || blocks.find(b => b.content);
    const objectives = blocks.find(b => b.type==='objectives');
    const objText = objectives ? (objectives.items||objectives.objectives||[]).slice(0,3).join(' | ') : '';
    console.log(`\n${id} (visible=${data.visible}) — "${data.title}"`);
    if (objText) console.log(`  obj: ${objText.slice(0,200)}`);
    if (firstText) console.log(`  intro: ${(firstText.content||'').slice(0,200).replace(/\n/g,' ')}`);
  }
  process.exit(0);
})().catch(e=>{console.error(e);process.exit(1);});
