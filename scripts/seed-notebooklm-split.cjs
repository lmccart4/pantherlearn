#!/usr/bin/env node
/**
 * Splits the NotebookLM lesson into two:
 *   Day 1 (Thu 5/7) — ai-notebooklm-day1-build      → setup + build + exit ticket
 *   Day 2 (Fri 5/8) — ai-notebooklm-day2-factcheck  → recap + fact-check + iterate + submit + reflect
 * Deletes the original ai-notebooklm-study-tool (zero student progress confirmed 2026-05-07).
 */
const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')),
  });
}
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSES = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI Literacy P4' },
  { id: 'DacjJ93vUDcwqc260OP3', label: 'AI Literacy P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'AI Literacy P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'AI Literacy P9' },
];

const HERO_IMG = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/lesson-notebooklm-tutorial.jpg';

// ---------- DAY 1 ----------
const DAY1 = {
  id: 'ai-notebooklm-day1-build',
  title: 'NotebookLM Day 1: Build Your Study Tool',
  unit: 'Year-End Projects',
  order: 69,
  visible: false,
  dueDate: '2026-05-07',
  gradesReleased: true,
  blocks: [
    { type: 'section_header', id: 'd1-sh-warmup', label: 'Warm Up' },
    {
      type: 'objectives',
      id: 'd1-obj',
      title: 'Day 1 Objectives',
      items: [
        'Understand what makes NotebookLM different from ChatGPT or Claude (grounded AI vs. open-ended AI)',
        'Choose strong sources for a real class you are studying for right now',
        'Build a working NotebookLM notebook and generate at least two outputs in one period',
      ],
    },
    {
      type: 'callout',
      id: 'd1-pacing',
      style: 'info',
      content: '**This is a 2-day lesson.** Today (Day 1): pick your class, gather sources, build your notebook, and generate your study tool. Tomorrow (Day 2): fact-check it, iterate, peer-test, and submit your final reflection.',
    },
    {
      type: 'question',
      id: 'd1-warmup-q',
      questionType: 'short_answer',
      prompt: "What's a class you're studying for right now where you wish you had a personal tutor — someone who only knew your textbook and your notes, and could answer questions about exactly that material? What class, and what's the next test or project?",
    },
    { type: 'image', id: 'd1-hero', url: HERO_IMG, alt: 'NotebookLM tutorial hero: an open notebook with sound waves emerging, source documents being drawn in along dotted lines' },

    { type: 'section_header', id: 'd1-sh-what', label: 'What Is NotebookLM?' },
    {
      type: 'text',
      id: 'd1-what-text',
      content: "NotebookLM is a free Google tool that lets you build a personal AI assistant for any topic — but with one big rule: **it can only answer using sources YOU give it.**\n\nThat sounds like a small detail. It's actually the whole game.\n\nWhen you ask ChatGPT \"explain photosynthesis,\" it answers from everything it ever read on the internet. Some of that is right. Some of it is hallucinated. You have no way to know which is which. This has been a recurring lesson all year — AI confidently making things up is a feature of how it works, not a bug.\n\nWhen you ask **NotebookLM** \"explain photosynthesis,\" it can only answer using the documents you uploaded — your bio textbook chapter, your class notes, the lab handout. It will quote them, cite them, and refuse to answer questions outside that material. No hallucinations from the open internet — only what's in your sources.\n\nThis is called **grounded AI**. It's a different shape of AI tool than the ones we've mostly used this year. And for studying, it's often the right shape.",
    },
    {
      type: 'definition',
      id: 'd1-def',
      term: 'Grounded AI',
      definition: 'An AI system that is restricted to a specific set of sources you provide, and must cite those sources for every answer. Cannot pull from the open internet. Cannot hallucinate from training data. **NotebookLM is grounded AI.** ChatGPT and Claude are not (by default).',
    },
    {
      type: 'callout',
      id: 'd1-pitch',
      style: 'info',
      content: '**The pitch in one sentence:** NotebookLM = a study buddy that only knows what you teach it, and shows its work every time it answers.',
    },

    { type: 'section_header', id: 'd1-sh-uses', label: 'Four Things NotebookLM Can Make For You' },
    {
      type: 'case_cards',
      id: 'd1-uses-cards',
      title: 'Pick One (or All Four) For Your Build',
      cards: [
        { id: 'card-guide', label: '1', title: 'Study Guide', body: 'NotebookLM reads your sources and produces a structured study guide with key concepts, vocabulary, and likely test questions. Best for: cramming for a test, organizing a unit before the final.' },
        { id: 'card-faq',   label: '2', title: 'FAQ',          body: 'Generate a list of frequently-asked questions a student would ask about this material — with answers grounded in your sources. Best for: quick review, parent-friendly explainers, peer tutoring.' },
        { id: 'card-brief', label: '3', title: 'Briefing Doc', body: 'A 1-2 page summary of the main ideas, written like an executive summary. Best for: catching up after an absence, preparing for a class discussion, reviewing before a quiz.' },
        { id: 'card-audio', label: '4', title: 'Audio Overview', body: 'Two AI hosts have a 5-10 minute podcast-style conversation about your sources. You can listen on the bus, while running, while folding laundry. Best for: when you learn better by listening than reading.' },
      ],
    },

    { type: 'section_header', id: 'd1-sh-sources', label: 'Source Quality Check (Before You Upload)' },
    {
      type: 'text',
      id: 'd1-sources-text',
      content: "**Garbage in, garbage out.** NotebookLM will faithfully summarize whatever you feed it — including a sketchy website. The quality of the answers it gives you is capped by the quality of the sources you upload. So before you build, think about what counts as a strong source.",
    },
    {
      type: 'question',
      id: 'd1-source-rank',
      questionType: 'short_answer',
      prompt: "Rank these 5 source types from MOST reliable to LEAST reliable for studying a school topic, and explain your top pick and your bottom pick in one sentence each:\n\nA) Your class notes\nB) The textbook chapter (PDF)\nC) A random YouTube video that came up first when you searched\nD) Wikipedia\nE) A teacher-provided handout or study guide",
    },

    { type: 'section_header', id: 'd1-sh-how', label: 'How It Works (4 Steps)' },
    {
      type: 'text',
      id: 'd1-how-text',
      content: "**Step 1 — Open NotebookLM.** Go to **notebooklm.google.com** and sign in with your @paps.net Google account.\n\n**Step 2 — Create a new notebook.** Click \"Create new notebook.\" Name it something specific to the class and topic (e.g. \"Bio Unit 5 — Cell Division\" or \"US History — WWII\").\n\n**Step 3 — Add sources.** Click \"Add Source.\" NotebookLM accepts PDFs, Google Docs, websites (paste a URL), text you copy in directly, audio files, even YouTube videos. Add 1-3 sources for your first build. **More isn't always better — well-chosen sources beat a pile of random ones.**\n\n**Step 4 — Generate.** In the right panel, NotebookLM offers buttons for the Study Guide, FAQ, Briefing Doc, and Audio Overview. Click one. Wait 1-3 minutes. Read what it produced — and check the citations. Every fact has a numbered citation that opens the exact passage in your source.",
    },
    { type: 'external_link', id: 'd1-link', title: 'Open NotebookLM', url: 'https://notebooklm.google.com', description: 'Sign in with your @paps.net account.' },

    { type: 'section_header', id: 'd1-sh-power', label: 'Two Power Moves Most Students Miss' },
    {
      type: 'text',
      id: 'd1-power-intro',
      content: "Two NotebookLM features that don't show up on the basic tutorial — but make a huge difference in how fast and well you can build:",
    },
    {
      type: 'text',
      id: 'd1-power-web',
      content: "**Power Move 1 — NotebookLM can pull sources from the web for you.** When you click \"Add Source,\" you'll see options for **Fast Research** (quick web pull, a few results, ~30 seconds) and **Deep Research** (thorough web pull, more results, multiple minutes). NotebookLM searches the open web, finds what it thinks are relevant pages, and offers them as candidate sources for your notebook.\n\nThis is useful — but you have to use it carefully. Three rules:",
    },
    {
      type: 'callout',
      id: 'd1-power-web-rules',
      style: 'warning',
      content: "**Web research rules — read these or your notebook quality will tank:**\n\n1. **Your real class materials beat the internet — every time.** Your textbook, your notes, your teacher's handouts are tested against your specific test. Random internet articles are not. Use web research to FILL GAPS, not to replace your own materials.\n\n2. **Deep Research > Fast Research, always.** Fast Research grabs the first few hits. Deep Research actually digs. If you have the minutes to wait, always pick Deep.\n\n3. **You MUST click every internet source before adding it.** Click the link, skim what it actually is. If it's a sketchy blog, an outdated page, an off-topic article, or someone else's homework dump — uncheck it. NotebookLM will faithfully summarize garbage if you let garbage in.",
    },
    {
      type: 'callout',
      id: 'd1-power-parallel',
      style: 'info',
      content: "**Power Move 2 — Generate everything at once.** You don't have to wait for the Study Guide to finish before clicking FAQ. Click Study Guide, click FAQ, click Briefing Doc, click Audio Overview — they all start generating in parallel. By the time you've reread your sources, all four outputs are ready. Don't queue them up one at a time.",
    },

    { type: 'section_header', id: 'd1-sh-build', label: 'Your Turn — Build a Study Tool' },
    {
      type: 'text',
      id: 'd1-build-text',
      content: "Now you build one. Pick a class you're actually studying for right now — physics, English, biology, history, math, anything. Real material, real test or project coming up.\n\n**Get the sources together first.** You need 1-3 documents that genuinely cover the material. Examples:\n- Your textbook chapter (export as PDF or paste the relevant pages as text)\n- Your class notes (typed or photo-scanned via Google Lens)\n- A handout, study guide, or worksheet from the class\n- A relevant YouTube lecture (paste the URL — NotebookLM transcribes it)\n\n**Then build.** Generate AT LEAST a Study Guide and one other output (FAQ, Briefing Doc, or Audio Overview). The Audio Overview is the one most students get hooked on — it sounds eerily like a real podcast.",
    },
    {
      type: 'case_cards',
      id: 'd1-examples',
      title: 'Example Builds (Pick a Vibe)',
      cards: [
        { id: 'card-ex-bio',  label: 'BIO',  title: 'Bio test prep',         body: 'Sources: textbook chapter PDF + your notes + the review handout. Generate a Study Guide + Audio Overview. Listen to the Audio Overview on your morning bus ride before the test.' },
        { id: 'card-ex-hist', label: 'HIST', title: 'History essay prep',    body: 'Sources: 2 primary source readings + your class notes. Generate a Briefing Doc + an FAQ. Use the Briefing Doc as your essay outline starting point. (The essay is still yours — NotebookLM is a study buddy, not a ghost-writer.)' },
        { id: 'card-ex-eng',  label: 'ENG',  title: 'English book analysis', body: 'Sources: a chapter of your novel + SparkNotes-style summary + your annotation notes. Generate a Study Guide focused on themes + an FAQ on character motivations. Use it before class discussion.' },
        { id: 'card-ex-math', label: 'MATH', title: 'Math concept review',   body: 'Sources: textbook section + worked-example handouts + your notes. Generate a Study Guide that lists every formula and procedure type. Ask follow-up questions like "explain the chain rule using example 3 from my notes."' },
      ],
    },

    { type: 'section_header', id: 'd1-sh-checklist', label: 'Build Checklist' },
    {
      type: 'checklist',
      id: 'd1-checklist',
      title: 'What to do (in order)',
      items: [
        'Pick the class and the specific topic / test you are studying for',
        'Gather 1–3 sources (PDFs, Docs, notes, links). At least one must be your own work (notes or a teacher handout, not just a YouTube video)',
        'Open NotebookLM and create a new notebook with a clear name',
        'Add your sources. Wait for them to process.',
        'Generate a Study Guide. Read it.',
        'Generate one more output (FAQ, Briefing Doc, OR Audio Overview)',
        'Copy your notebook share link (Share button → "Anyone with link can view")',
      ],
    },

    { type: 'section_header', id: 'd1-sh-exit', label: 'End of Day 1 — Exit Ticket' },
    {
      type: 'callout',
      id: 'd1-exit-callout',
      style: 'success',
      content: "**You should now have:** a real notebook with 1-3 sources, a generated Study Guide, and at least one other output (FAQ, Briefing Doc, or Audio Overview). Tomorrow we fact-check it.",
    },
    {
      type: 'question',
      id: 'd1-exit-link',
      questionType: 'short_answer',
      prompt: 'Paste the share link to your NotebookLM notebook here. (Share button → "Anyone with the link can view.") Plus one sentence: which class and topic is this study tool for?',
    },
    {
      type: 'question',
      id: 'd1-exit-noticed',
      questionType: 'short_answer',
      prompt: "Read through the Study Guide (or whichever output you generated). What's ONE thing it produced that you found genuinely useful — and ONE thing that already feels suspicious or oversimplified? You'll dig into that suspicious one tomorrow.",
    },
  ],
};

