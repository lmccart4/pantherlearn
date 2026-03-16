// seed-intro-to-charge.js
// Physics — Electrostatics Unit, Lesson 1 (order: 1)
// "Introduction to Electric Charge"
// Run: node scripts/seed-intro-to-charge.js

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
    icon: "⚡",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Describe the two types of electric charge and how they interact",
      "Explain charge at the atomic level (protons, electrons, neutrons)",
      "Distinguish between conductors and insulators",
      "Describe three methods of charging: friction, conduction, and induction",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** Why does a balloon stick to the wall after you rub it on your hair — and why does it eventually fall off?",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "You've probably experienced a static shock — touching a doorknob, sliding across a car seat, or pulling off a sweater in winter. What do you think is actually happening when you get shocked? Why does it happen more in winter?",
    difficulty: "remember",
  },

  // ─── WHAT IS CHARGE? ───────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔋",
    title: "What is Electric Charge?",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Electric charge is a **fundamental property of matter** — just like mass. But while mass creates gravitational force, charge creates **electric force**.\n\nThere are exactly **two types** of charge:\n- **Positive (+)** — carried by protons\n- **Negative (−)** — carried by electrons\n\nThe rules are simple:\n- **Like charges repel** (+ repels +, − repels −)\n- **Opposite charges attract** (+ attracts −)\n\nCharge is measured in **coulombs (C)**. One proton has a charge of +1.6 × 10⁻¹⁹ C. One electron has −1.6 × 10⁻¹⁹ C. These are incredibly tiny — it takes about 6.25 × 10¹⁸ electrons to make 1 coulomb.",
  },

  {
    id: uid(), type: "definition",
    term: "Electric Charge",
    definition: "A fundamental property of matter that causes it to experience electric force. Comes in two types: positive (protons) and negative (electrons). Measured in coulombs (C).",
  },

  {
    id: uid(), type: "definition",
    term: "Coulomb (C)",
    definition: "The SI unit of electric charge. 1 coulomb = the charge of about 6.25 × 10¹⁸ protons or electrons. Named after Charles-Augustin de Coulomb.",
  },

  {
    id: uid(), type: "text",
    content: "**At the atomic level:**\n\n| Particle | Location | Charge | Can it move? |\n|---|---|---|---|\n| Proton | Nucleus | +1.6 × 10⁻¹⁹ C | No — locked in the nucleus |\n| Neutron | Nucleus | 0 (neutral) | No |\n| Electron | Orbiting nucleus | −1.6 × 10⁻¹⁹ C | **Yes** — can transfer between atoms |\n\nKey insight: **only electrons move**. When we say an object is \"positively charged,\" we mean it has *lost* electrons — not that it gained protons. Protons are stuck in the nucleus and never transfer in static electricity.",
  },

  {
    id: uid(), type: "sorting",
    icon: "⚡",
    title: "Attract or Repel?",
    instructions: "For each pair of charges, decide whether they would **attract** or **repel** each other.",
    leftLabel: "Attract 🧲",
    rightLabel: "Repel 💥",
    items: [
      { text: "A positive charge near a negative charge", correct: "left" },
      { text: "Two positive charges near each other", correct: "right" },
      { text: "Two negative charges near each other", correct: "right" },
      { text: "A charged balloon near a neutral wall", correct: "left" },
      { text: "A proton near another proton", correct: "right" },
      { text: "An electron near a proton", correct: "left" },
      { text: "A negatively charged rod near a negatively charged sphere", correct: "right" },
      { text: "A positively charged plate near an electron", correct: "left" },
    ],
  },

  // ─── CONSERVATION OF CHARGE ────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⚖️",
    title: "Conservation of Charge",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Charge is always conserved.** You can't create charge. You can't destroy it. You can only **move it** from one object to another.\n\nWhen you rub a balloon on your hair:\n- Electrons transfer from your hair → balloon\n- Balloon becomes negative (gained electrons)\n- Hair becomes positive (lost electrons)\n- Total charge of the system = **zero** (unchanged)\n\nThis is the **law of conservation of charge** — one of the fundamental laws of physics. It's never been violated in any experiment ever conducted.",
  },

  {
    id: uid(), type: "definition",
    term: "Conservation of Charge",
    definition: "Electric charge can be transferred from one object to another, but it cannot be created or destroyed. The total charge of an isolated system always remains constant.",
  },

  {
    id: "q-conservation", type: "question",
    questionType: "multiple_choice",
    prompt: "A glass rod is rubbed with silk. The rod becomes positively charged with +3 μC. What is the charge on the silk?",
    difficulty: "apply",
    options: [
      "+3 μC — both objects gain positive charge",
      "0 μC — silk doesn't pick up charge",
      "−3 μC — the electrons that left the rod went to the silk",
      "−6 μC — silk gains double the charge",
    ],
    correctIndex: 2,
    explanation: "Conservation of charge. The rod lost electrons (became +3 μC), so those electrons went to the silk (−3 μC). Total system charge: +3 + (−3) = 0, unchanged.",
  },

  // ─── CONDUCTORS VS INSULATORS ──────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔌",
    title: "Conductors and Insulators",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Materials differ in how easily charges (electrons) can flow through them:\n\n**Conductors** — electrons move freely. Metals are the best conductors because their outer electrons aren't tightly bound to any one atom. They form a \"sea\" of electrons that can flow.\n\n**Insulators** — electrons are locked in place. Rubber, plastic, glass, and wood hold their electrons tightly. Charge stays wherever you put it.\n\nThis is why:\n- Power lines are made of metal (conductor) wrapped in rubber (insulator)\n- You get shocked touching a metal doorknob but not a wooden one\n- A charged balloon sticks to a wall but the charge doesn't spread across the whole wall",
  },

  {
    id: uid(), type: "definition",
    term: "Conductor",
    definition: "A material through which electric charges (electrons) can flow freely. Metals like copper, aluminum, and gold are excellent conductors because their outer electrons are loosely bound.",
  },

  {
    id: uid(), type: "definition",
    term: "Insulator",
    definition: "A material that resists the flow of electric charge. Electrons are tightly bound and don't move freely. Examples: rubber, glass, plastic, wood, dry air.",
  },

  {
    id: uid(), type: "sorting",
    icon: "🔌",
    title: "Conductor or Insulator?",
    instructions: "Classify each material as a **conductor** (charges flow freely) or an **insulator** (charges stay put).",
    leftLabel: "Conductor ⚡",
    rightLabel: "Insulator 🛑",
    items: [
      { text: "Copper wire", correct: "left" },
      { text: "Rubber gloves", correct: "right" },
      { text: "Aluminum foil", correct: "left" },
      { text: "Glass rod", correct: "right" },
      { text: "Gold ring", correct: "left" },
      { text: "Plastic wrap", correct: "right" },
      { text: "Steel nail", correct: "left" },
      { text: "Wooden stick", correct: "right" },
      { text: "Salt water", correct: "left" },
      { text: "Dry air", correct: "right" },
    ],
  },

  // ─── METHODS OF CHARGING ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧪",
    title: "Three Ways to Charge an Object",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "### 1. Charging by Friction\nRub two different materials together. Electrons transfer from one to the other.\n\n- Balloon on hair → balloon becomes negative, hair becomes positive\n- Glass rod on silk → rod becomes positive, silk becomes negative\n- Socks on carpet → you become charged (then ZAP the doorknob)\n\nWhich material \"wins\" the electrons depends on the **triboelectric series** — some materials hold electrons more tightly than others.",
  },

  {
    id: uid(), type: "text",
    content: "### 2. Charging by Conduction (Contact)\nTouch a charged object to a neutral one. Charge flows until both reach the same charge.\n\n- Touch a charged rod to a neutral metal sphere → electrons transfer through direct contact\n- Both objects end up with the **same sign** of charge\n- Think of it like pouring water between two connected containers — it levels out",
  },

  {
    id: uid(), type: "text",
    content: "### 3. Charging by Induction (No Contact)\nBring a charged object near (but not touching) a conductor. The charges inside the conductor **rearrange**.\n\n- Negative rod near a metal sphere → sphere's electrons are repelled to the far side\n- Near side becomes positive, far side becomes negative\n- If you **ground** the far side (touch it to drain electrons), then remove the ground, then remove the rod — the sphere is left with a net positive charge\n- **No contact needed** — the final charge is **opposite** to the inducing charge\n\nThis is the sneakiest method. The charged rod never touches the sphere, yet the sphere ends up charged.",
  },

  {
    id: "q-methods", type: "question",
    questionType: "multiple_choice",
    prompt: "A positively charged rod is brought near a neutral metal sphere without touching it. Electrons in the sphere are:",
    difficulty: "apply",
    options: [
      "Repelled to the far side of the sphere",
      "Attracted toward the rod (near side of the sphere)",
      "Destroyed by the rod's positive charge",
      "Unaffected because the rod isn't touching",
    ],
    correctIndex: 1,
    explanation: "The positive rod attracts the sphere's electrons toward the near side (opposite charges attract). This is the first step of charging by induction. The sphere is still neutral overall, but its charge is separated.",
  },

  {
    id: "q-conduction", type: "question",
    questionType: "multiple_choice",
    prompt: "Two identical metal spheres: Sphere A has a charge of +8 μC, Sphere B is neutral (0 μC). They are touched together and then separated. What is the charge on each sphere?",
    difficulty: "apply",
    options: [
      "A: +8 μC, B: 0 μC (charge doesn't transfer between metals)",
      "A: +4 μC, B: +4 μC (charge splits evenly)",
      "A: 0 μC, B: +8 μC (all charge transfers)",
      "A: +6 μC, B: +2 μC (partial transfer)",
    ],
    correctIndex: 1,
    explanation: "When identical conductors touch, charge distributes evenly. Total charge = +8 μC. Split between 2 spheres: +4 μC each. Charge is conserved: 4 + 4 = 8.",
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
    prompt: "An atom has 17 protons and 18 electrons. The atom is:",
    difficulty: "apply",
    options: [
      "Neutral",
      "A positive ion with charge +1",
      "A negative ion with charge −1",
      "Impossible — atoms can't have more electrons than protons",
    ],
    correctIndex: 2,
    explanation: "17 protons (+17) and 18 electrons (−18) = net charge of −1. This is a negative ion (anion) — it gained one extra electron. This is perfectly normal and very common (chlorine does this).",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "Why do you get shocked more often in winter than summer?",
    difficulty: "analyze",
    options: [
      "Cold air has more charge in it",
      "Dry winter air is a better insulator, so charge builds up instead of leaking away gradually",
      "Winter clothing creates more friction than summer clothing",
      "Your body produces more electrons when it's cold",
    ],
    correctIndex: 1,
    explanation: "Humid summer air is slightly conductive (water molecules carry charge away). Dry winter air is an insulator, so charge from friction (walking on carpet, wearing sweaters) builds up on your body with no way to leak off — until you touch a conductor and ZAP.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "short_answer",
    prompt: "A student rubs a plastic rod with fur. The rod gains a charge of −5 μC. Using conservation of charge, determine the charge on the fur. Then explain: did the fur gain electrons, lose electrons, or neither? How do you know?",
    difficulty: "apply",
  },

  // ─── WRAP UP ───────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Key takeaways:**\n\n- Two types of charge: **positive** (protons) and **negative** (electrons). Likes repel, opposites attract.\n- **Only electrons move.** Positive charge means \"missing electrons,\" not \"extra protons.\"\n- Charge is **always conserved** — transfer only, never created or destroyed.\n- **Conductors** let charge flow (metals). **Insulators** trap charge in place (rubber, plastic).\n- Three charging methods: **friction** (rubbing), **conduction** (contact), **induction** (no contact, charge rearrangement).\n\nNext class: you'll learn how to **calculate** the force between charged objects using Coulomb's Law.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** The balloon sticks because rubbing transferred electrons from your hair to the balloon, making it negatively charged. The negative balloon induces a positive charge on the wall's surface (induction), and opposite charges attract. It eventually falls because the excess electrons slowly leak away through the air — especially on humid days.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer about static shocks. Now explain what's actually happening using the correct physics vocabulary: charge, electrons, conductor, insulator, and conservation of charge.",
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
      { term: "Electric Charge", definition: "A fundamental property of matter. Positive (protons) or negative (electrons). Measured in coulombs (C). Like charges repel; opposite charges attract." },
      { term: "Coulomb (C)", definition: "The SI unit of electric charge. 1 C ≈ 6.25 × 10¹⁸ electron charges." },
      { term: "Conductor", definition: "Material where electrons flow freely (metals, salt water). Charge distributes evenly across the surface." },
      { term: "Insulator", definition: "Material where electrons can't flow freely (rubber, glass, plastic). Charge stays where you put it." },
      { term: "Conservation of Charge", definition: "Charge cannot be created or destroyed — only transferred. Total charge of an isolated system is always constant." },
      { term: "Charging by Friction", definition: "Rubbing two materials transfers electrons from one to the other. Both end up charged (opposite signs)." },
      { term: "Charging by Conduction", definition: "Direct contact transfers charge. Both objects end up with the same sign of charge." },
      { term: "Charging by Induction", definition: "A nearby charge causes charge separation in a conductor — no contact needed. Final charge is opposite to the inducing charge." },
      { term: "Ion", definition: "An atom with unequal protons and electrons. Positive ion (cation) = lost electrons. Negative ion (anion) = gained electrons." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("intro-to-charge");

  const data = {
    title: "Introduction to Electric Charge",
    questionOfTheDay: "Why does a balloon stick to the wall after you rub it on your hair — and why does it eventually fall off?",
    course: "Physics",
    unit: "Electrostatics",
    order: 1,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded: "${data.title}"`);
  console.log(`   Path: courses/${COURSE_ID}/lessons/intro-to-charge`);
  console.log(`   Blocks: ${blocks.length}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
