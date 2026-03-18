/**
 * AI Literacy Unit 6, Lesson 4: Building with AI (No-Code Tools)
 * Order: 52 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'building-with-ai',
  title: 'Building with AI: Create Something Real Without Code',
  order: 52,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Identify no-code AI tools for building real products',
      'Use at least one AI tool to create a functional artifact',
      'Evaluate when AI-assisted building adds value vs. when it produces shallow results',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If you could build any app, website, or tool right now — with no coding required — what would you make? Who would it help?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: The No-Code Revolution' },
    { type: 'text', id: id(), content: `For decades, building software required years of programming knowledge. That\'s changed dramatically.\n\n**What no-code AI tools can do today:**\n\n**Website/App Building**\n- Framer, Webflow, Wix ADI — describe a website and AI builds it. Real, deployable, no code.\n- Bubble — drag-and-drop app builder with AI logic assistance\n\n**Automation**\n- Zapier, Make (formerly Integromat) — connect apps and automate tasks using natural language rules\n\n**Content & Design**\n- Canva AI — describe a design and get it generated; resize for any platform automatically\n- Adobe Firefly — professional-grade image generation integrated into design tools\n\n**Data & Analysis**\n- Notion AI, Coda — turn natural language into databases, formulas, and summaries\n- Google Sheets + Gemini — write formulas and analyze data by describing what you want\n\n**Chatbots & Assistants**\n- Poe, Character.AI, Claude Projects — build custom AI assistants with specific knowledge and personalities` },
    { type: 'callout', id: id(), content: '**The Shift:** A 15-year-old with a laptop and internet access can now build and ship a real product to real users. The bottleneck is no longer technical skill — it\'s ideas, judgment, and understanding what people actually need.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'What has most fundamentally changed about building software/products with AI no-code tools?',
      options: [
        'Products are now higher quality because AI never makes mistakes',
        'The barrier to entry has dropped — technical skill is no longer required to create functional software',
        'Anyone can now become a professional programmer instantly',
        'Products built with AI don\'t require any human decisions',
      ], correct: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: Build Something' },
    { type: 'text', id: id(), content: `Today you\'re going to build something real. Choose one of these options based on what sounds most interesting:\n\n**Option A — Website:** Use Framer or Canva to build a one-page website for something you care about. A club, a cause, your portfolio, a fictional business.\n\n**Option B — Chatbot:** Use Poe or a Claude Project to build a custom AI assistant. Give it a specific purpose, a personality, and knowledge it should have. Test it with real questions.\n\n**Option C — Automation:** Use Zapier (free tier) to automate one real thing in your life — a notification, a data collection form, a scheduled reminder.\n\n**Option D — Design:** Use Canva AI to create a complete set of social media graphics for a cause, event, or project you care about. At least 3 pieces, consistent visual identity.` },
    { type: 'activity', id: id(), title: 'Build Session (25 minutes)', instructions: 'Pick your option and build. Document what you\'re making and why. Take a screenshot of what you created.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What did you build? Describe it. What decisions did YOU make that the AI couldn\'t make for you?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: The Limits of No-Code' },
    { type: 'text', id: id(), content: `No-code AI tools are powerful but not unlimited:\n\n- Complex, custom functionality still requires real programming\n- AI-generated designs can look generic without a human aesthetic eye\n- You still need to understand the problem you\'re solving — AI can\'t do that for you\n- Scale, security, and reliability require technical expertise when stakes are high\n\nNo-code tools are best thought of as a way to go from idea to prototype fast — to test whether something is worth building properly.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Given what you built today, what would you need to learn or do differently if you wanted to turn it into something 1,000 people actually used? What does AI still not handle for you?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'How does the ability to build things without coding change what kinds of careers might interest you? Does it open up anything you hadn\'t considered?' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
    const snap = await ref.get();
    if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
    await ref.set(lesson);
    console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
