// seed-diglit-portfolio-css-layout.js
// Creates "CSS + Flexbox: Making It Look Real" (Dig Lit, Portfolio Capstone, Lesson 53)
// Run: node scripts/seed-diglit-portfolio-css-layout.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "CSS + Flexbox: Making It Look Real",
  course: "Digital Literacy",
  unit: "Portfolio Capstone",
  order: 53,
  visible: false,
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
      content: "HTML without CSS is like a house with no paint, no furniture, and no lights.\n\nThe structure is there. But it doesn't look like a home.\n\nToday you'll learn CSS — the language that controls how everything looks — and Flexbox, the tool that controls how everything is *arranged*.\n\nBy the end of this lesson, you'll know enough CSS to take any plain HTML file and make it look like a real website."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** HTML without CSS is like a house with no paint, furniture, or lights. What's the minimum CSS needed to make a page look decent?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Open the About Me page you built in CodePen yesterday. Look at it honestly: what's ugly about it? What would you change first if you could? (Be specific — \"the text is hard to read,\" \"the heading is too small,\" etc.)",
      placeholder: "Three things I'd fix: ...",
      difficulty: "remember"
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Write CSS rules using the selector-property-value syntax",
        "Apply colors, fonts, spacing, and borders to HTML elements",
        "Use Flexbox to create horizontal layouts and navigation bars"
      ]
    },

    {
      id: "section-main",
      type: "section_header",
      icon: "💅",
      title: "CSS: How It Works",
      subtitle: "~20 minutes"
    },
    {
      id: "b-css-syntax",
      type: "text",
      content: "**CSS syntax — the formula**\n\nEvery CSS rule has three parts:\n```\nselector {\n  property: value;\n}\n```\n\nExample:\n```\nh1 {\n  color: navy;\n  font-size: 36px;\n}\n```\nTranslation: \"Find every h1 element and make it navy blue, 36px.\"\n\n**Today's CSS toolkit:**\n\n| Property | What it does | Example values |\n|----------|-------------|----------------|\n| `color` | Text color | `red`, `#2563eb`, `rgb(0,0,0)` |\n| `background-color` | Background | `#f0f0f0`, `white` |\n| `font-family` | Font | `Arial`, `Georgia` |\n| `font-size` | Text size | `16px`, `24px`, `2em` |\n| `text-align` | Alignment | `center`, `left`, `right` |\n| `padding` | Space INSIDE element | `20px`, `10px 20px` |\n| `margin` | Space OUTSIDE element | `20px`, `auto` |\n| `border` | Border line | `2px solid black` |\n| `max-width` | Maximum width | `900px` |\n\n**The most important rule you'll ever write:**\n```\n* { box-sizing: border-box; margin: 0; padding: 0; }\n```\nThis \"reset\" clears the browser's default styling so you start from a clean slate. Put this first in every CSS file."
    },
    {
      id: "callout-colors",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Picking colors:** Go to **coolors.co** and click the spacebar to generate palettes. Pick 2-3 colors that work together. Copy the hex codes (like `#2563eb`). You'll use your palette for both your CSS practice AND your portfolio.\n\nYou already built a brand identity in Unit 6 — if you have brand colors, use those. Consistency is professional."
    },
    {
      id: "q-css-basics",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student writes this CSS:\n\n```\np {\n  color: white\n  background-color: white;\n}\n```\n\nThey apply it to their page and the paragraphs disappear. What's wrong?",
      options: [
        "The color \"white\" doesn't exist in CSS",
        "There's a missing semicolon after `color: white` — CSS fails silently, so the whole rule might not apply correctly",
        "You can't use the same color for text and background",
        "The `p` selector should be `.p`"
      ],
      correctIndex: 1,
      explanation: "Missing semicolons are the #1 CSS beginner mistake. CSS fails silently — no error message appears, things just stop working. After the missing semicolon, the browser may not parse the rest of the rule. Also: white text on a white background would be invisible even if the code was correct — always check your contrast!",
      difficulty: "apply"
    },
    {
      id: "b-flexbox",
      type: "text",
      content: "**Flexbox: The layout tool that changed everything**\n\nBefore Flexbox, getting things to line up side-by-side required CSS tricks that even professional developers hated. Flexbox made layout logical.\n\n**Three concepts you need:**\n\n1. **Container + Items.** Add `display: flex` to the *parent* element. Its children automatically line up.\n```\n.container {\n  display: flex;\n}\n```\n\n2. **Direction.** `flex-direction: row` = side by side (default). `flex-direction: column` = stacked.\n\n3. **Alignment:**\n   - `justify-content` = horizontal alignment (`center`, `space-between`, `space-around`, `flex-start`)\n   - `align-items` = vertical alignment (`center`, `flex-start`, `flex-end`)\n   - `gap` = space between items (`gap: 20px`)\n\n**The nav bar, built in 4 lines of CSS:**\n```\nnav {\n  display: flex;\n  justify-content: center;\n  gap: 30px;\n  background: #1a1a2e;\n  padding: 20px;\n}\n```\n\nThat's it. Flexbox turns 5 links into a centered horizontal navigation bar."
    },
    {
      id: "q-flexbox",
      type: "question",
      questionType: "short_answer",
      prompt: "**Flexbox exercise (do this in CodePen):**\n\nCreate a `<div>` containing 4 colored boxes (use `<div style=\"width:80px; height:80px; background:red\">` etc.). Add CSS to make them:\n1. Side by side with space between them\n2. Centered on the page\n\nWrite the CSS you used here and describe what happened.",
      placeholder: "CSS I wrote:\n```\n.container {\n  ...\n}\n```\nWhat happened: ...",
      difficulty: "apply"
    },
    {
      id: "b-apply",
      type: "text",
      content: "**Putting it together — the About Me page, styled**\n\nGo back to your About Me practice page from Lesson 52. Add the following CSS in CodePen's CSS panel:\n\n```\n/* Reset */\n* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\n\n/* Your custom styles below */\nbody { background-color: #f5f5f5; }\nh1 { font-size: 36px; color: #1a1a2e; text-align: center; padding: 30px 0; }\np { padding: 10px 20px; }\nimg { border: 3px solid #2563eb; border-radius: 8px; display: block; margin: 20px auto; }\n```\n\n**Requirements for your styled About Me page:**\n- Custom background color\n- Heading with custom color and centered text\n- Image with a border\n- Text with proper padding\n- At least 2 different font sizes\n\nWhen you're satisfied with how it looks, this becomes your CSS foundation for the portfolio."
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
      content: "You now know the CSS basics you need: how to target elements, apply styles, and use Flexbox for layout.\n\nCSS has a learning curve because it fails silently. When something doesn't work: check for missing semicolons, check your selector name matches the HTML, and check if the property name is spelled correctly.\n\n**Up next:** Lesson 54 — Portfolio Planning. Before you build the final portfolio, you'll plan it: choosing your best work, sketching the layout, and writing your content. Building without planning produces bad results. We plan first."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Without looking at notes, write the CSS needed to create a centered, horizontal navigation bar using Flexbox. Include at least 3 properties.",
      placeholder: "nav {\n  ...\n}",
      difficulty: "apply"
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
        { term: "CSS rule", definition: "A complete CSS instruction consisting of a selector (what to style), property (what aspect to change), and value (what to change it to). Format: selector { property: value; }" },
        { term: "Flexbox", definition: "A CSS layout model that makes it easy to arrange elements horizontally or vertically with precise alignment control — activated with display: flex on a container." },
        { term: "Selector", definition: "The part of a CSS rule that identifies which HTML elements to style — can target tags (h1), classes (.container), or IDs (#hero)." },
        { term: "Padding", definition: "Space added inside an element, between its content and its border — makes content less cramped without pushing away surrounding elements." },
        { term: "Margin", definition: "Space added outside an element, between it and surrounding elements — used to create spacing and, with margin: auto, to center block elements." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("portfolio-css-layout")
      .set(lesson);
    console.log('✅ Lesson "CSS + Flexbox: Making It Look Real" seeded!');
    console.log("   Path: courses/digital-literacy/lessons/portfolio-css-layout");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
