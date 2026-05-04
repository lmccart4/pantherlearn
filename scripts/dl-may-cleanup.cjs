// DL May 2026 sprint cleanup — Kit, 2026-05-03
//
// TASK 1: MC answer-position rebalance.
//   Current dist (32 MCs): A=22% B=34% C=22% D=22%. Move 2 questions off B.
//     - photo-essay-day1-theme-composition / q-framing-check : B -> A (swap [0]<->[1])
//     - infographic-day2-design           / q-fonts          : B -> D (swap [1]<->[3])
//   Target dist: A=8 (25.0%) B=9 (28.1%) C=7 (21.9%) D=8 (25.0%) — all <=30%.
//
// TASK 2: Replace 4 MED-flagged external_link URLs with bot-friendly equivalents.
//   - photo-essay-day2-curate-sequence  / external-canva
//       https://www.canva.com/photo-essay-templates/      -> https://www.canva.com/templates/?query=photo+essay
//   - infographic-day1-topic-data       / link-iib
//       https://informationisbeautiful.net/               -> https://www.informationisbeautifulawards.com/
//   - infographic-day2-design           / link-iib-hit-song
//       https://informationisbeautiful.net/visualizations/ -> https://www.informationisbeautifulawards.com/showcase
//   - infographic-day3-polish-showcase  / link-iib
//       https://informationisbeautiful.net/               -> https://www.informationisbeautifulawards.com/
//   - infographic-day3-polish-showcase  / link-canva-export
//       https://www.canva.com/help/download-image-png/    -> https://www.canva.com/help/
//
// Mutates fields within existing blocks only — no add/remove/reorder of blocks.
// Writes via safeLessonWrite for safety (no student progress yet, but follow the rule).

const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

// ---------------------------------------------------------------------------
// MC SWAPS
// ---------------------------------------------------------------------------
// Each entry: lessonId, blockId, swap = [posA, posB] (swap those two option indices,
// then update correctIndex to follow the correct answer).
const MC_SWAPS = [
  {
    lessonId: 'photo-essay-day1-theme-composition',
    blockId: 'q-framing-check',
    swap: [0, 1], // B -> A
  },
  {
    lessonId: 'infographic-day2-design',
    blockId: 'q-fonts',
    swap: [1, 3], // B -> D
  },
];

// ---------------------------------------------------------------------------
// EXTERNAL LINK REPLACEMENTS
// ---------------------------------------------------------------------------
// Each entry: lessonId, blockId, newUrl, optional newTitle/newDescription.
const LINK_FIXES = [
  {
    lessonId: 'photo-essay-day2-curate-sequence',
    blockId: 'external-canva',
    newUrl: 'https://www.canva.com/templates/?query=photo+essay',
    newTitle: 'Canva — Photo Essay Templates (search)',
    newDescription:
      "If you'd rather build in Canva than Google Slides, this opens Canva's template search for \"photo essay\". Pick one with lots of white space, not a busy template. We finish in either tool — you pick. (Login with your school Google account.)",
  },
  {
    lessonId: 'infographic-day1-topic-data',
    blockId: 'link-iib',
    newUrl: 'https://www.informationisbeautifulawards.com/',
    newTitle: 'Information Is Beautiful Awards',
    newDescription:
      'Award-winning data visualization gallery from the team behind Information Is Beautiful. Browse winners and shortlists for examples of strong hierarchy, restraint, and a single dominant stat that leads the eye.',
  },
  {
    lessonId: 'infographic-day2-design',
    blockId: 'link-iib-hit-song',
    newUrl: 'https://www.informationisbeautifulawards.com/showcase',
    newTitle: 'Information Is Beautiful Awards — Showcase',
    newDescription:
      'Browse the awards showcase. Click any project and notice how it uses scale, color, and a single dominant stat to lead the eye.',
  },
  {
    lessonId: 'infographic-day3-polish-showcase',
    blockId: 'link-iib',
    newUrl: 'https://www.informationisbeautifulawards.com/',
    newTitle: 'Information Is Beautiful Awards',
    newDescription:
      'Reference standard. Browse the awards gallery for benchmarks of hierarchy and restraint — the kind of polish your final infographic should aim for.',
  },
  {
    lessonId: 'infographic-day3-polish-showcase',
    blockId: 'link-canva-export',
    newUrl: 'https://www.canva.com/help/',
    newTitle: 'Canva — Help Center',
    newDescription:
      'Search "download as PNG" or "export image" in the Canva help center for the current step-by-step. (Canva updates the UI; the help index always has the live walkthrough.)',
  },
];

