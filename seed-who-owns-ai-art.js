// seed-who-owns-ai-art.js
// Run from your pantherlearn directory: node seed-who-owns-ai-art.js
// Lesson 16 in AI & Creativity unit — copyright, authorship, and intellectual
// property questions around AI-generated creative work.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Who Owns AI Art?",
  course: "AI Literacy",
  unit: "AI and Creativity",
  order: 19,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "hero-img",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/lesson16-who-owns-hero.png",
      caption: "",
      alt: "A scale of justice weighing AI-generated art against a human artist's tools"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain the basic principles of copyright and why they exist",
        "Analyze real cases where AI-generated work raised ownership questions",
        "Evaluate competing perspectives on who deserves credit for AI-assisted creative work",
        "Form and defend a position on AI authorship using evidence and reasoning"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "You've spent the last three lessons creating with AI — making music, remixing tracks, generating images, co-writing stories. You saw firsthand that the best AI-assisted work involves real human creative direction.\n\nBut here's a question those lessons didn't answer: **Who owns what you made?**\n\nIf you wrote a prompt and AI generated an image, is that image *yours*? What about the artists whose work the AI was trained on — do they have a claim? What about the company that built the AI?"
    },
    {
      id: "wu-scenario",
      type: "callout",
      icon: "🎲",
      style: "scenario",
      content: "**Quick scenario:**\n\nYou spend 2 hours crafting the perfect prompt. You iterate 15 times. You finally get an AI-generated image that's exactly what you envisioned — and it's stunning.\n\nYou post it online. It goes viral. A company wants to license it for an ad campaign and pay you $5,000.\n\n**Can you sell it? Is it yours to sell? Should you get paid for it?**"
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What's your gut reaction — should the person in the scenario be able to sell that image? Why or why not?",
      placeholder: "I think... because..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 1 — COPYRIGHT BASICS
    // ═══════════════════════════════════════════════════════
    {
      id: "section-copyright",
      type: "section_header",
      title: "Part 1: Copyright Basics",
      subtitle: "~10 minutes",
      icon: "©️"
    },
    {
      id: "copyright-intro",
      type: "text",
      content: "Before we can debate AI ownership, we need to understand what copyright actually is and why it exists."
    },
    {
      id: "copyright-def",
      type: "callout",
      icon: "📝",
      style: "definition",
      content: "**Copyright** is a legal right that gives the **creator** of an original work the exclusive right to use, reproduce, distribute, and profit from that work.\n\nIt exists to protect creators — to make sure that if you write a book, paint a painting, or compose a song, other people can't just take it and profit from your effort.\n\n**Key requirement:** Copyright protects works of **human authorship.** This has always been assumed — because until recently, only humans created things."
    },
    {
      id: "copyright-examples",
      type: "callout",
      icon: "✅",
      style: "success",
      content: "**Things that CAN be copyrighted:**\n- A novel you wrote\n- A photograph you took\n- A song you composed and performed\n- A painting you created\n- Code you wrote\n\n**Things that CANNOT be copyrighted:**\n- Facts (e.g., \"the Earth orbits the Sun\")\n- Ideas (only the specific expression of an idea)\n- Works made by nature (a sunset isn't copyrightable)\n- Works made by animals (a monkey selfie — this actually went to court)"
    },
    {
      id: "monkey-callout",
      type: "callout",
      icon: "🐒",
      style: "insight",
      content: "**The Monkey Selfie Case (2011)**\n\nA macaque monkey in Indonesia picked up a photographer's camera and took a selfie. The photo went viral. But who owns it?\n\nThe courts ruled: **nobody.** Copyright requires human authorship. The monkey can't own copyright, and the photographer didn't take the photo.\n\nThis case matters because it established a principle that's now being tested with AI: **if a non-human creates something, it can't be copyrighted.**"
    },
    {
      id: "copyright-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Based on the monkey selfie ruling, what would happen if an AI generated an image with zero human input?",
      options: [
        "The AI company would automatically own the copyright",
        "The image would have no copyright owner — it would be public domain",
        "The government would own the copyright",
        "The person who pressed the 'generate' button would own it"
      ],
      correctIndex: 1,
      explanation: "Under current copyright law (as interpreted by the U.S. Copyright Office), works generated by AI without meaningful human authorship cannot be copyrighted. They would effectively enter the public domain."
    },

    // ═══════════════════════════════════════════════════════
    // PART 2 — REAL CASES
    // ═══════════════════════════════════════════════════════
    {
      id: "section-cases",
      type: "section_header",
      title: "Part 2: Real Cases",
      subtitle: "~10 minutes",
      icon: "⚖️"
    },
    {
      id: "cases-intro",
      type: "text",
      content: "These aren't hypotheticals — these are real cases that have gone through courts and copyright offices in the last few years."
    },
    {
      id: "case1",
      type: "callout",
      icon: "🎨",
      style: "scenario",
      content: "**Case 1: \"Théâtre D'opéra Spatial\" (2022)**\n\nJason Allen used Midjourney (an AI image generator) to create an artwork that won first place at the Colorado State Fair's art competition. He spent weeks refining his prompts and selecting from hundreds of outputs.\n\nTraditional artists were furious. Allen argued he was the creative director. Critics said the AI did the actual work.\n\n**The debate:** Does spending weeks on prompt refinement count as \"authorship\"? Or is the authorship in the brushstrokes — the actual creation?"
    },
    {
      id: "case2",
      type: "callout",
      icon: "📚",
      style: "scenario",
      content: "**Case 2: Zarya of the Dawn (2023)**\n\nKris Kashtanova created a graphic novel using AI-generated images from Midjourney and their own written story. The U.S. Copyright Office ruled:\n\n- The **written text** was copyrightable (Kashtanova wrote it)\n- The **arrangement and selection** of images was copyrightable (Kashtanova chose which images to use and how to sequence them)\n- The **individual AI-generated images themselves** were NOT copyrightable\n\n**The takeaway:** The human creative contribution (writing, selecting, arranging) is protectable. The raw AI output is not."
    },
    {
      id: "case3",
      type: "callout",
      icon: "🎵",
      style: "scenario",
      content: "**Case 3: AI-Generated Music and Voice Cloning (2023-2025)**\n\nAI-generated songs using cloned voices of real artists (Drake, The Weeknd, etc.) went viral on streaming platforms. Some were indistinguishable from the real thing.\n\n**The issues:**\n- The original artists never consented to having their voice cloned\n- The AI was trained on their actual recordings\n- Listeners were deceived into thinking the songs were real\n\nThis raised questions not just about ownership, but about **consent** and **identity** — should your voice, your likeness, your artistic style be protected from AI replication?"
    },
    {
      id: "cases-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which of the three cases do you find most concerning, and why?",
      placeholder: "I think Case _ is most concerning because..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 3 — THE TRAINING DATA PROBLEM
    // ═══════════════════════════════════════════════════════
    {
      id: "section-training",
      type: "section_header",
      title: "Part 3: The Training Data Problem",
      subtitle: "~5 minutes",
      icon: "💾"
    },
    {
      id: "training-pipeline-img",
      type: "image",
      url: "https://pantherlearn.web.app/images/ai-literacy/lesson16-training-data-pipeline.png",
      caption: "Human-created works flow into AI training → AI generates new outputs based on those patterns",
      alt: "Diagram showing artworks flowing through a funnel into an AI chip, with generated images emerging"
    },
    {
      id: "training-text",
      type: "text",
      content: "There's a deeper ownership question that goes beyond who wrote the prompt.\n\nEvery AI image generator was trained on **millions of images created by human artists** — often scraped from the internet without those artists' knowledge or consent. Every language model was trained on **billions of words written by human authors.**\n\nWhen AI generates output, it's drawing on patterns learned from that human-created training data."
    },
    {
      id: "training-perspectives",
      type: "callout",
      icon: "🔄",
      style: "insight",
      content: "**Two perspectives on training data:**\n\n**Perspective A (AI Companies):**\n\"Training on publicly available data is similar to how humans learn — we read books, study art, absorb influences. AI is doing the same thing at scale. The output is new and original, not a copy.\"\n\n**Perspective B (Artists):**\n\"Our work was used without permission to train a system that now competes with us. AI isn't 'learning' — it's storing statistical patterns from our labor. We should have been asked, and we should be compensated.\""
    },
    {
      id: "training-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which perspective do you agree with more — A or B? Explain your reasoning.",
      placeholder: "I agree more with Perspective _ because..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 4 — THE DEBATE
    // ═══════════════════════════════════════════════════════
    {
      id: "section-debate",
      type: "section_header",
      title: "Part 4: Who Deserves Credit?",
      subtitle: "~10 minutes",
      icon: "🗣️"
    },
    {
      id: "debate-intro",
      type: "text",
      content: "When an AI-generated work is created, there are multiple people who could claim some ownership or credit. Let's evaluate each one."
    },
    {
      id: "debate-sort",
      type: "sorting",
      title: "Deserves Credit or Doesn't?",
      icon: "🔍",
      instructions: "For each claim below, sort it: does this person/group **deserve credit** for an AI-generated image, or **not**?",
      leftLabel: "Deserves Credit ✓",
      rightLabel: "Doesn't Deserve Credit ✗",
      items: [
        {
          text: "The person who wrote and refined the prompt over many iterations",
          correct: "left"
        },
        {
          text: "The AI itself (the model that generated the image)",
          correct: "right"
        },
        {
          text: "The artists whose work was in the training data",
          correct: "left"
        },
        {
          text: "The company that built and trained the AI model",
          correct: "left"
        },
        {
          text: "A random person who downloads and reposts the image",
          correct: "right"
        },
        {
          text: "A person who typed 'generate a cool image' with no further direction",
          correct: "right"
        }
      ]
    },
    {
      id: "debate-callout",
      type: "callout",
      icon: "💡",
      style: "insight",
      content: "**Notice:** There's no single right answer for all of these. Reasonable people disagree — and that's the point. Copyright law hasn't caught up to this technology yet.\n\nThe U.S. Copyright Office's current position (as of 2025): **AI-generated content is copyrightable only if there is sufficient human creative contribution.** But where exactly that line falls is still being debated and tested in courts."
    },
    {
      id: "debate-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Write your own rule for AI creative ownership in 1-2 sentences. If you were making the law, who would own AI-generated creative work, and under what conditions?",
      placeholder: "My rule would be..."
    },

    // ═══════════════════════════════════════════════════════
    // PART 5 — EXPLORE WITH AI
    // ═══════════════════════════════════════════════════════
    {
      id: "section-explore",
      type: "section_header",
      title: "Part 5: Dig Deeper",
      subtitle: "~10 minutes",
      icon: "🔎"
    },
    {
      id: "explore-chatbot",
      type: "chatbot",
      title: "AI Copyright Advisor",
      icon: "⚖️",
      instructions: "Use this chatbot to explore specific scenarios or questions about AI and copyright. Try testing your ownership rule from the previous question.",
      systemPrompt: "You are a knowledgeable advisor on AI copyright and intellectual property issues for high school students. Answer questions about AI ownership, copyright law, training data ethics, and related topics. Use real cases when relevant (Zarya of the Dawn, Théâtre D'opéra Spatial, voice cloning controversies, Getty Images v. Stability AI). Present multiple perspectives fairly — don't advocate for one side. When students propose their own rules or positions, help them think through edge cases and consequences. Keep responses concise (3-5 sentences). Use accessible language — avoid dense legal jargon. If a student asks about a scenario, walk through who might have a claim and why.",
      starterMessage: "I'm here to help you explore questions about AI, creativity, and ownership. You can ask me about specific scenarios ('What if I use AI to design a logo for a business?'), real cases, or test your ownership rule against edge cases. What are you curious about?",
      minMessages: 4
    },

    // ═══════════════════════════════════════════════════════
    // CHECK FOR UNDERSTANDING
    // ═══════════════════════════════════════════════════════
    {
      id: "section-check",
      type: "section_header",
      title: "Check for Understanding",
      subtitle: "~5 minutes",
      icon: "✅"
    },
    {
      id: "check-q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "According to the U.S. Copyright Office's ruling on \"Zarya of the Dawn,\" which parts of an AI-assisted graphic novel CAN be copyrighted?",
      options: [
        "Only the AI-generated images",
        "Nothing — the entire work is uncopyrightable because AI was involved",
        "The human-written text and the selection/arrangement of images, but NOT the individual AI-generated images",
        "Everything — because a human directed the AI"
      ],
      correctIndex: 2,
      explanation: "The Copyright Office drew a line: human creative contributions (writing, selection, arrangement) are copyrightable. The raw AI-generated images are not, because they lack human authorship at the point of creation."
    },
    {
      id: "check-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why is the training data question central to AI copyright debates?",
      options: [
        "Because AI companies need permission to use electricity",
        "Because AI models learn patterns from millions of human-created works, often without creators' consent or compensation",
        "Because training data is always purchased legally from artists",
        "Because copyright law explicitly addresses AI training data"
      ],
      correctIndex: 1,
      explanation: "AI generative models are trained on massive datasets of human-created work — art, text, music — often scraped without permission. This means every AI output is built on the labor of human creators who may not have been asked or compensated."
    },
    {
      id: "check-q3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What makes the voice cloning cases different from AI image generation?",
      options: [
        "Voice cloning is legal while image generation is not",
        "Voice cloning raises additional issues of identity, consent, and deception beyond just copyright",
        "Voice cloning doesn't use training data",
        "Voice cloning only affects famous people"
      ],
      correctIndex: 1,
      explanation: "Voice cloning goes beyond copyright into questions of personal identity and consent. When an AI replicates someone's voice without permission, it raises issues of impersonation and deception that don't apply the same way to generated images."
    },

    // ═══════════════════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up",
      subtitle: "~5 minutes",
      icon: "🎯"
    },
    {
      id: "wrapup-text",
      type: "text",
      content: "This is one of the most actively debated topics in technology right now — and there's no settled answer yet. Courts are still deciding. Laws are still being written. Artists are still fighting for recognition.\n\nWhat matters is that you can think critically about these questions rather than just accepting whatever a company or a headline tells you."
    },
    {
      id: "final-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Has your position on AI ownership changed since the beginning of this lesson? What's the strongest argument you heard today — either for or against AI-generated work being owned by the prompter?",
      placeholder: "My position has [changed/stayed the same] because..."
    },
    {
      id: "takeaways",
      type: "callout",
      icon: "✅",
      style: "success",
      content: "**Key Takeaways:**\n\n- Copyright protects works of human authorship — AI-generated content alone doesn't qualify\n- Human creative contribution (writing, selecting, arranging) can make parts of AI-assisted work copyrightable\n- AI models are trained on millions of human-created works, often without consent or compensation\n- Voice cloning raises additional issues of identity, consent, and deception\n- Copyright law hasn't caught up to AI technology — these questions are actively being decided\n- There's no single right answer, but being able to think critically about ownership and credit is essential"
    },

    // ═══════════════════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      title: "Vocabulary",
      subtitle: "",
      icon: "📖"
    },
    {
      id: "vocab1",
      type: "vocab_list",
      terms: [
        {
          term: "Copyright",
          definition: "A legal right giving the creator of an original work exclusive rights to use, reproduce, distribute, and profit from it. Requires human authorship."
        },
        {
          term: "Public Domain",
          definition: "Creative works not protected by copyright — either because copyright expired, was forfeited, or never applied. Anyone can use public domain works freely."
        },
        {
          term: "Intellectual Property (IP)",
          definition: "Creations of the mind — inventions, literary and artistic works, designs, symbols, names — that are protected by law through patents, copyright, and trademarks."
        },
        {
          term: "Fair Use",
          definition: "A legal doctrine that allows limited use of copyrighted material without permission for purposes like education, commentary, criticism, or parody. Whether AI training counts as fair use is actively being debated in courts."
        },
        {
          term: "Training Data",
          definition: "The dataset used to teach an AI model. For generative AI, this typically includes millions of images, texts, or audio files created by humans — raising questions about consent and compensation."
        }
      ]
    }
  ]
};

async function seed() {
  const courses = [
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj", label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3", label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp", label: "Period 7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5", label: "Period 9" },
  ];

  const lessonId = "who-owns-ai-art";

  for (const course of courses) {
    await db.collection("courses").doc(course.courseId)
      .collection("lessons").doc(lessonId)
      .set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label} (${course.courseId})`);
  }

  console.log(`\n   Lesson ID: ${lessonId}`);
  console.log(`   Order: ${lesson.order} (Lesson 17 — AI and Creativity)`);
  console.log(`   Blocks: ${lesson.blocks.length}`);
  console.log(`   Visible: false (publish via Lesson Editor when ready)`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error seeding lesson:", err);
  process.exit(1);
});
