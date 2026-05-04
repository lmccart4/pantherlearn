// Fix Link's HIGH+MED findings on the May 2026 DL sprint.
// Lessons are visible:false with no student progress, but we still go through
// safeLessonWrite() for safety.
const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

// ---- HIGH fix: closing reflection blocks ----
// 1) Photo essay (3) — replace existing block of type="reflection" with a question/short_answer.
// 2) Infographic (3) — flip questionType: "reflection" -> "short_answer" (keep id, prompt, placeholder).
// 3) Short-form video (4) — append a new short_answer reflection AFTER the vocab list.

const REFLECTION_OVERRIDES = {
  // Photo essay — replaces the existing type:"reflection" block with a question/short_answer.
  // (We rewrite the prompt + placeholder to be specific to that lesson's focus.)
  'photo-essay-day1-theme-composition': {
    mode: 'replace',
    blockId: 'r-reflection',
    block: {
      id: 'r-reflection',
      type: 'question',
      questionType: 'short_answer',
      prompt: 'Pick ONE composition technique you used in your photo today (rule of thirds, leading lines, framing, or fill-the-frame). Why did that technique fit your theme — what did it let the photo say that a centered, eye-level shot would have missed? Then: which technique are you weakest on, and how will you push yourself to use it on Saturday?',
      placeholder: 'Technique I used: ...\nWhy it fit my theme: ...\nWhere I\'m weakest: ...\nHow I\'ll push on Saturday: ...',
      difficulty: 'evaluate',
    },
  },
  'photo-essay-day2-curate-sequence': {
    mode: 'replace',
    blockId: 'r-reflection',
    block: {
      id: 'r-reflection',
      type: 'question',
      questionType: 'short_answer',
      prompt: 'Curating means cutting good photos to make the essay stronger. Which photo did you cut today that hurt the most to lose, and why was the right call to drop it? Then: in your final 6-8, which photo is doing the heaviest storytelling work, and what would the essay lose without it?',
      placeholder: 'Photo I cut + why it hurt: ...\nWhy cutting it was right: ...\nMy hardest-working photo: ...\nWhat the essay would lose without it: ...',
      difficulty: 'evaluate',
    },
  },
  'photo-essay-day3-layout-showcase': {
    mode: 'replace',
    blockId: 'r-reflection',
    block: {
      id: 'r-reflection',
      type: 'question',
      questionType: 'short_answer',
      prompt: 'During the gallery walk, which classmate\'s photo essay surprised you — a theme you didn\'t expect, a sequence move that worked, a caption that hit different? Be specific about whose and what. Then: looking at your own essay next to theirs, what\'s one thing you\'d steal for your next photo project, and one thing your essay does better than theirs?',
      placeholder: 'Classmate + what surprised me: ...\nWhat I\'d steal: ...\nWhat mine does better: ...',
      difficulty: 'evaluate',
    },
  },

  // Infographic — flip questionType: "reflection" -> "short_answer" on existing block id "q-reflection",
  // and rewrite prompt/placeholder to be lesson-specific.
  'infographic-day1-topic-data': {
    mode: 'replace',
    blockId: 'q-reflection',
    block: {
      id: 'q-reflection',
      type: 'question',
      questionType: 'short_answer',
      prompt: 'What\'s the topic you picked, and which stat from your sourcing today actually surprised you — the kind of number you didn\'t see coming? Why was it surprising? And which stat are you most worried isn\'t solid enough — what\'s your plan to either re-source it or replace it before Day 2?',
      placeholder: 'My topic: ...\nMost surprising stat: ...\nWhy it surprised me: ...\nThe stat I\'m worried about: ...\nMy plan to fix it: ...',
      difficulty: 'evaluate',
    },
  },
  'infographic-day2-design': {
    mode: 'replace',
    blockId: 'q-reflection',
    block: {
      id: 'q-reflection',
      type: 'question',
      questionType: 'short_answer',
      prompt: 'Visual hierarchy is what tells a viewer where to look first, second, third. In your infographic today, what\'s the ONE element you scaled biggest — a stat, a headline, an icon — and why did that earn the top spot? Then: was there a moment you wanted to make two things equally big, and how did you decide which one had to lose?',
      placeholder: 'My biggest element: ...\nWhy it earned the top spot: ...\nThe tie I had to break: ...\nHow I decided: ...',
      difficulty: 'evaluate',
    },
  },
  'infographic-day3-polish-showcase': {
    mode: 'replace',
    blockId: 'q-reflection',
    block: {
      id: 'q-reflection',
      type: 'question',
      questionType: 'short_answer',
      prompt: 'Peer feedback today — name one specific piece of feedback that actually changed your design (not just a typo fix). What did your partner say, what did you change, and is your infographic stronger now? If you ignored a piece of feedback, what was it and why did you trust your own call?',
      placeholder: 'Feedback I took: ...\nWhat I changed: ...\nWhy it\'s stronger: ...\nFeedback I ignored + why: ...',
      difficulty: 'evaluate',
    },
  },

  // Short-form video — APPEND a new short_answer reflection AFTER the existing vocab block.
  // We also add a section_header for "Reflection" so the page reads cleanly.
  'short-form-video-day1-deconstruction': {
    mode: 'append',
    afterId: 'vocab',
    blocks: [
      {
        id: 'section-reflection',
        type: 'section_header',
        icon: '🪞',
        title: 'Reflection',
        subtitle: '~3 minutes',
      },
      {
        id: 'r-reflection',
        type: 'question',
        questionType: 'short_answer',
        prompt: 'Out of the 3-5 hooks we deconstructed today (Khaby, Bayashi, Tabitha Brown, the silent-cooking abuela, etc.), which one is closest to the kind of hook YOU could pull off on camera tomorrow — and why? Be honest about what fits your personality and your topic. Then: what specifically will you steal from it (the cut, the visual setup, the silence, the caption move) and what will you change?',
        placeholder: 'Hook I\'d model on: ...\nWhy it fits me: ...\nWhat I\'ll steal: ...\nWhat I\'ll change: ...',
        difficulty: 'evaluate',
      },
    ],
  },
  'short-form-video-day2-script-shoot': {
    mode: 'append',
    afterId: 'vocab',
    blocks: [
      {
        id: 'section-reflection',
        type: 'section_header',
        icon: '🪞',
        title: 'Reflection',
        subtitle: '~3 minutes',
      },
      {
        id: 'r-reflection',
        type: 'question',
        questionType: 'short_answer',
        prompt: 'Shoot day rarely goes the way the storyboard imagined. What happened on your shoot today that surprised you — a take that worked better than expected, a shot that fell apart, lighting that changed, a take you re-did 5 times? What did that surprise teach you about what\'s actually going to make it into the final cut?',
        placeholder: 'What surprised me: ...\nWhy: ...\nWhat I learned about my final cut: ...',
        difficulty: 'evaluate',
      },
    ],
  },
  'short-form-video-day3-edit-capcut': {
    mode: 'append',
    afterId: 'vocab',
    blocks: [
      {
        id: 'section-reflection',
        type: 'section_header',
        icon: '🪞',
        title: 'Reflection',
        subtitle: '~3 minutes',
      },
      {
        id: 'r-reflection',
        type: 'question',
        questionType: 'short_answer',
        prompt: 'Of everything you did in CapCut today — jump cuts, beat sync, auto-captions, music, hard cuts, text on screen — which single edit move had the biggest impact on how your video feels? Watch your rough cut once with that move, then once without it (mentally), and describe the difference. Then: what edit move did you try that didn\'t work, and what are you doing instead?',
        placeholder: 'Biggest-impact edit: ...\nWhat the video would feel like without it: ...\nThe move that didn\'t work: ...\nWhat I\'m doing instead: ...',
        difficulty: 'evaluate',
      },
    ],
  },
  'short-form-video-day4-polish-showcase': {
    mode: 'append',
    afterId: 'vocab',
    blocks: [
      {
        id: 'section-reflection',
        type: 'section_header',
        icon: '🪞',
        title: 'Reflection',
        subtitle: '~3 minutes',
      },
      {
        id: 'r-reflection',
        type: 'question',
        questionType: 'short_answer',
        prompt: 'Now that you\'ve seen your finished video on the projector AND watched everyone else\'s, what\'s ONE specific thing you would change if you had to shoot a brand-new video next week — a hook move, a shot you\'d skip, a caption style, a music choice, a length call? Why? And which classmate\'s video gave you that idea?',
        placeholder: 'What I\'d change next time: ...\nWhy: ...\nClassmate whose video showed me this: ...',
        difficulty: 'evaluate',
      },
    ],
  },
};

