// seed-energy-skate-park-lab.js
// Creates the "Energy Skate Park Lab" lesson in the Physics course.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-energy-skate-park-lab.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Energy Skate Park Lab",
  course: "Physics",
  unit: "Energy",
  order: 5,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🛹",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-warmup-text",
      type: "text",
      content: "Last class you drew energy bar charts to visualize conservation of energy — tracking how KE, GPE, and EPE trade off while the total stays constant. Today you'll watch those bar charts update **in real time** as a skater rolls through a halfpipe.\n\nPicture a skateboarder rolling into a halfpipe. At the top of the ramp, they're barely moving. At the bottom, they're flying. Halfway back up the other side, they slow again. Conservation of energy in action."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Using what you learned about conservation and bar charts: if a skater starts at the top of a ramp with all GPE and no KE, sketch in your mind what the bar chart looks like at the bottom. What energy types are present at each point?",
      difficulty: "understand"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A skater rolls back and forth forever in a frictionless halfpipe. Is this actually possible? Why or why not?"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "b-objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Observe how kinetic energy and gravitational potential energy trade off as a skater moves along a track",
        "Use the live energy bar chart to connect simulation behavior to conservation of energy",
        "Explain how friction causes mechanical energy to decrease over time by converting it to thermal energy",
        "Predict how changing mass and height affect the skater's speed and energy",
        "Distinguish between a frictionless ideal system and a real-world system with energy loss"
      ]
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 1: MEET THE SIMULATION
    // ═══════════════════════════════════════════
    {
      id: "section-meet",
      type: "section_header",
      icon: "🖥️",
      title: "Activity 1: Meet the Simulation",
      subtitle: "~10 minutes"
    },
    {
      id: "b-meet-text",
      type: "text",
      content: "The **PhET Energy Skate Park** simulation lets you watch the energy bar charts you've been drawing come alive. As the skater moves, live bars update showing:\n\n- **KE** — Kinetic Energy\n- **PE** — Gravitational Potential Energy\n- **Thermal** — Heat energy created by friction\n- **Total** — The sum of all three\n\nYou already know the total should stay constant (E_initial = E_final). Now watch it happen. Start on the **Intro** tab — drag the skater to different heights and press Play."
    },
    {
      id: "sim-intro",
      type: "simulation",
      icon: "🛹",
      title: "PhET: Energy Skate Park",
      url: "https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_en.html",
      height: 560,
      observationPrompt: "Explore the simulation for 2–3 minutes. Watch the energy bars as the skater moves. What do you notice about the KE and PE bars as the skater goes up and down the ramp?"
    },
    {
      id: "q-meet-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When the skater is at the TOP of the ramp (momentarily stopped), which bar is tallest?",
      difficulty: "understand",
      options: [
        "KE (kinetic energy)",
        "PE (potential energy)",
        "Thermal energy",
        "All bars are equal"
      ],
      correctIndex: 1,
      explanation: "At the top of the ramp, the skater is momentarily stopped (no motion = no KE) and is at maximum height (maximum GPE). All the mechanical energy is stored as gravitational potential energy."
    },
    {
      id: "q-meet-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "When the skater is at the BOTTOM of the ramp (moving fastest), which bar is tallest?",
      difficulty: "understand",
      options: [
        "KE (kinetic energy)",
        "PE (potential energy)",
        "Thermal energy",
        "The Total bar disappears"
      ],
      correctIndex: 0,
      explanation: "At the bottom, height = 0 so GPE = 0, but the skater is moving at maximum speed. All the energy has converted to kinetic energy — the KE bar is at its maximum."
    },
    {
      id: "callout-insight",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Notice the Total bar.** Without friction, the Total energy bar never changes height — it just stays fixed while KE and PE trade off. That's the Law of Conservation of Energy in action, live."
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 2: FRICTIONLESS INVESTIGATION
    // ═══════════════════════════════════════════
    {
      id: "section-frictionless",
      type: "section_header",
      icon: "⚡",
      title: "Activity 2: Frictionless Investigation",
      subtitle: "~15 minutes"
    },
    {
      id: "b-frictionless-text",
      type: "text",
      content: "First, make sure **Friction is set to None** (drag the friction slider to the left on the Intro tab). Now you'll run a series of controlled investigations.\n\nFor each investigation below, change **only one variable** and observe what happens. Good scientists change one thing at a time!"
    },
    {
      id: "checklist-frictionless",
      type: "checklist",
      title: "Frictionless Investigations — Check each off as you complete it",
      items: [
        "Investigation A: Start the skater from a LOW point on the ramp — observe the max speed and bar heights",
        "Investigation B: Start the skater from a HIGH point on the ramp — observe the max speed and bar heights",
        "Investigation C: Change the skater's MASS to the heaviest option — start from the same height as Investigation B",
        "Investigation D: Try the 'Loop' track or a custom track shape — does conservation still hold?",
        "Investigation E: Find the point on the track where KE = PE (the bars are equal height)"
      ]
    },
    {
      id: "q-frictionless-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Compare Investigation A and B. When you released the skater from a HIGHER point, what happened to their maximum speed at the bottom? Explain why using energy — where did the extra speed come from?",
      difficulty: "analyze"
    },
    {
      id: "q-frictionless-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Investigation C, you increased the skater's mass but kept the starting height the same. What happened to the skater's maximum SPEED at the bottom compared to the lighter skater?",
      difficulty: "analyze",
      options: [
        "The heavier skater moved faster — more mass means more energy",
        "The heavier skater moved at the same speed — height determines speed, not mass",
        "The heavier skater moved slower — the extra weight held it back",
        "The heavier skater never reached the bottom"
      ],
      correctIndex: 1,
      explanation: "This is one of physics' most surprising results. The speed at the bottom depends only on starting height (v = √(2gh)), not mass. A heavier skater has MORE total energy (GPE = mgh is bigger) but also needs more KE to move at the same speed (KE = ½mv²). The mass cancels out — both skaters reach the same speed! (This is the same reason a feather and a bowling ball fall at the same rate in a vacuum.)"
    },
    {
      id: "q-frictionless-3",
      type: "question",
      questionType: "short_answer",
      prompt: "In Investigation D, you tried a different track shape (loop or custom). Did the skater still obey conservation of energy on the new track? Describe what the energy bars looked like as the skater moved through the unusual shape.",
      difficulty: "evaluate"
    },
    {
      id: "q-frictionless-4",
      type: "question",
      questionType: "short_answer",
      prompt: "Investigation E: Describe where on the track the KE and PE bars were equal. What does it mean physically when KE = PE? What fraction of the original height was the skater at when this happened?",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 3: ADDING FRICTION
    // ═══════════════════════════════════════════
    {
      id: "section-friction",
      type: "section_header",
      icon: "🔥",
      title: "Activity 3: What Happens When We Add Friction?",
      subtitle: "~10 minutes"
    },
    {
      id: "b-friction-text",
      type: "text",
      content: "Real skate parks have friction. When a skater's wheels roll against the surface, some energy converts into **thermal energy** (heat). This doesn't violate conservation of energy — thermal energy is just energy that's harder to use.\n\nNow drag the friction slider to **medium** or **lots** on the same track you used before. Start the skater from the same height as before and watch what happens over several back-and-forth swings."
    },
    {
      id: "callout-friction-warning",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Watch the Total bar carefully.** With friction ON, the Total mechanical energy bar slowly shrinks — but the energy isn't being destroyed. It's being transferred *out* of the mechanical system into thermal energy (heat in the surface). If you could add a 'Thermal' bar to the Total, it would stay constant."
    },
    {
      id: "q-friction-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "With friction turned ON, what happens to the skater's maximum height on each successive swing?",
      difficulty: "understand",
      options: [
        "It stays exactly the same — energy is conserved",
        "It increases slightly as the skater gains momentum",
        "It decreases each time — the skater can't reach as high",
        "The skater immediately stops at the bottom"
      ],
      correctIndex: 2,
      explanation: "Each time the skater moves, friction converts some mechanical energy into thermal energy. With less mechanical energy available, the skater can't convert it all back into height — so maximum height decreases each swing. Eventually the skater settles at the lowest point."
    },
    {
      id: "q-friction-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A student watching the simulation says: 'Friction is destroying energy — the skater has less energy every time.' You disagree. Write a 2–3 sentence correction explaining what friction is *actually* doing to the energy, and where the 'missing' energy went.",
      difficulty: "evaluate"
    },
    {
      id: "q-friction-3",
      type: "question",
      questionType: "ranking",
      prompt: "A skater starts with friction ON and makes 3 full swings before slowing to a stop. Rank these moments from MOST mechanical energy (KE + PE) to LEAST:",
      difficulty: "analyze",
      items: [
        "The very first release (before any swings)",
        "The top of the first return swing",
        "The top of the second return swing",
        "The skater resting at the bottom"
      ]
    },

    // ═══════════════════════════════════════════
    // ACTIVITY 4: TRACK DESIGN CHALLENGE
    // ═══════════════════════════════════════════
    {
      id: "section-design",
      type: "section_header",
      icon: "✏️",
      title: "Activity 4: Design Your Track",
      subtitle: "~10 minutes"
    },
    {
      id: "b-design-text",
      type: "text",
      content: "Switch to the **Playground** tab in the simulation. Here you can:\n- Drag track pieces to build any shape you want\n- Add loops, jumps, valleys, and hills\n- Adjust the skater's starting position\n- Toggle friction on or off\n\nYour challenge: **Design a track where the skater successfully completes a loop.** This is harder than it sounds! The skater needs enough KE at the bottom to carry them through the top of the loop."
    },
    {
      id: "activity-design",
      type: "activity",
      icon: "🛹",
      title: "Track Design Challenge",
      instructions: "1. Open the **Playground** tab in the simulation above.\n2. Build a track that includes at least one loop or significant hill after a valley.\n3. Experiment with different starting heights until your skater makes it through.\n4. Once you succeed, sketch your track design below.\n5. Then answer the questions about your design."
    },
    {
      id: "sketch-track",
      type: "sketch",
      title: "Sketch Your Winning Track Design",
      instructions: "Draw the shape of your track. Label:\n• The starting point (where you drop the skater)\n• The lowest point (where KE is maximum)\n• The highest point the skater reaches\n• Any loops or hills\n• Approximate relative heights",
      canvasHeight: 380
    },
    {
      id: "q-design-1",
      type: "question",
      questionType: "linked",
      prompt: "Look at your track sketch. What was the minimum starting height that allowed your skater to complete the loop? Why does starting height matter so much — explain using energy concepts.",
      difficulty: "apply",
      linkedBlockId: "sketch-track"
    },
    {
      id: "q-design-2",
      type: "question",
      questionType: "short_answer",
      prompt: "At the very TOP of your loop, what types of energy does the skater have? Which type is larger at that moment, and why does it need to be that way for the skater to make it through without falling?",
      difficulty: "analyze"
    },
    {
      id: "chat-design",
      type: "chatbot",
      icon: "🛹",
      title: "Discuss Your Design with an AI Physics Tutor",
      starterMessage: "Hey! I heard you just designed a skate track in the PhET simulation. Tell me about it — did the skater make it through the loop? What did you have to change to get it to work?",
      systemPrompt: "You are an encouraging high school physics tutor helping students reflect on a PhET Energy Skate Park simulation activity. The student just designed a custom skate track and is discussing their findings. Your goals: (1) help them connect their observations to conservation of energy, KE, GPE, and friction; (2) ask probing questions to deepen understanding (e.g., 'What would happen if the skater started lower?', 'Where was KE at its maximum?'); (3) correct misconceptions gently with clear explanations. Keep responses to 3-5 sentences. Use encouraging, age-appropriate language for 9th-10th graders. Stay focused on energy concepts — redirect off-topic conversations kindly.",
      instructions: "Chat with the AI tutor about your track design. Describe what you built, what happened, and what you had to adjust. The tutor will ask follow-up questions to help you think deeper about the energy concepts.",
      placeholder: "Tell the AI tutor about your track..."
    },

    // ═══════════════════════════════════════════
    // CHECK YOUR UNDERSTANDING
    // ═══════════════════════════════════════════
    {
      id: "section-check",
      type: "section_header",
      icon: "✅",
      title: "Check Your Understanding",
      subtitle: "~5 minutes"
    },
    {
      id: "q-check-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A skater starts from rest at the top of a 4-meter ramp (no friction). At the bottom, almost all their energy is kinetic. If the skater then goes up the other side of the ramp, how high will they reach?",
      difficulty: "apply",
      options: [
        "Less than 4 meters — they lose some energy going across the bottom",
        "Exactly 4 meters — conservation of energy guarantees the same height",
        "More than 4 meters — they gained speed at the bottom",
        "It depends on the skater's mass"
      ],
      correctIndex: 1,
      explanation: "In a frictionless system, mechanical energy is conserved: E_initial = E_final. The skater starts with GPE = mgh at 4 m. At the bottom, all energy is KE. Going up the other side, all KE converts back to GPE. Since total energy is the same, the height will be exactly 4 m — regardless of mass or track shape."
    },
    {
      id: "q-check-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In the simulation with friction ON, the skater starts at 3 m high and eventually comes to rest at the lowest point of the track. Which statement BEST describes what happened to the energy?",
      difficulty: "analyze",
      options: [
        "The gravitational potential energy was destroyed by friction",
        "The 3 m of height converted to speed, which was then destroyed by friction",
        "The initial GPE was gradually converted to thermal energy as friction slowed the skater",
        "The skater lost energy to gravity, which absorbed it"
      ],
      correctIndex: 2,
      explanation: "Conservation of energy still holds even with friction. The initial GPE (from being at 3 m height) was converted through multiple cycles — some to KE, some KE back to GPE, but each cycle a little more went to thermal energy (heat from friction). Eventually all the initial GPE became thermal energy in the track/wheels. None was destroyed."
    },
    {
      id: "q-check-3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You double the starting HEIGHT of the skater on a frictionless track. What happens to the skater's maximum SPEED at the bottom?",
      difficulty: "apply",
      options: [
        "Speed doubles — twice the height means twice the speed",
        "Speed increases, but less than doubles — speed goes as √(2gh)",
        "Speed stays the same — mass hasn't changed",
        "Speed quadruples — kinetic energy is proportional to v²"
      ],
      correctIndex: 1,
      explanation: "GPE = mgh converts to KE = ½mv², so mgh = ½mv² → v = √(2gh). If h doubles, v = √(2g·2h) = √2 · √(2gh) — speed increases by a factor of √2 ≈ 1.41, not 2. Because KE depends on v², doubling the height only gives you √2 times the speed."
    },
    {
      id: "q-check-4",
      type: "question",
      questionType: "short_answer",
      prompt: "A skater completes a loop-the-loop on a frictionless track. At the very top of the loop, a student claims the skater has zero kinetic energy because 'they're at their highest point.' Is the student correct? Explain using energy and circular motion reasoning.",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎬",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "b-summary",
      type: "text",
      content: "Today you used the PhET Energy Skate Park simulation to see conservation of energy in real time:\n\n- **Without friction:** KE and GPE trade off perfectly. As the skater goes up, KE → GPE. As they come down, GPE → KE. The **total stays constant forever**.\n- **With friction:** Some mechanical energy is converted to **thermal energy** each cycle. The skater can't return to the original height — but the total energy (including thermal) is still conserved.\n- **Mass doesn't affect speed:** Heavier skaters and lighter skaters reach the same maximum speed from the same height. The mass cancels in the math.\n- **Height determines speed:** Starting higher gives more GPE → more KE → more speed at the bottom.\n\n**Coming up next:** You'll head to the weight room and calculate the exact amount of energy you transfer when lifting weights — connecting physics formulas to **work, power, and Calories**."
    },
    {
      id: "callout-revisit",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Return to the Question of the Day:** A skater rolls back and forth forever in a frictionless halfpipe. Is this actually possible?\n\nAnswer: In theory — yes! In a perfectly frictionless system, energy would never leave the mechanical system and the skater would oscillate indefinitely. In reality, some friction always exists, so real skaters always slow down. The simulation lets us explore the ideal case."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A friend says 'I don't understand why a skater goes higher when they start higher — they're using the same energy either way.' Write a 2–3 sentence explanation using the ideas from today's lab. Use the words kinetic energy, potential energy, and conservation.",
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
        { term: "Friction", definition: "A force that opposes motion between surfaces in contact. In the skate park, friction converts mechanical energy to thermal energy, causing the skater to slow down over time." },
        { term: "Reference Point", definition: "The height defined as h = 0 for calculating GPE. Usually chosen to be the lowest point of the system. Your choice of reference point doesn't change the physics — only the numbers." },
        { term: "Frictionless System", definition: "An idealized system where no friction exists. Mechanical energy (KE + PE) is perfectly conserved and the skater would oscillate forever. Useful for understanding conservation before adding real-world complications." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("energy-skate-park-lab")
      .set(lesson);
    console.log('✅ Lesson "Energy Skate Park Lab" seeded successfully!');
    console.log("   Path: courses/physics/lessons/energy-skate-park-lab");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order: 4");
    console.log("   Visible: false (publish via Lesson Editor when ready)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}

seed();
