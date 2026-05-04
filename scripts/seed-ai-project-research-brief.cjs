/**
 * AI Literacy Course Project: AI Research Brief
 * Lesson ID: ai-project-research-brief
 * Order: 80 | Visible: false
 *
 * Eleventh Year-End Project. Built around Gemini Deep Research (5/day on @paps.net).
 * Pedagogical thread: continues the NotebookLM lesson's grounded-AI fact-check skill —
 * Deep Research goes OUT to find sources, NotebookLM stays IN your sources.
 * Fact-checking the AI's citations is the core skill, not the research itself.
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-research-brief.jpg';

const lesson = {
  id: 'ai-project-research-brief',
  title: 'AI Research Brief: Investigate a Real Question with Deep Research',
  unit: 'Year-End Projects',
  order: 80,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Use Gemini Deep Research to investigate a question that genuinely needs research',
      'Fact-check AI-generated synthesis against the actual cited sources',
      'Distinguish between what AI claims a source says and what the source actually says',
      'Produce a written research brief that is YOUR synthesis, not the AI\'s',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think about a real question you\'ve genuinely wondered about — not "what is X" (a search-engine question), but "is X actually true," "how often does Y happen," "do experts agree about Z." What\'s a question you actually want answered?' },

    { type: 'image', id: id(), url: HERO_URL, alt: 'AI Research Brief hero: a stack of source documents fanned across a desk with light lines converging into a magnifying glass that holds a checkmark and an X — symbolizing fact-checking AI synthesis against sources' },

    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    { type: 'text', id: id(), content: `Most AI projects in this course have asked you to USE AI to make something. This one is different. This one asks you to use AI to INVESTIGATE something — and then prove you\'re smarter than the AI by catching where it lies.\n\nGemini Deep Research is a new AI capability that goes out across the internet, reads dozens of sources, and produces a multi-page synthesis with citations. It looks like a real research paper. It cites real sources. But — and this is the whole point — it can still get things wrong. It can simplify. It can attribute claims to sources that don\'t actually say what it claims. It can pull from one strong source and one shaky source and not tell you which is which.\n\nYour job in this project is to **use Deep Research to investigate a real question, then fact-check its work** — naming exactly where the AI\'s synthesis matches the sources and where it diverges.\n\nThe artifact you produce is a 1500-word **Research Brief**. The skill you build is one of the most important AI-era skills there is: **trusting nothing without checking the citations.**` },
    { type: 'callout', id: id(), style: 'info', content: '**Use Deep Research to investigate a real question. Fact-check what it tells you. Produce a brief that is YOUR synthesis, defensible against scrutiny.**' },

    { type: 'section_header', id: 'sh-question', label: 'What Makes a Good Question' },
    { type: 'case_cards', id: id(),
      title: 'Pick a Question Worth Investigating',
      cards: [
        { id: 'card-q-good', label: 'YES', title: 'Investigatable', body: 'A question where (a) experts genuinely disagree, (b) data exists but is contested, or (c) the answer depends on definitions and you have to pick one.\n\n**Examples:**\n- "Are AI hiring screeners actually used at the largest US employers? Which ones, and what does the research say about whether they\'re fair?"\n- "How accurate are AI deepfake detectors actually, and what fools them?"\n- "What\'s the real carbon cost of training a frontier AI model — and how does it compare to other tech industries?"\n- "Are phone bans in classrooms actually associated with better outcomes, or is the evidence weaker than it sounds?"' },
        { id: 'card-q-bad', label: 'NO', title: 'Not Investigatable', body: 'Don\'t pick a question that has a Wikipedia answer or that\'s pure opinion.\n\n**Avoid:**\n- "What is artificial intelligence?" (Wikipedia question — no investigation needed)\n- "Is AI good or bad?" (pure opinion — no facts to check)\n- "Will AI replace teachers?" (prediction — Deep Research can\'t investigate the future)\n- "What\'s the best video game?" (taste, not fact)' },
      ]
    },
    { type: 'callout', id: id(), style: 'tip', content: '**The 30-second test:** if you can imagine two reasonable adults reading the same evidence and disagreeing about the answer, the question is investigatable. If everyone would agree after a quick Google, it\'s not.' },

    { type: 'section_header', id: 'sh-deliverables', label: 'What You\'ll Make' },
    { type: 'checklist', id: id(), title: 'Deliverables', items: [
      'A research brief of 1200–1500 words organized as: Question → Methodology (which Deep Research runs you did) → Findings → "What the AI Got Wrong" section → Verdict',
      'A source list with at least 6 distinct sources cited in your brief — varied types (academic paper, news article, primary document, expert interview/blog, dataset, etc.)',
      'A "What the AI Got Wrong" section that names AT LEAST 3 specific instances where Deep Research\'s synthesis diverged from what the original source actually said. For each: quote the AI\'s claim, quote the source passage, name the divergence (oversimplification, missing qualifier, wrong attribution, etc.)',
      'A 1-paragraph reflection appended at the end: where would Deep Research take you wrong if you didn\'t fact-check it?',
    ]},

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Pick a Question + First Deep Research Run (in class)**\n- Pick a real, investigatable question. 2-minute pitch to Mr. McCarthy. Get it approved before you run Deep Research — bad question wastes a daily run.\n- In Gemini, click "Deep Research." Type your question. Wait 5–10 minutes for the report.\n- Read the entire output start to finish. Don\'t take notes yet — just read it like a critical reader. What does it claim? What sources did it cite?\n\n**Day 2 — Two More Deep Research Runs (in class + homework)**\n- Run two MORE Deep Research queries from different angles on your same question. (You have 5/day — use 3 across Days 1–2 and save 2 for follow-up.)\n- Now read all three reports side by side. Where do they agree? Where do they contradict each other? That\'s the most interesting space.\n- Begin a source log: every source the three reports cited. You\'ll need to verify these.\n\n**Day 3 — Fact-Check (in class). This is the whole project.**\n- Pick the 3 strongest claims across all three Deep Research reports. For each claim, click into the source the AI cited.\n- Read the source passage. Ask: **does the AI accurately represent what the source actually says?** Or did it simplify, drop a qualifier, attribute the wrong number, swap a word?\n- Document each fact-check in a table: AI\'s claim / source quote / your verdict.\n- You need at least 3 documented divergences for the brief. If you don\'t find any, you\'re not reading critically enough — try harder.\n\n**Day 4 — Write the Brief (homework)**\n- 1200–1500 words. Your synthesis, not Deep Research\'s. Use your own structure. Quote the sources, not the AI\'s summary of them.\n- Include the "What the AI Got Wrong" section with your 3+ documented divergences.\n- End with a verdict — your answer to the question, with reasoning.\n\n**Day 5 — Submit + Discussion (in class)**\n- 60-second share: what was the most surprising thing the AI got wrong?\n- Submit your brief.` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(),
      title: 'Project Rubric',
      totalPoints: 100,
      criteria: [
        { name: 'Question is investigatable', weight: 15, levels: [
          { score: 4, label: 'Exemplary', description: 'Question is specific, factual, has real disagreement among experts/sources, and can be meaningfully investigated by reading multiple sources.' },
          { score: 3, label: 'Proficient', description: 'Question is investigatable but slightly broad or has an obvious answer that doesn\'t require deep research.' },
          { score: 2, label: 'Developing', description: 'Question is too broad ("what is X"), too opinion-based, or has a Wikipedia-level answer.' },
          { score: 1, label: 'Beginning', description: 'No real question, or the question is unanswerable (prediction, taste, definition only).' },
        ]},
        { name: 'Source quality and variety', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: '6+ distinct, real sources of varied type (at least 3 categories: academic, news, primary, expert, dataset). Every source verified to exist (no AI-hallucinated sources).' },
          { score: 3, label: 'Proficient', description: '6+ sources but limited variety (e.g., all news articles), or 1 source quality is weak (random blog).' },
          { score: 2, label: 'Developing', description: 'Fewer than 6 sources, or sources lack variety, or 1 source can\'t actually be found at the URL the AI provided.' },
          { score: 1, label: 'Beginning', description: 'Multiple sources are AI-hallucinated and don\'t exist, or fewer than 3 real sources cited.' },
        ]},
        { name: 'Fact-check rigor (the core skill)', weight: 30, levels: [
          { score: 4, label: 'Exemplary', description: '3+ specific divergences documented. Each one quotes the AI\'s claim, quotes the source passage, names the type of divergence (oversimplification, missing qualifier, wrong number, misattribution), and explains why it matters. At least one divergence is non-trivial.' },
          { score: 3, label: 'Proficient', description: '3 divergences documented but some are surface-level (small phrasing differences) or one of the three required parts (claim/source/verdict) is missing.' },
          { score: 2, label: 'Developing', description: 'Fewer than 3 divergences, or divergences are vague ("the AI was kind of off here") without quoted evidence.' },
          { score: 1, label: 'Beginning', description: 'No fact-checking performed, or claims everything matched (which is never true with Deep Research).' },
        ]},
        { name: 'Synthesis is yours, not the AI\'s', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'The brief\'s organization, voice, and argument structure are clearly the student\'s. Quotes original sources directly (not AI\'s summaries). Reads like a 9th-grader who actually understands the material.' },
          { score: 3, label: 'Proficient', description: 'Mostly the student\'s synthesis, but a few paragraphs lean heavily on Deep Research\'s phrasing.' },
          { score: 2, label: 'Developing', description: 'Significant portions read like Deep Research\'s output with student edits. Original synthesis is weak.' },
          { score: 1, label: 'Beginning', description: 'The brief is essentially Deep Research output reformatted. No real student synthesis.' },
        ]},
        { name: 'Verdict is the student\'s', weight: 15, levels: [
          { score: 4, label: 'Exemplary', description: 'A clear verdict / answer to the question that the student commits to, with reasoning grounded in the sources. Acknowledges uncertainty where it exists.' },
          { score: 3, label: 'Proficient', description: 'Verdict given but reasoning is weak or hedges too much.' },
          { score: 2, label: 'Developing', description: 'Verdict is the AI\'s verdict, restated.' },
          { score: 1, label: 'Beginning', description: 'No verdict, or verdict is "it depends" without commitment.' },
        ]},
      ]
    },

    { type: 'section_header', id: 'sh-exemplars', label: 'Exemplars' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'The "What the AI Got Wrong" section: name 3 specific divergences between Deep Research\'s synthesis and the original sources it cited.',
      strong: {
        label: 'Strong Response',
        body: `**Divergence 1 — The "92% accuracy" claim**\n\nDeep Research wrote: *"Modern AI deepfake detection tools achieve over 92% accuracy on standard benchmarks, with leading systems like Microsoft Video Authenticator reaching even higher rates."*\n\nIts citation: a 2023 Microsoft research blog post.\n\nWhat the source actually says: "Microsoft Video Authenticator analyzes still images or videos to determine the percentage chance that the media has been artificially generated. **For prerecorded videos** the tool achieves up to 92% accuracy on the FaceForensics++ dataset."\n\n**Divergence:** Deep Research dropped two crucial qualifiers. (1) The 92% is on ONE specific dataset (FaceForensics++), not "standard benchmarks" plural. (2) It only applies to prerecorded video — the tool struggles much more with real-time streams. Both qualifiers matter for the question I was asking. The AI made the tool sound substantially more capable than the source actually claims.\n\n**Divergence 2 — The "10x" carbon claim**\n\nDeep Research wrote: *"Training a single frontier AI model produces approximately 10x the carbon emissions of an average American\'s annual lifestyle."*\n\nIts citation: a 2019 University of Massachusetts Amherst paper by Strubell et al.\n\nWhat the source actually says: The Strubell paper estimates one specific NLP model training run (with hyperparameter search) produces roughly 626,000 lbs of CO2 — comparable to "5 American cars over their lifetime, including manufacture and fuel."\n\n**Divergence:** Wrong comparison. The source compares to **5 cars\' lifetimes**, not "an average American\'s annual lifestyle." Those are very different numbers. Also, the paper is from 2019 — much smaller models than today\'s frontier ones. Deep Research stretched a 6-year-old finding to imply something about current models the original authors didn\'t claim.\n\n**Divergence 3 — Attribution swap**\n\nDeep Research wrote: *"As Hinton has argued, current detection tools are fundamentally limited because adversarial generation always outpaces detection."*\n\nIts citation: a 2024 NYT article that interviewed Geoffrey Hinton.\n\nWhat the source actually says: The NYT piece quotes Hinton on broader AI risk, but the "adversarial generation outpaces detection" argument is actually attributed to **Hany Farid (UC Berkeley)** in a different paragraph, not Hinton.\n\n**Divergence:** Misattribution. Deep Research collapsed two different experts in the same article into one quote. Hinton said something else; Farid said the thing being cited.\n\n**Why this matters:** All three divergences would have made my brief wrong if I hadn\'t fact-checked. Two would have inflated the AI\'s capabilities (92% claim, 10x claim) and one would have misattributed an idea to a more famous expert. If I had submitted Deep Research\'s synthesis directly, I would have published three small but real falsehoods.`,
        annotations: [
          'Three divergences are concrete, with quoted AI claim + quoted source + named type of divergence (dropped qualifier, wrong comparison, misattribution)',
          'Each divergence includes the WHY — explains specifically what would have been wrong if uncaught',
          'The student does the actual reading work (reading the Strubell paper, the NYT article, the Microsoft blog) — not just trusting Deep Research summary',
          'The closing sentence makes the pedagogical point: blindly publishing AI synthesis would have produced three real falsehoods',
        ]
      },
      weak: {
        label: 'Weak Response',
        body: `**What the AI got wrong:**\n\nThe AI was mostly right but I noticed it sometimes simplified things. For example, when it talked about deepfake detection accuracy, it didn\'t mention that the numbers are different for different types of media. And when it talked about AI carbon emissions, the numbers are pretty old. It also sometimes attributes ideas to the wrong person but that\'s probably not a big deal.\n\nOverall I think Deep Research did a good job and the brief is accurate.`,
        annotations: [
          'Vague gestures ("it simplified," "the numbers are old") with no specific claims, no quoted source, no specific type of divergence — fails every part of the criterion',
          'No actual fact-checking happened — student is summarizing the *concept* of fact-checking, not doing it',
          '"Probably not a big deal" is the opposite of fact-check rigor — every divergence either matters or doesn\'t, and the student should be able to say which',
          '"Overall the AI did a good job" with no specifics is the exact failure mode this rubric criterion is designed to catch',
        ]
      }
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    { type: 'slide_submit', id: id(), prompt: 'Paste the link to your final research brief (Google Doc with sharing set to "Anyone with the link can view"). The brief should include all 5 required sections: Question / Methodology / Findings / What the AI Got Wrong / Verdict.', maxScore: 100 },

    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Of the divergences you caught between Deep Research and the original sources, which one mattered most? If you had submitted Deep Research\'s synthesis directly without fact-checking, what would your brief have gotten wrong, and how badly?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Compare Deep Research and NotebookLM. Both are "grounded" AI research tools, but in different ways. When would you use each, and why? Give a specific example for each.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'You\'re going to keep using AI for research after this class — for college work, for jobs, for personal questions. What ONE habit will you carry forward from this project that will protect you from publishing AI mistakes as your own?' },
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
