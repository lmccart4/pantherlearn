// seed-sci-process-cer.js
// Creates "CER Framework: Claim, Evidence, Reasoning" lesson (Unit 0: Scientific Process, Lesson 3)
// Run: node scripts/seed-sci-process-cer.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "CER Framework: Claim, Evidence, Reasoning",
  questionOfTheDay: "What's the difference between saying 'The experiment worked' and saying 'The data shows X, which supports the claim that Y because of the principle Z'?",
  course: "Physics",
  unit: "Scientific Process",
  order: 3,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🏃",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** What's the difference between saying 'The experiment worked' and saying 'The data shows X, which supports the claim that Y because of principle Z'? Which one is more useful to a scientist reading your report?"
    },
    {
      id: "callout-cer-importance",
      type: "callout",
      style: "insight",
      icon: "⚠️",
      content: "**You will use CER for every lab write-up this year.** This is the single most important scientific communication skill in this course. Learn it now — you'll thank yourself later."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Scenario: Two students drop a ball from 2 m and measure it takes 0.6 seconds to fall. Student A writes: 'It fell fast.' Student B writes: 'The ball fell 2 m in 0.6 s, giving g ≈ 11 m/s², which is close to the accepted 9.8 m/s².' Who wrote a better lab conclusion? Why?",
      placeholder: "Student [A/B] is better because...",
      difficulty: "recall"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define Claim, Evidence, and Reasoning as distinct components",
        "Distinguish strong vs. weak examples of each component",
        "Write a complete CER response for a given scenario",
        "Evaluate a provided CER response and identify what is missing or weak"
      ]
    },

    // ═══════════════════════════════════════════
    // WHAT IS CER
    // ═══════════════════════════════════════════
    {
      id: "section-cer-intro",
      type: "section_header",
      icon: "📝",
      title: "What is CER?",
      subtitle: "~10 minutes"
    },
    {
      id: "b-cer-intro",
      type: "text",
      content: "**CER** is a framework for writing scientific conclusions and lab responses. It stands for:\n\n- **C — Claim:** A direct, testable answer to the investigation question\n- **E — Evidence:** Specific data from the investigation that supports the claim\n- **R — Reasoning:** The scientific principle that connects the evidence to the claim\n\nEach component has a job. Leave one out and your conclusion falls apart."
    },
    {
      id: "b-def-claim",
      type: "definition",
      term: "Claim",
      definition: "A direct answer to the investigation question. Should be a clear, testable statement. Does NOT include data or explanation — just the conclusion."
    },
    {
      id: "b-def-evidence",
      type: "definition",
      term: "Evidence",
      definition: "Specific, quantitative data from the investigation that supports the claim. Not vague ('it went faster') but precise ('the block accelerated at 2.3 m/s²'). Usually includes numbers."
    },
    {
      id: "b-def-reasoning",
      type: "definition",
      term: "Reasoning",
      definition: "The scientific principle or concept that connects the evidence to the claim. Answers 'WHY does this evidence support this claim?' References relevant physics laws, definitions, or theories."
    },

    // ═══════════════════════════════════════════
    // GOOD VS WEAK EXAMPLES
    // ═══════════════════════════════════════════
    {
      id: "section-examples",
      type: "section_header",
      icon: "🔍",
      title: "Good vs. Weak CER",
      subtitle: "~15 minutes"
    },
    {
      id: "b-scenario",
      type: "text",
      content: "### Investigation Scenario\n\n*A class tested whether mass affects how fast an object falls. They dropped a 0.01 kg marble and a 0.5 kg ball from 3 m height and timed both. Both fell in approximately 0.78 seconds.*\n\n**Investigation question:** Does mass affect the time it takes an object to fall?\n\n---\n\n### Comparison: Weak vs. Strong CER\n\n**WEAK CER:**\n> C: \"The ball fell in about the same time.\"\n> E: \"Both objects fell similarly.\"\n> R: \"Because of gravity.\"\n\n**STRONG CER:**\n> C: \"Mass does not affect the time it takes an object to fall in the absence of air resistance.\"\n> E: \"The 0.01 kg marble fell 3 m in 0.78 s. The 0.5 kg ball fell 3 m in 0.78 s — a difference of less than 0.02 s, within measurement error.\"\n> R: \"According to Newton's Second Law (ΣF = ma), the gravitational force on an object equals mg. In free fall, a = F_g/m = mg/m = g. The mass cancels, so all objects should fall with the same acceleration regardless of mass (g = 9.8 m/s²). Our data is consistent with this prediction.\""
    },
    {
      id: "b-what-makes-strong",
      type: "text",
      content: "### Why is the Strong CER Better?\n\n| Component | Weak version | Strong version |\n|---|---|---|\n| **Claim** | Vague, not a direct answer | Clear, direct answer to the question |\n| **Evidence** | No numbers, vague language | Specific measurements with units |\n| **Reasoning** | Name-drops a concept without explanation | Explains HOW the science connects data to claim |\n\n**Common CER mistakes:**\n- Putting data in the Claim\n- Putting the conclusion in the Evidence\n- Reasoning that just restates the Claim (circular)\n- Evidence without units\n- Reasoning that doesn't mention any scientific principle"
    },
    {
      id: "q-cer-identify-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "\"The data showed the block moved 0.45 m in 1 second.\" Which CER component is this?",
      options: [
        "Claim",
        "Evidence",
        "Reasoning",
        "Hypothesis"
      ],
      correctIndex: 1,
      explanation: "This is Evidence — it's a specific measurement with units. It's data from an investigation, not a conclusion (Claim) or explanation (Reasoning).",
      difficulty: "understand"
    },
    {
      id: "q-cer-identify-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "\"As surface area increases, friction force does not change because friction depends on the normal force and the coefficient of friction (f = μF_N), not on the contact area.\" Which CER component is this?",
      options: [
        "Claim",
        "Evidence",
        "Reasoning",
        "Both Evidence and Reasoning"
      ],
      correctIndex: 2,
      explanation: "This is Reasoning — it explains WHY surface area doesn't matter by referencing the friction equation f = μF_N. It connects a scientific principle to the investigation result.",
      difficulty: "apply"
    },
    {
      id: "q-cer-identify-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "\"Friction force is affected by the type of surface, not by contact area.\" Which CER component is this?",
      options: [
        "Claim — directly answers the investigation question",
        "Evidence — it's specific data",
        "Reasoning — it explains why",
        "This is too vague to be any component"
      ],
      correctIndex: 0,
      explanation: "This is a Claim — it directly answers the investigation question ('what affects friction?') with a testable conclusion. It doesn't include data (no numbers) and it doesn't explain why — those go in Evidence and Reasoning.",
      difficulty: "apply"
    },
    {
      id: "q-cer-identify-4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "\"The experiment went well.\" Which CER component is this?",
      options: [
        "Claim",
        "Evidence",
        "Reasoning",
        "None — this is not a valid CER component"
      ],
      correctIndex: 3,
      explanation: "This is not a CER component. It's a vague statement about the procedure, not a scientific conclusion. A Claim needs to answer the investigation question; Evidence needs specific data; Reasoning needs a scientific principle. 'It went well' does none of these.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // WRITE A CER
    // ═══════════════════════════════════════════
    {
      id: "section-write-cer",
      type: "section_header",
      icon: "✏️",
      title: "Write Your Own CER",
      subtitle: "~10 minutes"
    },
    {
      id: "b-cer-scenario",
      type: "text",
      content: "### Scenario for Your CER\n\nA student tested whether adding mass to a cart affects its acceleration. They used a ramp and spring scale. The data:\n\n| Mass of cart | Applied force | Acceleration |\n|---|---|---|\n| 1 kg | 2 N | 2.0 m/s² |\n| 2 kg | 2 N | 1.0 m/s² |\n| 4 kg | 2 N | 0.5 m/s² |\n\n**Investigation question:** Does increasing the mass of a cart (while keeping force constant) affect its acceleration?"
    },
    {
      id: "q-write-cer",
      type: "question",
      questionType: "short_answer",
      prompt: "Write a complete CER response for the investigation above. Include:\n- C: A direct answer to the investigation question\n- E: Specific data from the table (with numbers and units)\n- R: Reference to Newton's Second Law to explain why",
      placeholder: "C: ...\n\nE: ...\n\nR: ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
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
      content: "Today's key takeaways:\n\n- **Claim:** Direct answer to the investigation question — no data, no explanation\n- **Evidence:** Specific, quantitative data — always include numbers and units\n- **Reasoning:** Scientific principle that explains WHY the evidence supports the claim\n- All three are required — a missing component weakens the entire conclusion\n- CER is used for every lab write-up this year — this is not optional\n\n**Next up:** Start of Unit 2 — Motion in 1D. You'll write CER in every lab starting now."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A classmate submits this CER. Identify what is missing or weak in each component, and explain how to fix it.\n\nC: 'The experiment showed friction is important.'\nE: 'We found friction was higher when we added weight.'\nR: 'Friction happened.'",
      placeholder: "C is weak because... Fix: ... E is weak because... Fix: ... R is weak because... Fix: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
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
        { term: "Claim", definition: "A direct, testable answer to the investigation question. No data, no explanation — just the conclusion." },
        { term: "Evidence", definition: "Specific, quantitative data from the investigation that supports the claim. Always includes numbers and units." },
        { term: "Reasoning", definition: "The scientific principle or concept that explains WHY the evidence supports the claim. Connects data to conclusion through science." },
        { term: "CER Framework", definition: "Claim-Evidence-Reasoning. A structure for scientific writing used in lab conclusions and explanations throughout the course." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("sci-process-cer")
      .set(lesson);
    console.log('✅ Lesson "CER Framework: Claim, Evidence, Reasoning" seeded successfully!');
    console.log(`   📦 ${lesson.blocks.length} blocks`);
    console.log(`   📘 Course: ${lesson.course}`);
    console.log(`   📂 Unit: ${lesson.unit}`);
    console.log(`   🔢 Order: ${lesson.order}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
