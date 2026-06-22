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
 *   1. Confirm hero image exists at HERO_URL (Pixel generates nightly — placeholder until then)
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/lesson-ai-suno-song-day2-remix-ship.jpg';
const SUNO_URL = 'https://suno.com';

const lesson = {
  id: 'ai-suno-song-day2-remix-ship',
  title: 'Suno Song Project — Day 2: Remix + Ship',
  unit: 'Year-End Projects',
  order: 70.6,
  visible: true,
  gradesReleased: true,
  gradeCategory: 'assessment',
  dueDate: '2026-05-20',
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Today' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Iteratively revise a generative-AI artifact: identify a problem, make a targeted change, assess whether it worked',
      'Use Suno\'s Remix controls (Weirdness, Style Influence, Audio Influence, Exclude Styles) as independent variables — change one at a time',
      'Ship a finished creative artifact with a written rationale — you are the director, not the passenger',
    ]},
    { type: 'image', id: 'img-hero', url: HERO_URL, alt: 'Annotated Suno Remix panel with Weirdness, Style Influence, and Audio Influence sliders highlighted' },
    { type: 'text', id: 'text-hook', content: `Yesterday you made a song. Today you revise it — three times. Each revision is a small experiment: find something you don't like, change one thing to fix it, then listen and decide if it actually got better.` },

    { type: 'section_header', id: 'sh-rule', label: 'The Rule' },
    { type: 'callout', id: 'callout-rule', style: 'warning', content: `**One change per revision.** If you change the lyrics AND move three sliders, you won't know which move did what. Identify one problem. Make one change. Generate. Listen. Decide if it worked. Then move to the next problem.\n\nThis is what AI literacy actually looks like — iterative revision instead of pulling a slot-machine lever.` },

    { type: 'section_header', id: 'sh-controls', label: 'What Each Control Does' },
    { type: 'text', id: 'text-controls', content: `- **Weirdness** — how far Suno wanders from "expected" choices. Low = safer / more predictable. High = stranger, more surprising.\n- **Style Influence** — how strictly Suno sticks to your style description. Low = looser interpretation. High = locked in.\n- **Audio Influence** — how much the original track's audio shape (melody, rhythm) carries into the remix. Low = mostly new. High = mostly recognizable.\n- **Exclude Styles** — words Suno will actively avoid. Use this for stuff you heard in V1 that you didn't want.\n- **Vocal Gender** + **Lyrics Mode** — switches, not sliders. Flip and listen.` },

    { type: 'section_header', id: 'sh-remix', label: 'Step 1 — Open Your V1 and Remix It' },
    { type: 'external_link', id: 'link-suno', title: 'Open Suno', url: SUNO_URL, description: 'Pull up your Day 1 V1. Click Remix.' },

    { type: 'section_header', id: 'sh-log', label: 'Step 2 — Three Revisions' },
    { type: 'text', id: 'text-log-intro', content: `Make **three new versions** of your song. For each revision, do all three steps below:\n\n1. **Identify an issue** with the current version.\n2. **Make one change** you think will fix that issue.\n3. **Review the new version** — did the change actually fix the issue? If not, you can keep iterating on that same issue across the next revisions.\n\nMinimum: 3 new versions of the song. Each revision scored on completing all 3 steps.` },

    { type: 'section_header', id: 'sh-rev1', label: 'Revision 1' },
    { type: 'question', id: 'q-rev1-issue', questionType: 'short_answer',
      prompt: '**Step 1 — Issue.** Listen to your current version. What\'s one specific thing you don\'t like or want to improve? (e.g., "chorus melody is too repetitive," "vocals sound robotic," "tempo feels too slow")' },
    { type: 'question', id: 'q-rev1-change', questionType: 'short_answer',
      prompt: '**Step 2 — Change.** What ONE thing did you change to fix that issue? Name the specific slider, lyric edit, style word, or switch — and what you set it to.' },
    { type: 'question', id: 'q-rev1-review', questionType: 'short_answer',
      prompt: '**Step 3 — Review.** Generate, listen, and assess. Did the change fix the issue? What actually changed in the audio? Do you need to iterate on this same issue in Revision 2, or move on to a new one? Paste the share link to this new version.' },

    { type: 'section_header', id: 'sh-rev2', label: 'Revision 2' },
    { type: 'question', id: 'q-rev2-issue', questionType: 'short_answer',
      prompt: '**Step 1 — Issue.** What\'s the issue you\'re tackling in this revision? (Either a new issue, or the same one from Revision 1 if it still needs work.)' },
    { type: 'question', id: 'q-rev2-change', questionType: 'short_answer',
      prompt: '**Step 2 — Change.** What ONE thing did you change this time? Be specific.' },
    { type: 'question', id: 'q-rev2-review', questionType: 'short_answer',
      prompt: '**Step 3 — Review.** Did it work? What changed in the audio? Keep iterating on this issue, or move on? Paste the share link.' },

    { type: 'section_header', id: 'sh-rev3', label: 'Revision 3' },
    { type: 'question', id: 'q-rev3-issue', questionType: 'short_answer',
      prompt: '**Step 1 — Issue.** What\'s the issue you\'re tackling in this final revision?' },
    { type: 'question', id: 'q-rev3-change', questionType: 'short_answer',
      prompt: '**Step 2 — Change.** What ONE thing did you change?' },
    { type: 'question', id: 'q-rev3-review', questionType: 'short_answer',
      prompt: '**Step 3 — Review.** Did it work? What changed? Paste the share link to this version.' },

    { type: 'section_header', id: 'sh-final', label: 'Step 3 — Submit Your Final' },
    { type: 'question', id: 'q-final-link', questionType: 'short_answer',
      prompt: 'Out of all the versions you generated today (V1 + your 3 revisions), pick the one you like the most — the version you\'re proudest of — and paste its Suno share link here. Hopefully it\'s not V1. (1 pt)' },
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
