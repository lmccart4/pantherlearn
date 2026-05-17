/**
 * AI Literacy: Suno Song Project — Day 1 (Compose)
 * Lesson ID: ai-suno-song-day1-compose
 * Order: 70.5 (between NotebookLM at 69 and Year-End Projects bank starting at 70)
 * Visible: false on seed — Luke flips morning-of
 * Due: 2026-05-18 (Mon) — same for all 4 AI Lit periods
 *
 * Uses safeLessonWrite per .claude/rules/grade-data-integrity.md.
 * Hardcoded block IDs so re-seeds preserve student progress.
 *
 * Hero tracks: Luke's own "Your CTO" + "I, Robot" (from Steady EP, already in
 * FloatingMusicPlayer via seed-steady-playlist.cjs — scoped to all 4 AI Lit courses).
 *
 * BEFORE RUNNING:
 *   1. Confirm GEM_URL is still live
 *   2. Confirm hero image exists at HERO_URL (Pixel generates nightly — placeholder until then)
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/lesson-ai-suno-song-day1-compose.jpg';
const GEM_URL = 'https://gemini.google.com/gem/1Et5XQ0eKm8NciqekDfoDgzwayrpRxmIp?usp=sharing';
const SUNO_URL = 'https://suno.com';
const YOUR_CTO_URL = 'https://www.youtube.com/watch?v=Qm3yNchXXkw';
const I_ROBOT_URL  = 'https://www.youtube.com/watch?v=WAQiYOdzheo';
const CLASS_SONGS_DRIVE = 'https://drive.google.com/drive/folders/1njH_fNeTqnxyKo9J-Sly3GCBy1SSTN9v';

const lesson = {
  id: 'ai-suno-song-day1-compose',
  title: 'Suno Song Project — Day 1: Compose',
  unit: 'Year-End Projects',
  order: 70.5,
  visible: false,
  gradesReleased: true,
  dueDate: '2026-05-18',
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Today' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Translate a personal idea into a specific, emotionally clear creative brief',
      'Use a Gemini Gem as an interview-based prompting partner (instead of blank-page prompting)',
      'Hear what specificity does to a generative AI model — and explain why it matters',
    ]},
    { type: 'image', id: 'img-hero', url: HERO_URL, alt: 'Split screen: a student running a Gemini interview on the left, Suno custom mode panel on the right' },
    { type: 'text', id: 'text-hook', content: `You're going to write a real song today. Not a worksheet about songs — a real one, that another human will hear, about anything you actually care about. Two tools, one period. Let's go.` },

    { type: 'section_header', id: 'sh-listen', label: 'Listen First — Two Real Suno Songs' },
    { type: 'text', id: 'text-listen', content: `Mr. McCarthy made an album using Suno over the past few months. You've probably already heard pieces of it in the music player at the bottom of your screen. Today we'll listen carefully to two tracks back-to-back — same person, same tool — but two completely different vibes. **"Your CTO"** is a hype origin-story track. **"I, Robot"** is a moody, introspective one.\n\nListen for what makes each track sound like *itself*. Suno didn't make those decisions — the prompt did.` },
    { type: 'external_link', id: 'link-track-your-cto', title: '▶ Your CTO — Mr. McCarthy', url: YOUR_CTO_URL, description: 'Track 1 from the Steady album. Also playable from the floating music player below.' },
    { type: 'external_link', id: 'link-track-i-robot', title: '▶ I, Robot — Mr. McCarthy', url: I_ROBOT_URL, description: 'Track 9 from the Steady album. Different vibe entirely.' },
    { type: 'callout', id: 'callout-player-hint', style: 'info', content: `**Tip:** Both tracks are also in the floating music player at the bottom of your screen — look for the "Steady — McCarthy" playlist. You can play either one without leaving this page.` },
    { type: 'question', id: 'q-compare', questionType: 'short_answer',
      prompt: 'What made "Your CTO" sound different from "I, Robot"? Be specific — instruments, vocal energy, tempo, mood, lyrics. (1 pt)' },

    { type: 'section_header', id: 'sh-class-songs', label: 'Bonus — Songs From Every Period' },
    { type: 'text', id: 'text-class-songs', content: `Mr. McCarthy also generated a personalized Suno song for **every student in every AI Literacy class** — plus 10 class anthems per period in different genres (mariachi, hype, lofi, drum & bass, country, jersey club, and more). Your period's playlist is already in the floating music player at the bottom of your screen.\n\nWant to hear what other periods got? The whole archive is on Google Drive — free to browse.` },
    { type: 'external_link', id: 'link-class-songs-drive', title: '📁 Browse all class songs (Google Drive)', url: CLASS_SONGS_DRIVE, description: 'Every period\'s student songs + class anthems. Open to anyone with the link.' },

    { type: 'section_header', id: 'sh-gem', label: 'Step 1 — Interview With the Gem' },
    { type: 'text', id: 'text-gem-intro', content: `Open the **Suno Song Coach** Gem. It's going to ask you 10 questions about the song you want to make. Topic is yours — anything you care about. Answer honestly. Short answers get short songs.\n\nWhen it's done, it will hand you two blocks: a **Style Description** and full **Lyrics**. Plus a **Progress Check** block.` },
    { type: 'external_link', id: 'link-gem', title: 'Open Suno Song Coach (Gemini Gem)', url: GEM_URL, description: 'Sign in with your @paps.net Google account.' },
    { type: 'callout', id: 'callout-progress', style: 'info', content: `**Before you go to Suno: paste the Progress Check block into the box below.** This captures your topic, language, genre, and hook line. Mr. McCarthy reviews it in real time — so if your lyrics need a tweak, he can catch it before you burn Suno credits.` },
    { type: 'question', id: 'q-progress-check', questionType: 'short_answer',
      prompt: 'Paste the Gem\'s entire PROGRESS CHECK block here. (1 pt)' },

    { type: 'section_header', id: 'sh-suno', label: 'Step 2 — Generate in Suno' },
    { type: 'text', id: 'text-suno-intro', content: `Open Suno. Sign in with your @paps.net Google account. Click **Custom** (top of the create panel).\n\nPaste the **Style Description** into the Styles box. Paste the **Lyrics** into the Lyrics box. Hit Create.\n\nSuno will generate **two versions** of your song. Both versions cost the same credits whether you listen or not — so listen to both, all the way through.` },
    { type: 'external_link', id: 'link-suno', title: 'Open Suno', url: SUNO_URL, description: 'Use Custom mode. Sign in with @paps.net.' },
    { type: 'callout', id: 'callout-no-refresh', style: 'warning', content: `**Don't refresh hoping for a hit.** Your first job today is to *hear what Suno did with your prompt* — not to slot-machine. You only get so many credits, and tomorrow's lesson is all remixes. Save your credits for that.\n\n(Suno's free tier gives you 10 songs/day, 2 versions each. You can earn more by completing in-app "quests" — worth a few minutes if you want extra runway.)` },

    { type: 'section_header', id: 'sh-submit', label: 'Step 3 — Submit Version 1' },
    { type: 'question', id: 'q-v1-link', questionType: 'short_answer',
      prompt: 'Paste the Suno share link for the version you picked. Plus 2–3 sentences: which of the two versions did you pick, and why? (2 pts)' },

    { type: 'section_header', id: 'sh-reflect', label: 'Reflection' },
    { type: 'question', id: 'q-reflect', questionType: 'short_answer',
      prompt: 'Where did the song match your vision? Where did it miss? What do you want to change tomorrow when we remix? (1 pt)' },
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
