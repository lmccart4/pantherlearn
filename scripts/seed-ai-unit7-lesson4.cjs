/**
 * AI Literacy Unit 7, Lesson 4: AI Policy and Regulation
 * Order: 58 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-policy-regulation',
  title: 'AI Policy: Who Makes the Rules — and Why It Matters',
  order: 58,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Understand the current landscape of AI regulation globally and in the US',
      'Analyze competing interests in AI policy debates',
      'Form and defend a position on a specific AI policy question',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Should the government regulate AI? Or should companies regulate themselves? What\'s your gut reaction — and where does it come from?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: The Global Policy Race' },
    { type: 'text', id: id(), content: `AI is developing faster than governments can respond. Here\'s where the world stands:\n\n**European Union — Most Aggressive Regulator**\nThe EU AI Act (2024) is the world\'s first comprehensive AI law. It classifies AI by risk level:\n- *Unacceptable risk* (banned): social scoring, real-time biometric surveillance in public spaces\n- *High risk* (strict requirements): AI in hiring, education, healthcare, law enforcement — must be transparent, auditable, human-supervised\n- *Limited/minimal risk* (light-touch): chatbots, spam filters\n\n**United States — Fragmented, Company-Led**\nNo comprehensive federal AI law exists. The Biden administration issued an Executive Order on AI (2023) focused on safety research and government AI use. Individual states are passing their own laws. Congress has held hearings but passed little.\n\n**China — State-Directed AI**\nChina has regulations focused on generative AI content (must be "politically correct"), algorithmic recommendations (users can opt out), and deepfakes (must be labeled). The government actively directs AI development toward national strategic goals.\n\n**The Gap:** Technology moves in months. Legislation moves in years. The rules often arrive after the harms have already happened.` },
    { type: 'callout', id: id(), content: '**The Brussels Effect:** The EU\'s strict regulations often become the de facto global standard — because companies don\'t want to build two separate products. When the EU requires AI transparency, global products tend to become more transparent for everyone.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'Why has the US been slower than the EU to pass comprehensive AI regulation?',
      options: [
        'American companies are more ethical so regulation is unnecessary',
        'The US has a tradition of favoring industry self-regulation, a fragmented federal/state system, and intense tech lobbying against regulation',
        'The EU AI Act applies to the US automatically',
        'AI doesn\'t pose significant risks in the US context',
      ], correct: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: The Competing Interests' },
    { type: 'text', id: id(), content: `AI policy debates involve groups with very different interests:\n\n**Tech companies:** Want minimal regulation, argue over-regulation stifles innovation and US competitiveness, often propose "self-regulation"\n\n**Civil rights groups:** Want strict regulation of facial recognition, hiring AI, and criminal justice AI — have documented evidence of harm to marginalized communities\n\n**National security establishment:** Wants AI capabilities for defense, surveillance, and intelligence — but also fears adversaries\' AI capabilities\n\n**Workers and unions:** Want protections against automation-driven job loss, notice requirements, and human oversight\n\n**Academic researchers:** Want open access to AI systems for study, transparency requirements, and slowed deployment of insufficiently tested systems\n\n**Ordinary citizens:** Largely unaware AI is already making decisions about their credit, healthcare, bail, and job applications` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Whose interests do you think are currently most represented in AI policy decisions? Whose are most underrepresented? What should change?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Your Position' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Choose ONE specific AI policy question (examples: Should facial recognition be banned in public spaces? Should AI hiring tools require bias audits? Should AI-generated content be labeled?). State your position and defend it with at least two specific arguments.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You\'re graduating in a few years and will be a voter. How much does AI policy factor into how you might evaluate a political candidate? Should it?' },
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
