/**
 * AI Literacy — "When Should AI Think For You?"
 * Order: 64 | Visible: false
 * Source: drafts/lesson-plans/2026-03-25-ai-literacy-when-should-ai-think-for-you.md
 * NYC traffic-light framework + Anthropic 81K-user cognitive atrophy survey
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj', // P4
  'DacjJ93vUDcwqc260OP3', // P5
  'M2MVSXrKuVCD9JQfZZyp', // P7
  'fUw67wFhAtobWFhjwvZ5', // P9
];

const lesson = {
  title: 'When Should AI Think For You?',
  course: 'AI Literacy',
  unit: 'Society & Ethics',
  questionOfTheDay: "Where do YOU draw the line between helpful AI and thinking for yourself?",
  order: 64,
  visible: false,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  blocks: [

    // ── WARM UP ──────────────────────────────────────────────────────────────
    {
      id: 'section-warmup',
      type: 'section_header',
      title: 'Warm Up',
      subtitle: '~5 min',
      icon: '🧠'
    },
    {
      id: 'callout-poll',
      type: 'callout',
      style: 'question',
      icon: '🗳️',
      content: "**Quick poll — be honest:**\n\nIf AI could do your homework perfectly — same quality you'd produce, zero effort — would you let it?\n\n- Always\n- Sometimes\n- Only for boring stuff\n- Never\n\n*No judgment. We're going to come back to your answer at the end.*"
    },
    {
      id: 'callout-stat',
      type: 'callout',
      style: 'insight',
      icon: '📊',
      content: "**Here's something wild:** In a survey of 81,000 AI users across 159 countries, **educators reported cognitive decline at 2.5–3x the rate of average users.** The people teaching you how to think are the most worried about losing the ability themselves.\n\nToday we're going to figure out where the line is — when AI helps you think *better*, and when it stops you from thinking at all."
    },
    {
      id: 'objectives',
      type: 'objectives',
      title: 'Learning Objectives',
      items: [
        'Categorize AI tasks using a risk-based traffic-light framework (green/yellow/red)',
        'Evaluate when AI use enhances thinking vs. when it replaces thinking',
        'Analyze survey data on cognitive atrophy and draw evidence-based conclusions',
        'Create a personal AI policy with boundaries for your own use'
      ]
    },

    // ── THE TRAFFIC-LIGHT FRAMEWORK ──────────────────────────────────────────
    {
      id: 'section-traffic-light',
      type: 'section_header',
      title: 'The Traffic-Light Framework',
      subtitle: '~10 min',
      icon: '🚦'
    },
    {
      id: 'text-traffic-intro',
      type: 'text',
      content: "New York City — the largest school district in the US — needed a way to help teachers and students figure out when AI is okay to use and when it's not. Their solution? A **traffic-light framework** that sorts AI tasks into three categories based on risk.\n\nThis isn't just for schools. It works for *any* situation where you're deciding whether to hand a task to AI."
    },
    {
      id: 'callout-green',
      type: 'callout',
      style: 'insight',
      icon: '🟢',
      content: "**GREEN — Go for it.** Low-risk tasks where AI saves time without replacing important thinking.\n\n- Brainstorming ideas (you still pick the best ones)\n- Drafting non-critical messages (casual emails, social posts)\n- Summarizing long articles to decide if they're worth reading\n- Generating practice quiz questions for studying\n- Organizing notes or creating outlines\n\n**The key:** You stay in the driver's seat. AI handles the grunt work."
    },
    {
      id: 'callout-yellow',
      type: 'callout',
      style: 'insight',
      icon: '🟡',
      content: "**YELLOW — Proceed with caution.** Medium-risk tasks where AI can help, but a human MUST review the output.\n\n- Analyzing data to spot patterns (human checks conclusions)\n- Translating important documents (human verifies accuracy)\n- Adapting materials for students with disabilities (specialist reviews)\n- Drafting professional communications (human edits tone and content)\n- Research assistance (human verifies sources)\n\n**The key:** AI drafts, humans decide. Never auto-send, auto-publish, or auto-trust."
    },
    {
      id: 'callout-red',
      type: 'callout',
      style: 'insight',
      icon: '🔴',
      content: "**RED — Full stop.** High-risk tasks where AI should NOT be the decision-maker.\n\n- **Grading student work** (affects real GPAs and futures)\n- **Writing IEP/504 plans** (legal documents that protect vulnerable students)\n- **Discipline decisions** (suspension, expulsion — life-altering)\n- **Academic placement** (which track a student goes into)\n- **Using student data to train AI models** (privacy violation)\n- **Medical diagnoses** (life-or-death stakes)\n- **Legal judgments** (criminal sentencing, custody)\n\n**The key:** These decisions shape people's lives. They require human judgment, empathy, and accountability."
    },
    {
      id: 'text-traffic-principle',
      type: 'text',
      content: "Notice the pattern: as the **stakes go up**, AI's role should go **down**. It's not about whether AI *can* do something — it's about whether AI *should* be the one doing it.\n\nA good rule of thumb: **the more a mistake would hurt someone, the less AI should be making the call.**"
    },

    // ── SORT IT ──────────────────────────────────────────────────────────────
    {
      id: 'section-sorting',
      type: 'section_header',
      title: 'Sort It: Green, Yellow, or Red?',
      subtitle: '~8 min',
      icon: '🎯'
    },
    {
      id: 'text-sorting-intro',
      type: 'text',
      content: "Time to test your judgment. For each scenario, decide: is this a **green** (go for it), **yellow** (proceed with caution), or **red** (full stop) use of AI?"
    },
    {
      id: 'mc-sort-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "You're writing a birthday message for a casual friend and ask AI to help you come up with something funny. What color?",
      options: [
        'Red — AI should never write personal messages',
        'Yellow — you need a specialist to review it first',
        "Green — low stakes, you'll still pick what to send",
        'Yellow — birthday messages require human empathy'
      ],
      correctIndex: 2,
      explanation: "Green. It's a low-stakes, casual message. You're using AI to brainstorm, and you'll still choose what to actually send. No one's life is affected by a birthday text."
    },
    {
      id: 'mc-sort-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "A company uses AI to screen job applications and automatically reject candidates who don't match its algorithm's profile. What color?",
      options: [
        "Red — this decision shapes people's livelihoods and AI bias is well-documented",
        'Green — it saves HR departments tons of time',
        "Yellow — as long as the AI is accurate, it's fine",
        'Green — companies can run their hiring however they want'
      ],
      correctIndex: 0,
      explanation: "Red. Hiring decisions directly affect people's lives and income. AI hiring tools have repeatedly been shown to discriminate based on race, gender, and disability."
    },
    {
      id: 'mc-sort-3',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "A student uses AI to translate their college application essay from Spanish to English because English isn't their first language. What color?",
      options: [
        'Red — college apps should be 100% human-written',
        'Green — translation is just a mechanical task',
        'Red — this is cheating on the application',
        "Yellow — translation is okay, but someone should review to make sure it captures the student's voice"
      ],
      correctIndex: 3,
      explanation: "Yellow. Translation isn't cheating — the student still wrote the essay. But AI translation can miss tone, cultural nuance, and the student's unique voice. A human review catches what the algorithm doesn't."
    },
    {
      id: 'mc-sort-4',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "You ask AI to recommend a movie to watch on Friday night based on movies you've liked before. What color?",
      options: [
        'Yellow — AI recommendations create filter bubbles',
        'Green — extremely low stakes, worst case you watch a bad movie',
        "Red — AI shouldn't control your entertainment choices",
        'Yellow — you should research movies yourself'
      ],
      correctIndex: 1,
      explanation: "Green. The worst-case scenario is you waste two hours on a bad movie. That's about as low-stakes as it gets."
    },
    {
      id: 'mc-sort-5',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'A hospital uses AI to diagnose patients in the emergency room without a doctor reviewing the results. What color?',
      options: [
        'Red — medical diagnosis without human review is dangerous',
        'Yellow — AI is actually very good at medical diagnosis',
        'Green — AI can process data faster than any doctor',
        "Yellow — it's fine as long as the AI has been well-trained"
      ],
      correctIndex: 0,
      explanation: "Red, absolutely. AI can *assist* doctors (yellow), but making diagnoses *without* human review puts lives at risk."
    },
    {
      id: 'mc-sort-6',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "A teacher uses AI to generate a first draft of report card comments, then personally edits each one before sending to parents. What color?",
      options: [
        'Red — report cards are too important for AI',
        "Green — the teacher is still writing the comments",
        'Red — parents deserve fully human-written feedback',
        "Yellow — AI drafts the starting point, but the teacher's review and edits are essential"
      ],
      correctIndex: 3,
      explanation: "Yellow. The teacher is using AI to save time on the initial draft, but personally reviews and edits every comment. The human is still the decision-maker."
    },
    {
      id: 'mc-sort-7',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'You use AI to spell-check and fix grammar in an email to your group project partner about meeting times. What color?',
      options: [
        'Yellow — even casual emails need careful review',
        "Red — AI shouldn't edit your writing at all",
        "Green — fixing typos in a casual email is about as low-risk as it gets",
        'Yellow — grammar tools can change your meaning'
      ],
      correctIndex: 2,
      explanation: "Green. Spell-check on a casual email about logistics? That's the definition of low-stakes AI use."
    },
    {
      id: 'mc-sort-8',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "You ask AI to write your entire college application essay for you — the personal statement about who you are and what matters to you. What color?",
      options: [
        'Yellow — as long as you edit it afterward',
        "Red — this isn't just cheating, it's letting AI define who you are to admissions committees",
        'Green — everyone uses AI for writing now',
        "Yellow — the ideas are still yours even if AI writes them"
      ],
      correctIndex: 1,
      explanation: "Red. A college personal statement is supposed to reveal *your* voice, *your* experiences, *your* thinking. Having AI write it defeats the entire purpose — and you're robbing yourself of the chance to reflect on your own life."
    },

    // ── THE ATROPHY QUESTION ─────────────────────────────────────────────────
    {
      id: 'section-atrophy',
      type: 'section_header',
      title: 'The Atrophy Question',
      subtitle: '~10 min',
      icon: '🔬'
    },
    {
      id: 'text-atrophy-intro',
      type: 'text',
      content: "In late 2025, Anthropic published one of the largest studies ever done on how AI affects thinking. They surveyed **81,000 users across 159 countries.** Here's what they found:"
    },
    {
      id: 'vocab-atrophy',
      type: 'vocab_list',
      terms: [
        {
          term: 'Cognitive Atrophy',
          definition: "The gradual weakening of mental abilities (memory, critical thinking, problem-solving) from lack of use — like a muscle that shrinks when you stop exercising it."
        },
        {
          term: 'Cognitive Offloading',
          definition: 'Letting a tool (like AI, a calculator, or GPS) handle a mental task you could do yourself. Can be efficient or harmful depending on the task.'
        }
      ]
    },
    {
      id: 'text-survey-data',
      type: 'text',
      content: "### Key findings from the 81K-user survey:\n\n- **33% of users said AI helped them learn** — it explained concepts, gave feedback, helped them explore ideas\n- **17% expressed concern about cognitive atrophy** — they noticed themselves thinking less deeply\n- **Educators reported cognitive decline at 2.5–3x the rate** of average users\n- **Self-directed users** reported more benefits than people whose jobs **required** them to use AI\n- The study covered **159 countries** — this isn't just an American phenomenon"
    },
    {
      id: 'callout-analogy',
      type: 'callout',
      style: 'question',
      icon: '🤔',
      content: "**Two analogies — which one fits?**\n\n**The Calculator Analogy:** Calculators freed us from tedious arithmetic so we could focus on higher-level math. Nobody says calculators made us dumber — they made us *more capable*.\n\n**The Wheelchair Analogy:** If you use a wheelchair when you can walk, your legs weaken. The tool designed to help you move actually takes away your ability to move on your own.\n\n**The real question:** Is AI more like a calculator (frees you for harder thinking) or a wheelchair (weakens what it replaces)?\n\n*The answer might be: it depends on HOW you use it.*"
    },
    {
      id: 'text-nuance',
      type: 'text',
      content: "Here's the nuance: **the same tool can be a calculator OR a wheelchair depending on the user.**\n\n- Student A uses AI to check their work after solving a problem → **calculator** (reinforces learning)\n- Student B uses AI to get the answer without trying → **wheelchair** (skips the learning entirely)\n\nSame AI. Same prompt. Completely different outcomes. The difference isn't the technology — it's the **intention**."
    },
    {
      id: 'mc-atrophy-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'According to the Anthropic survey, what percentage expressed concern about cognitive atrophy?',
      options: [
        '33%',
        '17%',
        '50%',
        '81%'
      ],
      correctIndex: 1,
      explanation: "17% expressed concern about cognitive atrophy. Interestingly, 33% — nearly double — said AI actually helped them learn. The data is more nuanced than 'AI bad for thinking.'"
    },
    {
      id: 'mc-atrophy-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'Why did educators report cognitive decline at higher rates than average users?',
      options: [
        'Educators are less tech-savvy than other groups',
        "Educators don't actually use AI very much",
        'The survey was biased toward educator responses',
        "Educators are trained to notice changes in thinking patterns — in themselves and others"
      ],
      correctIndex: 3,
      explanation: "Educators spend their careers developing and assessing thinking skills. They're more attuned to changes in how they process information. It's not that they're more affected — they're more aware."
    },
    {
      id: 'mc-atrophy-3',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "Self-directed AI users reported more benefits than people required to use AI at work. What's the most likely explanation?",
      options: [
        'When you choose to use a tool, you\'re more intentional about how and when you use it',
        'Self-directed users are smarter than people who use AI at work',
        'Workplace AI tools are lower quality than consumer AI',
        'People required to use AI at work lied on the survey'
      ],
      correctIndex: 0,
      explanation: "Choice matters. When you decide to use AI for a specific purpose, you're being intentional. When it's mandatory, you might use it for tasks you'd be better off doing yourself."
    },
    {
      id: 'sa-atrophy-reflect',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Give ONE specific example from your own life where AI acts like a calculator (helps you think better) and ONE where it could act like a wheelchair (replaces thinking you should be doing yourself).",
      placeholder: 'Calculator example: ... Wheelchair example: ...'
    },

    // ── PERSONAL AI POLICY ───────────────────────────────────────────────────
    {
      id: 'section-policy',
      type: 'section_header',
      title: 'Your Personal AI Policy',
      subtitle: '~10 min',
      icon: '📋'
    },
    {
      id: 'text-policy-intro',
      type: 'text',
      content: "Companies have AI policies. Schools have AI policies. NYC built a whole traffic-light system.\n\nBut nobody can draw YOUR line for you. What tasks are you comfortable handing to AI? Where do you want to keep your own brain in charge?\n\nTime to write your own personal AI policy."
    },
    {
      id: 'sa-green-list',
      type: 'question',
      questionType: 'short_answer',
      prompt: "YOUR GREEN LIST: Name at least 3 tasks where you're totally fine using AI. Low-stakes tasks where AI saves time without replacing important thinking.",
      placeholder: '1. ...\n2. ...\n3. ...'
    },
    {
      id: 'sa-yellow-list',
      type: 'question',
      questionType: 'short_answer',
      prompt: "YOUR YELLOW LIST: Name at least 3 tasks where you'd use AI with caution — maybe for a first draft, but you'd always review and edit.",
      placeholder: '1. ...\n2. ...\n3. ...'
    },
    {
      id: 'sa-red-list',
      type: 'question',
      questionType: 'short_answer',
      prompt: "YOUR RED LIST: Name at least 3 tasks where you will NOT use AI — things too important, too personal, or too high-stakes to outsource.",
      placeholder: '1. ...\n2. ...\n3. ...'
    },

    // ── FINAL REFLECTION ─────────────────────────────────────────────────────
    {
      id: 'section-reflection',
      type: 'section_header',
      title: 'Final Reflection',
      subtitle: '~5 min',
      icon: '✍️'
    },
    {
      id: 'callout-callback',
      type: 'callout',
      style: 'question',
      icon: '🔄',
      content: "**Remember the opening poll?** \"If AI could do your homework perfectly, would you let it?\"\n\nLook at your answer. Has anything shifted?"
    },
    {
      id: 'sa-final-reflection',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Has your thinking about when to use AI changed after today's lesson? What's ONE thing you'll do differently going forward?",
      placeholder: 'After today, I\'m going to...'
    }
  ]
};

async function main() {
  const lessonId = 'ai-when-should-ai-think';
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
    const snap = await ref.get();
    if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
    await ref.set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
  }
  console.log(`\nLesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length}`);
  console.log('⚠️  visible: false — open LessonEditor to set order and publish.');
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
