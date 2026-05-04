const admin = require('firebase-admin');
const { safeLessonWrite } = require('./safe-lesson-write.cjs');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const updates = {
  'psa-day1-topic-research': {
    'callout-due': {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Tonight (Tue 5/19):** Deepen your research — find 1-2 more sources, lock your audience + one specific CTA. Draft your script (video) or headline copy (posters). Bring drafts to class **Wednesday 5/20.** No drafts = no design-lock day."
    }
  },
  'psa-day4-polish-showcase': {
    'callout-due': {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Showcase happens in class today, Fri 5/22.** Submit your best version to your project doc before the period ends. **Memorial Day weekend buffer:** if you want to polish further, you have until **Memorial Day (Mon 5/25, EOD)** to resubmit a final version — final grade locks Tue 5/26. Top 3 from the locked submissions go to admin for school-monitor rotation."
    }
  }
};

(async () => {
  for (const [lessonId, blockMap] of Object.entries(updates)) {
    const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc(lessonId);
    const lesson = (await ref.get()).data();
    const newBlocks = lesson.blocks.map(b => blockMap[b.id] ? blockMap[b.id] : b);
    const result = await safeLessonWrite(db, 'digital-literacy', lessonId, { ...lesson, blocks: newBlocks });
    console.log(`${lessonId}: ${result.action}, preserved=${result.preserved}`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
