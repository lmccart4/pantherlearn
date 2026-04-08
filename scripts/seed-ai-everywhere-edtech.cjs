/**
 * AI Literacy — "AI Is Everywhere — Who Decides What's Worth Keeping?"
 * Order: 62 | Visible: false
 * Source: drafts/lesson-plans/2026-03-22-ai-literacy-ai-everywhere-edtech-reckoning.md
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
  title: "AI Is Everywhere — Who Decides What's Worth Keeping?",
  course: 'AI Literacy',
  unit: 'AI in the Real World',
  questionOfTheDay: "86% of schools now use AI tools. But 70% of teachers worry AI weakens critical thinking. Are your schools making you smarter — or just more dependent?",
  order: 62,
  visible: false,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  blocks: [

    // ── WARM UP ──────────────────────────────────────────────────────────────
    {
      id: 'section-warmup',
      type: 'section_header',
      title: 'Warm Up',
      subtitle: '~5 min',
      icon: '📱'
    },
    {
      id: 'objectives',
      type: 'objectives',
      title: 'Learning Objectives',
      items: [
        'Identify at least three ways AI is currently used in schools and evaluate whether each improves learning',
        "Apply an 'efficacy test' to determine if a technology tool is worth using vs. just trendy",
        'Articulate the difference between passive technology consumption and active technology engagement'
      ]
    },
    {
      id: 'callout-audit',
      type: 'callout',
      style: 'question',
      icon: '📋',
      content: "**Quick Audit:** List every piece of technology or AI you've used today — from the alarm clock to getting to school to sitting in class right now.\n\nCount them up. How many did you get? 5? 10? 15+?\n\n**The point:** Technology is invisible until you look for it."
    },
    {
      id: 'sa-warmup',
      type: 'question',
      questionType: 'short_answer',
      prompt: "How many pieces of technology or AI did you use today before this class? List as many as you can think of.",
      placeholder: '1. Alarm clock\n2. Phone\n3. ...'
    },

    // ── THE NUMBERS ──────────────────────────────────────────────────────────
    {
      id: 'section-numbers',
      type: 'section_header',
      title: 'The Numbers',
      subtitle: '~10 min',
      icon: '📊'
    },
    {
      id: 'text-stats',
      type: 'text',
      content: "Here's what's actually happening in schools right now (March 2026):\n\n- **86% of education organizations** use generative AI — the highest of any industry\n- **85% of students** used AI last school year\n- **6 in 10 teachers** now use AI in their practice\n- **70% of teachers** worry AI weakens critical thinking\n- **Over half of students** say AI makes them feel less connected to their teachers\n- Schools spent **billions on tech during COVID**. Now the money's gone and they're asking: \"Did any of this actually work?\"\n\n32% of school leaders say **funding is their #1 problem**. The question shifted from \"what should we buy?\" to \"what's actually worth keeping?\""
    },
    {
      id: 'mc-stats-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'Which industry uses generative AI the most, according to 2026 data?',
      options: [
        'Finance and banking',
        'Healthcare',
        'Education',
        'Technology companies'
      ],
      correctIndex: 2,
      explanation: "Surprisingly, education leads all industries at 86% adoption. That means the tools shaping how you learn are adopting AI faster than Wall Street, hospitals, or even tech companies themselves."
    },
    {
      id: 'mc-stats-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "70% of teachers worry that AI weakens critical thinking. Why is this significant?",
      options: [
        "Teachers are always resistant to new technology",
        "The people who see students learn every day are observing real changes in how students think",
        "Teachers don't understand how AI works",
        "70% is a small number and not worth worrying about"
      ],
      correctIndex: 1,
      explanation: "Teachers spend every day watching students think, solve problems, and learn. When 7 out of 10 say they're seeing changes in critical thinking, that's professional observation from the frontlines — not technophobia."
    },

    // ── THE EFFICACY TEST ────────────────────────────────────────────────────
    {
      id: 'section-efficacy',
      type: 'section_header',
      title: 'The Efficacy Test',
      subtitle: '~15 min',
      icon: '🧪'
    },
    {
      id: 'text-efficacy-intro',
      type: 'text',
      content: "Not all technology is equally useful. Some tools make you think more. Others make you think less. The difference matters.\n\nYou're going to evaluate 6 school technologies using a simple test. For each tool, rate it on three scales (1-5):\n\n- **Does it make you THINK more or less?** (Critical thinking test)\n- **Does it make you DO more or less?** (Active engagement test)\n- **Could you learn the same thing WITHOUT it?** (Necessity test)\n\nTools scoring **10+ total** pass the efficacy test. Below 10? Maybe it's not worth keeping."
    },
    {
      id: 'callout-tool-1',
      type: 'callout',
      style: 'scenario',
      icon: '1️⃣',
      content: "**Tool 1: Google Classroom** (assignment management)\nYou use it every day to get assignments, submit work, and check grades."
    },
    {
      id: 'mc-tool-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "Rate Google Classroom: Does it make you THINK more, DO more, and is it necessary?",
      options: [
        "High efficacy (10+) — it organizes learning and keeps you on track",
        "Medium efficacy (7-9) — useful for logistics but doesn't make you think harder",
        "Low efficacy (under 7) — just digital busywork that replaces paper",
        "Zero efficacy — completely unnecessary"
      ],
      correctIndex: 1,
      explanation: "Most students rate Google Classroom as medium efficacy. It's great for organization (high DO score), but it doesn't directly make you think harder (medium THINK score). And you could technically learn without it (lower NECESSITY). It's a logistics tool, not a learning tool."
    },
    {
      id: 'callout-tool-2',
      type: 'callout',
      style: 'scenario',
      icon: '2️⃣',
      content: "**Tool 2: An AI chatbot that writes your essays for you**\nYou paste the prompt, AI writes the essay, you submit it."
    },
    {
      id: 'mc-tool-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "Rate the essay-writing AI chatbot on the efficacy test.",
      options: [
        "Low efficacy — it does the thinking FOR you instead of making you think",
        "High efficacy — it produces better essays than most students could write",
        "Medium efficacy — it's a useful starting point if you edit afterward",
        "High efficacy — it saves time you can use for other learning"
      ],
      correctIndex: 0,
      explanation: "THINK score: 1 (it replaces your thinking entirely). DO score: 1 (you do nothing). NECESSITY score: 1 (you could absolutely write without it). Total: 3. This tool fails the efficacy test badly — not because it's bad technology, but because using it this way eliminates learning."
    },
    {
      id: 'callout-tool-3',
      type: 'callout',
      style: 'scenario',
      icon: '3️⃣',
      content: "**Tool 3: Interactive physics simulation where you build circuits**\nYou place components, adjust voltages, and see what happens in real time."
    },
    {
      id: 'mc-tool-3',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "Rate the interactive physics simulation on the efficacy test.",
      options: [
        "Low efficacy — simulations are just video games pretending to be education",
        "Medium efficacy — fun but students don't learn more than from a textbook",
        "High efficacy — it makes you think, do, and learn things you couldn't without it",
        "Zero efficacy — students just play around without learning"
      ],
      correctIndex: 2,
      explanation: "THINK score: 5 (you predict outcomes, test hypotheses, debug circuits). DO score: 5 (you actively build and experiment). NECESSITY score: 4 (building real circuits is expensive and dangerous; simulations make this accessible). Total: 14. High efficacy — this is active learning technology at its best."
    },
    {
      id: 'callout-tool-4',
      type: 'callout',
      style: 'scenario',
      icon: '4️⃣',
      content: "**Tool 4: An app that tracks how long you look at your screen**\nIt monitors your screen time and sends you a weekly report."
    },
    {
      id: 'mc-tool-4',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "Rate the screen time tracker on the efficacy test.",
      options: [
        "High efficacy — awareness leads to better habits",
        "Low efficacy — knowing the number doesn't change behavior for most people",
        "Medium efficacy — useful data if you actually act on it",
        "Zero efficacy — completely useless information"
      ],
      correctIndex: 1,
      explanation: "THINK score: 2 (you might reflect briefly, but the app does the observing for you). DO score: 1 (you passively receive a report). NECESSITY score: 2 (you could estimate your usage without an app). Total: 5. Low efficacy — information without action rarely changes behavior."
    },
    {
      id: 'callout-tool-5',
      type: 'callout',
      style: 'scenario',
      icon: '5️⃣',
      content: "**Tool 5: AI tutor that adapts questions to your level**\nIt gives you problems, watches how you solve them, adjusts difficulty in real time, and explains mistakes."
    },
    {
      id: 'mc-tool-5',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "Rate the adaptive AI tutor on the efficacy test.",
      options: [
        "Low efficacy — AI can't actually teach",
        "High efficacy — personalized challenge + immediate feedback + active problem-solving",
        "Medium efficacy — good supplement but can't replace a real teacher",
        "Zero efficacy — students learn to game the system"
      ],
      correctIndex: 1,
      explanation: "THINK score: 5 (you're solving problems at your level — not too easy, not too hard). DO score: 4 (you actively work through problems). NECESSITY score: 4 (a human tutor is ideal but costs $40+/hour; AI makes tutoring accessible to everyone). Total: 13. High efficacy — this is technology expanding access to quality education."
    },
    {
      id: 'callout-tool-6',
      type: 'callout',
      style: 'scenario',
      icon: '6️⃣',
      content: "**Tool 6: Social media feed built into the school LMS**\nStudents can post, like, and comment on a feed inside the learning platform."
    },
    {
      id: 'mc-tool-6',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "Rate the social media feed in the school LMS.",
      options: [
        "High efficacy — social features increase student engagement",
        "Medium efficacy — could promote collaboration if used well",
        "Zero efficacy — it's social media wearing an education costume",
        "Low efficacy — distraction disguised as a feature"
      ],
      correctIndex: 3,
      explanation: "THINK score: 1 (scrolling and liking don't require critical thinking). DO score: 2 (posting is doing something, but it's usually low-effort). NECESSITY score: 1 (you can collaborate without a social feed). Total: 4. Low efficacy — this is passive consumption dressed up as a learning tool."
    },

    // ── KEY DISTINCTION ──────────────────────────────────────────────────────
    {
      id: 'section-distinction',
      type: 'section_header',
      title: 'The Key Distinction',
      subtitle: '~10 min discussion',
      icon: '💡'
    },
    {
      id: 'text-active-passive',
      type: 'text',
      content: "Notice the pattern in the efficacy scores?\n\n**Tools that scored high** made you BUILD, CREATE, SOLVE, TEST, or EXPERIMENT.\n\n**Tools that scored low** made you SCROLL, WATCH, CLICK THROUGH, or RECEIVE.\n\nThis is the most important distinction in education technology:\n\n- **Active engagement** = building, creating, solving, testing, experimenting\n- **Passive consumption** = scrolling, watching, clicking through, receiving\n\nThe screen time debate isn't about screens — it's about **what you're doing with them.**"
    },
    {
      id: 'callout-magicschool',
      type: 'callout',
      style: 'insight',
      icon: '🪄',
      content: "**Real-world example:** MagicSchool AI raised **$65 million in 18 months** helping teachers plan lessons. Some teachers are now building their own AI agents that handle paperwork so they can spend more time actually teaching.\n\nThe question isn't \"should schools use AI?\" — it's **\"what should AI be doing vs. what should humans be doing?\"**"
    },
    {
      id: 'mc-distinction-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "A student watches a 20-minute video lecture and takes notes. Another student builds a model using the same concepts and tests whether it works. Who learned more?",
      options: [
        "The video watcher — they got a complete explanation from an expert",
        "The model builder — active creation requires deeper understanding than passive watching",
        "Both learned equally — they covered the same material",
        "Neither — you need both approaches together"
      ],
      correctIndex: 1,
      explanation: "Research consistently shows that active learning (building, testing, creating) produces deeper understanding and longer retention than passive learning (watching, listening, reading). The model builder had to apply, test, and debug — that's where real learning happens."
    },
    {
      id: 'sa-distinction',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Think about the technology you use in school. Name ONE tool that promotes ACTIVE engagement (building, creating, solving) and ONE that promotes PASSIVE consumption (scrolling, watching, clicking). For the passive one — what would you replace it with, or would you just remove it?",
      placeholder: 'Active tool: ...\nPassive tool: ...\nI would replace/remove it because...'
    },

    // ── EXIT TICKET ──────────────────────────────────────────────────────────
    {
      id: 'section-exit',
      type: 'section_header',
      title: 'Exit Ticket',
      subtitle: '~5 min',
      icon: '🎯'
    },
    {
      id: 'text-summary',
      type: 'text',
      content: "**Today's key ideas:**\n\n- 86% of education organizations use AI — the highest of any industry\n- Schools spent billions on tech during COVID; now they're asking what's worth keeping\n- The efficacy test: Does it make you THINK more? DO more? Is it NECESSARY?\n- Active engagement (build, create, solve) beats passive consumption (scroll, watch, click)\n- The question isn't \"should schools use AI?\" — it's \"what should AI be doing vs. what should humans be doing?\""
    },
    {
      id: 'sa-exit',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Name one technology your school uses that PASSES the efficacy test and one that FAILS. For the one that fails — what would you replace it with (or would you just remove it)?",
      placeholder: 'Passes: ...\nFails: ...\nI would...'
    }
  ]
};

async function main() {
  const lessonId = 'ai-everywhere-edtech';
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
