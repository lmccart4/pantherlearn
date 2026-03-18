/**
 * AI Literacy Unit 7, Lesson 2: Human-AI Collaboration (Centaur/Cyborg)
 * Order: 56 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'human-ai-collaboration',
  title: 'Centaurs and Cyborgs: How Humans and AI Work Together',
  order: 56,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Understand the centaur and cyborg models of human-AI collaboration',
      'Identify which tasks benefit from human-led vs. AI-led approaches',
      'Evaluate your own collaboration style with AI',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'When you work with AI on something, who\'s in charge — you or the AI? How do you decide what to hand off to AI vs. keep for yourself?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: Two Models of Working With AI' },
    { type: 'text', id: id(), content: `In 2005, chess grandmaster Garry Kasparov (who lost to Deep Blue in 1997) proposed a new kind of chess: **Advanced Chess**, where human-AI teams compete against each other.\n\nThe results were surprising: a human + AI team didn't just beat AI alone. In many cases, a skilled human working with a moderately powerful AI *outperformed* a more powerful AI working alone — because the human brought judgment, creativity, and strategic thinking that pure computation couldn't replicate.\n\nThis gave rise to two frameworks for thinking about human-AI collaboration:\n\n**The Centaur Model**\nA centaur is half-human, half-horse — two distinct beings working as one. In the centaur model, the human and AI have clearly defined roles. The human handles certain tasks, the AI handles others, and they hand off cleanly between them.\n\n*Example: A writer who drafts outlines and arguments themselves, then uses AI to check grammar, suggest word choices, and catch logical gaps.*\n\n**The Cyborg Model**\nA cyborg is a human with technology integrated into their body — not separate, but fused. In the cyborg model, the human and AI are so intertwined it's hard to say where one ends and the other begins.\n\n*Example: A designer who generates dozens of AI variations while working, constantly iterating between their aesthetic judgment and AI output until the final piece emerges from that tight loop.*` },
    { type: 'callout', id: id(), content: '**The Key Insight from Advanced Chess:** The winning teams weren\'t the ones with the best AI or the best human. They were the ones with the best *process* — who understood clearly what humans do well and what AI does well, and switched fluidly between them.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'A student uses AI to generate 20 potential essay thesis statements, then selects and refines the best one themselves, then writes the entire essay without AI. Which model does this represent?',
      options: [
        'Cyborg — the human and AI are fully fused',
        'Centaur — distinct roles, clean handoff between AI (brainstorm) and human (write)',
        'Neither — this isn\'t really collaboration',
        'Both equally',
      ], correct: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: What Each Does Best' },
    { type: 'text', id: id(), content: `Understanding the collaboration models requires knowing what each partner contributes:\n\n**What humans bring:**\n- Judgment about what matters and why\n- Emotional intelligence and empathy\n- Original ideas that combine concepts in genuinely new ways\n- Values, ethics, and accountability\n- Context from lived experience that AI doesn\'t have\n- The ability to decide when the output is *good enough*\n\n**What AI brings:**\n- Speed and scale — processing vast information instantly\n- Consistency — no fatigue, no bad days\n- Breadth — access to patterns across enormous amounts of text and data\n- Iteration — generating 50 variations as easily as 1\n- No ego — it doesn\'t get defensive when you say "that\'s not right, try again"` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think of something you\'ve worked on (school, creative, personal) where both you and AI contributed. Map it: what specifically did you bring that AI couldn\'t? What did AI bring that you couldn\'t?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Your Collaboration Style' },
    { type: 'text', id: id(), content: `Neither model is universally better. The centaur approach keeps human skills sharp and ownership clear — you always know what you contributed. The cyborg approach can produce results neither could achieve alone, but risks eroding skills you use less because AI handles them.\n\nThe most intentional human-AI collaborators ask:\n- *What do I want to get better at?* → Do that part yourself.\n- *What is genuinely tedious and doesn't build useful skills?* → Delegate that to AI.\n- *What requires my values and judgment?* → That stays with you, always.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Are you more of a centaur or a cyborg in how you work with AI right now? Which model do you want to be — and why?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Identify one skill you have (or want to develop) that you should protect from AI delegation — something you\'ll need to do yourself to keep it sharp. What\'s your plan to keep that skill yours?' },
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
