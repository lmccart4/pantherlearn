// seed-diglit-portfolio-capstone.cjs
// Digital Literacy — Portfolio Capstone (3 days: Wed 5/27 → Fri 5/29/2026)
// Compile the year's four sprint deliverables + WeVideo project + landing page
// into one published GOOGLE SITES portfolio. One running grade (Day 3
// teacher_checkpoint). Sprint deliverables keep their existing grades — NOT re-graded here.
// Day 2 doubles as a catch-up lane for unfinished sprint pieces. Day 3 = structured
// 3-classmate peer feedback (not a roaming gallery walk).
// Run: node scripts/seed-diglit-portfolio-capstone.cjs
//
// Design spec: ~/Lachlan/docs/superpowers/specs/2026-05-26-dl-portfolio-capstone-design.md

const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "portfolio-capstone";

const lesson = {
  title: "Portfolio Capstone — Compile & Showcase Your Year",
  questionOfTheDay: "If a stranger had 60 seconds to understand who you are as a creator, what would you want them to see first?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 65,
  visible: false,
  gradesReleased: true,
  dueDate: "2026-05-29",
  blocks: [
    {
      id: "cap-objectives",
      type: "objectives",
      title: "Capstone Objectives",
      items: [
        "Compile your four sprint projects plus your WeVideo project and landing page into one place",
        "Curate your work with a short artist statement on every piece",
        "Publish a clean, navigable Google Sites portfolio with a shareable link",
        "Reflect on how you grew as a creator this year",
      ],
    },

    // ─── DAY 1 — Wed 5/27 — Gather + Build Skeleton ───────────────────────
    {
      id: "cap-d1-header",
      type: "section_header",
      icon: "📦",
      title: "Day 1 — Gather Your Work + Build the Skeleton",
    },
    {
      id: "cap-d1-what",
      type: "text",
      content: "A portfolio is one link that represents your whole year. Instead of four scattered projects living in four different apps, you're going to put them in **one place a stranger can open and instantly understand**. Colleges, employers, and scholarship programs all ask for this. Today you gather everything and build the empty frame — content comes tomorrow.",
    },
    {
      id: "cap-d1-checklist",
      type: "callout",
      variant: "info",
      title: "Find all 6 pieces before you build",
      content: "Track down the file or link for each. If something is missing, message Mr. McCarthy now — don't wait until Friday.\n\n- ☐ **Infographic** (your exported image or PDF)\n- ☐ **Photo Essay** (your final layout / slides)\n- ☐ **Short-Form Video** (the exported MP4)\n- ☐ **PSA** (video or the 3 posters)\n- ☐ **WeVideo project** (your edited video link)\n- ☐ **Landing page** (your published link from the entrepreneurship unit)",
    },
    {
      id: "cap-d1-sites-link",
      type: "external_link",
      url: "https://sites.google.com/new",
      title: "Google Sites — log in with your @paps.net account",
      description: "Click to start a new site. It's part of your school Google account, so there's no separate login or sign-up — the same account you use for Classroom and Drive.",
    },
    {
      id: "cap-d1-setup",
      type: "text",
      content: "**Set up your site:**\n1. Go to **sites.google.com** → click the **+ (Blank)** to start a new site.\n2. Rename it (top-left): **\"[Your Name] — Digital Literacy Portfolio\"**.\n3. Build your **home page** first: a title, your name, and a one-line intro about who you are as a creator.\n4. Open the **Themes** panel (right side) and pick one look — you'll keep it consistent tomorrow. Keep it simple for now.",
    },
    {
      id: "cap-d1-skeleton",
      type: "text",
      content: "**Build the skeleton.** Open the **Pages** panel (right side) and add one page for each of your 6 pieces — leave them mostly empty for now. Page titles only:\n- Home\n- Infographic\n- Photo Essay\n- Short-Form Video\n- PSA\n- WeVideo\n- Landing Page\n- About Me\n\nGoal by end of class: every page exists and shows up in the top navigation, even if empty. **Frame first, content tomorrow.**",
    },

    // ─── DAY 2 — Thu 5/28 — Build + Catch Up + Publish ────────────────────
    {
      id: "cap-d2-header",
      type: "section_header",
      icon: "🔧",
      title: "Day 2 — Add Your Work, Catch Up, Publish",
    },
    {
      id: "cap-d2-catchup",
      type: "callout",
      variant: "warning",
      title: "Behind on a sprint piece? Today is your catch-up day.",
      content: "If your Infographic, Photo Essay, Short-Form Video, or PSA isn't finished, **use part of today to finish it** — then submit it to its own assignment AND add it to your portfolio. Friday's portfolio grade checks that **all 6 pieces are present**, so a missing piece costs you twice. Knock out the unfinished one first, then come back and build.",
    },
    {
      id: "cap-d2-statements",
      type: "text",
      content: "Add each piece to its page, then write a **2–3 sentence artist statement** under it. In Google Sites, use the **Insert** panel (right side):\n- **Images** → your infographic and photo-essay shots\n- **Drive** → embed a Drive file (PDF, slides, video)\n- **YouTube** or **Drive** → your Short-Form Video, PSA, and WeVideo\n- **Button** → link out to your published landing page\n\nA statement answers three things: **what it is, what you learned making it, and what you'd change.** Don't summarize the project — reflect on it.\n\n**Example (for a Photo Essay):**\n> *\"This photo essay follows my walk to school through six images shot at golden hour. I learned that sequencing matters as much as the individual shots — moving the empty-hallway photo to the end completely changed the mood. Next time I'd shoot more verticals so the layout breathes better.\"*",
    },
    {
      id: "cap-d2-about-design",
      type: "text",
      content: "**Fill in your About Me page** (3–4 sentences: who you are, what you're into, what kind of creator you want to be).\n\n**Make it look like one site, not eight:**\n- Keep **one Theme and one font set** across every page (Themes panel) — don't mix styles page to page.\n- Check the **top navigation**: every page is listed and opens correctly, and the menu looks the same everywhere.",
    },
    {
      id: "cap-d2-polish-checklist",
      type: "callout",
      variant: "warning",
      title: "Polish checklist — run this before you publish",
      content: "- ☐ All 6 pieces are on the site (embedded or linked, and the links actually open)\n- ☐ An artist statement under every piece\n- ☐ A filled-in About Me page\n- ☐ One consistent Theme + font across all pages\n- ☐ Navigation works — every page reachable, no dead links\n- ☐ Proofread — no typos in titles, statements, or About Me",
    },
    {
      id: "cap-d2-publish",
      type: "text",
      content: "**Publish and get your link:**\n1. Click **Publish** (top-right).\n2. Pick a **web address** — the end of your `sites.google.com/paps.net/...` link (e.g. `your-name-portfolio`).\n3. Under **Manage**, leave it viewable to **anyone at Perth Amboy Public Schools** so Mr. McCarthy and your classmates can open it. (You can switch it to fully public later if you want it for college or scholarships.)\n4. Click **Publish**, then **Copy published link** and open it in a new tab to confirm it loads.\n5. Keep that link handy — you submit it tomorrow.",
    },

    // ─── DAY 3 — Fri 5/29 — Peer Feedback + Submit ────────────────────────
    {
      id: "cap-d3-header",
      type: "section_header",
      icon: "🎉",
      title: "Day 3 — Peer Feedback + Submit",
    },
    {
      id: "cap-d3-feedback",
      type: "text",
      content: "**Peer feedback round.** You'll review **3 classmates'** portfolios up close (your table group, or pairs Mr. McCarthy sets up). For each person, open their published portfolio and give them **two things**:\n1. **One specific positive** — name an actual choice you liked (\"the color palette on your PSA page is really clean\"), not \"nice job.\"\n2. **One helpful suggestion** — something concrete they could improve (\"a bigger title on your home page would grab me faster\").\n\nGive real, thoughtful feedback to all three. Good feedback names something specific.",
    },
    {
      id: "cap-d3-feedback-log",
      type: "question",
      questionType: "short_answer",
      prompt: "**Feedback log.** Name the 3 classmates whose portfolios you reviewed, and write your single best suggestion to each one.",
      placeholder: "1. [name] — suggestion:\n2. [name] — suggestion:\n3. [name] — suggestion:",
      difficulty: "apply",
      scored: false,
    },
    {
      id: "cap-d3-link",
      type: "question",
      questionType: "short_answer",
      prompt: "**Paste your published Google Sites portfolio link here.** Make sure it's the *published* link (`sites.google.com/paps.net/...`), not the edit link — test it in a new tab first.",
      placeholder: "https://sites.google.com/paps.net/...",
      difficulty: "apply",
      scored: false,
    },
    {
      id: "cap-d3-checkpoint",
      type: "teacher_checkpoint",
      title: "Portfolio Review — Show Me Your Published Site",
      prompt: "Open your published portfolio for Mr. McCarthy. Scored on four things: (1) all 6 pieces present, (2) an artist statement on each, (3) consistent design + an About Me page, (4) working navigation and a live published link. (5 points on approval.)",
      weight: 5,
      scored: true,
    },
    {
      id: "cap-d3-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "**Course reflection.** Two things: Which piece in your portfolio are you proudest of, and why? And if you had two more weeks, what would you build or add next?",
      placeholder: "Proudest of: ...\nWith two more weeks I'd: ...",
      difficulty: "evaluate",
      scored: false,
    },
  ],
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, COURSE_ID, LESSON_ID, lesson);
    console.log(`✅ Lesson "${lesson.title}" — ${result.action} (preserved ${result.preserved} block IDs)`);
    console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
    console.log(`   Blocks: ${lesson.blocks.length} | Order: ${lesson.order} | due: ${lesson.dueDate} | visible: ${lesson.visible}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
