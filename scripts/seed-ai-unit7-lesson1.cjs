/**
 * AI Literacy Unit 7, Lesson 1: Career Paths in AI
 * Order: 55 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'careers-in-ai',
  title: 'Careers in AI: What Jobs Actually Exist (and What They Pay)',
  order: 55,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Identify specific careers in and around AI across technical and non-technical paths',
      'Understand what education and skills different AI careers require',
      'Connect your own interests to realistic AI-era career paths',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What do you think you might want to do after high school? How much has AI factored into your thinking about future careers — if at all?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: The AI Job Landscape' },
    { type: 'text', id: id(), content: `When people say "AI careers," they usually picture one thing: software engineer at a tech company. The reality is much broader.\n\n**Technical Roles (require CS/math background):**\n- **ML Engineer** — builds and trains machine learning models. Median salary: $150K+\n- **Data Scientist** — finds patterns in data to drive decisions. Median: $120K+\n- **AI Research Scientist** — pushes the field forward with novel methods. Usually requires PhD. Median: $180K+\n- **MLOps Engineer** — keeps AI systems running reliably in production. Median: $140K+\n\n**Semi-Technical Roles (require some tech fluency):**\n- **AI Product Manager** — decides what AI products get built and why. Median: $160K+\n- **Data Analyst** — interprets data outputs, creates visualizations. Median: $80K+\n- **Prompt Engineer** — designs effective prompts for enterprise AI systems. Emerging role.\n\n**Non-Technical Roles (AI literacy required, not coding):**\n- **AI Ethics Officer** — ensures company AI is fair, transparent, legal\n- **AI Policy Analyst** — works in government or think tanks on AI regulation\n- **AI Trainer / RLHF Specialist** — teaches AI systems by rating outputs\n- **AI Journalist / Communicator** — explains AI to the public\n- **Domain Expert + AI** — doctor, lawyer, teacher, designer who is also AI-fluent` },
    { type: 'callout', id: id(), content: '**The Most Valuable Combo:** Deep expertise in any field (medicine, law, education, design, science) + genuine AI fluency. This combination is rare and will be increasingly valuable as every industry deploys AI.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'Which statement best describes the AI job market?',
      options: [
        'Only people who can code will have careers in AI',
        'AI careers span technical and non-technical fields — nearly every industry needs people who understand AI',
        'AI will eliminate all jobs within 10 years',
        'AI jobs are only available at large tech companies like Google and OpenAI',
      ], correct: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: What These Jobs Actually Require' },
    { type: 'text', id: id(), content: `**The technical path:** If you want to build AI systems, you need a strong foundation in math (statistics, linear algebra, calculus) and programming (Python is the language of ML). A CS or data science degree is the traditional route. Bootcamps and self-teaching are increasingly viable for some roles.\n\n**The hybrid path:** Many high-value AI roles need someone who understands both the technology and a specific domain. A nurse who understands machine learning can evaluate AI diagnostic tools in ways a pure engineer can't. A lawyer who understands AI can navigate regulation that a pure policy person can't.\n\n**The non-technical path:** AI ethics, policy, communications, and training roles need people who can think critically about AI — which is exactly what this course is building. These roles require writing, research, analysis, and judgment.\n\n**The entrepreneurship path:** The people using no-code tools to build AI-powered businesses don't need traditional credentials — they need ideas, hustle, and the ability to identify what problems AI can solve.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Which path (technical, hybrid, non-technical, or entrepreneurship) most aligns with your interests and strengths? What would you need to develop to pursue it seriously?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Your Path' },
    { type: 'text', id: id(), content: `You don't need to have it figured out. But you do need to be thinking intentionally.\n\nSome things worth considering:\n- What subjects do you actually enjoy? (That's a real signal — follow it.)\n- What problems in the world do you care about? (That's where your motivation will come from.)\n- Where do you see AI being deployed in the field you care about? (That's your opportunity.)\n\nThe students who will do best in the AI era aren't necessarily the ones who know the most about AI right now. They're the ones who stay curious, keep learning, and know how to think critically about technology — which is exactly what you've been practicing.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Describe a career path that combines something you genuinely care about with AI. It doesn\'t have to be a job title that exists yet. What would you be doing? Who would you be helping?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What is one concrete step you could take in the next year — a class, a project, a skill — that would move you toward a career that interests you in the AI era?' },
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
