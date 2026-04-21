/**
 * AI Literacy Unit 7, Lesson 3: What Jobs AI Will/Won't Replace
 * Order: 57 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'jobs-ai-will-wont-replace',
  title: 'Will AI Take Your Job? The Real Answer Is Complicated',
  order: 57,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Analyze which job categories are most and least vulnerable to AI automation',
      'Distinguish between jobs being "replaced" and being "transformed"',
      'Evaluate your own career interests in light of AI\'s trajectory',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Name a job you think AI will definitely replace and one you think AI will never replace. What\'s your reasoning for each?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: What the Research Actually Says' },
    { type: 'text', id: id(), content: `The headlines say "AI will replace 40% of jobs." The reality is more nuanced.\n\n**What research shows:**\nMcKinsey (2023): ~30% of work hours could be automated by 2030 — but "work hours" ≠ "jobs." Most jobs contain a mix of automatable and non-automatable tasks. AI tends to transform jobs rather than eliminate them wholesale.\n\nGoldman Sachs (2023): AI could automate 25% of work tasks in the US — but also estimated it could add 1.5% to annual GDP growth as new industries and roles emerge.\n\n**The historical pattern:**\nEvery major technological shift (printing press, industrial revolution, computers, internet) destroyed categories of jobs and created new ones that didn't exist before. The internet eliminated travel agents and video rental stores — and created social media managers, UX designers, and cloud engineers.\n\n**The real question isn't "will AI replace jobs?" It's "which tasks will AI automate, and what new tasks will emerge?"**` },
    { type: 'callout', id: id(), content: '**A Useful Frame:** AI is most likely to automate tasks that are: routine, rule-based, language-based (first pass), data-heavy but low-judgment. It\'s least likely to replace: physical dexterity in complex environments, deep human relationships, genuine creativity and taste, high-stakes ethical judgment.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'A radiologist reads X-rays for a living. AI can now read X-rays with high accuracy. What is the most likely outcome for radiologists?',
      options: [
        'All radiologists will be unemployed within 5 years',
        'Radiologists will shift toward higher-complexity cases, patient communication, and oversight of AI — the job transforms rather than disappears',
        'Nothing will change because hospitals will refuse to use AI',
        'Radiologists will become AI engineers',
      ], correctIndex: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: High Risk vs. Low Risk' },
    { type: 'text', id: id(), content: `**Higher automation risk (significant task overlap with AI):**\n- Data entry and processing\n- Basic customer service and call centers\n- First-draft content writing (marketing copy, reports)\n- Paralegal research (not legal judgment)\n- Junior financial analysis\n- Basic coding tasks (boilerplate, documentation)\n\n**Lower automation risk (require things AI struggles with):**\n- Skilled trades (plumber, electrician, carpenter) — require physical problem-solving in unpredictable environments\n- Therapists and counselors — human relationship is the product\n- Teachers — relationships, mentorship, judgment about individual students\n- Surgeons — physical precision + judgment in complex, unique situations\n- Artists and creative directors — taste and vision are human\n- Scientists — hypothesis formation, experimental design, interpretation\n- Managers and leaders — human motivation, politics, accountability\n\n**The twist:** Many "lower risk" jobs are lower-paid. Many "higher risk" jobs were higher-paid white-collar work. AI disruption is coming for different income brackets than previous automation waves.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Look at the high-risk list. Do any of those surprise you — a job you thought was "safe" that\'s actually vulnerable? What makes it vulnerable?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Building Career Resilience' },
    { type: 'text', id: id(), content: `The most resilient career strategy in an AI era isn\'t "pick the right job." It\'s building skills that compound over time and stay valuable regardless of what tools exist:\n\n**Durable skills:**\n- Critical thinking and judgment\n- Communication (written and verbal)\n- Building and maintaining relationships\n- Learning new tools and adapting quickly\n- Combining domain expertise with technological fluency\n\nThe workers who get displaced aren\'t always those whose tasks AI can do. They\'re the ones who can\'t adapt, can\'t learn the new tools, and can\'t articulate what value they bring that the AI doesn\'t.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Pick a career you\'re interested in. Map out: which parts of that job are most at risk of automation? Which parts are hardest for AI to replicate? What would the job look like in 10 years?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What is one skill you\'re building right now — in this class or elsewhere — that you think will be genuinely valuable in an AI-transformed economy? Why that skill?' },
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
