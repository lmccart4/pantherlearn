/**
 * AI Literacy Unit 6, Lesson 4 — Day 1: Pick + First Generation
 * Order: 52 | Visible: false
 * Day 2 lives in seed-ai-unit6-lesson4-day2.cjs (order 52.1).
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'building-with-ai',
  title: 'Building with AI Day 1: Pick Your Build + First Generation',
  order: 52,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Identify which AI tool fits which kind of build',
      'Pick a build option and lock it in for tomorrow',
      'Run a smoke test on your chosen tool — generate ONE working output before you leave',
    ]},
    { type: 'question', id: '97a266bf', questionType: 'short_answer',
      prompt: 'If you could build any app, website, or tool right now — with no coding required — what would you make? Who would it help?' },

    { type: 'section_header', id: 'sh-part1', label: 'Part 1: The No-Code Revolution' },
    { type: 'text', id: '9a81ad02', content: `For decades, building software required years of programming knowledge. That\'s changed dramatically.\n\n**What you can build today with the tools on your school account — no code required:**\n\n**Apps, Games, and Sites**\n- **Gemini Canvas** — describe an app or game in plain English, get working HTML/CSS/JS in a side panel. Iterate by talking to it ("make the buttons blue," "add a high-score screen"). Built into your @paps.net Google account.\n- **Google Sites** — paste the HTML from Canvas into an Embed Code widget, publish, get a shareable URL.\n\n**Chatbots and Assistants**\n- **Gemini Gems** — build a custom AI assistant inside Gemini in about 5 minutes. Give it a name, a personality, an instruction set, and (optionally) reference files. Share with anyone on @paps.net.\n\n**Visual Design and Video**\n- **Canva for Education + Magic Media** — generate AI images, graphics, video clips, and 3D renders inside the Canva canvas. Required: accept Mr. McCarthy\'s classroom invitation for the higher Education-plan limits.\n- **Nano Banana 2** (inside Gemini) — high-quality image generation when you need standalone images you can drop into other designs.\n\n**Music and Audio**\n- **Gemini Music (Lyria 3)** — 30-second original MP3 clips from a text prompt. 10/day on @paps.net.\n- **NotebookLM** — upload sources, get a podcast-style audio overview with two synthetic hosts having a real conversation about your material.\n\n**Animation and Short Video**\n- **Canva for Education + Magic Media** — Text-to-Video clips you can edit inside Canva\'s timeline alongside still images and graphics.\n\n**Research and Synthesis**\n- **Gemini Deep Research** — multi-source research reports with citations. Useful as the starting input for any build that needs grounded facts.` },
    { type: 'callout', id: '4015acb8', content: '**The Shift:** A 15-year-old with a laptop and internet access can now build and ship a real product to real users. The bottleneck is no longer technical skill — it\'s ideas, judgment, and understanding what people actually need.' },
    { type: 'question', id: '4200046b', questionType: 'multiple_choice',
      prompt: 'What has most fundamentally changed about building software/products with AI no-code tools?',
      options: [
        'Products are now higher quality because AI never makes mistakes',
        'The barrier to entry has dropped — technical skill is no longer required to create functional software',
        'Anyone can now become a professional programmer instantly',
        'Products built with AI don\'t require any human decisions',
      ], correctIndex: 1 },

    { type: 'section_header', id: 'sh-pick', label: 'Pick a Build Type' },
    { type: 'text', id: '6fa16ea4', content: `Pick **one** option. Tomorrow you\'ll spend the full period building it — today you just lock in your direction and confirm the tool actually works for you.\n\n**Option A — Web App or Game:** Use **Gemini Canvas** to vibe-code a single-page HTML/CSS/JS app — a quiz, a calculator, a mini-game, a tool you wish existed. When it works, copy the code and paste it into a **Google Sites** page using the Embed Code widget to publish it.\n\n**Option B — Chatbot:** Build a **custom Gem** inside Gemini — give it a name, a personality, and a 200+ word instruction set. Test it with 5 realistic user questions and share it with a classmate on @paps.net.\n\n**Option C — Visual Campaign:** Use **Canva for Education + Magic Media** to create a multi-asset campaign for a cause, club, or event you care about. At least 3 cohesive pieces (poster + social post + short video clip). Consistent visual identity across all of them.\n\n**Option D — Music Track:** Use **Gemini Music (Lyria 3)** to generate a coherent set of 3 distinct 30-sec MP3 clips that share a through-line — same vibe, same instrumentation, but different moods (intro / build / payoff).` },
    { type: 'callout', id: '1131fec2', style: 'warning', title: '🚨 IF YOU PICKED OPTION A — READ THIS BEFORE YOU OPEN GEMINI CANVAS', content: 'Paste THIS as your **very first message** in Gemini Canvas — before anything else:\n\n> Build this as a single, standalone HTML file. Use pure vanilla HTML, CSS, and JavaScript. Do NOT use React, JSX, or any external frameworks. Do NOT use Firebase or any backend databases. Do NOT use any external CDN scripts (no `<script src="https://...">`). All CSS and JavaScript must be inline within the HTML file. Use semantic HTML and mobile-first responsive CSS (flexbox or grid). If the app needs to save data, use the browser\'s localStorage. The final output must be 100% ready to copy and paste directly into a Google Sites "Embed Code" box.\n\nThen on the **next** message, describe what you actually want to build.\n\n**Without this prompt up front, Canvas will hand you React or JSX and your code will not paste into Google Sites.** This is the single most important habit for Option A — copy-paste it now.' },

    { type: 'section_header', id: 'sh-tools', label: 'Recommended Tools' },
    { type: 'callout', id: '69e3792c', style: 'info', content: 'These are the tools confirmed working on free tier in May 2026 for PAPS 9th-grade accounts. Sign in with `lucamccarthy@paps.net` (your school account) wherever Google sign-in is offered.' },
    { type: 'external_link', id: '30b5968e',
      url: 'https://gemini.google.com',
      title: 'Gemini',
      description: 'Your primary surface — covers Canvas (vibe-code HTML/CSS/JS apps and games, ~100 Pro prompts/day), Music with Lyria 3 (30-sec MP3 clips, 10/day), Deep Research (multi-source reports, ~5/day), and Nano Banana 2 image generation. Switch to Fast Mode before generating images or music so you don\'t burn Pro prompts on media.' },
    { type: 'external_link', id: 'c435e46c',
      url: 'https://gemini.google.com/gems/view',
      title: 'Gemini Gems',
      description: 'Build a custom AI assistant inside Gemini in about 5 minutes — give it a name, a personality, a set of instructions, and (optionally) reference files it should know. Share the Gem with anyone on @paps.net via the Share button. No code, no SMS verification, fully on your school account.' },
    { type: 'external_link', id: '4646aadb',
      url: 'https://sites.google.com',
      title: 'Google Sites',
      description: 'Deploy step for any Canvas-built app or interactive site. Drop an Embed Code widget on a page, paste your HTML, publish — the page URL is your shareable build link.' },
    { type: 'external_link', id: '5a1d3432',
      url: 'https://notebooklm.google.com',
      title: 'NotebookLM',
      description: 'Podcast-style audio overviews from sources you upload. Two synthetic hosts have a real conversation about your material. Free, 3 audio overviews/day, exports as WAV — convert to MP3 with cloudconvert.com if needed.' },
    { type: 'external_link', id: 'fbd8eaa1',
      url: 'https://canva.com/education',
      title: 'Canva for Education + Magic Media',
      description: 'Visual design + AI generation in one tool. Magic Media generates images, graphics, video, and 3D renders inside the canvas. **Required first step:** accept Mr. McCarthy\'s classroom invitation — Education plan limits are much higher than personal Canva caps.' },

    { type: 'section_header', id: 'sh-smoke', label: 'Tool Smoke Test' },
    { type: 'callout', id: 'afd2e556', style: 'tip', content: '**The point of today:** confirm your tool actually works on your account before you invest a full period in it tomorrow. Don\'t build the whole thing yet — just produce ONE test output and make sure you can save or share it. **Option A students: did you paste the pre-prompt callout (above) into Canvas FIRST? If not, scroll back up.**' },
    { type: 'activity', id: 'a90ddbba', title: 'Smoke Test (15 minutes)', instructions: 'Open the tool for the option you picked. Run ONE small generation: a 3-question quiz in Canvas (paste the pre-prompt FIRST), a 50-word Gem instruction set, one Magic Media image, or one 30-sec Gemini Music clip. Confirm you can download or share the output. Take a screenshot as proof.' },
    { type: 'question', id: 'dff246fa', questionType: 'multiple_choice',
      prompt: 'Which option did you pick for your build?',
      options: [
        'A — Web App or Game (Gemini Canvas + Google Sites)',
        'B — Chatbot (Gemini Gem)',
        'C — Visual Campaign (Canva for Education + Magic Media)',
        'D — Music Track (Gemini Music — 3 clips)',
      ],
      allCorrect: true },
    { type: 'question', id: '0454c52a', questionType: 'short_answer',
      prompt: 'Describe the test output you generated. What did the tool make? Did anything not work the way you expected? (One paragraph is fine.)' },
    { type: 'question', id: 'ff4b0c88', questionType: 'short_answer',
      prompt: 'What\'s your actual build idea for tomorrow? Be specific. "A quiz" is not specific. "An 8-question \'which Marvel hero are you\' quiz with a points-based result screen and a custom image for each result" is specific.' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
    await ref.set(lesson);
    console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
