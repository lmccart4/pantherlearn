// Replace printable worksheet with scored embed in ai-in-law lesson, all 4 period sections.
// Also set gradesReleased:true for same-day grading.
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const SECTIONS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const EMBED_BLOCK = {
  id: 'embed-defendant-scoring',
  type: 'embed',
  url: '/tools/defendant-scoring.html',
  caption: 'Score Jordan\'s risk using the COMPAS-style weights, pick a risk band, then write your three reflections. Click Submit Score when done.',
  height: 1500,
  scored: true,
  weight: 5
};

(async () => {
  for (const cid of SECTIONS) {
    const ref = db.collection('courses').doc(cid).collection('lessons').doc('ai-in-law');
    const snap = await ref.get();
    if (!snap.exists) { console.log(`skip ${cid} (no lesson)`); continue; }
    const x = snap.data();
    const blocks = (x.blocks || []).map(b => ({ ...b }));

    // 1. Remove the "Printable packet" callout (block 21 originally)
    const printableCalloutIdx = blocks.findIndex(b => b.type === 'callout' && b.title === 'Printable packet');
    if (printableCalloutIdx !== -1) blocks.splice(printableCalloutIdx, 1);

    // 2. Update Materials callout → digital
    const materialsIdx = blocks.findIndex(b => b.type === 'callout' && /Materials/i.test(b.title || ''));
    if (materialsIdx !== -1) {
      blocks[materialsIdx] = { ...blocks[materialsIdx],
        title: 'Materials',
        content: '- Chromebook / laptop\n- 5–10 minutes' };
    }

    // 3. Update instructions text to reference the embed
    const instructionsIdx = blocks.findIndex(b => b.type === 'text' && typeof b.content === 'string' && /point-tally sheet/i.test(b.content));
    if (instructionsIdx !== -1) {
      blocks[instructionsIdx] = { ...blocks[instructionsIdx],
        content: "### How it works\n\nUse the scoring tool below. It gives you Jordan's full profile and the scoring rules — your job is to pick the right bracket for each of the 4 factors, then the right risk band based on your total.\n\n**The weights:**\n\n- Age bracket: +1 to +4 points\n- Prior record: +0 to +5 points\n- Employment status: +0 to +3 points\n- Neighborhood code: +0 to +4 points\n\nTotal = risk score. 0–5 = Low. 6–10 = Medium. 11+ = High.\n\n### Small-group compare (5 min)\n\nAfter everyone submits, compare scores in groups of 4. Did anyone pick different factor values? What factor drove the biggest jump?\n\n### Debrief\n\n- None of the inputs said \"race.\" Can the output still produce a racially biased pattern?\n- Which factor felt most \"neutral\" but actually tracks something else?\n- If you could remove one factor, which would it be — and what do you lose in exchange?" };
    }

    // 4. Replace printable external_link with embed
    const linkIdx = blocks.findIndex(b => b.type === 'external_link' && /law-defendant-scoring/i.test(b.url || ''));
    if (linkIdx !== -1) {
      blocks[linkIdx] = { ...EMBED_BLOCK };
    } else {
      // If external link not present, insert before wrap-up callout
      const wrapupIdx = blocks.findIndex(b => b.type === 'callout' && /Wrap-up question/i.test(b.title || ''));
      const insertAt = wrapupIdx === -1 ? blocks.length : wrapupIdx;
      blocks.splice(insertAt, 0, { ...EMBED_BLOCK });
    }

    await ref.update({
      blocks,
      gradesReleased: true
    });
    console.log(`✅ ${cid}/ai-in-law — ${blocks.length} blocks, embed inserted, gradesReleased:true`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
