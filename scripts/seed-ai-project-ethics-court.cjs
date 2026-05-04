/**
 * AI Literacy Project: AI Ethics Court
 * Order: 74 | Visible: false | Unit: Course Projects
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-ethics-court.jpg';

const lesson = {
  id: 'ai-project-ethics-court',
  title: 'AI Ethics Court: Try a Real AI Controversy',
  unit: 'Course Projects',
  order: 74,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Research a real AI controversy and identify the strongest arguments on both sides',
      'Construct a legal-style argument supported by evidence, precedent, and ethical reasoning',
      'Argue a position you may not personally hold and engage honestly with the harm it produces',
      'Evaluate competing claims as a juror and write a reasoned verdict with a written opinion',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Pick an AI story from the news that bothered you. Who got hurt? Who made the decision that caused the harm? If you had to assign blame, where would it go — and why is that hard?' },

    { type: 'image', id: id(), url: HERO_URL, alt: 'A wood-paneled courtroom with a "VS." backdrop and an AI server rack in the witness box — students argue an AI controversy as a legal case.' },

    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    { type: 'text', id: id(), content: `You are about to put a real AI controversy on trial.\n\nThe class will be split into trial teams. Each team takes on a real, ongoing AI controversy — not a hypothetical, not a movie plot, an actual lawsuit, scandal, or harm that's playing out right now. Inside each team there are four roles: **prosecution**, **defense**, **expert witnesses**, and **jury**. You research, prepare, and run the trial in front of the rest of the class. At the end, the jury deliberates and writes a verdict. Everyone writes a personal opinion explaining how they'd have voted.\n\nThe point isn't to "win." The point is that AI ethics doesn't have clean answers. When you're forced to argue the OTHER side — the side you didn't pick, the side you don't agree with — you stop pretending the easy answer is the right one. You have to deal with the hard parts. That's the work.` },
    { type: 'callout', id: id(), content: '**Project goal: Run a real trial on a real AI controversy, argue both sides honestly, and write a verdict you can defend even to people who disagree with you.**' },

    { type: 'case_cards', id: id(), title: 'The Cases', cards: [
      { id: 'card-itutor', label: '1', title: 'EEOC v. iTutorGroup (Hiring Discrimination)',
        body: 'A federal AI hiring tool screened out applicants over 55 (women) and over 60 (men). EEOC sued; iTutorGroup settled for $365,000. Real Title VII / ADEA case. Try the company and the vendor.' },
      { id: 'card-nyt', label: '2', title: 'NYT v. OpenAI (Training Data / Copyright)',
        body: 'The New York Times sued OpenAI and Microsoft for training GPT models on millions of Times articles without permission. Argue fair use vs. mass infringement of a working business.' },
      { id: 'card-uber-av', label: '3', title: 'Uber Self-Driving Fatality (2018)',
        body: 'An Uber autonomous test vehicle struck and killed Elaine Herzberg in Tempe, AZ. NTSB found system + human-operator failures. Try the safety driver, Uber, the city, the software team — pick the most accountable.' },
      { id: 'card-deepfake', label: '4', title: 'Deepfake Fraud / Identity Theft',
        body: 'A deepfake of a real CEO authorizes a wire transfer; a deepfake of a parent\'s voice triggers a ransom payment. Who is liable: the user, the platform, the model maker, the bank that wired the funds?' },
      { id: 'card-policing', label: '5', title: 'Predictive Policing Harm',
        body: 'A predictive policing tool sends extra patrols into the same neighborhoods, more arrests get logged there, the model gets "confirmed," the loop tightens. Try the vendor, the chief, or the data scientists.' },
      { id: 'card-cheating', label: '6', title: 'Generative AI Cheating in Schools',
        body: 'A senior uses ChatGPT to draft a major college-application essay. The teacher fails them. Was it cheating, or was the assignment broken? Try the student, the teacher, and the policy.' },
      { id: 'card-voicescam', label: '7', title: 'AI Voice Scam — Family Wire Fraud',
        body: 'A scammer clones a grandparent\'s voice and convinces the family to wire $15,000 in a fake "kidnapping." Argue who pays the family back: the scammer, the AI vendor, the bank, the platform that hosted the audio sample.' },
    ]},

    { type: 'case_cards', id: id(), title: 'The Roles (Inside Each Team)', cards: [
      { id: 'card-prosecution', label: 'P', title: 'Prosecution Team (2–3 students)',
        body: 'Argue the accused party is liable. Build the case for harm with specific facts, real precedent, and a clear ethical theory of why this person/company should be held responsible.' },
      { id: 'card-defense', label: 'D', title: 'Defense Team (2–3 students)',
        body: 'Argue the accused party is NOT liable. Steelman the most realistic legal and ethical defense — fair use, due care, contributory negligence by another party, gaps in current law.' },
      { id: 'card-expert', label: 'E', title: 'Expert Witnesses (1–2 students)',
        body: 'Research the technology and the relevant law. Translate it into plain language. Testify under questioning from BOTH sides. You must stay neutral — no advocacy.' },
      { id: 'card-jury', label: 'J', title: 'Jury (1–2 students or rest of class)',
        body: 'Listen, take structured notes, deliberate in front of the class, deliver a verdict, and write the official opinion (300–400 words) explaining what evidence mattered most.' },
    ]},

    { type: 'external_link', id: id(),
      title: 'EEOC v. iTutorGroup (AI hiring discrimination settlement)',
      url: 'https://www.eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit',
      description: 'Real federal case where an AI hiring tool was sued for age discrimination. Use as evidence for the hiring-algorithm case.' },
    { type: 'external_link', id: id(),
      title: 'NYT v. OpenAI (AI training data lawsuit)',
      url: 'https://nytco-assets.nytimes.com/2023/12/NYT_Complaint_Dec2023.pdf',
      description: 'Actual filed complaint. Use as evidence for the copyright/training-data case.' },
    { type: 'external_link', id: id(),
      title: 'Uber self-driving fatality — NTSB report',
      url: 'https://www.ntsb.gov/investigations/AccidentReports/Reports/HAR1903.pdf',
      description: 'Federal investigation of the 2018 Uber autonomous vehicle pedestrian death. Hard evidence for the AV case.' },

    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },
    { type: 'checklist', id: id(), title: 'Deliverables (everyone in the team)', items: [
      'Case brief (1 page, individual) — facts, parties, what\'s at stake, in your own words',
      'Role-specific document (prosecution/defense → opening + closing statements; experts → witness prep doc; jury → deliberation notes + 300–400 word written verdict)',
      'Personal opinion paper (1 page, individual) — written AFTER the trial, names the strongest opposing argument and what changed (or didn\'t)',
      'Live trial performance — ~25–30 minutes total, in front of the class, in role',
      'Final group package submitted as one Google Doc/Slides link with every team member\'s name and role on page 1',
    ]},
    { type: 'callout', id: id(), content: '**The trial itself runs ~25–30 min:** prosecution opening (2 min) → defense opening (2 min) → expert witness testimony with cross-examination (8–10 min) → prosecution closing (2 min) → defense closing (2 min) → jury deliberation (5 min) → verdict + opinion read aloud (2 min).' },

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Case selection + research kickoff (1 period)**\n- Teams form, pick a case, assign roles.\n- Everyone reads the same starter source on the case (provided).\n- Each role drafts a one-paragraph "what I think this case is about."\n\n**Day 2 — Deep research (1 period)**\n- Prosecution + Defense: build a list of 5–7 facts in your favor and 3 likely counter-arguments.\n- Experts: read 2 technical sources and write a plain-language explanation a 9th grader could follow.\n- Jury: read both sides' early notes and write 5 questions you wish someone would answer.\n\n**Day 3 — Drafting (1 period)**\n- Prosecution + Defense: draft opening + closing.\n- Experts: finalize witness prep doc, anticipate cross-examination questions.\n- Jury: write a "rubric" for how you'll evaluate the arguments — what would convince you, what wouldn't.\n\n**Day 4 — Rehearsal + revision (1 period)**\n- Prosecution + Defense practice their statements out loud, time them.\n- Experts run a mock cross-examination with both sides.\n- Jury reviews the ground rules. Teacher pulls each role aside for a 3-minute coaching check.\n\n**Day 5 — TRIAL DAY (1 period)**\n- Run the trial in front of the class.\n- Other teams take observer notes — they'll be the appellate court for one team's verdict.\n- Jury delivers verdict + opinion at the end.\n\n**Day 6 — Personal opinion + reflection (homework or last 20 min)**\n- Everyone writes their personal opinion paper.\n- Submit final group package (one student submits, all names listed).` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(), title: 'Project Rubric', totalPoints: 100, criteria: [
      { name: 'Case Knowledge', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Facts of the case are correct, specific, and current. Shows the student researched the real lawsuit/incident, not a vague summary. Names parties, dates, and key legal claims accurately.' },
        { score: 3, label: 'Proficient', description: 'Facts mostly accurate. One or two details fuzzy but the core of the case is right.' },
        { score: 2, label: 'Developing', description: 'General gist of the case but errors that would matter in a real courtroom — wrong party, wrong year, missing key fact.' },
        { score: 1, label: 'Beginning', description: 'Confused or made-up facts. Reads like the student didn\'t actually look up the case.' },
      ]},
      { name: 'Quality of Argument', weight: 25, levels: [
        { score: 4, label: 'Exemplary', description: 'Argument is clear, tightly reasoned, supported by at least 2 specific pieces of evidence (a real fact, a precedent, an ethical principle). Anticipates and addresses the strongest counter-argument.' },
        { score: 3, label: 'Proficient', description: 'Clear argument with evidence but counter-argument not fully addressed.' },
        { score: 2, label: 'Developing', description: 'Argument exists but is mostly opinion or feeling, not evidence.' },
        { score: 1, label: 'Beginning', description: 'No argument or just emotional appeal.' },
      ]},
      { name: 'Engagement With the Other Side', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Honestly grapples with the strongest version of the opposing case. Doesn\'t strawman. Concedes any point that\'s actually true.' },
        { score: 3, label: 'Proficient', description: 'Acknowledges the other side but doesn\'t engage with the strongest version.' },
        { score: 2, label: 'Developing', description: 'Mostly dismisses or mocks the other side.' },
        { score: 1, label: 'Beginning', description: 'Treats the other side as obviously wrong; no engagement.' },
      ]},
      { name: 'Performance / Professionalism', weight: 15, levels: [
        { score: 4, label: 'Exemplary', description: 'Spoke clearly, paced well, used courtroom register. Stayed in role. Respected the format start to finish.' },
        { score: 3, label: 'Proficient', description: 'Solid delivery, minor pacing or clarity issues.' },
        { score: 2, label: 'Developing', description: 'Read off paper without engagement OR broke role / format mid-trial.' },
        { score: 1, label: 'Beginning', description: 'Unprepared or disruptive.' },
      ]},
      { name: 'Personal Opinion Paper', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Specific, honest, identifies the strongest opposing argument by name, explains what changed (or didn\'t) and why. Goes beyond "both sides have a point."' },
        { score: 3, label: 'Proficient', description: 'Honest reflection but stays surface-level.' },
        { score: 2, label: 'Developing', description: 'Restates the verdict without real engagement.' },
        { score: 1, label: 'Beginning', description: 'Missing or generic.' },
      ]},
    ]},

    { type: 'section_header', id: 'sh-exemplars', label: 'Exemplars: Strong vs. Weak' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Both versions are the SAME assignment: the prosecution\'s opening statement in the Hiring Algorithm Discrimination case. One does the work. One doesn\'t. Read both, then notice what specifically separates them.',
      strong: {
        label: 'Strong — prosecution opening (Hiring Algorithm case)',
        body: '*Imagine this read aloud, slowly, in a courtroom voice.*\n\n"Your Honor, members of the jury — Marcus Rivera applied for 47 jobs in six months. He has a 3.8 GPA from Rutgers, three years of customer service experience, and references from two managers who would hire him back tomorrow. He never got a single interview. Not one.\n\nWhat Marcus didn\'t know — what no applicant knew — is that 31 of those 47 companies used the same AI screening tool, built by a company called HireRight Solutions. That tool was trained on ten years of past hiring decisions at majority-white companies. It learned, from that data, that successful candidates \'sound a certain way\' on a resume. It learned that the word \'women\'s\' — as in \'women\'s chess club\' or \'women\'s basketball\' — was a negative signal. It learned that names common in Black and Latino communities scored lower than names common in white communities, even with identical qualifications.\n\nThe defense will tell you the algorithm is \'objective.\' They will tell you it doesn\'t \'see race.\' They will tell you it just looks at patterns. And that is exactly the problem. When you train a machine on a discriminatory past, you don\'t get a fair future. You get a faster version of the same discrimination, run at scale, with no human you can argue with.\n\nThe Civil Rights Act of 1964, Title VII, doesn\'t care whether discrimination is intentional. It cares whether it happens. It happened to Marcus Rivera 47 times in six months. We will show you the audit data. We will show you the disparate impact. And we will ask you to hold HireRight Solutions accountable — because if a human hiring manager had done what this algorithm did, they would have been fired and sued by lunchtime."',
        annotations: [
          'Opens with a specific human (Marcus Rivera, 47 jobs, 3.8 GPA), not an abstraction.',
          'Real legal grounding (Title VII, disparate impact) without sounding like a textbook.',
          'Pre-empts the defense ("they will tell you it\'s objective") instead of waiting for it.',
          'Lands the closing line on a moral parallel — a human doing this would be fired. That\'s the line the jury remembers.',
        ],
      },
      weak: {
        label: 'Weak — prosecution opening (same case)',
        body: '"Hi everyone. So our case is about an AI hiring tool. Basically the AI was racist because AI is biased and that\'s a big problem in society today. There was this guy who didn\'t get a job because of the AI and that\'s not fair. The company should have to pay because they used a racist computer. Also AI in general is something we should be careful about because it can have a lot of negative impacts on people. Discrimination is wrong and the AI was discriminating. So that\'s why we think the company is guilty. Thank you."',
        annotations: [
          'No specific person, no specific facts, no specific harm. "There was this guy" — who? When? At what company?',
          'No legal grounding. The actual law (Title VII, disparate impact) is what makes the case winnable.',
          '"AI is biased" is the conclusion, not the argument. The strong version SHOWS how the bias happened.',
          'Doesn\'t anticipate the defense at all — the defense will eat this alive on cross.',
          'Casual register ("Hi everyone," "this guy") breaks courtroom format. The jury stops taking it seriously the moment the speaker does.',
        ],
      },
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    { type: 'slide_submit', id: 'submit-final', maxScore: 100,
      prompt: '**ONE TEAM MEMBER SUBMITS FOR THE GROUP.**\n\nPaste a Google Doc or Slides link to your team\'s full project package. The first page MUST list every team member\'s full name and role (Prosecution / Defense / Expert / Jury).\n\nThe submission should contain:\n1. The case brief (one per team member)\n2. All role-specific documents (opening + closing statements, witness prep, deliberation notes + verdict)\n3. Each team member\'s personal opinion paper\n\nMake sure the link is set to "Anyone with the link can view."' },

    { type: 'section_header', id: 'sh-reflect', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Which side did you find harder to argue — the side you actually agreed with, or the side you didn\'t? What does that tell you about how you usually form opinions on AI?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Name the single strongest argument the OTHER side made in your trial. Steelman it — write it the way they would have wanted it written. Then explain why your side\'s argument was still stronger (or honestly, why it wasn\'t).' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If a real version of this case landed in a real courtroom next month, what is one piece of evidence or testimony that you think SHOULD matter to the verdict that the law currently has no good way to handle?' },
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

async function main() {
  for (const courseId of COURSE_IDS) {
    const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
    await ref.set(lesson);
    console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
  }
  process.exit(0);
}
main().catch(e => { console.error(e.message); process.exit(1); });
