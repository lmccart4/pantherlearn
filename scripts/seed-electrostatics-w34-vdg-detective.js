// seed-electrostatics-w34-vdg-detective.js
// Electrostatics — Week 34, Mon 5/4 (42 min, P1)
// VDG Charge Detective — charge-sharing model + triboelectric series + design/run capstone
// Run: node scripts/seed-electrostatics-w34-vdg-detective.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lessonId = "electrostatics-w34-vdg-detective";
const lesson = {
  title: "VDG Charge Detective — Designing the Test",
  questionOfTheDay: "We've been calling it the mysterious machine. Today: is the dome positive or negative — and how do you prove it?",
  course: "Physics",
  unit: "Electrostatics",
  order: 10,
  visible: false,
  dueDate: "2026-05-04",
  gradesReleased: true,
  blocks: [
    // ── Block 1 ──────────────────────────────────────────────────────────
    {
      id: "w34vdg-sec-welcome",
      type: "section_header",
      icon: "🔍",
      title: "Today: Settle the Mystery",
      subtitle: "~2 min"
    },
    // ── Block 2 ──────────────────────────────────────────────────────────
    {
      id: "w34vdg-callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** We've been calling it the mysterious machine. Today: is the dome positive or negative — and how do you prove it?"
    },
    // ── Block 3 ──────────────────────────────────────────────────────────
    {
      id: "w34vdg-objectives",
      type: "objectives",
      title: "What You'll Figure Out",
      items: [
        "Predict charge after two conductors touch using $q_f = \\frac{q_1 + q_2}{2}$",
        "Read a triboelectric series to predict who becomes + and who becomes − after rubbing",
        "Design and run an experiment that determines the sign of an unknown charged object"
      ]
    },
    // ── Block 4 ──────────────────────────────────────────────────────────
    {
      id: "w34vdg-text-sharing-model",
      type: "text",
      content: "## Part 1 — The Charge-Sharing Model\n\nWhen two **equal-size conductors** touch, their charges redistribute evenly. The charge on each after they separate is:\n\n$$q_f = \\frac{q_1 + q_2}{2}$$\n\n**Worked example:** One sphere carries $+3$ units; another carries $-7$ units. When they touch:\n\n$$q_f = \\frac{(+3) + (-7)}{2} = \\frac{-4}{2} = -2$$\n\nBoth spheres end up with $-2$ units each. The total charge ($-4$) is conserved — it just redistributes equally.\n\n*Assumption: equal-size objects. Good enough for high school, and close enough for the real-world objects you'll use today.*"
    },
    // ── Block 5 ──────────────────────────────────────────────────────────
    // correctIndex: 1 → answer is at position B
    {
      id: "w34vdg-q-share-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two equal-size metal spheres carry +6 and −2. They touch and separate. What is the final charge on each sphere?",
      options: [
        "+4",
        "+2",
        "+8",
        "−2"
      ],
      correctIndex: 1,
      explanation: "$q_f = \\frac{(+6) + (-2)}{2} = \\frac{+4}{2} = +2$. Each sphere ends up with $+2$.",
      difficulty: "apply"
    },
    // ── Block 6 ──────────────────────────────────────────────────────────
    // correctIndex: 2 → answer is at position C
    {
      id: "w34vdg-q-share-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A neutral metal sphere touches an identical sphere with charge +4. After contact and separation, each sphere has:",
      options: [
        "+4",
        "0",
        "+2",
        "+1"
      ],
      correctIndex: 2,
      explanation: "Neutral means $q = 0$. So $q_f = \\frac{(+4) + 0}{2} = +2$. Half the charge moves to the neutral sphere; both leave with $+2$.",
      difficulty: "apply"
    },
    // ── Block 7 ──────────────────────────────────────────────────────────
    // correctIndex: 3 → answer is at position D
    {
      id: "w34vdg-q-share-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Equal-size spheres with −5 and −1 touch and separate. What is the final charge on each sphere?",
      options: [
        "−2",
        "−6",
        "−4",
        "−3"
      ],
      correctIndex: 3,
      explanation: "$q_f = \\frac{(-5) + (-1)}{2} = \\frac{-6}{2} = -3$. Both spheres end up with $-3$.",
      difficulty: "apply"
    },
    // ── Block 8 ──────────────────────────────────────────────────────────
    {
      id: "w34vdg-sec-series",
      type: "section_header",
      icon: "📋",
      title: "Part 2 — Reading the Series",
      subtitle: "~10 min"
    },
    // ── Block 9 ──────────────────────────────────────────────────────────
    {
      id: "w34vdg-image-series",
      type: "image",
      url: "https://pantherlearn.com/lesson-images/triboelectric-kit-series.png",
      alt: "Triboelectric series for our kit, ranked from fur (most positive) at top to PVC (most negative) at bottom",
      caption: "The triboelectric series for the materials in your kit."
    },
    // ── Block 10 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-text-series-howto",
      type: "text",
      content: "When you rub two materials together, electrons move from the one **higher** on the series (it gives them up more easily) to the one **lower** on the series (it holds them more tightly).\n\nThe higher material becomes **positive**. The lower material becomes **negative**.\n\nThe further apart two materials are on the series, the stronger the charge transfer when they're rubbed together."
    },
    // ── Block 11 ─────────────────────────────────────────────────────────
    // correctIndex: 2 → answer is at position C
    {
      id: "w34vdg-q-rub-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You rub fur on a PVC pipe. After rubbing, what charges do the fur and PVC have?",
      options: [
        "Fur becomes −, PVC becomes +",
        "Both become −",
        "Fur becomes +, PVC becomes −",
        "Both become +"
      ],
      correctIndex: 2,
      explanation: "Fur sits at the top of the series (gives up electrons easily) and PVC sits at the bottom (holds electrons tightly). Electrons move fur → PVC, leaving fur + and PVC −.",
      difficulty: "apply"
    },
    // ── Block 12 ─────────────────────────────────────────────────────────
    // correctIndex: 1 → answer is at position B
    // MC correctIndex distribution (blocks 5,6,7,11,12): B=1, C=2, D=1, B=1 → A=0, B=2, C=2, D=1
    // Adjusted: q-share-1→B(1), q-share-2→C(2), q-share-3→D(3), q-rub-1→C(2), q-rub-2→B(1)
    // Final distribution: A=0, B=2, C=2, D=1 — no position ≥3, within acceptable spread.
    {
      id: "w34vdg-q-rub-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You rub a latex balloon with cotton cloth. What charges result?",
      options: [
        "Latex becomes +, cotton becomes −",
        "Latex becomes −, cotton becomes +",
        "Both become −",
        "Both become +"
      ],
      correctIndex: 1,
      explanation: "Cotton sits above latex on the series, so cotton gives up electrons to latex. Cotton ends up + and latex ends up −.",
      difficulty: "apply"
    },
    // ── Block 13 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-sec-design",
      type: "section_header",
      icon: "🧪",
      title: "Part 3 — Design and Run",
      subtitle: "~25 min"
    },
    // ── Block 14 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-text-brief",
      type: "text",
      content: "Your job: figure out whether the Van de Graaff generator's dome is **positive** or **negative**.\n\n**Materials available:** fur, cotton cloth, latex balloons, green vinyl, PVC pipe, electroscope, suspended foil-ball test object.\n\n**Safety rules — non-negotiable:**\n- Discharge the dome with a grounded rod between every test\n- One operator at the machine at a time\n- No jewelry, no metal in pockets\n- Bring charged test objects toward the dome **slowly and perpendicular** — never wave them\n- VDG OFF and discharged when you're not actively testing"
    },
    // ── Block 15 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-q-procedure",
      type: "question",
      questionType: "short_answer",
      scored: true,
      weight: 1,
      prompt: "Write your procedure. Which materials do you charge and how? What touches or approaches the dome? What specific observation tells you the dome is + vs −? Be precise — I should be able to follow your steps."
    },
    // ── Block 16 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-q-predict",
      type: "question",
      questionType: "short_answer",
      scored: true,
      weight: 1,
      prompt: "Predicted outcomes table. Fill in both: If the dome is POSITIVE, my charged test object will _____ (and why). If the dome is NEGATIVE, it will _____ (and why)."
    },
    // ── Block 17 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-text-runit",
      type: "text",
      content: "Now run it. Group rotation at the VDG. You operate. I'll discharge the dome between groups. Take notes on what you actually observe — predictions are great until reality disagrees."
    },
    // ── Block 18 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-q-claim",
      type: "question",
      questionType: "short_answer",
      scored: true,
      weight: 1,
      prompt: "Claim + evidence. The VDG dome is ______. My evidence is ______. (Write a complete sentence each.)"
    },
    // ── Block 19 ─────────────────────────────────────────────────────────
    {
      id: "w34vdg-q-reflection",
      type: "question",
      questionType: "short_answer",
      scored: true,
      weight: 1,
      prompt: "Reflection: What did the triboelectric series let you do that pure observation couldn't? Two sentences."
    }
  ]
};

// MC correctIndex distribution check (blocks 5, 6, 7, 11, 12):
// w34vdg-q-share-1  → correctIndex 1 (B)
// w34vdg-q-share-2  → correctIndex 2 (C)
// w34vdg-q-share-3  → correctIndex 3 (D)
// w34vdg-q-rub-1    → correctIndex 2 (C)
// w34vdg-q-rub-2    → correctIndex 1 (B)
// Final distribution: A=0, B=2, C=2, D=1 — no position has 3+, spread is acceptable.

async function seed() {
  try {
    const result = await safeLessonWrite(db, "physics", lessonId, lesson);
    console.log("✅ Lesson seeded: VDG Charge Detective (Mon 5/4)");
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   🛡  Action: ${result.action} (preserved ${result.preserved} IDs)`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}
seed();
