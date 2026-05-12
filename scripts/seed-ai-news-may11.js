// seed-ai-news-may11.js
// AI Literacy — Sub-day lesson for 2026-05-11
// "AI in the News: 3 Stories You Need to Know This Week"
// Seeds to all 4 AI Lit sections (P4, P5, P7, P9) with identical block IDs.
// Run: node scripts/seed-ai-news-may11.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const LESSON_ID = "ai-news-may11";

const SECTIONS = {
  P4: "Y9Gdhw5MTY8wMFt6Tlvj",
  P5: "DacjJ93vUDcwqc260OP3",
  P7: "M2MVSXrKuVCD9JQfZZyp",
  P9: "fUw67wFhAtobWFhjwvZ5",
};

const IMG_BASE = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/ai-literacy/news-may11";
const IMG_BOSTON = `${IMG_BASE}/ai-news-boston-schools.jpg`;
const IMG_DEEPFAKE = `${IMG_BASE}/ai-news-deepfake-elections.jpg`;
const IMG_STATES = `${IMG_BASE}/ai-news-state-regulation.jpg`;

// Stable block IDs — must match across all 4 sections for grade integrity.
const blocks = [

  // ─── SUB-DAY INTRO ─────────────────────────────────────────

  {
    id: "sh-sub-intro", type: "section_header",
    icon: "📰",
    title: "Sub Day — AI in the News",
    subtitle: "Mr. McCarthy is out today",
  },

  {
    id: "callout-sub-instructions", type: "callout",
    icon: "👋", style: "info",
    content: "**Hey everyone.** I'm out today. Quick plan:\n\n- Work through this lesson **on your own** — read carefully, answer every question.\n- The whole thing fits in one period if you stay focused.\n- The reading is short. The thinking is the point.\n- If you get stuck, **make your best guess and keep moving**.\n- Submit before the bell. Grades come back tonight.\n\nNo new vocab. No new tools. Just three real AI stories from the last week and what you think about them.",
  },

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: "sh-warmup", type: "section_header",
    icon: "🌅",
    title: "Warm Up",
    subtitle: "~3 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Summarize three real AI news stories from the last week in your own words",
      "Identify who's affected and what's at stake in each story",
      "Take a position on which story will matter most a year from now — and defend it",
    ],
  },

  {
    id: "callout-qotd", type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** When AI shows up in the news, **who gets to decide what's okay** — schools, lawmakers, tech companies, or voters?",
  },

  {
    id: "q-warmup-headline", type: "question",
    questionType: "short_answer",
    prompt: "**Warm-up:** Name **one** AI-related thing you saw, heard, or read about in the last 7 days — could be a news headline, a TikTok, a conversation, anything. One sentence is fine. (If you genuinely haven't seen one, write 'I haven't seen any' — that's also a real answer.)",
    weight: 2,
    scored: true,
    maxScore: 2,
  },

  // ─── HOW TO READ THIS LESSON ─────────────────────────────

  {
    id: "sh-how-to-read", type: "section_header",
    icon: "🗺️",
    title: "How to Read This Lesson",
  },

  {
    id: "text-how-to-read", type: "text",
    content: "You'll read **three short stories** below. For each one, you'll see the same structure:\n\n1. **The Headline** — the one-liner\n2. **What Happened** — what's going on (2 short paragraphs)\n3. **Who's Affected** — who feels this in their life\n4. **What's At Stake** — why it matters beyond the headline\n5. **Questions** — your thinking, scored\n\nThis is the same way professionals read news — not just \"what happened\" but \"so what?\" Treat every story this way for the rest of your life and you'll be ahead of 90% of people scrolling their phones.",
  },

  // ─── STORY 1: BOSTON SCHOOLS ──────────────────────────────

  {
    id: "sh-story-1", type: "section_header",
    icon: "🎓",
    title: "Story 1 — Boston Makes AI Literacy a Graduation Requirement",
    subtitle: "~10 minutes",
  },

  {
    id: "img-story-1", type: "image",
    url: IMG_BOSTON,
    alt: "Editorial illustration of a graduation cap sitting on top of an open laptop with a faint neural-network glyph on the screen, set against a stylized city skyline.",
    caption: "Story 1 — Boston schools tie AI literacy to a diploma.",
  },

  {
    id: "text-story-1-headline", type: "text",
    content: "### The Headline\n**Boston Public Schools will require every high school student to pass an AI literacy program to graduate — starting fall 2026.**",
  },

  {
    id: "text-story-1-what", type: "text",
    content: "### What Happened\nMayor Michelle Wu announced this month that Boston Public Schools (BPS) will be the **first big-city district in the United States** to make AI fluency a graduation requirement. Every BPS high schooler — about 14,000 students — will have to complete a mandatory AI literacy program covering how generative AI works, what it gets wrong, the ethics of using it, and how to use it well at work and in school. The city is backing it with a $1 million seed grant.\n\nThe goal, according to the mayor's office, is to make sure students entering the job market understand AI the same way previous generations learned to use the internet or Microsoft Office. The program is being designed by BPS teachers in partnership with local universities and rolls out to all BPS high schools in **September 2026**.",
  },

  {
    id: "text-story-1-who", type: "text",
    content: "### Who's Affected\n- **~14,000 Boston high schoolers** who'll need to pass it to graduate\n- **BPS teachers** who'll have to design and teach it (most aren't AI experts yet)\n- **Other big-city districts** watching to see if it works — NYC, LA, Chicago, and yes, **Perth Amboy** could follow\n- **Colleges and employers** who'll start expecting incoming students to already know this",
  },

  {
    id: "text-story-1-stakes", type: "text",
    content: "### What's At Stake\nIf this works, AI literacy becomes a basic skill like reading a graph — and students who don't get it are left behind. If it fails — or if the program is bad — a whole generation gets a checkbox version of AI education instead of the real thing. **This is exactly the class you're in right now**, but mandatory and statewide.",
  },

  {
    id: "q-story-1-mc1", type: "question",
    questionType: "multiple_choice",
    prompt: "Why does Boston Public Schools say they're making AI literacy a graduation requirement?",
    options: [
      "To make sure every BPS graduate enters the job market understanding how AI works",
      "To replace teachers with AI tutors and save money on staffing",
      "To require every student to use ChatGPT for all their homework",
      "To ban AI from classrooms entirely starting in September 2026",
    ],
    correctIndex: 0,
    weight: 1,
    scored: true,
  },

  {
    id: "q-story-1-mc2", type: "question",
    questionType: "multiple_choice",
    prompt: "Which of these would NOT count as being directly affected by this policy?",
    options: [
      "Boston high schoolers who'll need to pass it to graduate",
      "BPS teachers who'll have to teach it",
      "Other big-city districts deciding whether to copy it",
      "A retired person in Vermont who has never used AI",
    ],
    correctIndex: 3,
    weight: 1,
    scored: true,
  },

  {
    id: "q-story-1-sa", type: "question",
    questionType: "short_answer",
    prompt: "**Imagine Perth Amboy made this same rule for the class of 2027.** Would you think that's a good idea? Defend your position in **2–3 sentences**. (There's no wrong answer — I'm grading you on whether your reason is specific and actually about AI, not generic.)",
    weight: 3,
    scored: true,
    maxScore: 3,
  },

  // ─── STORY 2: DEEPFAKE ELECTIONS ──────────────────────────

  {
    id: "sh-story-2", type: "section_header",
    icon: "🗳️",
    title: "Story 2 — AI Deepfakes Are Now Standard Campaign Practice",
    subtitle: "~10 minutes",
  },

  {
    id: "img-story-2", type: "image",
    url: IMG_DEEPFAKE,
    alt: "Editorial illustration of two stylized faces — one drawn in flat solid shapes, the other made of pixelated digital fragments — split down the center by a vertical seam.",
    caption: "Story 2 — Deepfakes in the 2026 midterms.",
  },

  {
    id: "text-story-2-headline", type: "text",
    content: "### The Headline\n**At least five AI-generated deepfake videos have shown up in 2026 midterm campaigns — and the law mostly can't stop them.**",
  },

  {
    id: "text-story-2-what", type: "text",
    content: "### What Happened\nFive confirmed AI deepfake videos have appeared in 2026 midterm campaigns across **Texas, Georgia, and Massachusetts**. One recent example: the National Republican Senatorial Committee released a deepfake video of Texas state Rep. James Talarico — a Democratic Senate candidate — \"reading\" his own old social-media posts in a deliberately unflattering way. The video isn't a recording of him. It's a synthetic version of him made to look real.\n\nMost state laws on this only require campaigns to **disclose** that something is AI-generated. They don't ban it. The European Union passed a stricter rule (Article 50 of the EU AI Act) that requires labels on all AI-generated political content and fines up to 6% of global revenue, but that doesn't apply in the US. Survey data from this cycle shows that **nearly half of voters say deepfakes have influenced their vote** in some way — even when they claim not to trust the technology.",
  },

  {
    id: "text-story-2-who", type: "text",
    content: "### Who's Affected\n- **Voters** who can't easily tell real from fake without specialized tools\n- **Candidates** who can be put in fake situations they were never in\n- **Journalists** who have to verify every clip before they can report on it\n- **You and your family** — first-time voters in 2028 (Class of 2030 is eligible)\n- **Platforms** like TikTok and YouTube deciding what to label, leave up, or take down",
  },

  {
    id: "text-story-2-stakes", type: "text",
    content: "### What's At Stake\nIf deepfakes work — meaning they sway elections — every campaign will use them. If they get banned, who decides what counts as \"fake\" vs. \"satire\" or \"parody\"? Either answer changes what democracy looks like. Right now the US has chosen \"label it and move on,\" and the experiment is happening in real time. **You're the test group.**",
  },

  {
    id: "q-story-2-mc1", type: "question",
    questionType: "multiple_choice",
    prompt: "What do most current US state laws on political deepfakes actually require?",
    options: [
      "A total ban on AI-generated political video",
      "Prison time for any candidate who runs an AI-generated ad",
      "That the campaign disclose the video was AI-generated — but not stop them from running it",
      "A $1 million fine for every deepfake posted online",
    ],
    correctIndex: 2,
    weight: 1,
    scored: true,
  },

  {
    id: "q-story-2-mc2", type: "question",
    questionType: "multiple_choice",
    prompt: "Based on the reading, which of these is the BEST description of the current situation?",
    options: [
      "Deepfakes are now a standard campaign tool in some races, and most rules just require a label, not a ban",
      "Deepfakes are illegal everywhere and rarely seen in real campaigns",
      "Only foreign governments make deepfakes — US campaigns refuse to use them",
      "Deepfakes are too obviously fake to fool any voter",
    ],
    correctIndex: 0,
    weight: 1,
    scored: true,
  },

  {
    id: "q-story-2-sa", type: "question",
    questionType: "short_answer",
    prompt: "You see a video on TikTok of a politician saying something shocking. Before you share it, **what TWO things would you check** to figure out if it's real or AI-generated? Be specific — \"check the source\" is too vague. (2–3 sentences.)",
    weight: 3,
    scored: true,
    maxScore: 3,
  },

  // ─── STORY 3: STATE REGULATION ────────────────────────────

  {
    id: "sh-story-3", type: "section_header",
    icon: "⚖️",
    title: "Story 3 — 134 AI-in-School Bills, 31 States, One Year",
    subtitle: "~8 minutes",
  },

  {
    id: "img-story-3", type: "image",
    url: IMG_STATES,
    alt: "Editorial illustration of a stylized US map with several states highlighted in different colors, overlaid with a gavel-and-scales icon and a faint circuit-board pattern.",
    caption: "Story 3 — A patchwork of state laws on AI in schools.",
  },

  {
    id: "text-story-3-headline", type: "text",
    content: "### The Headline\n**Lawmakers in 31 states have introduced 134 different bills this year about how schools are allowed to use AI — and they don't agree with each other.**",
  },

  {
    id: "text-story-3-what", type: "text",
    content: "### What Happened\nIn the 2026 legislative session, **134 bills** related to AI in education were introduced across **31 different states**. Some bills focus on protecting student data privacy. Others ban AI use during testing. A few require schools to teach AI literacy (like the Boston policy in Story 1, but at the state level). And several would restrict teachers from using AI to grade student work.\n\nNew Jersey, Texas, California, and New York all have active bills right now — and they say **different things**. In March, the Trump Administration released a National Policy Framework calling on Congress to make ONE federal AI law to replace this patchwork. That hasn't happened yet. So in 2026, what counts as legal AI use in your school depends on **which state you're in**.",
  },

  {
    id: "text-story-3-who", type: "text",
    content: "### Who's Affected\n- **You and every other K-12 student** — your school's AI rules depend on your state legislature\n- **Teachers** who don't know which rules apply when they cross state lines for conferences or take new jobs\n- **EdTech companies** building tools that have to comply with 31 different rule sets\n- **Parents** trying to figure out what their kids are actually allowed to do",
  },

  {
    id: "text-story-3-stakes", type: "text",
    content: "### What's At Stake\nIf each state writes its own rules, the country ends up with **a checkerboard** — some students get AI literacy classes, others don't. Some teachers can use AI to grade; others get fired for trying. If Congress passes a single federal law, it solves the patchwork but locks in one approach for everyone. Both options have winners and losers. **This is being decided right now, mostly by adults who didn't grow up with these tools.**",
  },

  {
    id: "q-story-3-mc1", type: "question",
    questionType: "multiple_choice",
    prompt: "According to the reading, what's the MAIN reason there are 134 different AI-in-school bills this year?",
    options: [
      "Congress has already passed one federal AI law that every state had to copy",
      "AI is now illegal in all 31 of those states",
      "There's no single federal AI law yet, so each state is writing its own rules — and they disagree",
      "Schools across the country have unanimously agreed on one approach",
    ],
    correctIndex: 2,
    weight: 1,
    scored: true,
  },

  {
    id: "q-story-3-mc2", type: "question",
    questionType: "multiple_choice",
    prompt: "Which of these is a real possible OUTCOME of Congress NOT passing a federal AI-in-schools law?",
    options: [
      "Every state must use the same AI tools by 2027",
      "A student in New Jersey and a student in Texas may end up with totally different rules for AI in school",
      "AI will be banned from all US schools automatically",
      "Schools will stop using computers entirely",
    ],
    correctIndex: 1,
    weight: 1,
    scored: true,
  },

  // ─── FINAL: WHICH STORY MATTERS MOST ─────────────────────

  {
    id: "sh-which-matters", type: "section_header",
    icon: "🎯",
    title: "Which Story Matters Most?",
    subtitle: "~5 minutes",
  },

  {
    id: "text-which-matters", type: "text",
    content: "Now zoom out. You've read three stories:\n\n1. **Boston** makes AI literacy a graduation requirement\n2. **Deepfakes** are standard in 2026 campaigns\n3. **31 states** are writing different rules for AI in school\n\nThey're all happening at once. But they probably don't matter equally.",
  },

  {
    id: "q-rank-mc", type: "question",
    questionType: "multiple_choice",
    prompt: "**Which story do you think will matter MOST a year from now — May 2027?** (Opinion — every answer is correct. You'll defend your pick in the next question.)",
    options: [
      "Story 1 — Boston's AI literacy requirement (because it changes what schools teach)",
      "Story 2 — Election deepfakes (because they change what people believe is real)",
      "Story 3 — The 134 state bills (because they change what schools are LEGALLY allowed to do)",
      "None of them — they'll all be forgotten by then",
    ],
    correctIndex: 0,
    allCorrect: true,
    weight: 1,
    scored: true,
  },

  {
    id: "q-rank-defend", type: "question",
    questionType: "short_answer",
    prompt: "**Defend your pick.** In 3–4 sentences: why did you pick that story, and what's one specific thing you think will be different a year from now because of it? Be concrete — name people, places, or outcomes you actually expect. Generic answers (\"it'll affect everyone\") won't score full points.",
    weight: 5,
    scored: true,
    maxScore: 5,
  },

  // ─── WRAP UP ───────────────────────────────────────────

  {
    id: "sh-wrap", type: "section_header",
    icon: "✅",
    title: "Wrap Up",
  },

  {
    id: "callout-qotd-return", type: "callout",
    icon: "↩️", style: "question",
    content: "**Return to the Question of the Day:** Who gets to decide what's okay when AI shows up in the news — schools, lawmakers, tech companies, or voters? Look at the three stories. Each one has a different answer.",
  },

  {
    id: "q-reflection", type: "question",
    questionType: "reflection",
    prompt: "**Exit Reflection:** Of the three stories, **which one surprised you the most?** And — based on what you read today — name one thing you want to read more about on your own. (One sentence is fine.)",
    weight: 1,
    scored: true,
  },

  {
    id: "callout-takeaway", type: "callout",
    icon: "💡", style: "insight",
    content: "**Today's real lesson:** AI doesn't just happen IN labs or tech companies. It happens in school board votes, in campaign ads, in state legislatures. Reading news about AI like a literate citizen — \"what happened, who's affected, what's at stake\" — is one of the most useful skills you'll take out of this class. Keep doing it after this period ends.",
  },
];

// ─── Main ──────────────────────────────────────────────────

const lessonData = {
  title: "AI in the News: 3 Stories From This Week (Sub Day)",
  questionOfTheDay:
    "When AI shows up in the news, who gets to decide what's okay — schools, lawmakers, tech companies, or voters?",
  unit: "AI in the World",
  order: 69.2,
  visible: true,
  dueDate: "2026-05-11",
  gradesReleased: true,
  gradeCategory: "Classwork",
  blocks,
  updatedAt: new Date(),
};

async function main() {
  for (const [period, courseId] of Object.entries(SECTIONS)) {
    const ref = db.collection("courses").doc(courseId).collection("lessons").doc(LESSON_ID);
    await ref.set(lessonData);
    console.log(`✅ ${period} (${courseId}): seeded "${lessonData.title}"`);
  }
  console.log(`\n   Blocks: ${blocks.length}`);
  console.log(`   visible: true | dueDate: 2026-05-11 | gradesReleased: true`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