// ---- MED fix: callout style "note" -> "info" on short-form-video lessons ----
const CALLOUT_NOTE_LESSONS = [
  'short-form-video-day1-deconstruction',
  'short-form-video-day2-script-shoot',
  'short-form-video-day3-edit-capcut',
  'short-form-video-day4-polish-showcase',
];

// ---- MED fix: external_link URL replacements ----
// Map: lessonId -> { blockId: { url, title?, description? } | { remove: true } }
const EXTERNAL_LINK_FIXES = {
  'photo-essay-day2-curate-sequence': {
    'external-natgeo-yourshot': {
      url: 'https://www.nationalgeographic.com/photography',
      title: 'National Geographic — Photography',
      description: 'NatGeo\'s photography hub. Open a few stories and pay attention to how they sequence images — opener, build, payoff, close.',
    },
  },
  'infographic-day1-topic-data': {
    'link-njdoe': {
      url: 'https://www.nj.gov/education/schoolperformance/',
      title: 'NJDOE — School Performance Reports',
      description: 'New Jersey Department of Education school performance data. Useful when your topic is local (NJ schools, graduation, demographics).',
    },
  },
  'infographic-day2-design': {
    'link-iib-hit-song': {
      url: 'https://informationisbeautiful.net/visualizations/',
      title: 'Information Is Beautiful — Visualizations',
      description: 'Browse the full visualization gallery. Click any one and notice how it uses scale, color, and a single dominant stat to lead the eye.',
    },
  },
  'short-form-video-day3-edit-capcut': {
    'ext-capcut-tutorial': {
      url: 'https://www.capcut.com/tools',
      title: 'CapCut Tools — Editing Reference',
      description: 'CapCut\'s tools page. Find the feature you\'re using (split, transitions, captions, music) and skim the how-to before you fight the timeline.',
    },
    'ext-capcut-music': {
      url: 'https://www.capcut.com/tools',
      title: 'CapCut — Royalty-Free Music in the App',
      description: 'CapCut\'s in-app sound library is the safest source for school content — open the Audio tab inside CapCut for the up-to-date catalog.',
    },
    'ext-captions-best-practices': {
      url: 'https://www.capcut.com/tools/desktop-video-editor',
      title: 'CapCut Desktop — Auto-Captions Reference',
      description: 'CapCut\'s desktop editor page covers the auto-captions feature. Always proofread the output — names, slang, and bilingual mixes get errors.',
    },
  },
  'short-form-video-day4-polish-showcase': {
    'ext-capcut-effects': {
      url: 'https://www.capcut.com/tools',
      title: 'CapCut Tools — Effects + Transitions',
      description: 'CapCut\'s tools index. Use this to find effect and transition references — and remember: hard cuts win 90% of the time.',
    },
  },
  'psa-day1-topic-research': {
    'ext-afsp': {
      url: 'https://reportingonsuicide.org/',
      title: 'Reporting on Suicide — Safe Messaging Guidelines',
      description: 'The current canonical safe-messaging guidelines for suicide-related content. Read this BEFORE writing any PSA that touches mental health, self-harm, or 988.',
    },
  },
  'psa-day2-storyboard-design': {
    'ext-988-spot': {
      url: 'https://988lifeline.org/help-yourself/',
      title: '988 Lifeline — Help Yourself',
      description: 'Official 988 Lifeline resource hub. Use this as your reference for tone, language, and the 988 number itself if 988 appears in your PSA.',
    },
  },
  'psa-day3-production': {
    'ext-988-resources': {
      url: 'https://988lifeline.org/help-yourself/',
      title: '988 Lifeline — Help Yourself',
      description: 'Official 988 resource hub. Pull tone and language guidance directly from this page — never paraphrase from secondary sources.',
    },
    'ext-afsp-safe-messaging': {
      url: 'https://reportingonsuicide.org/',
      title: 'Reporting on Suicide — Safe Messaging Guidelines',
      description: 'Current canonical safe-messaging guidelines. Cross-check your PSA against these BEFORE production.',
    },
  },
};

