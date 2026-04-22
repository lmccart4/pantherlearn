// One-off fix for entrepreneurship-creator-economy lesson:
// 1. Escape $ dollar signs so KaTeX stops rendering prices as inline math
// 2. Set questionOfTheDay on the lesson doc + rewrite callout to stop duplicating QotD
// 3. Apps/tools: Passive → Both
// 4. Replace MC distractors (keep correctIndex)
// 5. Widen under-30 → under-25 / young-adult
// 6. Add 'influencer' to vocab_list
// 7. Keep every existing block ID — merge by ID into existing blocks array

const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

(async () => {
  const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc('entrepreneurship-creator-economy');
  const snap = await ref.get();
  const existing = snap.data();
  const blocks = existing.blocks.map(b => ({ ...b }));

  // helper: find first block matching a substring in its content/text/title/prompt
  const findBlock = (substr, field='content') => blocks.findIndex(b =>
    typeof b[field] === 'string' && b[field].includes(substr)
  );

  // ─── 1. Escape all unescaped $ in text fields (fix italics-from-math) ───
  const escapeDollars = (s) => typeof s === 'string' ? s.replace(/(^|[^\\])\$/g, '$1\\$') : s;
  const textFields = ['content','text','prompt','instructions','placeholder','reflectionPrompt','description','caption'];
  blocks.forEach(b => {
    textFields.forEach(f => { if (b[f]) b[f] = escapeDollars(b[f]); });
    if (b.options) b.options = b.options.map(o => escapeDollars(o));
  });

  // ─── 2. Consolidate double warm-up: QotD on doc + repurpose callout ───
  const calloutIdx = blocks.findIndex(b => b.type === 'callout' && typeof b.content === 'string' && b.content.includes('Question of the Day'));
  if (calloutIdx !== -1) {
    blocks[calloutIdx].content = '**Big picture:** A laptop and Wi-Fi are enough to start a real business today. The rest of this block gives you the map — the eight main ways people your age actually make money online.';
    blocks[calloutIdx].icon = '🗺️';
    blocks[calloutIdx].style = 'insight';
  }

  // ─── 3. Apps/tools: Passive → Both in the income-model table ───
  const tableIdx = findBlock('Apps/tools');
  if (tableIdx !== -1) {
    blocks[tableIdx].content = blocks[tableIdx].content.replace(
      /\| \*\*Apps\/tools\*\* \| Building something people pay to use \| Passive \|/,
      '| **Apps/tools** | Building something people pay to use | Both |'
    );
  }

  // ─── 4. MC distractors replacement (preserve correctIndex = 0) ───
  const mcIdx = blocks.findIndex(b => b.type === 'question' && b.questionType === 'multiple_choice' && typeof b.prompt === 'string' && b.prompt.includes('Canva resume templates'));
  if (mcIdx !== -1) {
    blocks[mcIdx].options = [
      "Passive income — she created it once and it keeps earning without additional work",
      "Active income — the templates only earn while she's actively working on them",
      "Royalty income — like a musician earning from each song play",
      "Scaling income — the more templates she uploads, the more she automatically earns"
    ];
    blocks[mcIdx].correctIndex = 0;
    blocks[mcIdx].explanation = "She did the work once (two days in January) and is still earning from it in June without doing more. That's the definition of passive income. Royalty income is a type of passive income but specific to creative works licensed to others — here she sells directly, so it's not royalties.";
  }

  // ─── 5. under-30 → young adult (under 25) ───
  const activityIdx = blocks.findIndex(b => b.type === 'activity' && typeof b.instructions === 'string' && b.instructions.includes('under 30'));
  if (activityIdx !== -1) {
    blocks[activityIdx].instructions = blocks[activityIdx].instructions.replace(
      'looks like they\'re under 30',
      'is a teen or young adult (under 25)'
    );
  }

  // ─── 6. Add 'influencer' to vocab_list ───
  const vocabIdx = blocks.findIndex(b => b.type === 'vocab_list');
  if (vocabIdx !== -1) {
    const hasInfluencer = blocks[vocabIdx].items.some(it => /influencer/i.test(it.term || ''));
    if (!hasInfluencer) {
      blocks[vocabIdx].items.splice(2, 0, {
        term: 'Influencer',
        definition: 'A creator whose main product is their audience — brands pay them to promote things. Distinct from most creator-economy business models, where you sell directly to your audience.'
      });
    }
  }

  // ─── Write lesson doc with new questionOfTheDay + updated blocks ───
  const updated = {
    ...existing,
    questionOfTheDay: 'Have you ever bought something from an independent creator online?',
    blocks
  };

  const result = await safeLessonWrite(db, 'digital-literacy', 'entrepreneurship-creator-economy', updated);
  console.log(`✅ Fixed creator-economy lesson`);
  console.log(`   Action: ${result.action}, IDs preserved: ${result.preserved}`);
  console.log(`   QotD: ${updated.questionOfTheDay}`);
  console.log(`   Block count: ${blocks.length}`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
