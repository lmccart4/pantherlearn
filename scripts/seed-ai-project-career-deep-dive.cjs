/**
 * AI Literacy Project Lesson: Career Deep-Dive
 * Order: 77 | Visible: false | Unit: Course Projects
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-career-deep-dive.jpg';

const lesson = {
  id: 'ai-project-career-deep-dive',
  title: 'AI Career Deep-Dive: Investigate a Real Path',
  unit: 'Course Projects',
  order: 77,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Investigate one specific AI-adjacent career using primary and secondary sources',
      'Attempt real outreach to a working professional in that field',
      'Project realistically how the role will evolve over the next 5 years',
      'Communicate findings in a career-fair poster + 3-minute presentation',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Forget money for a second. What kind of work — solving what kind of problem — would you actually want to do every day? Then: where might AI sit in that work?' },

    { type: 'image', id: id(), url: HERO_URL,
      alt: 'AI career deep-dive hero — professional researching an AI-adjacent role at a desk with notes, laptop, and reference materials.' },

    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    { type: 'text', id: id(), content: `Most career research projects are surface-level: pick a job, copy a few stats from a website, done. This one is different.\n\nYou are going to pick **one** AI-adjacent career and investigate it like a journalist. That means going past the first page of Google. That means trying — actually trying — to talk to a real person in the field. That means looking at where the role is heading, not just where it is today.\n\nThe goal is not to convince yourself this is the job for you. The goal is to understand it well enough that you could explain it to a younger sibling, a parent, or a skeptical friend — and answer their hard questions.\n\nYou get a wide list of roles to choose from. **Non-coding roles count.** Pick something that genuinely interests you. If your dream career isn't on the list, ask Mr. McCarthy — odds are it has an AI angle and you can investigate that.` },
    { type: 'callout', id: id(), content: '**Project goal: Become the person in the room who actually knows what this job is, what it pays, who does it well, and where it\'s going.**' },

    { type: 'case_cards', id: id(),
      title: 'Candidate Roles to Investigate',
      cards: [
        { id: 'card-mle', label: 'T', title: 'ML Engineer',
          body: 'Builds and ships machine-learning models in production. Education: CS degree (BS/MS), strong Python + math, often a portfolio of trained models. Pay: ~$130K entry, $200K+ mid, $400K+ senior at FAANG. Hires: every major tech company plus most Fortune 500.' },
        { id: 'card-mlops', label: 'T', title: 'MLOps Engineer',
          body: 'Keeps models running reliably at scale — pipelines, monitoring, retraining, infra. Education: CS or data engineering background, cloud certs (AWS/GCP). Pay: $120K-$220K. Hires: any company with models in production.' },
        { id: 'card-rlhf', label: 'T', title: 'RLHF / AI Training Specialist',
          body: 'Designs human-feedback datasets and rates model outputs to shape behavior. Education: domain expertise (writing, code, science) + careful judgment. Pay: $35-$80/hr contract, full-time $90K-$160K. Hires: OpenAI, Anthropic, Scale, Surge, Invisible.' },
        { id: 'card-ethics', label: 'H', title: 'AI Ethics Officer',
          body: 'Decides whether and how AI tools get used in a hospital, bank, or agency. Education: JD, MD, or master\'s in bioethics/policy + self-taught AI literacy. Pay: $95K-$200K+. Hires: hospital systems, major banks, government agencies, big tech.' },
        { id: 'card-policy', label: 'H', title: 'AI Policy Analyst',
          body: 'Researches and writes regulation around AI for governments, think tanks, or industry. Education: poli-sci/law/public-policy degree, technical fluency. Pay: $70K-$160K. Hires: federal agencies, AI labs (policy teams), Brookings, RAND, AI Now.' },
        { id: 'card-pm', label: 'H', title: 'AI Product Manager',
          body: 'Decides what an AI product should do, who it\'s for, and what gets built next. Education: any 4-year degree + deep product sense + technical fluency. Pay: $130K-$300K+. Hires: any company shipping AI features.' },
        { id: 'card-prompt', label: 'H', title: 'Prompt Engineer / AI Workflow Designer',
          body: 'Designs prompts, chains, and AI-powered workflows for a specific business. Education: varies — strong writing, systems thinking, domain knowledge. Pay: $80K-$200K. Hires: enterprises adopting AI internally, AI consultancies.' },
        { id: 'card-doctor', label: 'N', title: 'AI-Fluent Doctor',
          body: 'Practicing physician who can evaluate, deploy, and override AI diagnostic tools in clinical care. Education: MD + AI-in-medicine training (Stanford, Mayo, Coursera). Pay: physician baseline + 10-20% premium for informatics roles. Hires: hospitals adopting clinical AI.' },
        { id: 'card-lawyer', label: 'N', title: 'AI-Fluent Lawyer',
          body: 'Practices law in IP, employment, or compliance with deep understanding of AI tools and risks. Education: JD + tech-policy or IP focus. Pay: BigLaw $215K+ first year, in-house $180K-$400K. Hires: law firms, corporate counsel teams.' },
        { id: 'card-teacher', label: 'N', title: 'AI-Fluent Educator',
          body: 'Teaches, builds curriculum, or runs district AI programs. Education: teaching credential + AI literacy + curriculum design. Pay: $55K-$120K (district). Hires: districts, edtech companies, teacher-PD providers.' },
        { id: 'card-journalist', label: 'N', title: 'AI Journalist',
          body: 'Reports on AI for general audiences — tech, policy, society. Education: journalism or strong writing portfolio + tech literacy. Pay: $50K-$150K. Hires: NYT, WaPo, The Verge, 404 Media, Platformer, trade pubs.' },
        { id: 'card-founder', label: 'E', title: 'AI Startup Founder',
          body: 'Starts a company building or applying AI. Education: not required — track record matters more. Pay: $0 to billions, mostly $0. Path: SAFE/seed $250K-$3M, then Series A. Hires: yourself.' },
        { id: 'card-creator', label: 'E', title: 'AI-Tool Creator / Solo Builder',
          body: 'Builds and sells small AI tools, agents, or content as a one-person business. Education: builder mindset + a niche audience. Pay: $0-$500K+ depending on traction. Hires: yourself.' },
      ]},

    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },
    { type: 'checklist', id: id(), title: 'Deliverables',
      items: [
        'Career-Fair Poster — digital, single-slide format, 24" x 36" portrait (1800 x 2700 px), built in Canva or Google Slides',
        'Title panel — job title + one-sentence definition in plain English (no jargon)',
        'Day-in-the-life panel — 3-5 specific tasks the person actually does (not "uses AI")',
        'Skills + education path — what you genuinely need to break in',
        'Pay range — entry / mid / senior with the source cited',
        '2-3 real companies or organizations that hire for this role, named',
        '5-Year Projection paragraph — your prediction with reasoning, including a counterargument',
        'Sources panel — at least 5 named sources (1 government/academic, 1 industry minimum)',
        '3-Minute Presentation — stand-and-deliver, ready for two audience questions',
        'Interview Attempt — at least one outreach attempt to a working professional (or analysis of a real podcast/video interview)',
      ]},

    { type: 'callout', id: id(), content: '**No "according to AI."** If you used a chatbot to find a fact, double-check it against a real source and cite that source — not the chatbot.' },

    { type: 'external_link', id: id(),
      title: 'BLS Occupational Outlook Handbook',
      url: 'https://www.bls.gov/ooh/',
      description: 'Government data on pay, growth, and education requirements. Search the closest job title to yours (e.g., "Computer and Information Research Scientists" for AI researchers).' },
    { type: 'external_link', id: id(),
      title: 'LinkedIn — Search for People in Your Target Role',
      url: 'https://www.linkedin.com/search/results/people/',
      description: 'Filter by job title + city. Read 5-10 profiles before you message anyone — pattern-match the actual career path.' },
    { type: 'external_link', id: id(),
      title: 'How to Send a Cold Outreach Message That Gets a Reply',
      url: 'https://www.themuse.com/advice/how-to-write-a-coldoutreach-message-on-linkedin-that-actually-gets-replies',
      description: 'Read this BEFORE you message anyone. Short, specific, says what you want, asks one easy thing.' },

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Pick + Scope (in class)**\n- Pick your role. Submit your top choice + a backup.\n- Write a 3-sentence "what I think this job is right now" statement. You'll compare it to what you learn.\n\n**Day 2 — Foundational Research (in class + ~30 min HW)**\n- BLS data, Wikipedia (start here, don't end here), 2-3 industry articles from the last 6 months.\n- Identify 5 real companies or organizations that hire for this role.\n- Save every source. You will cite all of them.\n\n**Day 3 — Outreach + Deep Research (in class + HW)**\n- Send your interview request(s). Aim for 3 attempts — assume most won't reply.\n- Read 2 firsthand accounts: a podcast interview, a "day in my life" video, a substack post by someone in the role.\n- Start drafting your 5-year projection. What's automating in this field? What's growing? Who's investing money?\n\n**Day 4 — Build the Poster (in class)**\n- Use the Canva or Slides template Mr. McCarthy posts.\n- Clean visual hierarchy. Your name, the role, and the day-in-the-life panel should be readable from across a room.\n- No AI-generated images of "robots." Use photos, screenshots of real data, clean charts.\n\n**Day 5 — Refine + Rehearse (in class)**\n- Peer feedback round: trade posters with one classmate, give two pieces of useful criticism each.\n- Practice your 3-minute pitch out loud. Time it. If it's 4 minutes, cut.\n- Submit poster link + interview log.\n\n**Day 6 — Career Fair (in class)**\n- Posters go up around the room.\n- Half the class presents, half the class circulates and asks questions. Then swap.\n- Each presenter answers two audience questions on the spot.` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(), title: 'Project Rubric', totalPoints: 100,
      criteria: [
        { name: 'Depth of Research', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: '6+ named sources, mix of primary/government/industry, every fact traceable. No AI summaries presented as fact.' },
          { score: 3, label: 'Proficient', description: '5 named sources, mostly secondary, all facts traceable to a source.' },
          { score: 2, label: 'Developing', description: '4 sources, some unsourced claims, heavy reliance on a single source.' },
          { score: 1, label: 'Beginning', description: 'Fewer than 4 sources, vague attributions ("the internet says"), or AI output presented as fact.' },
        ]},
        { name: 'Interview Attempt + Quality', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: '3+ thoughtful, personalized outreach messages OR a landed interview analyzed with specific quotes, tensions noticed, follow-up questions in the poster.' },
          { score: 3, label: 'Proficient', description: '2-3 outreach messages, clearly written and specific to the recipient.' },
          { score: 2, label: 'Developing', description: '1 outreach message OR cited a podcast/video as the "interview" with thin analysis.' },
          { score: 1, label: 'Beginning', description: 'No outreach attempt, or outreach is generic ("Hi can you tell me about your job").' },
        ]},
        { name: '5-Year Projection', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Names specific forces (a regulation, a model release, a labor trend), takes a clear position, considers a counterargument.' },
          { score: 3, label: 'Proficient', description: 'Names 1-2 specific forces, takes a position, reasoning is logical.' },
          { score: 2, label: 'Developing', description: 'Generic projection ("AI will keep growing"), few specifics.' },
          { score: 1, label: 'Beginning', description: 'No projection, or projection is one sentence with no reasoning.' },
        ]},
        { name: 'Poster Design + Clarity', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Visual hierarchy clear from 6 feet away. Day-in-the-life is concrete. No clutter. No fake "AI robot" stock images.' },
          { score: 3, label: 'Proficient', description: 'Readable, organized, mostly concrete. Minor design issues.' },
          { score: 2, label: 'Developing', description: 'Information is there but cluttered, hard to scan, or has generic visuals.' },
          { score: 1, label: 'Beginning', description: 'Wall of text, hard to read, or missing required panels.' },
        ]},
        { name: 'Presentation + Q&A', weight: 20, levels: [
          { score: 4, label: 'Exemplary', description: 'Hit 3 minutes within ±15 seconds. Made eye contact. Answered both audience questions with specific evidence from research.' },
          { score: 3, label: 'Proficient', description: 'Roughly on time, mostly clear, answered questions.' },
          { score: 2, label: 'Developing', description: 'Significantly over/under time, read off poster, struggled with questions.' },
          { score: 1, label: 'Beginning', description: 'Did not present, or read entire poster word-for-word, no Q&A.' },
        ]},
      ]},

    { type: 'section_header', id: 'sh-exemplars', label: 'Strong vs Weak Exemplar' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Two student posters investigating different AI-adjacent careers. Read both. Notice what makes one specific and defensible and the other generic.',
      strong: {
        label: 'Strong: AI Ethics Officer at a Hospital System',
        body: `**Title:** "AI Ethics Officer — The person who decides whether the hospital's new AI tool gets used on real patients."\n\n**Day in the life:** Reviews vendor pitches for AI diagnostic tools. Sits in on clinical trials. Reads FDA guidance the day it drops. Writes one-page memos for hospital leadership translating technical risk into legal/patient terms. Trains nurses on when to override an AI recommendation.\n\n**Skills + education:** JD, MD, or master's in bioethics. Most current officers came from law (compliance) or medicine (informatics). Self-taught AI literacy is mandatory — most major hospitals now require Coursera/MIT certificates.\n\n**Pay:** Entry $95K-$120K (compliance officer track), Mid $140K-$180K, Senior $200K+ (Chief AI Officer at major systems). Source: BLS Compliance Officers + Stanford 2025 health AI workforce report.\n\n**Companies:** Cleveland Clinic, Kaiser Permanente, Mass General Brigham — all have named Chief AI Officers as of 2025.\n\n**Interview:** Cold-emailed Dr. Maria Chen, Director of AI Ethics at NYU Langone (found via NYU faculty page). She replied with a 4-question Q&A. Quote: "The hardest part isn't the AI. It's getting a 60-year-old physician to admit when the model is right and they were wrong."\n\n**Sources:** BLS, FDA AI/ML Software guidance (2024), Stanford HAI report, Dr. Chen email interview, JAMA editorial "AI Ethics in Practice" (Mar 2025).\n\n**5-Year Projection:** *By 2030, every hospital system over 500 beds will have a named AI Ethics Officer or be in legal trouble. The driver is not idealism — it's liability. The first major lawsuit involving an AI misdiagnosis (and there will be one) will create the same hiring panic HIPAA created in the late 1990s. Pay will jump 30-50%, and the role will split into two tracks: a clinical-facing role for hospitals and an enterprise-facing role for the vendors selling them tools. The risk to this projection is regulatory capture — if AI tool vendors successfully lobby for self-certification, the role gets weaker. I think they'll lose that fight after the first lawsuit.*`,
        annotations: [
          'Specific institutions named, not "experts say"',
          'Pay sourced to government data + named industry report',
          'Real interview attempted in writing, produced a quotable line',
          'Projection takes a position AND names what could prove it wrong',
        ]
      },
      weak: {
        label: 'Weak: AI Engineer',
        body: `**Title:** "An AI engineer makes AI. They use Python and machine learning to make computers smart. They work at companies like Google."\n\n**Day in the life:** "They code all day. They train models. They go to meetings."\n\n**Skills:** "Math and coding. A computer science degree."\n\n**Pay:** "Around $100,000 according to ChatGPT."\n\n**Companies:** "Google, Microsoft, Apple."\n\n**Interview:** Did not attempt.\n\n**Sources:** ChatGPT, Wikipedia.\n\n**5-Year Projection:** *AI engineers will keep being important because AI is the future. There will be more of them and they will make more money. AI is changing the world.*`,
        annotations: [
          '"AI engineer" is too vague — every panel describes a stereotype, not a real role',
          'Pay sourced to a chatbot, which is not a source',
          'No interview attempt at all — automatic 1 on Criterion 2',
          'Projection is a vibe, not an argument — no specific forces, no counterargument',
        ]
      }
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    { type: 'slide_submit', id: 'submit-final',
      prompt: 'Paste your Google Slides or Canva link below. Make sure the share setting is **Anyone with the link can view**. After submitting, double-check the embed loads. Submit before your presentation day.',
      maxScore: 100 },

    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What\'s the gap between where you are right now (junior in 9th grade, current skills, current network) and where you\'d need to be to actually get this job? Be specific — what would you need to learn, build, or experience?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'What surprised you most while researching this career? Something you assumed and turned out to be wrong about — what was it?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'After doing this research, are you more or less interested in this path than when you started? Why?' },
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
