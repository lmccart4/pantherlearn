// seed-electric-fields.js
// Physics — Electrostatics Unit, Lesson 3 (order: 3)
// "Electric Fields"
// Run: node scripts/seed-electric-fields.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧲",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Define an electric field and explain what creates it",
      "Draw electric field lines for positive charges, negative charges, and dipoles",
      "Use field line density to determine where the field is strongest",
      "Predict the direction of force on a charge placed in an electric field",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** You can't see electric force — but you can map it. If you could \"see\" the electric field around your phone's battery, what would it look like?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "Coulomb's Law says two charges exert a force on each other even when they're not touching. But how does charge A 'know' charge B is there? How does the force get transmitted across empty space?",
    difficulty: "understand",
  },

  // ─── WHAT IS AN ELECTRIC FIELD? ────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📡",
    title: "What is an Electric Field?",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Here's the answer to the warm-up question: charges don't \"reach out\" and touch each other directly. Instead, every charge creates an invisible **electric field** in the space around it. When another charge enters that field, the field pushes or pulls it.\n\nThink of it like gravity: Earth doesn't \"reach out\" to grab you. Instead, Earth creates a gravitational field, and anything with mass inside that field experiences a force.\n\n**An electric field is a region of space where a charged object would experience a force.**\n\nThe field exists whether or not there's a second charge to feel it — just like gravity exists whether or not you're standing on the ground.",
  },

  {
    id: uid(), type: "definition",
    term: "Electric Field",
    definition: "A region of space around a charged object where other charged objects experience an electric force. Represented by field lines. The field exists even if no other charge is present.",
  },

  {
    id: uid(), type: "text",
    content: "**The test charge concept:**\n\nWe define the direction of an electric field using an imaginary **positive test charge** — a tiny positive charge we place in the field to see which way it would be pushed.\n\n- Near a **positive** source charge → test charge is repelled → field points **outward** (away)\n- Near a **negative** source charge → test charge is attracted → field points **inward** (toward)\n\n**Rule: Electric field lines always point away from positive and toward negative.**\n\nThis is a convention — we chose positive as the reference direction. If you place a negative charge in a field, it feels a force **opposite** to the field direction.",
  },

  {
    id: uid(), type: "definition",
    term: "Test Charge",
    definition: "An imaginary small positive charge used to map electric fields. The direction the test charge would move defines the direction of the electric field at that point.",
  },

  // ─── FIELD LINE RULES ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📏",
    title: "Drawing Electric Field Lines",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Electric field lines follow strict rules:\n\n1. **Start on positive charges, end on negative charges** (or go to infinity)\n2. **Never cross** — at any point in space, the field has only one direction\n3. **Closer together = stronger field** — line density represents field strength\n4. **Farther apart = weaker field** — the field gets weaker as you move away\n5. **Perpendicular to the surface** of a conductor\n\n### Common Field Patterns\n\n**Single positive charge (+):**\nLines radiate outward in all directions, like rays from the sun. Dense near the charge, sparse far away.\n\n**Single negative charge (−):**\nLines point inward from all directions, converging on the charge. Dense near, sparse far.\n\n**Dipole (+ and − near each other):**\nLines start at the + charge and curve around to end at the − charge. Strongest in the region between them.\n\n**Two positive charges (+ and +):**\nLines radiate outward from both. Between the charges, lines repel each other — there's a \"dead zone\" where the field is zero.\n\n**Parallel plates (+ plate and − plate):**\nUniform straight lines from + to − plate. Equal spacing = equal field strength everywhere between the plates.",
  },

  {
    id: "q-direction", type: "question",
    questionType: "multiple_choice",
    prompt: "A positive test charge is placed to the right of a negative source charge. The electric field at the test charge's location points:",
    difficulty: "apply",
    options: [
      "To the right (away from the negative charge)",
      "To the left (toward the negative charge)",
      "Upward (perpendicular to the line between charges)",
      "The field is zero at that point",
    ],
    correctIndex: 1,
    explanation: "Field lines point toward negative charges. The positive test charge would be attracted toward the negative source, so the field at that location points left (toward the negative charge).",
  },

  {
    id: uid(), type: "sorting",
    icon: "📏",
    title: "Field Line Facts",
    instructions: "Decide whether each statement about electric field lines is **true** or **false**.",
    leftLabel: "True ✅",
    rightLabel: "False ❌",
    items: [
      { text: "Field lines start on positive charges", correct: "left" },
      { text: "Field lines can cross each other", correct: "right" },
      { text: "Closer field lines mean a stronger electric field", correct: "left" },
      { text: "A negative charge creates field lines that point outward", correct: "right" },
      { text: "Between parallel plates, the electric field is uniform", correct: "left" },
      { text: "A positive charge placed in a field moves in the direction of the field", correct: "left" },
      { text: "A negative charge placed in a field moves in the direction of the field", correct: "right" },
      { text: "The electric field inside a conductor is zero", correct: "left" },
    ],
  },

  // ─── FIELD SKETCHING ───────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✏️",
    title: "Field Sketching Practice",
    subtitle: "~8 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Sketching field lines is the most intuitive way to visualize electric forces. Practice the following patterns on paper or use the drawing tool below.",
  },

  {
    id: "sketch-field", type: "sketch",
    title: "Draw the Electric Field",
    instructions: "Sketch the electric field lines for a dipole: a positive charge (+) on the left and a negative charge (−) on the right. Remember:\n- Lines start at + and end at −\n- Lines curve smoothly (no sharp corners)\n- More lines near the charges (stronger field)\n- Lines never cross",
  },

  {
    id: "q-strongest", type: "question",
    questionType: "multiple_choice",
    prompt: "In a dipole (+ charge near a − charge), where is the electric field the STRONGEST?",
    difficulty: "understand",
    options: [
      "Far away from both charges",
      "Exactly halfway between the two charges",
      "Very close to either charge",
      "The field is the same everywhere",
    ],
    correctIndex: 2,
    explanation: "Field strength ∝ 1/r². Close to either charge, the field lines are densely packed → strong field. Between the charges the field is strong too, but the very strongest points are right next to the charges where line density is highest.",
  },

  // ─── FORCE ON A CHARGE IN A FIELD ──────────────────────

  {
    id: uid(), type: "section_header",
    icon: "💪",
    title: "Force on a Charge in a Field",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "If you know the electric field at some location, you can calculate the force on any charge placed there:\n\n## F = qE\n\nWhere:\n- **F** = force (newtons, N)\n- **q** = charge of the object (coulombs, C)\n- **E** = electric field strength (N/C)\n\n**Direction rules:**\n- **Positive charge** → force in the **same direction** as the field\n- **Negative charge** → force in the **opposite direction** of the field\n\nThis is why we define the field using a positive test charge — positive charges \"go with the flow.\"",
  },

  {
    id: uid(), type: "definition",
    term: "Electric Field Strength (E)",
    definition: "The force per unit charge at a point in space. E = F/q. Measured in newtons per coulomb (N/C). Indicates how strong the electric force would be on a charge placed at that location.",
  },

  {
    id: "q-force", type: "question",
    questionType: "multiple_choice",
    prompt: "An electric field of 500 N/C points to the right. A charge of −3 μC is placed in the field. The force on the charge is:",
    difficulty: "apply",
    options: [
      "1.5 × 10⁻³ N to the right",
      "1.5 × 10⁻³ N to the left",
      "500 N to the right",
      "1,500 N to the left",
    ],
    correctIndex: 1,
    explanation: "F = qE = (3 × 10⁻⁶)(500) = 1.5 × 10⁻³ N. The charge is negative, so the force is OPPOSITE to the field → to the left.",
  },

  // ─── CHECK YOUR UNDERSTANDING ──────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Check Your Understanding",
    subtitle: "~5 minutes",
  },

  {
    id: "q-check1", type: "question",
    questionType: "multiple_choice",
    prompt: "Electric field lines around a single positive charge:",
    difficulty: "remember",
    options: [
      "Point inward toward the charge",
      "Point outward away from the charge",
      "Form circles around the charge",
      "Only exist if another charge is nearby",
    ],
    correctIndex: 1,
    explanation: "A positive test charge would be repelled outward by a positive source charge, so the field lines radiate outward. The field exists whether or not another charge is present.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "Between two parallel plates (positive on top, negative on bottom), a positive charge placed between them will accelerate:",
    difficulty: "apply",
    options: [
      "Upward, toward the positive plate",
      "Downward, toward the negative plate",
      "Horizontally, along the plates",
      "It won't move — the fields cancel",
    ],
    correctIndex: 1,
    explanation: "The field between parallel plates points from + to − (top to bottom). A positive charge moves in the direction of the field → downward toward the negative plate.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "Describe the electric field line pattern for two positive charges of equal magnitude placed near each other. Where is the field zero? Where is it strongest? How is this different from a dipole pattern?",
    difficulty: "analyze",
  },

  // ─── WRAP UP ───────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~3 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Key ideas:**\n\n- Every charge creates an **electric field** in the space around it\n- Field lines: **away from +, toward −, never cross**\n- **Dense lines = strong field, sparse lines = weak field**\n- **F = qE** gives the force on a charge in a field\n- Positive charges move **with** the field; negative charges move **against** it\n- Parallel plates create a **uniform** field — same everywhere between the plates\n\nNext class: **electric potential** — the energy landscape of electric fields.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** Your phone's battery has a positive terminal and a negative terminal — like a dipole. The electric field inside would look like curved field lines from + to −, densely packed. This field is what pushes electrons through the circuit to power your phone. Outside the battery, the field fades quickly with distance (inverse square law).",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer. You asked how charge A 'knows' charge B is there. Now explain it using the concept of an electric field.",
    difficulty: "evaluate",
    linkedBlockId: "q-warmup",
  },

  // ─── VOCABULARY ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📖",
    title: "Key Vocabulary",
    subtitle: "",
  },

  {
    id: uid(), type: "vocab_list",
    terms: [
      { term: "Electric Field", definition: "A region of space where a charged object experiences an electric force. Created by charges. Represented by field lines." },
      { term: "Field Lines", definition: "Imaginary lines that map the electric field. Start at + charges, end at − charges. Density indicates field strength. Never cross." },
      { term: "Test Charge", definition: "An imaginary small positive charge used to define field direction. The field points the way a positive test charge would move." },
      { term: "Electric Field Strength (E)", definition: "Force per unit charge at a point in space. E = F/q. Measured in N/C." },
      { term: "Dipole", definition: "A pair of equal and opposite charges separated by a small distance. Creates a characteristic curved field line pattern." },
      { term: "Uniform Field", definition: "An electric field with the same strength and direction at every point. Created between parallel charged plates." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("electric-fields");

  const data = {
    title: "Electric Fields",
    questionOfTheDay: "You can't see electric force — but you can map it. If you could 'see' the electric field around your phone's battery, what would it look like?",
    course: "Physics",
    unit: "Electrostatics",
    order: 3,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/electric-fields`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
