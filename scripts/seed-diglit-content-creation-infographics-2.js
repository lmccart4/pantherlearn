// seed-diglit-content-creation-infographics-2.js
// Creates "Infographic Workshop + Peer Review" (Dig Lit, Unit 5, Lesson 26)
// Run: node scripts/seed-diglit-content-creation-infographics-2.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Infographic Workshop + Peer Review",
  course: "Digital Literacy",
  unit: "Content Creation",
  order: 26,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔄",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Today you're finishing your infographic — with help from a classmate.\n\nBut first: there's a big difference between feedback that helps and feedback that's useless. Most people give useless feedback because they don't know how to be specific.\n\n**Useless feedback:** \"It looks good.\" / \"I don't like the colors.\"\n\n**Useful feedback:** \"The headline is vague — try making it a specific stat.\" / \"The flow breaks in the middle because the font size doesn't change between sections.\"\n\nToday you'll give useful feedback. That's a skill too."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What's the difference between \"I like it\" and actually useful feedback?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Write an example of BAD feedback and an example of GOOD feedback for the same piece of work. The bad feedback should be vague; the good feedback should be specific and actionable.",
      placeholder: "Bad: ...\nGood: ...",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Give specific, actionable peer feedback using design criteria",
        "Apply peer feedback to revise and improve your own infographic",
        "Finalize an infographic ready for submission"
      ]
    },

    // ═══════════════════════════════════════════
    // PEER REVIEW
    // ═══════════════════════════════════════════
    {
      id: "section-review",
      type: "section_header",
      icon: "👥",
      title: "Peer Review",
      subtitle: "~20 minutes"
    },
    {
      id: "b-review-intro",
      type: "text",
      content: "You'll review a classmate's infographic using specific criteria. Your goal is to give **two pieces of feedback** — not \"I like it\" or \"it's fine.\" Each piece of feedback must:\n\n1. Name the specific problem (or strength)\n2. Explain why it matters\n3. Suggest what to change (or what makes it work)\n\n**Review criteria:**"
    },
    {
      id: "b-rubric",
      type: "text",
      content: "| Criteria | Needs Work (1) | Getting There (2) | Strong (3) |\n|----------|---------------|-------------------|------------|\n| **Headline** | Vague or just a topic title | Somewhat specific, but could be sharper | Clear, specific claim — is the main takeaway |\n| **Data** | Unclear or no source credited | Partially clear, source missing or hard to find | Accurate, sourced, easy to read |\n| **Visual hierarchy** | No clear flow — eye doesn't know where to go | Some structure, a few hierarchy issues | Eye follows a clear path top to bottom |\n| **Design** | Cluttered or too bare — looks unfinished | Decent but inconsistent fonts/colors | Clean, intentional, polished — looks complete |"
    },
    {
      id: "q-review-peer-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Peer Review Round 1 — Rate your partner's infographic on each criterion (1/2/3) and write one specific suggestion:\n\n- Headline: [score] — My suggestion:\n- Data: [score] — My suggestion:\n- Visual hierarchy: [score] — My suggestion:\n- Design: [score] — My suggestion:",
      placeholder: "Headline: ... My suggestion: ...\nData: ... My suggestion: ...\nVisual hierarchy: ... My suggestion: ...\nDesign: ... My suggestion: ...",
      difficulty: "evaluate"
    },
    {
      id: "q-review-peer-2",
      type: "question",
      questionType: "short_answer",
      prompt: "After your face-to-face conversation with your reviewer: What was the most useful piece of feedback you received? What will you change based on it?",
      placeholder: "Most useful feedback: ...\nI will change: ...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // REVISION TIME
    // ═══════════════════════════════════════════
    {
      id: "section-revision",
      type: "section_header",
      icon: "✏️",
      title: "Revision Time",
      subtitle: "~15 minutes"
    },
    {
      id: "b-revision-intro",
      type: "text",
      content: "Use the rest of class to apply feedback and polish your infographic.\n\n**Requirements before submitting:**\n- ✅ Specific headline (a claim, not a title)\n- ✅ At least 3 data points, each clearly visualized\n- ✅ Source credited somewhere on the infographic\n- ✅ Clear visual hierarchy — squint test passes\n- ✅ Exported as PNG and submitted to Google Classroom"
    },
    {
      id: "q-self-assess",
      type: "question",
      questionType: "short_answer",
      prompt: "Before submitting, do a final self-check. Score yourself on each criterion:\n\n- Headline (specific claim): [1/2/3]\n- Data (clear + sourced): [1/2/3]\n- Visual hierarchy (clear flow): [1/2/3]\n- Design (polished): [1/2/3]\n\nWhat's the one thing you'd still change if you had more time?",
      placeholder: "Headline: ...\nData: ...\nVisual hierarchy: ...\nDesign: ...\nIf I had more time: ...",
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
      content: "You finished your first real infographic — designed with a specific audience, a clear claim, and intentional visual choices.\n\nThe peer review process you used today (specific criteria, face-to-face discussion, required revisions) is exactly how professional designers work. Design rarely ships from a single person working alone.\n\n**Up next:** Lesson 27 — Thumbnails and Cover Art. You've been thinking about how content looks once someone's already reading it. Now you'll learn what gets them to click in the first place."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Looking at the infographic you submitted — which of the 5 components (headline, data, visuals, flow, source) do you think is strongest in yours? Which is weakest? Why?",
      placeholder: "Strongest: ... because ...\nWeakest: ... because ...",
      difficulty: "evaluate"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("content-creation-infographics-2")
      .set(lesson);
    console.log('✅ Lesson "Infographic Workshop + Peer Review" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/content-creation-infographics-2");
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
