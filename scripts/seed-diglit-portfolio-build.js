// seed-diglit-portfolio-build.js
// Creates "Portfolio Build — HTML, CSS, Content, and Final Polish" (Dig Lit, Portfolio Capstone, Lesson 55)
// Run: node scripts/seed-diglit-portfolio-build.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Portfolio Build — HTML, CSS, Content, and Final Polish",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 55,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏗️",
      title: "Build Time",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "You have your plan. You have your content. You have your CSS skills.\n\nNow you build.\n\nThis lesson is your complete guide for the portfolio build process — covering everything from the initial HTML skeleton to final polish. Work through it at your own pace. Your goal by the end of build time: a complete, styled, responsive portfolio that's ready to present.\n\nUse the content you wrote in Lesson 54. Don't start from scratch — you already did the hard thinking."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Your goal today:** A complete portfolio with all 4 sections, real content, CSS styling, and at least one working media query. Not perfect — complete."
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Build Milestones",
      items: [
        "Phase 1: Complete HTML skeleton with real content in all 4 sections",
        "Phase 2: CSS styling applied — color scheme, typography, Flexbox nav",
        "Phase 3: Project screenshots uploaded and descriptions pasted in",
        "Phase 4: Responsive design — test on mobile, fix what breaks"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "⚡",
      title: "Phase 1: Build the HTML Structure",
      subtitle: "HTML first — style later"
    },
    {
      id: "b-html-skeleton",
      type: "text",
      content: "**Start with this skeleton in CodePen. Paste it in, then replace everything with your real content.**\n\n```html\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <title>Your Name — Portfolio</title>\n</head>\n<body>\n\n  <!-- Navigation -->\n  <nav>\n    <a href=\"#home\">Home</a>\n    <a href=\"#about\">About</a>\n    <a href=\"#work\">Work</a>\n    <a href=\"#contact\">Contact</a>\n  </nav>\n\n  <!-- Hero Section -->\n  <section id=\"home\">\n    <h1>Your Name</h1>\n    <p>Your tagline — paste from Lesson 54</p>\n  </section>\n\n  <!-- About Section -->\n  <section id=\"about\">\n    <h2>About Me</h2>\n    <p>Paste your bio from Lesson 54</p>\n    <ul>\n      <li>Skill 1</li>\n      <li>Skill 2</li>\n      <li>Skill 3</li>\n    </ul>\n  </section>\n\n  <!-- Work Section -->\n  <section id=\"work\">\n    <h2>My Work</h2>\n\n    <div class=\"project\">\n      <img src=\"YOUR_SCREENSHOT_URL\" alt=\"Project 1\">\n      <h3>Project Title</h3>\n      <p>Paste description from Lesson 54</p>\n    </div>\n\n    <!-- Duplicate project div for each project -->\n\n  </section>\n\n  <!-- Contact Section -->\n  <section id=\"contact\">\n    <h2>Get in Touch</h2>\n    <p>Email: your@email.com</p>\n  </section>\n\n  <footer>\n    <p>Built by Your Name — 2026</p>\n  </footer>\n\n</body>\n</html>\n```\n\n**Milestone 1 check:** Before moving to CSS, make sure:\n- All 4 sections exist with real content\n- All 4 projects are in the Work section\n- Your name, tagline, and bio are pasted from your planning doc\n- No placeholder text remains"
    },
    {
      id: "q-phase1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Phase 1 checkpoint:** Paste your CodePen URL here once you have all 4 sections built with real content. Rate your HTML completion: what's done? What's still placeholder?",
      placeholder: "CodePen URL: ...\nSections complete: ...\nStill needs work: ...",
      difficulty: "apply"
    },

    {
      id: "section-phase2",
      type: "section_header",
      icon: "🎨",
      title: "Phase 2: Add CSS Styling",
      subtitle: "Color, fonts, layout"
    },
    {
      id: "b-css-starter",
      type: "text",
      content: "**Add this CSS starter to CodePen's CSS panel. Then customize it with YOUR colors and fonts.**\n\n```css\n/* Reset */\n* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: Arial, sans-serif; line-height: 1.6; }\n\n/* Navigation */\nnav {\n  display: flex;\n  justify-content: center;\n  gap: 30px;\n  padding: 20px;\n  background: #1a1a2e;       /* <- Change this color */\n}\nnav a {\n  color: white;\n  text-decoration: none;\n  font-weight: bold;\n}\n\n/* Sections */\nsection {\n  padding: 60px 20px;\n  max-width: 900px;\n  margin: 0 auto;\n}\n\n/* Hero */\n#home {\n  text-align: center;\n  background: #f5f5f5;       /* <- Change this */\n  max-width: 100%;\n  padding: 100px 20px;\n}\n#home h1 { font-size: 48px; }\n\n/* Work projects */\n.project {\n  margin-bottom: 30px;\n  padding: 20px;\n  border: 1px solid #eee;\n  border-radius: 8px;\n}\n.project img {\n  max-width: 100%;\n  border-radius: 4px;\n  margin-bottom: 10px;\n}\n\n/* Footer */\nfooter {\n  text-align: center;\n  padding: 20px;\n  background: #f5f5f5;\n}\n```\n\n**Customize:**\n1. Change the background colors to your brand palette from Lesson 54\n2. Add `font-family` to use fonts that match your aesthetic\n3. Change nav background to your accent color\n4. Adjust padding/font-sizes to your taste\n\nGoal: when you look at it, it should feel like *yours*."
    },
    {
      id: "q-phase2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Phase 2 checkpoint:** Describe the visual design of your styled portfolio. What colors did you choose and why? Does it match the brand identity you built in Unit 6?",
      placeholder: "Colors used: ...\nWhy: ...\nBrand connection: ...",
      difficulty: "analyze"
    },

    {
      id: "section-phase3",
      type: "section_header",
      icon: "📸",
      title: "Phase 3: Screenshots and Content Polish",
      subtitle: "Real images, real content"
    },
    {
      id: "b-screenshots",
      type: "text",
      content: "**Getting screenshots of your work**\n\n1. Open the project file (Google Classroom submission, Canva, etc.)\n2. Take a clean screenshot:\n   - Chromebook: Press `Ctrl + Shift + Show Windows`, then drag to select your area\n   - OR use Snipping Tool / Grab / any screen capture tool\n3. Crop it clean — no browser chrome, taskbar, or desktop visible. Just the work.\n4. **Upload to an image host:**\n   - **Google Drive** — upload, right-click → \"Get link\" → change to \"Anyone with link\" → use that URL\n   - **imgur.com** — drag and drop, copy the direct link\n   - In CodePen, paste the URL into your `<img src=\"...\">` tag\n5. Test that the image loads. If it shows a broken image icon, the URL isn't a direct image link — try imgur instead.\n\n**Content checklist:**\n- [ ] 4 projects with descriptions pasted from Lesson 54\n- [ ] Clean screenshot for each project\n- [ ] Bio and skills in the About section\n- [ ] Contact email is correct\n- [ ] No \"Lorem ipsum\" or \"Your name here\" placeholder text anywhere\n- [ ] Everything proofread (spelling, grammar, capitalization)"
    },
    {
      id: "q-phase3",
      type: "question",
      questionType: "short_answer",
      prompt: "**Phase 3 checkpoint:** How many of your 4 projects have both a screenshot AND a written description? Which one gives you the most trouble to capture? Why?",
      placeholder: "Projects with screenshots + descriptions: ...\nThe one giving me trouble: ...\nWhy: ...",
      difficulty: "apply"
    },

    {
      id: "section-phase4",
      type: "section_header",
      icon: "📱",
      title: "Phase 4: Responsive Design",
      subtitle: "Make it work on mobile"
    },
    {
      id: "b-responsive",
      type: "text",
      content: "**Making your portfolio work on phones**\n\nMore than 60% of web traffic is on mobile. If your portfolio breaks on a phone, you're excluding most viewers.\n\nTest it now: in CodePen, drag the right edge of the preview window to make it phone-width (~375px). Watch what breaks.\n\n**The 3 things that usually break:**\n1. Navigation — horizontal nav doesn't fit. Need to stack it.\n2. Font sizes — huge desktop headings are too big.\n3. Images — they overflow the screen.\n\n**The fix — add this media query at the bottom of your CSS:**\n```css\n/* Mobile styles - applies when screen is 600px or narrower */\n@media (max-width: 600px) {\n  nav {\n    flex-direction: column;\n    align-items: center;\n    gap: 10px;\n  }\n  #home h1 { font-size: 28px; }\n  section { padding: 30px 15px; }\n  .project img { max-width: 100%; }\n}\n\n/* This rule belongs OUTSIDE the media query — applies everywhere */\nimg { max-width: 100%; height: auto; }\n```\n\n**Final quality checklist:**\n- [ ] Nav works on mobile (stacked, not overflowing)\n- [ ] Headings are readable on small screens\n- [ ] Images don't overflow\n- [ ] All links work\n- [ ] All images load\n- [ ] Consistent styling throughout\n- [ ] Footer has your name and year\n- [ ] Spelling/grammar correct throughout"
    },
    {
      id: "q-final",
      type: "question",
      questionType: "short_answer",
      prompt: "**Final checkpoint:** Your portfolio is ready for submission. Paste your final CodePen URL here.\n\nSelf-evaluate on 4 criteria (1-5 scale):\n- Design quality (color, typography, visual hierarchy)\n- Content quality (descriptions, screenshots, bio)\n- Technical quality (valid HTML, CSS working, no broken elements)\n- Mobile responsiveness\n\nBe honest — this is for your own awareness.",
      placeholder: "Final CodePen URL: ...\nDesign quality: /5 — why: ...\nContent quality: /5 — why: ...\nTechnical quality: /5 — why: ...\nMobile responsive: /5 — why: ...",
      difficulty: "evaluate"
    },

    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Submission",
      subtitle: ""
    },
    {
      id: "b-summary",
      type: "text",
      content: "Submit your final CodePen URL to Google Classroom.\n\nThis is the portfolio you'll present. Whatever state it's in at submission — that's what gets shared. Put in the effort now.\n\n**Up next:** Lesson 56 — Portfolio Presentations + Course Wrap-Up. You'll present your portfolio to the class, see what everyone built, and close out the course."
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("portfolio-build")
      .set(lesson);
    console.log('✅ Lesson "Portfolio Build" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/portfolio-build");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
