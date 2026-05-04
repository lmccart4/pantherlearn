/**
 * AI Literacy: NotebookLM Tutorial + Build a Study Tool
 * Lesson ID: ai-notebooklm-study-tool
 * Order: 69 (sits right before Year-End Projects start at 70)
 * Visible: false
 *
 * Designed as a 1-2 period precursor to the Year-End Projects.
 * Period 1: tutorial + start build. Period 2 (optional): polish + share + reflect.
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/lesson-notebooklm-tutorial.jpg';

const lesson = {
  id: 'ai-notebooklm-study-tool',
  title: 'NotebookLM: Build a Study Tool for One of Your Other Classes',
  unit: 'Year-End Projects',
  order: 69,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Understand what makes NotebookLM different from ChatGPT or Claude (grounded AI vs. open-ended AI)',
      'Build a working study tool from your own course materials in one class period',
      'Fact-check an AI summary against the original source — and notice what it gets wrong',
      'Identify when grounded AI is the right tool and when it is not',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What\'s a class you\'re studying for right now where you wish you had a personal tutor — someone who only knew your textbook and your notes, and could answer questions about exactly that material? What class, and what\'s the next test or project?' },

    { type: 'image', id: id(), url: HERO_URL, alt: 'NotebookLM tutorial hero: an open notebook with sound waves emerging, source documents being drawn in along dotted lines' },

    { type: 'section_header', id: 'sh-what', label: 'What Is NotebookLM?' },
    { type: 'text', id: id(), content: `NotebookLM is a free Google tool that lets you build a personal AI assistant for any topic — but with one big rule: **it can only answer using sources YOU give it.**\n\nThat sounds like a small detail. It\'s actually the whole game.\n\nWhen you ask ChatGPT "explain photosynthesis," it answers from everything it ever read on the internet. Some of that is right. Some of it is hallucinated. You have no way to know which is which. This has been a recurring lesson all year — AI confidently making things up is a feature of how it works, not a bug.\n\nWhen you ask **NotebookLM** "explain photosynthesis," it can only answer using the documents you uploaded — your bio textbook chapter, your class notes, the lab handout. It will quote them, cite them, and refuse to answer questions outside that material. No hallucinations from the open internet — only what\'s in your sources.\n\nThis is called **grounded AI**. It\'s a different shape of AI tool than the ones we\'ve mostly used this year. And for studying, it\'s often the right shape.` },
    { type: 'definition', id: id(), term: 'Grounded AI', definition: 'An AI system that is restricted to a specific set of sources you provide, and must cite those sources for every answer. Cannot pull from the open internet. Cannot hallucinate from training data. **NotebookLM is grounded AI.** ChatGPT and Claude are not (by default).' },
    { type: 'callout', id: id(), style: 'info', content: '**The pitch in one sentence:** NotebookLM = a study buddy that only knows what you teach it, and shows its work every time it answers.' },

    { type: 'section_header', id: 'sh-uses', label: 'Four Things NotebookLM Can Make For You' },
    { type: 'case_cards', id: id(),
      title: 'Pick One (or All Four) For Your Build',
      cards: [
        { id: 'card-guide', label: '1', title: 'Study Guide', body: 'NotebookLM reads your sources and produces a structured study guide with key concepts, vocabulary, and likely test questions. Best for: cramming for a test, organizing a unit before the final.' },
        { id: 'card-faq', label: '2', title: 'FAQ', body: 'Generate a list of frequently-asked questions a student would ask about this material — with answers grounded in your sources. Best for: quick review, parent-friendly explainers, peer tutoring.' },
        { id: 'card-brief', label: '3', title: 'Briefing Doc', body: 'A 1-2 page summary of the main ideas, written like an executive summary. Best for: catching up after an absence, preparing for a class discussion, reviewing before a quiz.' },
        { id: 'card-audio', label: '4', title: 'Audio Overview', body: 'Two AI hosts have a 5-10 minute podcast-style conversation about your sources. You can listen on the bus, while running, while folding laundry. Best for: when you learn better by listening than reading.' },
      ]
    },

    { type: 'section_header', id: 'sh-how', label: 'How It Works (4 Steps)' },
    { type: 'text', id: id(), content: `**Step 1 — Open NotebookLM.** Go to **notebooklm.google.com** and sign in with your Google account.\n\n**Step 2 — Create a new notebook.** Click "Create new notebook." Name it something specific to the class and topic (e.g. "Bio Unit 5 — Cell Division" or "US History — WWII").\n\n**Step 3 — Add sources.** Click "Add Source." NotebookLM accepts PDFs, Google Docs, websites (paste a URL), text you copy in directly, audio files, even YouTube videos. Add 1-3 sources for your first build. **More isn\'t always better — well-chosen sources beat a pile of random ones.**\n\n**Step 4 — Generate.** In the right panel, NotebookLM offers buttons for the Study Guide, FAQ, Briefing Doc, and Audio Overview. Click one. Wait 1-3 minutes. Read what it produced — and check the citations. Every fact has a numbered citation that opens the exact passage in your source.` },
    { type: 'external_link', id: id(), title: 'Open NotebookLM', url: 'https://notebooklm.google.com', description: 'Sign in with your @paps.net account.' },

    { type: 'section_header', id: 'sh-build', label: 'Your Turn — Build a Study Tool' },
    { type: 'text', id: id(), content: `Now you build one. Pick a class you\'re actually studying for right now — physics, English, biology, history, math, anything. Real material, real test or project coming up.\n\n**Get the sources together first.** You need 1-3 documents that genuinely cover the material. Examples:\n- Your textbook chapter (export as PDF or paste the relevant pages as text)\n- Your class notes (typed or photo-scanned via Google Lens)\n- A handout, study guide, or worksheet from the class\n- A relevant YouTube lecture (paste the URL — NotebookLM transcribes it)\n\n**Then build.** Generate AT LEAST a Study Guide and one other output (FAQ, Briefing Doc, or Audio Overview). The Audio Overview is the one most students get hooked on — it sounds eerily like a real podcast.` },
    { type: 'case_cards', id: id(),
      title: 'Example Builds (Pick a Vibe)',
      cards: [
        { id: 'card-ex-bio', label: 'BIO', title: 'Bio test prep', body: 'Sources: textbook chapter PDF + your notes + the review handout. Generate a Study Guide + Audio Overview. Listen to the Audio Overview on your morning bus ride before the test.' },
        { id: 'card-ex-hist', label: 'HIST', title: 'History essay prep', body: 'Sources: 2 primary source readings + your class notes. Generate a Briefing Doc + an FAQ. Use the Briefing Doc as your essay outline starting point. (The essay is still yours — NotebookLM is a study buddy, not a ghost-writer.)' },
        { id: 'card-ex-eng', label: 'ENG', title: 'English book analysis', body: 'Sources: a chapter of your novel + SparkNotes-style summary + your annotation notes. Generate a Study Guide focused on themes + an FAQ on character motivations. Use it before class discussion.' },
        { id: 'card-ex-math', label: 'MATH', title: 'Math concept review', body: 'Sources: textbook section + worked-example handouts + your notes. Generate a Study Guide that lists every formula and procedure type. Ask follow-up questions like "explain the chain rule using example 3 from my notes."' },
      ]
    },

    { type: 'section_header', id: 'sh-checklist', label: 'Build Checklist' },
    { type: 'checklist', id: id(), title: 'What to do (in order)', items: [
      'Pick the class and the specific topic / test you\'re studying for',
      'Gather 1–3 sources (PDFs, Docs, notes, links). At least one must be your own work (notes or a teacher handout, not just a YouTube video)',
      'Open NotebookLM and create a new notebook with a clear name',
      'Add your sources. Wait for them to process.',
      'Generate a Study Guide. Read it. Open at least 3 citations and confirm the source actually says what NotebookLM claims.',
      'Generate one more output (FAQ, Briefing Doc, OR Audio Overview)',
      'Copy your notebook\'s share link (Share button → "Anyone with link can view")',
    ]},

    { type: 'section_header', id: 'sh-factcheck', label: 'The Fact-Check (This Is the Whole Lesson)' },
    { type: 'callout', id: id(), style: 'warning', content: '**Grounded AI cuts hallucinations way down. It does NOT eliminate them.** NotebookLM can still summarize incorrectly, drop nuance, or pick the wrong passage. Your job is to read the output critically against your sources.' },
    { type: 'text', id: id(), content: `Open the Study Guide NotebookLM generated. Pick three claims it makes — anything that looks specific and important. For each one:\n\n1. Click the citation number next to the claim. NotebookLM will jump to the source passage it pulled from.\n2. Read the source passage.\n3. Ask: **does the Study Guide accurately represent what the source actually says?** Or did it simplify, drop a key qualifier, swap a number, or attribute an idea to the wrong part of the source?\n\nThis is the most important skill in the lesson. **Trust nothing without checking citations.** This is how you use ANY grounded AI tool — for school, for work, for life.` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(),
      title: 'Lesson Rubric',
      totalPoints: 25,
      criteria: [
        { name: 'Notebook is real and organized', weight: 5, levels: [
          { score: 4, label: 'Exemplary', description: 'Notebook has a clear, specific name; sources are real and relevant to a real class/topic; at least one source is from the student\'s own course (notes, handout).' },
          { score: 3, label: 'Proficient', description: 'Notebook is real but the topic is broad ("history") or sources are generic.' },
          { score: 2, label: 'Developing', description: 'Notebook exists but sources are weak (one random YouTube video, or a single Wikipedia page).' },
          { score: 1, label: 'Beginning', description: 'No real sources, or notebook is empty.' },
        ]},
        { name: 'Outputs were generated', weight: 5, levels: [
          { score: 4, label: 'Exemplary', description: 'Generated a Study Guide AND at least one other output (FAQ, Briefing Doc, or Audio Overview). Both are linked or screenshotted in the submission.' },
          { score: 3, label: 'Proficient', description: 'Generated 2 outputs but only one is linked clearly.' },
          { score: 2, label: 'Developing', description: 'Generated only one output.' },
          { score: 1, label: 'Beginning', description: 'No outputs generated, or outputs are not shown in the submission.' },
        ]},
        { name: 'Fact-check is honest and specific', weight: 10, levels: [
          { score: 4, label: 'Exemplary', description: 'Reflection names 3 specific claims from the AI output, names the citation each one came from, and gives an honest verdict ("matches the source," "oversimplifies," "drops a key word"). At least one verdict is critical — students who say "everything was perfect" get 3 max here.' },
          { score: 3, label: 'Proficient', description: 'Names 2-3 claims and checks them, but verdicts are surface-level.' },
          { score: 2, label: 'Developing', description: 'Says "I checked the citations and they were right" without naming specific claims.' },
          { score: 1, label: 'Beginning', description: 'No fact-check performed, or fact-check is fabricated.' },
        ]},
        { name: 'Reflection on grounded AI', weight: 5, levels: [
          { score: 4, label: 'Exemplary', description: 'Names a specific moment grounded AI was clearly the right tool here (with example), AND names a use case where it would NOT be the right tool. Shows real understanding of when each shape of AI fits.' },
          { score: 3, label: 'Proficient', description: 'Identifies why grounded AI was useful here but doesn\'t name a counterexample.' },
          { score: 2, label: 'Developing', description: 'Generic praise of NotebookLM, no comparison to other AI shapes.' },
          { score: 1, label: 'Beginning', description: 'Reflection skipped or off-topic.' },
        ]},
      ]
    },

    { type: 'section_header', id: 'sh-exemplar', label: 'Exemplar' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Reflection question: pick one specific claim from your NotebookLM Study Guide. Open its citation and read the source passage. Does the AI accurately represent what the source actually says?',
      strong: {
        label: 'Strong Response',
        body: `**The class:** Bio, Mr. Anderson, Unit 5 — Cell Division. Test on Friday.\n\n**The sources I added:** my Cornell notes from class (PDF scan), the textbook section (Chapter 12 PDF), and the cell division lab worksheet I did last week.\n\n**One claim NotebookLM made in the Study Guide:** "Mitosis produces two genetically identical daughter cells, each with the same number of chromosomes as the parent cell."\n\n**The citation:** Citation 4 → textbook page 218.\n\n**What the source actually says:** Page 218 says "Mitosis produces two diploid daughter cells genetically identical to the parent." The textbook uses the word *diploid*. NotebookLM swapped *diploid* for "the same number of chromosomes as the parent cell."\n\n**My verdict:** Mostly accurate, but it dropped the technical word *diploid* — which is a vocabulary word Mr. Anderson is definitely going to test on. If I had only studied from NotebookLM\'s output, I would have missed that the right answer to "what kind of cells does mitosis produce?" is *diploid*, not just "the same chromosome number." Lesson: I can\'t treat NotebookLM\'s simplifications as the final answer for vocab.`,
        annotations: [
          'Names a specific class, teacher, topic, and test deadline — not "I made a study guide for biology"',
          'Identifies the EXACT word that got swapped (diploid → "same chromosome number") and explains why that swap matters for the actual test',
          'Comes to a real verdict — useful but lossy on vocabulary — and adjusts study strategy accordingly',
          'Shows the student is learning to read AI output critically, which is the actual skill this lesson is teaching',
        ]
      },
      weak: {
        label: 'Weak Response',
        body: `I made a notebook for biology. I uploaded my notes. NotebookLM made a study guide and an audio overview. The study guide had a lot of facts. I checked the citations and they all matched. NotebookLM is a great study tool and I will use it for all my future tests.`,
        annotations: [
          'No specific class, no specific topic, no specific test',
          '"All the citations matched" with zero specific examples is the easiest-to-spot fake — what claim did you check, what citation, what passage?',
          'Generic praise replaces actual analysis. The whole point of the lesson was to learn to be critical, and this response is the opposite of that',
          'Doesn\'t engage with the question being asked — name a specific claim and check it. Just glosses over it.',
        ]
      }
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Build' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Paste the share link to your NotebookLM notebook here. (In NotebookLM: Share button → set to "Anyone with the link can view.") Plus a one-sentence note on which class and topic this study tool is for.' },

    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Pick ONE specific claim from the Study Guide NotebookLM generated for you. Open its citation. Read the source passage. Does the AI accurately represent what the source says? Be specific — copy the AI\'s claim, copy the source passage, give your verdict.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'When is grounded AI (NotebookLM) the RIGHT tool to use, and when is it the WRONG tool? Give one example of each. (Hint: think about what NotebookLM cannot do.)' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Will you actually use NotebookLM for a real class this year? If yes — which class, which test or project? If no — what\'s stopping you?' },
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
