// seed-diglit-portfolio-showcase.js
// Creates "Portfolio Showcase + Course Wrap-Up" (Dig Lit, Portfolio Capstone, Lesson 56)
// Run: node scripts/seed-diglit-portfolio-showcase.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Portfolio Showcase + Course Wrap-Up",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 56,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎉",
      title: "Showcase Day",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Today you share what you built.\n\nYou learned to code a website. You curated a year's worth of work. You wrote your own professional bio and project descriptions. You deployed a portfolio that's real and accessible to anyone with the link.\n\nThat's not a class project. That's a professional artifact.\n\nPresentation format: 2-3 minutes per student. Show your portfolio live, walk through it, explain one design decision you made. Then: the class votes on awards. Then: you close out the course."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** You've spent a year becoming digitally literate. What does that actually mean to you now — at the end of the course?"
    },
    {
      id: "q-presentation-prep",
      type: "question",
      questionType: "short_answer",
      prompt: "**Prepare your 2-minute presentation.** Write a brief script or outline covering:\n1. Your name and one-sentence description of your portfolio\n2. Walk through 2-3 sections: what's in each one\n3. One design decision you made and why (color choice, layout, section order, etc.)\n4. Your favorite project — and why you chose to feature it\n\nYou won't read from this — just having it written helps you be confident.",
      placeholder: "Opening: ...\nSection walkthrough: ...\nDesign decision: ...\nFavorite project + why: ...",
      difficulty: "plan"
    },
    {
      id: "b-peer-eval",
      type: "text",
      content: "**Peer evaluation — while others present:**\n\nFor each presentation you watch, you'll submit a quick evaluation:\n- **Design quality (1-5):** Does it look polished and professional?\n- **Content quality (1-5):** Are the project descriptions strong? Is the about section real?\n- **One specific compliment:** Something you noticed that stood out\n- **One suggestion:** Something that would make it stronger\n\nThis feedback goes to the presenter. Be honest, be specific, be constructive.\n\n\"Good job!\" is not a compliment. \"The dark background with the teal accent color creates really strong contrast\" is a compliment."
    },

    {
      id: "section-awards",
      type: "section_header",
      icon: "🏆",
      title: "Class Awards",
      subtitle: "Voted by peers"
    },
    {
      id: "b-awards",
      type: "text",
      content: "**Portfolio Awards — voted by the class:**\n\n- **Best Design** — Cleanest, most polished portfolio. Looks like a real professional site.\n- **Best Content** — Strongest project descriptions and work samples. Every word earns its place.\n- **Most Creative** — Most unique or unexpected approach. Takes risks and wins.\n- **Best Presentation** — Most confident, clear, engaging delivery.\n- **Most Improved** — The student whose growth from the beginning of the year is most visible in their work.\n- **People's Choice** — The overall favorite. If you could only visit one portfolio, this one.\n\nYou can vote for yourself in one category. You must vote for someone else in the others."
    },
    {
      id: "q-award-votes",
      type: "question",
      questionType: "short_answer",
      prompt: "Cast your votes. For each category, write the name of the student you're voting for AND one sentence explaining why — be specific about what they did that earned your vote.",
      placeholder: "Best Design: [name] — because ...\nBest Content: [name] — because ...\nMost Creative: [name] — because ...\nBest Presentation: [name] — because ...\nMost Improved: [name] — because ...\nPeople's Choice: [name] — because ...",
      difficulty: "evaluate"
    },

    {
      id: "section-reflection",
      type: "section_header",
      icon: "🪞",
      title: "Year-End Reflection",
      subtitle: "The final written submission"
    },
    {
      id: "b-reflection-context",
      type: "text",
      content: "**Look how far you've come.**\n\nAt the start of this course, you were probably thinking about digital literacy as \"not clicking on phishing emails\" or \"using strong passwords.\"\n\nBy now, you've:\n- Analyzed how recommendation algorithms shape what you believe\n- Built a brand identity and pitched a business concept\n- Created content using visual design principles\n- Learned to code a website from scratch\n- Curated a portfolio of your own professional work\n\nThat's not \"digital literacy\" in the narrow sense. That's genuine digital fluency — the ability to create, analyze, and navigate digital systems as an informed participant.\n\nThe year-end reflection is your chance to articulate what you actually learned — not what you were supposed to learn, but what actually stuck."
    },
    {
      id: "q-reflection-1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Reflection Question 1:** What's one digital skill you learned this year that you'll actually use outside of school? Not the most impressive-sounding one — the one that will actually change how you do something.",
      placeholder: "The skill: ...\nHow I'll use it: ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflection-2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Reflection Question 2:** What project from this entire course are you most proud of — and why? What specifically makes you proud of it? What did you have to learn or work through to make it?",
      placeholder: "Project: ...\nWhy I'm proud: ...\nWhat I had to learn: ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflection-3",
      type: "question",
      questionType: "short_answer",
      prompt: "**Reflection Question 3:** How has your understanding of \"digital literacy\" changed since September? What did you think it meant then? What do you think it means now?",
      placeholder: "What I thought in September: ...\nWhat I think now: ...",
      difficulty: "reflect"
    },
    {
      id: "q-reflection-4",
      type: "question",
      questionType: "short_answer",
      prompt: "**Reflection Question 4:** If you could give one piece of advice to next year's incoming Digital Literacy class — something that would actually help them — what would it say?",
      placeholder: "My advice: ...",
      difficulty: "reflect"
    },

    {
      id: "section-pledge",
      type: "section_header",
      icon: "✊",
      title: "Digital Citizenship Pledge",
      subtitle: "Your commitment — in your own words"
    },
    {
      id: "b-pledge-context",
      type: "text",
      content: "You now have skills that most adults don't have. You understand how algorithms work. You know how to create content that goes viral. You know how to build websites. You know how to analyze information critically.\n\nThat comes with responsibility.\n\nWrite your own Digital Citizenship Pledge — **3-5 personal commitments** for how you'll use your digital skills going forward. These should be *your* words, based on what you actually learned. Not generic school-policy language. Not what you think you're supposed to say.\n\nExamples to inspire (don't copy these — write your own):\n- \"I will ask 'who benefits from this content?' before I share it\"\n- \"I will protect my followers' trust by being transparent when I'm promoting something\"\n- \"I will use my knowledge of algorithms to seek out perspectives I wouldn't naturally see\"\n- \"I will build things that help people, not just things that impress people\""
    },
    {
      id: "q-pledge",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your Digital Citizenship Pledge — 3-5 commitments, in your own words, based on what you actually learned this year.\n\nThese should be specific enough that you could look back in a year and know whether you kept them.",
      placeholder: "I commit to:\n1. ...\n2. ...\n3. ...\n4. ...\n5. ...",
      difficulty: "create"
    },

    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎓",
      title: "End of Course",
      subtitle: ""
    },
    {
      id: "b-close",
      type: "text",
      content: "You are digitally literate.\n\nNot because you took a class — because you built things. You analyzed things. You questioned things.\n\nThat's the difference.\n\nYour portfolio is yours to keep. Log back into CodePen any time — add new projects, update your bio, share it with college applications or jobs. It's a living document.\n\nTake care of it. It's evidence of what you can do.\n\n**Course complete.**"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("portfolio-showcase")
      .set(lesson);
    console.log('✅ Lesson "Portfolio Showcase + Course Wrap-Up" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/portfolio-showcase");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
