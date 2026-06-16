// Seed: Digital Literacy — Extra Credit: Make a Song With AI (Suno)
// Course: digital-literacy   Lesson: suno-song-extra-credit
//
// Consolidates the AI Literacy two-lesson Suno project
// (ai-suno-song-day1-compose + ai-suno-song-day2-remix-ship) into ONE DL lesson.
// Decisions (Luke, 2026-06-16): 1 remix revision · +10% bonus · live now.
// Extra credit = manual entry; lesson ID is excluded in classroom-sync.cjs.
//
// Uses safeLessonWrite (append-only, preserves block IDs). New doc, 0 students.

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(
    require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')
  ),
});
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSE_ID = 'digital-literacy';

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/lesson-ai-suno-song-day1-compose.jpg';
const GEM_URL = 'https://gemini.google.com/gem/1Et5XQ0eKm8NciqekDfoDgzwayrpRxmIp?usp=sharing';
const SUNO_URL = 'https://suno.com';
const STEADY_DEMO_URL = 'https://steady-album.firebaseapp.com';

const lesson = {
  id: 'suno-song-extra-credit',
  title: 'Extra Credit: Make a Song With AI',
  unit: 'Extra Credit',
  order: 99,
  visible: true,
  gradesReleased: true,
  dueDate: '2026-06-19',
  blocks: [
    { type: 'section_header', id: 'suno-ec-sh-top', label: 'Extra Credit' },
    { type: 'objectives', id: 'suno-ec-obj', title: 'Learning Objectives', items: [
      'Translate a personal idea into a specific, emotionally clear creative brief',
      'Use a Gemini Gem as an interview-based prompting partner instead of blank-page prompting',
      'Revise a generative-AI artifact on purpose — identify a problem, make one targeted change, judge whether it worked',
    ]},
    { type: 'image', id: 'suno-ec-img-hero', url: HERO_URL, alt: 'Split screen: a student running a Gemini interview on the left, Suno custom mode panel on the right' },
    { type: 'text', id: 'suno-ec-hook', content: `This one's optional — pure extra credit. You're going to make a **real song** with AI. Not a worksheet about songs — an actual track, about anything you care about, that another human can listen to. Two tools, one sitting. If you finish the whole thing, you earn a **+10% bonus** on your grade.` },

    { type: 'callout', id: 'suno-ec-rubric', style: 'info', content: `**How the +10% is earned.** Do the whole flow and submit honest work:\n\n1. **Compose** — interview the Gem, generate your first song in Suno, submit the link.\n2. **Remix once** — find one thing to improve, change one thing, and judge whether it worked.\n3. **Ship** — submit your favorite version and compare it to where you started.\n\nReal iteration, not a slot-machine. Mr. McCarthy enters the bonus by hand after reviewing your submission.` },

    { type: 'section_header', id: 'suno-ec-sh-listen', label: 'Listen First — Two Real Suno Songs' },
    { type: 'text', id: 'suno-ec-listen', content: `Mr. McCarthy made an entire album using Suno over a weekend — start to finish. We'll listen to two tracks back-to-back — same person, same tool — but two completely different vibes. **"Your CTO"** is a hype origin-story track. **"I, Robot"** is moody and introspective.\n\nListen for what makes each track sound like *itself*. Suno didn't make those decisions — the prompt did.` },
    { type: 'external_link', id: 'suno-ec-link-steady', title: '🎧 Listen — Your CTO + I, Robot (with lyrics)', url: STEADY_DEMO_URL, description: 'Both tracks side-by-side with full lyrics. Tab between them to compare. Opens in a new window.' },
    { type: 'question', id: 'suno-ec-q-compare', questionType: 'short_answer',
      prompt: 'What made "Your CTO" sound different from "I, Robot"? Be specific — instruments, vocal energy, tempo, mood, lyrics. (1 pt)' },

    { type: 'section_header', id: 'suno-ec-sh-gem', label: 'Step 1 — Interview the Gem' },
    { type: 'text', id: 'suno-ec-gem-intro', content: `Open the **Suno Song Coach** Gem. It will ask you about 10 questions about the song you want to make. The topic is yours — anything you care about. Answer honestly; short answers get short songs.\n\nWhen it's done it hands you two blocks: a **Style Description** and full **Lyrics**.` },
    { type: 'external_link', id: 'suno-ec-link-gem', title: 'Open Suno Song Coach (Gemini Gem)', url: GEM_URL, description: 'Sign in with your @paps.net Google account.' },
    { type: 'callout', id: 'suno-ec-gem-progress', style: 'info', content: `**Before you go to Suno: paste the Gem's full output below** — both the Style Description and the Lyrics. Mr. McCarthy reviews it as you go, so if anything needs a tweak he can catch it before you burn Suno credits.` },
    { type: 'question', id: 'suno-ec-q-gem', questionType: 'short_answer',
      prompt: 'Paste the Gem\'s output here — both the Style Description block AND the full Lyrics block, exactly as the Gem gave them to you. (1 pt)' },

    { type: 'section_header', id: 'suno-ec-sh-gen', label: 'Step 2 — Generate in Suno' },
    { type: 'text', id: 'suno-ec-gen-intro', content: `Open Suno. Sign in with your @paps.net Google account. Click **Custom** at the top of the create panel.\n\nPaste the **Style Description** into the Styles box. Paste the **Lyrics** into the Lyrics box. Hit Create.\n\nSuno generates **two versions**. Both cost the same credits whether you listen or not — so listen to both, all the way through, and pick your favorite.` },
    { type: 'external_link', id: 'suno-ec-link-suno1', title: 'Open Suno', url: SUNO_URL, description: 'Use Custom mode. Sign in with @paps.net.' },
    { type: 'callout', id: 'suno-ec-gen-warn', style: 'warning', content: `**Don't refresh hoping for a hit.** Your job here is to *hear what Suno did with your prompt* — not to slot-machine. You only get so many credits, and you'll want some for the remix step.\n\n(Suno's free tier gives you 10 songs/day, 2 versions each. You can earn more by completing in-app "quests" if you want extra runway.)` },
    { type: 'question', id: 'suno-ec-q-v1', questionType: 'short_answer',
      prompt: 'Paste the Suno share link for the version you picked. Plus 2–3 sentences: which of the two versions did you pick, and why? (2 pts)' },

    { type: 'section_header', id: 'suno-ec-sh-remix', label: 'Step 3 — Remix It Once' },
    { type: 'callout', id: 'suno-ec-remix-rule', style: 'warning', content: `**One change.** Find one thing you don't like, change one thing to fix it, then listen and decide if it actually got better. If you change the lyrics AND move three sliders, you won't know which move did what. This is what AI literacy actually looks like — controlled revision instead of pulling a lever.` },
    { type: 'text', id: 'suno-ec-controls', content: `**What each Remix control does:**\n- **Weirdness** — how far Suno wanders from "expected" choices. Low = safer. High = stranger.\n- **Style Influence** — how strictly Suno sticks to your style description. Low = looser. High = locked in.\n- **Audio Influence** — how much the original track's melody/rhythm carries over. Low = mostly new. High = mostly recognizable.\n- **Exclude Styles** — words Suno will actively avoid. Use this for stuff in V1 you didn't want.\n- **Vocal Gender** + **Lyrics Mode** — switches, not sliders. Flip and listen.` },
    { type: 'external_link', id: 'suno-ec-link-suno2', title: 'Open Suno', url: SUNO_URL, description: 'Pull up your V1. Click Remix.' },
    { type: 'question', id: 'suno-ec-q-issue', questionType: 'short_answer',
      prompt: '**Step 1 — Issue.** Listen to your V1. What\'s one specific thing you want to improve? (e.g., "chorus melody is too repetitive," "vocals sound robotic," "tempo feels too slow")' },
    { type: 'question', id: 'suno-ec-q-change', questionType: 'short_answer',
      prompt: '**Step 2 — Change.** What ONE thing did you change to fix it? Name the specific slider, lyric edit, style word, or switch — and what you set it to.' },
    { type: 'question', id: 'suno-ec-q-review', questionType: 'short_answer',
      prompt: '**Step 3 — Review.** Generate, listen, and assess. Did the change fix the issue? What actually changed in the audio? Paste the share link to this new version.' },

    { type: 'section_header', id: 'suno-ec-sh-final', label: 'Submit Your Final' },
    { type: 'question', id: 'suno-ec-q-final', questionType: 'short_answer',
      prompt: 'Out of your V1 and your remix, pick the version you\'re proudest of and paste its Suno share link here. (1 pt)' },
    { type: 'question', id: 'suno-ec-q-final-compare', questionType: 'short_answer',
      prompt: 'Compare your V1 and your final. What moved the song most — a lyric change or a slider change? Quote the specific change and the specific difference you heard. (1 pt)' },

    { type: 'section_header', id: 'suno-ec-sh-reflect', label: 'Reflection' },
    { type: 'question', id: 'suno-ec-q-reflect', questionType: 'short_answer',
      prompt: 'If you had unlimited credits, what would you make next and why? (Opinion — all honest answers count.)',
      allCorrect: true },

    { type: 'callout', id: 'suno-ec-closing', style: 'success', content: `**Nice work.** You just did something most adults using AI never do — you ran a controlled experiment instead of pulling a slot-machine lever. That's the difference between *using* AI and *directing* it. Save your link.\n\n— Mr. McCarthy` },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  // Preserve any existing per-course publish state on re-seed.
  const existing = await db.collection('courses').doc(COURSE_ID).collection('lessons').doc(lesson.id).get();
  const out = { ...lesson };
  if (existing.exists) {
    const d = existing.data();
    if (d.visible !== undefined) out.visible = d.visible;
    if (d.dueDate !== undefined) out.dueDate = d.dueDate;
    if (d.gradesReleased !== undefined) out.gradesReleased = d.gradesReleased;
  }
  const result = await safeLessonWrite(db, COURSE_ID, lesson.id, out);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${result.action} (${result.preserved} block IDs preserved, visible:${out.visible}, due:${out.dueDate})`);
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
