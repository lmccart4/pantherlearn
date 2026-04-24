/**
 * AI Literacy Unit 5, Lesson 6: AI in Policing
 * Order: 46 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-in-policing',
  title: 'AI in Policing: Keeping Us Safe or Watching Us All?',
  order: 46,
  visible: false,
  dueDate: '2026-04-23',
  gradesReleased: true,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Understand how predictive policing and facial recognition are used by law enforcement',
      'Analyze documented cases of harm caused by policing AI',
      'Evaluate the civil liberties tradeoffs of surveillance technology',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If a camera on your street could identify criminals and prevent crimes before they happen, would you want it there? What are you giving up in exchange?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: Two Technologies, Big Power' },
    { type: 'text', id: id(), content: `Law enforcement increasingly uses two AI-powered tools that raise serious civil liberties questions:\n\n**Facial Recognition**\nCameras in public spaces can match faces against databases of known criminals, missing persons, or persons of interest — in real time, at scale. Some cities have deployed cameras across entire downtown areas.\n\n**Predictive Policing**\nSoftware analyzes crime data to predict where crimes are likely to occur and who is likely to commit them. Police departments use these predictions to decide where to patrol and who to investigate.\n\nBoth tools promise more efficient policing. Both have demonstrated serious, documented flaws.` },
    { type: 'callout', id: id(), content: '**The NIST Study (2019):** The National Institute of Standards and Technology tested 189 facial recognition algorithms. Most had significantly higher false positive rates for Black women, Asian faces, and elderly people compared to white men. In real policing, a false positive means wrongly identifying someone as a criminal suspect.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'Robert Williams was arrested in Detroit in 2020 after facial recognition software incorrectly matched his photo to a shoplifting suspect. He spent 30 hours in jail. What does this case reveal about deploying AI in policing?',
      options: [
        'Facial recognition is accurate enough for law enforcement use',
        'AI errors can result in wrongful arrests, and the consequences fall disproportionately on Black Americans',
        'The police should have used better cameras',
        'AI tools should never be used in law enforcement for any reason',
      ], correctIndex: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: Predictive Policing\'s Feedback Loop' },
    { type: 'text', id: id(), content: `Predictive policing has a structural problem called a **feedback loop**. Before you read the explanation, run the simulation below — you'll see the loop emerge from your own decisions.\n\nYou'll play the role of the AI. Each round, you deploy 20 patrols across 4 precincts with different baseline crime rates. After each round, new crime reports come in — and those reports are influenced by where you patrolled. Play 3 rounds and watch what happens.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: '**Predict first, then play.** If you deploy 20 patrols each round — mostly to the precincts where reports are highest — what do you think will happen by Round 3? Will the high-crime and low-crime precincts stay similar to Round 0, get more similar to each other, or diverge further?',
      placeholder: 'My prediction: after 3 rounds I think precinct C will... and precinct D will... because...' },
    { type: 'embed', id: 'patrol-placement-lab', url: 'https://pantherlearn.com/tools/ai-patrol-placement-lab.html', caption: 'Drag 15 patrols into precincts A, B, C, D each round. After 3 rounds, see the feedback loop that predictive policing algorithms produce.', height: 900, scored: true, weight: 5 },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: '**After running the lab:** Compare what actually happened to your prediction above. What surprised you? Did the precincts converge, diverge, or something you didn\'t expect?',
      placeholder: 'My prediction said ___, but what actually happened was ___. The thing that surprised me was...' },
    { type: 'text', id: id(), content: `**Here's the pattern you just saw in action:**\n\n1. AI is trained on historical crime data\n2. Historical data reflects where police *patrolled* — which was often concentrated in minority neighborhoods\n3. AI predicts those same neighborhoods as high-crime\n4. Police patrol those neighborhoods more\n5. More patrols = more arrests = more data confirming the prediction\n6. The AI's bias is reinforced, not corrected\n\nThe algorithm doesn't measure crime. It measures *policing* — and then recommends more of the same.\n\nChicago's CLEAR database assigned "risk scores" to hundreds of thousands of people. People with high scores were visited by police proactively — not because they had done anything, but because the algorithm flagged them.` },
    { type: 'callout', id: id(), variant: 'warning', content: '**Surveillance Creep:** China uses a nationwide network of 500+ million cameras with AI facial recognition, linked to a "social credit" system that can restrict travel, employment, and schooling based on behavior scores. This is an extreme case — but the technology is the same.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Explain the feedback loop problem in predictive policing in your own words. Why can\'t you fix it just by making the algorithm "better"?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: '**Strategy pivot.** The AI\'s rule is "send more patrols where reports are highest." If you were the human police chief overriding the AI, what *different* rule would you use — and what would you have to give up in exchange? Name the trade-off explicitly.',
      placeholder: 'My rule would be ___. The trade-off is that ___ (what you\'d gain vs. what you\'d lose).' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Safety vs. Liberty' },
    { type: 'text', id: id(), content: `Several cities have banned facial recognition for policing entirely: San Francisco, Oakland, Boston, Portland. Others have expanded it.\n\nThe debate comes down to a fundamental tension:\n- **Safety argument:** These tools help catch criminals, find missing children, and prevent terrorism\n- **Liberty argument:** Mass surveillance creates a chilling effect — people change their behavior when they know they're being watched. Innocent people get wrongly flagged. Power gets abused.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Should cities be allowed to use facial recognition in public spaces? Make an argument for one side and acknowledge the strongest counterargument.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If you were wrongly identified as a suspect by a police AI and arrested, what accountability would you want from the city? From the software company?' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  const { safeLessonWrite } = require('./safe-lesson-write.cjs');
  for (const courseId of COURSE_IDS) {
    const result = await safeLessonWrite(db, courseId, lesson.id, lesson);
    console.log(`✅ ${courseId} — ${result.action} (preserved ${result.preserved} IDs)`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
