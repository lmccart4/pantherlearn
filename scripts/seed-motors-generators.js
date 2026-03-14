// seed-motors-generators.js
// Creates "Motors, Generators & Induction" lesson (Magnetism Unit, Lesson 3)
// Run: node scripts/seed-motors-generators.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Motors, Generators & Induction",
  course: "Physics",
  unit: "Magnetism",
  order: 3,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🔄",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Last class you discovered that **electric current creates a magnetic field**. Oersted showed it in 1820, and you used the right-hand rule to predict the field direction.\n\nBut here's the question that kept scientists up at night for the next decade: **if electricity can create magnetism... can magnetism create electricity?**\n\nIn 1831, Michael Faraday answered that question — and his discovery powers the entire modern world."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A motor turns electricity into motion. A generator turns motion into electricity. They're basically the same device running in reverse. How does that work?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "You know that current → magnetic field. Take a guess: what would you need to do with a magnet to create current in a wire? (There's no wrong answer here — just think about it.)",
      placeholder: "What might create current from a magnet...",
      difficulty: "remember"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Explain Faraday's Law: a changing magnetic field induces an electric current",
        "Describe how a simple electric motor converts electrical energy to mechanical energy",
        "Describe how a simple generator converts mechanical energy to electrical energy",
        "Identify real-world applications of electromagnetic induction"
      ]
    },

    // ═══════════════════════════════════════════
    // FARADAY'S DISCOVERY
    // ═══════════════════════════════════════════
    {
      id: "section-faraday",
      type: "section_header",
      icon: "⚡",
      title: "Faraday's Discovery: Electromagnetic Induction",
      subtitle: "~10 minutes"
    },
    {
      id: "b-induction",
      type: "text",
      content: "**Electromagnetic induction** is the process by which a **changing magnetic field creates (induces) an electric current** in a conductor.\n\nFaraday's key experiment: push a bar magnet into a coil of wire connected to a meter. The meter deflects — current flows! Pull the magnet out — current flows the other direction! But here's the critical detail: **hold the magnet still inside the coil — nothing happens.**\n\nThe magnetic field must be **changing** for induction to occur. A static magnetic field, no matter how strong, produces no current."
    },
    {
      id: "callout-key",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**The #1 rule of induction:** It's not the magnetic field that matters — it's the **CHANGE** in the magnetic field. No change = no induced current. This is why holding a magnet still inside a coil does nothing, but moving it in or out creates current."
    },
    {
      id: "q-induction-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A student holds a strong magnet perfectly still inside a coil of wire connected to a light bulb. What happens?",
      options: [
        "The bulb glows brightly because the magnet is strong",
        "The bulb glows dimly because the magnet is close to the wire",
        "Nothing — the bulb doesn't light because the magnetic field isn't changing",
        "The bulb explodes because too much current is induced"
      ],
      correctIndex: 2,
      explanation: "Electromagnetic induction requires a CHANGING magnetic field. A stationary magnet — no matter how strong — produces a constant field through the coil. No change = no induced voltage = no current = no light.",
      difficulty: "understand"
    },
    {
      id: "b-faraday-law",
      type: "text",
      content: "**Faraday's Law** (qualitative version — no complex math needed):\n\nThe amount of voltage induced in a coil depends on:\n1. **How fast** the magnetic field changes — move the magnet faster → more voltage\n2. **How many coils** of wire — more loops → more voltage\n3. **How strong** the magnet is — stronger magnet → more change → more voltage\n\nThis is proportional reasoning again: double the speed of the magnet → double the induced voltage. Double the number of coils → double the induced voltage."
    },
    {
      id: "q-induction-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You push a magnet through a coil of 50 turns and measure the induced voltage. If you replace the coil with one that has 100 turns and push the magnet at the same speed, what happens to the induced voltage?",
      options: [
        "It stays the same — the magnet hasn't changed",
        "It roughly doubles — twice the coils means twice the voltage",
        "It quadruples — voltage depends on coils squared",
        "It halves — more wire means more resistance"
      ],
      correctIndex: 1,
      explanation: "Faraday's Law says induced voltage is proportional to the number of coils. Double the coils → double the voltage. This is the same direct proportionality you've seen with electromagnets (more coils = stronger field) and Ohm's Law (more voltage = more current).",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-sim",
      type: "section_header",
      icon: "🖥️",
      title: "Explore: Faraday's Lab",
      subtitle: "~10 minutes"
    },
    {
      id: "b-sim-intro",
      type: "text",
      content: "Use the PhET Faraday's Electromagnetic Lab simulation to explore induction hands-on. Start with the **Pickup Coil** tab — drag the magnet in and out of the coil and watch the light bulb respond.\n\nThen try the **Electromagnet** tab — see how changing the current in one coil can induce current in a nearby coil (this is how transformers work!)."
    },
    {
      id: "sim-faraday",
      type: "simulation",
      icon: "🧲",
      title: "PhET: Faraday's Electromagnetic Lab",
      url: "https://phet.colorado.edu/sims/html/faradays-electromagnetic-lab/latest/faradays-electromagnetic-lab_en.html",
      height: 560,
      observationPrompt: "Start on the Pickup Coil tab. Move the magnet through the coil at different speeds. What do you notice about the brightness of the bulb? What happens when you hold the magnet still inside the coil?"
    },
    {
      id: "q-sim-1",
      type: "question",
      questionType: "short_answer",
      prompt: "In the simulation, what happened to the brightness of the light bulb when you moved the magnet FASTER through the coil? Why does this make sense based on Faraday's Law?",
      placeholder: "Describe what you observed and explain why...",
      difficulty: "analyze"
    },
    {
      id: "q-sim-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Switch to the Electromagnet tab. When you change the current in the electromagnet, what happens in the nearby pickup coil? Why does the current in one coil affect another coil that isn't physically connected to it?",
      placeholder: "Explain how one coil affects another...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // MOTORS & GENERATORS
    // ═══════════════════════════════════════════
    {
      id: "section-motors",
      type: "section_header",
      icon: "⚙️",
      title: "Motors & Generators: Two Sides of the Same Coin",
      subtitle: "~10 minutes"
    },
    {
      id: "b-motor",
      type: "text",
      content: "Now you know two facts:\n1. **Current → magnetic field** (Oersted, Lesson 2)\n2. **Changing magnetic field → current** (Faraday, today)\n\nThese two facts give us **motors** and **generators** — two of the most important inventions in human history.\n\n**Electric Motor** (electrical energy → mechanical energy):\n- A coil of wire sits inside a permanent magnet's field\n- Current flows through the coil → creates a magnetic field (fact #1)\n- The coil's field interacts with the permanent magnet's field → the coil experiences a **force** and **spins**\n- Result: electrical energy in → rotational motion out\n- Found in: fans, washing machines, electric cars, power tools, drones"
    },
    {
      id: "b-generator",
      type: "text",
      content: "**Generator** (mechanical energy → electrical energy):\n- A coil of wire spins inside a permanent magnet's field\n- As the coil rotates, the magnetic field through it **changes** constantly\n- Changing field → induced current (fact #2, Faraday's Law)\n- Result: rotational motion in → electrical energy out\n- Found in: power plants, car alternators, wind turbines, hydroelectric dams, bicycle dynamos\n\n**The mind-blowing part:** A motor and a generator are **the same device**. Run current through it → it spins (motor). Spin it → it produces current (generator). Same parts, opposite direction of energy flow."
    },
    {
      id: "callout-energy",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Connection to the Energy Unit:** Remember conservation of energy? A generator doesn't create energy from nothing — it **converts** mechanical energy (spinning) into electrical energy. Every power plant is just a very large generator. Coal, gas, nuclear, hydro, and wind plants all do the same thing: spin a generator. They just use different fuel sources to create the spinning."
    },
    {
      id: "q-motor-gen",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An electric motor and a generator contain the same basic parts (coil of wire + permanent magnet). What's the fundamental difference between them?",
      options: [
        "Motors are bigger than generators",
        "Motors convert electrical energy to mechanical; generators convert mechanical energy to electrical",
        "Motors use AC current and generators use DC current",
        "Motors have more coils than generators"
      ],
      correctIndex: 1,
      explanation: "The only fundamental difference is the direction of energy conversion. Feed electrical energy in → the coil spins → motor. Spin the coil mechanically → electrical energy comes out → generator. Same device, opposite energy flow.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // TRANSFORMERS
    // ═══════════════════════════════════════════
    {
      id: "section-transformers",
      type: "section_header",
      icon: "🔌",
      title: "Bonus: Transformers",
      subtitle: "~5 minutes"
    },
    {
      id: "b-transformers",
      type: "text",
      content: "A **transformer** is a device that uses induction to change voltage levels. It consists of two coils of wire wrapped around the same iron core:\n\n- The **primary coil** receives the input voltage\n- The **secondary coil** delivers the output voltage\n- Changing current in the primary creates a changing magnetic field in the iron core\n- That changing field induces a voltage in the secondary coil (Faraday's Law!)\n\n**Step-up transformer:** More turns on the secondary coil → higher output voltage (used to send electricity long distances on power lines)\n\n**Step-down transformer:** Fewer turns on the secondary coil → lower output voltage (used in your phone charger to drop wall voltage from 120V down to 5V)\n\nYour phone charger is literally a transformer using Faraday's Law from 1831."
    },
    {
      id: "q-transformer",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Your phone charger converts 120V from the wall outlet to 5V for your phone. This is a:",
      options: [
        "Step-up transformer — it increases voltage",
        "Step-down transformer — it decreases voltage",
        "Generator — it creates new electricity",
        "Motor — it converts the electricity to motion"
      ],
      correctIndex: 1,
      explanation: "Your phone charger is a step-down transformer. It has fewer turns on the secondary coil than the primary, which reduces the voltage from 120V to 5V. The same principle Faraday discovered in 1831 charges your phone every night.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // REAL-WORLD APPLICATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-apps",
      type: "section_header",
      icon: "🌎",
      title: "Induction All Around You",
      subtitle: "~3 minutes"
    },
    {
      id: "b-apps",
      type: "text",
      content: "Electromagnetic induction is everywhere:\n\n- **Wireless phone chargers** — a coil in the charger creates a changing magnetic field that induces current in a coil inside your phone. No wires needed!\n- **Electric guitar pickups** — vibrating steel strings change the magnetic field through a coil, inducing a signal that gets amplified into the sound you hear\n- **Induction cooktops** — rapidly changing magnetic fields induce currents directly in the pot, heating the pot without heating the surface\n- **Regenerative braking** in EVs — when you brake, the motor runs as a generator, converting kinetic energy back to electrical energy to recharge the battery\n- **Metal detectors** — a changing magnetic field induces currents in nearby metal objects, which create their own fields that the detector senses"
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
      content: "Today you completed the electricity-magnetism connection:\n\n- **Faraday's Law:** A changing magnetic field induces a current — the field must be changing!\n- **More coils + faster change = more induced voltage** (proportional reasoning again)\n- **Motors** convert electrical energy → mechanical energy (current → spin)\n- **Generators** convert mechanical energy → electrical energy (spin → current)\n- **Transformers** use induction to change voltage levels (your phone charger!)\n- **Same device, opposite direction:** Motors and generators are the same machine running in reverse\n\nThis unit brought together charges (electrostatics), current (circuits), fields (E and B), and energy (conservation) into one unified story: **electromagnetism**. Nearly everything electrical in your life depends on the principles you learned in these three lessons."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** How can a motor and generator be the same device running in reverse?\n\nAnswer: Both contain a coil of wire in a magnetic field. In a motor, you feed current into the coil — it creates a magnetic field that interacts with the permanent magnet's field, causing the coil to spin (electrical → mechanical). In a generator, you spin the coil mechanically — the changing magnetic field induces current (mechanical → electrical). Same parts, opposite energy conversion. Conservation of energy guarantees you can always go either way."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A hydroelectric dam uses falling water to spin a turbine, which spins a generator, which produces electricity that travels through transformers to your home. Trace the energy transformations from the water at the top of the dam to the electricity in your wall outlet. Use at least three physics vocabulary words from this unit.",
      placeholder: "Trace the energy from the dam to your outlet...",
      difficulty: "create"
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
        { term: "Electromagnetic induction", definition: "The process by which a changing magnetic field creates (induces) an electric current in a conductor. Discovered by Faraday in 1831." },
        { term: "Faraday's Law", definition: "A changing magnetic field through a coil induces a voltage. More coils or faster change = more voltage. The field must be changing — a static field produces nothing." },
        { term: "Electric motor", definition: "A device that converts electrical energy to mechanical energy (rotation). Current through a coil in a magnetic field creates force and spin." },
        { term: "Generator", definition: "A device that converts mechanical energy (rotation) to electrical energy. A spinning coil in a magnetic field induces current." },
        { term: "Transformer", definition: "A device that uses electromagnetic induction between two coils to change voltage levels. Step-up increases voltage; step-down decreases it." },
        { term: "Induced current", definition: "Current that flows in a conductor due to a changing magnetic field, without being connected to a battery or power supply." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motors-generators")
      .set(lesson);
    console.log('✅ Lesson "Motors, Generators & Induction" seeded successfully!');
    console.log("   Path: courses/physics/lessons/motors-generators");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Visible: false (publish via Lesson Editor when ready)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
