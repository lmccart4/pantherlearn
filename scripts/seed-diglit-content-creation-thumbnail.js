// seed-diglit-content-creation-thumbnail.js
// Creates "Thumbnail & Cover Art — The Art of the Click" (Dig Lit, Unit 5, Lesson 27)
// Run: node scripts/seed-diglit-content-creation-thumbnail.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Thumbnail & Cover Art — The Art of the Click",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 27,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🖼️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Top YouTubers report spending **more time on their thumbnail** than on their video title — sometimes more than an hour designing a single image.\n\nWhy? Because a video with 0 clicks gets 0 views, no matter how good the content is.\n\nThe thumbnail is not decoration. It's the first, and sometimes only, piece of marketing your content gets."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why do YouTubers spend more time on their thumbnail than their title?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think of a YouTube channel you watch regularly. What do their thumbnails look like? Is there a consistent style? What makes you click on their videos?",
      placeholder: "Channel: ...\nThumbnail style: ...\nWhat makes me click: ...",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why thumbnails and cover images drive engagement more than the content itself",
        "Identify the 5 design patterns used in high-performing thumbnails",
        "Create two thumbnails for your audience profile topic"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📚",
      title: "The 5 Rules of High-Performing Thumbnails",
      subtitle: "~15 minutes"
    },
    {
      id: "b-thumbnail-rules",
      type: "text",
      content: "These aren't opinions — they're patterns that show up in the data of what actually gets clicked:\n\n**1. Faces with emotion**\nHuman faces — especially with exaggerated expressions (surprise, shock, laughing, concern) — get more clicks. This is psychology: your brain is hardwired to look at faces and read emotions before anything else.\n\n**2. 3 elements maximum**\nFace + text + one supporting object. More than 3 elements creates visual noise. Your thumbnail will appear the size of a postage stamp on most screens — clutter disappears, focus gets clicks.\n\n**3. Contrast with your platform**\nYouTube has a white/light gray background. Your thumbnail needs to stand out against that. Dark thumbnails with bright colors work well on YouTube. On Instagram (white background), the same rule applies.\n\n**4. Text is optional — but if you use it, go bold**\nMax 5 words. Huge font. High contrast color. If it's not readable at thumbnail size, cut it.\n\n**5. Promise something**\nThe thumbnail should create a question in the viewer's mind: *What happened? How is that possible? I need to know this.* It promises a payoff for clicking."
    },
    {
      id: "callout-promise",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The Thumbnail-Hook Connection:** A great thumbnail and a great hook do the same job — they create a question that demands an answer. The thumbnail gets the click; the hook keeps them watching. They need to work together or viewers feel tricked and leave immediately."
    },
    {
      id: "q-rule-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A YouTuber is creating a video about a new phone. Thumbnail Option A: a high-quality photo of the phone with the title text. Thumbnail Option B: the YouTuber holding the phone with a surprised expression and the word 'SHOCKING.' Which is likely to get more clicks and why?",
      options: [
        "Option A — the phone is the subject of the video so it should be in the thumbnail",
        "Option B — faces with emotion and curiosity-triggering text outperform product-only images",
        "They would perform the same — content quality is what matters",
        "Option A — option B looks clickbait-y and turns off viewers"
      ],
      correctIndex: 1,
      explanation: "The data consistently shows that faces with emotion outperform product shots for most content categories. The surprised expression signals 'this is worth your reaction' and SHOCKING triggers curiosity (rule 5: promise something). Clickbait concerns are real — but Option B would need the video to actually deliver, which is the creator's responsibility.",
      difficulty: "evaluate"
    },
    {
      id: "q-rule-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student's thumbnail has: a face, a background image of a city, text listing 5 tips, a logo in the corner, and a color border. What's the main problem?",
      options: [
        "The background image doesn't match the topic",
        "The logo should be larger",
        "There are too many elements — it violates the 3-element maximum rule",
        "The color border isn't necessary on YouTube"
      ],
      correctIndex: 2,
      explanation: "At thumbnail size, 5+ elements compete for attention and none of them stand out. The 3-element rule exists because thumbnails are tiny on most screens — you need to lead with what matters and cut everything else. Face + bold text + one clear visual = the winning formula.",
      difficulty: "apply"
    },
    {
      id: "q-shrink",
      type: "question",
      questionType: "short_answer",
      prompt: "The 'shrink test': Imagine your thumbnail is the size of your thumb (about 1 inch). At that size, what can you still see clearly? What disappears? What does this tell you about thumbnail design?",
      placeholder: "At thumb size, I can see... I can't see... This tells me...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // BUILD YOUR THUMBNAILS
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Create 2 Thumbnails",
      subtitle: "~15 minutes"
    },
    {
      id: "b-build-intro",
      type: "text",
      content: "Using your audience profile topic, you'll create **2 thumbnails** in Canva:\n\n**Thumbnail 1:** YouTube video thumbnail (1280 × 720px)\nFor a video about your topic. Use the 5 rules — face or bold visual, 3 elements max, readable at small size.\n\n**Thumbnail 2:** Podcast cover OR Instagram post cover (1080 × 1080px)\nFor the same topic in a different format. Compare how the design has to change for a square format vs. horizontal.\n\n**Canva custom dimensions:** Use \"Custom size\" to enter the exact pixel dimensions. Both sizes are standard and available in Canva's template library too."
    },
    {
      id: "q-thumb-plan",
      type: "question",
      questionType: "short_answer",
      prompt: "Before designing, plan your YouTube thumbnail:\n- What's the subject/topic of the video this thumbnail is for?\n- What 3 elements will you include?\n- What's the 'promise' — what question does this thumbnail create in the viewer's mind?",
      placeholder: "Topic: ...\n3 elements: ...\nThe promise/question: ...",
      difficulty: "plan"
    },
    {
      id: "q-thumb-reflect",
      type: "question",
      questionType: "short_answer",
      prompt: "After creating both thumbnails: Apply the shrink test to each. Which one works better at small size? Why? What rule from the 5-point list is the most visible in your stronger thumbnail?",
      placeholder: "The [YouTube/podcast] thumbnail works better at small size because...\nThe most visible rule is [rule #] — specifically...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
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
      content: "A thumbnail is marketing. It doesn't matter how good the content is if nobody clicks.\n\nYou now know the 5 rules, you can do the shrink test, and you've practiced with two different formats. Add both thumbnails to your project folder — you'll use one for your final content piece in Lesson 30.\n\n**Up next:** Lesson 28 — Writing for Screens. You've been working on visuals. Now you'll learn how to write captions, copy, and calls-to-action that actually get people to act."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Look at a YouTube video thumbnail from a creator you follow. Apply the 5 rules — which ones does it follow? Which does it break? Does it still work?",
      placeholder: "Thumbnail I'm analyzing: ...\nRules it follows: ...\nRules it breaks: ...\nDoes it still work? Why or why not: ...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
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
        { term: "Thumbnail", definition: "A small preview image representing a video, podcast episode, or post — the main factor determining whether someone clicks." },
        { term: "Click-through rate (CTR)", definition: "The percentage of people who see a thumbnail and click on it. Higher CTR = more effective thumbnail." },
        { term: "Cover art", definition: "A square image representing a podcast, playlist, or profile — designed to be recognizable at small sizes." },
        { term: "The shrink test", definition: "Reduce your thumbnail to thumb-size to see what remains readable and visible — what survives is what grabs attention on a real platform." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-thumbnail")
      .set(lesson);
    console.log('✅ Lesson "Thumbnail & Cover Art — The Art of the Click" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-thumbnail");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Visible: false");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
