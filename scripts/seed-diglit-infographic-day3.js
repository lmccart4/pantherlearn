// seed-diglit-infographic-day3.js
// Digital Literacy — Infographic Sprint, Day 3
// "Polish + Showcase" (May 15, 2026)
// Run: node scripts/seed-diglit-infographic-day3.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "infographic-day3-polish-showcase";

const lesson = {
  title: "Infographic Sprint Day 3 — Polish + Showcase",
  course: "Digital Literacy",
  unit: "Infographic Sprint",
  order: 62.2,
  visible: false,
  questionOfTheDay:
    "FlowingData's Nathan Yau makes a living doing this. What separates his work from a Canva default — what choices is he making that beginners aren't?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔍",
      title: "Warm Up",
      subtitle: "~3 minutes",
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content:
        "**Question of the Day:** FlowingData's Nathan Yau makes a living doing this. What separates his work from a Canva default — what choices is he making that beginners aren't?",
    },
    {
      id: "img-flowingdata-tiles",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/flowingdata-tile-charts.png",
      alt:
        "FlowingData small-multiples chart: a 4x3 grid of identical-format mini line charts on a clean gray background, each tile showing a single purple line above a dashed baseline. No tile titles, no axis labels per tile, no decoration — every visual element earns its place.",
      caption:
        "*FlowingData — small-multiples comparison (Nathan Yau, 2025).* Look at what's NOT here: no tile titles, no axis labels per tile, no clip-art, no decorative shapes, no gradient backgrounds. [See more on flowingdata.com](https://flowingdata.com/).",
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt:
        "I'm putting up FlowingData's tile-style charts on the projector. Look at them for 30 seconds. What's RESTRAINED about his work — what is he NOT doing that a beginner would do? Name 2-3 specific things.",
      placeholder:
        "What he's not doing 1: ...\nWhat he's not doing 2: ...\nWhat he's not doing 3: ...",
      difficulty: "analyze",
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Give specific, rubric-aligned feedback on a peer's infographic — not vague compliments",
        "Apply peer feedback to polish a final design and verify all sources are cited correctly",
        "Export a portfolio-ready PNG and submit both Canva link and PNG to PantherLearn",
      ],
    },

    // ─── MAIN — HOW TO GIVE FEEDBACK THAT MATTERS ──────────

    {
      id: "section-feedback-rules",
      type: "section_header",
      icon: "🗣️",
      title: "Peer Feedback — How To Do It Right",
      subtitle: "~3 minutes",
    },
    {
      id: "b-feedback-rules",
      type: "text",
      content:
        "**'Looks good' is not feedback. 'Looks bad' is not feedback either.**\n\nWhat counts as feedback: a specific, fixable observation tied to one rubric criterion.\n\n**Bad feedback:**\n- *'I love it!'*\n- *'It's fine.'*\n- *'The colors are nice.'*\n- *'Maybe make it pop more.'*\n\n**Good feedback:**\n- *'Your headline stat is the same size as your supporting stats — I can't tell which one is the takeaway. Bump the headline to at least 2x the size of the others.'*\n- *'You have four fonts on the page. The script font on the subtitle is fighting the headline. Drop it and use the same sans-serif you used for the body.'*\n- *'I see a stat saying \"68% of teens\" but no source under it. Add a citation at the bottom — at minimum publication name and year.'*\n- *'Your y-axis on the bar chart starts at 50, not 0. That makes the difference look bigger than it is. Reset to 0 or label the truncation clearly.'*\n\nGood feedback names the rubric criterion (hierarchy, type, color, sourcing, story), points at the specific element, and tells the partner how to fix it.",
    },
    {
      id: "callout-rubric",
      type: "callout",
      style: "info",
      icon: "📋",
      content:
        "**Final rubric (out of 20):**\n\n- **Data accuracy & sourcing (5):** Every stat traceable to a real source. Sources listed on the design. No made-up or AI-generated numbers.\n- **Visual hierarchy (5):** Eye lands on the headline stat first. Reading path is clear. Type sizes signal importance.\n- **Design polish (5):** Type pairing works (2 fonts max). Color palette is intentional (3-4 colors max). No Canva clipart vomit.\n- **Story clarity (5):** A reader gets the takeaway in under 10 seconds. One message, not five.",
    },
    {
      id: "q-feedback-quality",
      type: "question",
      questionType: "multiple_choice",
      prompt:
        "Your partner gives you these four pieces of feedback on your infographic. Which one is actually useful?",
      options: [
        "'I really like the colors, they pop!'",
        "'It's good. Maybe add some more stuff?'",
        "'Your headline stat (38%) is the same size as the three supporting stats. Bump it to at least 2x bigger so the eye lands there first — that's the visual hierarchy criterion.'",
        "'The vibe is off but I can't say why.'",
      ],
      correctIndex: 2,
      explanation:
        "The third one names the specific element (the 38% headline), the specific problem (same size as supporting stats), the rubric criterion (visual hierarchy), and a concrete fix (2x bigger). The other three are either vague compliments, vague complaints, or admit they have no actual observation to share. Your job during peer feedback is to give your partner one specific, fixable note per rubric criterion.",
      difficulty: "evaluate",
    },

    // ─── ACTIVITY — PEER FEEDBACK ────────────────────────────

    {
      id: "section-peer-feedback",
      type: "section_header",
      icon: "👥",
      title: "Peer Feedback — Pair Up",
      subtitle: "~12 minutes",
    },
    {
      id: "b-peer-feedback",
      type: "text",
      content:
        "**Pair up.** Open your partner's Canva file using the link they posted yesterday.\n\n**Walk through the rubric one criterion at a time.** For each of the four rubric criteria, write **one specific fix** in their source-tracking doc:\n\n1. **Data accuracy & sourcing** — Are all stats sourced? Any missing citations? Any 'data ghosts' (numbers with no source listed)?\n2. **Visual hierarchy** — What's the first thing your eye lands on? Is it supposed to be? If not, what needs to be bigger or smaller?\n3. **Design polish** — How many fonts? How many colors? Any default Canva clipart that's not earning its place?\n4. **Story clarity** — In 10 seconds, what's the one message? If you can't say it in one sentence, what needs to be cut or sharpened?\n\n**No vague compliments.** No *'looks great.'* Four specific, fixable observations.",
    },
    {
      id: "q-feedback-given",
      type: "question",
      questionType: "short_answer",
      prompt:
        "Paste the four pieces of feedback you gave your partner — one per rubric criterion. (Or summarize them here if you wrote them in the source-tracking doc.) Make sure each one is specific enough that your partner can actually act on it.",
      placeholder:
        "1) Data accuracy & sourcing: ...\n2) Visual hierarchy: ...\n3) Design polish: ...\n4) Story clarity: ...",
      difficulty: "evaluate",
    },

    // ─── ACTIVITY — POLISH ───────────────────────────────────

    {
      id: "section-polish",
      type: "section_header",
      icon: "✨",
      title: "Polish — Apply Feedback + Final Check",
      subtitle: "~15 minutes",
    },
    {
      id: "b-polish",
      type: "text",
      content:
        "**Apply the feedback your partner gave you.** Walk through each of their notes one at a time.\n\nThen run the **final source check**:\n\n- Every stat on the design has a citation visible somewhere on the page (publication name + year minimum)\n- Source list at the bottom — small but readable (8-10pt)\n- No stats from undated sources, AI tools, or random blogs\n- Y-axes start at 0 (or are labeled if truncated)\n- Percentages add up to 100% (if applicable)\n\nWhen the design is final:\n\n1. **Canva → File → Download → PNG** (highest quality)\n2. Save it somewhere you can find it\n3. Make sure your Canva link is set to **'Anyone with the link can view'** so Mr. McCarthy can grade it",
    },
    {
      id: "callout-export",
      type: "callout",
      style: "warning",
      icon: "📤",
      content:
        "**Two deliverables, both required:**\n\n1. **Canva link** (set to 'Anyone with the link can view') — proves the editable design exists and is yours\n2. **PNG export** — what gets printed for the hallway showcase\n\nMissing either one drops your grade. Submitting only the Canva link or only the PNG is incomplete.",
    },
    {
      id: "q-final-link",
      type: "question",
      questionType: "short_answer",
      prompt:
        "Paste your final Canva share link here. Confirm: link sharing is set to 'Anyone with the link can view.' (If it's still on 'restricted,' Mr. McCarthy can't open it.)",
      placeholder: "https://www.canva.com/design/...",
      difficulty: "apply",
    },
    {
      id: "q-png-export",
      type: "question",
      questionType: "short_answer",
      prompt:
        "Confirm you exported a PNG. Where did you save it? (Desktop, Downloads, Drive folder?) You'll be uploading it as the second deliverable for this assignment.",
      placeholder: "I exported the PNG and saved it to: ...",
      difficulty: "apply",
    },

    {
      id: "img-portfolio",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/infographic-day3-portfolio-export.jpg",
      alt:
        "A clean portfolio-ready PNG export of a student infographic on teen sleep stats, with a giant headline percentage, supporting stats, and source citations at the bottom.",
      caption:
        "What a portfolio-ready export looks like. Clean PNG, sources visible, hierarchy intact.",
    },

    // ─── REFERENCE LINKS ─────────────────────────────────────

    {
      id: "section-reference",
      type: "section_header",
      icon: "🔗",
      title: "Reference Links",
      subtitle: "",
    },
    {
      id: "link-flowingdata",
      type: "external_link",
      url: "https://flowingdata.com/",
      title: "FlowingData — Nathan Yau",
      description:
        "Tile-style charts and restrained data design. Study what he leaves OUT, not just what he puts in.",
    },
    {
      id: "link-iib",
      type: "external_link",
      url: "https://informationisbeautiful.net/",
      title: "Information Is Beautiful",
      description:
        "Reference standard. The 'What Makes a Hit Song' piece is a benchmark for hierarchy and restraint.",
    },
    {
      id: "link-nyt-graphics",
      type: "external_link",
      url: "https://www.nytimes.com/spotlight/graphics",
      title: "NYT Graphics Desk",
      description:
        "Newsroom-grade infographics. Study how they handle one message, one focal point, sources visible.",
    },
    {
      id: "link-canva-export",
      type: "external_link",
      url: "https://www.canva.com/help/download-image-png/",
      title: "Canva — How to Export PNG",
      description: "Step-by-step for downloading your design as a high-quality PNG.",
    },

    // ─── EXIT ───────────────────────────────────────────────

    {
      id: "section-exit",
      type: "section_header",
      icon: "🚪",
      title: "Exit",
      subtitle: "~2 minutes",
    },
    {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content:
        "**Submitted today (Friday 5/15) by end of period:** Canva share link AND portfolio PNG, both attached to this assignment in PantherLearn. Top 5 (teacher pick) get printed and hung in the hallway outside Room ___ through the end of MP4. Names credited. **No homework — sprint is done.**",
    },

  ],
};

async function seed() {
  try {
    await db
      .collection("courses")
      .doc(COURSE_ID)
      .collection("lessons")
      .doc(LESSON_ID)
      .set(lesson);
    console.log(`✅ Lesson seeded: "${lesson.title}"`);
    console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
    console.log(`   Blocks: ${lesson.blocks.length}`);
    console.log(`   Order: ${lesson.order}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
