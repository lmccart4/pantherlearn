// seed-elastic-potential-energy.js
// Creates the "Elastic Potential Energy" lesson in the Physics course.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-elastic-potential-energy.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Elastic Potential Energy",
  course: "Physics",
  unit: "Energy",
  order: 4,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🌅",
      title: "Warm Up",
      subtitle: "~8 minutes"
    },
    {
      id: "text-warmup-connect",
      type: "text",
      content: "Last class you explored **conservation of energy** and **energy bar charts** — how energy transforms between types while the total stays constant. You saw KE and GPE trading off in falling objects, roller coasters, and friction scenarios.\n\nToday you'll meet a new type of stored energy: **elastic potential energy** — the energy in stretched springs, rubber bands, and compressed objects. You'll get hands-on with Play-Doh and springs to feel the physics yourself."
    },
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define elastic potential energy and explain what makes a material 'elastic'",
        "Use Hooke's Law (F = kx) to describe how springs store energy",
        "Apply the elastic PE formula (EPE = ½kx²) to calculate stored energy",
        "Distinguish between elastic deformation (spring, rubber band) and plastic deformation (Play-Doh)"
      ]
    },
    {
      id: "qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** You squish a ball of Play-Doh flat. You stretch a rubber band. Both take effort — but only ONE stores energy you can get back. Which one, and why?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at the Play-Doh on your desk. Without touching it yet — predict: if you squeeze it into a ball and then let go, what do you think will happen? Will it spring back? What does your prediction tell you about whether energy is being 'stored' in the Play-Doh?",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // SECTION 1: WHAT IS ELASTIC PE?
    // ═══════════════════════════════════════════
    {
      id: "section-concept",
      type: "section_header",
      icon: "🔋",
      title: "What is Elastic Potential Energy?",
      subtitle: "~10 minutes"
    },
    {
      id: "text-elastic-intro",
      type: "text",
      content: "You already know about **gravitational potential energy** — the 'ability to fall.' Now meet the physics behind the 'ability to stretch and compress': **elastic potential energy (EPE)**.\n\nEPE is the energy stored in an object when it's *stretched or compressed from its natural shape* — and the key word is **elastic**: the object must be able to return to its original shape.\n\nThink about:\n- A stretched rubber band 🔴\n- A compressed spring 🌀\n- A drawn bow 🏹\n- A bent diving board 🏊\n\nAll of these store elastic potential energy. When released, that stored energy converts to **kinetic energy** as the object snaps back."
    },
    {
      id: "def-epe",
      type: "definition",
      term: "Elastic Potential Energy (EPE)",
      definition: "Energy stored in an object that has been stretched or compressed from its equilibrium (natural) shape. The object must be elastic — meaning it returns to its original shape when the force is removed."
    },
    {
      id: "def-hookes",
      type: "definition",
      term: "Hooke's Law",
      definition: "The force needed to stretch or compress a spring is proportional to the distance stretched: F = kx. Here, k is the spring constant (stiffness, in N/m) and x is the displacement from equilibrium (in meters)."
    },
    {
      id: "callout-formula",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The Elastic PE Formula:**\n\n**EPE = ½kx²**\n\n- **k** = spring constant (N/m) — how stiff the spring is\n- **x** = displacement from equilibrium (m) — how far it's stretched or compressed\n- **EPE** is in Joules (J)\n\nNotice: EPE depends on x **squared** — doubling the stretch quadruples the stored energy!"
    },
    {
      id: "q-concept-mc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A spring with k = 200 N/m is compressed 0.1 m. How much elastic potential energy is stored?",
      difficulty: "apply",
      options: [
        "20 J",
        "10 J",
        "1 J",
        "0.5 J"
      ],
      correctIndex: 2,
      explanation: "EPE = ½kx² = ½ × 200 × (0.1)² = ½ × 200 × 0.01 = 1 J. Notice that x is squared — small displacements store small amounts of energy."
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 1: PLAY-DOH LAB
    // ═══════════════════════════════════════════
    {
      id: "section-playdoh",
      type: "section_header",
      icon: "🫧",
      title: "Activity 1: The Play-Doh Experiment",
      subtitle: "~15 minutes"
    },
    {
      id: "text-playdoh-intro",
      type: "text",
      content: "Here's the twist: **Play-Doh is NOT an elastic material.** It's what scientists call a *plastic* material — when you deform it, it stays deformed. It doesn't spring back.\n\nThis makes Play-Doh the *perfect foil* for understanding elastic PE. By comparing what Play-Doh does vs. what a spring or rubber band does, you'll understand exactly what makes elastic PE special.\n\nIn this lab, you'll use Play-Doh, a rubber band, and a pencil spring clip (or similar spring) to feel the difference firsthand."
    },
    {
      id: "activity-playdoh",
      type: "activity",
      icon: "🫧",
      title: "Play-Doh vs. Spring: Feel the Difference",
      instructions: "**Materials:** Play-Doh ball, rubber band, spring (or binder clip spring)\n\n**Part A — Play-Doh (Plastic Deformation):**\n1. Roll your Play-Doh into a smooth ball.\n2. Press it firmly with your thumb. Notice the force you use.\n3. Release. Observe: does it return to its original shape?\n4. Now pull it gently from both ends. Release. Does it spring back?\n5. Note: where did the energy from squishing/pulling GO if the Play-Doh didn't move back?\n\n**Part B — Rubber Band (Elastic Deformation):**\n1. Hold the rubber band between your fingers and stretch it 5 cm.\n2. Release it suddenly. What happens?\n3. Stretch it again, hold it, and feel the tension. That tension is the rubber band 'wanting' to return.\n4. Compare: does it behave like Play-Doh?\n\n**Part C — Spring:**\n1. Compress a small spring between your fingers.\n2. Release it. What happens?\n3. How is this different from the Play-Doh?\n\n**Discuss with a partner:** What's the key difference between elastic and plastic materials when it comes to energy?"
    },
    {
      id: "checklist-playdoh",
      type: "checklist",
      title: "Lab Completion Checklist",
      items: [
        "Compressed Play-Doh and observed that it stays deformed",
        "Stretched Play-Doh and observed that it stays stretched",
        "Stretched rubber band and felt it snap back (elastic behavior)",
        "Compressed a spring and felt it push back against your fingers",
        "Discussed with a partner what makes materials 'elastic'"
      ]
    },
    {
      id: "upload-playdoh",
      type: "evidence_upload",
      icon: "📷",
      title: "Photo Evidence",
      instructions: "Take a photo showing your Play-Doh experiment. Try to capture the Play-Doh in a deformed state (squished or stretched) next to an undeformed piece so you can see the difference. Upload it here.",
      reflectionPrompt: "Describe what you see in your photo. Which piece is deformed? Did it return to its original shape when you released it?"
    },
    {
      id: "q-playdoh-1",
      type: "question",
      questionType: "short_answer",
      prompt: "When you squished the Play-Doh flat, you did WORK on it (you applied a force over a distance). But the Play-Doh didn't spring back — so where did that energy GO? Use what you know about energy conservation to explain.",
      difficulty: "analyze"
    },
    {
      id: "q-playdoh-2",
      type: "question",
      questionType: "short_answer",
      prompt: "When you stretched the rubber band and held it, you could feel it pulling your fingers together. In your own words, explain why a stretched rubber band is said to have 'stored' energy — what would that energy turn into if you released it?",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SORTING: ELASTIC vs. NOT ELASTIC
    // ═══════════════════════════════════════════
    {
      id: "section-sorting",
      type: "section_header",
      icon: "🔀",
      title: "Elastic or Not? Sort It Out",
      subtitle: "~5 minutes"
    },
    {
      id: "text-sorting-intro",
      type: "text",
      content: "Now that you've felt the difference, let's test your understanding. For each item below, decide: does it store **elastic potential energy** when deformed (and return to shape), or does it undergo **plastic deformation** (permanently changes shape)?"
    },
    {
      id: "sort-elastic",
      type: "sorting",
      icon: "🔀",
      title: "Elastic PE or Plastic Deformation?",
      instructions: "Swipe RIGHT for materials that store elastic PE (spring back). Swipe LEFT for materials that undergo plastic deformation (stay deformed).",
      leftLabel: "Plastic Deformation",
      rightLabel: "Stores Elastic PE",
      items: [
        { text: "A rubber band stretched between your fingers", correct: "right" },
        { text: "Play-Doh pressed into a flat pancake", correct: "left" },
        { text: "A compressed spring in a pen", correct: "right" },
        { text: "A bent metal paperclip (bent past its limit)", correct: "left" },
        { text: "A trampoline mat while a person jumps on it", correct: "right" },
        { text: "A crumpled piece of aluminum foil", correct: "left" },
        { text: "A compressed rubber bouncy ball before it hits the floor", correct: "right" },
        { text: "A kneaded piece of clay formed into a sculpture", correct: "left" },
        { text: "A stretched bungee cord during a jump", correct: "right" },
        { text: "A smashed bumper made of soft plastic that doesn't pop back", correct: "left" }
      ]
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 2: PhET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-sim",
      type: "section_header",
      icon: "🧪",
      title: "Activity 2: Springs & Energy Simulation",
      subtitle: "~10 minutes"
    },
    {
      id: "text-sim-intro",
      type: "text",
      content: "Now let's visualize elastic PE using a real physics simulation. In the PhET Masses & Springs sim, you can stretch springs with different masses and watch how elastic PE converts to kinetic energy and back — just like a real spring system.\n\n**Focus on:** How does stretching the spring farther change the energy stored? What happens to EPE when you release the mass?"
    },
    {
      id: "sim-springs",
      type: "simulation",
      icon: "🌀",
      title: "Masses & Springs (PhET)",
      url: "https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_en.html",
      height: 520,
      observationPrompt: "Hang a mass on the spring and watch it oscillate. In the 'Energy' tab, watch the bar chart as the spring bounces. Describe what happens to EPE and KE as the spring oscillates up and down."
    },
    {
      id: "q-sim-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Using the Energy tab in the simulation: at what point in the oscillation is elastic PE at its MAXIMUM? At what point is kinetic energy at its MAXIMUM? What happens to total energy over time as the system loses energy to friction?",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // CALCULATOR
    // ═══════════════════════════════════════════
    {
      id: "section-calc",
      type: "section_header",
      icon: "🧮",
      title: "Crunching the Numbers",
      subtitle: "~8 minutes"
    },
    {
      id: "text-calc-intro",
      type: "text",
      content: "Let's practice using **EPE = ½kx²** to calculate elastic potential energy. Use the calculator below to explore how changing the spring constant (k) and displacement (x) affects stored energy.\n\n**Try this:** Keep k the same and double x. What happens to EPE? This demonstrates why x is *squared* in the formula."
    },
    {
      id: "calc-epe",
      type: "calculator",
      title: "Elastic Potential Energy Calculator",
      description: "Calculate the elastic potential energy stored in a spring using EPE = ½kx²",
      formula: "0.5 * k * x * x",
      showFormula: true,
      inputs: [
        { name: "k", label: "Spring Constant (k)", unit: "N/m" },
        { name: "x", label: "Displacement (x)", unit: "m" }
      ],
      output: { label: "Elastic Potential Energy", unit: "J", decimals: 3 }
    },
    {
      id: "q-calc-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A spring with k = 500 N/m is stretched 0.3 m from equilibrium. How much elastic potential energy is stored?",
      difficulty: "apply",
      options: [
        "75 J",
        "22.5 J",
        "150 J",
        "45 J"
      ],
      correctIndex: 1,
      explanation: "EPE = ½kx² = ½ × 500 × (0.3)² = ½ × 500 × 0.09 = 22.5 J. Remember: square x FIRST, then multiply by ½k."
    },
    {
      id: "q-calc-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A spring stores 8 J of elastic PE when stretched 0.2 m. What is the spring constant k?",
      difficulty: "analyze",
      options: [
        "200 N/m",
        "80 N/m",
        "400 N/m",
        "40 N/m"
      ],
      correctIndex: 2,
      explanation: "Use EPE = ½kx² → 8 = ½ × k × (0.2)² → 8 = ½ × k × 0.04 → 8 = 0.02k → k = 400 N/m. Rearrange the formula to solve for the unknown variable."
    },
    {
      id: "q-x-squared",
      type: "question",
      questionType: "short_answer",
      prompt: "A spring is initially stretched 0.1 m, storing some elastic PE. Then it's stretched to 0.2 m (double the distance). Without calculating, predict: does the EPE double, triple, or quadruple? Then USE the calculator to check your prediction. Explain why this relationship makes sense physically.",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // CHATBOT
    // ═══════════════════════════════════════════
    {
      id: "section-chatbot",
      type: "section_header",
      icon: "🤖",
      title: "Elastic Energy Coach",
      subtitle: "~5 minutes"
    },
    {
      id: "text-chatbot-intro",
      type: "text",
      content: "Ready to test your understanding with an AI coach? The Elastic Energy Coach can help you:\n- Work through EPE calculations step by step\n- Connect today's Play-Doh experiment to the physics concepts\n- Check your reasoning on energy conservation problems\n\nTry asking it a question about something you're still unsure about — or challenge it with a tricky scenario!"
    },
    {
      id: "chat-elastic",
      type: "chatbot",
      icon: "🌀",
      title: "Elastic Energy Coach",
      starterMessage: "Hey! I'm your Elastic Energy Coach 🌀 We just explored elastic potential energy — springs, rubber bands, Play-Doh, and the formula EPE = ½kx². What's on your mind? You can ask me to walk through a calculation, explain why Play-Doh is 'plastic' and not 'elastic', or help you understand Hooke's Law. What would you like to dig into?",
      systemPrompt: "You are the Elastic Energy Coach, a friendly and encouraging high school physics tutor focused on elastic potential energy. Your role:\n\n1. Help students understand these core concepts:\n   - Elastic vs. plastic deformation (rubber band/spring = elastic; Play-Doh/clay = plastic)\n   - Hooke's Law: F = kx (force proportional to displacement)\n   - EPE formula: EPE = ½kx² (energy in Joules)\n   - Energy transformations: EPE converts to KE and/or GPE when released\n\n2. When students ask for calculation help:\n   - Walk through EPE = ½kx² step by step\n   - Remind them to square x FIRST, then multiply\n   - Guide rather than just give the answer — ask 'What's x squared?' before giving the next step\n\n3. Connect to the Play-Doh lab:\n   - Play-Doh is plastic (permanent deformation) — energy goes into thermal energy and restructuring the material, NOT stored as EPE\n   - Real elastic materials (springs, rubber bands) store and release energy\n\n4. Use simple, clear language appropriate for 9th-10th grade physics students.\n5. Keep responses to 3-5 sentences. Use equations inline (e.g., EPE = ½kx²).\n6. If a student gives a wrong answer, ask a guiding question rather than just correcting them.\n7. Do not go off-topic — redirect gently if the student asks about unrelated subjects.\n8. Praise good reasoning and correct misconceptions with patience.",
      instructions: "Ask the Elastic Energy Coach anything about elastic potential energy! Try: walking through a calculation, explaining the Play-Doh vs. spring difference, or understanding Hooke's Law. Have at least a 3-message conversation.",
      placeholder: "Ask a question about elastic PE, springs, or today's lab..."
    },

    // ═══════════════════════════════════════════
    // CHECK YOUR UNDERSTANDING
    // ═══════════════════════════════════════════
    {
      id: "section-check",
      type: "section_header",
      icon: "✅",
      title: "Check Your Understanding",
      subtitle: "~8 minutes"
    },
    {
      id: "q-check-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Which of the following correctly defines elastic potential energy?",
      difficulty: "remember",
      options: [
        "Energy stored in an object due to its height above the ground",
        "Energy of a moving object",
        "Energy stored in a deformed elastic object that can return to its original shape",
        "Energy released when a chemical reaction occurs"
      ],
      correctIndex: 2,
      explanation: "Elastic potential energy is the energy stored when an elastic object (like a spring or rubber band) is stretched or compressed. The key is that the object must be able to return to its original shape — otherwise the energy is not stored as EPE."
    },
    {
      id: "q-check-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A spring has k = 300 N/m. Spring A is compressed 0.1 m. Spring B (same k) is compressed 0.2 m. How does the EPE of Spring B compare to Spring A?",
      difficulty: "understand",
      options: [
        "Spring B has twice the EPE of Spring A",
        "Spring B has three times the EPE of Spring A",
        "Spring B has four times the EPE of Spring A",
        "Spring B has the same EPE as Spring A"
      ],
      correctIndex: 2,
      explanation: "Since EPE = ½kx² and x is doubled, EPE scales with x² → 2² = 4 times as much. Spring A: ½(300)(0.01) = 1.5 J. Spring B: ½(300)(0.04) = 6 J. 6 ÷ 1.5 = 4. Doubling the displacement quadruples the stored energy."
    },
    {
      id: "q-check-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In the Play-Doh lab, when you squished the Play-Doh flat, you did work on it — but the Play-Doh stored NO elastic potential energy. This is because:",
      difficulty: "understand",
      options: [
        "You didn't press hard enough to store energy",
        "Play-Doh is a plastic material — it permanently deforms instead of returning to its original shape",
        "Elastic PE only applies to metal springs, not soft materials",
        "The Play-Doh converted all the energy to kinetic energy"
      ],
      correctIndex: 1,
      explanation: "Play-Doh is a plastic material — it deforms permanently rather than elastically. The energy you put in goes into breaking and rearranging the internal structure of the Play-Doh (and becomes thermal energy), NOT into stored elastic potential energy that can be recovered."
    },
    {
      id: "q-check-ranking",
      type: "question",
      questionType: "ranking",
      prompt: "A spring launcher shoots a ball upward. Rank these moments from MOST elastic PE to LEAST elastic PE:",
      difficulty: "analyze",
      items: [
        "Spring fully compressed, ball at rest (just before launch)",
        "Spring halfway through releasing (ball just starting to move)",
        "Spring at natural length, ball leaving the launcher at max speed",
        "Ball at maximum height, spring at natural length"
      ]
    },
    {
      id: "q-check-eval",
      type: "question",
      questionType: "short_answer",
      prompt: "A student says: 'Play-Doh and a spring store the same kind of energy when you push on them — they both have elastic potential energy.' Write a 2-3 sentence response explaining why this student is incorrect. Use evidence from today's lab to support your answer.",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🏁",
      title: "Wrap Up",
      subtitle: "~3 minutes"
    },
    {
      id: "text-summary",
      type: "text",
      content: "**Today you learned:**\n- **Elastic potential energy (EPE)** is energy stored in a stretched or compressed material that *returns to its original shape*\n- **Hooke's Law:** F = kx — the restoring force of a spring is proportional to displacement\n- **EPE = ½kx²** — stored energy depends on spring constant k and displacement x (squared!)\n- **Elastic materials** (springs, rubber bands) store and release EPE\n- **Plastic materials** (Play-Doh, clay) permanently deform — no EPE is stored\n- EPE transforms into **kinetic energy** (and sometimes **gravitational PE**) when released\n\nNow you can add EPE to your energy bar charts from last class — one more bar to track in conservation of energy problems!"
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Elastic Potential Energy (EPE)", definition: "Energy stored in a deformed elastic object (spring, rubber band) that returns to its original shape. EPE = ½kx²." },
        { term: "Spring Constant (k)", definition: "A measure of a spring's stiffness, in N/m. A larger k means a stiffer spring that requires more force to compress or stretch." },
        { term: "Displacement (x)", definition: "How far a spring is stretched or compressed from its equilibrium (natural, undeformed) position, in meters." },
        { term: "Hooke's Law", definition: "F = kx — the restoring force of a spring is proportional to its displacement from equilibrium." },
        { term: "Elastic Deformation", definition: "Temporary deformation where the material returns to its original shape after the force is removed (e.g., springs, rubber bands)." },
        { term: "Plastic Deformation", definition: "Permanent deformation where the material stays in its new shape after the force is removed (e.g., Play-Doh, clay, bent metal)." },
        { term: "Equilibrium Position", definition: "The natural, undeformed position of a spring where the net force is zero and no elastic PE is stored." },
        { term: "Spring-Mass System", definition: "A spring attached to a mass that oscillates (bounces) back and forth, continuously converting EPE to KE and back." }
      ]
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: Return to the Question of the Day — you squished Play-Doh and stretched a rubber band. NOW explain: which stored elastic potential energy, which didn't, and where did the energy go in each case? Use the vocabulary from today's lesson.",
      difficulty: "apply"
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, 'physics', 'elastic-potential-energy', lesson);
    console.log('✅ Lesson "Elastic Potential Energy" seeded successfully!');
    console.log('   Path: courses/physics/lessons/elastic-potential-energy');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Order: 2 (after "Systems & Energy Transformations" at order 1)');
    console.log('   Visible: false (publish via Lesson Editor when ready)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
