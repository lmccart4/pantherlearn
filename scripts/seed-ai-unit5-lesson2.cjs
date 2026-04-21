/**
 * AI Literacy Unit 5, Lesson 2: AI in Law (Bias in Sentencing)
 * Order: 42 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-in-law',
  title: 'AI in the Courtroom: When Algorithms Decide Your Fate',
  order: 42,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Understand how risk assessment algorithms are used in the criminal justice system',
      'Analyze evidence of racial bias in AI sentencing tools',
      'Evaluate whether algorithmic decision-making belongs in the courtroom',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Should a judge be allowed to use a computer program\'s score to help decide how long someone goes to prison? What are the pros and cons?' },
    { type: 'section_header', id: 'sh-part1', label: 'Part 1: COMPAS — The Algorithm That Sentences People' },
    { type: 'text', id: id(), content: `In courts across the United States, judges use a tool called **COMPAS** (Correctional Offender Management Profiling for Alternative Sanctions) to help make decisions about bail, parole, and sentencing.\n\nCOMPAS takes in information about a defendant — age, criminal history, answers to a questionnaire — and spits out a "risk score" from 1 to 10. High score = high risk of reoffending. Low score = low risk.\n\nJudges aren't required to follow the score, but studies show it heavily influences their decisions. In some states, the score is part of the official sentencing report.\n\n**The problem:** Nobody outside the company that makes COMPAS knows exactly how it calculates the score. It's a black box — proprietary code, kept secret.` },
    { type: 'callout', id: id(), content: '**ProPublica Investigation (2016):** Journalists analyzed COMPAS scores for 7,000 people in Florida. Their finding: Black defendants were nearly twice as likely as white defendants to be falsely flagged as high-risk for future crimes. White defendants were more likely to be incorrectly labeled low-risk.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'If COMPAS uses factors like neighborhood, employment, and family history — not race directly — why might it still produce racially biased results?',
      options: [
        'Because the people who built it were racist',
        'Because those factors correlate with race due to historical inequality, so the algorithm learns to proxy race',
        'Because Black defendants always answer the questionnaire differently',
        'Bias is impossible when you remove race from the inputs',
      ], correctIndex: 1 },
    { type: 'section_header', id: 'sh-part2', label: 'Part 2: The Right to Challenge an Algorithm' },
    { type: 'text', id: id(), content: `In 2016, a Wisconsin man named Eric Loomis was sentenced to six years in prison. His COMPAS score — which he was never allowed to see the methodology behind — was cited by the judge.\n\nLoomis appealed, arguing that using a secret algorithm in sentencing violated his due process rights. He argued: how can you challenge a decision when you don't know how it was made?\n\nThe Wisconsin Supreme Court ruled against him. They said judges could use COMPAS as one factor among many.\n\n**The question this raises:** In America, you have the right to confront the evidence against you. If an algorithm scores you as dangerous and you can't see how it works, have your rights been violated?` },
    { type: 'callout', id: id(), variant: 'warning', content: '**The Company\'s Defense:** Northpointe (the maker of COMPAS) says their algorithm doesn\'t use race as an input, so it can\'t be racist. Critics say that\'s exactly the problem — it uses factors that are proxies for race without acknowledging it.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Eric Loomis argued he couldn\'t challenge a sentence influenced by an algorithm he couldn\'t see. Do you think secret algorithms should be allowed in courts? Why or why not?' },
    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Who\'s Responsible?' },
    { type: 'text', id: id(), content: `When an algorithm influences a prison sentence, the chain of accountability gets murky:\n\n- The **software company** built the tool and keeps it secret\n- The **judge** used the score but also had other information\n- The **state** adopted the tool and requires its use\n- The **training data** reflects decades of biased policing and prosecution\n\nIf a person serves extra years in prison because of a biased algorithm, who is responsible? Who do they sue? Who apologizes?` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If you were a lawmaker, what rules would you put in place for AI tools used in criminal sentencing? List at least two specific requirements.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'This lesson focused on bias against Black defendants. Can you think of other groups who might be disadvantaged by algorithmic risk assessment? Explain your reasoning.' },
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
