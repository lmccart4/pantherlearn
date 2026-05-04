// seed-diglit-brand-kit-day2.js
// Digital Literacy — Brand Kit Sprint, Day 2: "Logo, Color, Font"
// Run: node scripts/seed-diglit-brand-kit-day2.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "brand-kit-day2-logo-color-font";

const lesson = {
  title: "Brand Kit Day 2 — Logo, Color, Font",
  course: "Digital Literacy",
  unit: "Brand Kit Sprint",
  order: 60.1,
  visible: false,
  questionOfTheDay: "What do the Nike swoosh, the Apple apple, and the Twitter bird all have in common — even though they look nothing alike?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🚀",
      title: "Warm Up — Logo Speed Round",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "Yesterday you locked your brand's vibe, audience, and voice. Today we turn that into something visual: a **logo**, a **color palette**, and a **font system**.\n\nBefore we build, look at this row of 8 logos with the names hidden:\n\n**Chipotle • Supreme • Apple • Stüssy • Trader Joe's • Patagonia • Shopify • Duolingo**\n\nEvery one of those is a billion-dollar brand. Look at them carefully — what do they all have in common?"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What do the Nike swoosh, the Apple apple, and the Twitter bird all have in common — even though they look nothing alike?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at the 8 logos above (Chipotle, Supreme, Apple, Stüssy, Trader Joe's, Patagonia, Shopify, Duolingo). List 2-3 things they ALL have in common. What's the rule strong logos seem to follow?",
      placeholder: "What they all have in common: ...\nThe rule strong logos follow: ...",
      difficulty: "analyze"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify three logo types (wordmark, lettermark, icon) and pick one type for your brand",
        "Build a 3-5 color palette using Coolors.co and lock the hex codes",
        "Pair a heading font with a body font using contrast (sans + serif)",
        "Export a transparent-PNG logo from Canva"
      ]
    },

    // ─── MINI-LESSON: THREE LOGO TYPES ─────────────────────

    {
      id: "section-mini-logo",
      type: "section_header",
      icon: "✏️",
      title: "Three Logo Types — Pick ONE",
      subtitle: "~5 minutes"
    },
    {
      id: "b-logo-types",
      type: "text",
      content: "Every logo in the world is basically one of three types. The biggest mistake amateur designers make is trying to use **all three at once** (a swoosh + initials + a long wordmark + a tagline). The result looks crowded and unfocused.\n\n**Pick ONE type. Just one.**\n\n| Type | What It Is | Examples |\n|---|---|---|\n| **Wordmark** | The brand name written in a custom or distinctive font | Coca-Cola, Google, FedEx, Disney |\n| **Lettermark** | Just the initials, styled as the logo | CNN, HBO, NASA, IBM |\n| **Icon (symbol)** | A graphic symbol — no letters needed | Nike swoosh, Apple, Twitter bird, Target bullseye |\n\n**How to pick:**\n- **Long brand name?** → wordmark only works if it's short (\"Glossier\" yes, \"Liquid Death Mountain Water\" no)\n- **Short or unmemorable name?** → lettermark or icon helps\n- **Want it to feel premium / minimal?** → icon or single-letter mark\n- **Want the name to do the work?** → wordmark, but pick a font with personality"
    },
    {
      id: "img-logo-types",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/brand-kit-day2-three-logo-types.jpg",
      alt: "Infographic comparing three logo types side by side: a wordmark (Coca-Cola style script), a lettermark (CNN-style stacked block letters), and an icon (Nike-style swoosh symbol), each labeled clearly on a clean white background.",
      caption: "Three logo types: wordmark, lettermark, icon. Pick ONE for your brand — never combine all three."
    },
    {
      id: "callout-bw-test",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The Black-and-White Test:** Every great logo works in pure black-and-white. Before you add color or gradients, your logo should already look strong as a single black shape on white. If it only looks good in color, it's not a strong logo yet — it's color hiding a weak shape."
    },
    {
      id: "q-mc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student designs a logo for a clothing brand called \"Mountain Echo Vintage Trading Co.\" They want to use a wordmark. What's the biggest problem with that choice?",
      options: [
        "Wordmarks aren't allowed for clothing brands",
        "Wordmarks are too expensive to produce",
        "Clothing brands can only use icon logos",
        "The brand name is too long to read at small sizes — a wordmark of that name will be unreadable on a tag, app icon, or Instagram avatar"
      ],
      correctIndex: 3,
      explanation: "Wordmarks only work when the name is short enough to stay readable when shrunk to an app icon, hangtag, or Instagram avatar. \"Mountain Echo Vintage Trading Co.\" is way too long — it would shrink into an unreadable blur. Better choices: a lettermark (\"MEV\") or an icon (a stylized mountain). Logos have to work at every size, from billboard to favicon.",
      difficulty: "apply"
    },

    // ─── MINI-LESSON: COLOR ───────────────────────────────

    {
      id: "section-mini-color",
      type: "section_header",
      icon: "🎨",
      title: "Color — Lock 3 to 5 Hex Codes",
      subtitle: "~4 minutes"
    },
    {
      id: "b-color-rules",
      type: "text",
      content: "Brand color isn't just \"what looks pretty.\" It's a tool. The rule:\n\n**1 dominant color + 1 accent color + 1-3 neutrals = a brand palette.**\n\nThat's it. Most strong brands run on 3-5 colors total. More than that and the brand starts to feel scattered.\n\n**Examples:**\n- **Coca-Cola:** red (dominant) + white (neutral) + black (neutral) — 3 colors total\n- **Glossier:** soft pink (dominant) + cream (neutral) + black (accent) — 3 colors total\n- **Spotify:** green (dominant) + black (neutral) + white (neutral) — 3 colors total\n\n**The easy way to build one:** Use Coolors.co. It generates harmonious palettes instantly — press the spacebar to roll new combinations. When one feels right, **lock it** (hit the lock icon on the colors you love), then keep pressing space until the unlocked ones match. Screenshot the final palette and copy the hex codes (`#A1B2C3` format) into your Brand Doc."
    },
    {
      id: "link-coolors",
      type: "external_link",
      url: "https://coolors.co/",
      title: "Coolors.co — Palette Generator",
      description: "Press the spacebar to generate new palettes. Click the lock icon to keep colors you love. Screenshot when you're happy. Copy the 6-character hex codes (e.g. #2D7DD2) into your Brand Doc."
    },

    // ─── MINI-LESSON: FONTS ───────────────────────────────

    {
      id: "section-mini-font",
      type: "section_header",
      icon: "🔤",
      title: "Fonts — Pair a Heading + a Body",
      subtitle: "~3 minutes"
    },
    {
      id: "b-font-rules",
      type: "text",
      content: "You need exactly **2 fonts**:\n- **Heading font** — the loud one. Used on logos, hooks, big titles. Has personality.\n- **Body font** — the quiet one. Used for paragraphs, captions, labels. Easy to read at small sizes.\n\n**The pairing rule: contrast.** Don't pair two fonts that look similar — that's like wearing two slightly-different black shirts. Pair fonts that *contrast* but still feel like they belong together.\n\n**The cheat code: sans + serif.**\n- **Sans-serif** = clean, no little feet on the letters (Helvetica, Inter, Montserrat)\n- **Serif** = traditional, with little feet (Georgia, Playfair Display, Lora)\n\nA bold sans heading + a serif body = instant professional. Or flip it: a fancy serif heading + a clean sans body. Both work.\n\n**Easy mode:** Use **fontpair.co** — they show pre-vetted pairings that already work. Pick one, write down the names in your Brand Doc."
    },
    {
      id: "img-font-pairing",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/brand-kit-day2-font-pairing-examples.jpg",
      alt: "Three font pairing examples shown as stacked text samples: a bold sans-serif heading paired with a serif body, a serif heading paired with a sans body, and a quirky display heading paired with a neutral sans body. Each pairing is labeled.",
      caption: "Three winning pairings. Notice the contrast — the heading and body never look like the same font twice."
    },
    {
      id: "link-fontpair",
      type: "external_link",
      url: "https://www.fontpair.co/",
      title: "Fontpair — Pre-Vetted Font Pairings",
      description: "Browse heading + body pairings that already work together. Both fonts are free Google Fonts. Pick one, write down the two names in your Brand Doc."
    },
    {
      id: "q-mc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student picks two fonts: **Montserrat** (a clean sans-serif) for headings and **Open Sans** (also a clean sans-serif) for body text. What's the problem?",
      options: [
        "The two fonts are too expensive to license",
        "Both fonts are sans-serif, so there's not enough contrast — the heading won't visually stand out from the body",
        "Both fonts are too old to use in 2026",
        "There's no problem — both fonts are popular"
      ],
      correctIndex: 1,
      explanation: "The pairing rule is contrast. Two clean sans-serif fonts are too similar — when set side by side, the heading won't pop against the body. Better: keep Montserrat for headings, but switch the body to a serif like Lora or Merriweather. Sans + serif = instant contrast.",
      difficulty: "apply"
    },

    // ─── WORK TIME ────────────────────────────────────────

    {
      id: "section-work",
      type: "section_header",
      icon: "🛠️",
      title: "Work Time — Build It in Canva",
      subtitle: "~20 minutes"
    },
    {
      id: "b-work-instructions",
      type: "text",
      content: "Open Canva. You're building three things and saving them in your Brand Doc.\n\n### 1. Logo (10 min)\n- Search Canva for **\"Logo\"** in the templates section\n- Pick a template close to your logo type (wordmark / lettermark / icon)\n- **Strip it down.** Delete extra text, taglines, decorative elements. Less is more.\n- Customize: change the font to your heading font, swap the colors to your palette\n- Test the **black-and-white test** — duplicate it, make every layer black on white. Does it still look strong?\n- **Export:** click Share → Download → PNG → check **\"Transparent background\"** → Download\n\n### 2. Color Palette\n- Open Coolors.co, generate a palette, lock the colors you love, screenshot it\n- Paste the screenshot in your Brand Doc\n- **Type out all hex codes** below it (e.g. `#2D7DD2 • #FFD23F • #1A1A1A • #F5F5F5`)\n\n### 3. Font System\n- Open fontpair.co, pick a heading + body pairing\n- In your Brand Doc, write: **Heading: [font name]** and **Body: [font name]**\n- Type one sentence in each font as a sample so you can see them"
    },
    {
      id: "link-canva-logo",
      type: "external_link",
      url: "https://www.canva.com/logos/templates/",
      title: "Canva — Logo Templates",
      description: "Pick a template close to your logo type. Strip it down. Customize the font and colors to match your brand. Export as transparent PNG."
    },
    {
      id: "callout-canva-export",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Don't forget the transparent background.** When you export your logo, click Share → Download → PNG → and check the **\"Transparent background\"** box. If you skip this, your logo will export with an ugly white square around it that looks terrible on every other background. (This requires a free Canva for Education account, which you already have through PAPS.)"
    },
    {
      id: "q-short-deliverables",
      type: "question",
      questionType: "short_answer",
      prompt: "Paste the following into your answer (this is your check-in for today):\n\n1. **Logo type I picked:** (wordmark / lettermark / icon)\n2. **My hex codes:** (example: `#2D7DD2 • #FFD23F • #1A1A1A`)\n3. **Heading font:**\n4. **Body font:**\n5. **One thing I'm stuck on or want feedback on:**",
      placeholder: "1. Logo type: ...\n2. Hex codes: ...\n3. Heading font: ...\n4. Body font: ...\n5. Stuck on: ...",
      difficulty: "create"
    },

    // ─── EXIT ──────────────────────────────────────────────

    {
      id: "section-exit",
      type: "section_header",
      icon: "🎉",
      title: "Exit — Drop Your Logo in Padlet",
      subtitle: "~2 minutes"
    },
    {
      id: "b-exit-instructions",
      type: "text",
      content: "**Drop your logo PNG in the class Padlet** (link is in Google Classroom). Then take 60 seconds and add **one emoji reaction** to each of your classmates' logos. That's it. No comments needed — just react.\n\nThe goal: see what's working across the room. Tomorrow we build the Instagram posts and the final Brand Guide PDF on top of what you locked today."
    },
    {
      id: "callout-due",
      type: "callout",
      style: "insight",
      icon: "📅",
      content: "**Due by end of class:** Logo PNG (transparent background), 3-5 hex codes, heading + body font names — all saved in your Brand Doc. Tomorrow we build 3 Instagram mockups and the final 1-page Brand Guide PDF. **No logo today = no Instagram posts tomorrow.** Lock it now."
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "**Reflection:** Did your logo pass the black-and-white test? Why or why not? If it didn't, what would you change to make it stronger?",
      placeholder: "Black-and-white test result: ...\nWhy: ...\nWhat I'd change: ...",
      difficulty: "evaluate"
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
