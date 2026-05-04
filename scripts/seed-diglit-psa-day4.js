// seed-diglit-psa-day4.js
// Digital Literacy — PSA Sprint, Day 4: Polish, Showcase, School Submission (Thu 5/28/2026)
// Run: node scripts/seed-diglit-psa-day4.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "psa-day4-polish-showcase";

const lesson = {
  title: "PSA Sprint Day 4 — Polish, Showcase, and School Submission",
  questionOfTheDay: "The class is going to vote on two awards today: 'Most Likely to Change Behavior' and 'Best Production'. Which one matters more, and why?",
  course: "Digital Literacy",
  unit: "PSA Sprint",
  order: 64.3,
  visible: false,
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏆",
      title: "Warm Up",
      subtitle: "~3 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** The class is going to vote on two awards today — 'Most Likely to Change Behavior' and 'Best Production.' Which one matters more, and why?"
    },
    {
      id: "b-warmup-intro",
      type: "text",
      content: "Today is the day. Top 3 PSAs from the class go to admin for the school monitor rotation. Real students walking past in the hallway will see your work. That's the bar.\n\nBefore we showcase, you get 15 minutes of polish. Use them. Then it's 22 minutes of showcases + voting, and 5 minutes for the final submission to admin.\n\n**Bring your A-game.** This is the capstone-before-the-capstone, and it's the test of everything you've built this semester."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Open your PSA. Watch it / look at it once, all the way through, with fresh eyes. List the top 3 things you'd improve in the next 15 minutes if you could. Be specific. 'Add captions to seconds 12–30,' not 'make it better.'",
      placeholder: "Polish list (3 specific items):\n1. ...\n2. ...\n3. ...",
      difficulty: "evaluate"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Run a final polish pass against a checklist (sources visible, captions on, CTA on screen, exports correct)",
        "Present 30 seconds of context (audience + data) and play your PSA for the class",
        "Vote on classmate PSAs across two criteria: behavior-change potential and production quality",
        "Recognize how this project tied together every prior sprint (Brand Kit, Photo/Short-Form, Data Lit, Algorithm Economy)"
      ]
    },

    // ─── MAIN: 15-MINUTE POLISH ──────────────────────────────

    {
      id: "section-polish",
      type: "section_header",
      icon: "🪒",
      title: "Final Polish (15 min)",
      subtitle: "Run the checklist"
    },
    {
      id: "b-polish-checklist",
      type: "text",
      content: "Run this checklist on your PSA. If even one box fails, fix it before showcase.\n\n**Universal checks (video AND poster):**\n- ☐ Specific audience is named in your context speech\n- ☐ One specific call-to-action — the same one across the whole piece\n- ☐ Sources cited visibly (on-screen for video, in footer for poster)\n- ☐ No fake stats. Every number traces back to a real source.\n- ☐ No identifying classmates, teachers, or staff\n- ☐ If sensitive topic — 988 visible, no graphic content, no method details, safe messaging followed\n\n**Video-specific checks:**\n- ☐ Captions burned in (not just auto-toggled)\n- ☐ Hook lands in the first 3 seconds\n- ☐ Sources frame at the end (or stat citations on each data shot)\n- ☐ Length 50–70 seconds\n- ☐ Music is royalty-free and credited\n- ☐ Exported to MP4, watchable on your phone in the school WiFi\n\n**Poster-specific checks:**\n- ☐ All 3 posters share the same brand (color, type, voice)\n- ☐ 6-foot readability — headline and CTA both visible from across the room\n- ☐ Two export sizes saved: 300 DPI print AND 1080x1080 (or 9:16) digital\n- ☐ Source footer on every poster"
    },
    {
      id: "img-polish-checklist",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/psa-polish-checklist.jpg",
      alt: "A visual checklist split into three columns: Universal (audience named, single CTA, sources visible, no fake stats, no identifying classmates, safe messaging if sensitive), Video-specific (burned-in captions, 3-second hook, sources frame, 50-70 sec length, royalty-free music, MP4 export), and Poster-specific (shared brand, 6-foot readability, two export sizes, source footer). Clean infographic style.",
      caption: "Pin this open. If a box doesn't get checked, your PSA isn't ready for showcase."
    },
    {
      id: "callout-sensitive",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Sensitive-topic last check:** If your PSA is about mental health, suicide, self-harm, or eating disorders — confirm 988 is visible during every emotional segment, no graphic content, no method details. If you're not 100% sure your script passes safe messaging, ask Mr. McCarthy for one final read before showcase. We don't ship anything that could harm a viewer."
    },

    // ─── MAIN: SHOWCASE FORMAT ────────────────────────────────

    {
      id: "section-showcase",
      type: "section_header",
      icon: "🎤",
      title: "Showcase (22 min)",
      subtitle: "30-second context, then play"
    },
    {
      id: "b-showcase-rules",
      type: "text",
      content: "**Each student presents in this exact order:**\n\n1. **30 seconds of spoken context.** Two things only — *who's the audience?* and *what's the data?* Example: \"This is for 9th graders at PAHS who scroll past midnight. According to the CDC, teens who use phones in bed lose 30+ minutes of sleep on average, and the AASM links it to higher anxiety. My CTA is — plug your phone in across the room before 10 PM.\"\n2. **Play the PSA / display the posters.** Video plays on the projector at full audio. Posters get displayed all 3 at once (printed if you brought them, full-screen on the projector if not).\n3. **Sit back down.** No editorial — your PSA does the talking.\n\n**While classmates present, you're voting.** The vote form opens once the first PSA finishes."
    },
    {
      id: "b-voting-rules",
      type: "text",
      content: "**Two awards. Anonymous Google Form vote. One vote per student per award.**\n\n- **Most Likely to Change Behavior** — which PSA in this class would actually work? Which one would you pause your scroll for? Which one would you remember at 11:30 PM tonight?\n- **Best Production** — which one looks and sounds the most professional? Pacing, type, color, audio, layout — pure craft.\n\nThese are different awards on purpose. The most polished PSA isn't always the most effective — sometimes a rougher piece with a sharper hook beats it. Both matter. Both get awarded.\n\n**You cannot vote for yourself.** The form will reject it."
    },
    {
      id: "q-vote-criteria-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When you vote for 'Most Likely to Change Behavior,' which question are you really being asked to answer?",
      options: [
        "Which PSA used the most expensive-looking equipment?",
        "Which PSA had the funniest hook?",
        "Which PSA had the most sources cited?",
        "Which PSA, in front of its actual target audience, would shift what they do tonight or tomorrow?"
      ],
      correctIndex: 3,
      explanation: "Behavior change is the whole point of a PSA. The award asks you to predict real-world impact: would the audience actually do something different after watching this? Production quality matters (it's the other award), but a beautifully-shot PSA that doesn't change behavior failed at its job.",
      difficulty: "evaluate"
    },

    // ─── MAIN: TIE-BACK ──────────────────────────────────────

    {
      id: "section-tieback",
      type: "section_header",
      icon: "🧵",
      title: "How Every Sprint Plugged Into This One",
      subtitle: "~3 minutes"
    },
    {
      id: "b-tieback",
      type: "text",
      content: "Look at your PSA and count how many of these you used:\n\n- **Brand Kit voice** — your color palette, type pairing, and tone are the same skills you built designing your personal brand. Without them, your PSA looks like a generic class assignment.\n- **Photo Essay + Short-Form production** — framing, pacing, captions, vertical vs horizontal export. The shot list and storyboard you used today were the same skills you built making your photo essay and short-form video.\n- **Data Lit + Infographic** — the rule that every claim has a source, that fake stats are unacceptable, that data on screen is more powerful than data in voiceover — that's the Data Literacy unit working in real time.\n- **Algorithm Economy** — the 3-second hook, the platform-specific export, the audience targeting. You're producing for the feed because you understand the feed. That's the Algorithm Economy unit going from theory to practice.\n\nThis was the test. If your PSA works, every prior unit worked. That's why this is the capstone-before-the-capstone."
    },
    {
      id: "img-skills-stack",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/psa-skills-stack.jpg",
      alt: "A vertical stack diagram showing four prior Digital Literacy units feeding into a final PSA at the top: Brand Kit (voice/color/type) at the bottom, Photo Essay + Short-Form (production craft), Data Lit + Infographic (evidence and citation), Algorithm Economy (hook/audience/platform), and the PSA Sprint at the top combining all four. Modern flat infographic style on a dark background.",
      caption: "Every prior sprint plugged into this one. The PSA is where you find out which skills stuck."
    },

    // ─── ACTIVITY: SCHOOL SUBMISSION ─────────────────────────

    {
      id: "section-submit",
      type: "section_header",
      icon: "🏫",
      title: "School Submission (5 min)",
      subtitle: "Top 3 → admin"
    },
    {
      id: "b-submit",
      type: "text",
      content: "**The top 3 PSAs from this class — combined from the class vote and Mr. McCarthy's pick — get submitted to admin** for inclusion in the school monitor rotation or hallway hanging.\n\nIf yours is one of the three: real students will see it walking past in the hallway. That's a real audience, and it's the whole point of doing this for real.\n\nIf yours doesn't make the top 3 today — that doesn't mean it failed. Some of the strongest work in past classes wasn't the most polished, just the most honest. Save it. The skill is what matters.\n\n**Selection note:** Sensitive-topic PSAs that pass safe messaging will be reviewed with admin and the school counselor before going on the monitors — that's a non-negotiable safety check, not a comment on the work."
    },

    // ─── CLOSING: REFLECTION + GUARDRAILS + DUE DATE ──────────

    {
      id: "section-closing",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~3 minutes"
    },
    {
      id: "callout-guardrails",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Final guardrails — apply at the moment of submission:**\n\n- **No fake stats.** Last chance to verify every number on screen.\n- **No identifying classmates, teachers, or staff** — if you forgot to crop someone out, fix it now.\n- **Sensitive topics** must be safe-messaging compliant — 988 visible, no graphic content, no method details. If unsure, ask before submitting.\n- **Source citations visible.** No 'sources in caption only' submissions to admin — they need to read on screen.\n- **You own this work.** Your name goes on it. Your school name goes on it. Make sure you're proud to stand behind it."
    },
    {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content: "**Submission due in class today, Thu 5/28.** Both export formats — video MP4 (or all 3 poster files in BOTH 300 DPI print AND digital sizes) — uploaded to your project doc before the period ends. Late submissions don't make the school monitor selection."
    },
    {
      id: "q-reflection",
      type: "question",
      questionType: "short_answer",
      prompt: "Final reflection: What's the single most important thing you learned about influencing behavior over these four days? Don't write a generic 'communication is important' answer — name a specific, concrete lesson you actually learned. What will you do differently the next time you try to convince anyone of anything?",
      placeholder: "The specific thing I learned: ...\nNext time I try to convince someone of something, I'll: ...",
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
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
