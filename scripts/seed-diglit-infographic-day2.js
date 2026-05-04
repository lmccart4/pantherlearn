// seed-diglit-infographic-day2.js
// Digital Literacy — Infographic Sprint, Day 2
// "Design — Hierarchy, Type Pairing, Color" (May 14, 2026)
// Run: node scripts/seed-diglit-infographic-day2.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "infographic-day2-design";

const lesson = {
  title: "Infographic Sprint Day 2 — Design",
  course: "Digital Literacy",
  unit: "Infographic Sprint",
  order: 62.1,
  visible: false,
  questionOfTheDay:
    "When you look at the NYT 'How the Virus Got Out' graphic, what's the first thing your eye lands on? Second? Third? Why did the designer order it that way?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "👀",
      title: "Warm Up",
      subtitle: "~5 minutes",
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content:
        "**Question of the Day:** When you look at the NYT *'How the Virus Got Out'* graphic, what's the first thing your eye lands on? Second? Third? Why did the designer order it that way?",
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt:
        "I'm putting NYT's 'How the Virus Got Out' on the projector. Trace the path your eye takes through it. What do you see first, second, third? What's the designer doing to control the order you read in — size, color, animation, position? Be specific.",
      placeholder:
        "First: ...\nSecond: ...\nThird: ...\nWhat the designer is doing: ...",
      difficulty: "analyze",
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply visual hierarchy on a Canva poster — headline stat is biggest, sources are smallest",
        "Pair two fonts that work together: one display font for the headline, one clean sans-serif for body text",
        "Build a 3-color palette using Coolors.co and apply it consistently across the design",
      ],
    },

    // ─── MAIN — THREE DESIGN RULES ──────────────────────────

    {
      id: "section-main",
      type: "section_header",
      icon: "🎨",
      title: "The Three Rules of Day 2",
      subtitle: "~10 minutes",
    },
    {
      id: "b-rule-typography",
      type: "text",
      content:
        "**Rule 1: Type pairing — two fonts max.**\n\nA strong infographic uses exactly two fonts:\n\n- **One display font** for the headline stat — bold, distinctive, the loudest thing on the page. Examples: Playfair Display, Anton, Bebas Neue, Archivo Black.\n- **One clean sans-serif** for everything else — supporting stats, body text, sources. Examples: Inter, Helvetica, Roboto, Source Sans Pro.\n\nThat's it. Two fonts, doing two different jobs. The display font yells the headline. The sans-serif handles everything else without competing.\n\n**Bad version:** five fonts on one page — Comic Sans for the title, Times for one stat, Arial for another, a script font for a quote, Impact for a callout. Every font is screaming for attention. Nothing wins. The reader's eye gives up.",
    },
    {
      id: "b-rule-color",
      type: "text",
      content:
        "**Rule 2: Color — pick three, no rainbow.**\n\nA professional palette has three colors, each with a job:\n\n- **Dominant** — the background or the largest visual element. Often a neutral (off-white, dark slate, navy).\n- **Accent** — the headline stat. The one color that grabs attention. Often a saturated color (bright orange, electric blue, ProPublica red).\n- **Text** — body text and supporting info. Usually black, dark gray, or a darker version of your dominant.\n\nUse **Coolors.co** to generate a palette. Hit spacebar until something clicks. Lock the colors you like and keep generating. Or pull from a brand you already trust — NYT, ProPublica, FiveThirtyEight all have restrained palettes you can mimic.\n\n**The math:** roughly 60% dominant, 30% text, 10% accent. The accent color is rare — that's why it works.",
    },
    {
      id: "b-rule-hierarchy",
      type: "text",
      content:
        "**Rule 3: Visual hierarchy — size says importance.**\n\nThis is the most important rule of the three. Your reader's eye should travel through the page in a fixed order, controlled entirely by size:\n\n$$\\text{Headline stat} > \\text{Supporting stats} > \\text{Body text} > \\text{Sources}$$\n\n- **Headline stat:** huge. Like 100-200pt huge. The biggest number on the page. *'73%'*, *'1 in 4'*, *'$0.003 per stream.'*\n- **Supporting stats:** medium. Three or four numbers that back up the headline. Maybe 36-48pt.\n- **Body text / explanation:** small. 14-18pt. The reader only gets here if they care.\n- **Sources:** tiny. 8-10pt. At the bottom of the page. They're for credibility, not for reading.\n\nIf every element is the same size, there's no hierarchy. The reader's eye has nowhere to land first. They bounce.",
    },
    {
      id: "img-hierarchy",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/infographic-day2-visual-hierarchy.jpg",
      alt:
        "Diagram of an infographic showing visual hierarchy: a giant headline stat at top, three medium supporting stats below, smaller body text, and tiny sources at the bottom, with annotations showing the eye-tracking path.",
      caption:
        "The reader's eye lands on the largest element first, then walks down the page in size order. Hierarchy is not optional.",
    },
    {
      id: "img-type-color",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/infographic-day2-type-and-color.jpg",
      alt:
        "Two-panel diagram: left panel shows a clean infographic with two fonts and a 3-color palette, right panel shows a chaotic version with five fonts and rainbow colors.",
      caption:
        "Two fonts and three colors (left) vs. five fonts and a rainbow (right). Restraint is the design.",
    },
    {
      id: "q-fonts",
      type: "question",
      questionType: "multiple_choice",
      prompt:
        "Your partner shows you their Canva infographic. The headline is in Bebas Neue (a bold display font). The supporting stats are in Inter. The body copy is in Inter. The source citations are in Inter. How many fonts is that?",
      options: [
        "Four — every text element is its own font",
        "Two — Bebas Neue for the headline, Inter for everything else",
        "One — they're all sans-serifs so they count as one",
        "Three — Bebas Neue, Inter Bold, and Inter Regular",
      ],
      correctIndex: 1,
      explanation:
        "Two fonts. Bebas Neue does one job — the loud headline. Inter does the other — supporting stats, body, sources. Different sizes and weights of the same font (Inter Bold, Inter Regular, Inter Light) all count as one font, not three. That's the whole point of type pairing: one display, one workhorse.",
      difficulty: "apply",
    },
    {
      id: "q-palette",
      type: "question",
      questionType: "multiple_choice",
      prompt:
        "You've picked a 3-color palette: cream background, dark navy text, bright orange accent. You're building a poster about teen sleep. Where should the bright orange go?",
      options: [
        "Behind every text block so the page feels energetic",
        "Spread evenly across the design so all three colors are used equally",
        "Nowhere — bright colors are unprofessional on data graphics",
        "On the headline stat ('only 25% get 8+ hours') so the reader's eye lands there first",
      ],
      correctIndex: 3,
      explanation:
        "The accent color is rare on purpose. Roughly 60% dominant (cream), 30% text (navy), 10% accent (orange). Putting orange behind every text block kills the hierarchy — nothing stands out. Spreading all three colors equally produces a flat, balanced page with no focal point. The accent goes on the ONE thing you want the reader's eye to find first: the headline stat.",
      difficulty: "apply",
    },
    {
      id: "callout-restraint",
      type: "callout",
      style: "insight",
      icon: "💡",
      content:
        "**Design is subtraction, not addition.** Strong infographics are not the ones with the most stuff on them — they're the ones where every element earns its place. If you can delete a sticker, an icon, a clip-art element, or a decorative line and the message gets *clearer*, delete it. *Default Canva clipart almost always makes a design worse, not better.* Strip the template down to bones first. Add only what tells the story.",
    },
    {
      id: "q-strip-template",
      type: "question",
      questionType: "short_answer",
      prompt:
        "You opened a Canva 'Infographic' template and it has 14 elements on it: 6 random icons, 3 swirly shapes, 2 stock photos, and 3 placeholder text boxes. Walk me through the FIRST move you make. Be specific — what do you delete, what do you keep, and why?",
      placeholder:
        "First move: ...\nWhat I delete: ...\nWhat I keep: ...\nWhy: ...",
      difficulty: "apply",
    },

    // ─── ACTIVITY — WORK TIME ───────────────────────────────

    {
      id: "section-worktime",
      type: "section_header",
      icon: "🛠️",
      title: "Work Time — Build the Layout",
      subtitle: "~25 minutes",
    },
    {
      id: "b-worktime",
      type: "text",
      content:
        "Your job for the next 25 minutes — by the end you should have a Canva file that looks like an infographic, not a template:\n\n1. **Open Canva → 'Infographic' template (vertical / poster format).**\n2. **Strip it down.** Delete every default icon, sticker, and shape. Trust nothing Canva put there for you.\n3. **Place the headline stat first.** Pick your most surprising number. Set the type at 100-200pt. This is the single biggest thing on the page.\n4. **Add 3-4 supporting stats** below it at 36-48pt.\n5. **Add a sentence or two of body text** at 14-18pt to explain context.\n6. **Add sources** at the bottom in 8-10pt — publication name and year minimum.\n7. **Apply your 3-color palette** consistently. Use Coolors.co if you don't have one yet.\n8. **Two fonts max** — one display, one sans-serif.",
    },
    {
      id: "link-canva",
      type: "external_link",
      url: "https://www.canva.com/",
      title: "Canva",
      description:
        "Open the 'Infographic' template (vertical poster format). Sign in with your school Google account.",
    },
    {
      id: "link-coolors",
      type: "external_link",
      url: "https://coolors.co/",
      title: "Coolors.co — palette generator",
      description:
        "Hit spacebar until you find a palette. Lock the colors you like and keep generating. Use exactly 3 colors on your design.",
    },
    {
      id: "link-google-fonts",
      type: "external_link",
      url: "https://fonts.google.com/",
      title: "Google Fonts",
      description:
        "Free fonts. Recommended display fonts: Bebas Neue, Anton, Playfair Display, Archivo Black. Recommended body fonts: Inter, Roboto, Source Sans Pro.",
    },
    {
      id: "link-iib-hit-song",
      type: "external_link",
      url: "https://informationisbeautiful.net/visualizations/the-hit-song-science/",
      title: "Information Is Beautiful — What Makes a Hit Song",
      description:
        "Reference for hierarchy and restraint. Notice how few elements are on the page and how much white space there is.",
    },
    {
      id: "link-flowingdata",
      type: "external_link",
      url: "https://flowingdata.com/",
      title: "FlowingData — design reference",
      description:
        "Nathan Yau's tile-style charts. Study how he uses size and color sparingly to lead the eye.",
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
      id: "q-share-link",
      type: "question",
      questionType: "short_answer",
      prompt:
        "Save your Canva file. Click Share → Copy link → and paste the link here. Tomorrow we're doing peer feedback in pairs — your partner needs to be able to open your design.",
      placeholder: "https://www.canva.com/design/...",
      difficulty: "apply",
    },
    {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content:
        "**Coming next class (Friday 5/15):** Day 3 — Polish + Showcase. Peer feedback in pairs (12 min), final polish (15 min), gallery walk + class vote (10 min). Top 5 designs get printed and hung in the hallway through the end of MP4. **Bring your Canva link in working order.**",
    },

    // ─── REFLECTION ─────────────────────────────────────────

    {
      id: "q-reflection",
      type: "question",
      questionType: "reflection",
      prompt:
        "Reflection: What was harder today — finding the right data yesterday, or laying it out cleanly today? What's one design move you made today that you'll steal for the next time you have to make a flyer, slide deck, or anything visual? And — be honest — did you have to fight the urge to add Canva clipart that didn't belong?",
      placeholder:
        "Harder day: ...\nDesign move I'll steal: ...\nClipart confession: ...",
      difficulty: "reflect",
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
