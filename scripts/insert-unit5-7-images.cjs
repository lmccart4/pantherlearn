/**
 * Inserts pre-generated images into AI Literacy Units 5-7 lessons
 * Writes to all 4 AI Literacy sections (P4/P5/P7/P9)
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const uid = () => uuidv4().split('-')[0];

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj',
  'DacjJ93vUDcwqc260OP3',
  'M2MVSXrKuVCD9JQfZZyp',
  'fUw67wFhAtobWFhjwvZ5',
];

const BASE_URL = 'https://firebasestorage.googleapis.com/v0/b/pantherlearn-d6f7c.firebasestorage.app/o/lesson-images%2Fgeneral%2F';
const url = (filename) => `${BASE_URL}${filename}?alt=media`;

// Map lessonId → image block to insert (inserted after section_header matching label, or after first text block)
const INSERTS = [
  { lessonId: 'ai-in-healthcare',          after: 'section_header', label: 'Part 1: What AI Is Already Doing in Medicine', image: { url: url('ai-literacy-healthcare-ai-diagnosis.jpg'), alt: 'AI analyzing a medical scan with a neural network highlighting detected areas', caption: 'AI systems can analyze medical images to detect disease — sometimes faster and more accurately than human radiologists.' } },
  { lessonId: 'ai-in-law',                 after: 'section_header', label: 'Part 1: COMPAS — The Algorithm That Sentences People', image: { url: url('ai-literacy-law-algorithm-justice.jpg'), alt: 'A scale of justice with a circuit board weighing against a human silhouette', caption: 'When algorithms influence sentencing, the question of fairness becomes deeply complicated.' } },
  { lessonId: 'ai-in-art',                 after: 'section_header', label: 'Part 1: How AI Art Actually Works', image: { url: url('ai-literacy-art-human-vs-ai-creation.jpg'), alt: 'Split image of human hand painting versus AI neural network generating art', caption: 'AI image generators learn from billions of human-created images — raising questions about authorship and consent.' } },
  { lessonId: 'ai-in-climate',             after: 'section_header', label: 'Part 1: AI as a Climate Tool', image: { url: url('ai-literacy-climate-ai-applications.jpg'), alt: 'Earth globe with AI data streams connecting to climate monitoring applications', caption: 'AI is being deployed across the climate fight — from weather forecasting to carbon capture research.' } },
  { lessonId: 'ai-in-hiring',              after: 'section_header', label: 'Part 1: How AI Screens Job Applicants', image: { url: url('ai-literacy-hiring-resume-filter.jpg'), alt: 'Many resumes flowing into an algorithmic funnel with only a few passing through', caption: 'AI screening tools process thousands of applications in seconds — filtering candidates before any human reviews them.' } },
  { lessonId: 'ai-in-policing',            after: 'section_header', label: 'Part 1: Two Technologies, Big Power', image: { url: url('ai-literacy-policing-surveillance-grid.jpg'), alt: 'City grid viewed from above with surveillance camera network and recognition circles overlaid', caption: 'AI-powered facial recognition systems can monitor public spaces at scale — raising significant civil liberties questions.' } },
  { lessonId: 'ai-in-education',           after: 'section_header', label: 'Part 1: AI in the Classroom — What\'s Already Here', image: { url: url('ai-literacy-education-personalized-learning.jpg'), alt: 'Student at a desk with an adaptive AI learning interface showing personalized content paths', caption: 'AI tutoring platforms adapt to each student in real time — making 1:1 attention possible at scale.' } },
  { lessonId: 'ai-real-world-synthesis',   after: 'section_header', label: 'Part 1: The Patterns Across Every Domain', image: { url: url('ai-literacy-synthesis-connected-domains.jpg'), alt: 'Six interconnected hexagonal tiles representing different AI application domains', caption: 'Across every domain — healthcare, law, art, climate, hiring, policing — the same patterns of bias, opacity, and unequal impact appear.' } },
  { lessonId: 'prompt-engineering-deep-dive', after: 'section_header', label: 'Part 1: Why Prompting Is a Skill', image: { url: url('ai-literacy-craft-framework-diagram.jpg'), alt: 'The CRAFT framework showing five building blocks: Context, Role, Action, Format, Tone', caption: 'CRAFT: Context, Role, Action, Format, Tone — a system for building prompts that consistently get high-quality results.' } },
  { lessonId: 'ai-as-research-partner',    after: 'section_header', label: 'Part 1: What AI Is Good at in Research', image: { url: url('ai-literacy-research-human-ai-partnership.jpg'), alt: 'Researcher with books on the left and AI interface on the right, connected by flowing information exchange', caption: 'Effective AI-assisted research combines AI speed with human judgment about what matters and what to trust.' } },
  { lessonId: 'ai-writing-line',           after: 'section_header', label: 'Part 1: A Spectrum, Not a Binary', image: { url: url('ai-literacy-writing-assistance-spectrum.jpg'), alt: 'A spectrum bar showing the range from human-written to AI-generated with a marker in the gray zone', caption: 'AI assistance in writing exists on a spectrum — the ethical questions live in the middle, not the extremes.' } },
  { lessonId: 'building-with-ai',          after: 'section_header', label: 'Part 1: The No-Code Revolution', image: { url: url('ai-literacy-no-code-building.jpg'), alt: 'Hands assembling colorful building blocks that form into a finished app interface', caption: 'No-code AI tools let anyone build functional products — the bottleneck has shifted from technical skill to ideas and judgment.' } },
  { lessonId: 'ai-tool-ethics',            after: 'section_header', label: 'Part 2: Three Ethical Tests', image: { url: url('ai-literacy-ethics-three-tests.jpg'), alt: 'Three panels representing transparency, learning, and harm as ethical tests for AI use', caption: 'Three tests for ethical AI use: Would you be transparent about it? Did it help you learn? Does it harm anyone else?' } },
  { lessonId: 'personal-ai-workflow',      after: 'section_header', label: 'Part 1: What a Workflow Actually Is', image: { url: url('ai-literacy-workflow-trigger-action-guardrail.jpg'), alt: 'Circular workflow diagram with trigger, action, and guardrail stages surrounding a human figure', caption: 'A sustainable AI workflow has three parts: a clear trigger, a specific action, and a guardrail to keep your thinking sharp.' } },
  { lessonId: 'careers-in-ai',             after: 'section_header', label: 'Part 1: The AI Job Landscape', image: { url: url('ai-literacy-careers-ai-landscape.jpg'), alt: 'A tree with branches representing diverse AI career paths from technical to non-technical roles', caption: 'AI careers span a much wider range than software engineering — from healthcare and policy to education and creative fields.' } },
  { lessonId: 'human-ai-collaboration',    after: 'section_header', label: 'Part 1: Two Models of Working With AI', image: { url: url('ai-literacy-centaur-cyborg-collaboration.jpg'), alt: 'Two figures: a centaur representing separate human-AI roles, and a cyborg representing fused human-AI integration', caption: 'Centaur: distinct roles, clean handoffs. Cyborg: deeply integrated, tight feedback loop. Both are valid — the question is when to use each.' } },
  { lessonId: 'jobs-ai-will-wont-replace', after: 'section_header', label: 'Part 2: High Risk vs. Low Risk', image: { url: url('ai-literacy-jobs-automation-risk.jpg'), alt: 'Two columns of job icons: high automation risk on the left in red, low risk on the right in green', caption: 'AI is more likely to transform jobs than eliminate them outright — but the disruption is real and unevenly distributed.' } },
  { lessonId: 'ai-policy-regulation',      after: 'section_header', label: 'Part 1: The Global Policy Race', image: { url: url('ai-literacy-policy-global-regulation.jpg'), alt: 'World map showing three regions with different AI regulatory approaches', caption: 'Three major approaches to AI regulation: the EU\'s comprehensive rules, the US\'s fragmented landscape, and China\'s state-directed model.' } },
  { lessonId: 'ai-futures-choice-project', after: 'section_header', label: 'Choose Your Track', image: { url: url('ai-literacy-choice-four-paths.jpg'), alt: 'Four colorful pathways branching from a central point, each leading to a different creative project type', caption: 'Four ways to demonstrate what you know — debate, research, design, or creative writing. The choice is yours.' } },
  { lessonId: 'course-reflection-synthesis', after: 'section_header', label: 'Before We Begin', image: { url: url('ai-literacy-reflection-journey.jpg'), alt: 'A winding path from a figure surrounded by simple questions to a figure surrounded by rich interconnected AI concepts', caption: 'Looking back at how far your understanding has come is itself a form of learning.' } },
];

async function insertImage(courseId, lessonId, insertSpec) {
  const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
  const snap = await ref.get();
  if (!snap.exists) { console.log(`  SKIP — not found: ${courseId}/${lessonId}`); return; }

  const data = snap.data();
  const blocks = [...(data.blocks || [])];

  // Check if image already inserted
  if (blocks.some(b => b.url === insertSpec.image.url)) {
    console.log(`  ✓ Already has image: ${lessonId}`);
    return;
  }

  // Find insertion point: after the matching section_header
  let insertIdx = -1;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'section_header' && blocks[i].label === insertSpec.label) {
      insertIdx = i + 1;
      break;
    }
  }

  // Fallback: after first text block
  if (insertIdx === -1) {
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'text') { insertIdx = i + 1; break; }
    }
  }

  if (insertIdx === -1) insertIdx = blocks.length;

  const imageBlock = {
    type: 'image',
    id: uid(),
    url: insertSpec.image.url,
    alt: insertSpec.image.alt,
    caption: insertSpec.image.caption,
  };

  blocks.splice(insertIdx, 0, imageBlock);
  await ref.update({ blocks });
  console.log(`  ✅ Inserted image into ${lessonId} (${courseId.substring(0,8)})`);
}

async function main() {
  let total = 0;
  for (const spec of INSERTS) {
    for (const courseId of COURSE_IDS) {
      await insertImage(courseId, spec.lessonId, spec);
      total++;
    }
  }
  console.log(`\nDone — processed ${total} lesson/section combinations`);
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
