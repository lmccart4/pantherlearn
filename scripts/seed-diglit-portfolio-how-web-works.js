// seed-diglit-portfolio-how-web-works.js
// Creates "How the Web Works + Your First Web Page" (Dig Lit, Portfolio Capstone, Lesson 52)
// Run: node scripts/seed-diglit-portfolio-how-web-works.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "How the Web Works + Your First Web Page",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 52,
  visible: false,
  blocks: [

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🌐",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup",
      type: "text",
      content: "You've spent all year learning how digital systems work and how to use them.\n\nThis final unit is different: you're going to build one.\n\nBy the end of this unit, you'll have a real, working portfolio website — hosted on the internet, shareable with anyone, built by you from scratch using actual HTML and CSS code.\n\nYou don't need prior coding experience. You need to show up and type."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** When you type a website URL and press Enter — what actually happens in those 2 seconds before the page loads?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Before we start: have you ever looked at the code behind a website? Right-click any website → \"View Page Source.\" Do it now on any site and describe what you see. What do you recognize? What's confusing?",
      placeholder: "What I see: ...\nWhat I recognize: ...\nWhat's confusing: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain how a browser retrieves and displays a web page (client-server model)",
        "Identify the role of HTML, CSS, and JavaScript in a website",
        "Write a basic HTML document with proper structure and essential tags"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "⚙️",
      title: "The Web: How It Actually Works",
      subtitle: "~20 minutes"
    },
    {
      id: "b-how-web",
      type: "text",
      content: "**The restaurant analogy**\n\nWhen you type a URL and press Enter, here's what happens:\n\n- **You (the browser)** = the customer\n- **The URL** = the restaurant's address\n- **DNS** = the GPS that converts the address into actual directions (an IP address)\n- **The server** = the kitchen where everything is stored\n- **HTML** = the food (the actual content)\n- **CSS** = the plating and presentation (how it looks)\n- **JavaScript** = the waiter who makes things interactive\n\n**Step by step:**\n1. Browser asks DNS: \"Where is google.com?\" → gets an IP address (like 142.250.80.46)\n2. Browser sends a request to that server: \"Give me your homepage\"\n3. Server sends back HTML, CSS, and JavaScript files\n4. Browser reads those files and renders the page you see\n\nEvery website you've ever visited was a file sitting on a computer somewhere — and your browser fetched it."
    },
    {
      id: "b-three-languages",
      type: "text",
      content: "**The three languages of the web**\n\n| Language | What it does | Analogy |\n|----------|--------------|---------|\n| **HTML** | Structure — headings, paragraphs, images, links | The bones of a house |\n| **CSS** | Style — colors, fonts, layout, spacing | The paint, furniture, decor |\n| **JavaScript** | Behavior — clicks, animations, forms | The electrical system |\n\nIn this unit, we're learning **HTML and CSS**. That's enough to build a complete, real website. You don't need JavaScript to have a professional portfolio.\n\nTo see this in action right now: right-click on any website → \"View Page Source.\" You're looking at the actual HTML code that makes that page. In a few days, you'll be writing this yourself."
    },
    {
      id: "q-client-server",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You type \"pantherlearn.com\" into your browser and press Enter. Which of the following correctly describes what happens next?",
      options: [
        "The website is downloaded to your computer permanently",
        "Your browser contacts a DNS server to find the IP address, then requests files from that server, which sends back HTML/CSS/JS that your browser renders",
        "The internet searches all computers worldwide to find the website",
        "Your browser creates the website using information from your account"
      ],
      correctIndex: 1,
      explanation: "This is the client-server model. Your browser (client) asks DNS for the server's location, then requests files from that server. The server sends HTML, CSS, and JavaScript — your browser reads those files and renders the page you see. The website files live on the server, not your computer (until they're cached).",
      difficulty: "understand"
    },
    {
      id: "b-html-basics",
      type: "text",
      content: "**HTML: The skeleton of every website**\n\nHTML (HyperText Markup Language) uses *tags* to define content. Tags come in pairs: an opening tag `<p>` and a closing tag `</p>`. Everything between them is the content.\n\n**The HTML skeleton — every web page starts here:**\n```\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <!-- Everything the user SEES goes here -->\n    <h1>Hello World</h1>\n  </body>\n</html>\n```\n\n**Essential tags for today:**\n- `<h1>` through `<h6>` — Headings (h1 is biggest)\n- `<p>` — Paragraph of text\n- `<img src=\"url\" alt=\"description\">` — Image\n- `<a href=\"url\">Link text</a>` — Clickable link\n- `<ul>` + `<li>` — Bullet list\n- `<br>` — Line break\n\nKey rule: **tags come in pairs**. Forgetting the closing tag (`</p>`) is the #1 beginner mistake."
    },
    {
      id: "callout-codepen",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Your coding tool: CodePen.io**\nGo to **codepen.io** — it's free, works in your browser, and shows you a live preview as you type. No installation needed. Create a free account so your work saves automatically. You'll use this tool for the entire unit.\n\nThe left panel is your HTML. The right panel shows you the live result. Start typing and watch the page update instantly."
    },
    {
      id: "q-html-task",
      type: "question",
      questionType: "short_answer",
      prompt: "**Hands-on: Build your first page.** Open CodePen.io and create an \"About Me\" practice page with:\n- A `<h1>` with your name\n- A `<p>` paragraph about yourself\n- An `<img>` (use this placeholder: https://picsum.photos/300/200)\n- A `<ul>` list of 3 hobbies or interests\n\nThis is NOT your portfolio — it's practice. When you're done, paste the URL of your CodePen here and describe what you built.",
      placeholder: "CodePen URL: ...\nWhat I built: ...\nMost confusing part: ...",
      difficulty: "apply"
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
      content: "You now understand what happens when you visit a website — and you've written your first HTML.\n\nRight now your page is functional but plain. That's completely correct. HTML is structure only. In the next lesson, you'll add CSS to give it a personality.\n\n**Up next:** Lesson 53 — CSS: Making It Not Ugly. We'll cover colors, fonts, spacing, and layout — everything that makes a website look like a real website instead of a homework assignment."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: In your own words, explain the difference between HTML and CSS. What does each one do? Use an analogy that makes sense to you.",
      placeholder: "HTML is like: ...\nCSS is like: ...",
      difficulty: "understand"
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
        { term: "HTML (HyperText Markup Language)", definition: "The language that defines the structure and content of a web page — headings, paragraphs, images, and links — using tag pairs like <h1> and </h1>." },
        { term: "CSS (Cascading Style Sheets)", definition: "The language that controls how HTML elements look — colors, fonts, spacing, and layout." },
        { term: "DNS (Domain Name System)", definition: "The system that translates human-readable domain names (like google.com) into IP addresses that servers can use to route requests." },
        { term: "Client-server model", definition: "The architecture of the web: your browser (client) requests files from a remote computer (server), which sends back HTML/CSS/JS for the browser to render." },
        { term: "Tag", definition: "An HTML marker that wraps content to give it meaning — most come in pairs: an opening tag like <p> and a closing tag like </p>." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("portfolio-how-web-works")
      .set(lesson);
    console.log('✅ Lesson "How the Web Works + Your First Web Page" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/portfolio-how-web-works");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
