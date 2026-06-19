// seed-phys-u5-l13-evaluating-safety-claims.cjs — Unit 5 Lesson 13: evaluate media claims about 5G/radiation safety (summative).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l13-evaluating-safety-claims.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: comparison graphic — ionizing vs. non-ionizing radiation with energy-per-photon scale (Gemini, JSON-first).

const lesson = {
  id: 'phys-u5-l13-evaluating-safety-claims',
  title: 'Evaluating Radiation Safety Claims',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 513,
  visible: false,
  dueDate: '2026-10-22', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🔎', title: 'Evaluating Radiation Safety Claims', subtitle: 'Unit 5 · Lesson 13 — Summative' }),

    k.objectives([
      'Distinguish evidence, correlation, and causation in media claims',
      'Use frequency and intensity to evaluate a radiation-safety argument',
      'Write a sourced evaluation using the CER format',
    ]),

    k.text(
      "You have probably seen headlines, videos, or social-media posts about cell phones, 5G towers, and WiFi making " +
      "people sick. Some of those claims are based on real studies. Others misread correlation as causation, ignore " +
      "the difference between frequency and intensity, or cite sources that are not reliable. Today you learn to tell " +
      "them apart.",
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Two Questions That Cut Through the Noise',
      content:
        "- **What is the frequency?** Ionizing radiation (UV, X-rays, gamma) has enough energy per photon to damage " +
        "DNA. Non-ionizing radiation (radio, microwave, visible light, most 5G) does not.\n" +
        "- **What is the intensity / exposure?** A high-intensity source close to your body for a long time delivers " +
        "more energy than a low-intensity source far away.",
    }),

    k.text(
      "A claim that '5G causes cancer' needs two things to be convincing: (1) evidence that people exposed to 5G " +
      "develop cancer at a higher rate than similar people who were not exposed, and (2) a physical mechanism that " +
      "explains how 5G photons could damage cells. So far, major health agencies have found no consistent evidence " +
      "at the frequencies and power levels used for consumer devices.",
    ),

    k.externalLink({
      icon: '📰',
      title: 'Sample Claim Set A — "5G and Health"',
      description: 'A mix of reputable and questionable sources for class evaluation.',
      url: 'https://www.who.int/news-room/questions-and-answers/item/radiation-5g-mobile-networks-and-health',
      buttonLabel: 'Open WHO Q&A',
    }),

    k.externalLink({
      icon: '📰',
      title: 'Sample Claim Set B — FCC Radio Frequency Safety',
      description: 'Official U.S. guidance on RF exposure limits and how they are set.',
      url: 'https://www.fcc.gov/radiofrequency-safety',
      buttonLabel: 'Open FCC',
    }),

    k.mc({
      prompt: 'A blog post says, "Cancer rates rose in the same year 5G towers were installed, so 5G must cause cancer." What is the main flaw?',
      options: [
        'The claim ignores the wavelength of 5G signals',
        'The claim confuses correlation with causation',
        'The claim assumes all radiation is ionizing',
        'The claim uses too many decimal places',
      ],
      correctIndex: 1,
      explanation:
        "Two trends happening at the same time does not prove one caused the other. Controlled studies and a plausible " +
        "physical mechanism are needed to support a causation claim.",
      difficulty: 'evaluate',
    }),

    k.evidenceUpload({
      title: 'Source Evidence',
      instructions:
        'Find ONE media claim about 5G or WiFi safety. Upload a screenshot or paste the headline and source. Then ' +
        'evaluate it in the CER box below.',
      prompt: 'Headline / source of the claim you are evaluating:',
    }),

    k.cer({
      prompt:
        'Evaluate the radiation-safety claim you found. Is it supported, unsupported, or misleading? Use frequency, intensity, and evidence quality in your answer.',
      claimHint: 'State whether the claim is supported, unsupported, or misleading.',
      evidenceHint: 'Cite the source, its frequency/intensity claims, and any actual study or data it references.',
      reasoningHint: 'Explain how the physics of ionization, exposure, and correlation-vs-causation affect your evaluation.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u5-l13-cp',
      title: 'Claim Evaluation — Teacher Score',
      prompt:
        "Mr. McCarthy will read your source evaluation and score it on the 3-dimensional rubric below. He is looking " +
        "for a clear judgment, specific evidence from the source, and reasoning that uses the physics ideas from this " +
        "unit (frequency, intensity, ionization, correlation vs. causation).",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Radiation Safety Claim Evaluation Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u5-l13-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