// ---------------------------------------------------------------------------
// EXECUTE
// ---------------------------------------------------------------------------
async function applyToLesson(lessonId, mutateFn) {
  const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc(lessonId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error(`Lesson ${lessonId} not found`);
  const data = snap.data();
  const blocks = (data.blocks || []).map(b => ({ ...b }));
  const result = mutateFn(blocks);
  if (!result || !result.changed) {
    console.log(`  [skip] ${lessonId} — no changes`);
    return { changed: false };
  }
  const newLesson = { ...data, blocks };
  const writeResult = await safeLessonWrite(db, 'digital-literacy', lessonId, newLesson);
  console.log(`  [write] ${lessonId} — ${result.summary} (action=${writeResult.action}, preserved=${writeResult.preserved})`);
  return { changed: true };
}

(async () => {
  console.log('=== TASK 1: MC swaps ===');
  // Group MC swaps by lesson so each lesson is written once.
  const swapsByLesson = {};
  for (const s of MC_SWAPS) {
    (swapsByLesson[s.lessonId] = swapsByLesson[s.lessonId] || []).push(s);
  }

  for (const [lessonId, swaps] of Object.entries(swapsByLesson)) {
    await applyToLesson(lessonId, (blocks) => {
      const summaries = [];
      for (const s of swaps) {
        const block = blocks.find(b => b.id === s.blockId);
        if (!block) throw new Error(`Block ${s.blockId} not found in ${lessonId}`);
        if (block.type !== 'question' || block.questionType !== 'multiple_choice') {
          throw new Error(`${lessonId}/${s.blockId} not a multiple_choice block`);
        }
        const [i, j] = s.swap;
        const opts = block.options.slice();
        const tmp = opts[i]; opts[i] = opts[j]; opts[j] = tmp;
        const oldCorrect = block.correctIndex;
        let newCorrect = oldCorrect;
        if (oldCorrect === i) newCorrect = j;
        else if (oldCorrect === j) newCorrect = i;
        block.options = opts;
        block.correctIndex = newCorrect;
        summaries.push(`${s.blockId}: correctIndex ${oldCorrect}->${newCorrect}, swapped opts[${i}]<->opts[${j}]`);
      }
      return { changed: true, summary: summaries.join(' | ') };
    });
  }

  console.log('\n=== TASK 2: External link replacements ===');
  const fixesByLesson = {};
  for (const f of LINK_FIXES) {
    (fixesByLesson[f.lessonId] = fixesByLesson[f.lessonId] || []).push(f);
  }
  for (const [lessonId, fixes] of Object.entries(fixesByLesson)) {
    await applyToLesson(lessonId, (blocks) => {
      const summaries = [];
      for (const f of fixes) {
        const block = blocks.find(b => b.id === f.blockId);
        if (!block) throw new Error(`Block ${f.blockId} not found in ${lessonId}`);
        if (block.type !== 'external_link') {
          throw new Error(`${lessonId}/${f.blockId} not an external_link block (type=${block.type})`);
        }
        const oldUrl = block.url;
        block.url = f.newUrl;
        if (f.newTitle) block.title = f.newTitle;
        if (f.newDescription) block.description = f.newDescription;
        summaries.push(`${f.blockId}: ${oldUrl} -> ${f.newUrl}`);
      }
      return { changed: true, summary: summaries.join(' | ') };
    });
  }

  console.log('\nDone.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
