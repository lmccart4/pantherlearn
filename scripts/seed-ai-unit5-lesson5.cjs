/**
 * AI Literacy Unit 5, Lesson 5: AI in Hiring
 * Order: 45 | Visible: false
 * Digitized printable → interactive Hiring Filter Lab (scored embed)
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const lesson = {
  id: 'ai-in-hiring',
  title: 'AI in Hiring: Will a Robot Decide Your Future Job?',
  order: 45,
  visible: false,
  dueDate: '2026-04-22',
  gradesReleased: true,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', items: [
      'Understand how AI screening tools are used in modern hiring',
      'Apply 6 real hiring filters to a realistic candidate pool and see who gets cut',
      'Identify the bias risks in automated hiring systems',
      'Evaluate what rights job applicants should have when AI is involved',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You apply for a job and never hear back. Later you find out an AI rejected your resume in 3 seconds without a human ever reading it. How do you feel? Is that fair?' },

    { type: 'section_header', id: 'sh-part1', label: 'Part 1: How AI Screens Job Applicants' },
    { type: 'text', id: id(), content: `Over 98% of Fortune 500 companies use some form of AI in their hiring process. Here's what that actually looks like:\n\n**Resume Screening**\nAI tools scan thousands of resumes in seconds, filtering for keywords, formatting, and patterns that previous successful hires had. If your resume doesn't match the pattern, it's rejected before a human sees it.\n\n**Video Interview Analysis**\nSome companies use AI to analyze recorded video interviews — assessing word choice, tone of voice, eye contact, and facial micro-expressions to predict job fit.\n\n**Personality & Skills Testing**\nAI-powered assessments score candidates on traits like "cognitive ability" or "culture fit" using games, typing patterns, or response times.\n\n**Social Media Screening**\nSome tools scrape public social media to assess a candidate's personality, values, and "risk factors."` },
    { type: 'callout', id: id(), content: '**Amazon\'s Cautionary Tale (2018):** Amazon built an AI resume screener trained on 10 years of their own hiring data. The problem: most of their past hires were men. The AI learned to downgrade resumes that included the word "women\'s" (as in "women\'s chess club") and penalized graduates of all-women\'s colleges. Amazon scrapped it.' },
    { type: 'question', id: id(), questionType: 'multiple_choice',
      prompt: 'What was the root cause of Amazon\'s biased hiring AI?',
      options: [
        'The engineers programmed it to discriminate against women',
        'It was trained on historical data that reflected past gender bias in hiring',
        'Women are less qualified for tech jobs',
        'The AI malfunctioned due to a coding error',
      ], correctIndex: 1 },

    { type: 'section_header', id: 'sh-lab', label: 'Part 2: Be the AI — Hiring Filter Lab' },
    { type: 'text', id: id(), content: `Time to run the filters yourself.\n\nIn the activity below, you'll play the role of an AI resume-screening system. You'll look at **8 real-looking resumes** and apply **6 filter rules** one at a time — exactly the kind of rules a corporate ATS uses today.\n\nFor each resume under each rule, decide: **Accept** or **Reject**. You'll get instant feedback after each round showing what the AI would actually do and what that rule really costs in the real world.\n\nAt the end, you'll see who survived all 6 filters. Pay attention to who *doesn't* make it.\n\n**This activity is scored** — you'll finish it to complete the lesson.` },
    { type: 'embed', id: 'hiring-filter-lab', url: 'https://pantherlearn.com/tools/ai-hiring-filter-lab.html', caption: 'Apply the 6 filter rules to 8 candidates. Instant feedback per round, bias reveal at the end.', height: 720, scored: true, weight: 5 },

    { type: 'section_header', id: 'sh-part3', label: 'Part 3: Who Gets Filtered Out (and Why It Matters)' },
    { type: 'text', id: id(), content: `The filters you just applied aren't hypothetical. Variations of every one of those rules are running right now in actual hiring systems. And they systematically disadvantage entire groups:\n\n**People with non-traditional paths** — career changers, those with gaps, self-taught candidates\n\n**People with disabilities** — video analysis tools may penalize atypical facial expressions, eye contact, or speech patterns associated with autism, anxiety, or hearing loss\n\n**People of color** — if past successful hires were mostly white, the AI encodes that pattern\n\n**People without insider knowledge** — if you don't know to use specific "ATS keywords," your resume gets auto-rejected even if you're qualified\n\nMany candidates never know why they were rejected. There's no appeal. No human to call. Just silence.` },
    { type: 'callout', id: id(), variant: 'warning', content: '**The Law is Behind:** The Equal Employment Opportunity Commission (EEOC) prohibits discrimination in hiring — but most AI hiring tools have never been audited for bias. New York City passed a law in 2023 requiring bias audits of AI hiring tools. It\'s one of the first laws of its kind.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Look back at the lab results. Which rule felt the most "defensible" when you read it, but actually caused the most damage? Name the rule and explain what made it look reasonable at first.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If AI hiring tools have been shown to discriminate against people with disabilities or people of color, should companies still be allowed to use them? What specific rules or safeguards would make it acceptable?' },

    { type: 'section_header', id: 'sh-part4', label: 'Part 4: Your Future, Your Rights' },
    { type: 'text', id: id(), content: `You will be job hunting in a world where AI screens most applications. Here's what you should know:\n\n- **Optimize for ATS:** Use keywords from the job description. Plain formatting. No graphics or tables that confuse the parser.\n- **You have rights:** In some states, you can request information about automated hiring decisions made about you.\n- **Push back:** If you're passed over and suspect bias, document it. Legal frameworks are being built to address this.\n- **Advocate:** Support policies that require bias audits and human review for hiring AI.` },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If you were applying for jobs in five years and an AI rejected you, what rights would you want to have? Be specific.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Is there any part of the hiring process where AI should NEVER be the decision-maker? Which part and why?' },
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
