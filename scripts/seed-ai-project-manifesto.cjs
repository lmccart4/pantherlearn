/**
 * AI Literacy Project Lesson: Personal AI Manifesto (Course Capstone)
 * Order: 79 | Visible: false | Unit: Course Projects
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];
const COURSE_IDS = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

const HERO_URL = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/year-end-projects/project-manifesto.jpg';

const lesson = {
  id: 'ai-project-manifesto',
  title: 'Personal AI Manifesto: Where You Land After a Year of This',
  unit: 'Course Projects',
  order: 79,
  visible: false,
  blocks: [
    { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },
    { type: 'objectives', id: 'obj-1', title: 'Learning Objectives', items: [
      'Synthesize a year of AI literacy into a clear personal stance',
      'Cite specific lessons and experiences from this course as evidence',
      'Distinguish your real beliefs from inherited or default opinions',
      'Communicate a complicated position in your own voice, in writing',
    ]},
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Without thinking too hard: in one sentence, what do you actually believe about AI right now? Not what you\'re supposed to believe — what you believe. Save this. You\'ll come back to it.' },

    { type: 'image', id: id(), url: HERO_URL,
      alt: 'Personal AI Manifesto hero — student writing a thoughtful, voice-driven document by hand and on screen.' },

    { type: 'section_header', id: 'sh-project', label: 'The Project' },
    { type: 'definition', id: id(), term: 'Manifesto',
      definition: 'A short, public, personal declaration of beliefs and intentions. Not an essay weighing both sides. Not a research paper. A piece of writing where you actually take a position — what you believe, why you believe it, and how you intend to live as a result. The word comes from the Latin *manifestus*: "made plain, openly shown."' },
    { type: 'text', id: id(), content: `This is the capstone. The synthesis. The "where do you land?" project.\n\nYou have spent a year inside this course. You ran a Hallucination Lab. You used the Bias Detective. You watched embedding spaces fold language into geometry. You debated who is accountable when an algorithm denies someone bail. You read about AI in healthcare, in hiring, in policing, in art. You wrote prompts. You broke chatbots. You used AI to help you make things.\n\nNow you're going to write your **Personal AI Manifesto** — a 800-1200 word document that answers: *After all of that, what do you actually believe about AI, and how will you live with it?*\n\nThis is not "AI is good" or "AI is bad." Those answers are too small. The real question is more like: *When will I use it? When won't I? What do I refuse to outsource? What do I think it's doing to my generation? What do I think it should never be allowed to do? And why do I believe what I believe?*\n\nYou are not graded on what you believe. You are graded on whether you actually believe it — meaning, whether your writing has specific evidence, real reasoning, and your own voice instead of borrowed phrases.` },
    { type: 'callout', id: id(), content: '**Project goal: Write a manifesto specific enough that no one else in the class could have written it.**' },

    { type: 'section_header', id: 'sh-structure', label: 'Manifesto Structure' },
    { type: 'case_cards', id: id(),
      title: 'Manifesto Structure (use all three)',
      cards: [
        { id: 'card-stance', label: '1', title: 'Stance (~150 words)',
          body: 'Your clear, specific position. Not "AI is good or bad." Not "AI is a tool." A *real* position — something a chatbot would not write because it isn\'t safe and balanced.\n\nUse first person. "I will / I will not / I believe / I refuse..." Take a small risk. Say something a thoughtful person could disagree with.' },
        { id: 'card-evidence', label: '2', title: 'Evidence (~500-700 words)',
          body: 'At least **5 specific lessons or experiences from this course**, cited by name, each tied to a concrete moment.\n\nExamples: Hallucination Lab, Bias Detective, the Real-vs-AI Images lesson, the Embeddings Explorer, the Attention Visualizer, the AI Bias case studies, the healthcare/law/policing/hiring case-study lessons, the Prompt Engineering deep dive, a specific class debate.\n\nFor each: what happened, what you noticed, how it changed (or confirmed) your thinking. Generic references don\'t count. "We learned about bias" is filler. *"When the Bias Detective showed me the image-search results for *CEO* vs *criminal*, I realized..."* — that\'s evidence.' },
        { id: 'card-application', label: '3', title: 'Application (~200-300 words)',
          body: 'How this stance changes what you actually **do**. Specific rules you\'re setting for yourself.\n\nWhen you\'ll use AI. When you won\'t. What you refuse to outsource. What you\'ll do differently than your friends. Be concrete. *"I\'ll be careful"* is not a rule. *"I will not use AI to write my college essay because the point of writing it is to learn what I think"* is a rule.\n\nAt least one of your rules should be a "won\'t" — something you are refusing to do.' },
      ]},

    { type: 'section_header', id: 'sh-deliverables', label: "What You'll Make" },
    { type: 'checklist', id: id(), title: 'Deliverables',
      items: [
        'One Google Doc, 800-1200 words, written by you (not by AI — we will check)',
        'Stance section (~150 words) — a clear, specific, defendable position',
        'Evidence section (~500-700 words) — at least 5 named course lessons with concrete moments',
        'Application section (~200-300 words) — at least 3 specific rules, including at least one "won\'t"',
        'First person ("I"), your voice — direct and specific, no Wikipedia phrasing',
        'Inline citations (no formal MLA needed) — "After the Hallucination Lab..." style references',
        'Sharing set to **Anyone with the link can view (or comment)**',
      ]},
    { type: 'callout', id: id(), content: '**AI-generated manifestos read like a Wikipedia page about AI** — vague, balanced, voiceless. The whole point of this assignment is to write something only *you* could have written.' },

    { type: 'section_header', id: 'sh-process', label: 'Day-by-Day Process' },
    { type: 'text', id: id(), content: `**Day 1 — Inventory (in class)**\n- Open every unit of this course. Skim the lesson list.\n- Make a list of every lesson, activity, debate, or moment that genuinely shifted something for you. Aim for 8-10. You'll narrow later.\n- Free-write for 10 minutes: "What do I actually believe about AI right now?" Don't edit. Don't be smart. Just write.\n\n**Day 2 — Find Your Stance (in class)**\n- Re-read your free-write. Underline anything that surprises you, anything you'd defend, anything you wouldn't say in a college admissions essay.\n- That's your stance. Write it as one paragraph (~150 words).\n- Peer pair: read your stance to one classmate. Their job: ask "but why do you believe that?" until you hit something real.\n\n**Day 3 — Draft (in class + HW)**\n- Pull 5-7 lessons from your inventory. For each, write 2-3 sentences: what happened in the lesson, what you noticed, how it shaped your stance.\n- Stitch your stance + evidence + application into a full draft. Don't worry about polish yet.\n- Word count: aim for 1000.\n\n**Day 4 — Cut + Sharpen (in class)**\n- Self-edit pass: cut every sentence that could have come from any student in the class. Keep only what's *yours*.\n- Read aloud to yourself. If a line sounds like a chatbot, rewrite it.\n- Peer review: trade with one classmate. Their job: mark the strongest line and the weakest line.\n\n**Day 5 — Submit + Optional Read-Aloud (in class)**\n- Final submission as a Google Doc.\n- Volunteers read excerpts aloud to the class. Not required — but the best pieces deserve to be heard.` },

    { type: 'section_header', id: 'sh-rubric', label: 'Rubric' },
    { type: 'rubric', id: id(), title: 'Project Rubric', totalPoints: 100,
      criteria: [
        { name: 'Clarity of Stance', weight: 30, levels: [
          { score: 4, label: 'Exemplary', description: 'Position is specific, defendable, takes a real risk. Could not be summarized as "AI has pros and cons."' },
          { score: 3, label: 'Proficient', description: 'Clear position, mostly specific, takes a small risk.' },
          { score: 2, label: 'Developing', description: 'A position is present but generic ("AI is a tool"). Plays it safe.' },
          { score: 1, label: 'Beginning', description: 'No real position. Reads like a balanced encyclopedia entry.' },
        ]},
        { name: 'Depth of Evidence', weight: 30, levels: [
          { score: 4, label: 'Exemplary', description: '5+ specific course lessons cited by name, each with a concrete moment ("when the model said X, I noticed Y"). Evidence directly supports the stance.' },
          { score: 3, label: 'Proficient', description: '5 lessons cited by name, most with specific moments.' },
          { score: 2, label: 'Developing', description: '3-4 lessons cited, some references are vague ("when we learned about bias").' },
          { score: 1, label: 'Beginning', description: 'Fewer than 3 named lessons, or vague references only ("this class taught me a lot").' },
        ]},
        { name: 'Application — Rules You\'re Setting', weight: 15, levels: [
          { score: 4, label: 'Exemplary', description: '3+ specific rules. Each tied to a real situation in your life. At least one is a "won\'t" — something you\'re refusing to do.' },
          { score: 3, label: 'Proficient', description: '2-3 rules, mostly specific.' },
          { score: 2, label: 'Developing', description: 'General intentions ("I\'ll be careful"). No real rules.' },
          { score: 1, label: 'Beginning', description: 'No rules, or rules are generic platitudes.' },
        ]},
        { name: 'Voice', weight: 15, levels: [
          { score: 4, label: 'Exemplary', description: 'Sounds like you and only you. Direct, specific, takes a stand. No Wikipedia phrasing.' },
          { score: 3, label: 'Proficient', description: 'Mostly your voice with a few generic stretches.' },
          { score: 2, label: 'Developing', description: 'Sounds borrowed from somewhere — articles, AI, "the kind of thing a teacher wants to hear."' },
          { score: 1, label: 'Beginning', description: 'Reads like AI-generated text or a stock essay.' },
        ]},
        { name: 'Length + Mechanics', weight: 10, levels: [
          { score: 4, label: 'Exemplary', description: '800-1200 words. Clean prose. No major errors.' },
          { score: 3, label: 'Proficient', description: 'Within range, minor errors.' },
          { score: 2, label: 'Developing', description: 'Slightly under/over (700-799 or 1201-1300), some errors.' },
          { score: 1, label: 'Beginning', description: 'Significantly under/over, distracting errors.' },
        ]},
      ]},

    { type: 'section_header', id: 'sh-exemplars', label: 'Strong vs Weak Exemplar' },
    { type: 'exemplar_compare', id: id(),
      prompt: 'Two 200-word manifesto excerpts. Read both. Notice how the strong one cites specific course lessons by name and risks an opinion, while the weak one stays balanced and quiet.',
      strong: {
        label: 'Strong: a confidence trick I have to keep noticing',
        body: `*I don't think AI is good or bad. I think AI is a confidence trick that I have to keep noticing.*\n\n*The Hallucination Lab broke me. I asked the model a question I already knew the answer to — about my grandfather's hometown in El Salvador — and it gave me a confident, beautifully-written paragraph that was almost entirely wrong. Place names, dates, the size of the river. Wrong. And the worst part is, if I hadn't known the answer, I would have believed it. I think about that a lot. I have been believing answers from this thing all year. So have my friends. So has my mom, who started using it for medical questions.*\n\n*The Bias Detective showed me the same thing in a different costume. We searched for "CEO" and the image results were what they were, and we searched for "criminal" and the image results were what they were, and a model trained on the internet learned exactly what the internet was already teaching it. The model isn't biased because it's broken. It's biased because we are, and it learned us.*\n\n*So here is what I believe...*`,
        annotations: [
          'Opening line is specific and risky — a chatbot would not write this',
          'Two course lessons named in two paragraphs (Hallucination Lab, Bias Detective)',
          'Each citation tied to a concrete moment, not a vague summary',
          'Personal stake (grandfather in El Salvador, mom\'s medical questions) — this is *this student*, not a generic essay',
          'Voice is 9th-grade direct — no "in conclusion," no "throughout history"',
        ]
      },
      weak: {
        label: 'Weak: AI is a tool, use it responsibly',
        body: `*Artificial intelligence is one of the most important technologies of our time. AI has the power to change the world in many ways, both positive and negative. In this class, we learned a lot about AI and how it works. We learned about machine learning, neural networks, and how AI can be biased.*\n\n*AI has many benefits. It can help doctors find diseases faster. It can help students learn. It can answer questions and write essays. However, AI also has drawbacks. It can be biased. It can make mistakes. It can replace jobs.*\n\n*I believe that AI is a tool, and like any tool, it depends on how we use it. We should use AI carefully and responsibly. We should be aware of its limitations. We should not let AI make all our decisions for us.*\n\n*In conclusion, AI is changing the world, and we need to be ready for it. As students, we need to learn about AI and how to use it. The future is bright if we use AI responsibly.*`,
        annotations: [
          'Zero specific course lessons cited — "we learned about machine learning" is filler, not citation',
          'Every sentence could have been written by any student in any class',
          'Stance is "AI is a tool" — the most generic AI take that exists',
          'Reads exactly like AI-generated text: balanced, vague, "in conclusion," "the future is bright"',
          'No author. No personal stake. No risk.',
        ]
      }
    },

    { type: 'section_header', id: 'sh-submit', label: 'Submit Your Project' },
    { type: 'slide_submit', id: 'submit-final',
      prompt: 'Paste the Google Doc link to your final manifesto. Set sharing to **Anyone with the link can view (or comment)**. Submit by the end of Day 5.',
      maxScore: 100 },

    { type: 'section_header', id: 'sh-reflection', label: 'Reflection' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Which lesson, activity, or moment from this course shifted your view on AI the most? Why that one — what specifically about it landed?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'Compare the one-sentence belief you wrote in the Warm Up to the stance in your final manifesto. What changed between draft and final — and what did writing this teach you about what you actually believe?' },
    { type: 'question', id: id(), questionType: 'short_answer',
      prompt: 'A year from now, you\'ll re-read this manifesto. What do you predict you\'ll think? Will you still agree with yourself? What might have changed?' },
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
