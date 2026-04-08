/**
 * AI Literacy — "The Dead Classroom — When AI Teaches AI"
 * Order: 65 | Visible: false
 * Source: drafts/lesson-plans/2026-03-31-ai-literacy-ai-teaching-assistants-dead-classroom.md
 * Canvas IgniteAI, MagicSchool, AFT $23M agentic training
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
  title: 'The Dead Classroom — When AI Teaches AI',
  course: 'AI Literacy',
  unit: 'AI & Society',
  questionOfTheDay: "Your teacher uses AI to write the lesson, AI to grade your essay, and AI to write your feedback comments. At what point did the teacher stop teaching?",
  order: 65,
  visible: false,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  blocks: [

    // ── WARM UP ──────────────────────────────────────────────────────────────
    {
      id: 'section-warmup',
      type: 'section_header',
      icon: '🏃',
      title: 'Warm Up',
      subtitle: '~5 minutes'
    },
    {
      id: 'callout-qotd',
      type: 'callout',
      style: 'question',
      icon: '❓',
      content: "**Question of the Day:** Your teacher uses AI to write the lesson, AI to grade your essay, and AI to write your feedback comments. At what point did the teacher stop teaching?"
    },
    {
      id: 'q-warmup',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Write a one-sentence answer: At what point in that chain (AI writes lesson → AI grades essay → AI writes feedback) did the teacher stop teaching? Is there a specific step where it crosses the line?",
      placeholder: 'The teacher stopped teaching when...'
    },
    {
      id: 'b-objectives',
      type: 'objectives',
      title: 'Learning Objectives',
      items: [
        "Analyze the concept of 'dead classroom theory' and identify what makes it a risk",
        'Evaluate real AI teaching tools (Canvas IgniteAI, MagicSchool) and their deliberate limitations',
        'Distinguish between AI-assisted teaching (human in the loop) and AI-replaced teaching (human removed)',
        "Design an 'AI boundary map' that defines where AI should and shouldn't operate in education"
      ]
    },

    // ── THE RISE OF AI TEACHING ASSISTANTS ───────────────────────────────────
    {
      id: 'section-rise',
      type: 'section_header',
      icon: '🤖',
      title: 'The Rise of AI Teaching Assistants',
      subtitle: '~10 minutes'
    },
    {
      id: 'b-landscape',
      type: 'text',
      content: "AI teaching tools aren't coming — they're already here. Here's what's happening right now (March 2026):\n\n- **Canvas IgniteAI Agent**: Generates rubrics, creates assignments, writes personalized feedback, reviews discussions — all inside the learning management system your teacher uses every day\n- **MagicSchool Class Writing Feedback**: AI reads your essay, drafts feedback comments based on the teacher's rubric, then the teacher reviews and pushes comments directly into your Google Doc\n- **Microsoft Study and Learn Agent**: Creates adaptive exercises, flashcards, and quizzes personalized to each student (ages 13+)\n\n### The Numbers\n- **6 in 10 teachers** now use AI in their work — doubled from 2024\n- **83% of institutions** plan to deploy AI teaching assistants by end of 2026\n- The American Federation of Teachers (AFT) is spending **$23 million** to train 400,000 teachers on agentic AI — AI that can do multi-step tasks on its own"
    },
    {
      id: 'q-landscape-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'What percentage of teachers now use AI in their teaching practice (as of 2026)?',
      options: [
        'About 30% (3 in 10)',
        'About 60% (6 in 10)',
        'About 80% (8 in 10)',
        'About 10% (1 in 10)'
      ],
      correctIndex: 1,
      explanation: "6 in 10 teachers (about 60%) now use AI tools in their teaching — double the rate from 2024. This rapid adoption means AI is already shaping how you're being taught."
    },

    // ── THE DELIBERATE LIMITATION ────────────────────────────────────────────
    {
      id: 'section-limitation',
      type: 'section_header',
      icon: '🚧',
      title: 'The Deliberate Limitation',
      subtitle: ''
    },
    {
      id: 'callout-canvas-quote',
      type: 'callout',
      style: 'insight',
      icon: '💡',
      content: "**Canvas made a surprising choice:** Their IgniteAI tool deliberately **blocks full auto-grading**.\n\nQuote from Chief Architect Zach Pendleton:\n\n*\"If faculty use a feature like AI grading to remove themselves from feedback, they're teaching students that they should just go directly to the AI.\"*"
    },
    {
      id: 'q-limitation-1',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Why would a company that SELLS AI tools choose to LIMIT what their AI can do? Isn't that bad for business? Explain their reasoning.",
      placeholder: 'They limited it because...'
    },
    {
      id: 'q-limitation-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "According to Canvas's Chief Architect, what happens when teachers use AI to completely remove themselves from the feedback process?",
      options: [
        'Students get better, more consistent feedback',
        'Teachers save time and can focus on other tasks',
        'The AI learns to grade more accurately over time',
        'Students learn to skip the teacher and go directly to the AI'
      ],
      correctIndex: 3,
      explanation: "Pendleton's concern is that if AI does ALL the feedback, students learn to skip the teacher and go straight to AI. The teacher-student relationship — the human connection that makes education work — disappears."
    },

    // ── DEAD CLASSROOM THEORY ────────────────────────────────────────────────
    {
      id: 'section-dead-classroom',
      type: 'section_header',
      icon: '💀',
      title: 'Dead Classroom Theory',
      subtitle: ''
    },
    {
      id: 'b-gulya',
      type: 'text',
      content: "Berkeley professor **Jason Gulya** coined the term **\"dead classroom\"** to describe what happens when AI takes over both sides of education:\n\n> If students know AI generated the materials AND AI graded the work, the human-to-human relationship evaporates. It becomes \"computers teaching other computers.\"\n\nHere's the spectrum — from helpful to dangerous:"
    },
    {
      id: 'b-spectrum',
      type: 'text',
      content: "### The AI in Education Spectrum\n\n| Level | What It Looks Like | Example |\n|---|---|---|\n| **1. AI-Assisted** | Teacher uses AI to draft a rubric, then edits it with their own standards | AI helps, human decides |\n| **2. AI-Augmented** | AI grades multiple choice; teacher grades essays and gives verbal feedback | AI handles routine tasks |\n| **3. AI-Replaced** | AI writes the lesson, delivers content, grades everything, writes feedback | Human is technically present but not teaching |\n| **4. Dead Classroom** | Students use AI to do the work → teacher uses AI to grade the AI's work → no human learning occurred | Computers teaching computers |"
    },
    {
      id: 'def-dead-classroom',
      type: 'definition',
      term: 'Dead Classroom',
      definition: "A classroom where AI generates the lesson, AI grades the work, AI writes the feedback, and students use AI to complete assignments — resulting in no genuine human learning or human connection. 'Computers teaching other computers.'"
    },
    {
      id: 'q-spectrum-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'A teacher uses AI to generate 20 practice problems, reviews them, removes 5 that don\'t fit, and adds 3 of her own. Which level of the spectrum is this?',
      options: [
        'Dead Classroom — the AI did most of the work',
        "AI-Replaced — the teacher is just editing AI output",
        'AI-Assisted — the teacher used AI as a starting point but applied her own judgment',
        'AI-Augmented — the AI and teacher split the task equally'
      ],
      correctIndex: 2,
      explanation: "This is AI-Assisted (Level 1). The teacher used AI as a tool to draft content, but she reviewed, curated, removed problems that didn't fit, and added her own. Her professional judgment shaped the final product."
    },
    {
      id: 'q-spectrum-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'A student uses ChatGPT to write their essay. The teacher uses AI to grade it and AI to write feedback. What level is this?',
      options: [
        'Dead Classroom — AI on both sides, no human learning occurred',
        'AI-Augmented — the tools are being used efficiently',
        'AI-Assisted — both people used AI as a helper',
        "AI-Replaced — only the teacher's role was replaced"
      ],
      correctIndex: 0,
      explanation: "This is the Dead Classroom in its purest form. The student didn't write anything. The teacher didn't evaluate anything. Nobody learned. Nobody taught. Computers generating text and computers evaluating text."
    },

    // ── AI BOUNDARY MAP ACTIVITY ─────────────────────────────────────────────
    {
      id: 'section-boundary-map',
      type: 'section_header',
      icon: '🗺️',
      title: 'AI Boundary Map',
      subtitle: '~15 minutes'
    },
    {
      id: 'callout-activity',
      type: 'callout',
      style: 'scenario',
      icon: '📋',
      content: "**Activity:** For each teaching task below, rate it:\n- **Green** = AI should do this (it's routine, no human needed)\n- **Yellow** = AI can help, but a human must decide (human-in-the-loop)\n- **Red** = Humans only (AI should never do this, no matter how good it gets)\n\nThere are no wrong answers — but you need to explain WHY."
    },
    {
      id: 'q-boundary-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'TASK: Writing a lesson plan',
      options: [
        'Green — AI should do this',
        'Yellow — AI can help, human decides',
        'Red — Humans only'
      ],
      correctIndex: 1,
      explanation: "Most educators rate this Yellow. AI can draft a lesson plan efficiently, but a teacher needs to review it for accuracy, appropriateness for their specific students, and alignment with what they've already taught."
    },
    {
      id: 'q-boundary-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'TASK: Grading multiple choice questions',
      options: [
        'Green — AI should do this',
        'Yellow — AI can help, human decides',
        'Red — Humans only'
      ],
      correctIndex: 0,
      explanation: "Most people rate this Green. MC grading is purely mechanical — compare the answer to the key. No judgment needed. AI does this faster and more accurately than a human."
    },
    {
      id: 'q-boundary-3',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'TASK: Grading essays',
      options: [
        'Green — AI should do this',
        'Yellow — AI can help, human decides',
        'Red — Humans only'
      ],
      correctIndex: 1,
      explanation: "AI can evaluate grammar and structure — but can it understand when a student took a creative risk? When they connected the topic to their personal experience? Most educators say Yellow: AI can help identify patterns, but a human should make the final call."
    },
    {
      id: 'q-boundary-4',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "TASK: Motivating a student who's given up",
      options: [
        'Green — AI should do this',
        'Yellow — AI can help, human decides',
        'Red — Humans only'
      ],
      correctIndex: 2,
      explanation: "Almost everyone rates this Red. Motivation requires empathy, relationship, knowing the student's story, reading body language. An AI can generate encouraging words, but it can't look a student in the eye and say 'I believe in you' and have it mean something."
    },
    {
      id: 'q-boundary-5',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'TASK: Writing a letter of recommendation',
      options: [
        'Green — AI should do this',
        'Yellow — AI can help, human decides',
        'Red — Humans only'
      ],
      correctIndex: 2,
      explanation: "A letter of recommendation is a personal testimony from someone who knows you. If you discover your rec letter was written by AI, it loses all meaning. The whole point is that a real human chose to vouch for you."
    },
    {
      id: 'q-boundary-nonneg',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Look back at all the teaching tasks. Which ONE is your absolute non-negotiable — the task you'd NEVER give to AI, no matter how advanced it becomes? Explain why in 2-3 sentences.",
      placeholder: 'My non-negotiable is... because...'
    },

    // ── DISCUSSION ───────────────────────────────────────────────────────────
    {
      id: 'section-discussion',
      type: 'section_header',
      icon: '💬',
      title: 'Discussion',
      subtitle: '~10 minutes'
    },
    {
      id: 'q-discussion-1',
      type: 'question',
      questionType: 'short_answer',
      prompt: "The AFT is spending $23 million to train 400,000 teachers to use agentic AI. Should they ALSO be training teachers on what NOT to give to AI? Why or why not?",
      placeholder: 'I think they should/shouldn\'t because...'
    },
    {
      id: 'q-discussion-2',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Here's the hardest question: If AI feedback is actually MORE detailed and MORE consistent than what most teachers provide (because teachers are overwhelmed), is the 'dead classroom' actually... better? Make an argument for OR against.",
      placeholder: 'My argument is...'
    },

    // ── EXIT TICKET ──────────────────────────────────────────────────────────
    {
      id: 'section-wrapup',
      type: 'section_header',
      icon: '🎯',
      title: 'Exit Ticket',
      subtitle: '~5 minutes'
    },
    {
      id: 'b-summary',
      type: 'text',
      content: "**Today's key ideas:**\n\n- AI teaching tools are already in 60% of classrooms and growing fast\n- Smart companies like Canvas deliberately limit their AI to keep humans in the loop\n- The **dead classroom** happens when AI is on both sides: generating work AND grading it\n- The spectrum runs from AI-Assisted (healthy) to Dead Classroom (no learning)\n- The tasks that matter most — motivation, relationships, trust — are the hardest for AI to replace"
    },
    {
      id: 'q-exit',
      type: 'question',
      questionType: 'short_answer',
      prompt: "You're the principal. Write a one-paragraph AI policy for your school that prevents the 'dead classroom' while still letting teachers use AI tools. What's allowed? What's banned? Why?",
      placeholder: 'AI Policy: At this school, teachers may use AI to... but they may NOT use AI to... The reason is...'
    },

    // ── VOCABULARY ───────────────────────────────────────────────────────────
    {
      id: 'section-vocab',
      type: 'section_header',
      icon: '📖',
      title: 'Key Vocabulary',
      subtitle: ''
    },
    {
      id: 'vocab',
      type: 'vocab_list',
      terms: [
        { term: 'Dead Classroom', definition: "A classroom where AI handles both teaching and learning — generating content, grading work, writing feedback — leaving no genuine human learning or connection." },
        { term: 'AI-Assisted', definition: 'Using AI as a tool to help with a task while the human retains decision-making authority. The human reviews, edits, and approves AI output.' },
        { term: 'AI-Augmented', definition: 'AI handles routine tasks (like grading MC) while humans handle tasks requiring judgment (like essay feedback).' },
        { term: 'AI-Replaced', definition: 'AI performs the entire task — creation, delivery, and evaluation — with the human merely present, not actively teaching.' },
        { term: 'Human-in-the-Loop', definition: 'A design principle where AI can suggest or draft, but a human must review and approve before the output reaches its audience.' },
        { term: 'Agentic AI', definition: 'AI that can perform multi-step tasks autonomously — not just answering questions, but planning and executing complex workflows on its own.' },
        { term: 'AI Boundary Map', definition: 'A framework for deciding which tasks should be handled by AI (green), shared between AI and humans (yellow), or reserved for humans only (red).' }
      ]
    }
  ]
};

async function main() {
  const lessonId = 'ai-dead-classroom';
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