// ---- main ----
async function fetchLesson(lessonId) {
  const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc(lessonId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error(`Lesson ${lessonId} not found`);
  return snap.data();
}

function applyReflectionFix(lessonId, blocks) {
  const override = REFLECTION_OVERRIDES[lessonId];
  if (!override) return { blocks, changed: false };
  if (override.mode === 'replace') {
    const idx = blocks.findIndex((b) => b.id === override.blockId);
    if (idx === -1) {
      console.warn(`  [WARN] ${lessonId}: block ${override.blockId} not found for replacement`);
      return { blocks, changed: false };
    }
    const newBlocks = blocks.slice();
    newBlocks[idx] = override.block;
    return { blocks: newBlocks, changed: true };
  }
  if (override.mode === 'append') {
    const idx = blocks.findIndex((b) => b.id === override.afterId);
    if (idx === -1) {
      console.warn(`  [WARN] ${lessonId}: block ${override.afterId} not found for append anchor`);
      return { blocks, changed: false };
    }
    // Avoid double-append if this script gets re-run
    const alreadyAppended = blocks.some((b) => b.id === 'r-reflection');
    if (alreadyAppended) {
      console.log(`  [INFO] ${lessonId}: r-reflection already exists, skipping append`);
      return { blocks, changed: false };
    }
    const newBlocks = [
      ...blocks.slice(0, idx + 1),
      ...override.blocks,
      ...blocks.slice(idx + 1),
    ];
    return { blocks: newBlocks, changed: true };
  }
  return { blocks, changed: false };
}

function applyCalloutFix(lessonId, blocks) {
  if (!CALLOUT_NOTE_LESSONS.includes(lessonId)) return { blocks, changed: false };
  let changed = false;
  const newBlocks = blocks.map((b) => {
    if (b.type === 'callout' && b.style === 'note') {
      changed = true;
      return { ...b, style: 'info' };
    }
    return b;
  });
  return { blocks: newBlocks, changed };
}

function applyExternalLinkFix(lessonId, blocks) {
  const fixes = EXTERNAL_LINK_FIXES[lessonId];
  if (!fixes) return { blocks, changed: false };
  let changed = false;
  const newBlocks = blocks.map((b) => {
    if (b.type === 'external_link' && fixes[b.id]) {
      const f = fixes[b.id];
      if (f.remove) {
        return null; // filtered below
      }
      changed = true;
      return {
        ...b,
        url: f.url,
        ...(f.title ? { title: f.title } : {}),
        ...(f.description ? { description: f.description } : {}),
      };
    }
    return b;
  }).filter(Boolean);
  if (newBlocks.length !== blocks.length) changed = true;
  return { blocks: newBlocks, changed };
}

async function processLesson(lessonId) {
  const data = await fetchLesson(lessonId);
  let blocks = data.blocks || [];
  const beforeLen = blocks.length;

  let totalChanged = false;

  const r1 = applyReflectionFix(lessonId, blocks); blocks = r1.blocks; totalChanged = totalChanged || r1.changed;
  const r2 = applyCalloutFix(lessonId, blocks); blocks = r2.blocks; totalChanged = totalChanged || r2.changed;
  const r3 = applyExternalLinkFix(lessonId, blocks); blocks = r3.blocks; totalChanged = totalChanged || r3.changed;

  if (!totalChanged) {
    console.log(`  [SKIP] ${lessonId}: no changes needed`);
    return { lessonId, changed: false };
  }

  const newLesson = { ...data, blocks };
  const result = await safeLessonWrite(db, 'digital-literacy', lessonId, newLesson);
  console.log(`  [WRITE] ${lessonId}: ${result.action} (preserved ${result.preserved} block IDs); blocks ${beforeLen} -> ${blocks.length}; reflection=${r1.changed} callout=${r2.changed} extlink=${r3.changed}`);
  return { lessonId, changed: true };
}

async function main() {
  const allLessonIds = new Set([
    ...Object.keys(REFLECTION_OVERRIDES),
    ...CALLOUT_NOTE_LESSONS,
    ...Object.keys(EXTERNAL_LINK_FIXES),
  ]);

  console.log(`Processing ${allLessonIds.size} lessons...`);
  const results = [];
  for (const id of allLessonIds) {
    try {
      results.push(await processLesson(id));
    } catch (e) {
      console.error(`  [ERR] ${id}: ${e.message}`);
      results.push({ lessonId: id, changed: false, error: e.message });
    }
  }
  const changed = results.filter((r) => r.changed).length;
  console.log(`\nDone. Modified ${changed}/${allLessonIds.size} lessons.`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
