const admin = require('firebase-admin');
const { safeLessonWrite } = require('./safe-lesson-write.cjs');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const updates = {
  'psa-day2-storyboard-design': {
    'callout-due': {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Tomorrow (Thu 5/21):** Production day. Heads-down work. Bring everything — your storyboard, your sources, your scripts, your phone if you're filming, your laptop logged in to CapCut/Canva. Mid-period checkpoint at minute 25: every student must show me a rough cut or draft poster."
    }
  },
  'psa-day3-production': {
    'callout-due': {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Tomorrow (Fri 5/22):** Showcase day. Final polish (15 min) → showcase + class vote (22 min) → top 3 submitted to admin (5 min). You will present 30 seconds of context (audience + data) before playing your PSA. **Both export formats due before showcase begins.** Memorial Day weekend buffer for optional polish; final grade locks Tue 5/26."
    }
  }
};

(async () => {
  for (const [lessonId, blockMap] of Object.entries(updates)) {
    const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc(lessonId);
    const lesson = (await ref.get()).data();
    const newBlocks = lesson.blocks.map(b => blockMap[b.id] ? blockMap[b.id] : b);
    const result = await safeLessonWrite(db, 'digital-literacy', lessonId, { ...lesson, blocks: newBlocks });
    console.log(`${lessonId}: ${result.action}`);
  }
  process.exit(0);
})();
