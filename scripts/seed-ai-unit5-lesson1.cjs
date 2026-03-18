/**
 * AI Literacy Unit 5, Lesson 1: AI in Healthcare
 * Order: 41 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj', // P4
  'DacjJ93vUDcwqc260OP3', // P5
  'M2MVSXrKuVCD9JQfZZyp', // P7
  'fUw67wFhAtobWFhjwvZ5', // P9
];

const lesson = {
  id: 'ai-in-healthcare',
  title: 'AI in Healthcare: Saving Lives or Playing Doctor?',
  order: 41,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Identify real-world applications of AI in healthcare',
      'Evaluate the benefits and risks of AI-assisted diagnosis',
      'Analyze a case study and form an evidence-based opinion',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If you went to the doctor and they told you an AI helped diagnose your condition, how would you feel about that? Why?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: What AI Is Already Doing in Medicine' },
    { type: 'text', id: id(), content: `AI is already working in hospitals, labs, and clinics — often in ways patients never see. Here are four areas where AI is having a real impact:\n\n**Diagnosis from Imaging**\nAI can analyze X-rays, MRIs, and CT scans to detect cancer, fractures, and disease with accuracy that matches or exceeds trained radiologists. Google's DeepMind can detect over 50 eye diseases from a single scan.\n\n**Drug Discovery**\nTraditionally, developing a new drug takes 10–15 years and costs billions. AI can simulate how molecules interact with proteins in hours rather than years. DeepMind's AlphaFold solved a 50-year-old protein-folding problem in 2020 — a breakthrough that could accelerate cures for hundreds of diseases.\n\n**Predicting Patient Deterioration**\nHospitals use AI to monitor vitals and flag patients who are about to crash — sometimes hours before a human doctor would notice. Some systems have reduced ICU deaths by 20%.\n\n**Mental Health Support**\nAI-powered chatbots like Woebot provide cognitive behavioral therapy techniques 24/7. They're not a replacement for therapists, but they can reach people who can't access care.` },
    { type: 'callout', id: id(), content: '**Real Case:** In 2019, an AI system detected breast cancer in mammograms with 11.5% fewer false positives and 9.4% fewer false negatives than human radiologists. It wasn\'t perfect — but it was measurably better on those metrics.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'Which of the following best describes why AI can sometimes outperform human doctors at reading medical images?',
      options: [
        'AI has medical school training just like doctors',
        'AI can process thousands of images and detect subtle patterns humans might miss after fatigue',
        'AI never makes mistakes in medical settings',
        'AI is programmed to always agree with human doctors',
      ], correct: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: The Risks Nobody Talks About' },
    { type: 'text', id: id(), content: `AI in healthcare isn't all breakthroughs and saved lives. There are serious risks:\n\n**Bias in Training Data**\nIf an AI is trained mostly on data from white male patients, it may perform worse for women, elderly patients, or people of color. A 2019 study found a widely-used healthcare algorithm was biased against Black patients — it consistently underestimated how sick they were.\n\n**The Black Box Problem**\nMany AI systems can't explain *why* they made a decision. If an AI flags you as high-risk for a disease, the doctor might not know why. This makes it hard to verify, appeal, or trust.\n\n**Over-Reliance**\nWhen doctors trust AI too much, they stop applying their own judgment. If the AI is wrong and the doctor doesn't catch it, the patient pays the price.\n\n**Data Privacy**\nAI needs enormous amounts of patient data to train. Who owns that data? Who has access? What happens if it's breached or sold?` },
    { type: 'callout', id: id(), variant: 'warning', content: '**The Stakes Are High:** In most technology, a bug is annoying. In healthcare, a bug can cost someone their life. The margin for error is essentially zero.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'The 2019 healthcare algorithm was biased against Black patients. What do you think caused this, and whose responsibility is it to fix it?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Your Verdict' },
    { type: 'text', id: id(), content: `You've seen the case for AI in healthcare and the case against. Now it's time to form your own view.\n\nConsider:\n- Should AI be allowed to make diagnostic recommendations without a human doctor reviewing them?\n- Should patients always be told when AI was involved in their care?\n- If an AI misdiagnoses a patient, who is legally responsible — the hospital, the software company, or the doctor who trusted it?` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Take a position: Should AI be allowed to make the final call on medical diagnoses, or should humans always have the final say? Support your answer with at least one specific reason.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What is one safeguard you would put in place if you were designing an AI diagnostic tool for hospitals?' },
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