// ---------- DAY 2 ----------
const DAY2 = {
  id: 'ai-notebooklm-day2-factcheck',
  title: 'NotebookLM Day 2: Fact-Check, Iterate, Submit',
  unit: 'Year-End Projects',
  order: 69.1,
  visible: false,
  dueDate: '2026-05-08',
  gradesReleased: true,
  blocks: [
    { type: 'section_header', id: 'd2-sh-recap', label: 'Day 2 — Pick Up Where You Left Off' },
    {
      type: 'objectives',
      id: 'd2-obj',
      title: 'Day 2 Objectives',
      items: [
        'Fact-check an AI summary against the original source — and notice what it gets wrong',
        'Iterate: change your sources, regenerate, and compare what shifted',
        'Identify when grounded AI is the right tool and when it is not',
        'Submit a real, shareable study tool you would actually use',
      ],
    },
    {
      type: 'callout',
      id: 'd2-recap-callout',
      style: 'info',
      content: "**Yesterday (Day 1):** You built a NotebookLM notebook for a real class, generated a Study Guide and one other output. **Today (Day 2):** Open that notebook back up. We fact-check, iterate, and submit.",
    },
    {
      type: 'question',
      id: 'd2-warmup-q',
      questionType: 'short_answer',
      prompt: "Open your notebook from yesterday. Skim what NotebookLM produced. Name ONE claim that felt right and ONE claim that felt sketchy or oversimplified. (Just a quick gut-check — we'll verify in the next section.)",
    },

    { type: 'section_header', id: 'd2-sh-grounded', label: 'Grounded vs. Ungrounded — Why This Matters' },
    {
      type: 'text',
      id: 'd2-grounded-text',
      content: "Quick refresher before we fact-check.\n\nWhen you ask **ChatGPT** a question, it answers from everything it has ever read on the internet. No citations. No way to verify. Some of it true, some of it confidently made up.\n\nWhen you ask **NotebookLM** a question, every claim has a citation pointing back to YOUR source. You can click and verify. **But — and this is the whole point of today — NotebookLM can still get it wrong.** It can summarize sloppily, drop key qualifiers, swap a number, or attribute an idea to the wrong passage.\n\nGrounded AI cuts hallucinations way down. It does NOT eliminate them. So we read it like editors, not like fans.",
    },

    { type: 'section_header', id: 'd2-sh-fc', label: 'The Fact-Check (This Is the Whole Lesson)' },
    {
      type: 'callout',
      id: 'd2-fc-warning',
      style: 'warning',
      content: '**Trust nothing without checking citations.** This is how you use ANY grounded AI tool — for school, for work, for life.',
    },
    {
      type: 'text',
      id: 'd2-fc-text',
      content: "Open the Study Guide NotebookLM generated for you. Pick **three claims** it makes — anything that looks specific and important. For each one:\n\n1. Click the citation number next to the claim. NotebookLM will jump to the source passage it pulled from.\n2. Read the source passage.\n3. Ask: **does the Study Guide accurately represent what the source actually says?** Or did it simplify, drop a key qualifier, swap a number, or attribute an idea to the wrong part of the source?\n\nWrite your three checks in the reflection section below. Be specific — copy the AI's claim, copy the source passage, give your verdict.",
    },

    { type: 'section_header', id: 'd2-sh-rubric', label: 'Rubric' },
    {
      type: 'rubric',
      id: 'd2-rubric',
      title: 'Lesson Rubric (Day 2)',
      totalPoints: 25,
      criteria: [
        {
          name: 'Notebook is real and organized (carried over from Day 1)',
          weight: 5,
          levels: [
            { score: 4, label: 'Exemplary',  description: "Notebook has a clear, specific name; sources are real and relevant; at least one source is from the student's own course (notes, handout)." },
            { score: 3, label: 'Proficient', description: 'Notebook is real but the topic is broad ("history") or sources are generic.' },
            { score: 2, label: 'Developing', description: 'Notebook exists but sources are weak (one random YouTube video, or a single Wikipedia page).' },
            { score: 1, label: 'Beginning',  description: 'No real sources, or notebook is empty.' },
          ],
        },
        {
          name: 'Outputs were generated and used',
          weight: 5,
          levels: [
            { score: 4, label: 'Exemplary',  description: 'Generated a Study Guide AND at least one other output. Audio Overview was actually listened to OR FAQ/Briefing Doc was read all the way through.' },
            { score: 3, label: 'Proficient', description: 'Generated 2 outputs but only engaged with one in depth.' },
            { score: 2, label: 'Developing', description: 'Generated only one output.' },
            { score: 1, label: 'Beginning',  description: 'No outputs generated, or outputs not shown in submission.' },
          ],
        },
        {
          name: 'Fact-check is honest and specific',
          weight: 10,
          levels: [
            { score: 4, label: 'Exemplary',  description: 'Names 3 specific claims from the AI output, names the citation each one came from, and gives an honest verdict ("matches the source," "oversimplifies," "drops a key word"). At least one verdict is critical — students who say "everything was perfect" get 3 max here.' },
            { score: 3, label: 'Proficient', description: 'Names 2-3 claims and checks them, but verdicts are surface-level.' },
            { score: 2, label: 'Developing', description: 'Says "I checked the citations and they were right" without naming specific claims.' },
            { score: 1, label: 'Beginning',  description: 'No fact-check performed, or fact-check is fabricated.' },
          ],
        },
        {
          name: 'Iterate + reflect on grounded AI',
          weight: 5,
          levels: [
            { score: 4, label: 'Exemplary',  description: 'Iteration: clearly describes what changed when a source was added/removed and regenerated. Reflection: names a use case where grounded AI is the right tool here AND a use case where it would NOT be the right tool.' },
            { score: 3, label: 'Proficient', description: 'Iteration shown but change is shallow; reflection is one-sided.' },
            { score: 2, label: 'Developing', description: 'Generic praise of NotebookLM, no real iteration evidence.' },
            { score: 1, label: 'Beginning',  description: 'Skipped or off-topic.' },
          ],
        },
      ],
    },

    { type: 'section_header', id: 'd2-sh-exemplar', label: 'Exemplar' },
    {
      type: 'exemplar_compare',
      id: 'd2-exemplar',
      prompt: 'Reflection question: pick one specific claim from your NotebookLM Study Guide. Open its citation and read the source passage. Does the AI accurately represent what the source actually says?',
      strong: {
        label: 'Strong Response',
        body: "**The class:** Bio, Mr. Anderson, Unit 5 — Cell Division. Test on Friday.\n\n**The sources I added:** my Cornell notes from class (PDF scan), the textbook section (Chapter 12 PDF), and the cell division lab worksheet I did last week.\n\n**One claim NotebookLM made in the Study Guide:** \"Mitosis produces two genetically identical daughter cells, each with the same number of chromosomes as the parent cell.\"\n\n**The citation:** Citation 4 → textbook page 218.\n\n**What the source actually says:** Page 218 says \"Mitosis produces two diploid daughter cells genetically identical to the parent.\" The textbook uses the word *diploid*. NotebookLM swapped *diploid* for \"the same number of chromosomes as the parent cell.\"\n\n**My verdict:** Mostly accurate, but it dropped the technical word *diploid* — which is a vocabulary word Mr. Anderson is definitely going to test on. If I had only studied from NotebookLM's output, I would have missed that the right answer to \"what kind of cells does mitosis produce?\" is *diploid*, not just \"the same chromosome number.\" Lesson: I can't treat NotebookLM's simplifications as the final answer for vocab.",
        annotations: [
          'Names a specific class, teacher, topic, and test deadline — not "I made a study guide for biology"',
          'Identifies the EXACT word that got swapped (diploid → "same chromosome number") and explains why that swap matters for the actual test',
          'Comes to a real verdict — useful but lossy on vocabulary — and adjusts study strategy accordingly',
          'Shows the student is learning to read AI output critically, which is the actual skill this lesson is teaching',
        ],
      },
      weak: {
        label: 'Weak Response',
        body: 'I made a notebook for biology. I uploaded my notes. NotebookLM made a study guide and an audio overview. The study guide had a lot of facts. I checked the citations and they all matched. NotebookLM is a great study tool and I will use it for all my future tests.',
        annotations: [
          'No specific class, no specific topic, no specific test',
          '"All the citations matched" with zero specific examples is the easiest-to-spot fake — what claim did you check, what citation, what passage?',
          'Generic praise replaces actual analysis. The whole point of the lesson was to learn to be critical, and this response is the opposite of that',
          "Doesn't engage with the question being asked — name a specific claim and check it. Just glosses over it.",
        ],
      },
    },

    { type: 'section_header', id: 'd2-sh-iterate', label: 'Iterate — Change a Source, Regenerate' },
    {
      type: 'text',
      id: 'd2-iterate-text',
      content: "Now experiment. Add ONE new source to your notebook (a different chapter, a related YouTube video, a teacher handout you forgot) — OR remove a weak source you uploaded yesterday. Then **regenerate the Study Guide.**\n\nRead the new version. Compare it to yesterday's version. What changed? Did a hallucination disappear? Did a real fact disappear too? Did the AI suddenly start citing the new source heavily?",
    },
    {
      type: 'question',
      id: 'd2-iterate-q',
      questionType: 'short_answer',
      prompt: "Describe what you changed (added or removed a source — which one and why) and what shifted in the regenerated Study Guide. Be specific — name at least one concrete difference between the two versions.",
    },

    { type: 'section_header', id: 'd2-sh-audio', label: 'Audio Overview Challenge' },
    {
      type: 'text',
      id: 'd2-audio-text',
      content: "If you didn't already, generate an **Audio Overview** of your sources. Listen to the first 2 minutes. (Yes, it really does sound like a podcast — that's not a glitch.)",
    },
    {
      type: 'question',
      id: 'd2-audio-q',
      questionType: 'short_answer',
      prompt: 'Rate the Audio Overview on two things: (1) Accuracy — did the hosts actually represent your sources correctly, or did they oversimplify / mash things together? (2) Usefulness — would you actually listen to this before a test? Why or why not?',
    },

    { type: 'section_header', id: 'd2-sh-peer', label: 'Peer Test' },
    {
      type: 'question',
      id: 'd2-peer-q',
      questionType: 'short_answer',
      prompt: 'Swap notebooks with a partner. Read their FAQ or Study Guide for 3 minutes (not your subject — theirs). Write back: ONE specific compliment (something the AI did well in their notebook) and ONE specific concern (a claim that felt vague, oversimplified, or hard to verify). Be specific — name the claim.',
    },

    { type: 'section_header', id: 'd2-sh-submit', label: 'Submit Your Build' },
    {
      type: 'question',
      id: 'd2-submit-q',
      questionType: 'short_answer',
      prompt: 'Paste the FINAL share link to your NotebookLM notebook (after iterating). Plus one sentence: how is this notebook different from the version you submitted yesterday?',
    },

    { type: 'section_header', id: 'd2-sh-reflect', label: 'Reflection' },
    {
      type: 'question',
      id: 'd2-reflect-factcheck',
      questionType: 'short_answer',
      prompt: "Pick ONE specific claim from your NotebookLM Study Guide. Open its citation. Read the source passage. Does the AI accurately represent what the source says? Be specific — copy the AI's claim, copy the source passage, give your verdict.",
    },
    {
      type: 'question',
      id: 'd2-reflect-when',
      questionType: 'short_answer',
      prompt: 'When is grounded AI (NotebookLM) the RIGHT tool to use, and when is it the WRONG tool? Give one example of each. (Hint: think about what NotebookLM cannot do.)',
    },
    {
      type: 'question',
      id: 'd2-reflect-real',
      questionType: 'short_answer',
      prompt: "Will you actually use NotebookLM for a real class this year? If yes — which class, which test or project? If no — what's stopping you?",
    },
  ],
};

(async () => {
  for (const c of COURSES) {
    console.log(`\n=== ${c.label} (${c.id}) ===`);
    // Delete original
    const origRef = db.doc(`courses/${c.id}/lessons/ai-notebooklm-study-tool`);
    const origSnap = await origRef.get();
    if (origSnap.exists) {
      await origRef.delete();
      console.log('  ✗ Deleted ai-notebooklm-study-tool');
    } else {
      console.log('  - ai-notebooklm-study-tool not present');
    }
    // Day 1
    await safeLessonWrite(db, c.id, DAY1.id, DAY1);
    console.log(`  ✓ Wrote ${DAY1.id}`);
    // Day 2
    await safeLessonWrite(db, c.id, DAY2.id, DAY2);
    console.log(`  ✓ Wrote ${DAY2.id}`);
  }
  console.log('\nDone.');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
