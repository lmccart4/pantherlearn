/**
 * AI Literacy — "AI Agents: From Chatbots to Autonomous Systems"
 * Order: 63 | Visible: false
 * Source: drafts/lesson-plans/2026-03-23-ai-literacy-agentic-ai-classroom.md
 * Condensed from weekly plan to single lesson
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
  title: 'AI Agents: From Chatbots to Autonomous Systems',
  course: 'AI Literacy',
  unit: 'Future of AI',
  questionOfTheDay: "If you could build an AI agent that handles one thing in your life completely on its own — what would it do, and would you actually trust it?",
  order: 63,
  visible: false,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  blocks: [

    // ── WARM UP ──────────────────────────────────────────────────────────────
    {
      id: 'section-warmup',
      type: 'section_header',
      title: 'Warm Up',
      subtitle: '~5 min',
      icon: '🤖'
    },
    {
      id: 'objectives',
      type: 'objectives',
      title: 'Learning Objectives',
      items: [
        'Classify AI systems on the autonomy spectrum from rule-based bots to fully autonomous agents',
        'Explain the Plan → Act → Observe loop that drives AI agent behavior',
        'Evaluate why guardrails, human checkpoints, and red teaming are critical for autonomous AI',
        'Design an AI agent concept with appropriate boundaries and safeguards'
      ]
    },
    {
      id: 'callout-warmup',
      type: 'callout',
      style: 'question',
      icon: '💬',
      content: "**Think about this before we start:**\n\nYou ask Siri to set a timer — that's one kind of AI. ChatGPT writes you an essay — that's another. Now imagine an AI that books your doctor's appointment, negotiates the time with your school schedule, and sends your parent a confirmation text — all without you doing anything.\n\n**Where's the line between \"helpful tool\" and \"too much power\"?**"
    },

    // ── SECTION 1: THE AI SPECTRUM ───────────────────────────────────────────
    {
      id: 'section-spectrum',
      type: 'section_header',
      title: 'The AI Spectrum',
      subtitle: 'From simple bots to autonomous agents',
      icon: '📊'
    },
    {
      id: 'text-spectrum-intro',
      type: 'text',
      content: "Not all AI is created equal. There's a huge difference between an AI that follows a script and one that makes its own decisions. Here are the four levels of the **AI autonomy spectrum**:"
    },
    {
      id: 'text-spectrum-levels',
      type: 'text',
      content: "| Level | Type | What It Does | Example |\n|-------|------|-------------|----------|\n| 1 | **Rule-Based Bot** | Follows pre-written scripts exactly. No learning, no flexibility. | A website chatbot that says \"For billing, press 1\" |\n| 2 | **Chatbot / Assistant** | Understands natural language and generates responses, but only when you ask. | ChatGPT, Google Gemini — you type, it responds |\n| 3 | **Copilot** | Works alongside you in real time, suggesting and completing tasks while you stay in control. | GitHub Copilot writing code suggestions, Grammarly fixing your writing |\n| 4 | **Autonomous Agent** | Sets its own goals, makes multi-step plans, uses tools, and acts without waiting for your input. | An AI that researches, compares, and books your family's vacation on its own |"
    },
    {
      id: 'callout-spectrum-key',
      type: 'callout',
      style: 'insight',
      icon: '💡',
      content: "**The key difference:** Levels 1-3 wait for you. Level 4 acts on its own. That's a massive leap — and it's where things get interesting (and risky)."
    },
    {
      id: 'vocab-spectrum',
      type: 'vocab_list',
      terms: [
        {
          term: 'Autonomous Agent',
          definition: "An AI system that can independently set goals, make plans, take actions, and adjust its approach — all without a human directing each step."
        },
        {
          term: 'Copilot',
          definition: 'An AI that works alongside a human in real time, offering suggestions and assistance while the human remains in control of decisions.'
        },
        {
          term: 'Autonomy Spectrum',
          definition: 'The range from fully human-controlled AI (rule-based bots) to fully independent AI (autonomous agents), with chatbots and copilots in between.'
        }
      ]
    },

    // ── SORT THE AI ──────────────────────────────────────────────────────────
    {
      id: 'section-sort',
      type: 'section_header',
      title: 'Sort the AI',
      subtitle: 'Classify each system on the spectrum',
      icon: '🏷️'
    },
    {
      id: 'mc-sort-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "A fast food restaurant has a touchscreen kiosk where you tap buttons to build your order — \"Add cheese? Yes/No.\" What level is this?",
      options: [
        'Rule-Based Bot — it follows a fixed script with no flexibility',
        'Chatbot — it understands your language and responds',
        'Copilot — it works alongside you and suggests things',
        'Autonomous Agent — it acts independently'
      ],
      correctIndex: 0,
      explanation: "The kiosk follows a pre-programmed menu of options. It doesn't understand language, learn from you, or make suggestions — it just walks through a script."
    },
    {
      id: 'mc-sort-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "You're writing an email and Grammarly underlines a sentence, suggesting a clearer way to phrase it. You can accept or ignore the suggestion. What level?",
      options: [
        'Rule-Based Bot — it follows exact rules',
        'Chatbot — it generates responses to your questions',
        'Autonomous Agent — it rewrites your email without asking',
        'Copilot — it assists you in real time while you stay in control'
      ],
      correctIndex: 3,
      explanation: "Grammarly works alongside you as you write, offering real-time suggestions — but you decide whether to accept them. That's the copilot pattern: AI assists, human decides."
    },
    {
      id: 'mc-sort-3',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'You type "Explain photosynthesis like I\'m 10" into ChatGPT, and it writes a kid-friendly explanation. What level?',
      options: [
        'Rule-Based Bot — it matches keywords to pre-written answers',
        'Copilot — it helps you while you work on something',
        'Chatbot — it understands your request and generates a response',
        'Autonomous Agent — it decides what to explain on its own'
      ],
      correctIndex: 2,
      explanation: "ChatGPT understands natural language and generates a response — but only because you asked. It doesn't take action on its own. Classic chatbot."
    },
    {
      id: 'mc-sort-4',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "An AI travel planner researches flights, compares hotels, checks your calendar for conflicts, and books a full trip — then emails you the confirmation. What level?",
      options: [
        'Copilot — it suggests options for you to choose from',
        'Autonomous Agent — it plans, decides, and acts on its own',
        'Chatbot — it answers your travel questions',
        'Rule-Based Bot — it follows a booking script'
      ],
      correctIndex: 1,
      explanation: "This AI made a multi-step plan, used multiple tools (flight search, calendar, email), and completed the task without waiting for approval at each step. That's an autonomous agent."
    },
    {
      id: 'mc-sort-5',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "A bank's phone system says: \"For account balance, say 'balance.' For a representative, say 'representative.'\" What level?",
      options: [
        "Chatbot — it understands what you're saying",
        'Copilot — it guides you through the process',
        'Autonomous Agent — it handles your banking automatically',
        'Rule-Based Bot — it matches specific keywords to pre-set actions'
      ],
      correctIndex: 3,
      explanation: "It listens for exact keywords and routes you to a pre-determined response. No understanding, no flexibility, no learning. Pure rule-based."
    },
    {
      id: 'mc-sort-6',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "An AI coding assistant watches you write Python in real time. When you start typing a function, it suggests the next 5 lines — you hit Tab to accept or keep typing to ignore. What level?",
      options: [
        'Copilot — it works alongside you and suggests completions while you code',
        'Rule-Based Bot — it auto-completes based on templates',
        'Autonomous Agent — it writes the whole program for you',
        'Chatbot — it explains code when you ask'
      ],
      correctIndex: 0,
      explanation: "It watches your work in real time and offers suggestions, but you're in control — you accept or reject each one. That's the copilot model: AI-enhanced human work."
    },

    // ── HOW AGENTS THINK ─────────────────────────────────────────────────────
    {
      id: 'section-agent-loop',
      type: 'section_header',
      title: 'How Agents Think',
      subtitle: 'The Plan → Act → Observe loop',
      icon: '🔄'
    },
    {
      id: 'text-agent-loop',
      type: 'text',
      content: "So how does an autonomous agent actually work? It's not magic — it's a **loop**.\n\nEvery AI agent follows the same basic cycle:\n\n**1. Plan** — Figure out what to do next. Break the big goal into smaller steps.\n\n**2. Act** — Do something: search the web, send an email, write a document, call another tool.\n\n**3. Observe** — Look at what happened. Did it work? Did something unexpected come up?\n\nThen it **loops back to Plan** — adjusting based on what it observed.\n\nThis cycle repeats until the task is done (or the agent gets stuck and asks for help)."
    },
    {
      id: 'callout-loop-visual',
      type: 'callout',
      style: 'insight',
      icon: '🔁',
      content: "**The Agent Loop:**\n\n**Plan** → What's my next step?\n**Act** → Do the thing\n**Observe** → What happened?\n↩️ **Repeat** until the task is complete\n\nThis is the same loop whether the agent is booking a flight, writing code, or managing a classroom."
    },
    {
      id: 'text-agent-trace',
      type: 'text',
      content: "**Let's trace a real example:**\n\nA teacher tells an AI agent: *\"Send parents an update about next Friday's field trip to the science museum.\"*\n\n| Step | Phase | What the Agent Does |\n|------|-------|--------------------|\n| 1 | **Plan** | \"I need the field trip details, the parent contact list, and a professional email template.\" |\n| 2 | **Act** | Searches the school calendar → finds: Science Museum, 8 AM departure, permission slips due Wednesday |\n| 3 | **Observe** | \"Got the details. But I don't have the parent email list yet.\" |\n| 4 | **Plan** | \"I'll pull the contact list from the class roster system.\" |\n| 5 | **Act** | Accesses the roster → retrieves 28 parent email addresses |\n| 6 | **Observe** | \"Got all contacts. Now I need to draft the email.\" |\n| 7 | **Plan** | \"I'll write a clear, professional parent email with all the details.\" |\n| 8 | **Act** | Drafts the email: subject line, greeting, trip details, permission slip reminder, sign-off |\n| 9 | **Observe** | \"Email drafted. Ready to send — but I should check with the teacher first.\" |\n| 10 | **Plan** | \"I'll show the teacher the draft before sending to 28 families.\" |\n| 11 | **Act** | Sends the draft to the teacher for review |\n\nNotice step 10 — a well-designed agent **knows when to stop and check with a human**. That's a guardrail."
    },
    {
      id: 'mc-loop-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "In the field trip agent example, the agent searches the school calendar and finds trip details. Which phase of the agent loop is this?",
      options: [
        "Plan — the agent is figuring out what to do",
        'Act — the agent is performing an action to gather information',
        "Observe — the agent is reviewing what it found",
        "None — searching isn't part of the loop"
      ],
      correctIndex: 1,
      explanation: "Searching the calendar is an action the agent takes to get information it needs. The Plan phase came before, and the Observe phase comes after."
    },
    {
      id: 'mc-loop-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'Why did the agent stop and show the teacher the draft instead of just sending the email to all 28 parents?',
      options: [
        'The agent ran out of computing power',
        'Sending emails is too expensive for AI',
        'The agent recognized this was a high-stakes action that needed human approval',
        'The teacher programmed it to always stop at step 10'
      ],
      correctIndex: 2,
      explanation: "A well-designed agent has guardrails — it knows that sending an email to 28 families is a high-stakes action with real consequences if something is wrong. Pausing for human review is a safety feature, not a weakness."
    },

    // ── GUARDRAILS ───────────────────────────────────────────────────────────
    {
      id: 'section-guardrails',
      type: 'section_header',
      title: 'Guardrails & The Autonomy Debate',
      subtitle: 'Why powerful AI needs boundaries',
      icon: '🛡️'
    },
    {
      id: 'text-guardrails',
      type: 'text',
      content: "More autonomy means more power — but also more risk. That's why AI agents need **guardrails**: rules, limits, and checkpoints that keep them from going off the rails.\n\n**Types of guardrails:**\n\n- **Action limits** — The agent can research but can't send emails, make purchases, or delete files without permission\n- **Human checkpoints** — At certain steps, the agent must pause and get approval before continuing\n- **Scope boundaries** — The agent only works within its assigned area — a homework helper can't access your banking app\n- **Kill switches** — A human can shut the agent down at any time, no questions asked\n- **Audit logs** — Everything the agent does is recorded so humans can review its decisions later"
    },
    {
      id: 'vocab-guardrails',
      type: 'vocab_list',
      terms: [
        {
          term: 'Guardrails',
          definition: 'Rules, limits, and safety mechanisms built into AI agents to prevent harmful, unintended, or unauthorized actions.'
        },
        {
          term: 'Red Teaming',
          definition: "Deliberately trying to break, trick, or exploit an AI system to find its weaknesses before real users do. Like hiring someone to try to rob your house so you can fix the locks."
        },
        {
          term: 'Human-in-the-Loop',
          definition: "A system design where a human must review and approve the AI's actions at critical decision points before they're carried out."
        }
      ]
    },
    {
      id: 'callout-red-team',
      type: 'callout',
      style: 'insight',
      icon: '🔴',
      content: "**Red teaming** is when companies hire people to deliberately try to break their AI. They try to trick it into saying harmful things, bypassing safety rules, or doing things it shouldn't.\n\nThis isn't about being mean to the AI — it's about finding the cracks before millions of real users do. Think of it like a fire drill: you practice for the worst case so you're ready if it happens."
    },
    {
      id: 'mc-guardrails-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "A school gives an AI agent access to student grades so it can send weekly progress reports to parents. Which guardrail is MOST important?",
      options: [
        'Making the agent work faster so reports go out sooner',
        'Giving the agent access to more school systems for better context',
        "Human checkpoint — a teacher reviews each report before it's sent to families",
        'Letting the agent customize its own communication style'
      ],
      correctIndex: 2,
      explanation: "Sending grade information to parents is high-stakes — an error could cause real problems. A teacher reviewing each report before it goes out catches mistakes before they reach parents."
    },
    {
      id: 'mc-guardrails-2',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: 'What is the purpose of red teaming an AI system?',
      options: [
        'To make the AI faster and more efficient',
        'To find weaknesses and failures before real users encounter them',
        'To teach the AI how to defend itself from hackers',
        "To paint the AI's interface red for brand recognition"
      ],
      correctIndex: 1,
      explanation: "Red teaming is about intentionally trying to break the system — finding the cracks, edge cases, and failure modes before millions of people use it in the real world."
    },

    // ── DESIGN CHALLENGE ─────────────────────────────────────────────────────
    {
      id: 'section-design',
      type: 'section_header',
      title: 'Design Challenge',
      subtitle: 'Build your own AI agent concept',
      icon: '🛠️'
    },
    {
      id: 'callout-design-prompt',
      type: 'callout',
      style: 'question',
      icon: '✏️',
      content: "**Your turn.** Design an AI agent that solves a real problem at your school. Think about something that's genuinely annoying, time-consuming, or broken — and imagine an AI agent that fixes it.\n\nBe specific. Be creative. But also be realistic about what could go wrong."
    },
    {
      id: 'sa-design-agent',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Design an AI agent for your school. Include:\n\n1. **Agent name** — give it a real name\n2. **What it does** — the problem it solves and how it works (use Plan → Act → Observe)\n3. **Three guardrails** — limits or safety rules to prevent harm\n\nExample: \"PantherBot helps students find open tutoring sessions. It checks tutor schedules, matches subjects, and sends confirmations — but a counselor approves all matches before students are notified.\"",
      placeholder: 'Name your agent, describe what it does, and list 3 guardrails...'
    },

    // ── AUTONOMY ETHICS ──────────────────────────────────────────────────────
    {
      id: 'mc-ethics-1',
      type: 'question',
      questionType: 'multiple_choice',
      prompt: "An autonomous AI agent manages a company's social media. It sees that a controversial post is getting tons of engagement, so it creates more posts on the same topic to maximize views. No human reviewed the posts. What went wrong?",
      options: [
        'The agent was too slow to post',
        'The agent optimized for engagement without ethical judgment — it needed human oversight for sensitive content',
        'The agent should have posted even more to capitalize on the trend',
        "Nothing went wrong — the agent was doing its job"
      ],
      correctIndex: 1,
      explanation: "The agent optimized for a metric (engagement) without understanding context or ethics. Controversial content can be harmful — but an AI only sees numbers. This is exactly why human checkpoints exist."
    },
    {
      id: 'sa-autonomy-trust',
      type: 'question',
      questionType: 'short_answer',
      prompt: "Some argue AI agents should be fully autonomous because humans slow things down. Others say humans must always be in the loop because AI can't understand ethics.\n\nWhich side do you lean toward, and why? Use a specific example.",
      placeholder: 'I think AI agents should / should not have full autonomy because...'
    },

    // ── WRAP UP ──────────────────────────────────────────────────────────────
    {
      id: 'section-wrapup',
      type: 'section_header',
      title: 'Wrap Up',
      subtitle: 'Key takeaway',
      icon: '🎯'
    },
    {
      id: 'callout-takeaway',
      type: 'callout',
      style: 'insight',
      icon: '🧠',
      content: "**The big idea:**\n\nAI agents are the next frontier — systems that don't just answer questions but actually *do things* in the world. They plan, act, observe, and adapt.\n\nBut with autonomy comes responsibility. The question isn't just \"Can AI do this?\" — it's \"Should AI do this without a human checking first?\"\n\n**You are the generation that will decide where the line is drawn.**"
    }
  ]
};

async function main() {
  const lessonId = 'ai-agents-from-chatbots';
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
