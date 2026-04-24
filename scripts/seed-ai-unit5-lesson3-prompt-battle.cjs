/**
 * Append the "Prompt Battle" activity to AI Literacy Unit 5 Lesson 3 (AI in Art).
 *
 * - Lesson stays visible:false (Luke flips per period).
 * - Uses safeLessonWrite to preserve any existing block IDs.
 * - Prompt Battle blocks use stable deterministic IDs so re-runs are idempotent
 *   and the image_gen counter key (uid + blockId) stays stable across seeds.
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj', // P4
  'DacjJ93vUDcwqc260OP3', // P5
  'M2MVSXrKuVCD9JQfZZyp', // P7
  'fUw67wFhAtobWFhjwvZ5', // P9
];
const LESSON_ID = 'ai-in-art';

const STORAGE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/prompt-battle';

const PROMPT_BATTLE_BLOCKS = [
  { type: 'section_header', id: 'pb-sh', label: 'Prompt Battle' },
  {
    type: 'text',
    id: 'pb-intro',
    content:
      `**Your challenge:** Pick one of the three target images below. Using AI image generation, write prompts that get as close as possible to your chosen target.\n\n**The rules:**\n- You get **10 generations total** for this activity. They do not reset.\n- Study the target carefully — subject, style, lighting, camera angle, mood.\n- Iterate: look at what the AI gave you, then refine your prompt.\n- At the end, paste your best prompt and explain *why* you think it landed close.\n\n**Winning:** We'll vote as a class on which student's best image came closest to the target they picked.`,
  },
  { type: 'text', id: 'pb-target-a-label', content: '### Target A — Victorian Astronaut' },
  {
    type: 'image',
    id: 'pb-target-a',
    url: `${STORAGE}/prompt-battle-target-A-victorian-astronaut.jpg`,
    caption: 'Target A',
  },
  { type: 'text', id: 'pb-target-b-label', content: '### Target B — Neon Samurai' },
  {
    type: 'image',
    id: 'pb-target-b',
    url: `${STORAGE}/prompt-battle-target-B-neon-samurai.jpg`,
    caption: 'Target B',
  },
  { type: 'text', id: 'pb-target-c-label', content: '### Target C — Ghibli Whale' },
  {
    type: 'image',
    id: 'pb-target-c',
    url: `${STORAGE}/prompt-battle-target-C-ghibli-whale.jpg`,
    caption: 'Target C',
  },
  {
    type: 'question',
    id: 'pb-pick',
    questionType: 'short_answer',
    prompt: 'Which target did you pick — A, B, or C? In one sentence, what caught your eye about it?',
  },
  {
    type: 'image_gen',
    id: 'prompt-battle-gen',
    scored: true, // participation-based: any generation = full credit
    weight: 1,
    cap: 10,
  },
  {
    type: 'question',
    id: 'pb-reflect',
    questionType: 'short_answer',
    prompt:
      "Paste your best prompt here. Then explain: what words, styles, or details did you add that got the image closest to the target? What did the AI still get wrong?",
  },
];

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(LESSON_ID);
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`⚠️  ${courseId} — lesson not found, skipping`);
      continue;
    }
    const existing = snap.data();
    const existingBlocks = existing.blocks || [];

    // Idempotency: drop any previously-appended Prompt Battle blocks, then re-append.
    const pbPrefixes = ['pb-', 'prompt-battle-'];
    const trimmed = existingBlocks.filter(
      (b) => !pbPrefixes.some((p) => typeof b.id === 'string' && b.id.startsWith(p))
    );

    const newLesson = {
      ...existing,
      blocks: [...trimmed, ...PROMPT_BATTLE_BLOCKS],
      visible: false, // explicit: stays hidden
    };

    const result = await safeLessonWrite(db, courseId, LESSON_ID, newLesson);
    console.log(
      `✅ ${courseId} — ${result.action} (preserved ${result.preserved}) · blocks: ${newLesson.blocks.length}`
    );
  }
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
