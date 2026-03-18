/**
 * AI Literacy Unit 5, Lesson 8: Synthesis Discussion
 * Order: 48 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-real-world-synthesis',
  title: 'AI in the Real World: Putting It All Together',
  order: 48,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Connect themes across the six domains we studied (healthcare, law, art, climate, hiring, policing, education)',
      'Identify the recurring tensions that appear across all AI deployments',
      'Form and defend a personal framework for evaluating AI in the real world',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Of the six domains we studied — healthcare, law, art, climate, hiring, policing, and education — which one did you find most surprising or concerning? Why?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: The Patterns Across Every Domain' },
    { type: 'text', id: id(), content: `After seven case studies, some patterns keep showing up. Recognizing them helps you evaluate any new AI application you encounter:\n\n**Pattern 1: Bias in, bias out**\nEvery AI system trained on historical human data inherits the biases of that history. Healthcare, hiring, policing — same problem, different domain.\n\n**Pattern 2: The black box problem**\nWhen AI can't explain its reasoning, there's no accountability, no appeal, and no correction mechanism. Secret algorithms in courtrooms, hiring, and classrooms all share this flaw.\n\n**Pattern 3: Unequal impact**\nAI tools often perform better for some groups than others. The groups who benefit least are usually also the ones with the least power to push back.\n\n**Pattern 4: Speed vs. caution**\nAI gets deployed fast — often before anyone has seriously studied the consequences. The harms catch up later.\n\n**Pattern 5: Who's responsible?**\nWhen AI causes harm, accountability gets diffused across companies, governments, and users. Nobody is clearly in charge.` },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'A city deploys a new AI tool to predict where potholes will form. The tool works well in wealthy neighborhoods but misses potholes in poorer areas because those streets weren\'t as well-documented historically. Which pattern does this illustrate?',
      options: [
        'Speed vs. caution',
        'The black box problem',
        'Bias in, bias out — plus unequal impact',
        'Who\'s responsible?',
      ], correct: 2 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: Building Your Framework' },
    { type: 'text', id: id(), content: `When you encounter a new AI application — in the news, in your community, in a job you'll have someday — you now have the vocabulary to evaluate it critically. Here are four questions worth asking:\n\n**1. Who benefits?**\nIs this tool making life better for the people it affects, or primarily for the company deploying it?\n\n**2. Who bears the risk?**\nIf the AI makes a mistake, who pays the price? Is it the same group that benefits?\n\n**3. Is there accountability?**\nCan the AI's decisions be explained, challenged, and corrected? Is there a human in the loop?\n\n**4. What are the alternatives?**\nIs AI actually better than the existing approach — or just cheaper and faster for the people deploying it?` },
    { type: 'callout', id: id(), content: '**The Goal:** You don\'t need to be anti-AI or pro-AI. You need to be *thoughtful* about AI — able to recognize when it\'s being deployed well and when it\'s being deployed recklessly.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Apply your framework to one of the domains we studied. Use all four questions (Who benefits? Who bears the risk? Is there accountability? What are the alternatives?) to evaluate that AI application.' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Your Position' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Across everything we studied, what is the single most important thing society needs to do to make sure AI is used for good in the real world? Defend your answer.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Write a two-sentence "AI in the Real World" principle — a rule you\'d want every company deploying AI to follow. Make it specific enough that you could tell whether a company was actually following it.' },
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
