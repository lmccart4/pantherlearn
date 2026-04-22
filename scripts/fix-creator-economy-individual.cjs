// Reframe the Creator Atlas activity from class-shared deck → individual student deliverable.
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

(async () => {
  const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc('entrepreneurship-creator-economy');
  const snap = await ref.get();
  const existing = snap.data();
  const blocks = existing.blocks.map(b => ({ ...b }));

  // 11: section_header
  const secIdx = blocks.findIndex(b => b.type === 'section_header' && /Creator Atlas/i.test(b.title || ''));
  if (secIdx !== -1) {
    blocks[secIdx].title = 'Your Creator Atlas Slide';
    blocks[secIdx].subtitle = 'Research one real young creator — build your own one-slide profile';
  }

  // 12: image caption
  const imgIdx = blocks.findIndex(b => b.type === 'image' && /creator-atlas/i.test(b.url || ''));
  if (imgIdx !== -1) {
    blocks[imgIdx].caption = 'Research one creator, build one slide, submit your own deliverable.';
  }

  // 13: activity
  const actIdx = blocks.findIndex(b => b.type === 'activity' && /Build the Atlas/i.test(b.title || ''));
  if (actIdx !== -1) {
    blocks[actIdx].title = 'Build Your Slide (20 min)';
    blocks[actIdx].instructions =
      "**Goal:** Build your own one-slide profile of a real young creator earning money online.\n\n" +
      "**Steps:**\n\n" +
      "1. **Pick your creator** (3 min). Find a real online creator who is a teen or young adult (under 25) and is making money independently. Rules: real person (not a big company), active within the last 6 months, makes money online (you can tell how).\n\n" +
      "2. **Research** (10 min) — dig into their profile, about page, recent posts, and any interviews or link-in-bio.\n\n" +
      "3. **Build your slide** (7 min):\n" +
      "   - Creator name + platform handle\n" +
      "   - Their niche (one sentence)\n" +
      "   - Business model (pick from the 8 — freelancing, digital products, e-commerce, content/ads, services, courses, affiliates, apps)\n" +
      "   - How they make money (be specific — \"\\$X product,\" \"brand deals,\" \"Patreon tiers,\" etc.)\n" +
      "   - Estimated monthly earnings + your source\n" +
      "   - Link to their main profile\n\n" +
      "**Pick your tool — both work:**";
  }

  // 14: Google Slides link (copy URL already creates a personal copy — just retitle/redescribe)
  const gIdx = blocks.findIndex(b => b.type === 'external_link' && /Google Slides/i.test(b.title || ''));
  if (gIdx !== -1) {
    blocks[gIdx].title = 'Option A: Google Slides (your own copy)';
    blocks[gIdx].description = 'Click the button to make your own personal copy of the template. Fill in the fields, rename the file, then submit the link below.';
    blocks[gIdx].buttonLabel = 'Make Your Own Copy';
  }

  // 15: Canva link — retitle and clarify it's a personal design
  const cIdx = blocks.findIndex(b => b.type === 'external_link' && /Canva/i.test(b.title || ''));
  if (cIdx !== -1) {
    blocks[cIdx].title = 'Option B: Canva Presentation (your own design)';
    blocks[cIdx].description = 'Open Canva → Create a design → "Presentation" → build your own slide using the same fields. Share the link when done.';
  }

  // 16: question
  const qIdx = blocks.findIndex(b => b.type === 'question' && typeof b.prompt === 'string' && /Paste the link to your slide/i.test(b.prompt));
  if (qIdx !== -1) {
    blocks[qIdx].prompt = 'Paste the link to **your own** slide (Google Slides or Canva). Then answer: Which business model is your creator using, and what surprised you most about how they actually earn money?';
  }

  const updated = { ...existing, blocks };
  const result = await safeLessonWrite(db, 'digital-literacy', 'entrepreneurship-creator-economy', updated);
  console.log(`✅ Creator Atlas reframed as individual deliverable`);
  console.log(`   Action: ${result.action}`);
  console.log(`   Updated blocks:`, [secIdx, imgIdx, actIdx, gIdx, cIdx, qIdx].filter(i => i !== -1));
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
