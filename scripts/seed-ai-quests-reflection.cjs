/**
 * AI Literacy: AI Quests Post-Quest Reflection (Market Marshes + Dusky Dunes)
 * Wrapper lesson for Google Research's AI Quests activity.
 * Students complete both quests at https://research.google/ai-quests/intl/en_gb/map
 * then answer 4 reflection questions per quest here.
 *
 * Order: 66 | Visible: false (Luke flips when ready)
 *
 * IMPORTANT: The 8 short_answer block IDs below are preserved from the initial seed.
 * Do NOT regenerate them — students' grades will be keyed to these IDs.
 * Writes via safeLessonWrite (append-only, preserves existing IDs on matched blocks).
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj',
  'DacjJ93vUDcwqc260OP3',
  'M2MVSXrKuVCD9JQfZZyp',
  'fUw67wFhAtobWFhjwvZ5',
];

// Preserved short-answer block IDs (read from Firestore before rewrite).
// Order matters: Marshes Q1-Q4, then Dunes Q1-Q4.
const SA_IDS = {
  marshes: ['b6224d6a', 'f256298a', '436bc767', '77e829e2'],
  dunes:   ['4f7b5eaf', '957d67f9', '73419114', '4ad3ca5e'],
};

const REFLECTION_QUESTIONS = [
  'What real-world problem is this addressing?',
  'How did you use AI to help solve this problem?',
  'What issues did you encounter along the way?',
  'Having solved this problem digitally, what advice would you give to people who are trying to make this better in the real world?',
];

// Scaffolds per question — short sentence stems / thinking prompts.
// Scaffolds are intentionally quest-agnostic — students discover the actual
// problem, characters, and domain inside the quest. Don't spoil the setup here.
const MARSHES_SCAFFOLDS = [
  'Think about who was affected and what was at stake. Who would it help in the real world if this problem got solved, and why does it matter beyond the game?',
  'Walk through your actual process. What data did you work with, how did you prepare it, what choices did you make when building the model, and did you have to iterate when the first attempt fell short?',
  'Where did you get stuck? A decision that went wrong, data that did not cooperate, a model that kept missing the mark, something the quest explained poorly? Be specific about the moment it got hard.',
  'Solving it on screen is not the same as solving it in the real world. What would an actual community or organization need that the game did not have to worry about — trust, timing, infrastructure, cost, access? Pick one and explain.',
];

const DUNES_SCAFFOLDS = [
  'Think about who was affected and what was at stake. Who would benefit in the real world if this problem got solved, and why does it matter?',
  'Describe how you trained and tested your model. What choices did the quest push you to make about your approach, and why did those choices matter for whether the model worked?',
  'What went wrong and what did you have to fix? Pick the friction point that stood out most and describe what you actually did to get past it.',
  'A working solution inside the quest is very different from a working solution in the real world. What would a real deployment actually need — people, devices, trust, training, follow-up? What would you prioritize first?',
];

const IMG_HERO    = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/general/ai-quests-hero.png';
const IMG_MARSHES = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/general/ai-quests-market-marshes-hero.jpg';
const IMG_DUNES   = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/general/ai-quests-dusky-dunes-hero.jpg';

function makeLesson() {
  return {
    id: 'ai-quests-reflection',
    title: 'AI Quests',
    order: 66,
    visible: false,
    dueDate: '2026-04-17',
    gradesReleased: true,
    blocks: [
      // ─── Opening ────────────────────────────────────────────────
      { type: 'section_header', id: 'sh-overview', label: 'AI Quests' },
      { type: 'image', id: id(), url: IMG_HERO,
        width: 1458, height: 1444,
        alt: 'AI Quests — a stylized globe set in space with the title AI QUESTS and an Accept Mission button, from Google Research Labs',
        caption: 'AI Quests — built by Google Research Labs.' },
      { type: 'text', id: id(), content:
`Today you're stepping into the boots of a Google researcher inside **AI Quests** — an interactive world where real AI problems are wrapped inside story-driven missions. You'll visit two places today, starting with **Market Marshes**.

**Here's the plan for Quest A:**
1. Open the Quests map using the button below.
2. Click into **Market Marshes**. Explore freely — try things, see what breaks, pay attention to what the game teaches you about AI along the way.
3. When you finish, come back here and answer the four reflection questions for Quest A.

No right or wrong answers on the reflection. But one-word answers won't get credit — be specific, reference the actual problem you worked on, and describe the AI steps you actually took.` },
      { type: 'external_link', id: id(),
        icon: '🧭',
        title: 'AI Quests',
        description: 'Click through to the AI Quests map and open **Market Marshes**. Come back here when you finish.',
        url: 'https://research.google/ai-quests/intl/en_gb/map',
        buttonLabel: 'Open AI Quests',
        openInNewTab: true },
      { type: 'objectives', id: 'obj-1', items: [
        'Experience how AI tools help solve real-world problems through two guided quests',
        'Identify the friction points and limits of AI-assisted problem solving',
        'Translate a digital solution into practical advice for real-world implementation',
      ]},

      // ─── Quest A: Market Marshes ────────────────────────────────
      { type: 'section_header', id: 'sh-marshes', label: 'Quest A: Market Marshes' },
      { type: 'image', id: id(), url: IMG_MARSHES,
        alt: 'Editorial illustration of a marsh landscape at dawn, reeds and winding waterways stretching to the horizon',
        caption: 'Market Marshes.' },
      { type: 'callout', id: id(), variant: 'info', content:
`**Finished Market Marshes?** Answer the four questions below before moving on to Dusky Dunes. The same four questions show up for both quests, but your answers should be different each time — draw on what you actually saw and did in *this* quest.` },

      { type: 'callout', id: id(), variant: 'tip', content: MARSHES_SCAFFOLDS[0] },
      { type: 'question', id: SA_IDS.marshes[0], questionType: 'short_answer',
        prompt: `**Market Marshes — Q1.** ${REFLECTION_QUESTIONS[0]}` },

      { type: 'callout', id: id(), variant: 'tip', content: MARSHES_SCAFFOLDS[1] },
      { type: 'question', id: SA_IDS.marshes[1], questionType: 'short_answer',
        prompt: `**Market Marshes — Q2.** ${REFLECTION_QUESTIONS[1]}` },

      { type: 'callout', id: id(), variant: 'tip', content: MARSHES_SCAFFOLDS[2] },
      { type: 'question', id: SA_IDS.marshes[2], questionType: 'short_answer',
        prompt: `**Market Marshes — Q3.** ${REFLECTION_QUESTIONS[2]}` },

      { type: 'callout', id: id(), variant: 'tip', content: MARSHES_SCAFFOLDS[3] },
      { type: 'question', id: SA_IDS.marshes[3], questionType: 'short_answer',
        prompt: `**Market Marshes — Q4.** ${REFLECTION_QUESTIONS[3]}` },

      // ─── Quest B: Dusky Dunes ───────────────────────────────────
      { type: 'section_header', id: 'sh-dunes', label: 'Quest B: Dusky Dunes' },
      { type: 'image', id: id(), url: IMG_DUNES,
        alt: 'Editorial illustration of a desert landscape at dusk, rolling sand dunes stretching to the horizon under a soft sky',
        caption: 'Dusky Dunes.' },
      { type: 'text', id: id(), content:
`Nice work on Marshes. Time for your second quest.

**Here's the plan for Quest B:**
1. Open the Quests map again using the button below.
2. Click into **Dusky Dunes**. Explore the same way — try things, pay attention to what the game teaches you, notice where it differs from Marshes.
3. When you finish, come back here and answer the four reflection questions for Quest B.` },
      { type: 'external_link', id: id(),
        icon: '🧭',
        title: 'AI Quests',
        description: 'Back to the map — this time open **Dusky Dunes**. Come back here when you finish.',
        url: 'https://research.google/ai-quests/intl/en_gb/map',
        buttonLabel: 'Open AI Quests',
        openInNewTab: true },
      { type: 'callout', id: id(), variant: 'warn', content:
`**Finished Dusky Dunes?** Same four questions again — but don't copy-paste your Marshes answers. The problem, the data, the stakes, and the fixes were all different here. Be specific to Dunes.` },

      { type: 'callout', id: id(), variant: 'tip', content: DUNES_SCAFFOLDS[0] },
      { type: 'question', id: SA_IDS.dunes[0], questionType: 'short_answer',
        prompt: `**Dusky Dunes — Q1.** ${REFLECTION_QUESTIONS[0]}` },

      { type: 'callout', id: id(), variant: 'tip', content: DUNES_SCAFFOLDS[1] },
      { type: 'question', id: SA_IDS.dunes[1], questionType: 'short_answer',
        prompt: `**Dusky Dunes — Q2.** ${REFLECTION_QUESTIONS[1]}` },

      { type: 'callout', id: id(), variant: 'tip', content: DUNES_SCAFFOLDS[2] },
      { type: 'question', id: SA_IDS.dunes[2], questionType: 'short_answer',
        prompt: `**Dusky Dunes — Q3.** ${REFLECTION_QUESTIONS[2]}` },

      { type: 'callout', id: id(), variant: 'tip', content: DUNES_SCAFFOLDS[3] },
      { type: 'question', id: SA_IDS.dunes[3], questionType: 'short_answer',
        prompt: `**Dusky Dunes — Q4.** ${REFLECTION_QUESTIONS[3]}` },

      // ─── Closing synthesis ──────────────────────────────────────
      { type: 'section_header', id: 'sh-wrap', label: 'One Last Thing' },
      { type: 'callout', id: id(), variant: 'success', content:
`**Notice the pattern.** The two quests looked like completely different problems on the surface — different places, different people, different stakes. But underneath, the work was the same: get the right data, clean it, train a model, test it, iterate when it fails, then worry about whether it actually helps real people in the real world. That pattern shows up in almost every serious AI project you'll ever see.` },
      { type: 'text', id: id(), content:
`Save your work. When you're ready, click **Complete Lesson** below. Nice work reflecting.` },
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
}

async function main() {
  for (const courseId of COURSE_IDS) {
    const lesson = makeLesson();
    const result = await safeLessonWrite(db, courseId, lesson.id, lesson);
    console.log(`${courseId.substring(0,8)} → ${result.action} (preserved ${result.preserved} IDs)`);
  }
  const lesson = makeLesson();
  console.log(`\nDue: ${lesson.dueDate} | Visible: ${lesson.visible} | gradesReleased: ${lesson.gradesReleased}`);
  console.log(`Flip visible:true in Firestore when ready.`);
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
