/**
 * AI Literacy Course Project: Bias Audit Investigation
 * Lesson ID: ai-project-bias-audit
 * Order: 72 | Visible: false
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-bias-audit.jpg';

const lesson = {
  id: 'ai-project-bias-audit',
  title: 'Bias Audit: Run Your Own Investigation on a Real AI Product',
  unit: 'Course Projects',
  order: 72,
  visible: false,
  blocks: [
    // 1
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    // 2
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Design a controlled bias test on a real AI product (controlled variables, repeated trials, documented inputs/outputs)',
      'Run the test, collect evidence, and analyze results without cherry-picking',
      'Communicate findings clearly: what you tested, what you found, what it means',
      'Propose a concrete, ship-able fix the company could actually implement',
    ]},
    // 3
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Pick one AI product you actually use (or have used). What is one moment where you noticed — or suspected — it was treating someone unfairly? Be specific about what happened.' },

    // Hero image
    { type: 'image', id: id(), url: HERO_URL, alt: 'A magnifying glass over a glowing AI interface, evidence-style investigation visual for the Bias Audit project' },

    // 4
    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    // 5
    { type: 'text', id: id(), content: `You are going to do real bias-auditing work — the same kind of investigation that researchers, journalists, and ethics teams at tech companies do for a living.\n\nIn the Bias Detective game and the Data Labeling Lab, you saw bias as a concept. Now you're going to find it in the wild.\n\n**You will:**\n\n- Pick one accessible AI product you can actually test\n- Design a fair, controlled experiment to probe it for bias\n- Run that experiment with enough trials that one weird result can't fool you\n- Document everything (screenshots, transcripts, raw outputs)\n- Write up what you found and what it means\n- Propose a concrete fix the company could ship\n\nThis isn't a hot take. It's evidence. Anyone who reads your final report should be able to look at your method and your data and either trust your conclusion or run the test themselves and check.` },
    // 6
    { type: 'callout', id: id(), content: '**Project Goal:** Design and run a controlled bias test on a real AI product, document the evidence, and propose a fix the company could actually implement.' },

    // 7
    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },
    // 8 — checklist replaces the deliverables text
    { type: 'checklist', id: id(), title: 'Deliverables (one Google Doc or Slides deck, in this order)', items: [
      'Product & Hypothesis (150–200 words): which AI product, and a falsifiable prediction in the form "I predict this product will ___ when I ___."',
      'Methodology (250–350 words): controlled variable, the variable you change, exact prompt template, and how you decided what counts as biased BEFORE running trials',
      'Trial plan: minimum 10 trials per condition, at least 2 conditions (20+ outputs total)',
      'Evidence Table: one row per trial — number, input/prompt, output (or clear summary), classification — plus 6+ screenshots pasted directly into the doc',
      'Findings (200–300 words): the pattern with real counts ("8 of 10…"), surprises, and what did NOT happen that you expected to',
      'Proposed Fix (150–250 words): one concrete change the company could ship in 6 months, why it addresses your finding, and what it would NOT solve',
      'Reflection (the 3 questions at the bottom of this lesson)',
      'Total length: 900–1,300 words plus the evidence table and screenshots',
    ]},

    // 9
    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    // 10
    { type: 'text', id: id(), content: `**Day 1 — Pick & Plan**\n- Pick your product (see the menu in the next section).\n- Write your hypothesis as a single sentence.\n- Draft your method: what's your controlled variable, what's the variable you change, what counts as biased?\n- **End of day:** show me your hypothesis + method before you run anything.\n\n**Day 2 — Run trials, round 1**\n- Run 10 trials of condition A. Screenshot every single one.\n- Paste outputs into your doc as you go. Number them.\n- Don't cherry-pick. The boring trials are evidence too.\n\n**Day 3 — Run trials, round 2**\n- Run 10 trials of condition B (the comparison condition).\n- Same rules: screenshot, document, number.\n- Build your evidence table as you go.\n\n**Day 4 — Analyze**\n- Count up the patterns. Use real numbers ("7 of 10," not "a lot").\n- Write the Findings section.\n- Look for the surprise — the thing you didn't expect.\n\n**Day 5 — Write the report + propose a fix**\n- Write the Methodology and Product/Hypothesis sections.\n- Draft your proposed fix. Make it specific. ("Add a diversity prompt-rewriter" is too vague. "When the input is a profession, sample skin tones and genders uniformly across N generations and surface a banner that says 'we randomized demographics — see settings' " — that's specific.)\n- Reflection questions.\n- Submit.` },

    // 11
    { type: 'section_header', id: 'sh-products', label: 'Pick One Product to Audit' },
    // 12 — case_cards replace the bulleted product menu
    { type: 'case_cards', id: id(), title: 'Pick One Product to Audit', cards: [
      { id: 'card-chatbot', label: '1', title: 'Chatbot (ChatGPT, Claude, Gemini, Meta AI)',
        body: '**What to test:** identical questions where one variable changes — name, accent, claimed profession, country, age.\n\n**Bias dimensions to look for:** advice quality, tone, hedging, refusals, recommended resources. Does the model treat "Aisha" differently than "Emily"? Does a "construction worker" get a different career-advice answer than a "doctor"?' },
      { id: 'card-image', label: '2', title: 'Image Generator (DALL-E, Gemini, Firefly, Midjourney trial)',
        body: '**What to test:** profession or activity prompts with NO demographic words — "a CEO at their desk," "a nurse helping a patient," "a person fixing a car."\n\n**Bias dimensions to look for:** race, gender, age, body type, setting, clothing. Run 10+ generations and count.' },
      { id: 'card-feed', label: '3', title: 'Recommendation Feed (TikTok, YouTube Shorts, Instagram Reels)',
        body: '**What to test:** make a fresh account, watch only one type of content for 30 minutes, document every recommendation.\n\n**Bias dimensions to look for:** rabbit-holing toward extreme content, demographic targeting, content category drift. Compare two fresh accounts that started with different "first watch" choices.' },
      { id: 'card-translate', label: '4', title: 'Translation (Google Translate, DeepL)',
        body: '**What to test:** the classic gendered-language test. Translate "the doctor said" or "the nurse arrived" into Spanish, French, or Arabic and back. Test profession nouns at scale.\n\n**Bias dimensions to look for:** which professions default to masculine vs. feminine forms, and how often the round-trip flips gender.' },
      { id: 'card-autocomplete', label: '5', title: 'Autocomplete (Google Search, Gmail Smart Compose)',
        body: '**What to test:** type the same prefix with different demographic terms. "Why are women so…" vs. "Why are men so…" vs. "Why are teenagers so…"\n\n**Bias dimensions to look for:** the suggested completions themselves. Screenshot every one — these change.' },
      { id: 'card-screener', label: '6', title: 'Resume / Hiring Screener Demo',
        body: '**What to test:** some companies post free demos of resume-screening AI. Submit the same resume with one variable swapped — name, college, ZIP code, gendered pronouns.\n\n**Bias dimensions to look for:** score differences, ranking changes, filtered-out resumes. Document the exact swap and the exact score.' },
    ]},

    // Methodology definitions
    { type: 'definition', id: id(), term: 'Controlled Variable',
      definition: 'The thing that stays **exactly the same** across every trial in a condition. In a bias audit, your prompt template, model, settings, and time of day should all be controlled — only the one variable you are testing (a name, a profession, an accent) should change. Without a controlled variable, you cannot tell whether your finding is real bias or just noise.' },
    { type: 'definition', id: id(), term: 'Decision Rule',
      definition: 'The rule you write **before running trials** that defines what counts as a "biased" vs. "fair" output. Example: "I will record perceived gender as man/woman/ambiguous and perceived race as white/Black/Asian/Latino/ambiguous, and I will not recode after seeing results." Decision rules prevent the most common research mistake — deciding what counts as bias *after* you have already seen the outputs.' },
    { type: 'definition', id: id(), term: 'Sample Size',
      definition: 'The number of trials you run per condition. In this project, the floor is **10 trials per condition** with at least 2 conditions (20+ outputs total). Why? With fewer than 10, one weird result can flip your conclusion. With 10+ you can report findings as ratios ("8 of 10") that resist cherry-picking.' },

    // 13
    { type: 'section_header', id: 'sh-rubric', label: 'Project Rubric' },
    // 14 — structured rubric block
    { type: 'rubric', id: id(), title: 'Project Rubric', totalPoints: 100, criteria: [
      { name: 'Method Design', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Clear hypothesis with a specific predicted number, exactly one variable changed between conditions, decision rule for "biased vs. fair" written before trials. A stranger could replicate your test from your method alone.' },
        { score: 3, label: 'Proficient', description: 'Method is clear but one of the above (hypothesis specificity, single-variable control, or pre-written decision rule) is fuzzy or missing.' },
        { score: 2, label: 'Developing', description: 'Method is sketched but variables are not controlled, or the bias criterion is decided after looking at outputs.' },
        { score: 1, label: 'Beginning', description: 'No real method — just tried some prompts and reported impressions.' },
      ]},
      { name: 'Evidence Quality', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: '20+ trials with full screenshots, numbered evidence table, no cherry-picking, raw outputs preserved exactly as the AI returned them.' },
        { score: 3, label: 'Proficient', description: '15–19 trials with most screenshots and a complete table.' },
        { score: 2, label: 'Developing', description: '10–14 trials, partial screenshots, table is incomplete.' },
        { score: 1, label: 'Beginning', description: 'Fewer than 10 trials or no screenshots at all.' },
      ]},
      { name: 'Analysis', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Findings use real counts ("7 of 10"), name a specific pattern, and call out at least one thing that surprised you or that did NOT happen as expected.' },
        { score: 3, label: 'Proficient', description: 'Counts are present and a pattern is named, but no surprise/null result is identified.' },
        { score: 2, label: 'Developing', description: 'Findings are general ("there was bias") without specific numbers.' },
        { score: 1, label: 'Beginning', description: 'Findings are vibes — no numbers, no pattern named.' },
      ]},
      { name: 'Proposed Fix', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Fix is concrete enough to be on a product team\'s roadmap, addresses the specific bias found, and acknowledges what it does NOT solve.' },
        { score: 3, label: 'Proficient', description: 'Fix is concrete but does not acknowledge limits.' },
        { score: 2, label: 'Developing', description: 'Fix is vague ("more diverse data") or does not match the specific finding.' },
        { score: 1, label: 'Beginning', description: 'No fix proposed, or just "the company should do better."' },
      ]},
      { name: 'Communication', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Report is well-organized, easy to follow, screenshots are labeled, length is in range, no walls of text.' },
        { score: 3, label: 'Proficient', description: 'Organized but a section is thin or unclear.' },
        { score: 2, label: 'Developing', description: 'Reader has to work to follow the argument.' },
        { score: 1, label: 'Beginning', description: 'Disorganized, hard to follow, missing sections.' },
      ]},
    ]},

    // 15 — exemplar_compare replaces the strong + weak text blocks
    { type: 'section_header', id: 'sh-exemplars', label: 'Exemplars: Strong vs. Weak' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Both responses are answering: "Audit DALL-E for demographic bias on profession prompts. Show your method, evidence, findings, and a proposed fix."',
      strong: {
        label: 'Strong Response',
        body: `**Product & Hypothesis**\nI tested DALL-E 3 (via ChatGPT free tier) on profession prompts. **Hypothesis:** When I ask DALL-E to generate "a CEO at their desk," it will produce a white man over the age of 40 in more than 70% of generations, even when no demographic information is included in the prompt.\n\n**Methodology**\n- **Controlled variable:** Same prompt template every trial — "A photo of a CEO at their desk in a corner office. Realistic, professional lighting."\n- **Comparison condition:** Same prompt with the word "CEO" swapped for "kindergarten teacher."\n- **Trials:** 10 generations per condition, 20 total. New chat session for each trial to avoid memory contamination.\n- **Decision rule (written before running):** I will record perceived race (white / Black / Asian / Latino / ambiguous), perceived gender (man / woman / ambiguous), and perceived age bracket (under 40 / over 40). I will not recode after seeing results.\n\n**Findings (excerpt)**\nIn the CEO condition, 9 of 10 generations were men. 8 of 10 read as white. 10 of 10 read as over 40. In the kindergarten teacher condition, 10 of 10 were women, 7 of 10 read as white, and 9 of 10 read as under 40.\n\nThe surprise: in the CEO condition, every single image had the same desk angle and similar lighting — DALL-E seems to have a "CEO photo" template that is also encoding demographic defaults. The teacher images had much more visual variety.\n\n**Proposed Fix**\nDALL-E should add a "demographic randomizer" that activates when prompts contain profession nouns without demographic modifiers. When it detects "CEO," "doctor," "nurse," "teacher," etc., it samples gender and skin tone uniformly across the batch, and surfaces a small banner: "We randomized demographics for this prompt — click to specify." This addresses the default-bias issue without forcing diversity on prompts where the user explicitly specified demographics. **It does NOT solve** the deeper training-data imbalance, and it does NOT address bias in non-profession prompts (e.g., "criminal," "scientist working late") which would need their own treatment.`,
        annotations: [
          'Hypothesis is specific and falsifiable — it predicts a number (>70%), not a vibe',
          'Method changes exactly one variable (the profession word) and holds the rest constant',
          'Bias-coding rule was written before trials, not after — kills cherry-picking',
          'Findings include a surprise (the CEO "template" pattern) — the mark of someone who actually looked at their data',
          'Fix is concrete enough to ship AND names what it does NOT solve',
        ],
      },
      weak: {
        label: 'Weak Response',
        body: `**Product & Hypothesis**\nI tested DALL-E. I think AI is biased.\n\n**Methodology**\nI asked it to make some pictures of CEOs and they were mostly white guys. Then I tried "kindergarten teacher" and got a bunch of women. AI is biased.\n\n**Findings**\nThe CEO ones were biased toward white men. The teacher ones were biased toward women. This shows AI has bias.\n\n**Proposed Fix**\nThe company should fix their data and be more inclusive. They should hire more diverse engineers.`,
        annotations: [
          'Hypothesis is a vibe, not a testable prediction with a number',
          'No trial count, no controlled variable, no screenshots — a reader has no way to check the work',
          '"Mostly" is not a finding. 6 of 10 and 10 of 10 are very different stories.',
          'Proposed fix is a slogan, not a feature. A product manager could not put it on a roadmap.',
          'No surprise, no nuance, no acknowledgment of what the fix would not solve',
        ],
      },
    },

    // 19
    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    // 20
    { type: 'slide_submit', id: 'submit-final', prompt: '**Paste your Google Doc or Slides link here.** Make sure it is set to "Anyone with the link can view." Submit when your full report (all 6 sections + evidence table + screenshots) is finished.', maxScore: 100 },

    // 21
    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    // 22
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What is one thing your data showed that you did NOT predict — a surprise, a counter-example, or a place where the AI was actually less biased than you expected?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Whose responsibility is it to fix the bias you found? The engineers? The company? Regulators? Users? Make a case — and be honest about who has the power to actually change it.' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'If you had a 1-hour meeting with the product team that built the AI you tested, what is the single most important thing you would tell them, and why?' },
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
