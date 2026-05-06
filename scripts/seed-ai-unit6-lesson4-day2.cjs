/**
 * AI Literacy Unit 6, Lesson 4 — Day 2: Build + Submit
 * Order: 52.1 | Visible: false
 * Day 1 lives in seed-ai-unit6-lesson4.cjs (order 52).
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'building-with-ai-day2',
  title: 'Building with AI Day 2: Build + Submit',
  order: 52.1,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Ship a working AI-built artifact in a single class period',
      'Submit a shareable link that opens for anyone (not just you)',
      'Reflect on what AI did vs. what you (the human) had to decide',
    ]},
    { type: 'callout', id: '005fc5ef', style: 'info', content: '**Yesterday you picked your option, ran a smoke test, and locked in your build idea. Today you build it and ship it.** Keep your specific idea from yesterday in front of you — don\'t pivot mid-period.' },
    { type: 'question', id: 'fe238e25', questionType: 'short_answer',
      prompt: 'In one sentence: what are you building today, and what tool are you using?' },

    { type: 'section_header', id: 'sh-build', label: 'Build Session' },
    { type: 'callout', id: '26b408f6', style: 'warning', title: '🚨 IF YOU PICKED OPTION A — READ THIS BEFORE YOU OPEN GEMINI CANVAS', content: 'Paste THIS as your **very first message** in Gemini Canvas — before anything else:\n\n> Build this as a single, standalone HTML file. Use pure vanilla HTML, CSS, and JavaScript. Do NOT use React, JSX, or any external frameworks. Do NOT use Firebase or any backend databases. Do NOT use any external CDN scripts (no `<script src="https://...">`). All CSS and JavaScript must be inline within the HTML file. Use semantic HTML and mobile-first responsive CSS (flexbox or grid). If the app needs to save data, use the browser\'s localStorage. The final output must be 100% ready to copy and paste directly into a Google Sites "Embed Code" box.\n\nThen on the **next** message, describe what you actually want to build.\n\n**Without this prompt up front, Canvas will hand you React or JSX and your code will not paste into Google Sites.** This is the single most important habit for Option A — copy-paste it now.' },
    { type: 'activity', id: '38b4ea0a', title: 'Build It (25 minutes)', instructions: 'Head down, build. Save every prompt you write. Take screenshots along the way. Stop building at the 25-minute mark — you need time to publish and submit.' },
    { type: 'question', id: '50ebb7a6', questionType: 'short_answer',
      prompt: 'What did you build? Describe it in 2-3 sentences. What decisions did YOU make that the AI couldn\'t make for you?' },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Build' },
    { type: 'callout', id: '16dd2d08', style: 'info', content: '**Make sure your build is shareable before pasting the link.** Set the share permission to **"Anyone with the link can view"** (Google Sites, Canva, Gemini Gems, NotebookLM all have this option). If the link asks for sign-in or shows a 403 when I open it, the submission doesn\'t count.' },
    { type: 'question', id: '97d9772a', questionType: 'short_answer',
      prompt: 'Paste the link to your build here.\n\n- **Web app or game (Option A):** the published Google Sites URL.\n- **Chatbot (Option B):** the shared Gemini Gem link.\n- **Visual campaign (Option C):** a Canva share link to the design or folder.\n- **Music track (Option D):** a Google Drive folder containing the 3 MP3 clips with anyone-with-link access.\n\nDouble-check the link works in an incognito window before submitting.',
      placeholder: 'https://...' },

    { type: 'section_header', id: 'sh-limits', label: 'The Limits of No-Code' },
    { type: 'text', id: '071efbc1', content: `No-code AI tools are powerful but not unlimited:\n\n- Complex, custom functionality still requires real programming\n- AI-generated designs can look generic without a human aesthetic eye\n- You still need to understand the problem you\'re solving — AI can\'t do that for you\n- Scale, security, and reliability require technical expertise when stakes are high\n\nNo-code tools are best thought of as a way to go from idea to prototype fast — to test whether something is worth building properly.` },
    { type: 'question', id: '06739ca6', questionType: 'short_answer',
      prompt: 'Given what you built today, what would you need to learn or do differently if you wanted to turn it into something 1,000 people actually used? What does AI still not handle for you?' },
    { type: 'question', id: 'a17d6b65', questionType: 'short_answer',
      prompt: 'How does the ability to build things without coding change what kinds of careers might interest you? Does it open up anything you hadn\'t considered?' },
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
