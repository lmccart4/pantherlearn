// seed-ethics-courtroom-lesson.js
// Lesson 24 — AI Ethics & Society unit
// Wraps the existing AI Ethics Courtroom activity.

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "AI Ethics Courtroom",
  course: "AI Literacy",
  unit: "AI Ethics and Society",
  order: 26,
  visible: false,
  blocks: [
    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "obj1",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Analyze a real AI ethics case from multiple perspectives (prosecution, defense, expert witness)",
        "Construct evidence-based arguments for and against the use of AI in a specific scenario",
        "Evaluate the real-world consequences of AI systems on different populations",
        "Form and defend a verdict based on evidence, not just opinion"
      ]
    },
    {
      id: "wu-text1",
      type: "text",
      content: "Last lesson you trained an AI and saw how training choices create consequences. Today you put those consequences on trial.\n\nIn the **AI Ethics Courtroom**, you'll take on the role of a lawyer or expert witness in a case about AI gone wrong. You'll build arguments, analyze evidence, and deliver a verdict.\n\nThese aren't hypothetical scenarios — they're based on real cases that have affected real people."
    },
    {
      id: "wu-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "Should companies be held legally responsible when their AI causes harm — even if the harm was unintentional? Why or why not?",
      placeholder: "I think... because..."
    },

    // ═══════════════════════════════════════════════════════
    // ACTIVITY
    // ═══════════════════════════════════════════════════════
    {
      id: "section-activity",
      type: "section_header",
      title: "The Trial",
      subtitle: "~30 minutes",
      icon: "⚖️"
    },
    {
      id: "activity-intro",
      type: "text",
      content: "You'll be assigned a case and a role. Your job is to build the strongest possible argument for your side — even if you personally disagree with it. The goal isn't to \"win\" — it's to understand all perspectives deeply."
    },
    {
      id: "roles-callout",
      type: "callout",
      icon: "📋",
      style: "objective",
      content: "**Roles:**\n\n⚔️ **Prosecution** — Argue that the AI system caused harm and the company is liable\n🛡️ **Defense** — Argue that the company acted reasonably and the AI's behavior was an acceptable risk\n🔬 **Expert Witness** — Provide technical analysis of how the AI works and what went wrong (or didn't)\n\nEach role requires a different kind of thinking — legal, technical, and ethical."
    },
    {
      id: "activity-block",
      type: "activity",
      title: "Launch AI Ethics Courtroom",
      icon: "⚖️",
      instructions: "1. Open the AI Ethics Courtroom (your teacher will share the link)\n2. Read your assigned case carefully\n3. Build your argument for your assigned role:\n   - **Prosecution:** What harm was caused? Who was affected? What should the company have done differently?\n   - **Defense:** What precautions did the company take? Was the harm foreseeable? What would be the cost of NOT using AI?\n   - **Expert Witness:** How does this AI system work? What specifically went wrong (or right)? What are the technical limitations?\n4. Write your argument (use evidence from the case, not just opinion)\n5. Deliver your personal verdict: LIABLE or NOT LIABLE"
    },
    {
      id: "evidence-tip",
      type: "callout",
      icon: "💡",
      style: "tip",
      content: "**Building a strong argument:**\n\n- Start with your strongest point\n- Use specific evidence from the case (not just \"AI is bad\" or \"AI is good\")\n- Acknowledge the other side's best argument — then explain why yours is stronger\n- Connect back to what you've learned about training data, bias, and AI limitations\n- Your personal verdict should follow logically from your evidence"
    },

    // ═══════════════════════════════════════════════════════
    // REFLECTION
    // ═══════════════════════════════════════════════════════
    {
      id: "section-reflect",
      type: "section_header",
      title: "Reflection",
      subtitle: "~10 minutes",
      icon: "🪞"
    },
    {
      id: "reflect-q1",
      type: "question",
      questionType: "short_answer",
      prompt: "What was the strongest argument you heard from the OTHER side (the side you didn't argue for)?",
      placeholder: "The strongest opposing argument was..."
    },
    {
      id: "reflect-q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When an AI system causes harm, who should be held responsible?",
      options: [
        "The AI itself — it made the decision",
        "The developers who built and trained it",
        "The company that deployed it without sufficient testing",
        "It depends on the specific situation — there's no single answer"
      ],
      correctIndex: 3,
      explanation: "AI accountability is complex. Sometimes developers are at fault (biased training data). Sometimes the deploying company is responsible (insufficient testing). Sometimes regulators failed to set standards. The key is that SOMEONE must be accountable — 'the AI did it' is never an acceptable answer."
    },
    {
      id: "reflect-q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What's one rule or regulation you think should exist for companies that deploy AI systems? Why?",
      placeholder: "I think there should be a rule that... because..."
    },
    {
      id: "bridge",
      type: "callout",
      icon: "➡️",
      style: "insight",
      content: "**Bridge:** You just argued about AI's impact on specific people. Next, we zoom out to the big picture — how AI is reshaping entire careers and industries, and what that means for your future."
    },

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
          term: "AI Accountability",
          definition: "The principle that humans — developers, companies, or regulators — must be responsible for the outcomes of AI systems. AI itself cannot be held responsible."
        },
        {
          term: "Algorithmic Harm",
          definition: "Damage caused by automated decision-making systems — including discrimination, privacy violations, and unfair outcomes — even when no human intended harm."
        },
        {
          term: "Due Diligence",
          definition: "The reasonable steps a company should take before deploying AI: testing for bias, monitoring for errors, having human oversight, and planning for failures."
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
  const lessonId = "ethics-courtroom";
  for (const course of courses) {
    await db.collection("courses").doc(course.courseId).collection("lessons").doc(lessonId).set(lesson);
    console.log(`✅ Seeded "${lesson.title}" → ${course.label}`);
  }
  console.log(`\n   Lesson ID: ${lessonId} | Order: ${lesson.order} | Blocks: ${lesson.blocks.length} | Visible: false`);
  process.exit(0);
}
seed().catch(err => { console.error("❌", err); process.exit(1); });
