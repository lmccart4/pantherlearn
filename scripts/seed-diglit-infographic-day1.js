// seed-diglit-infographic-day1.js
// Digital Literacy — Infographic Sprint, Day 1
// "Topic + Data Gathering" (May 13, 2026)
// Run: node scripts/seed-diglit-infographic-day1.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "infographic-day1-topic-data";

const lesson = {
  title: "Infographic Sprint Day 1 — Topic + Data Gathering",
  course: "Digital Literacy",
  unit: "Infographic Sprint",
  order: 62,
  visible: false,
  questionOfTheDay:
    "Two infographics on the same topic are sitting next to each other. One you 'get' in 5 seconds. The other you have to study. What's actually different about them?",
  blocks: [

    // ─── WARM UP ─────────────────────────────────────────────

    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎯",
      title: "Warm Up",
      subtitle: "~5 minutes",
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content:
        "**Question of the Day:** Two infographics on the same topic are sitting next to each other. One you 'get' in 5 seconds. The other you have to study. What's actually different about them?",
    },
    {
      id: "img-warmup-good",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/infographic-good-example.jpg",
      alt:
        "A clean infographic about teen sleep with one giant 73% headline stat, three small icon-stat pairs, and a tiny source line — restrained 3-color palette and generous whitespace.",
      caption: "Infographic A — read it. How long did it take?",
    },
    {
      id: "img-warmup-bad",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/infographic-bad-example.jpg",
      alt:
        "A cluttered infographic about teen sleep crammed with 8+ mismatched fonts, rainbow colors, and a wall of decorative clip-art with no clear focal point.",
      caption: "Infographic B — try to read it. What happens to your eye?",
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt:
        "I'm putting two infographics up on the projector. One of them tells you something in 5 seconds — the other one is a wall of clip-art. Look at both. What's the FIRST thing your eye lands on in the good one? In the bad one, what makes you bounce off?",
      placeholder:
        "Good one — first thing my eye sees: ...\nBad one — what makes me bounce: ...",
      difficulty: "remember",
    },
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Identify the design choices that make an infographic work vs. fail",
        "Find 3-5 credible data points on a chosen topic with full source citations",
        "Recognize the difference between trustworthy data sources and ones that don't belong on a school project",
      ],
    },

    // ─── MAIN — WHAT MAKES INFOGRAPHICS WORK ─────────────────

    {
      id: "section-main",
      type: "section_header",
      icon: "📊",
      title: "What Makes an Infographic Actually Work",
      subtitle: "~12 minutes",
    },
    {
      id: "b-three-rules",
      type: "text",
      content:
        "An infographic is not a poster covered in numbers. It is a tool that makes ONE point land hard.\n\nThe ones that work share three traits:\n\n**1. One message.** Not five. If you can't say what your infographic is about in a single sentence, it's not finished. *\"Teen sleep is collapsing\"* is a message. *\"Teens, sleep, phones, school, mental health, also some other stuff\"* is a junk drawer.\n\n**2. Visual hierarchy.** The biggest, boldest thing on the page is the most important number. Everything else is in service of it. The reader's eye should travel headline stat → supporting stats → body text → sources, in that order, automatically — without them having to think about it.\n\n**3. Data-honest.** Y-axis starts at zero. Percentages add up. Scale is consistent. You don't shrink the gap between bars to make a difference look bigger than it is. **The number is the truth, not a marketing tool.**",
    },
    {
      id: "b-references",
      type: "text",
      content:
        "**Three real infographics that get this right:**\n\n- **Information Is Beautiful — *What Makes a Hit Song*.** One headline question. A clean visual breakdown by feature (tempo, danceability, valence). You walk away with one takeaway: hit songs share measurable patterns.\n- **The New York Times — *How the Virus Got Out* (2020).** A single animated graphic that traces COVID's spread out of Wuhan in dots and arcs. You understand the entire story in 15 seconds, before you read a word of body copy.\n- **Pew Research — *Teens, Social Media and Technology 2023*.** One slope chart. YouTube sits at the very top of the page — the only line above 90%, in bold red — while every other platform trails below. The headline above the chart names the takeaway directly: 'YouTube continues to be top platform among teens.' Source, sample, and survey dates sit in small print at the bottom. Newsroom-grade restraint.\n\nAll three follow the same recipe: one message, one focal point, sources visible.",
    },
    {
      id: "img-pew-teens-2023",
      type: "image",
      url: "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/pew-teens-social-media-2023.png",
      alt:
        "Pew Research Center slope chart titled 'YouTube continues to be top platform among teens, followed by TikTok, Snapchat and Instagram.' Lines track US teen platform use from 2014-15 to 2023. YouTube sits at the top in bold red at 95% (2022) and 93% (2023). TikTok 63%, Snapchat 60%, Instagram 59% in 2023. Facebook fell from 71% to 33%. Source line at bottom: 'Survey of U.S. teens conducted Sept. 26–Oct. 23, 2023.'",
      caption:
        "Pew Research Center, *Teens, Social Media and Technology 2023*. One message, one focal point (YouTube at the top), source and sample size visible at the bottom.",
    },
    {
      id: "q-hierarchy",
      type: "question",
      questionType: "multiple_choice",
      prompt:
        "Look at the Pew Research chart above. The YouTube line sits at the very top of the chart, bolded in red, well above every other platform. The headline above it just says 'YouTube continues to be top platform among teens.' Why did the designer pull YouTube out visually like that instead of giving every platform equal weight?",
      options: [
        "Because red lines always look more professional than other colors",
        "To establish visual hierarchy — position, color, and weight all signal to the reader: 'this is the takeaway, read this first'",
        "Because YouTube paid Pew to feature them at the top",
        "It's a stylistic choice with no real effect on how readers process the page",
      ],
      correctIndex: 1,
      explanation:
        "Visual hierarchy is the whole point. Position (top of the chart), color (bold red while others are muted), and label weight all push the reader's eye to YouTube first. Everything else on the page is secondary by design. Supporting stats sit below in smaller, less saturated treatments. Source and methodology shrink to the bottom. The visual treatment literally tells the reader the order to process the information.",
      difficulty: "understand",
    },
    {
      id: "callout-honesty",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content:
        "**Lying with charts is easy.** A bar chart where the y-axis starts at 50 instead of 0 makes a tiny difference look like a chasm. A pie chart with slices that don't add up to 100% is a red flag. If your infographic distorts data to look more dramatic, you're not designing — you're misleading. The rubric grades this. So does the real world.",
    },

    // ─── MAIN — WHERE TO GET DATA ───────────────────────────

    {
      id: "section-sources",
      type: "section_header",
      icon: "🔍",
      title: "Where Real Data Lives",
      subtitle: "~5 minutes",
    },
    {
      id: "b-source-whitelist",
      type: "text",
      content:
        "**Sources you CAN use — start here:**\n\n- **Pew Research Center** — *pewresearch.org*. Polls and reports on tech, social media, teens, news consumption. Gold standard.\n- **USAFacts** — *usafacts.org*. Government data, repackaged so a normal person can read it.\n- **CDC** — *cdc.gov*. Public health and demographics. Definitive on US health stats.\n- **NJ DOE** — *nj.gov/education/data*. School-level data for our state — graduation rates, funding, demographics.\n- **Statista** — *statista.com*. Useful, but always click through to the original source they cite. Don't stop at Statista's chart.\n- **Peer-reviewed studies** — Google Scholar (*scholar.google.com*) for actual research papers.\n\n**Sources you CANNOT use:**\n\n- Random blog posts and Medium articles where the author has no listed credentials\n- Social media posts with screenshots of stats (no chain of custody)\n- AI-generated stats — ChatGPT will make up numbers that sound real. **Do not trust them.**\n- Anything without a publication date — if you can't tell when it's from, it doesn't go on your infographic.",
    },
    {
      id: "b-source-tracking",
      type: "text",
      content:
        "**Source-tracking template (fill one row per stat, every time):**\n\n| Field | Example |\n|---|---|\n| **Stat** | 73% of US teens have a smartphone |\n| **Source name** | Pew Research Center |\n| **Author / publisher** | Monica Anderson, Jingjing Jiang |\n| **Title of report** | Teens, Social Media & Technology 2018 |\n| **URL** | pewresearch.org/internet/2018/05/31/teens-social-media-technology-2018/ |\n| **Year published** | 2018 |\n| **Sample size / who was surveyed** | 743 US teens ages 13–17 |\n\nIf you cannot fill in every field, the stat is not strong enough yet. Keep looking.",
    },
    {
      id: "q-source-credible",
      type: "question",
      questionType: "multiple_choice",
      prompt:
        "You're researching teen sleep for your infographic. Four sources show up. Which one belongs on your infographic?",
      options: [
        "A 2024 CDC report on adolescent sleep duration with sample size and methodology listed",
        "A TikTok screenshot saying '92% of teens are sleep-deprived'",
        "A 2017 Reddit thread where a user says they read somewhere that teens sleep 6 hours",
        "A blog post titled '10 Crazy Sleep Stats' with no author and no date",
      ],
      correctIndex: 0,
      explanation:
        "The CDC report is the only one with a chain of custody — author, publication year, methodology, sample size. The TikTok screenshot, Reddit thread, and dateless blog post are all what we call 'data ghosts': numbers that sound real but can't be traced back to the people who actually collected them. On an infographic that's going on a wall, you only put numbers you can defend.",
      difficulty: "apply",
    },

    // ─── ACTIVITY — WORK TIME ───────────────────────────────

    {
      id: "section-worktime",
      type: "section_header",
      icon: "💻",
      title: "Work Time — Pick Your Topic, Find Your Data",
      subtitle: "~20 minutes",
    },
    {
      id: "b-worktime",
      type: "text",
      content:
        "Your job for the next 20 minutes:\n\n1. **Pick a topic.** From the list below, OR propose your own (Mr. McCarthy has to approve it).\n2. **Find 3-5 data points** from the source whitelist above.\n3. **Fill in the source-tracking template** for every single stat — stat, source, URL, year, sample size.\n4. **No AI-generated numbers.** No undated blogs. No screenshots of stats from social media. If it can't be traced, it doesn't go in.\n\n**Topic options to choose from:**\n\n- Teen sleep stats (how much teens actually sleep vs. recommended)\n- Music streaming royalties (what an artist earns per stream on Spotify, Apple Music, etc.)\n- Social media use vs. teen mental health\n- Video game playtime — average hours per week by age\n- NJ school funding — per-student spending by district\n- NJ climate stats — temperature trends, sea level rise, flood frequency\n- Or your own (must be approved)",
    },
    {
      id: "link-pew",
      type: "external_link",
      url: "https://www.pewresearch.org/",
      title: "Pew Research Center",
      description:
        "Polls and reports on tech, social media, teens, news. Always cite the report's title and year.",
    },
    {
      id: "link-usafacts",
      type: "external_link",
      url: "https://usafacts.org/",
      title: "USAFacts",
      description:
        "Non-partisan repackaging of US government data. Great for population, education, economy stats.",
    },
    {
      id: "link-cdc",
      type: "external_link",
      url: "https://www.cdc.gov/",
      title: "CDC — Centers for Disease Control",
      description: "Public health, demographics, sleep, mental health stats. Definitive for US health data.",
    },
    {
      id: "link-njdoe",
      type: "external_link",
      url: "https://www.nj.gov/education/data/",
      title: "NJ Department of Education — Data",
      description: "School-level data for New Jersey: enrollment, funding, graduation rates, demographics.",
    },
    {
      id: "link-statista",
      type: "external_link",
      url: "https://www.statista.com/",
      title: "Statista (use with caution)",
      description:
        "Useful aggregator, but always click through to the original source they cite. Never stop at Statista's chart alone.",
    },
    {
      id: "link-iib",
      type: "external_link",
      url: "https://informationisbeautiful.net/",
      title: "Information Is Beautiful",
      description:
        "Reference for what good infographics look like. Study 'What Makes a Hit Song' and similar pieces.",
    },
    {
      id: "link-flowingdata",
      type: "external_link",
      url: "https://flowingdata.com/",
      title: "FlowingData",
      description:
        "Nathan Yau's site — clean, restrained data visualization. Look at his tile-style charts for design inspiration.",
    },
    {
      id: "link-nyt-virus",
      type: "external_link",
      url: "https://www.nytimes.com/interactive/2020/03/22/world/coronavirus-spread.html",
      title: "NYT — How the Virus Got Out (2020)",
      description:
        "A masterclass in visual hierarchy. One animated map, one story, no clutter. Study how your eye is led through it.",
    },
    {
      id: "link-pew-teens-2023",
      type: "external_link",
      url: "https://www.pewresearch.org/internet/2023/12/11/teens-social-media-and-technology-2023/",
      title: "Pew Research — Teens, Social Media & Technology 2023",
      description:
        "Reference example: one giant headline stat ('95% of US teens use YouTube') anchors the page, supporting bars below, methodology and sample size visible at the bottom.",
    },

    // ─── EXIT TICKET ────────────────────────────────────────

    {
      id: "section-exit",
      type: "section_header",
      icon: "🚪",
      title: "Exit Ticket",
      subtitle: "~5 minutes",
    },
    {
      id: "q-exit-topic",
      type: "question",
      questionType: "short_answer",
      prompt:
        "Lock in your topic and give me a sample of what you found. Fill out: (1) My topic is ___. (2) The most surprising stat I found is ___. (3) My source for that stat is ___ (name + year). Then turn to your neighbor and say it out loud.",
      placeholder:
        "1) My topic is: ...\n2) Most surprising stat: ...\n3) Source (name + year): ...",
      difficulty: "apply",
    },
    {
      id: "callout-due",
      type: "callout",
      style: "info",
      icon: "📅",
      content:
        "**Coming next class (Thursday 5/14):** Day 2 — Design. Bring your source-tracking doc filled in with at least 3 stats and full citations. We'll be in Canva all period building the actual layout. No data tomorrow = no design tomorrow.",
    },

  ],
};

async function seed() {
  try {
    await db
      .collection("courses")
      .doc(COURSE_ID)
      .collection("lessons")
      .doc(LESSON_ID)
      .set(lesson);
    console.log(`✅ Lesson seeded: "${lesson.title}"`);
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
