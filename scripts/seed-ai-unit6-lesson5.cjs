/**
 * AI Literacy Unit 6, Lesson 5: AI Tool Ethics and Boundaries
 * Order: 53 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-tool-ethics',
  title: 'AI Tool Ethics: Where Does Helpful End and Wrong Begin?',
  order: 53,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Identify the ethical boundaries of AI tool use in personal and academic contexts',
      'Analyze scenarios where AI use crosses from acceptable to problematic',
      'Develop a personal framework for ethical AI use',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Has AI ever helped you do something you weren\'t totally sure you should be doing? What was it? Did it feel like a gray area or clearly wrong?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: The Gray Zones' },
    { type: 'text', id: id(), content: `Most people agree on the extremes — using AI to draft a quick email is fine; submitting AI-written work as your own is not. The interesting cases are in between.\n\n**Scenario A:** You use AI to help you understand a math concept you missed. You then solve the practice problems yourself. ✅ Most people say fine.\n\n**Scenario B:** You use AI to write a first draft of your college essay, then rewrite it heavily in your own voice. 🤔 Opinions vary widely.\n\n**Scenario C:** You use AI to generate ideas for a creative project. You pick the ones you like and execute them yourself. 🤔 Is the idea yours?\n\n**Scenario D:** You take-home exam allows "any resources." You use AI to generate full answers, then lightly edit. ❓ Is this allowed?\n\n**Scenario E:** You use AI to write a heartfelt message to a friend going through something hard because you don\'t know what to say. ❓ Is this deceptive?\n\n**Scenario F:** A classmate asks you to use AI to help them pass a test they\'d otherwise fail. You know they\'ll fall further behind without actually learning. ❓ Do you help?` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Pick two scenarios from above that you think land on different sides of the line. For each: what makes it acceptable or unacceptable? What principle are you using to decide?' },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: Three Ethical Tests' },
    { type: 'text', id: id(), content: `When you\'re unsure about an AI use, try these three tests:\n\n**The Transparency Test**\nWould you be comfortable telling your teacher, employer, or the relevant person exactly how you used AI? If you\'d be embarrassed or need to hide it, that\'s a signal.\n\n**The Learning Test**\nDid using AI help you understand something better, or did it just produce an output while you learned nothing? Using AI to bypass learning harms only you — but it\'s still worth examining.\n\n**The Harm Test**\nDoes your AI use affect anyone else negatively? Submitting AI work in a class on a curve harms classmates. Using AI to produce disinformation harms everyone who reads it.` },
    { type: 'callout', id: id(), content: '**The Meta-Principle:** AI is a tool. Tools can be used well or poorly. The ethics aren\'t in the tool — they\'re in how you choose to use it and why.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Apply the three tests to Scenario B (AI-assisted college essay). What does each test reveal? What\'s your final verdict — is it acceptable?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Your Personal Code' },
    { type: 'text', id: id(), content: `As AI tools become more powerful and more embedded in daily life, the question "is this okay?" won\'t always have a clear answer. You\'ll need a personal ethical framework you actually believe in — not just rules from an institution.\n\nThe goal isn\'t to avoid AI. It\'s to use it in ways you can stand behind.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Write your Personal AI Ethics Code — 3 to 5 principles that will guide how you use AI tools. These should be things you genuinely believe, not what you think a teacher wants to hear.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Ten years from now, AI will be far more capable than it is today. How do you think the ethics of AI use will change? What will stay the same?' },
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
