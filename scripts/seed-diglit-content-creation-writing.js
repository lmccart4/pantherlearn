// seed-diglit-content-creation-writing.js
// Creates "Writing for Screens — Captions, Copy, and CTAs" (Dig Lit, Unit 5, Lesson 28)
// Run: node scripts/seed-diglit-content-creation-writing.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Writing for Screens — Captions, Copy, and CTAs",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 28,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "✍️",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Writing for a screen is completely different from writing for a class essay or a printed article.\n\nOn a screen — especially a phone — people:\n- Skim, they don't read\n- Make keep/scroll decisions in seconds\n- Read the first line before deciding if the rest is worth their time\n- Expect you to tell them what to do next\n\nThe rules change. Short wins. Specific wins. Direct wins."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** Why do the best social media captions sound like they're talking to one person, not a crowd?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Compare these two Instagram captions for a photo of a sunset:\n\nCaption A: *\"The beauty of nature is something that we should all take time to appreciate in our daily lives. This sunset was a reminder of how important it is to slow down and be present in the moment.\"*\n\nCaption B: *\"Pulled over on the side of Route 9 because I couldn't drive past this. Worth it. 🌅 Drop a 🔥 if you've done something similar.\"*\n\nWhich caption would you stop scrolling for? Why?",
      placeholder: "I'd stop for Caption [A/B] because...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Distinguish between writing for print vs. writing for screens",
        "Apply the 5 screen writing rules to captions and copy",
        "Write a caption, a description, and a one-liner pitch for your topic"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION
    // ═══════════════════════════════════════════
    {
      id: "section-main",
      type: "section_header",
      icon: "📱",
      title: "The 5 Screen Writing Rules",
      subtitle: "~15 minutes"
    },
    {
      id: "b-rules",
      type: "text",
      content: "**Rule 1: Short sentences. Period. Like this.**\nLong sentences are hard to scan. Your reader's eye gets lost. Short sentences give the brain a moment to breathe between ideas.\n\n**Rule 2: Front-load the good stuff.**\nInstagram cuts captions after 2 lines. Twitter gives you 280 characters. YouTube descriptions hide everything after line 3. The most important thing goes FIRST — always.\n\n**Rule 3: One idea per post.**\nNot two. Not three. One idea, done well. Trying to pack more in makes everything worse.\n\n**Rule 4: Write like you talk.**\nIf you wouldn't say it out loud to a friend, don't write it.\n> ❌ *\"It has come to our attention that...\"*\n> ✅ *\"You know when...\"*\n\n**Rule 5: Every post needs a CTA.**\nA **call to action** tells your reader what to do next. If you don't ask, they won't act. Every post should end with one.\n\n**CTA types:** Follow | Save | Share | Comment | Click the link | Tag someone | DM me | Watch the full video"
    },
    {
      id: "callout-cta",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Why CTAs work:** Platforms reward engagement. The more people comment, share, and save your post, the more the algorithm shows it to others. A CTA directly increases the engagement metrics that trigger the algorithm. It's not manipulative — it's just asking people to do what they were thinking about doing anyway."
    },
    {
      id: "q-rule-identify",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student writes this caption: *\"This week I've been thinking about how important sleep is for your brain function, which is a topic that researchers have been studying for decades and there are many different perspectives on how much sleep teenagers actually need and why it matters for academic performance and mood regulation.\"*\n\nWhich rule is being broken most obviously?",
      options: [
        "Rule 2 — not front-loading the important information",
        "Rule 1 — sentence is too long and hard to scan",
        "Rule 3 — too many ideas in one post",
        "All of the above"
      ],
      correctIndex: 3,
      explanation: "All three rules are broken: the sentence is a run-on (Rule 1), the actual point (sleep matters for teens) is buried in the middle (Rule 2), and the caption tries to cover research, history, perspectives, AND impacts all at once (Rule 3). The fix: one clear claim, short sentences, front-loaded.",
      difficulty: "analyze"
    },
    {
      id: "q-cta",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which CTA is most effective for an Instagram post about a study tip you discovered?",
      options: [
        "Nothing — let people decide what to do on their own",
        "\"Please consider sharing this if you found it helpful.\"",
        "\"Save this for finals week. 📌\"",
        "\"I hope you enjoyed reading this tip!\""
      ],
      correctIndex: 2,
      explanation: "'Save this for finals week' is specific, direct, ties the action (save) to a real use case (finals), and is short. Option B is passive and too formal. Option D isn't a CTA at all — it's a closing line. Option A leaves engagement to chance, which algorithms punish.",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRITE YOUR COPY
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Write 3 Pieces of Copy",
      subtitle: "~15 minutes"
    },
    {
      id: "b-practice-intro",
      type: "text",
      content: "Using your audience profile topic, write 3 pieces of copy. Each one has different constraints — stay within them.\n\nSave all three in your project folder. You'll use these when you produce your final content piece in Lesson 30."
    },
    {
      id: "q-caption",
      type: "question",
      questionType: "short_answer",
      prompt: "**Instagram Caption** — Write the visible part of your caption (the first ~150 characters before 'more'). Must include: a hook as the first line, one clear idea, and a CTA. No run-on sentences.",
      placeholder: "First line (hook): ...\n[2-3 short sentences max]\nCTA: ...",
      difficulty: "create"
    },
    {
      id: "q-description",
      type: "question",
      questionType: "short_answer",
      prompt: "**YouTube Description (first 3 lines)** — Write the first 3 lines that appear before 'Show more.' Must front-load the most important info. Imagine someone deciding in 3 seconds whether to watch the full video.",
      placeholder: "Line 1: ...\nLine 2: ...\nLine 3: ...",
      difficulty: "create"
    },
    {
      id: "q-oneliner",
      type: "question",
      questionType: "short_answer",
      prompt: "**One-Liner Pitch** — Write one sentence that explains your content to someone who has never seen it. If you can't explain it in one sentence, your idea isn't clear enough yet.\n\nFormat: \"[Your content] helps/shows/gives [your audience] [the thing they get].\"",
      placeholder: "One-liner: ...",
      difficulty: "create"
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
      content: "Writing for screens is a skill. Most people write for screens the same way they were taught to write essays — and that's why most social media copy is forgettable.\n\nYou now have three pieces of copy that use the 5 rules: short sentences, front-loaded information, one clear idea, conversational tone, and a CTA.\n\n**Up next:** Lesson 29 — Content Planning. You've learned how to make individual pieces of content. Now you'll learn how to plan content consistently across a week, without running out of ideas."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Rewrite this caption using the 5 rules:\n\n*\"Good morning everyone! Today I wanted to share some thoughts about the importance of reading books because in today's society with social media and technology everywhere it can be hard to find time to sit down with a good book but the benefits are really significant for your focus and vocabulary.\"*",
      placeholder: "My rewrite (5 rules applied):\n...",
      difficulty: "apply"
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
        { term: "Call to action (CTA)", definition: "An instruction at the end of a post telling the audience what to do next: follow, save, share, comment, click, etc." },
        { term: "Caption", definition: "The text accompanying a social media post — typically includes a hook, the main message, hashtags, and a CTA." },
        { term: "Copy", definition: "Written text created for marketing or content purposes. 'Copywriting' is the skill of writing this kind of persuasive, engaging text." },
        { term: "Front-loading", definition: "Putting the most important information first in a piece of writing, before platforms truncate it or readers lose interest." },
        { term: "Engagement", definition: "Any interaction a viewer has with your content: likes, comments, shares, saves, clicks. Platforms use engagement to determine how widely to show content." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-writing")
      .set(lesson);
    console.log('✅ Lesson "Writing for Screens — Captions, Copy, and CTAs" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-writing");
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
