// seed-diglit-brand-kit-day1.js
// Digital Literacy — Brand Kit Sprint, Day 1: "Vibe Check"
// Run: node scripts/seed-diglit-brand-kit-day1.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "brand-kit-day1-vibe-check";

const lesson = {
  title: "Brand Kit Day 1 — Vibe Check",
  course: "Digital Literacy",
  unit: "Brand Kit Sprint",
  order: 60,
  visible: false,
  questionOfTheDay: "If your favorite brand was a person at PAHS, who would they be? What would they wear, how would they talk, and who would they hang out with?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "👀",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "Pull up three brands side-by-side: **Nike**, **Glossier**, and **Liquid Death**. Each one is wildly different — different colors, fonts, photos, and energy. Yet within 2 seconds of seeing any one of them, you *know* exactly who it's for.\n\nThat's not an accident. That's a brand identity doing its job.\n\nFor the next 3 days, you're going to build one of those — for yourself, a fake business, or a real one. By Thursday you'll have a logo, a color palette, fonts, three Instagram posts, and a one-page brand guide PDF. Real designer-level work, in three class periods."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If your favorite brand was a person at PAHS, who would they be? What would they wear, how would they talk, and who would they hang out with?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE brand you actually love (clothing, drink, app, creator, anything). In 2-3 sentences, describe that brand as if it were a student walking the halls of PAHS. What do they wear? How do they talk? What lunch table do they sit at?",
      placeholder: "The brand I picked: ...\nIf they were a PAHS student, they'd be: ...",
      difficulty: "understand"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Pick a brand to build (yourself, a real business, or one you invent)",
        "Define your brand's vibe, audience, and voice in one sentence each",
        "Describe a brand using exactly 3 adjectives that drive every visual choice",
        "Build a 6-image mood board that captures the brand's feel"
      ]
    },

    // ─── MINI-LESSON: THE 3-WORD IDENTITY ──────────────────

    {
      id: "section-mini",
      type: "section_header",
      icon: "🎯",
      title: "The 3-Word Identity",
      subtitle: "~12 minutes"
    },
    {
      id: "b-three-words-intro",
      type: "text",
      content: "Every brand that actually *works* can be summed up in 3 adjectives. Just three. Once you lock those words, every other decision — color, font, photo style, caption tone — gets easier, because you have a filter: *\"Does this feel [word 1], [word 2], and [word 3]?\"* If no, kill it.\n\nWatch how this plays out with three brands you already know:"
    },
    {
      id: "b-three-words-examples",
      type: "text",
      content: "| Brand | 3 Words | What That Looks Like |\n|---|---|---|\n| **Liquid Death** | loud, rebellious, dumb-funny | Black skull cans, heavy-metal typography, viral stunts (selling water in beer cans, fake-cursing in ads) |\n| **Glossier** | soft, clean, girl-next-door | Pastel pink, minimal sans-serif fonts, no-makeup-makeup photography, models who look like your friend |\n| **MrBeast** | huge, urgent, prize | Bold red/yellow thumbnails, oversized text, exclamation faces, \"$10,000 if you do this\" hooks |\n| **Apple** | minimal, premium, calm | White space, thin fonts, single-product shots, no clutter ever |\n| **Supreme** | exclusive, bold, in-your-face | Bright red box logo, single Futura font, drops that sell out in 30 seconds |\n\nNotice the pattern: the 3 words show up *everywhere*. Glossier could never use a black skull. Liquid Death could never use pastel pink. The 3 words are the brand's **filter**."
    },
    {
      id: "img-moodboards",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/brand-kit-day1-three-vibes-comparison.jpg",
      alt: "Side-by-side comparison of three brand vibes: Liquid Death (loud, rebellious, dumb-funny), Glossier (soft, clean, girl-next-door), and MrBeast (huge, urgent, prize), each shown as a mini-moodboard.",
      caption: "Three brands, three vibes — and the 3-word identities that drive every visual choice."
    },
    {
      id: "callout-bad-brand",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**The bad-brand trap:** When a brand has no clear 3 words, it ends up looking like clipart — random fonts, generic stock photos, colors that fight each other. You've seen this on local-business flyers and bad school club posters. Don't let your brand kit end up there. Lock the 3 words first."
    },
    {
      id: "q-mc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Liquid Death's 3-word identity is *loud, rebellious, dumb-funny*. Which design choice would BREAK their brand?",
      options: [
        "Putting a black skull on a tall slim aluminum can",
        "Switching their packaging to soft pastel pink with a thin handwritten font",
        "Running an ad where the CEO smashes a guitar",
        "Selling their water in cans that look like beer"
      ],
      correctIndex: 1,
      explanation: "Pastel pink and a thin handwritten font is Glossier territory — soft, clean, girl-next-door. None of those words are *loud, rebellious,* or *dumb-funny*. Liquid Death's 3-word filter would reject that move instantly. The other three choices all match at least two of the brand's adjectives.",
      difficulty: "apply"
    },
    {
      id: "b-vibe-audience-voice",
      type: "text",
      content: "**The 3 questions every brand has to answer (one sentence each):**\n\n1. **Vibe** — How does the brand *feel*? (Three adjectives, like above.)\n2. **Audience** — Who specifically is this for? *Get specific.* \"Teen girls who skate\" beats \"young people.\" \"Parents who care about ingredient lists\" beats \"moms.\" The narrower the audience, the louder the brand.\n3. **Voice** — How does the brand *talk*? Pick one: **hype / chill / serious / funny / luxury / weird**.\n\nIf you can't answer all three in a sentence each, you don't have a brand yet — you have a logo. Big difference."
    },
    {
      id: "q-mc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of these is the strongest *audience* statement for a brand?",
      options: [
        "High school skaters in the Northeast who buy thrifted clothes",
        "Young people who like cool stuff",
        "Anyone who wants to look good",
        "Customers worldwide"
      ],
      correctIndex: 0,
      explanation: "The narrower the audience, the louder the brand. \"High school skaters in the Northeast who buy thrifted clothes\" is specific enough that you can picture exactly one person — and that person tells you what colors, fonts, and photos will land. The other options are so broad they're useless as a design filter.",
      difficulty: "apply"
    },
    {
      id: "q-short-pick",
      type: "question",
      questionType: "short_answer",
      prompt: "Lock in your brand right now. Answer all 3 in one sentence each:\n\n1. **Brand name:**\n2. **Vibe** (3 adjectives):\n3. **Audience** (specific — picture ONE real person):\n4. **Voice** (pick one: hype / chill / serious / funny / luxury / weird):",
      placeholder: "1. Brand name: ...\n2. Vibe (3 adjectives): ...\n3. Audience: ...\n4. Voice: ...",
      difficulty: "create"
    },

    // ─── WORK TIME: BRAND IDENTITY SHEET + MOOD BOARD ──────

    {
      id: "section-work",
      type: "section_header",
      icon: "🛠️",
      title: "Work Time — Brand Identity Sheet",
      subtitle: "~20 minutes"
    },
    {
      id: "b-work-instructions",
      type: "text",
      content: "Open the Google Doc Brand Identity Sheet template (linked in Google Classroom). You'll fill it out and build a **6-image mood board** at the bottom.\n\n**Your sheet must include:**\n\n1. **Brand name**\n2. **3 adjectives** (your filter — no more, no less)\n3. **Audience** — one sentence, specific\n4. **Voice** — one of the six words above\n5. **Mood board** — 6 images you pulled from Pinterest or Google. The 6 images together should *feel* like the brand. Not the brand's products — its vibe. Lighting. Texture. Colors. Settings. Energy.\n\n**Mood board rules:**\n- 6 images, arranged in a 2×3 or 3×2 grid in your Doc\n- No logos of your actual brand\n- Mix it up: 1-2 photos of people, 1-2 textures or colors, 1-2 places or objects\n- If two images feel like they belong to *different* brands, swap one out"
    },
    {
      id: "img-moodboard-example",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/brand-kit-day1-moodboard-example.jpg",
      alt: "Example 6-image mood board for a fictional skate-streetwear brand: a 2x3 grid showing concrete textures, neon graffiti, a teen mid-kickflip, a thrifted denim jacket close-up, an empty parking lot at dusk, and a hand-drawn typography sketch.",
      caption: "Example mood board for a fictional skate-streetwear brand. Notice: no logos, lots of texture, one consistent vibe."
    },
    {
      id: "link-pinterest",
      type: "external_link",
      url: "https://www.pinterest.com/",
      title: "Pinterest — Mood Board Source",
      description: "Search for your brand's vibe (e.g., \"streetwear aesthetic\", \"clean minimal beauty\", \"chaotic punk poster\"). Save 6 images that feel right."
    },
    {
      id: "link-canva-prep",
      type: "external_link",
      url: "https://www.canva.com/",
      title: "Canva — Make Sure You're Logged In",
      description: "Make sure your Canva account is open and ready. You'll need it tomorrow for the logo build. Sign in with your school Google account."
    },

    // ─── EXIT ──────────────────────────────────────────────

    {
      id: "section-exit",
      type: "section_header",
      icon: "🤝",
      title: "Exit — Trade & Guess",
      subtitle: "~5 minutes"
    },
    {
      id: "b-exit-instructions",
      type: "text",
      content: "**Trade laptops with the person next to you.** Read their Brand Identity Sheet (everything *except* the 3 adjectives — cover that line with your hand or scroll past it).\n\nThen guess: based on the brand name, audience, voice, and mood board — what do you think their 3 adjectives are?\n\nCheck their actual answer. Did you nail it? If yes, their brand is locked. If your guess was way off, that's a sign they need to make the vibe louder before tomorrow."
    },
    {
      id: "callout-due",
      type: "callout",
      style: "insight",
      icon: "📅",
      content: "**Due by end of class:** Brand Identity Sheet filled out (name, 3 adjectives, audience, voice, 6-image mood board). Tomorrow we build the logo, color palette, and font system on top of this foundation. **No identity sheet = no logo to build. Lock it today.**"
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "**Exit Ticket / Reflection:** Did your partner guess your 3 adjectives correctly? If yes, what told them — was it the audience? The mood board? If no, what do you need to make louder tomorrow to fix that?",
      placeholder: "Partner's guess: ...\nWhat told them (or didn't): ...\nWhat I'll change: ...",
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
