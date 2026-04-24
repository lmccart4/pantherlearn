// seed-diglit-entrepreneurship-branding.js
// Creates "Branding 101 — Name, Logo, Colors, Vibe" (Dig Lit, Unit 6, Lesson 35)
// Run: node scripts/seed-diglit-entrepreneurship-branding.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Branding 101 — Name, Logo, Colors, Vibe",
  questionOfTheDay: "Why do you trust some brands you've never bought from, just based on how they look?",
  course: "Digital Literacy",
  unit: "Digital Entrepreneurship",
  order: 35,
  visible: false,
  dueDate: "2026-04-23",
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎨",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "You've never bought from a particular brand before. You've never heard a review. But you look at their Instagram or their packaging — and you trust them immediately.\n\nThat's branding.\n\nBranding is the first impression your business makes before it says a single word. It communicates: who you are, who you're for, and whether you can be trusted — all through design choices most people don't consciously notice."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why do you trust some brands you've never bought from, just based on how they look?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a brand whose visual identity you really like — any brand. What colors, fonts, and overall vibe do they use? What does that look communicate about who the brand is for?",
      placeholder: "Brand: ...\nColors/fonts/vibe: ...\nWhat it communicates: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the 4 core elements of brand identity: name, logo, color palette, and voice",
        "Analyze how branding decisions signal who a brand is for",
        "Build a one-page brand identity kit for your business concept"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "🏷️",
      title: "The 4 Pillars of Brand Identity",
      subtitle: "~15 minutes"
    },
    {
      id: "b-four-pillars",
      type: "text",
      content: "**1. Name**\nShort, memorable, easy to spell and search. Ask: can someone Google it after hearing it once? Avoid names that only make sense to you.\n\nGood: *Depop, Canva, Notion, Duolingo* — short, distinctive, searchable.\nAvoid: acronyms, inside jokes, names that are already taken, and anything impossible to spell.\n\n**2. Logo**\nSimple always beats complex. The Nike swoosh. Apple's apple. The Twitter bird. If it doesn't work in black-and-white at 20 pixels, it's too complicated. Text-based logos (wordmarks) are perfectly valid — you don't need a symbol.\n\n**3. Color Palette**\n2-3 colors maximum. Colors carry meaning:\n- 🔵 Blue = trust, professionalism (banks, tech companies)\n- 🔴 Red = energy, urgency (food brands, sale alerts)\n- 🟢 Green = growth, health, sustainability\n- ⚫ Black = luxury, sophistication, premium\n- 🟡 Yellow = optimism, youth, energy\n- 🟣 Purple = creativity, royalty, mystery\n\nYour palette should match your audience and your tone.\n\n**4. Brand Voice**\nHow your brand 'sounds' in writing — formal or casual? Funny or serious? Motivational or informational? Your voice should sound like a person your target audience would want to hang out with."
    },
    {
      id: "callout-consistency",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Consistency = trust.** The reason you recognize brands instantly is because they never deviate from their visual identity. Same colors, same fonts, same logo, same tone — on every post, every product, every platform. Inconsistency makes a brand feel unprofessional and forgettable."
    },
    {
      id: "q-color-psychology",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student is launching a tutoring service for anxious high school students who struggle with test prep. Which color palette would best support this brand?",
      options: [
        "Bright red and black — tells students you mean business and take test prep seriously",
        "Muted blue and sage green — a quiet, steady tone across every page",
        "Purple and gold — stands out as premium and professional",
        "Orange and white — approachable, youthful, and high-energy"
      ],
      correctIndex: 1,
      explanation: "The audience is already anxious. The brand's job isn't to add intensity (red/black, orange) or flash (purple/gold) — it's to match the emotional state the student is hoping to feel: calm, steady, safe. Muted cool tones do that. Every other option adds arousal when the audience needs the opposite.",
      difficulty: "apply"
    },
    {
      id: "q-voice-ab",
      type: "question",
      questionType: "short_answer",
      prompt: "Read these two social media captions for the same fitness app. Which brand voice do you think works better for a teen audience? Why?\n\n**Caption A:** \"Maximize your athletic performance with our clinically-validated workout protocols. Consult a physician before beginning any exercise program.\"\n\n**Caption B:** \"We'll be honest: the first week kinda hurts. The second week you start to feel different. Week 3? You won't recognize yourself. Start today 💪\"",
      placeholder: "Caption [A/B] works better for teens because...",
      difficulty: "evaluate"
    },

    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Build Your Brand Identity Kit",
      subtitle: "~15 minutes"
    },
    {
      id: "link-canva",
      type: "external_link",
      icon: "🎨",
      title: "Canva — Design your brand board",
      url: "https://www.canva.com/",
      description: "Use Canva to build a single-page brand board. Log in with your school Google account. Canva's \"Brand Board\" template is a good starting point.",
      buttonLabel: "Open Canva",
      openInNewTab: true
    },
    {
      id: "b-brand-kit-intro",
      type: "text",
      content: "Create a single-page brand board for your business in Canva. Your brand kit should include:\n\n- **Business name** (with a 1-sentence explanation of why you chose it)\n- **Logo** (even text-based is fine — keep it simple)\n- **Color palette** (3 colors with hex codes — use Canva's palette generator)\n- **Brand voice** (3 adjectives that describe how this brand talks)\n- **One sample social media post** using your brand's visual style\n\n**Time budget:** 5 min on name + logo, 5 min on colors + voice, 5 min on sample post. Don't get stuck on perfecting the logo."
    },
    {
      id: "q-brand-name",
      type: "question",
      questionType: "short_answer",
      prompt: "What is your business name? Why did you choose it? (Is it short? Searchable? Does it hint at what the business does or who it's for?)",
      placeholder: "Name: ...\nWhy: ...",
      difficulty: "create"
    },
    {
      id: "q-brand-logo",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your logo. Is it a wordmark (styled text), a symbol, or both? Why is it **simple enough** to still read clearly at a very small size (like a favicon or an app icon on a phone)?",
      placeholder: "Type (wordmark / symbol / both): ...\nDescription: ...\nWhy it still works small: ...",
      difficulty: "create"
    },
    {
      id: "q-brand-palette",
      type: "question",
      questionType: "short_answer",
      prompt: "What are your 3 brand colors? (Include hex codes if you have them.) Why did you choose them — what do they communicate to your specific audience?",
      placeholder: "Color 1: ... — communicates ...\nColor 2: ... — communicates ...\nColor 3 (accent): ...",
      difficulty: "create"
    },
    {
      id: "q-brand-voice",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe your brand voice in 3 adjectives. Then write one sample caption in that voice for a hypothetical post about your business.",
      placeholder: "Brand voice adjectives: ...\nSample caption: ...",
      difficulty: "create"
    },
    {
      id: "q-brand-sample-post",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at the sample post on your brand board. Which specific brand choices — colors, typography, tone of voice — are visible in this one post? If your target audience saw this in their feed next to 20 other posts, what would make it recognizably **yours**?",
      placeholder: "Brand choices visible: ...\nWhat makes it recognizable: ...",
      difficulty: "analyze"
    },
    {
      id: "evidence-brand-board",
      type: "evidence_upload",
      icon: "📷",
      title: "Upload Your Brand Board",
      instructions: "Export or screenshot your completed Canva brand board and upload it here. Your board should show: business name, logo, color palette (with hex codes), brand voice adjectives, and one sample social post.",
      reflectionPrompt: "In one sentence: what's the strongest design choice on your board, and why will your specific audience respond to it?"
    },

    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "Your brand identity kit is a reference document you'll use for everything you build: your landing page, your pitch deck, your marketing posts.\n\nEvery design decision — colors, fonts, tone — should trace back to your audience. If you can explain *why* each choice serves your specific audience, your branding is intentional. If you can't explain why — it's decoration.\n\n**Up next:** Lesson 36 — Revenue Models. You have a brand. Now: how does the money actually flow?"
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Look at your brand board. Would your target audience trust this brand based on first look alone? What's the one element of your branding that communicates most clearly to your specific audience?",
      placeholder: "Would my audience trust it? ...\nThe strongest element is ... because ...",
      difficulty: "evaluate"
    },

    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Brand identity", definition: "The visual and tonal elements that make a business recognizable — name, logo, color palette, and voice working together consistently." },
        { term: "Brand voice", definition: "The consistent personality and tone a brand uses in all written communication — formal/casual, serious/playful, technical/accessible." },
        { term: "Color palette", definition: "2-3 colors chosen to represent a brand, selected intentionally for the emotions and associations they trigger in the target audience." },
        { term: "Wordmark", definition: "A logo that consists of the brand name in a styled font, without a separate symbol or icon." },
        { term: "Brand board", definition: "A single-page visual reference document showing a brand's logo, colors, fonts, and visual style — used to maintain consistency." }
      ]
    }
  ]
};

async function seed() {
  try {
    const result = await safeLessonWrite(db, "digital-literacy", "entrepreneurship-branding", lesson);
    console.log('✅ Lesson "Branding 101" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/entrepreneurship-branding");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
