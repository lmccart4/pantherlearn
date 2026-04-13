// seed-diglit-personal-footprint-audit.js
// Digital Literacy — 2-period lesson: Personal Digital Footprint Audit
// Day 1 (Mon 2026-04-13): Investigation
// Day 2 (Tue 2026-04-14): Action Plan + Fix
// Run: node scripts/seed-diglit-personal-footprint-audit.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Personal Digital Footprint Audit (2 Days)",
  questionOfTheDay: "If a stranger Googled your name right now, what would they find — and what would you wish they couldn't?",
  course: "Digital Literacy",
  unit: "Data Literacy",
  order: 58.5,
  visible: false,
  dueDate: "2026-04-14",
  gradesReleased: true,
  blocks: [

    // ═══════════════════════════════════════════════
    // DAY 1 — INVESTIGATION
    // ═══════════════════════════════════════════════

    {
      id: "section-day1",
      type: "section_header",
      title: "Day 1 — Investigate Yourself",
      subtitle: "Today: find out what's already out there",
      icon: "🔍"
    },
    {
      id: "b-day1-intro",
      type: "callout",
      style: "insight",
      icon: "🏆",
      content: "**Extra Credit Assessment — Up to +10% on Your Marking Period Grade**\n\nFor the next two periods, you'll act like a private investigator hired to figure out everything that's publicly known about *you*. Today is the investigation. Tomorrow you'll fix what you don't want public.\n\nThis is an **extra credit assessment grade** worth **up to 10%** added to your marking period grade. How much you actually earn depends on how well you do — exemplary work earns the full 10%, partial work earns a partial boost, weak work earns nothing. **Due: end of class tomorrow.** See the rubric below before you start."
    },
    {
      id: "b-privacy-note",
      type: "callout",
      style: "warning",
      icon: "🔒",
      content: "**Privacy promise:** Only Mr. McCarthy can see your answers. Don't share screenshots with classmates. Don't post any personal info publicly. **Never paste a password into this lesson.** If you find something scary, that's exactly the point — we'll fix it tomorrow."
    },
    {
      id: "b-day1-objectives",
      type: "objectives",
      title: "Today's Mission",
      items: [
        "Search yourself online (Google, image search, social platforms)",
        "Build a complete inventory of accounts you've created",
        "Check whether your email has been in any data breaches",
        "Document everything in a personal Google Drive folder",
        "Rate your current exposure level"
      ]
    },

    {
      id: "section-rubric",
      type: "section_header",
      title: "Rubric",
      subtitle: "How the +10% is earned",
      icon: "📊"
    },
    {
      id: "b-rubric",
      type: "callout",
      style: "objective",
      icon: "🏅",
      content: "**Full +10% boost (exemplary):** Every section below is complete, specific, honest, and shows real effort. Total = 10 points.\n\n- **Search investigation (2 pts)** — Google self, image search, AND profile views from a logged-out browser. Screenshots saved to Drive. Findings reported with specific detail, not vague.\n- **Account inventory (2 pts)** — Real attempt at a complete list. Evidence you actually checked your password manager AND searched your email for 'welcome' or 'verify your account'. At least 2-3 forgotten accounts named specifically.\n- **Have I Been Pwned check (1 pt)** — Every email address you use was actually run through haveibeenpwned.com. Numbers reported (emails checked, breaches found).\n- **Action plan (2 pts)** — Three concrete, clickable fixes. Each one tells you exactly what to open and what to do — no vague wishes.\n- **Fixes executed + 'after' screenshots (2 pts)** — You actually completed at least 3 fixes during Day 2. Screenshots prove the cleanup happened.\n- **Reflection (1 pt)** — Specific takeaway, specific habit change, specific advice. Not generic 'be more careful' answers.\n\nPartial credit scales: 7-9 points = meaningful boost (5-8%), 4-6 points = small boost (2-4%), under 4 = no credit. Submit a Drive link I can actually open or the whole thing scores zero."
    },

    {
      id: "q-warmup-1",
      type: "question",
      questionType: "short_answer",
      prompt: "**Before you start — write your guess:** Roughly how many online accounts do you think you've created in your life so far? One number is fine. You'll compare your guess to reality later today.",
      difficulty: "understand"
    },
    {
      id: "q-warmup-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "True or false: anything you've ever posted publicly on social media can be saved by someone else even if you delete it later.",
      options: [
        "False — when you delete a post it's gone forever",
        "True — screenshots, the Wayback Machine, and reposts mean 'delete' isn't really delete",
        "Only if the platform sells it"
      ],
      correctIndex: 1,
      explanation: "Once it's public, you've lost control. Screenshots, archive sites like the Wayback Machine, and other people's reposts mean a deleted post can still exist somewhere forever.",
      difficulty: "understand"
    },

    { id: "div-1", type: "divider" },

    {
      id: "section-step1",
      type: "section_header",
      title: "Step 1: Google Yourself",
      icon: "🔎"
    },
    {
      id: "b-step1-text",
      type: "text",
      content: "Open a **private/incognito browser window** so Google doesn't use your normal results. Then run these three searches:\n\n1. Your **full name** in quotes — `\"First Last\"`\n2. Your full name + the word **Perth Amboy** — `\"First Last\" Perth Amboy`\n3. Any **username** or handle you use online — `\"yourusername\"`\n\nFor each search, screenshot the first page of results. Save the screenshots to a new Google Drive folder called \"Footprint Audit — Your Name\"."
    },
    {
      id: "b-step1-activity",
      type: "activity",
      title: "Run the three searches and screenshot results",
      icon: "🔬",
      instructions: "Use an incognito window. Screenshot the first page of results from each search. Drop the screenshots into your Drive folder."
    },
    {
      id: "q1",
      type: "question",
      questionType: "short_answer",
      prompt: "**What did you find about yourself in Google search?** Be specific — list the kinds of results that came up (social profiles, news mentions, school records, sports stats, nothing at all, etc.). If nothing came up, say so.",
      difficulty: "apply"
    },
    {
      id: "b-step1-image",
      type: "text",
      content: "Now click over to **Google Images** and search the same things. You're looking for any photos of you that show up publicly."
    },
    {
      id: "q2",
      type: "question",
      questionType: "short_answer",
      prompt: "**Image search results:** Did any photos of you show up? Where did they come from (school website, sports team, social media, parents' accounts, nothing)? Don't post the photos — just describe them.",
      difficulty: "apply"
    },

    { id: "div-2", type: "divider" },

    {
      id: "section-step2",
      type: "section_header",
      title: "Step 2: Account Inventory",
      icon: "📋"
    },
    {
      id: "b-step2-text",
      type: "text",
      content: "Now make a **complete list** of every online account you can remember creating. Don't just list the ones you use — list the ones you've **forgotten**. Old game accounts. Random sites you signed up for to download something. School platforms. Streaming services. Shopping sites. Quiz sites. Email addresses you don't use anymore.\n\nA good way to find forgotten accounts: open the password manager in your browser (Chrome → Settings → Autofill → Passwords) and look at every site that's saved a password for you. That's your starting list."
    },
    {
      id: "b-step2-activity",
      type: "activity",
      title: "List every account you can find",
      icon: "🔬",
      instructions: "Open your browser's password manager AND your email inbox (search 'welcome' or 'verify your account'). Make a complete list. Save it as a doc or spreadsheet in your Footprint Audit folder."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "**How many accounts did you find total?** And how many of those did you completely forget existed?",
      difficulty: "apply"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "**Which forgotten accounts surprised you the most?** Name 2-3 specific ones (e.g., \"a Roblox account from 4th grade,\" \"a fan site I joined when I was 11\"). Don't share usernames or passwords — just the platform.",
      difficulty: "analyze"
    },

    { id: "div-3", type: "divider" },

    {
      id: "section-step3",
      type: "section_header",
      title: "Step 3: Have I Been Pwned?",
      icon: "🛡️"
    },
    {
      id: "b-step3-text",
      type: "text",
      content: "Go to **haveibeenpwned.com** and type in each email address you've ever used (your school email, your personal email, any old ones). The site will tell you if your email shows up in any known data breaches — meaning your account info from that site was leaked publicly.\n\nThis is a trusted security tool used by professionals. It does **not** store what you type. Run each of your emails through it."
    },
    {
      id: "b-step3-activity",
      type: "activity",
      title: "Check every email address at haveibeenpwned.com",
      icon: "🔬",
      instructions: "Visit haveibeenpwned.com → enter each email you use → screenshot the results. Add the screenshots to your Drive folder."
    },
    {
      id: "q5",
      type: "question",
      questionType: "short_answer",
      prompt: "**How many of your emails came up in breaches?** And roughly how many breaches total across all your emails? (You don't have to share which sites — just the numbers.)",
      difficulty: "apply"
    },

    { id: "div-4", type: "divider" },

    {
      id: "section-step4",
      type: "section_header",
      title: "Step 4: What's Public on Your Profiles?",
      icon: "👀"
    },
    {
      id: "b-step4-text",
      type: "text",
      content: "Pick **three** social platforms you actually use (Instagram, TikTok, Snapchat, Discord, Reddit, X, BeReal, Pinterest, YouTube, etc.).\n\nFor each one, **log out** (or open it in an incognito window) and then go to your own profile from that logged-out view. You're seeing exactly what a stranger sees."
    },
    {
      id: "b-step4-activity",
      type: "activity",
      title: "View your own profile while logged out on 3 platforms",
      icon: "🔬",
      instructions: "Log out (or use incognito). Visit your profile on 3 platforms. Screenshot what's publicly visible to a stranger. Save to your Drive folder."
    },
    {
      id: "q6",
      type: "question",
      questionType: "short_answer",
      prompt: "**For each of your 3 platforms — what's publicly visible to a stranger?** List the platform and what they can see (full name, profile pic, bio, posts, friends list, location, etc.). Be specific.",
      difficulty: "analyze"
    },

    { id: "div-5", type: "divider" },

    {
      id: "section-day1-end",
      type: "section_header",
      title: "End of Day 1 — Take Stock",
      icon: "📊"
    },
    {
      id: "q7",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Based on what you found today, how would you rate your current digital exposure?",
      options: [
        "Locked down — almost nothing public",
        "Mostly private — a few things I'm fine with being out there",
        "Mixed — some stuff I want to fix",
        "Wide open — way more public than I realized",
        "Concerning — I need to clean up immediately"
      ],
      correctIndex: 2,
      explanation: "There's no 'right' answer here — but most students land somewhere in the middle and are surprised by how much is out there. Tomorrow we'll fix the things you flagged.",
      difficulty: "evaluate"
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "**Biggest surprise:** What's the one thing you found today that you didn't expect to be public, findable, or still around?",
      difficulty: "evaluate"
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "**Three things to fix tomorrow:** List the top three things you want to clean up, lock down, or delete during Day 2. (Be specific — \"delete that old Roblox account\" beats \"clean up some stuff.\")",
      difficulty: "evaluate"
    },
    {
      id: "b-day1-close",
      type: "callout",
      style: "scenario",
      icon: "⏸️",
      content: "**Pause point.** That's Day 1 done. Make sure your Drive folder is saved with all your screenshots and your account list. We pick this back up tomorrow with the action plan and the cleanup."
    },

    { id: "div-6", type: "divider" },

    // ═══════════════════════════════════════════════
    // DAY 2 — ACTION PLAN + FIX
    // ═══════════════════════════════════════════════

    {
      id: "section-day2",
      type: "section_header",
      title: "Day 2 — Clean It Up",
      subtitle: "Tomorrow: actually fix what you found",
      icon: "🧹"
    },
    {
      id: "b-day2-intro",
      type: "callout",
      style: "insight",
      icon: "🛠️",
      content: "**Today you act on yesterday's investigation.**\n\nYesterday you found out what's out there. Today you'll write an action plan and **actually execute at least three fixes in class**. Then you'll take \"after\" screenshots to prove the cleanup happened."
    },
    {
      id: "q-day2-warmup",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Look back at your Day 1 results. Which of these fixes is usually the FASTEST and HIGHEST IMPACT?",
      options: [
        "Locking down privacy settings on your most-used social account",
        "Writing a complaint letter to a website",
        "Buying a VPN",
        "Changing your full legal name"
      ],
      correctIndex: 0,
      explanation: "Privacy settings are the biggest lever you have — minutes of work, huge impact on what strangers can see. The other options are slow, expensive, or impossible.",
      difficulty: "apply"
    },

    {
      id: "section-toolkit",
      type: "section_header",
      title: "Step 5: Cleanup Toolkit",
      subtitle: "Specific tactics — pick what fits your problems",
      icon: "🧰"
    },
    {
      id: "b-toolkit-intro",
      type: "callout",
      style: "scenario",
      icon: "🧭",
      content: "**Stuck on what to actually do?** This is your menu of specific, proven cleanup tactics — organized by goal. Read through the categories that match what you found in Day 1, then use them to write your action plan in Step 6."
    },
    {
      id: "b-toolkit-privacy",
      type: "text",
      content: "### 🔒 Lock Down a Public Profile\n\nFastest, highest-impact fix. Specific click paths for the big platforms:\n\n- **Instagram:** Settings → Privacy → Account Privacy → toggle on **Private Account**\n- **TikTok:** Settings → Privacy → toggle on **Private Account**\n- **Snapchat:** Settings → Privacy Controls → \"Who can...\" → set every option to **Friends Only**\n- **Discord:** User Settings → Privacy & Safety → turn OFF **Allow direct messages from server members**\n- **Reddit:** Settings → Account → toggle off **Show up in r/all**, then clear old post history if needed\n- **YouTube:** Settings → Privacy → set **Saved playlists** and **Subscriptions** to private\n\nWhile you're in privacy settings, also turn off **location sharing**, **read receipts** (if you want), and **suggest my account to others**."
    },
    {
      id: "b-toolkit-delete",
      type: "text",
      content: "### 🗑️ Delete an Old Account You Don't Use\n\n- **Find the deletion link fast:** go to **justdeleteme.xyz** — a free directory of direct deletion links and difficulty ratings for hundreds of sites\n- **If it's not on JustDeleteMe:** Google `[site name] delete account` and look for the official help page\n- **Common pattern:** Settings → Account → Delete Account (sometimes hidden under 'Privacy' or 'Security')\n- **Confirmation step:** most sites email you a confirmation link — check spam if it doesn't arrive\n- **Old game accounts (Roblox, Steam, Epic, etc.):** these usually have full deletion buried deep in account settings — search the help docs\n\n**Important:** deletion is usually permanent. Make sure it's an account you actually don't want before you confirm."
    },
    {
      id: "b-toolkit-passwords",
      type: "text",
      content: "### 🔑 Strengthen Passwords + Turn On 2FA\n\nIf Have I Been Pwned showed your email in any breaches, the passwords on those sites might be circulating online. Fix it:\n\n- **Use a password manager** — Chrome and Safari have one built in for free. Better: dedicated apps like **Bitwarden** (free) or **1Password**.\n- **Generate unique random passwords** for every site. The password manager remembers them so you don't have to.\n- **Rotate breached passwords first** — change those before anything else.\n- **Turn on two-factor authentication (2FA)** on your most important accounts: school email, primary email, main social. Use an **authenticator app** (Google Authenticator, Authy, Duo) instead of text messages — text 2FA can be hijacked.\n- **Never reuse passwords across sites.** If one site gets breached, every reuse is exposed."
    },
    {
      id: "b-toolkit-content",
      type: "text",
      content: "### 🗂️ Remove Old Posts and Photos\n\n- **Instagram:** Profile → Archive → tap a post → Archive (hides without deleting), or Delete to remove\n- **TikTok:** Profile → tap your video → ⋯ → Delete\n- **Twitter/X bulk delete:** use **TweetDelete** or **Cyd** to mass-delete old tweets by date range\n- **Reddit:** edit each old post to read \"[removed]\" *before* deleting it (defeats some archive caches), then delete\n- **YouTube:** Studio → Content → Visibility → set old videos to **Private** or **Unlisted**\n- **Photos others posted of you:** ask the friend or family member to take it down. If they won't, most platforms have a Report → \"it's about me\" → \"I want this removed\" flow."
    },
    {
      id: "b-toolkit-bio",
      type: "text",
      content: "### 👤 Clean Up Your Bios and Profile Info\n\nQuick wins on every public-facing profile:\n\n- **Remove your real full name** if you don't need it (use a handle instead)\n- **Remove your school name** — \"Perth Amboy High School\" tells strangers exactly where to find you in person\n- **Remove your location** (city, town, neighborhood)\n- **Remove your age or birth year**\n- **Remove your phone number** from any public profile\n- **Stop using your school email** for non-school apps — when school's done you don't want it tied to your gaming and social accounts forever"
    },
    {
      id: "b-toolkit-search",
      type: "text",
      content: "### 🔍 Get Something Removed From Google Search\n\nIf you found something in Google that you can't delete at the source (an old news article, a forum post, a leaked address):\n\n- **Google's \"Results about you\" tool** — search Google for `Results about you` and follow the form. They'll review and may remove it from search results.\n- **For non-consensual or harmful content:** Google's **Remove personal info from search** form has a faster path for things like exposed phone numbers, addresses, and government IDs.\n- **Wayback Machine archives:** request removal through the Internet Archive's contact form if you find an archived snapshot of something you've since deleted.\n\nThis won't delete content from the original site — just from Google's results — but that's usually enough to make it un-findable for casual searchers."
    },

    { id: "div-day2-toolkit", type: "divider" },

    {
      id: "section-step5",
      type: "section_header",
      title: "Step 6: Build Your Action Plan",
      icon: "📝"
    },
    {
      id: "b-step5-text",
      type: "text",
      content: "Look at the three fixes you listed at the end of Day 1. Now turn each one into a **specific, concrete action** with a clear next step.\n\nGood action: \"Open Instagram → Settings → Account Privacy → switch to private\"\nBad action: \"Make Instagram more private\"\n\nThe good version tells you exactly what to click. The bad version is just a wish."
    },
    {
      id: "q10",
      type: "question",
      questionType: "short_answer",
      prompt: "**Your action plan — three concrete fixes.** Rewrite your three Day 1 fixes as specific clickable steps. Each one should tell you exactly what to open and what to do.",
      difficulty: "apply"
    },

    { id: "div-7", type: "divider" },

    {
      id: "section-step6",
      type: "section_header",
      title: "Step 7: Execute the Fixes",
      icon: "✅"
    },
    {
      id: "b-step6-text",
      type: "text",
      content: "Now actually do them. Right now, in class. Use the **Cleanup Toolkit** above and the action plan you just wrote as your guide. Work through your three fixes one at a time.\n\nIf you finish your three early and you have time left, pick a fourth from the toolkit and do that one too. Strong submissions show more work, not less."
    },
    {
      id: "b-step6-activity",
      type: "activity",
      title: "Actually execute at least 3 fixes — take 'after' screenshots",
      icon: "🔬",
      instructions: "Do the cleanup. After each fix, take a screenshot showing the new state (private profile, deleted account confirmation, 2FA enabled, etc.). Save the after-screenshots to your Drive folder."
    },
    {
      id: "q11",
      type: "question",
      questionType: "short_answer",
      prompt: "**What did you actually fix?** List each fix you completed today. For each one: (1) what you changed, (2) which platform, and (3) what's different now compared to yesterday.",
      difficulty: "apply"
    },

    { id: "div-8", type: "divider" },

    {
      id: "section-submit",
      type: "section_header",
      title: "Submit Your Audit",
      icon: "📤"
    },
    {
      id: "b-submit-text",
      type: "text",
      content: "Your Drive folder should now contain:\n\n- Day 1 screenshots: Google search results, image search, Have I Been Pwned, profile views\n- Your account inventory list\n- Day 2 screenshots: \"after\" screenshots showing your fixes\n\nMake sure the folder's sharing is set to **\"Anyone with the link can view\"** so I can open it. Then paste the link below."
    },
    {
      id: "q12",
      type: "question",
      questionType: "short_answer",
      prompt: "**Google Drive folder link:** Paste your shareable Drive folder link here. Set sharing to \"Anyone with the link can view\" — if I can't open it, I can't grade it. Test the link in an incognito window before submitting.",
      difficulty: "apply"
    },

    { id: "div-9", type: "divider" },

    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection",
      icon: "💭"
    },
    {
      id: "q13",
      type: "question",
      questionType: "short_answer",
      prompt: "**Biggest takeaway:** What's the one thing you learned about your own digital footprint that you didn't know two days ago?",
      difficulty: "evaluate"
    },
    {
      id: "q14",
      type: "question",
      questionType: "short_answer",
      prompt: "**Going forward:** Name one habit you'll change because of this audit. Be specific — \"I'll check privacy settings on every new app I download\" beats \"I'll be more careful.\"",
      difficulty: "evaluate"
    },
    {
      id: "q15",
      type: "question",
      questionType: "short_answer",
      prompt: "**Advice to a 7th grader:** If you could go back and tell yourself in 7th grade ONE thing about managing your online presence, what would it be?",
      difficulty: "evaluate"
    },
    {
      id: "b-final",
      type: "callout",
      style: "warning",
      icon: "⏰",
      content: "**Before you submit:** Scroll back up and re-read the rubric. For every line item, ask yourself \"would a stranger looking at my submission give me full credit on this?\" Re-check that your Drive folder link works in an incognito window. Re-read your action plan and make sure the fixes you described actually match the 'after' screenshots you uploaded. Strong submissions look like a real audit report — not a fill-in-the-blank."
    }

  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("digital-literacy")
      .collection("lessons").doc("personal-footprint-audit")
      .set(lesson);
    console.log("✅ Personal Digital Footprint Audit seeded!");
    console.log("   Path: courses/digital-literacy/lessons/personal-footprint-audit");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Due:", lesson.dueDate);
    console.log("   Visible:", lesson.visible);
    console.log("   gradesReleased:", lesson.gradesReleased);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
