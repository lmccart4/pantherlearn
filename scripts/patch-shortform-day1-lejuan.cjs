const admin = require('firebase-admin');
const { safeLessonWrite } = require('./safe-lesson-write.cjs');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const VIDEO_URL = "https://www.tiktok.com/@lejuanjames/video/7258066743283748138";

(async () => {
  const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc('short-form-video-day1-deconstruction');
  const doc = await ref.get();
  const lesson = doc.data();
  const blocks = lesson.blocks;

  const newBLocal = {
    id: "b-local",
    type: "text",
    content: "## Example 3 — LeJuan James (@lejuanjames) — Hispanic Parent POV\n\n**Format:** Cultural specificity. The hook IS the relatability.\n\nWe're watching: **\"When you're in your room chilling and Hispanic Parents walk in.\"** Title card + face = the hook lands in 1 second.\n\n- **Hook:** A title card sets up a scenario every kid in this room has lived. Then his face delivers the punch before he says a word.\n- **Payoff:** Recognition + warmth. \"This is MY house. That's MY mom.\"\n- **Why the algorithm rewards it:**\n  - **Cultural specificity** = strong completion + share signal inside Latino audiences\n  - Comments fire (\"my mom does this exactly\") — comment signal feeds the loop\n  - Bilingual code-switching (English ↔ Spanish) extends watch time across two audiences at once\n  - LeJuan reuses the SAME hook formula across hundreds of videos — algorithm learns the pattern, viewers come back for the next \"When Hispanic Parents…\"\n\n**The lesson:** specificity beats generality. A video about \"parents being annoying\" gets ignored. A video about \"Hispanic parents walking in while you're chilling\" gets watched twice — first for the laugh, second to send to your friend who needs to see it."
  };

  // Replace teacher-note callout with a student-facing watch-prompt
  const newCalloutWatch = {
    id: "callout-teacher-note",
    type: "callout",
    style: "question",
    icon: "👀",
    content: "**Watch the LeJuan clip twice.** First time: just react. Second time: pause at 0:01. Where exactly does the hook land — the title card, the face, or the first word? Be ready to point to a frame."
  };

  // Add an external_link block right after b-local for the actual video URL
  const externalLink = {
    id: "link-lejuan-video",
    type: "external_link",
    url: VIDEO_URL,
    title: "LeJuan James — When you're in your room chilling and Hispanic Parents walk in",
    description: "The Example 3 video. Watch on the projector. Note the title-card hook + face reaction in the first second."
  };

  const updated = blocks.map(b => {
    if (b.id === 'b-local') return newBLocal;
    if (b.id === 'callout-teacher-note') return newCalloutWatch;
    return b;
  });

  // Insert external_link block right after b-local if not already present
  if (!updated.find(b => b.id === 'link-lejuan-video')) {
    const idx = updated.findIndex(b => b.id === 'b-local');
    updated.splice(idx + 1, 0, externalLink);
  }

  const newLesson = { ...lesson, blocks: updated };
  const result = await safeLessonWrite(db, 'digital-literacy', 'short-form-video-day1-deconstruction', newLesson);
  console.log('Result:', result);
  console.log('Block count before:', blocks.length, 'after:', updated.length);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
