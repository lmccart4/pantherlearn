/**
 * AI Literacy — "When AI Companies Say No — Values, Power, and the Pentagon"
 * Order: 61 | Visible: false
 * Source: drafts/lesson-plans/2026-03-21-ai-literacy-ai-values-corporate-power.md
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
  title: 'When AI Companies Say No — Values, Power, and the Pentagon',
  course: 'AI Literacy',
  unit: 'Society & Ethics',
  questionOfTheDay: "If an AI company believes its technology shouldn't be used for surveillance, but the government demands it — who should have the final say?",
  order: 61,
  visible: false,
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
  blocks: [
    { id: 'section-warmup', type: 'section_header', title: 'Warm Up', subtitle: '~5 min', icon: '🔥' },

    { id: 'objectives', type: 'objectives', title: 'Learning Objectives', items: [
      'Identify at least two ethical concerns about AI use in military and surveillance contexts',
      'Analyze how corporate values affect technology decisions using a real-world case study',
      'Evaluate the tension between government authority and corporate responsibility in AI development'
    ]},

    { id: 'text-intro', type: 'text', content: '**Quick Vote:** Should tech companies be allowed to refuse government contracts if they disagree with how their technology will be used? Think about your answer — we\'ll come back to it at the end of class.' },

    { id: 'mc-warmup-1', type: 'question', questionType: 'multiple_choice', prompt: 'Before we dive in: What do you think is the MOST important factor when deciding how AI should be used?', options: [
      'Whatever the government says is necessary',
      'Whatever makes the most money',
      'Whatever the company that built it decides',
      'Whatever protects the most people from harm'
    ], correctIndex: 3, explanation: "While there's no single 'right' answer to this debate, protecting people from harm is widely considered a foundational ethical principle. Today's lesson explores what happens when these factors collide." },

    { id: 'section-case-study', type: 'section_header', title: 'The Case Study', subtitle: '~12 min', icon: '📋' },

    { id: 'vocab-terms', type: 'vocab_list', terms: [
      { term: 'Supply Chain Risk', definition: "A government designation meaning a company is considered a threat to national security — normally used for foreign adversaries, not American companies" },
      { term: 'Autonomous Weapons', definition: 'Weapons that can select and engage targets without direct human control' },
      { term: 'Mass Surveillance', definition: 'The monitoring of an entire population or a substantial portion of a group, rather than targeted individuals' },
      { term: 'Corporate Values', definition: 'The principles and ethical standards a company commits to following, even when it costs them money' },
      { term: 'Consumer Backlash', definition: "When customers collectively punish a company for decisions they disagree with — through boycotts, uninstalls, or switching to competitors" }
    ]},

    { id: 'text-setup', type: 'text', content: "## What Happened\n\nIn early 2026, a real AI company called **Anthropic** (the company that makes Claude) was negotiating a contract with the **US Department of Defense** — the Pentagon. The deal was worth up to **$200 million**.\n\nBut Anthropic set two conditions:\n1. Claude could **not** be used for mass surveillance of American citizens\n2. Claude could **not** be used in fully autonomous weapons (weapons that kill without human control)\n\nThe Pentagon said no. They wanted unrestricted access." },

    { id: 'text-breakdown', type: 'text', content: '## The Breakdown\n\nAnthropic refused to budge. Their CEO said: *"We cannot in good conscience accede to their request."*\n\nThe government\'s response was swift and severe:\n- President Trump ordered **all federal agencies** to stop using Anthropic\'s products\n- The Pentagon labeled Anthropic a **"supply chain risk"** — the first time this label was ever used against an American company\n- Anthropic stood to lose **billions of dollars** in revenue' },

    { id: 'callout-twist', type: 'callout', style: 'scenario', icon: '🔄', content: "**The Plot Twist:** Hours after the ban, a rival AI company called **OpenAI** signed the Pentagon deal. But then something unexpected happened: over **2.5 million people** joined a campaign called **#QuitGPT** to delete OpenAI's app. ChatGPT uninstalls surged **295% overnight**. Meanwhile, Anthropic's Claude app went to **#1 on the App Store**." },

    { id: 'mc-comprehension-1', type: 'question', questionType: 'multiple_choice', prompt: "Why was the 'supply chain risk' label so unusual in this case?", options: [
      'It was normally reserved for foreign adversaries, not American companies',
      'It was applied to multiple AI companies at once',
      'It was requested by Anthropic themselves',
      'It had never been used before for any company'
    ], correctIndex: 0, explanation: 'The supply chain risk designation is typically used for companies connected to foreign adversaries (like companies with ties to hostile governments). Using it against an American company for a policy disagreement was unprecedented.' },

    { id: 'section-analysis', type: 'section_header', title: 'Stakeholder Analysis', subtitle: '~13 min', icon: '🔍' },

    { id: 'text-stakeholder-intro', type: 'text', content: "Every decision about AI involves multiple groups with different interests. Let's analyze four key stakeholders in this case." },

    { id: 'callout-company', type: 'callout', style: 'insight', icon: '🏢', content: "**Stakeholder 1: The AI Company (Anthropic)**\nAnthropic was founded specifically with a focus on AI safety. They believe AI should have guardrails — especially when it comes to surveillance and weapons. But saying no to the Pentagon cost them billions and got them blacklisted." },

    { id: 'sa-company', type: 'question', questionType: 'short_answer', prompt: "From the AI company's perspective: What are they protecting by refusing the deal? What are they risking? Is the trade-off worth it?", placeholder: "They're protecting..." },

    { id: 'callout-government', type: 'callout', style: 'insight', icon: '🏛️', content: "**Stakeholder 2: The Government/Military**\nThe Pentagon argues they need the best AI available to protect national security. They say a company shouldn't get to decide how the military operates. Their 40-page legal filing said Anthropic poses an 'unacceptable national security risk' because the company could disable its technology during wartime." },

    { id: 'sa-government', type: 'question', questionType: 'short_answer', prompt: "From the government's perspective: Is it reasonable for a private company to set limits on how the military uses technology? Why or why not?", placeholder: 'I think...' },

    { id: 'callout-consumers', type: 'callout', style: 'insight', icon: '👥', content: "**Stakeholder 3: Consumers (Users like you)**\n2.5 million people quit OpenAI's product when they signed the Pentagon deal. Anthropic's app shot to #1. Consumers voted with their wallets and their app stores." },

    { id: 'mc-consumers', type: 'question', questionType: 'multiple_choice', prompt: 'The #QuitGPT movement shows that consumers:', options: [
      "Don't actually care about AI ethics — it was just trending",
      'Can influence AI company decisions through collective action',
      'Should have no say in how AI companies operate',
      'Always switch to whatever app is newest'
    ], correctIndex: 1, explanation: "The #QuitGPT movement demonstrates consumer power — when millions of people act together (uninstalling apps, switching products), it creates real financial and reputational consequences for companies. This is collective action in the digital age." },

    { id: 'callout-public', type: 'callout', style: 'insight', icon: '🌍', content: "**Stakeholder 4: The General Public**\nMost Americans aren't AI power users. But they're the ones who would be affected by mass surveillance or autonomous weapons. 150 retired judges filed a legal brief supporting Anthropic's right to set limits." },

    { id: 'sa-public', type: 'question', questionType: 'short_answer', prompt: "Why do you think 150 retired judges — people who spent their careers enforcing the law — sided with Anthropic against the government?", placeholder: 'I think they sided with Anthropic because...' },

    { id: 'section-position', type: 'section_header', title: 'Take Your Position', subtitle: '~10 min', icon: '✍️' },

    { id: 'sa-position', type: 'question', questionType: 'short_answer', prompt: "Should AI companies have the right to restrict how their technology is used, even when the customer is the government? Write 3-5 sentences. Use at least ONE specific example from today's case study to support your position. There's no 'right' answer — what matters is your reasoning.", placeholder: 'I believe...' },

    { id: 'mc-synthesis', type: 'question', questionType: 'multiple_choice', prompt: 'Which outcome from this case study BEST demonstrates that corporate values can have real market consequences?', options: [
      'The Pentagon designated Anthropic a supply chain risk',
      'OpenAI signed the Pentagon deal within hours',
      "Anthropic's Claude went to #1 on the App Store after they refused the deal",
      '150 judges filed a brief supporting Anthropic'
    ], correctIndex: 2, explanation: "Claude going to #1 on the App Store directly shows that consumers rewarded Anthropic's values-driven decision with their business. The other events are significant, but this one most clearly links corporate values to market outcomes." },

    { id: 'section-closure', type: 'section_header', title: 'Closure', subtitle: '~5 min', icon: '🎯' },

    { id: 'text-revote', type: 'text', content: "**Re-Vote:** Think back to the question from the start of class: *Should tech companies be allowed to refuse government contracts if they disagree with how their technology will be used?*\n\nHas your answer changed? Why or why not?" },

    { id: 'sa-exit', type: 'question', questionType: 'short_answer', prompt: 'Exit Ticket: Name one thing an AI company should NEVER let its technology be used for, and explain why in one sentence.', placeholder: 'An AI company should never...' }
  ]
};

async function main() {
  const lessonId = 'ai-values-corporate-power';
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
