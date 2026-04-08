// seed-electrostatics-intro-to-charge.js
// Creates "Introduction to Electric Charge" lesson (Electrostatics Unit, Lesson 1)
// Run: node scripts/seed-electrostatics-intro-to-charge.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Introduction to Electric Charge",
  questionOfTheDay: "You rub a balloon on your hair and it sticks to the wall. Your hair stands up. The balloon didn't gain any new material — so what actually changed?",
  course: "Physics",
  unit: "Electrostatics",
  order: 1,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "⚡",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** You rub a balloon on your hair and it sticks to the wall. Your hair stands up. The balloon didn't gain any new material — so what actually changed?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Think about a time you experienced static electricity — maybe a shock from a doorknob, clothes clinging together, or your hair standing up. Describe what happened and what you think caused it.",
      placeholder: "Describe your experience with static electricity...",
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
        "Identify three types of electric charge interactions (attract, repel, neutral)",
        "Explain charging by friction, conduction, and induction",
        "Predict whether objects will attract or repel based on their charge"
      ]
    },

    // ═══════════════════════════════════════════
    // MAIN INSTRUCTION — ATOMS AND CHARGE
    // ═══════════════════════════════════════════
    {
      id: "section-atoms",
      type: "section_header",
      icon: "🔬",
      title: "What Is Electric Charge?",
      subtitle: "~10 minutes"
    },
    {
      id: "b-atoms-intro",
      type: "text",
      content: "Everything around you is made of atoms. Inside every atom, there are three types of subatomic particles:\n\n- **Protons** — positive charge (+), found in the nucleus\n- **Electrons** — negative charge (−), orbit outside the nucleus\n- **Neutrons** — no charge (neutral), found in the nucleus\n\nIn a normal atom, the number of protons equals the number of electrons, so the charges cancel out. The atom is **electrically neutral**."
    },
    {
      id: "b-charging-explained",
      type: "text",
      content: "So where does \"charging\" come from? It's simple: **electrons can move**.\n\nProtons are locked inside the nucleus — they don't go anywhere. But electrons sit on the outer edges of atoms, and they can be **transferred** from one object to another.\n\n- If an object **gains** extra electrons → it becomes **negatively charged**\n- If an object **loses** electrons → it becomes **positively charged**\n\nNotice: we're never creating charge. We're just moving electrons around. This is called the **conservation of charge** — charge is never created or destroyed, only transferred."
    },
    {
      id: "callout-conservation",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Key Insight:** When you rub a balloon on your hair, the balloon doesn't create new charges. It *steals* electrons from your hair. The balloon becomes negative, your hair becomes positive. The total charge in the system hasn't changed — it's just been redistributed."
    },
    {
      id: "q-charge-basics",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An object has 10 protons and 12 electrons. What is its overall charge?",
      options: [
        "Positive — it has more protons",
        "Negative — it has more electrons",
        "Neutral — protons and electrons always cancel",
        "It depends on the number of neutrons"
      ],
      correctIndex: 1,
      explanation: "The object has 2 more electrons than protons. Since electrons carry negative charge, the object has a net negative charge. Neutrons have no charge and don't affect this calculation.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // CHARGE INTERACTIONS
    // ═══════════════════════════════════════════
    {
      id: "section-interactions",
      type: "section_header",
      icon: "🧲",
      title: "How Charges Interact",
      subtitle: "~8 minutes"
    },
    {
      id: "b-interactions",
      type: "text",
      content: "There are three fundamental rules of charge interaction that govern everything in electrostatics:\n\n**1. Like charges repel.** Two positive objects push each other away. Two negative objects push each other away.\n\n**2. Opposite charges attract.** A positive object and a negative object pull toward each other.\n\n**3. Charged objects attract neutral objects.** This one surprises people — how can something with no net charge be attracted? The answer is **polarization**. When a charged object gets close to a neutral one, it rearranges the charges inside the neutral object. The side closest to the charged object gets an opposite charge on its surface, creating a net attraction."
    },
    {
      id: "q-interactions-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two objects are brought close together and they repel each other. What can you conclude?",
      options: [
        "One is positive and one is negative",
        "Both are neutral",
        "Both have the same type of charge (both + or both −)",
        "At least one must be neutral"
      ],
      correctIndex: 2,
      explanation: "Repulsion only happens between two objects with the same charge. Opposite charges attract, and a charged-neutral pair always attracts (via polarization). Repulsion is the only way to confirm that both objects are charged with the same sign.",
      difficulty: "apply"
    },
    {
      id: "callout-repulsion",
      type: "callout",
      style: "insight",
      icon: "🔑",
      content: "**Pro Tip:** Repulsion is the only sure test for charge. If two objects attract, you can't tell if they're oppositely charged or if one is just neutral. But if they repel? They *must* both be charged with the same sign."
    },
    {
      id: "q-interactions-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A negatively charged rod is brought near a small piece of neutral paper, and the paper jumps up to the rod. Why?",
      options: [
        "The paper becomes negatively charged",
        "The rod transfers all its electrons to the paper",
        "The negative rod polarizes the paper, pulling positive charges to the near side, creating a net attraction",
        "Neutral objects are always attracted to everything"
      ],
      correctIndex: 2,
      explanation: "The negative rod repels electrons in the paper to the far side and attracts positive charges to the near side. Since the positive charges are closer to the rod, the attraction is stronger than the repulsion, creating a net pull toward the rod. This is polarization.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // THREE WAYS TO CHARGE
    // ═══════════════════════════════════════════
    {
      id: "section-methods",
      type: "section_header",
      icon: "🔋",
      title: "Three Ways to Charge an Object",
      subtitle: "~10 minutes"
    },
    {
      id: "b-friction",
      type: "text",
      content: "### 1. Charging by Friction\n\nRub two different materials together and electrons transfer from one to the other. Different materials hold onto their electrons with different strengths, so the material with weaker hold loses electrons.\n\n**Example:** Rubbing a balloon on your hair. Your hair gives up electrons easily. The balloon grabs them. Now the balloon is negative and your hair is positive."
    },
    {
      id: "b-conduction",
      type: "text",
      content: "### 2. Charging by Conduction\n\nTouch a charged object to a neutral one. Electrons flow from the charged object to the neutral one (or vice versa) until they share the charge.\n\n**Example:** Touch a negatively charged rod to a neutral metal sphere. Electrons flow from the rod to the sphere. Now both objects are negatively charged.\n\n**Key detail:** In conduction, the two objects end up with the **same sign** of charge."
    },
    {
      id: "b-induction",
      type: "text",
      content: "### 3. Charging by Induction\n\nBring a charged object *near* (but not touching) a neutral conductor. The charges in the conductor rearrange — opposite charges move toward the charged object, same charges move away. If you then **ground** the conductor (connect it to the Earth or touch it), the repelled charges escape, leaving the conductor with the opposite charge.\n\n**Example:** Bring a negative rod near a metal sphere. Electrons in the sphere are repelled to the far side. Touch the far side of the sphere to ground it — those electrons escape into the ground. Remove your finger, then remove the rod. The sphere is now positively charged.\n\n**Key detail:** In induction, the object ends up with the **opposite sign** of the charging object — and the two objects never touched!"
    },
    {
      id: "q-charging-method",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student rubs a glass rod with a silk cloth. The glass rod becomes positively charged. What happened to the silk cloth?",
      options: [
        "It also became positively charged",
        "It became negatively charged",
        "It stayed neutral",
        "It lost all its charge"
      ],
      correctIndex: 1,
      explanation: "By conservation of charge, the electrons that left the glass rod had to go somewhere — they went to the silk cloth. Since the cloth gained electrons, it became negatively charged. Friction charging always produces opposite charges on the two objects.",
      difficulty: "apply"
    },
    {
      id: "q-conduction-vs-induction",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What is the key difference between charging by conduction and charging by induction?",
      options: [
        "Conduction requires friction; induction does not",
        "Conduction gives the same charge sign; induction gives the opposite charge sign",
        "Induction only works with negative charges",
        "Conduction works at a distance; induction requires contact"
      ],
      correctIndex: 1,
      explanation: "In conduction, the objects touch and share charge — so they end up with the same sign. In induction, the objects never touch, and the grounding step removes same-sign charges, leaving the object with the opposite sign. Choice D has it backwards — conduction requires contact, induction works at a distance.",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // DEMO STATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-demos",
      type: "section_header",
      icon: "🧪",
      title: "Demo Stations",
      subtitle: "~15 minutes"
    },
    {
      id: "b-demos-intro",
      type: "text",
      content: "You'll rotate through four stations to see charge interactions in action. At each station, make observations and answer the question before moving on."
    },
    {
      id: "b-station-1",
      type: "text",
      content: "### Station 1: Balloon & Hair\nRub a balloon vigorously on your hair (or a wool sweater). Try sticking the balloon to the wall.\n- What type of charging is this? *(Friction)*\n- Why does the balloon stick to the wall even though the wall is neutral? *(Polarization — the charged balloon rearranges charges on the wall's surface)*"
    },
    {
      id: "b-station-2",
      type: "text",
      content: "### Station 2: Comb & Paper Bits\nRun a plastic comb through your hair several times, then hold it over tiny pieces of torn paper.\n- What do you observe? *(Paper bits jump up to the comb)*\n- Some bits jump *away* after touching the comb. Why? *(Once they touch the comb, electrons transfer to the paper by conduction. Now the paper and comb are the same charge — they repel!)*"
    },
    {
      id: "b-station-3",
      type: "text",
      content: "### Station 3: Rolling Can\nCharge a balloon by rubbing it on your hair. Place an empty aluminum can on its side on a flat surface. Bring the balloon near the can without touching it.\n- What happens? *(The can rolls toward the balloon)*\n- What type of charging makes this work? *(Induction — the balloon polarizes the metal can, attracting the near side)*"
    },
    {
      id: "b-station-4",
      type: "text",
      content: "### Station 4: Tape Experiment\nPress two strips of clear tape firmly onto the table, then peel them off quickly. Bring the sticky sides near each other.\n- Do they attract or repel? *(Repel — both strips pick up the same charge from the table surface)*\n- Now try bringing one tape strip near your hand. What happens? *(Attracts — your hand is neutral, charged tape polarizes your hand)*"
    },
    {
      id: "q-demos-reflect",
      type: "question",
      questionType: "short_answer",
      prompt: "At Station 2, small paper bits initially jump TO the comb, but then some jump AWAY after making contact. Explain this two-step behavior using what you've learned about charging methods.",
      placeholder: "First the paper is attracted because... Then after touching...",
      difficulty: "analyze"
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
      id: "b-wrapup",
      type: "text",
      content: "Let's return to the Question of the Day:\n\n> *You rub a balloon on your hair and it sticks to the wall. Your hair stands up. What actually changed?*\n\nHere's the full explanation:\n\n1. **Friction charging:** When you rub the balloon on your hair, electrons transfer from your hair to the balloon.\n2. **Balloon becomes negative**, your **hair becomes positive** (it lost electrons).\n3. **Hair stands up** because each strand of hair is now positively charged — and like charges repel! The strands push away from each other.\n4. **Balloon sticks to the wall** because the negative balloon polarizes the neutral wall — it pushes electrons on the wall's surface away and attracts the positive charges closer. This creates a net attractive force.\n\nNo new charge was created. Electrons just moved from one place to another."
    },

    // ═══════════════════════════════════════════
    // EXIT TICKET
    // ═══════════════════════════════════════════
    {
      id: "section-exit",
      type: "section_header",
      icon: "🎟️",
      title: "Exit Ticket",
      subtitle: "Check your understanding"
    },
    {
      id: "q-exit-ticket",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A positively charged rod is brought near a neutral metal sphere without touching it. What happens to the electrons in the sphere?",
      options: [
        "They move toward the rod",
        "They move away from the rod",
        "They don't move at all",
        "They leave the sphere entirely"
      ],
      correctIndex: 0,
      explanation: "The positively charged rod attracts the negatively charged electrons in the sphere, causing them to migrate toward the side closest to the rod. This is induction — the charges rearrange without any contact. The electrons don't leave the sphere (no grounding), they just redistribute within it.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: "Terms to know"
    },
    {
      id: "b-vocab",
      type: "vocab_list",
      terms: [
        { term: "Electric Charge", definition: "A fundamental property of matter. Objects can be positive, negative, or neutral depending on the balance of protons and electrons." },
        { term: "Proton", definition: "A positively charged subatomic particle found in the nucleus of an atom." },
        { term: "Electron", definition: "A negatively charged subatomic particle that orbits the nucleus. Electrons can be transferred between objects to create charge imbalances." },
        { term: "Conservation of Charge", definition: "Charge is never created or destroyed — it is only transferred from one object to another. The total charge in a closed system always stays the same." },
        { term: "Charging by Friction", definition: "Transferring electrons between two objects by rubbing them together. The object that holds electrons more tightly gains a negative charge." },
        { term: "Charging by Conduction", definition: "Transferring charge by direct contact. The two objects end up with the same sign of charge." },
        { term: "Charging by Induction", definition: "Charging an object without touching it. A nearby charged object rearranges the charges, and grounding allows some to escape, leaving a net charge with the opposite sign." },
        { term: "Polarization", definition: "The rearrangement of charges within a neutral object caused by a nearby charged object. This is why charged objects attract neutral ones." }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, "physics", "electrostatics-intro-to-charge", lesson);
    console.log('✅ Lesson "Introduction to Electric Charge" seeded successfully!');
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
