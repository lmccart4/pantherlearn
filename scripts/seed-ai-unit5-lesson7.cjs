/**
 * AI Literacy Unit 5, Lesson 7: AI in Education
 * Order: 47 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-in-education',
  title: 'AI in Education: Personalized Learning or Surveillance Classroom?',
  order: 47,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Identify specific ways AI is being deployed in schools',
      'Evaluate both the potential and the risks of AI in education',
      'Reflect on your own experience as a student in an AI-era classroom',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You\'re literally in a class that uses AI tools right now. What\'s one way you\'ve noticed AI changing how you learn or how this class works?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: AI in the Classroom — What\'s Already Here' },
    { type: 'text', id: id(), content: `AI is already reshaping education in ways most students don't realize:\n\n**Personalized Learning Platforms**\nTools like Khan Academy's Khanmigo, DuoLingo, and many tutoring apps use AI to adapt difficulty, pacing, and content to each student in real time. They remember what you got wrong last week.\n\n**Automated Grading**\nAI can grade multiple choice, short answer, and even essays. Some tools flag inconsistencies or provide feedback. This frees teacher time — but raises questions about whether a machine can evaluate nuanced writing.\n\n**AI Tutors**\nSome schools are deploying AI chatbots that can answer student questions 24/7, explain concepts multiple ways, and provide instant feedback. Studies show 1:1 tutoring dramatically improves outcomes — AI makes it scalable.\n\n**Proctoring and Cheating Detection**\nAI proctoring tools watch students during online tests via webcam — tracking eye movement, typing patterns, and behavior to flag suspected cheating.` },
    { type: 'callout', id: id(), content: '**The Pandemic Effect:** Remote learning during COVID-19 dramatically accelerated AI adoption in schools. AI proctoring tools went from niche to mainstream almost overnight — often without students understanding what data was being collected about them.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'What is the main advantage of AI tutors over traditional classroom instruction?',
      options: [
        'AI tutors are always more accurate than human teachers',
        'AI tutors can provide personalized, 1:1 attention at scale to every student simultaneously',
        'AI tutors eliminate the need for human teachers entirely',
        'AI tutors never make mistakes when explaining concepts',
      ], correct: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: The Problems Nobody\'s Fully Solved' },
    { type: 'text', id: id(), content: `**AI Proctoring and Privacy**\nProctoring tools collect biometric data — your face, your eye movements, your behavioral patterns. Students have reported false accusations of cheating. One student with ADHD was repeatedly flagged for "suspicious" eye movement. A student with anxiety was flagged for atypical typing patterns.\n\n**The Cheating Arms Race**\nChatGPT and other AI tools make it trivially easy to generate essays, solve problems, and complete assignments. AI detection tools (like Turnitin's AI detector) exist but have a meaningful false positive rate — flagging original student writing as AI-generated.\n\n**Equity Gaps**\nAI tutors require reliable internet and devices. Students in under-resourced schools may have less access. Well-off students may have better AI tools for homework than their peers — widening existing gaps.\n\n**Dependence vs. Learning**\nIf AI explains every problem the moment you get stuck, do you ever develop the struggle tolerance that builds real understanding? There's a difference between AI helping you learn and AI doing the learning for you.` },
    { type: 'callout', id: id(), variant: 'warning', content: '**The Detection Problem:** Studies show current AI writing detectors have false positive rates around 1–9% for native English speakers — and significantly higher for non-native English writers. A false positive on an academic integrity violation can have serious consequences for a student.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Should schools use AI proctoring tools that watch students via webcam during tests? What would you need to be told about how that data is used?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: The Student Perspective' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Describe the ideal role of AI in a classroom — from your perspective as a student. What would help you learn? What would feel invasive or unfair?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You\'re in an AI literacy class. Why does that matter? What can you do with what you know that someone who hasn\'t taken this class can\'t?' },
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
