const admin = require('firebase-admin');
const { safeLessonWrite } = require('./safe-lesson-write.cjs');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-videos/digital-literacy';

const videoBlocks = {
  'b-khaby': {
    id: 'video-khaby',
    type: 'video',
    url: `${BASE}/01-khaby-pizza-hack.mp4`,
    caption: 'Khaby Lame — pizza hack debunk (April 2021). Pause at 0:01 — that\'s where the hook lands.'
  },
  'b-mrbeast': {
    id: 'video-mrbeast',
    type: 'video',
    url: `${BASE}/02-mrbeast-1-vs-1m-hotel.mp4`,
    caption: 'MrBeast — "$1 vs $1,000,000 Hotel Room" opener (first 60 sec). Watch the contrast hit in the first 2 seconds.'
  },
  'b-local': {
    id: 'video-lejuan',
    type: 'video',
    url: `${BASE}/03-lejuan-room-chilling.mp4`,
    caption: 'LeJuan James — "When you\'re in your room chilling and Hispanic Parents walk in." Title card + face = hook in 1 second.'
  }
};

(async () => {
  const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc('short-form-video-day1-deconstruction');
  const lesson = (await ref.get()).data();
  const blocks = lesson.blocks;
  const updated = [];
  for (const b of blocks) {
    // Drop the LeJuan external_link — video is now embedded so the broken-on-school-WiFi link is redundant
    if (b.id === 'link-lejuan-video') continue;
    updated.push(b);
    if (videoBlocks[b.id]) updated.push(videoBlocks[b.id]);
  }
  const result = await safeLessonWrite(db, 'digital-literacy', 'short-form-video-day1-deconstruction', { ...lesson, blocks: updated });
  console.log('Result:', result);
  console.log(`Blocks: ${blocks.length} → ${updated.length}`);
  console.log('Video blocks added:', Object.values(videoBlocks).map(v => v.id).join(', '));
  console.log('Removed: link-lejuan-video (redundant — video now embedded)');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
