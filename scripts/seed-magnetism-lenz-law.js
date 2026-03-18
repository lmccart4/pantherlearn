// seed-magnetism-lenz-law.js
// Creates "Lenz's Law & Eddy Currents" lesson (Magnetism Unit, Lesson 6)
// Run: node scripts/seed-magnetism-lenz-law.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Lenz's Law & Eddy Currents",
  course: "Physics",
  unit: "Magnetism",
  questionOfTheDay: "Roller coasters like the ones at Six Flags use magnetic brakes — no friction, no pads, no contact at all. A fin on the coaster car passes between magnets and the car slows down. No moving parts. How does this work?",
  order: 6,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🎢",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Last class you learned Faraday's Law: a **changing magnetic field induces a current**. And you learned the magnitude — more coils, faster change, stronger magnet = more induced voltage.\n\nBut Faraday's Law has a silent partner that physicists ignored until 1834 when Heinrich Lenz figured it out: **which direction does the induced current flow?**\n\nThe answer turns out to be deeply connected to one of the most fundamental laws in all of physics: **conservation of energy**."
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "🎢",
      content: "**Question of the Day:** Roller coasters like the ones at Six Flags use magnetic brakes — no friction, no pads, no contact at all. A fin on the coaster car passes between magnets, and the car slows down. No moving parts. How does this work?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Faraday's Law says a changing magnetic field induces current. Here's a thought experiment: if you push a magnet into a coil, current flows. That current creates its own magnetic field. Do you think that new magnetic field would help the magnet go in, or resist it going in? Why?",
      placeholder: "I think the induced magnetic field would... because if it helped, then..."
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "State Lenz's Law: induced current opposes the change that caused it",
        "Explain why Lenz's Law is required by conservation of energy",
        "Predict the direction of induced current using Lenz's Law",
        "Describe eddy currents and explain electromagnetic braking",
        "Identify real-world applications: roller coaster brakes, metal detectors, induction cooktops"
      ]
    },

    // ═══════════════════════════════════════════
    // LENZ'S LAW
    // ═══════════════════════════════════════════
    {
      id: "section-lenz",
      type: "section_header",
      icon: "📚",
      title: "Lenz's Law: Nature Resists Change",
      subtitle: "~12 minutes"
    },
    {
      id: "b-lenz",
      type: "text",
      content: "**Lenz's Law:** The induced current always flows in the direction that **opposes** the change in magnetic flux that caused it.\n\nIn plain English: **the induced current fights back.**\n\n- Push a magnet INTO a coil → the coil induces a current that creates a magnetic field that **repels** the incoming magnet (making it harder to push in)\n- Pull a magnet OUT of a coil → the coil induces a current that creates a field that **attracts** the leaving magnet (making it harder to pull out)\n- Increase the field through a coil → induced current creates a field that **opposes** the increase\n- Decrease the field → induced current creates a field that **opposes** the decrease\n\nThe pattern: **whatever is happening, the induced current tries to prevent it.**"
    },
    {
      id: "callout-conservation",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Why must Lenz's Law be true?** Think about what would happen if it weren't — if the induced current HELPED the change instead of opposed it:\n\nYou push a magnet toward a coil → induced current attracts it → magnet accelerates → stronger field change → more current → more attraction → the magnet accelerates forever, gaining energy from nothing.\n\nThat's a perpetual motion machine, which violates conservation of energy. It's impossible. Therefore, the induced current MUST oppose the change — Lenz's Law is conservation of energy in disguise."
    },
    {
      id: "q-lenz-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You pull a bar magnet OUT of a coil. According to Lenz's Law, the magnetic field created by the induced current in the coil will:",
      options: [
        "Repel the magnet — making it easier to pull out",
        "Attract the magnet — making it harder to pull out",
        "Have no effect on the magnet",
        "Reverse the polarity of the magnet"
      ],
      correctIndex: 1,
      explanation: "Lenz's Law says the induced current opposes the CHANGE. Pulling the magnet out decreases the flux through the coil. The induced current creates a field that tries to maintain the flux — which means attracting the magnet back in, making it harder to pull out. You have to do work against this opposition — that work becomes electrical energy in the coil."
    },
    {
      id: "q-lenz-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "The magnetic flux through a coil is increasing rapidly. The induced current in the coil creates a magnetic field that:",
      options: [
        "Points in the same direction as the increasing flux (helps it increase more)",
        "Points opposite to the increasing flux (tries to reduce it)",
        "Points perpendicular to the flux",
        "Does not create a magnetic field"
      ],
      correctIndex: 1,
      explanation: "Lenz's Law: induced current opposes the change. If flux is increasing, the induced current creates a field in the OPPOSITE direction to fight the increase. This is what makes Lenz's Law consistent with conservation of energy — the coil resists, requiring work to push more flux through it."
    },
    {
      id: "q-lenz-3",
      type: "question",
      questionType: "short_answer",
      prompt: "A student claims: 'I designed a generator where the induced current helps the magnet spin faster, which generates more current, which spins the magnet even faster — infinite free energy!' Explain why this is impossible using Lenz's Law and conservation of energy.",
      placeholder: "This is impossible because Lenz's Law says... and conservation of energy means..."
    },

    // ═══════════════════════════════════════════
    // PhET SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-sim",
      type: "section_header",
      icon: "🖥️",
      title: "Explore: Faraday's Lab — Observing Lenz's Law",
      subtitle: "~8 minutes"
    },
    {
      id: "b-sim-intro",
      type: "text",
      content: "Use the PhET Faraday's Electromagnetic Lab to observe Lenz's Law in action.\n\n**Try this:**\n1. Go to the **Pickup Coil** tab\n2. Slowly move the magnet INTO the coil — watch the current meter and note the direction\n3. Now slowly move the magnet OUT — the current reverses direction\n4. Hold the magnet still — current drops to zero\n\nThe direction reversal when you change from pushing in to pulling out is Lenz's Law in action: the induced current always opposes whichever direction you're moving the magnet."
    },
    {
      id: "sim-faraday",
      type: "simulation",
      icon: "🧲",
      title: "PhET: Faraday's Electromagnetic Lab",
      url: "https://phet.colorado.edu/sims/html/faradays-electromagnetic-lab/latest/faradays-electromagnetic-lab_en.html",
      height: 520,
      observationPrompt: "Move the magnet in and out of the coil. Which way does the current flow when you push in? Which way when you pull out? What happens when you stop? Does this match Lenz's Law?"
    },
    {
      id: "q-sim",
      type: "question",
      questionType: "short_answer",
      prompt: "In the simulation, you pushed the magnet IN and the current meter deflected in one direction. When you pulled the magnet OUT, the current reversed. Explain both observations using Lenz's Law — why does the current direction reverse when you reverse the motion?",
      placeholder: "When pushing in, the flux increases so the induced current... When pulling out, the flux decreases so the induced current..."
    },

    // ═══════════════════════════════════════════
    // EDDY CURRENTS
    // ═══════════════════════════════════════════
    {
      id: "section-eddy",
      type: "section_header",
      icon: "🌀",
      title: "Eddy Currents: Induction in Solid Metal",
      subtitle: "~10 minutes"
    },
    {
      id: "b-eddy",
      type: "text",
      content: "So far you've imagined induction happening in a coil of wire — a defined loop. But Lenz's Law applies to ANY conductor, not just coils.\n\nWhen a **solid chunk of metal** moves through a magnetic field (or a changing field moves through metal), swirling loops of current form throughout the metal. These are called **eddy currents** — named because they circulate like eddies (whirlpools) in water.\n\nBy Lenz's Law, eddy currents create magnetic fields that **oppose the motion** that caused them. This opposition creates a braking force on the moving metal — no friction, no contact, no mechanical parts.\n\n**The critical equation connection:**\n- Changing field → induced current (Faraday)\n- Induced current direction → opposes the change (Lenz)\n- Induced current in field → experiences a force (F = BIL)\n- That force opposes motion → **electromagnetic braking**\n\nThis is a four-step chain using everything you've learned this unit."
    },
    {
      id: "callout-demo",
      type: "callout",
      style: "scenario",
      icon: "🧪",
      content: "**Classic Demonstration — Magnet in a Copper Tube:**\n\nDrop a strong magnet down a plastic tube — it falls fast. Drop the same magnet down a copper tube — it falls in slow motion, taking 10+ seconds to travel a meter.\n\nThe copper isn't magnetic. But as the magnet moves through it, the changing field induces eddy currents in the copper (Faraday). Those eddy currents create magnetic fields (Oersted) that oppose the magnet's motion (Lenz). The magnet falls against a magnetic 'cushion' of its own making.\n\nNo friction. No contact. Just electromagnetic braking."
    },
    {
      id: "q-eddy-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A copper disk spins between the poles of a strong magnet. Over time, the disk slows down even though nothing is touching it. This is because:",
      options: [
        "Copper is slightly magnetic and gets attracted to the magnet",
        "Eddy currents induced in the copper create fields that oppose the disk's motion (Lenz's Law)",
        "The magnet's field directly slows moving charges in the copper",
        "Friction between air and the disk gradually slows it"
      ],
      correctIndex: 1,
      explanation: "As the copper disk rotates through the magnetic field, different parts of the disk continuously enter and exit regions of different field strength. This changing flux induces eddy currents throughout the disk. By Lenz's Law, these currents create magnetic fields opposing the rotation — producing a braking torque without any physical contact."
    },
    {
      id: "q-eddy-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why are transformer cores built from thin layers of iron laminated (stacked) together instead of one solid iron block?",
      options: [
        "To reduce weight — thin layers weigh less than a solid block",
        "To reduce eddy currents — thin layers interrupt the current loops, reducing energy loss as heat",
        "To increase the magnetic field — more surfaces means stronger field",
        "To allow the transformer to be disassembled for maintenance"
      ],
      correctIndex: 1,
      explanation: "Eddy currents waste energy as heat. In a solid iron core, large eddy current loops can circulate freely, heating the core. Laminating the core into thin insulated layers breaks up these loops — current can't flow across the insulating layers, so eddy currents are restricted to tiny, weak loops. This is a key engineering design decision in every transformer and motor."
    },

    // ═══════════════════════════════════════════
    // REAL-WORLD APPLICATIONS
    // ═══════════════════════════════════════════
    {
      id: "section-apps",
      type: "section_header",
      icon: "🌎",
      title: "Lenz's Law in the Real World",
      subtitle: "~8 minutes"
    },
    {
      id: "b-roller-coaster",
      type: "text",
      content: "**Roller Coaster Magnetic Brakes — The Answer to the Question of the Day**\n\nModern roller coasters use electromagnetic (eddy current) brakes at the end of the ride. A metal fin attached to the coaster car passes between strong permanent magnets at the brake section.\n\nAs the fin moves through the magnetic field:\n1. Changing flux → eddy currents induced in the fin (Faraday)\n2. Eddy currents in the field → force on the fin (F = BIL)\n3. Lenz's Law → force always opposes motion\n4. Result: smooth, powerful braking with no mechanical contact\n\n**Advantages over friction brakes:** No wear, no brake dust, zero maintenance, smooth deceleration, works in wet weather, never \"fade\" from heat buildup. The faster the car moves, the stronger the eddy currents and the stronger the braking force — a self-regulating system."
    },
    {
      id: "b-metal-detectors",
      type: "text",
      content: "**Metal Detectors — Sensing Eddy Currents**\n\nA metal detector works in reverse: instead of a metal object moving through a field, the field moves through a stationary metal object.\n\nThe detector coil creates a rapidly changing AC magnetic field. When this field passes through a metal object:\n1. The changing field induces eddy currents in the metal (Faraday)\n2. The eddy currents create their own magnetic field (Lenz's Law — it opposes the original)\n3. The detector senses this secondary field as a disturbance in the original signal\n4. Alert sounds → metal detected\n\nMetal detectors at airports and security checkpoints, archaeology, treasure hunting, and landmine detection all use this exact principle."
    },
    {
      id: "b-induction-cooktop",
      type: "text",
      content: "**Induction Cooktops — Heating Pots Without Heating the Surface**\n\nAn induction cooktop has a coil of wire beneath the glass surface carrying high-frequency AC current. This creates a rapidly changing magnetic field.\n\nWhen a pot (made of ferromagnetic steel) sits on the cooktop:\n1. The rapidly alternating field induces large eddy currents in the pot itself\n2. The pot's electrical resistance converts the eddy currents to heat (P = I²R from circuits)\n3. The pot heats up directly — the glass surface stays cool\n\nAdvantages: 90% energy efficient (vs 70% for gas, 74% for traditional electric), no open flame, surface doesn't burn, instant temperature response, safer for kitchens."
    },
    {
      id: "q-app",
      type: "question",
      questionType: "short_answer",
      prompt: "Return to the Question of the Day: Explain how magnetic brakes stop a roller coaster without any physical contact. Use the following terms in your answer: eddy currents, Lenz's Law, Faraday's Law, opposing force.",
      placeholder: "As the metal fin moves through the magnetic field... Faraday's Law means... Lenz's Law means... The result is..."
    },
    {
      id: "q-compare",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An induction cooktop heats a steel pot but NOT an aluminum pot of the same size placed right next to it. Why?",
      options: [
        "Aluminum has lower electrical resistance so eddy currents don't heat it",
        "Aluminum is non-ferromagnetic — the cooktop's alternating field induces smaller eddy currents in aluminum, producing much less heat",
        "Aluminum is a better thermal conductor so it stays cooler",
        "Only one pot can be on the cooktop at a time"
      ],
      correctIndex: 1,
      explanation: "Induction cooktops work best with ferromagnetic materials (iron, steel). Aluminum has low magnetic permeability, so the alternating field induces much weaker eddy currents — not enough to heat the pot effectively. This is why induction cooktops require specific cookware labeled 'induction compatible.' It's not about electrical resistance — it's about how well the field couples into the material."
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
      content: "Today you learned the direction rule that completes Faraday's Law:\n\n- **Lenz's Law:** Induced current always opposes the change that caused it\n- **Why it must be true:** Any other direction would create energy from nothing, violating conservation of energy\n- **Eddy currents:** Swirling induced currents in solid conductors — not just coils\n- **Electromagnetic braking:** Eddy currents in metal + Lenz's Law = contactless braking force\n- **Real applications:** Roller coaster brakes, metal detectors, induction cooktops, transformer laminations\n\n**The full chain you now know:**\n1. Moving charges create magnetic fields (Oersted)\n2. Moving charges in fields experience forces (F = qvB)\n3. Wires in fields experience forces (F = BIL)\n4. Changing fields induce currents (Faraday)\n5. Induced currents oppose the change (Lenz)\n\n**Next class:** Capstone — How all of this shows up in the technology around you: MRI machines, hard drives, maglev trains, wireless charging, and more."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "🎢",
      content: "**Return to the Question of the Day:** How do magnetic brakes stop a roller coaster with no contact?\n\nAnswer: A metal fin on the coaster enters a region of strong magnetic field. As the fin moves, the changing flux through the metal induces eddy currents (Faraday's Law). By Lenz's Law, those eddy currents create a magnetic field opposing the fin's motion — a braking force. The faster the car moves, the stronger the eddy currents, the stronger the brake. No wear, no friction, no maintenance. Pure Lenz's Law."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A student claims that if Lenz's Law didn't exist, you could push a magnet into a coil once and it would keep accelerating forever, generating unlimited electricity. (a) Is this correct? (b) Which fundamental law of physics would this violate? (c) What does Lenz's Law actually ensure happens?",
      placeholder: "(a) ... (b) This would violate... (c) Lenz's Law ensures..."
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
        { term: "Lenz's Law", definition: "The induced current in a conductor always flows in a direction that opposes the change in magnetic flux that caused it. A consequence of conservation of energy." },
        { term: "Magnetic flux", definition: "A measure of how much magnetic field passes through a given area. Symbol: Φ. Changing flux is what induces current (Faraday's Law)." },
        { term: "Eddy currents", definition: "Swirling loops of induced current that form in solid conductors when the magnetic flux through them changes. Named for their resemblance to whirlpool eddies." },
        { term: "Electromagnetic braking", definition: "Using Lenz's Law to slow a moving conductor without physical contact. Eddy currents in the moving conductor create a magnetic force opposing its motion." },
        { term: "Lamination", definition: "Building transformer and motor cores from thin insulated metal sheets instead of solid blocks. Restricts eddy current loops to tiny paths, dramatically reducing energy loss as heat." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("magnetism-lenz-law")
      .set(lesson);
    console.log('✅ Lesson "Lenz\'s Law & Eddy Currents" seeded successfully!');
    console.log("   Path: courses/physics/lessons/magnetism-lenz-law");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order, "(unit order: 6 of 8)");
    console.log("   Visible: false — publish via Lesson Editor when ready");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
