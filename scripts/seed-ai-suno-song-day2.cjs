/**
 * AI Literacy: Suno Song Project — Day 2 (Remix + Ship)
 * Lesson ID: ai-suno-song-day2-remix-ship
 * Order: 70.6
 * Visible: false on seed — Luke flips morning-of
 * Due: 2026-05-19 (Tue) — same for all 4 AI Lit periods
 *
 * Uses safeLessonWrite per .claude/rules/grade-data-integrity.md.
 * Hardcoded block IDs so re-seeds preserve student progress.
 *
 * BEFORE RUNNING:
 *   1. Confirm Kit has shipped RemixLogActivity → /embeds/remix-log.html (or wherever)
 *   2. Update EMBED_URL below with the deployed path
 *   3. Confirm hero image exists at HERO_URL (Pixel generates nightly — placeholder until then)
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/lesson-ai-suno-song-day2-remix-ship.jpg';
const EMBED_URL = 'https://pantherlearn.com/tools/remix-log.html';
const SUNO_URL = 'https://suno.com';

const lesson = {
  id: 'ai-suno-song-day2-remix-ship',
  title: 'Suno Song Project — Day 2: Remix + Ship',
  unit: 'Year-End Projects',
  order: 70.6,
  visible: false,
  gradesReleased: true,
  dueDate: '2026-05-19',
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Today' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Use Suno\'s Remix controls (Weirdness, Style Influence, Audio Influence, Exclude Styles) as independent variables — change one at a time',
      'Articulate how prompt edits vs. parameter edits produce different kinds of change in a generative AI system',
      'Ship a finished creative artifact with a written rationale — you are the director, not the passenger',
    ]},
    { type: 'image', id: 'img-hero', url: HERO_URL, alt: 'Annotated Suno Remix panel with Weirdness, Style Influence, and Audio Influence sliders highlighted' },
    { type: 'text', id: 'text-hook', content: `Yesterday you made a song. Today you take the wheel. Suno's Remix panel is a science lab — every slider does something different, and the only way to know what is to change one thing at a time.` },

    { type: 'section_header', id: 'sh-rule', label: 'The Rule' },
    { type: 'callout', id: 'callout-rule', style: 'warning', content: `**One variable per remix.** If you change the lyrics AND move three sliders, you won't know which move did what. Change one thing. Generate. Listen. Write down what changed. Then change the next thing.\n\nThis is what AI literacy actually looks like — controlled experiments instead of pulling a slot-machine lever.` },

    { type: 'section_header', id: 'sh-controls', label: 'What Each Control Does' },
    { type: 'text', id: 'text-controls', content: `- **Weirdness** — how far Suno wanders from "expected" choices. Low = safer / more predictable. High = stranger, more surprising.\n- **Style Influence** — how strictly Suno sticks to your style description. Low = looser interpretation. High = locked in.\n- **Audio Influence** — how much the original track's audio shape (melody, rhythm) carries into the remix. Low = mostly new. High = mostly recognizable.\n- **Exclude Styles** — words Suno will actively avoid. Use this for stuff you heard in V1 that you didn't want.\n- **Vocal Gender** + **Lyrics Mode** — switches, not sliders. Flip and listen.` },

    { type: 'section_header', id: 'sh-remix', label: 'Step 1 — Open Your V1 and Remix It' },
    { type: 'external_link', id: 'link-suno', title: 'Open Suno', url: SUNO_URL, description: 'Pull up your Day 1 V1. Click Remix.' },

    { type: 'section_header', id: 'sh-log', label: 'Step 2 — Log Each Remix Below' },
    { type: 'text', id: 'text-log-intro', content: `Fill in **at least 2 of the 3 rows** for full credit. Each row = one remix where you changed exactly one thing. Each row scored 1 pt, 3 pts total.` },
    { type: 'embed', id: 'embed-remix-log', url: EMBED_URL, title: 'Remix Log', scored: true, weight: 5,
      description: 'Log each remix: what you changed, what you predicted, what actually happened, and the share link.' },

    { type: 'section_header', id: 'sh-final', label: 'Step 3 — Submit Your Final' },
    { type: 'question', id: 'q-final-link', questionType: 'short_answer',
      prompt: 'Paste your FINAL Suno share link — the one version (V1 or any remix) you\'re shipping as your finished song. (1 pt)' },
    { type: 'question', id: 'q-compare', questionType: 'short_answer',
      prompt: 'Compare your V1 and your final. What moved the song most — a lyric change, or a slider change? Quote the specific change and the specific difference you heard. (1 pt)' },

    { type: 'section_header', id: 'sh-reflect', label: 'Reflection' },
    { type: 'question', id: 'q-reflect', questionType: 'short_answer',
      prompt: 'If you had unlimited credits, what would you remix next and why? (Opinion — all answers count, just be honest.)',
      allCorrect: true },

    { type: 'callout', id: 'callout-closing', style: 'success', content: `**Nice work.** You just did something most adults using AI never do — you ran a controlled experiment instead of pulling a slot-machine lever. That's the difference between *using* AI and *directing* AI. Save your link. We'll listen to a few in class.\n\n— Mr. McCarthy` },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const result = await safeLessonWrite(db, courseId, lesson.id, lesson);
    console.log(`✅ ${courseId}: ${result.action} (${result.preserved} block IDs preserved)`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
