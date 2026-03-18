// seed-diglit-portfolio-planning.js
// Creates "Portfolio Planning — Design Before You Code" (Dig Lit, Portfolio Capstone, Lesson 54)
// Run: node scripts/seed-diglit-portfolio-planning.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Portfolio Planning — Design Before You Code",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 54,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "📐",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "Every professional web designer does this before writing a single line of code: they *plan*.\n\nWhat goes on each page? What content does the portfolio need? What do they want someone to think after 30 seconds of looking?\n\nStudents who skip this step and jump straight to coding almost always have to rip out their work and start over. Students who plan first build faster and end up with better results.\n\nToday is planning day. You will not write any code. You will leave with everything you need to build confidently tomorrow."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If a stranger looked at your portfolio for 30 seconds — what would you want them to learn about you? What impression would you want to leave?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about everything you built, created, or produced in this class this year. Make a quick list — anything counts: spreadsheets, infographics, brand kits, pitch decks, content pieces, plans. Don't judge yet, just list.",
      placeholder: "Things I made this year:\n1. ...\n2. ...\n3. ...\n4. ...\n5. ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Select 4-6 best pieces of work from the year to showcase in the portfolio",
        "Create a site map showing the portfolio's page structure",
        "Write the headline, tagline, and bio that will appear on the portfolio",
        "Sketch a wireframe layout for each page"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "🗂️",
      title: "Building Your Portfolio Plan",
      subtitle: "~25 minutes"
    },
    {
      id: "b-portfolio-structure",
      type: "text",
      content: "**What a portfolio website needs**\n\nYour portfolio has four sections (all on one scrollable page, or four linked pages — your choice):\n\n1. **Home / Hero** — Your name, a tagline (1-2 sentences describing you), and optionally a photo\n2. **About** — Who you are, your interests, your skills (2-3 sentences — concise is better than long)\n3. **Work / Projects** — Your best 4-6 pieces. Each one needs: title, screenshot/image, and a 2-3 sentence description\n4. **Contact** — Your school email and any professional social links\n\n**Quality over quantity:** Four strong projects beat eight mediocre ones. Choose work that shows range — not four similar things.\n\n**Your options for projects:**\n- Unit 4 data project (spreadsheet, infographic, or analysis)\n- Unit 5 content creation piece (thumbnail, infographic, content plan)\n- Unit 6 business pitch or brand kit\n- Any HTML/CSS work from this unit\n- Anything else you built or designed this year that you're proud of"
    },
    {
      id: "b-writing-descriptions",
      type: "text",
      content: "**Writing project descriptions that don't sound like homework**\n\nThe formula: **[What I made] + [what skills I used] + [what it shows about me or what problem it solves]**\n\n**Bad:** \"This is my infographic. I made it in Canva for class.\"\n\n**Good:** \"I designed this infographic to visualize screen time patterns in a class of 200 students. I used a clear data hierarchy and color-coded sections to make complex statistics immediately readable.\"\n\nThe good version sounds professional. It tells a reader what you made, how, and why it matters. That's the standard for every project description in your portfolio.\n\n**Writing your bio:**\n- 2-3 sentences maximum\n- Who you are + what you're interested in + one skill or strength\n- Example: \"I'm a 9th grader at Perth Amboy High School with a strong interest in design and digital communication. This portfolio showcases work from my Digital Literacy course — including brand design, data analysis, and web development.\""
    },
    {
      id: "callout-wireframe",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Wireframing:** Sketch your layout on paper (or Google Docs) before you code. Use boxes and labels — don't draw art, just plan:\n\n`[ HEADER: Name + Nav (Home | About | Work | Contact) ]`\n`[ HERO: Big name, tagline, maybe photo ]`\n`[ PROJECT GRID: 3 boxes in a row ]`\n`[ ABOUT: Text block + skills ]`\n`[ CONTACT: Email + links ]`\n`[ FOOTER ]`\n\nPaper wireframes are fast. Professional designers still use pen and paper for this. Don't skip it."
    },
    {
      id: "q-content-selection",
      type: "question",
      questionType: "short_answer",
      prompt: "**Your project selection:**\n\nFrom your list in the warm-up, select your 4 BEST pieces to feature. For each one, answer:\n1. What is it? (1 sentence)\n2. What skills does it show? (list 2-3)\n3. What will you use as the screenshot/image?\n\nFormat:\nProject 1: [name] | Skills: ... | Screenshot: ...\nProject 2: ...\nProject 3: ...\nProject 4: ...",
      placeholder: "Project 1: ...\nProject 2: ...\nProject 3: ...\nProject 4: ...",
      difficulty: "analyze"
    },
    {
      id: "q-copywriting",
      type: "question",
      questionType: "short_answer",
      prompt: "**Write your portfolio copy now** — you'll paste this directly into your website:\n\n**Headline:** Your name (easy)\n**Tagline:** 1-2 sentences. Who are you, what does this portfolio show?\n**Bio (About section):** 2-3 sentences. Keep it professional but personal.\n**Skills list:** 3-5 things you're good at (design, data analysis, content creation, web coding, etc.)\n\nWrite all four here. This is the actual text that will appear on your site.",
      placeholder: "Headline: [Your Name]\nTagline: ...\nBio: ...\nSkills: ...",
      difficulty: "create"
    },
    {
      id: "q-project-descriptions",
      type: "question",
      questionType: "short_answer",
      prompt: "**Write descriptions for your 4 projects** using the formula: [What I made] + [skills used] + [what it shows].\n\nEach description should be 2-3 sentences. No \"I made this for class\" language.\n\nWrite all four here — you'll paste them directly into your portfolio.",
      placeholder: "Project 1: ...\n\nProject 2: ...\n\nProject 3: ...\n\nProject 4: ...",
      difficulty: "create"
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
      content: "If you completed the questions in this lesson, you have everything you need to build your portfolio:\n- Content selected and evaluated\n- All copy written (tagline, bio, project descriptions)\n- Skills listed\n- Layout planned\n\nThe next two lessons are pure building time. Your job is to translate what you planned here into working HTML and CSS.\n\n**Up next:** Lesson 55 — Portfolio Build. Bring everything from today and start building. You'll have time to build the structure (HTML), add styling (CSS), and upload your screenshots."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Describe your portfolio layout in one paragraph. What will someone see on your page, in what order, and what impression will they get? (Describe it like you're pitching it to someone who hasn't seen it.)",
      placeholder: "My portfolio will show...",
      difficulty: "plan"
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
        { term: "Portfolio", definition: "A curated collection of work samples that demonstrates a person's skills, experience, and creative range — used for job applications, college admissions, and professional self-presentation." },
        { term: "Wireframe", definition: "A rough sketch of a web page's layout — showing where elements will go without worrying about colors or design details. Used for planning before coding." },
        { term: "Site map", definition: "A diagram showing the structure of a website — which pages exist, what they contain, and how they connect to each other." },
        { term: "Tagline", definition: "A short, memorable phrase that communicates the core of your identity or brand — usually appears under your name on a portfolio's hero section." },
        { term: "Hero section", definition: "The first large visual area visitors see on a website — typically contains the headline, tagline, and a key image. Sets the tone for the entire site." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("portfolio-planning")
      .set(lesson);
    console.log('✅ Lesson "Portfolio Planning" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/portfolio-planning");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
