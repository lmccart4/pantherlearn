/**
 * AI Literacy Project: AI Policy Pitch
 * Order: 75 | Visible: false | Unit: Course Projects
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-policy-pitch.jpg';

const lesson = {
  id: 'ai-project-policy-pitch',
  title: 'AI Policy Pitch: Write a Real Rule for a Real AI Harm',
  unit: 'Course Projects',
  order: 75,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Identify a specific, real AI harm in your school or local community',
      'Draft a written policy with scope, definitions, rules, enforcement, and review',
      'Stress-test your own policy against edge cases and bad-faith actors',
      'Pitch and defend a written rule in a town-council / school-board format',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Think about an AI problem that has actually shown up in your life or in your school in the last year. Not a hypothetical, not a sci-fi worry — something real. Describe what happened and who got affected.' },

    { type: 'image', id: id(), url: HERO_URL, alt: 'A school-board hearing room with a podium, microphones, and a draft AI policy on screen behind the speaker — students pitching real rules for real AI harms.' },

    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    { type: 'text', id: id(), content: `You're going to write a real policy.\n\nNot a hot take. Not a wish. A policy — the actual document a school board or city council would vote on. Title, scope, definitions, rules, exceptions, enforcement, review. The whole thing. Then you're going to pitch it to the class as a town council or school board would hear it: 4 minutes to present, 3 minutes of public questioning, 1 minute to respond.\n\nWhy: complaining about AI harms is easy. Writing a rule that actually works is hard. Once you sit down to write one, you find out fast that "ban deepfakes in school" doesn't mean anything until you define a deepfake, decide who enforces it, figure out what counts as a violation versus a misunderstanding, write an appeals process, and decide what happens to a student who didn't know the rule existed. That's the work of governance. It's hard because real life is messy.` },
    { type: 'callout', id: id(), content: '**Project goal: Write a policy a real school board could actually adopt — specific enough to enforce, fair enough to defend, narrow enough to pass.**' },

    { type: 'case_cards', id: id(), title: 'Pick a Harm to Address', cards: [
      { id: 'harm-deepfake', label: '1', title: 'Deepfake Harassment of Students or Staff',
        body: 'Synthetic images, video, or audio of a real student/teacher made without consent. Real, growing, and already prosecuted under NJ law. Define it, scope it, decide consequences.' },
      { id: 'harm-cheating', label: '2', title: 'AI-Generated Schoolwork',
        body: 'What counts as cheating, what counts as legitimate use, what counts as collaboration? Write the rule a teacher could actually apply on a Tuesday.' },
      { id: 'harm-surveillance', label: '3', title: 'AI Surveillance in Schools',
        body: 'Face recognition in hallways, behavior detection in classrooms, AI bathroom monitors. Decide what\'s permitted, what\'s banned, and what triggers parent notice.' },
      { id: 'harm-grading', label: '4', title: 'Biased AI Grading Software',
        body: 'AI essay graders that score multilingual or AAVE-influenced writing lower. Set rules for which AI tools can grade student work and how appeals work.' },
      { id: 'harm-algos', label: '5', title: 'Algorithm Impact on Teen Mental Health',
        body: 'A city- or district-level policy on how social platforms can target minors. Look at NYC, CA, and EU rules for templates.' },
      { id: 'harm-hiring', label: '6', title: 'AI Hiring Screeners for Teen Jobs / Internships',
        body: 'After-school jobs and internships increasingly use AI screeners. Should employers disclose? Should minors be exempt? Write the rule.' },
      { id: 'harm-political', label: '7', title: 'AI-Generated Political Ads in School Elections',
        body: 'Student council races now have AI-generated attack ads. Decide what disclosures are required and what content is banned outright.' },
      { id: 'harm-vendors', label: '8', title: 'Ed-Tech Vendors Training on Student Data',
        body: 'Some ed-tech tools quietly train AI on student writing. Set rules for vendor contracts, disclosure, opt-out, and data deletion.' },
    ]},

    { type: 'case_cards', id: id(), title: 'Policy Template — Use All 7 Sections', cards: [
      { id: 'tpl-scope', label: '1', title: 'Scope',
        body: 'Who and what does this policy cover? Students, staff, vendors. Where: on campus, school networks, school-issued devices, off-campus when it disrupts school?' },
      { id: 'tpl-defs', label: '2', title: 'Definitions',
        body: 'Every key term defined in plain language. If you say "deepfake," define deepfake. If you say "harm," define harm. Vague terms = unenforceable rule.' },
      { id: 'tpl-rules', label: '3', title: 'Rules',
        body: 'What is banned, what is required, what is permitted with limits. Be specific — name behaviors, not vibes.' },
      { id: 'tpl-exc', label: '4', title: 'Exceptions',
        body: 'Protected uses: parody for an academic project, news reporting, accessibility, classroom demonstrations. Without exceptions you accidentally ban legitimate work.' },
      { id: 'tpl-enf', label: '5', title: 'Enforcement',
        body: 'Who decides if a rule was broken, what happens at first offense vs. repeat, how the accused is notified, what evidence is required.' },
      { id: 'tpl-app', label: '6', title: 'Appeals',
        body: 'How someone challenges a finding or punishment. Who hears the appeal, how long they have to file, what the appeal panel looks like.' },
      { id: 'tpl-rev', label: '7', title: 'Review',
        body: 'When the policy gets re-examined and by whom. Annual review with student representation is the standard.' },
    ]},

    { type: 'definition', id: id(), term: 'Disparate Impact',
      definition: 'A neutral-sounding rule that ends up harming one protected group more than others. Under U.S. civil rights law (Title VII, Title VI, Title IX), you don\'t need to prove intent — you only need to show the impact. Cited as the legal core of the EEOC v. iTutorGroup AI hiring case and most algorithmic discrimination claims.' },
    { type: 'definition', id: id(), term: 'Scope',
      definition: 'The specific people, places, devices, and situations a policy applies to. A school deepfake policy with a tight scope might cover "students, staff, and third-party vendors on PAHS networks or PAHS-issued devices, plus off-campus conduct that materially disrupts school." Without a clearly written scope, every enforcement decision becomes an argument.' },

    { type: 'external_link', id: id(),
      title: 'NJ school cyber-harassment statute (NJSA 18A:37-14)',
      url: 'https://www.njleg.state.nj.us/legislative-statutes/18a',
      description: 'How NJ already defines harassment in schools. Mirror this format for definitions and enforcement.' },
    { type: 'external_link', id: id(),
      title: 'NIST AI Risk Management Framework',
      url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      description: 'Federal framework for evaluating AI systems. Useful language for the "scope" and "review" sections.' },
    { type: 'external_link', id: id(),
      title: 'EU AI Act — short summary',
      url: 'https://artificialintelligenceact.eu/high-level-summary/',
      description: 'How the EU defines tiers of AI risk. Lifts directly into school-policy language.' },

    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },
    { type: 'checklist', id: id(), title: 'Deliverables (individual project)', items: [
      'Policy document, 700–1,000 words, with all 7 template sections in order (Title, Scope, Definitions, Rules, Exceptions, Enforcement, Appeals, Review)',
      'Edge-case appendix (1 page, 5 stress-test cases — does your policy get the right answer or admit it doesn\'t?)',
      '4-minute pitch script and live delivery as if to a real school board',
      '3-minute Q&A defense — class becomes the public, asks hard questions, you answer in real time',
      'Reflection (the 3 questions at the bottom of this lesson)',
      'Submit one Google Doc/Slides link with name on page 1, set to "Anyone with the link can view"',
    ]},

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Pick the harm + research (1 period)**\n- Choose your topic. Write a one-paragraph statement of the harm you're solving — including a real example you can cite.\n- Read 2 existing policies on your topic (school district policy, state law, EU/federal guidance — the linked sources are a starting point).\n- Take notes on the structure of those real policies. Steal what works.\n\n**Day 2 — Draft the policy (1 period)**\n- Write the full document end-to-end. Don't worry about polish. Get every section on the page.\n- Trade drafts with a partner. They circle every word that's vague or undefined.\n\n**Day 3 — Stress test + revise (1 period)**\n- Build your edge-case appendix. List 5 cases where your policy might fail or backfire (a student who didn't know the rule existed; a teacher who used a banned tool for a legitimate reason; a parent who disagrees with the punishment; a deepfake made off-campus that targets a student; a vendor whose tool you can't enforce against).\n- Rewrite sections that fail the stress test.\n\n**Day 4 — Pitch prep + delivery (1 period)**\n- Write your 4-minute pitch script. Practice out loud once.\n- Half the class pitches; the other half asks questions and takes notes for next-day pitches.\n\n**Day 5 — Pitches continue + submit (1 period)**\n- Remaining students pitch.\n- Submit final policy + appendix + reflection.` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(), title: 'Project Rubric', totalPoints: 100, criteria: [
      { name: 'Specificity', weight: 25, levels: [
        { score: 4, label: 'Exemplary', description: 'Every term used in the policy is defined. Rules name concrete behaviors, not vibes ("posting a deepfake of another student to any platform" — not "misuse of AI"). Enforcement names specific roles ("the principal or designee").' },
        { score: 3, label: 'Proficient', description: 'Mostly specific. One or two key terms left vague.' },
        { score: 2, label: 'Developing', description: 'Several core terms undefined; rules feel like opinions.' },
        { score: 1, label: 'Beginning', description: 'Reads like a slogan, not a policy.' },
      ]},
      { name: 'Realism', weight: 25, levels: [
        { score: 4, label: 'Exemplary', description: 'Policy could be presented to a real school board on Monday and would survive. Doesn\'t ban legal activity, doesn\'t require impossible enforcement, fits inside existing law.' },
        { score: 3, label: 'Proficient', description: 'Mostly realistic; one section overreaches or under-reaches.' },
        { score: 2, label: 'Developing', description: 'Headline rule is fine but enforcement or scope is impossible.' },
        { score: 1, label: 'Beginning', description: 'Banning the unbannable, requiring the impossible, or contradicting existing law in a way that wouldn\'t survive review.' },
      ]},
      { name: 'Edge-Case Handling', weight: 20, levels: [
        { score: 4, label: 'Exemplary', description: 'Appendix identifies 5 genuinely hard cases. The policy either handles them cleanly or honestly admits where it doesn\'t and proposes a fix.' },
        { score: 3, label: 'Proficient', description: 'Edge cases are real but easy. The policy is shielded from criticism rather than tested.' },
        { score: 2, label: 'Developing', description: 'Edge cases are fake or trivially solved.' },
        { score: 1, label: 'Beginning', description: 'No real engagement with how the policy could fail.' },
      ]},
      { name: 'Pitch + Q&A', weight: 15, levels: [
        { score: 4, label: 'Exemplary', description: 'Spoke clearly, hit the time, opened with a concrete harm, fielded hard questions without evasion. Acknowledged real flaws when surfaced.' },
        { score: 3, label: 'Proficient', description: 'Solid pitch, weaker on Q&A.' },
        { score: 2, label: 'Developing', description: 'Read off the page, dodged questions, lost composure.' },
        { score: 1, label: 'Beginning', description: 'Unprepared.' },
      ]},
      { name: 'Reflection', weight: 15, levels: [
        { score: 4, label: 'Exemplary', description: 'Specific, honest. Names the edge case that almost broke the policy and explains how you handled it. Identifies a tension you couldn\'t fully resolve.' },
        { score: 3, label: 'Proficient', description: 'Reflection is honest but stays surface-level.' },
        { score: 2, label: 'Developing', description: 'Restates the policy without reflection.' },
        { score: 1, label: 'Beginning', description: 'Missing or generic.' },
      ]},
    ]},

    { type: 'section_header', id: 'sh-exemplars', label: 'Exemplars: Strong vs. Weak' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Both versions try to write a deepfake-harassment policy for Perth Amboy HS. One reads like a real document a school board could vote on. The other reads like a tweet. Notice what specifically changes between them.',
      strong: {
        label: 'Strong — Deepfake Harassment in Schools, PAHS Policy 2026-1',
        body: '**1. Scope.** This policy applies to all students enrolled at Perth Amboy HS, all PAHS staff, and all third-party vendors operating on PAHS networks. It applies to conduct (a) on PAHS property, (b) at PAHS-sponsored events, (c) on PAHS-issued devices or networks, and (d) off-campus conduct that creates a substantial disruption of the school environment, consistent with NJSA 18A:37-14.\n\n**2. Definitions.**\n- *Deepfake:* a synthetic image, video, or audio recording, created in whole or in part by a generative AI system, that depicts a real, identifiable person doing or saying something they did not actually do or say.\n- *Targeted person:* the real person depicted in a deepfake without their consent.\n- *Distribution:* sending, posting, or sharing in any form, including private messages, that results in a person other than the creator viewing or hearing the deepfake.\n\n**3. Rules.**\n- 3.1. No student or staff member shall create, possess, or distribute a sexually explicit deepfake of any real person, with no exceptions.\n- 3.2. No student or staff member shall create or distribute any non-consensual deepfake of a member of the PAHS community that a reasonable person would find harassing, defamatory, or threatening.\n- 3.3. Any student depicted in a deepfake covered by this policy has the right to (a) require its removal from any school-controlled space, and (b) request an investigation under section 5.\n\n**4. Exceptions.** Section 3.2 does not apply to (a) clearly labeled satire or parody created for an academic assignment with the targeted person\'s written consent, (b) educational demonstrations conducted by faculty using public figures or fictional persons, (c) news reporting on deepfakes that uses a deepfake as evidence and not as content.\n\n**5. Enforcement.**\n- 5.1. Reports go to the principal or designee. Initial review within 3 school days.\n- 5.2. First offense under 3.2: required restorative meeting with targeted person, removal of content from all school-accessible platforms, and parent notification. Second offense: suspension of 1–3 days. Repeat or aggravated cases under 3.1 (sexually explicit material): immediate referral to law enforcement under NJSA 2C:24-4.\n\n**6. Appeals.** A student found in violation may appeal to the Superintendent within 10 school days. Appeal panel includes one student representative.\n\n**7. Review.** This policy is reviewed annually by the PAHS Technology Committee, with at least two students seated on the committee.',
        annotations: [
          'Every key term ("deepfake," "distribution," "targeted person") is defined before it\'s used in a rule.',
          'Anchored in existing NJ law (NJSA 18A:37-14, NJSA 2C:24-4) so it doesn\'t conflict with state code.',
          'Carves real exceptions for satire, education, and news so a class project doesn\'t become a violation.',
          'Escalation (first/second/aggravated) makes enforcement proportional — a 9th grader who didn\'t know the rule isn\'t treated like someone making explicit content.',
          'Includes appeals AND a review cycle with student representation.',
        ],
      },
      weak: {
        label: 'Weak — same topic, school-board-rejected version',
        body: '*"Deepfake Policy. Deepfakes are bad and should not be allowed at our school. If a student makes a deepfake of another student or a teacher they should be in big trouble. The principal will decide what the punishment is. Teachers should also not make deepfakes. AI is being misused and we need to protect students from this. The school should also ban any AI tools that can make deepfakes. This policy will help keep our school safe. If a student is found making a deepfake they will be suspended."*',
        annotations: [
          '"Deepfake" is never defined. Is a Snapchat filter a deepfake? A Photoshop edit? A meme? Without a definition, the rule can\'t be applied — or worse, gets applied inconsistently.',
          '"Big trouble" and "the principal will decide" is the opposite of policy. Policy exists precisely so a single person doesn\'t get to decide outcomes alone.',
          '"Ban any AI tool that can make deepfakes" includes Photoshop, every phone camera, every AI assistant. Unenforceable.',
          'No exceptions for satire, education, or news. A teacher demonstrating how to spot a deepfake would technically be in violation.',
          'No appeals process. No review. No definition of harm. No grounding in existing law. A real school board would table this in 30 seconds.',
        ],
      },
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    { type: 'slide_submit', id: 'submit-final', maxScore: 100,
      prompt: '**Submit your individual policy package as a Google Doc or Slides link.**\n\nThe document MUST contain, in this order:\n1. The full policy (Title, Scope, Definitions, Rules, Exceptions, Enforcement, Appeals, Review)\n2. Your edge-case appendix (5 stress-test cases)\n3. Your pitch script (the 4-minute version you delivered)\n4. Your reflection (the questions below)\n\nMake sure the link is set to "Anyone with the link can view." Put your full name on page 1.' },

    { type: 'section_header', id: 'sh-reflect', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What edge case did you almost miss, and how did you handle it once you spotted it? Did you change a rule, add an exception, or admit your policy can\'t cover it?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Name one thing in your policy you are NOT sure about — a definition that\'s probably too narrow, an enforcement step that might not work, an exception you might be missing. Be honest. (Real policymakers do this in writing all the time.)' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'After writing this, do you think AI in schools is harder or easier to regulate than you thought going in? What changed your mind — or what confirmed what you already believed?' },
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
