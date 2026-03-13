// seed-dl-unit7-portfolio-capstone.js
// Digital Literacy — Unit 7: Portfolio Capstone (Lessons 42-55)
// Run: node scripts/seed-dl-unit7-portfolio-capstone.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ═══════════════════════════════════════════════════════════════
// LESSON 42: How the Internet Actually Works
// ═══════════════════════════════════════════════════════════════

const lesson42 = {
  title: "How the Internet Actually Works",
  questionOfTheDay: "When you type a website URL and press Enter — what actually happens in those 2 seconds before the page loads?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 41,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🌐",
      title: "How the Internet Actually Works",
      subtitle: "What happens when you visit a website",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain the basic client-server model in plain language",
        "Describe what happens when you type a URL into a browser",
        "Identify the role of HTML, CSS, and JavaScript in building websites",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**The restaurant analogy:**\n- **You (browser)** = the customer\n- **The URL** = the address of the restaurant\n- **DNS** = the GPS that turns the address into directions\n- **The server** = the kitchen\n- **HTML** = the food (the actual content)\n- **CSS** = the plating and presentation (how it looks)\n- **JavaScript** = the waiter who makes things interactive\n\n**What happens when you type google.com:**\n1. Browser asks DNS: \"Where is google.com?\" → gets an IP address\n2. Browser sends a request to that server: \"Give me your homepage\"\n3. Server sends back HTML, CSS, and JavaScript files\n4. Browser reads those files and renders the page you see",
    },
    {
      id: uid(), type: "definition",
      term: "HTML (HyperText Markup Language)",
      definition: "The structure of a web page — headings, paragraphs, images, links. The bones of every website.",
    },
    {
      id: uid(), type: "definition",
      term: "CSS (Cascading Style Sheets)",
      definition: "The style of a web page — colors, fonts, layout, spacing. The skin and clothing of every website.",
    },
    {
      id: uid(), type: "definition",
      term: "JavaScript",
      definition: "The behavior of a web page — clicks, animations, forms, interactive features. The muscles of every website.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "Which web language controls how a website LOOKS (colors, fonts, layout)?",
      options: [
        "HTML — it structures everything",
        "CSS — it styles the visual presentation",
        "JavaScript — it makes things interactive",
        "URL — it determines the design",
      ],
      correctIndex: 1,
      explanation: "CSS (Cascading Style Sheets) controls all visual presentation: colors, fonts, spacing, layout, and responsive design. HTML provides the structure (what's on the page), and CSS makes it look good. You can change the entire look of a website just by changing its CSS.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔍",
      title: "View Source Exploration",
      subtitle: "Look under the hood of real websites",
    },
    {
      id: uid(), type: "activity",
      icon: "🔍",
      title: "Website Scavenger Hunt",
      instructions: "Right-click on any website → \"View Page Source\" (or Ctrl+U).\n\nFor 3 different websites, find:\n1. An `<h1>` tag (heading)\n2. A `<p>` tag (paragraph)\n3. An `<img>` tag (image)\n4. Something that looks like CSS (colors, fonts)\n\nYou don't need to understand all of it — just look for the tags mentioned above.",
    },
    {
      id: "q-scavenger", type: "question",
      questionType: "short_answer",
      prompt: "Which website did you find most interesting to explore? What surprised you about the code behind it?",
    },
    {
      id: "q-exit", type: "question",
      questionType: "short_answer",
      prompt: "Exit ticket: In your own words, explain the difference between HTML and CSS. Use an analogy (like the restaurant one, or make up your own).",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 43: HTML Basics — Your First Web Page
// ═══════════════════════════════════════════════════════════════

const lesson43 = {
  title: "HTML Basics — Your First Web Page",
  questionOfTheDay: "What if you could build a web page from scratch with nothing but a text editor?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 42,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🏗️",
      title: "HTML Basics",
      subtitle: "Your First Web Page",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Write a basic HTML document with proper structure (doctype, html, head, body)",
        "Use heading, paragraph, image, and link tags",
        "Preview HTML in a browser",
      ],
    },
    {
      id: uid(), type: "text",
      content: "Every website starts with these 5 lines:\n\n```\n<!DOCTYPE html>\n<html>\n<head><title>My Page</title></head>\n<body><h1>Hello World</h1></body>\n</html>\n```\n\nThat's it. That's a real web page.\n\n**Essential tags (today's toolkit):**\n\n| Tag | What it does | Example |\n|---|---|---|\n| `<h1>` to `<h6>` | Headings (h1 = biggest) | `<h1>My Name</h1>` |\n| `<p>` | Paragraph | `<p>I am a student.</p>` |\n| `<img>` | Image | `<img src=\"url\" alt=\"description\">` |\n| `<a>` | Link | `<a href=\"url\">Click here</a>` |\n| `<ul>` + `<li>` | Bullet list | `<ul><li>Item 1</li></ul>` |\n\n**Key concept:** Tags come in pairs — open `<p>` and close `</p>`. A few are self-closing (`<img>`, `<br>`).",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "Which HTML tag creates a clickable link to another website?",
      options: [
        "<link>",
        "<a>",
        "<url>",
        "<click>",
      ],
      correctIndex: 1,
      explanation: "The <a> (anchor) tag creates hyperlinks. The format is: <a href=\"https://example.com\">Click me</a>. The href attribute specifies where the link goes, and the text between the tags is what the user sees and clicks.",
    },

    {
      id: uid(), type: "section_header",
      icon: "💻",
      title: "Code-Along: About Me Page",
      subtitle: "Build it together on CodePen",
    },
    {
      id: uid(), type: "callout",
      icon: "🌐", style: "action",
      content: "**Go to:** [codepen.io](https://codepen.io) → Click \"Start Coding\" (or sign in to save your work)\n\nFollow along as we build an About Me page together.",
    },
    {
      id: uid(), type: "activity",
      icon: "💻",
      title: "Build Your About Me Page",
      instructions: "Create a page in CodePen with:\n\n✅ At least 2 headings (h1 for your name, h2 for sections)\n✅ At least 2 paragraphs about yourself\n✅ At least 1 image (use https://picsum.photos/300/200 as a placeholder)\n✅ At least 1 link to your favorite website\n✅ At least 1 bullet list (hobbies, favorites, etc.)\n\nThis is NOT your portfolio yet — it's practice. Experiment and have fun!",
    },
    {
      id: "q-page", type: "question",
      questionType: "short_answer",
      prompt: "Share your CodePen URL. What was the hardest HTML tag to get right? What did you learn from the code-along?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 44: CSS Basics — Making It Not Ugly
// ═══════════════════════════════════════════════════════════════

const lesson44 = {
  title: "CSS Basics — Making It Not Ugly",
  questionOfTheDay: "HTML without CSS is like a house with no paint, no furniture, and no lights. What's the minimum CSS needed to make a page look decent?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 43,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎨",
      title: "CSS Basics",
      subtitle: "Making It Not Ugly",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Write basic CSS rules to change colors, fonts, and spacing",
        "Understand the selector-property-value syntax",
        "Apply CSS to the About Me page from Lesson 43",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**CSS syntax — the formula:**\n```\nselector {\n  property: value;\n}\n```\n\nExample: `h1 { color: navy; font-size: 36px; }` = \"Find every h1, make it navy blue and 36px.\"\n\n**Today's CSS toolkit:**\n\n| Property | What it does | Example values |\n|---|---|---|\n| `color` | Text color | `red`, `#2563eb` |\n| `background-color` | Background | `#f0f0f0`, `white` |\n| `font-family` | Font | `Arial`, `Georgia` |\n| `font-size` | Text size | `16px`, `24px` |\n| `text-align` | Alignment | `center`, `left` |\n| `padding` | Space INSIDE | `20px` |\n| `margin` | Space OUTSIDE | `20px`, `auto` |\n| `border` | Border line | `2px solid black` |",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "What does `margin: auto` do when applied to a block element with a set width?",
      options: [
        "Removes all margins",
        "Centers the element horizontally",
        "Makes the margins adjust to the screen size automatically",
        "Adds a default margin of 10px",
      ],
      correctIndex: 1,
      explanation: "When a block element has a set width, margin: auto distributes the remaining horizontal space equally on both sides, effectively centering the element. This is one of the most common CSS centering techniques.",
    },

    {
      id: uid(), type: "section_header",
      icon: "💻",
      title: "Style Your About Me Page",
      subtitle: "Apply CSS to yesterday's HTML",
    },
    {
      id: uid(), type: "activity",
      icon: "🎨",
      title: "Style Your About Me Page",
      instructions: "Add CSS to your CodePen project from yesterday. Requirements:\n\n✅ Custom background color\n✅ At least 2 different font sizes\n✅ Text color that contrasts well with background (readability!)\n✅ Padding or margin on at least 2 elements\n✅ At least one border or background-color on a specific element\n\n**Challenge:** Make it look like a real website, not a Word document.\n\n**Common bug:** If your CSS isn't working, check for missing semicolons!",
    },
    {
      id: "q-css", type: "question",
      questionType: "short_answer",
      prompt: "What 3 CSS properties made the biggest visual difference to your page? Describe the before vs. after.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 45: Layout with CSS — Flexbox Crash Course
// ═══════════════════════════════════════════════════════════════

const lesson45 = {
  title: "Layout with CSS — Flexbox Crash Course",
  questionOfTheDay: "Why is getting things to line up side-by-side the single hardest thing in CSS?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 44,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "📐",
      title: "Flexbox Crash Course",
      subtitle: "Layout with CSS",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why layout is the hardest part of CSS and how Flexbox simplifies it",
        "Use Flexbox to create horizontal and vertical layouts",
        "Build a navigation bar with proper alignment",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Flexbox in 3 concepts:**\n\n1. **Container + Items.** The parent element gets `display: flex`. Its children automatically line up.\n```\n.container { display: flex; }\n```\n\n2. **Direction.** `flex-direction: row` = side by side. `flex-direction: column` = stacked.\n\n3. **Alignment.**\n- `justify-content` = horizontal alignment (center, space-between, space-around)\n- `align-items` = vertical alignment (center, flex-start, flex-end)\n\nThis is 90% of what you need for layout.",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "To make 3 items sit side-by-side with equal space between them, which CSS should the parent element have?",
      options: [
        "display: flex; justify-content: space-between;",
        "display: block; text-align: center;",
        "display: flex; flex-direction: column;",
        "display: inline; margin: auto;",
      ],
      correctIndex: 0,
      explanation: "display: flex makes the children line up in a row (default direction). justify-content: space-between distributes them with equal space between each item, pushing the first to the left edge and the last to the right edge.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🐸",
      title: "Flexbox Froggy",
      subtitle: "Learn by playing",
    },
    {
      id: uid(), type: "callout",
      icon: "🎮", style: "action",
      content: "**Go to:** [flexboxfroggy.com](https://flexboxfroggy.com)\n\nComplete levels 1-13. This gamified tutorial teaches Flexbox through puzzles. Screenshot your progress!",
    },
    {
      id: "q-froggy", type: "question",
      questionType: "short_answer",
      prompt: "What level did you reach in Flexbox Froggy? Which Flexbox property was hardest to understand? Which was easiest?",
    },

    {
      id: uid(), type: "section_header",
      icon: "🧭",
      title: "Build a Nav Bar",
      subtitle: "Your first Flexbox layout",
    },
    {
      id: uid(), type: "activity",
      icon: "🧭",
      title: "Build a Navigation Bar",
      instructions: "In CodePen, create a navigation bar:\n\n**HTML:**\n```\n<nav>\n  <a href=\"#\">Home</a>\n  <a href=\"#\">About</a>\n  <a href=\"#\">Portfolio</a>\n  <a href=\"#\">Contact</a>\n</nav>\n```\n\n**Style it with Flexbox:**\n- Links side by side (horizontal)\n- Evenly spaced\n- Background color\n- Bonus: hover effect on the links\n\nSave this — you'll use it in your portfolio.",
    },
    {
      id: "q-nav", type: "question",
      questionType: "short_answer",
      prompt: "Share your CodePen URL with the nav bar. What Flexbox properties did you use?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 46: Portfolio Planning
// ═══════════════════════════════════════════════════════════════

const lesson46 = {
  title: "Portfolio Planning — What Goes in It?",
  questionOfTheDay: "If a stranger looked at your portfolio for 30 seconds — what would they learn about you?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 45,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "📋",
      title: "Portfolio Planning",
      subtitle: "What Goes in It?",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the purpose and audience for a personal portfolio",
        "Select their best work from the year to showcase",
        "Create a sitemap and wireframe for their portfolio website",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**What goes in a portfolio:**\n\n1. **Home section** — Your name, a tagline, a hero image. First impression.\n2. **About section** — Who you are (short bio), your skills, interests.\n3. **Work/Projects section** — Your best stuff. Quality over quantity. 4-6 pieces max.\n4. **Contact section** — How to reach you (school email, social links).\n\n**Selecting work to showcase.** Pick from your year's work:\n- Data project (Unit 4 — spreadsheets/infographic)\n- Content creation piece (Unit 5)\n- Business pitch or brand identity (Unit 6)\n- Anything else you're proud of\n\n**Selection criteria:** Pick things that show RANGE (not 4 of the same type) and QUALITY (your best, not your easiest).",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "How many projects should you typically include in a portfolio?",
      options: [
        "1-2 — keep it minimal",
        "4-6 — enough to show range but curated for quality",
        "10+ — include everything you've ever made",
        "It doesn't matter — just pick randomly",
      ],
      correctIndex: 1,
      explanation: "4-6 projects is the sweet spot. Fewer than that doesn't show enough range. More than that dilutes quality — a portfolio with 15 mediocre projects is weaker than one with 5 excellent ones. Curate ruthlessly: only your best work makes the cut.",
    },

    {
      id: uid(), type: "section_header",
      icon: "✏️",
      title: "Wireframing",
      subtitle: "Sketch before you code",
    },
    {
      id: uid(), type: "activity",
      icon: "✏️",
      title: "Plan Your Portfolio",
      instructions: "Complete these on paper (pen and paper, NOT digital):\n\n1. **Content inventory** — List every piece of work from this year that COULD go in the portfolio. Star the 4-6 best ones.\n\n2. **Sitemap** — Draw the page structure (Home → About, Work, Contact)\n\n3. **Wireframes** — Sketch the layout for each section (rough boxes and lines, not art)\n\n4. **Copy draft** — Write the headline and tagline for your home section, and your bio for the About section (2-3 sentences max)\n\n**Partner review when done:** Swap wireframes. \"Does this make sense? Can you tell what goes where?\"",
    },
    {
      id: "q-inventory", type: "question",
      questionType: "short_answer",
      prompt: "List the 4-6 projects you're including in your portfolio. For each one, write one sentence about why you chose it (what skill or quality does it showcase?).",
    },
    {
      id: "q-tagline", type: "question",
      questionType: "short_answer",
      prompt: "Write your portfolio headline (your name + tagline) and your About Me bio (2-3 sentences max). Keep it concise and professional.",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 47: Portfolio Build Day 1 — HTML Structure
// ═══════════════════════════════════════════════════════════════

const lesson47 = {
  title: "Portfolio Build Day 1 — HTML Structure",
  questionOfTheDay: "Why do professional developers write all the HTML first before touching any CSS?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 46,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🏗️",
      title: "Build Day 1",
      subtitle: "HTML Structure — Get All Content On the Page",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Set up the HTML structure for a multi-section portfolio page",
        "Implement semantic HTML sections (header, main, footer)",
        "Add real content from the planning worksheet",
      ],
    },
    {
      id: uid(), type: "callout",
      icon: "⚠️", style: "highlight",
      content: "**Today's rule: HTML only.** Get ALL your content on the page. Don't touch CSS yet. It'll be ugly. That's fine. Structure first, style later.",
    },
    {
      id: uid(), type: "text",
      content: "**Portfolio HTML skeleton:**\n\n```\n<nav>\n  <a href=\"#home\">Home</a>\n  <a href=\"#about\">About</a>\n  <a href=\"#work\">Work</a>\n  <a href=\"#contact\">Contact</a>\n</nav>\n\n<section id=\"home\">\n  <h1>Your Name</h1>\n  <p>Your tagline</p>\n</section>\n\n<section id=\"about\">\n  <h2>About Me</h2>\n  <p>Your bio here</p>\n</section>\n\n<section id=\"work\">\n  <h2>My Work</h2>\n  <div class=\"project\">\n    <h3>Project Title</h3>\n    <p>Description</p>\n    <img src=\"screenshot-url\" alt=\"Project screenshot\">\n  </div>\n</section>\n\n<section id=\"contact\">\n  <h2>Get in Touch</h2>\n  <p>Email: you@school.edu</p>\n</section>\n\n<footer>\n  <p>Built by [Name] — 2026</p>\n</footer>\n```\n\nNew tags: `<section>`, `<nav>`, `<footer>` — these are semantic tags. They tell the browser what each part IS.",
    },
    {
      id: uid(), type: "activity",
      icon: "🏗️",
      title: "Build Your Portfolio HTML",
      instructions: "Using your wireframe from Lesson 46, build the full HTML:\n\n1. Set up the skeleton with nav, sections, and footer\n2. Add your name, tagline, and bio (from planning)\n3. Add at least 3 project entries with titles and descriptions\n4. Add project images (use placeholder images for now if needed: picsum.photos)\n5. Add contact info and footer\n\n**Milestone checks:**\n- By minute 10: skeleton + nav + home section\n- By minute 20: about + at least 2 projects\n- By minute 25: contact + footer",
    },
    {
      id: "q-progress", type: "question",
      questionType: "short_answer",
      prompt: "How many sections do you have with real content? Share your CodePen URL. What still needs to be added?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 48: Portfolio Build Day 2 — CSS Style
// ═══════════════════════════════════════════════════════════════

const lesson48 = {
  title: "Portfolio Build Day 2 — CSS Style",
  questionOfTheDay: "What's the minimum amount of CSS needed to make a plain HTML page look professional?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 47,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎨",
      title: "Build Day 2",
      subtitle: "CSS Style — Give It Personality",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Apply a cohesive color scheme and typography to their portfolio",
        "Use Flexbox for layout (nav bar, project grid)",
        "Create visual hierarchy that guides the viewer through the portfolio",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Essential CSS for a portfolio (starter code):**\n\n```\n/* Reset and base */\n* { margin: 0; padding: 0; box-sizing: border-box; }\nbody { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }\n\n/* Navigation */\nnav { display: flex; justify-content: center; gap: 30px; padding: 20px; background: #1a1a2e; }\nnav a { color: white; text-decoration: none; font-weight: bold; }\n\n/* Sections */\nsection { padding: 60px 20px; max-width: 900px; margin: 0 auto; }\n\n/* Home hero */\n#home { text-align: center; padding: 100px 20px; }\n#home h1 { font-size: 48px; }\n\n/* Projects */\n.project { margin-bottom: 30px; padding: 20px; border: 1px solid #eee; border-radius: 8px; }\n.project img { max-width: 100%; border-radius: 4px; }\n\n/* Footer */\nfooter { text-align: center; padding: 20px; background: #f5f5f5; }\n```\n\nThat's ~20 lines. Use this as a starting point, then customize with your brand colors.",
    },
    {
      id: uid(), type: "activity",
      icon: "🎨",
      title: "Style Your Portfolio",
      instructions: "Apply CSS using your brand colors (from Unit 6) or a new palette. Requirements:\n\n✅ Custom color scheme (background, text, accents)\n✅ Nav bar styled with Flexbox\n✅ Consistent typography (max 2 fonts)\n✅ Sections have clear spacing\n✅ Images sized properly (not overflowing or stretched)\n✅ Visual hierarchy: h1 > h2 > h3 in size\n\n**Self-check before end of class:**\n- Can I read the text easily? (contrast)\n- Does the nav look like a nav?\n- Is there enough white space?\n- Does it look like a real website?",
    },
    {
      id: "q-style", type: "question",
      questionType: "short_answer",
      prompt: "What color scheme did you choose and why? Which CSS property made the biggest visual difference?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 49: Portfolio Build Day 3 — Content Polish
// ═══════════════════════════════════════════════════════════════

const lesson49 = {
  title: "Portfolio Build Day 3 — Content Polish",
  questionOfTheDay: "What's the difference between 'I made a spreadsheet' and 'I analyzed 500 data points to uncover patterns in student screen time'?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 48,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "✨",
      title: "Build Day 3",
      subtitle: "Content Polish — Write Like a Pro",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Write concise, compelling project descriptions that highlight process and skills",
        "Add proper screenshots/images of actual work",
        "Ensure all portfolio content is complete and accurate",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Writing project descriptions that don't sound like homework:**\n\nFormula: **[What I made] + [what skills I used] + [what it shows]**\n\nExamples:\n- \"Built a revenue model using Google Sheets to project monthly income for a digital business concept. Applied formula-based calculations and data visualization.\"\n- \"Created a brand identity kit including logo, color palette, and brand voice guidelines for a niche fitness content business.\"\n\n**NOT:** \"This is my infographic. I made it in Canva for class.\"\n\n**Screenshots:** Take clean screenshots of your actual work. Crop them — no browser chrome, no desktop visible.",
    },
    {
      id: uid(), type: "activity",
      icon: "✨",
      title: "Content Completion Sprint",
      instructions: "Finalize ALL portfolio content:\n\n1. **Project descriptions** — Rewrite every entry using the formula\n2. **Screenshots** — Take clean screenshots, add to portfolio\n3. **About section** — Polish the bio, add 2-3 skills\n4. **Contact section** — Verify email and links\n5. **Proofread** — Spelling, grammar, capitalization\n\n**Completeness check at end of class:**\n- All projects have descriptions AND screenshots? ✓/✗\n- About section written and polished? ✓/✗\n- Contact info correct? ✓/✗\n- Everything proofread? ✓/✗",
    },
    {
      id: "q-descriptions", type: "question",
      questionType: "short_answer",
      prompt: "Write your best project description using the formula: [What I made] + [what skills I used] + [what it shows]. Which project is it for?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 50: Portfolio Build Day 4 — Responsive + Final Polish
// ═══════════════════════════════════════════════════════════════

const lesson50 = {
  title: "Portfolio Build Day 4 — Responsive Design + Final Polish",
  questionOfTheDay: "More than half of all web traffic is on phones. If your portfolio doesn't work on mobile, who are you building it for?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 49,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "📱",
      title: "Build Day 4",
      subtitle: "Responsive Design + Final Polish",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain why websites must work on both desktop and mobile",
        "Add basic responsive CSS using media queries",
        "Conduct a final quality review of their portfolio",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Media queries — make your site work on phones:**\n\n```\n@media (max-width: 600px) {\n  nav {\n    flex-direction: column;\n    gap: 10px;\n  }\n  #home h1 {\n    font-size: 28px;\n  }\n  section {\n    padding: 30px 15px;\n  }\n}\n```\n\nTranslation: \"If the screen is small, stack the nav, shrink headings, reduce padding.\"\n\n**3 things that usually break on mobile:**\n1. Navigation — stack it vertically\n2. Font sizes — desktop headings are too big\n3. Images — always use `img { max-width: 100%; height: auto; }`",
    },
    {
      id: uid(), type: "question",
      questionType: "multiple_choice",
      prompt: "What does `@media (max-width: 600px)` mean in CSS?",
      options: [
        "Apply these styles to screens wider than 600px",
        "Apply these styles to screens 600px wide or smaller",
        "Apply these styles to all screens",
        "Apply these styles only to tablets",
      ],
      correctIndex: 1,
      explanation: "@media (max-width: 600px) means 'if the screen width is 600 pixels or less, apply these styles.' This is how you write CSS that only activates on small screens (phones). The styles inside override the default desktop styles.",
    },
    {
      id: uid(), type: "activity",
      icon: "📱",
      title: "Final Polish Checklist",
      instructions: "Work through this checklist:\n\n**Responsive:**\n☐ Nav works on mobile (stacked)\n☐ Text is readable on small screens\n☐ Images don't overflow\n\n**Quality:**\n☐ All spelling/grammar correct\n☐ All links work\n☐ All images load\n☐ Color contrast is good\n☐ Consistent styling throughout\n\n**Professional:**\n☐ No placeholder text remaining\n☐ Screenshots are clean and cropped\n☐ Footer has your name and year\n\n**Test it:** Resize your browser window to phone-width. Does everything still look good?",
    },
    {
      id: "q-responsive", type: "question",
      questionType: "short_answer",
      prompt: "What broke when you first resized to mobile? How did you fix it? What CSS did you add?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 51: Portfolio Build Day 5 — Help Day
// ═══════════════════════════════════════════════════════════════

const lesson51 = {
  title: "Portfolio Build Day 5 — Overflow / Help Day",
  questionOfTheDay: "What's the one thing about your portfolio that still bugs you — and can you fix it today?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 50,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🛟",
      title: "Build Day 5",
      subtitle: "Overflow / Help Day",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Resolve remaining technical issues with their portfolio",
        "Ensure portfolio meets all requirements before presentation",
        "Support classmates who need help",
      ],
    },
    {
      id: uid(), type: "callout",
      icon: "⚠️", style: "highlight",
      content: "**Last build day.** Whatever state your portfolio is in at the end of class — that's what gets presented. Use every minute.",
    },
    {
      id: uid(), type: "text",
      content: "**Help stations are set up in the room:**\n- **Station 1: HTML issues** — Missing content, broken structure\n- **Station 2: CSS issues** — Layout problems, styling not working\n- **Station 3: Content issues** — Descriptions, images, proofreading\n\nStudents who finish early become station helpers.",
    },
    {
      id: uid(), type: "activity",
      icon: "🛠️",
      title: "Final Work Time",
      instructions: "Open work time (30 min). Focus on your biggest gap:\n\n- **Behind?** Get all sections complete with content\n- **On track?** Polish CSS, test responsive, fix details\n- **Ahead?** Help at a station, add extra features\n\n**Final submission:** Save your CodePen URL and submit to Google Classroom. This is your final version.",
    },
    {
      id: "q-submit", type: "question",
      questionType: "short_answer",
      prompt: "Submit your final portfolio CodePen URL here. On a scale of 1-10, how satisfied are you with it? What would you improve with one more day?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSONS 52-54: Portfolio Presentations (3 days)
// ═══════════════════════════════════════════════════════════════

const lesson52 = {
  title: "Portfolio Presentations — Day 1",
  questionOfTheDay: "What's one thing you're most proud of in your portfolio?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 51,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎤",
      title: "Portfolio Presentations",
      subtitle: "Day 1 of 3",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Present their portfolio website to the class with confidence",
        "Explain design decisions and reflect on their process",
        "Evaluate peers' portfolios using specific criteria",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Presentation format (3 min per student):**\n1. Share screen — show the portfolio live\n2. Walk through each section briefly\n3. Highlight 1-2 design decisions: \"I chose this because...\"\n4. Highlight your favorite project and why it represents you\n\n**Audience:** Evaluate each presenter on the Google Form:\n- Design quality (1-5)\n- Content quality (1-5)\n- Presentation clarity (1-5)\n- One specific compliment\n- One suggestion for improvement",
    },
    {
      id: "q-present1", type: "question",
      questionType: "short_answer",
      prompt: "Which presentation today impressed you the most? What specific design or content choice made it stand out?",
    },
  ],
};

const lesson53 = {
  title: "Portfolio Presentations — Day 2",
  questionOfTheDay: "What would you add to your portfolio if you had one more week?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 52,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎤",
      title: "Portfolio Presentations",
      subtitle: "Day 2 of 3",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Present their portfolio website to the class",
        "Give constructive feedback using design vocabulary",
        "Identify techniques to adopt from peers",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Continued from yesterday.** Same format: 3 minutes per presenter. Audience evaluates on the Google Form.\n\nAs you watch today, look for one technique or design choice you'd want to steal for your own portfolio.",
    },
    {
      id: "q-present2", type: "question",
      questionType: "short_answer",
      prompt: "What's one technique or design choice from today's presentations that you'd add to your own portfolio? Why does it work?",
    },
  ],
};

const lesson54 = {
  title: "Portfolio Presentations — Day 3 + Awards",
  questionOfTheDay: "What did you learn this year that surprised you the most?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 53,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🏆",
      title: "Portfolio Presentations + Awards",
      subtitle: "Day 3 — Final Presentations & Awards",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Complete all remaining presentations",
        "Celebrate class achievements with portfolio awards",
        "Reflect on growth across the entire year",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Final presentations today.** After all presentations, we vote on awards:\n\n- **Best Design** — cleanest, most polished portfolio\n- **Best Content** — strongest project descriptions and work\n- **Most Creative** — most unique approach\n- **Best Presentation** — most confident delivery\n- **Most Improved** — most visible growth from the start of the year\n- **People's Choice** — overall favorite",
    },
    {
      id: "q-present3", type: "question",
      questionType: "short_answer",
      prompt: "Now that you've seen everyone's portfolios — what's one thing that almost everyone could improve? What's one thing this class did really well overall?",
    },

    {
      id: uid(), type: "section_header",
      icon: "🪞",
      title: "Year-End Reflection",
      subtitle: "Looking back on the full year",
    },
    {
      id: "q-yearreflect1", type: "question",
      questionType: "short_answer",
      prompt: "What's one digital skill you learned this year that you'll actually use in your life?",
    },
    {
      id: "q-yearreflect2", type: "question",
      questionType: "short_answer",
      prompt: "What project are you most proud of from the entire course? Why?",
    },
    {
      id: "q-yearreflect3", type: "question",
      questionType: "short_answer",
      prompt: "How has your understanding of 'digital literacy' changed since September?",
    },
    {
      id: "q-yearreflect4", type: "question",
      questionType: "short_answer",
      prompt: "If you could give advice to next year's class about this course, what would you say?",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON 55: Course Wrap-Up + Digital Citizenship Pledge
// ═══════════════════════════════════════════════════════════════

const lesson55 = {
  title: "Course Wrap-Up + Digital Citizenship Pledge",
  questionOfTheDay: "You've spent a year becoming digitally literate. What does that actually mean to you now?",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 54,
  visible: false,
  blocks: [
    {
      id: uid(), type: "section_header",
      icon: "🎓",
      title: "Course Wrap-Up",
      subtitle: "Digital Citizenship Pledge",
    },
    {
      id: "objectives", type: "objectives",
      title: "Learning Objectives",
      items: [
        "Reflect on the full arc of the course and personal growth",
        "Articulate their digital identity and values",
        "Leave with a portfolio they can continue to build on",
      ],
    },
    {
      id: uid(), type: "text",
      content: "**Look how far you've come.**\n\nDay 1: What is a strong password? How do you write a professional email?\n\nToday: You built a business concept from scratch, created a brand, designed content strategy, learned to code HTML/CSS, and published a portfolio website.\n\nYou now have skills that most adults don't have. That comes with responsibility.",
    },

    {
      id: uid(), type: "section_header",
      icon: "📜",
      title: "Digital Citizenship Pledge",
      subtitle: "Your commitments going forward",
    },
    {
      id: uid(), type: "text",
      content: "Write your own Digital Citizenship Pledge — 3-5 personal commitments for how you'll use your digital skills going forward.\n\nNot a generic school pledge — YOUR words, based on what you actually learned.\n\nExamples:\n- \"I will think about my audience before I post\"\n- \"I will protect my personal information and others'\"\n- \"I will use my content creation skills to help, not harm\"\n- \"I will question what I see online before sharing it\"",
    },
    {
      id: "q-pledge", type: "question",
      questionType: "short_answer",
      prompt: "Write your Digital Citizenship Pledge: 3-5 personal commitments for how you'll use your digital skills responsibly. Use your own words.",
    },

    {
      id: uid(), type: "section_header",
      icon: "🔑",
      title: "Portfolio Handoff",
      subtitle: "This is yours now",
    },
    {
      id: uid(), type: "text",
      content: "**Your portfolio lives on after this class.**\n\n- Your CodePen account is yours — log in anytime to update it\n- Add new projects as you create them (college apps, job applications, or just to show people what you can do)\n- The HTML/CSS skills you learned work everywhere — every website on the internet uses them\n\n**Export a backup:** In CodePen, click Export → Download .zip. Save this somewhere safe.",
    },
    {
      id: "q-final", type: "question",
      questionType: "short_answer",
      prompt: "One thing you'll take from this class — go. (One sentence.)",
    },
    {
      id: uid(), type: "callout",
      icon: "🎓", style: "highlight",
      content: "**You are digitally literate.** Not because you took a class — because you built things. That's the difference.",
    },
  ],
};


// ═══════════════════════════════════════════════════════════════
// SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

const lessons = [
  { slug: "how-the-internet-works", data: lesson42 },
  { slug: "html-basics", data: lesson43 },
  { slug: "css-basics", data: lesson44 },
  { slug: "flexbox-crash-course", data: lesson45 },
  { slug: "portfolio-planning", data: lesson46 },
  { slug: "portfolio-build-html", data: lesson47 },
  { slug: "portfolio-build-css", data: lesson48 },
  { slug: "portfolio-build-content", data: lesson49 },
  { slug: "portfolio-build-responsive", data: lesson50 },
  { slug: "portfolio-build-help-day", data: lesson51 },
  { slug: "portfolio-presentations-day1", data: lesson52 },
  { slug: "portfolio-presentations-day2", data: lesson53 },
  { slug: "portfolio-presentations-day3", data: lesson54 },
  { slug: "course-wrap-up", data: lesson55 },
];

async function main() {
  console.log("🚀 Seeding Digital Literacy Unit 7: Portfolio Capstone (Lessons 42-55)...\n");

  for (const { slug, data } of lessons) {
    const ref = db.collection("courses").doc(COURSE_ID).collection("lessons").doc(slug);
    await ref.set({ ...data, updatedAt: new Date() });
    console.log(`✅ ${data.title}`);
    console.log(`   courses/${COURSE_ID}/lessons/${slug} — ${data.blocks.length} blocks`);
  }

  console.log(`\n🎉 Done! ${lessons.length} lessons seeded for Unit 7: Portfolio Capstone.`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
