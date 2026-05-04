// seed-diglit-brand-kit-day3.js
// Digital Literacy — Brand Kit Sprint, Day 3: "Instagram + Brand Guide + Showcase"
// Run: node scripts/seed-diglit-brand-kit-day3.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "brand-kit-day3-instagram-guide-showcase";

const lesson = {
  title: "Brand Kit Day 3 — Instagram, Brand Guide, Showcase",
  course: "Digital Literacy",
  unit: "Brand Kit Sprint",
  order: 60.2,
  visible: false,
  questionOfTheDay: "Open @glossier on Instagram and scroll the grid. What makes 9 separate posts look like ONE brand?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "📱",
      title: "Warm Up — The Grid Test",
      subtitle: "~3 minutes"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "Pull up Instagram on your phone or browser. Search **@glossier**. Don't tap any single post — just look at the **9-post grid** at the top of their profile.\n\nNotice: nine completely different photos, but the grid feels like *one* brand. Soft pink and cream show up over and over. The same handwritten font keeps appearing. The lighting is always soft and natural. Faces are framed the same way.\n\nThat's not luck. That's the **grid test** — the test every social-media brand has to pass.\n\nNow look at @liquiddeath. Same test. Different vibe — black, gold, heavy-metal energy — but the grid still looks like ONE brand.\n\nToday you build 3 posts that have to pass that same test."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Open @glossier on Instagram and scroll the grid. What makes 9 separate posts look like ONE brand?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at the @glossier grid (or any brand you respect — @nike, @liquiddeath, @apple, @duolingo, @supreme). List 3 specific things that repeat across the grid that make it feel like ONE brand.",
      placeholder: "Brand I looked at: ...\n3 things that repeat: ...",
      difficulty: "analyze"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Build 3 Instagram post mockups (1080×1080) that pass the grid test",
        "Compile a 1-page Brand Guide PDF containing logo, palette, fonts, posts, and tagline",
        "Critique peer brands and give specific, useful feedback",
        "Submit a portfolio-ready brand kit"
      ]
    },

    // ─── MINI-LESSON: GRID TEST + 3-POST FORMULA ───────────

    {
      id: "section-mini",
      type: "section_header",
      icon: "🧩",
      title: "The Grid Test + The 3-Post Formula",
      subtitle: "~8 minutes"
    },
    {
      id: "b-grid-rules",
      type: "text",
      content: "**The grid test, in 3 rules:**\n\n1. **Color repetition** — your palette colors show up in every post (not always all of them, but at least one every time)\n2. **Same font, every post** — your heading font is the only \"loud\" font that appears\n3. **Consistent margins + photo treatment** — same amount of white space, same filter or lighting style\n\nIf those three things repeat, your 3 posts will look like siblings. If they don't repeat, the posts will look like 3 strangers wearing 3 different costumes.\n\n**The chaotic vs. cohesive comparison:**"
    },
    {
      id: "img-grid-good-bad",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/brand-kit-day3-grid-cohesive-vs-chaotic.jpg",
      alt: "Side-by-side comparison: on the left, a cohesive 3-post Instagram grid where every post uses the same pink-and-cream palette and the same handwritten heading font. On the right, a chaotic 3-post grid using random colors, three different fonts, and inconsistent margins.",
      caption: "Left: 3 posts that pass the grid test. Right: 3 posts that don't. Same brand idea — totally different result."
    },
    {
      id: "b-three-post-formula",
      type: "text",
      content: "**The 3-Post Formula** — every starter brand grid uses these three post types:\n\n| Post # | Purpose | What It Says |\n|---|---|---|\n| **#1 — Launch / \"We're Here\"** | Introduce the brand. Big logo or hero shot, your tagline underneath, palette colors as background. | *\"This is who we are.\"* |\n| **#2 — Product / Value-Prop** | Show the actual thing. The product, the service, the offer. One clear hook in your heading font. | *\"Here's what we do.\"* |\n| **#3 — Quote / Vibe Post** | A short quote, lyric, statement, or aesthetic shot that captures the *feeling* of the brand. No product. | *\"Here's how we feel.\"* |\n\nAll 3 posts must:\n- Be **1080 × 1080 pixels** (Instagram square)\n- Use only colors from your locked palette\n- Use only your heading + body fonts\n- Have your logo visible somewhere (small, corner is fine)"
    },
    {
      id: "callout-grid-test",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The 3-second test:** When your 3 posts are done, line them up side-by-side in your Brand Doc and squint at them from 6 feet away. If you can tell at a glance they're the same brand without reading anything, you passed. If they look like 3 random posts, change one element (usually the background color or the font) until they snap together."
    },
    {
      id: "q-mc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student's 3 Instagram posts each use a different background color, a different font, and a different photo style. What's the most likely problem when these 3 posts go up on a profile grid?",
      options: [
        "The posts will rank too high in the algorithm",
        "The posts will look like 3 different brands instead of 3 posts from one brand — the grid test fails",
        "Instagram won't allow uploads with different colors",
        "The posts will be flagged as spam"
      ],
      correctIndex: 1,
      explanation: "The grid test is about repetition — the same palette, same fonts, same photo treatment showing up across every post. If all three change every time, the brand reads as 3 separate brands instead of one. The fix: lock one element (usually the palette or the heading font) and use it on every post.",
      difficulty: "apply"
    },
    {
      id: "q-mc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these post types fits the **Vibe Post** slot (post #3) in the 3-post formula?",
      options: [
        "A detailed price list with 12 product photos and bullet points",
        "An infographic with 8 statistics and 4 different chart types",
        "A short quote on a solid palette-color background, in your heading font, with no product visible",
        "A long block of paragraph text explaining the company's history"
      ],
      correctIndex: 2,
      explanation: "The Vibe Post is the one that captures the *feeling* of the brand without selling anything. A short quote on a palette-color background using your heading font is exactly that — minimal, on-brand, and emotional. The other three are way too dense and miss the point of a vibe post.",
      difficulty: "apply"
    },

    // ─── WORK TIME ────────────────────────────────────────

    {
      id: "section-work",
      type: "section_header",
      icon: "🛠️",
      title: "Work Time — Build the 3 Posts + Brand Guide PDF",
      subtitle: "~25 minutes"
    },
    {
      id: "b-work-instructions",
      type: "text",
      content: "### Phase 1: Build the 3 Instagram Posts (15 min)\n\n1. Open Canva. Create a new design → **Custom size: 1080 × 1080 px**\n2. Build all 3 posts in the **same Canva file** as 3 different pages so you can compare them side by side\n3. Pull from your locked palette only — no new colors\n4. Use ONLY your heading + body fonts — no new fonts\n5. Drop your logo somewhere on each post (corner is fine)\n6. Run the **3-second test** — line them up, squint, see if they snap together as one brand\n7. **Export each post as PNG** (Share → Download → PNG → Page 1, 2, 3)\n\n### Phase 2: Build the 1-Page Brand Guide PDF (10 min)\n\nOpen the **Brand Guide PDF Template** (linked in Google Classroom). One page. Includes:\n\n- **Logo** (top-left, large)\n- **Brand name + tagline** (top-right)\n- **Color palette** (3-5 swatches with hex codes labeled)\n- **Font samples** (heading font sample + body font sample)\n- **3 IG post thumbnails** (drag in the 3 PNGs)\n- **Bio** (1-2 sentences — who you are, who it's for)\n- **Tagline** (5-8 words max — your brand's promise)\n\nWhen everything's in: **Share → Download → PDF Standard**. Submit the PDF on PantherLearn and Google Classroom."
    },
    {
      id: "img-brand-guide-example",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/brand-kit-day3-brand-guide-example.jpg",
      alt: "Example 1-page Brand Guide PDF layout for a fictional skate-streetwear brand: large icon logo top-left, brand name and tagline top-right, a 4-color palette row with hex codes, heading and body font samples, 3 Instagram post thumbnails at the bottom, and a short bio.",
      caption: "Example 1-page Brand Guide PDF. Yours should hit all 7 elements: logo, name + tagline, palette, fonts, 3 IG thumbnails, bio."
    },
    {
      id: "link-canva-ig",
      type: "external_link",
      url: "https://www.canva.com/instagram-posts/templates/",
      title: "Canva — Instagram Post Templates (1080×1080)",
      description: "Start from a clean square template, then strip it down and rebuild with your locked colors, fonts, and logo. Use the same Canva file for all 3 posts so you can compare side by side."
    },
    {
      id: "link-canva-brand-guide",
      type: "external_link",
      url: "https://www.canva.com/templates/?query=brand-guidelines",
      title: "Canva — Brand Guide / Brand Sheet Templates",
      description: "If the Google Classroom template doesn't load, search Canva for \"brand guidelines\" and pick a clean 1-page template. Make sure your final export is a PDF, not a PNG."
    },
    {
      id: "callout-brand-guide",
      type: "callout",
      style: "success",
      icon: "✅",
      content: "**Brand Guide PDF Checklist** — before you export, confirm all 7 elements are on the page:\n\n- [ ] Logo (transparent PNG, large enough to read)\n- [ ] Brand name\n- [ ] Tagline (5-8 words)\n- [ ] 3-5 color swatches with **hex codes labeled**\n- [ ] Heading font sample (the actual font, not just the name)\n- [ ] Body font sample\n- [ ] 3 Instagram post thumbnails\n\nMissing any one of these = points off on the rubric."
    },
    {
      id: "q-short-bio",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your final **brand bio + tagline** here (this is what goes on the Brand Guide PDF).\n\n- **Bio (1-2 sentences):** Who you are, who it's for. Specific.\n- **Tagline (5-8 words max):** Your brand's promise in one short line. (Examples: Nike's \"Just Do It\" • Apple's \"Think Different\" • Liquid Death's \"Murder Your Thirst\")",
      placeholder: "Bio: ...\nTagline: ...",
      difficulty: "create"
    },

    // ─── SHOWCASE / GALLERY WALK ──────────────────────────

    {
      id: "section-showcase",
      type: "section_header",
      icon: "🖼️",
      title: "Showcase — Gallery Walk",
      subtitle: "~6 minutes"
    },
    {
      id: "b-showcase-instructions",
      type: "text",
      content: "**Open your Brand Guide PDF on your laptop screen and leave it up.**\n\nFor 4 minutes, the entire class walks the room. Stop at any 3 brands that catch your eye. Leave a sticky-note comment on each:\n\n- **One specific thing you'd steal** (a color combo, a font choice, a logo move, a tagline)\n- **One question or suggestion** (something that could make it stronger)\n\nNo \"good job\" comments. No emojis. Specific feedback only.\n\nLast 2 minutes: **2 students whose brand made you stop scrolling** — call them out by name when Mr. McCarthy asks. Their brand earned it."
    },
    {
      id: "callout-grading",
      type: "callout",
      style: "insight",
      icon: "📊",
      content: "**Rubric (out of 20)** — submit your PDF to PantherLearn for grading:\n- **Identity clarity (5):** vibe, audience, voice are obvious from the kit alone\n- **Visual cohesion (5):** logo, colors, fonts feel like ONE brand, not three\n- **Craft (5):** alignment, spacing, contrast — does it look professional?\n- **Brand guide PDF (5):** all 7 elements present, organized, portfolio-ready"
    },
    {
      id: "callout-due",
      type: "callout",
      style: "warning",
      icon: "📅",
      content: "**Due by end of class:** 1-page **Brand Guide PDF** submitted to PantherLearn AND Google Classroom. No homework — the project is built to finish in class. If you want extra polish time, Canva is free at home."
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "**Final Reflection (Exit Ticket):**\n\n1. Of the brands you saw on the gallery walk, which one made you stop? What specifically caught your eye — a color, a logo, a tagline, the photo style?\n2. If you had ONE more class period to work on your own brand, what's the first thing you'd fix or upgrade?\n3. What's the biggest thing you learned about brand identity that you'll actually use again — even outside this class?",
      placeholder: "1. Brand that stopped me + why: ...\n2. What I'd fix with one more day: ...\n3. Biggest takeaway I'll actually use: ...",
      difficulty: "reflect"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc(COURSE_ID)
      .collection("lessons").doc(LESSON_ID)
      .set(lesson);
    console.log(`✅ Lesson "${lesson.title}" seeded!`);
    console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
    console.log(`   Blocks: ${lesson.blocks.length}`);
    console.log(`   Order: ${lesson.order}`);
    console.log(`   Visible: ${lesson.visible}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
