// seed-motion2d-relative-motion.js
// Creates "Relative Motion" lesson (Unit 3: Motion in 2D, Lesson 5)
// Run: node scripts/seed-motion2d-relative-motion.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Relative Motion",
  questionOfTheDay: "If you're walking forward on a bus going 30 mph, are you really walking at 3 mph? It depends on who you ask.",
  course: "Physics",
  unit: "Motion in 2D",
  order: 5,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🚌",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** If you're walking forward on a bus going 30 mph, are you really walking at 3 mph? It depends on who you ask."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're on a train moving at 60 mph. You walk toward the front of the train at 3 mph. How fast are you moving relative to someone standing on the ground outside?",
      options: [
        "3 mph",
        "57 mph",
        "60 mph",
        "63 mph"
      ],
      correctIndex: 3,
      explanation: "From the ground observer's perspective, your velocity is the train's velocity plus your walking velocity: 60 + 3 = 63 mph. But from your friend sitting on the train, you're only moving at 3 mph. Both answers are correct — it just depends on the reference frame!",
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
        "Define a reference frame and explain why velocity depends on the observer",
        "Use the relative velocity notation system: v_AB means velocity of A relative to B",
        "Apply the relative velocity addition equation: v_AC = v_AB + v_BC",
        "Solve 1D and 2D relative motion problems including river crossings",
        "Connect relative motion to real-world scenarios like planes in wind"
      ]
    },

    // ═══════════════════════════════════════════
    // REFERENCE FRAMES
    // ═══════════════════════════════════════════
    {
      id: "section-reference-frames",
      type: "section_header",
      icon: "👁️",
      title: "Reference Frames: It's All About Perspective",
      subtitle: "~8 minutes"
    },
    {
      id: "b-def-reference-frame",
      type: "definition",
      term: "Reference Frame",
      definition: "A coordinate system attached to an observer. The observer measures all positions and velocities relative to themselves. Different observers in different reference frames can measure different velocities for the same object."
    },
    {
      id: "b-reference-frame-intro",
      type: "text",
      content: "Imagine you're sitting in a car on the highway going 65 mph. Your phone is sitting on the seat next to you.\n\n- **From your perspective:** The phone isn't moving. Its velocity is 0 mph.\n- **From a person on the sidewalk:** The phone is flying by at 65 mph.\n- **From a car passing you at 70 mph:** Your phone is moving backward at 5 mph.\n\nSame phone. Three different velocities. **All three are correct.**\n\nThis is why physicists always specify: velocity *relative to what?* There's no such thing as an absolute velocity — all motion is relative to some observer."
    },
    {
      id: "callout-galileo",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Galileo figured this out in the 1600s.** He pointed out that if you're below deck on a smooth-sailing ship, you can't tell whether the ship is moving or stationary — everything inside behaves the same. There's no experiment you can do to detect constant-velocity motion from inside a closed room. This became the foundation for Einstein's relativity centuries later."
    },
    {
      id: "q-reference-frame-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two cars are driving north on a highway. Car A goes 70 mph and Car B goes 70 mph. What is the velocity of Car A relative to Car B?",
      options: [
        "70 mph north",
        "140 mph north",
        "0 mph — they're not moving relative to each other",
        "70 mph south"
      ],
      correctIndex: 2,
      explanation: "If both cars are going the same speed in the same direction, neither one is getting closer to or farther from the other. From Car B's perspective, Car A is just sitting still next to them. Relative velocity = 70 - 70 = 0 mph.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // NOTATION & EQUATION
    // ═══════════════════════════════════════════
    {
      id: "section-notation",
      type: "section_header",
      icon: "🔤",
      title: "The Notation System & Key Equation",
      subtitle: "~10 minutes"
    },
    {
      id: "b-notation",
      type: "text",
      content: "### The Subscript Notation\n\nPhysicists use a clean subscript system to keep track of \"what relative to what\":\n\n**v_AB** = velocity of **A** relative to **B**\n\n- First subscript = the thing that's moving\n- Second subscript = the observer (the reference frame)\n\n**Examples:**\n- v_PG = velocity of the **P**lane relative to the **G**round\n- v_BW = velocity of the **B**oat relative to the **W**ater\n- v_WG = velocity of the **W**ind (or water current) relative to the **G**round\n\nThis notation prevents confusion when you have multiple objects and observers."
    },
    {
      id: "b-key-equation",
      type: "callout",
      style: "formula",
      icon: "📐",
      content: "**The Relative Velocity Equation:**\n\n**v_AC = v_AB + v_BC**\n\nVelocity of A relative to C = velocity of A relative to B + velocity of B relative to C.\n\n**How to read it:** The inner subscripts (B and B) match and \"cancel\" — like a chain. A→B→C gives you A→C.\n\n**Flip rule:** v_BA = −v_AB (if A moves east relative to B, then B moves west relative to A)."
    },
    {
      id: "b-1d-example",
      type: "text",
      content: "### 1D Example: Walking on a Train\n\n**Problem:** A train moves east at 25 m/s relative to the ground. You walk forward (east) through the train at 1.5 m/s relative to the train. What's your velocity relative to the ground?\n\n**Identify the variables:**\n- v_TG = 25 m/s east (train relative to ground)\n- v_YT = 1.5 m/s east (you relative to train)\n- v_YG = ? (you relative to ground)\n\n**Apply the equation:**\nv_YG = v_YT + v_TG = 1.5 + 25 = **26.5 m/s east**\n\nThe inner subscripts (T and T) match, giving us You→Ground.\n\n**What if you walk toward the back of the train?**\nv_YT = −1.5 m/s (opposite direction)\nv_YG = −1.5 + 25 = **23.5 m/s east**\n\nYou're still moving east relative to the ground — just a bit slower."
    },
    {
      id: "q-notation-practice",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A person (P) walks at 2 m/s on a moving sidewalk (S) that travels at 1.5 m/s relative to the ground (G). The person walks in the same direction as the sidewalk. What is v_PG?",
      options: [
        "0.5 m/s",
        "1.5 m/s",
        "2.0 m/s",
        "3.5 m/s"
      ],
      correctIndex: 3,
      explanation: "v_PG = v_PS + v_SG = 2.0 + 1.5 = 3.5 m/s. The person's velocity relative to the ground is the sum of their walking speed on the sidewalk and the sidewalk's speed. The inner subscripts (S, S) cancel: P→S→G = P→G.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // 2D: THE RIVER CROSSING
    // ═══════════════════════════════════════════
    {
      id: "section-river",
      type: "section_header",
      icon: "🏊",
      title: "The Classic: River Crossing Problems",
      subtitle: "~12 minutes"
    },
    {
      id: "b-river-setup",
      type: "text",
      content: "Here's where relative motion gets interesting — and two-dimensional.\n\n**The Setup:** A boat tries to cross a river. The boat has its own velocity through the water, but the water itself is flowing. The boat's actual path over the ground is the **vector sum** of both velocities.\n\n```\n         River current →  →  →  →  →  →\n\n  Start ──────────────────────────→ Landing\n  (south  \\                        point\n   bank)    \\    Actual path\n              \\   (diagonal)\n                \\\n                  \\  ↓ Boat aims\n                      straight across\n         River current →  →  →  →  →  →\n```\n\n**What's happening:**\n- The boat aims straight across (perpendicular to the banks)\n- The current pushes the boat downstream\n- The actual path over the ground is a diagonal — vector addition!"
    },
    {
      id: "b-river-worked",
      type: "text",
      content: "### Worked Example: Crossing the River\n\n**Problem:** A boat can travel at 4 m/s in still water. It aims straight across a 60 m wide river that has a current of 3 m/s flowing east. Find: (a) How long to cross? (b) How far downstream does it end up? (c) What is the boat's actual speed relative to the ground?\n\n**Setup the notation:**\n- v_BW = 4 m/s north (boat relative to water — it aims straight across)\n- v_WG = 3 m/s east (water/current relative to ground)\n- v_BG = v_BW + v_WG (boat relative to ground — what we want)\n\n**(a) Time to cross:**\nThe current doesn't affect how fast the boat crosses! Crossing speed = 4 m/s, width = 60 m.\nt = 60 / 4 = **15 seconds**\n\n**(b) Distance downstream:**\nDuring those 15 seconds, the current pushes the boat east.\nd = 3 m/s × 15 s = **45 m downstream**\n\n**(c) Actual speed (magnitude of v_BG):**\nv_BW and v_WG are perpendicular, so use Pythagoras:\nv_BG = √(4² + 3²) = √(16 + 9) = √25 = **5 m/s**"
    },
    {
      id: "callout-river-key",
      type: "callout",
      style: "insight",
      icon: "🔑",
      content: "**Key Insight:** The current does NOT affect how long it takes to cross the river. The crossing time depends only on the boat's speed perpendicular to the banks and the river width. The current only affects where you end up — it pushes you downstream."
    },
    {
      id: "q-river-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A swimmer can swim at 2 m/s in still water. She aims straight across a 40 m wide river with a current of 1.5 m/s. (a) How long does it take to cross? (b) How far downstream does she end up? (c) What is her speed relative to the ground? Show your work.",
      placeholder: "(a) t = width / swim speed = ... (b) d = current × t = ... (c) v = √(v_swim² + v_current²) = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // REAL WORLD: PLANES IN WIND
    // ═══════════════════════════════════════════
    {
      id: "section-applications",
      type: "section_header",
      icon: "✈️",
      title: "Real-World Applications",
      subtitle: "~8 minutes"
    },
    {
      id: "b-plane-wind",
      type: "text",
      content: "### Planes in Wind\n\nPilots deal with relative motion every single flight. An airplane's **airspeed** is its velocity relative to the air (v_PA). But the air itself moves — that's wind (v_AG, air relative to ground). The plane's **ground speed** is what actually matters for getting where you're going:\n\n**v_PG = v_PA + v_AG**\n\n- **Headwind** (wind opposes motion): Ground speed < airspeed. A plane with 500 mph airspeed flying into a 100 mph headwind has a ground speed of 400 mph. This is why flights from west to east across the US are faster — the jet stream pushes you.\n\n- **Tailwind** (wind in same direction): Ground speed > airspeed. Same plane with a 100 mph tailwind: 600 mph ground speed.\n\n- **Crosswind** (wind perpendicular): The plane drifts sideways. Pilots must aim slightly into the wind (called \"crabbing\") to fly a straight ground track."
    },
    {
      id: "b-more-examples",
      type: "text",
      content: "### More Everyday Examples\n\n**Escalators:** Walking up a moving escalator is relative motion in 1D. Your speed relative to the building = your walking speed + escalator speed. Walking down an up-escalator? You might go nowhere.\n\n**Running in the rain:** If rain falls straight down and you run forward, the rain appears to come at you at an angle — from the front. That's why you get wet on your front side when running. The rain's velocity relative to you has a horizontal component from your running.\n\n**Two cars on the highway:** If you're going 60 mph and a car passes you at 65 mph, they seem to creep past you at only 5 mph. But to someone on the sidewalk, that car is flying. Relative velocity changes everything."
    },
    {
      id: "q-application-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An airplane has an airspeed of 250 km/h and is flying due north. A wind blows from west to east at 80 km/h. What best describes the plane's motion relative to the ground?",
      options: [
        "250 km/h due north — wind doesn't affect planes",
        "330 km/h to the northeast",
        "The plane drifts east of its intended path, traveling faster than 250 km/h over the ground",
        "170 km/h due north — the crosswind slows it down"
      ],
      correctIndex: 2,
      explanation: "The crosswind pushes the plane eastward, so it drifts off its northward heading. The ground speed is √(250² + 80²) = √(62500 + 6400) = √68900 ≈ 262 km/h, directed northeast of due north. A crosswind doesn't slow you down — it deflects you sideways.",
      difficulty: "analyze"
    },
    {
      id: "q-application-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're standing still in the rain, and the rain falls straight down. You start running at 5 m/s. From YOUR reference frame, what direction does the rain appear to come from?",
      options: [
        "Still straight down — your motion doesn't change the rain",
        "From behind you",
        "At an angle from in front of you",
        "Horizontally from the front"
      ],
      correctIndex: 2,
      explanation: "When you run, the rain's velocity relative to you gains a horizontal component (opposite to your motion — it appears to come from the front). Combined with its downward component, it hits you at an angle from the front. This is why runners tilt their umbrellas forward!",
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
      id: "b-summary",
      type: "text",
      content: "Today's key takeaways:\n\n- **All motion is relative** — velocity only has meaning when you specify \"relative to what?\"\n- A **reference frame** is the coordinate system attached to an observer\n- The **notation** v_AB means \"velocity of A relative to B\" — first subscript moves, second subscript observes\n- The **key equation** is v_AC = v_AB + v_BC — inner subscripts match and \"cancel\"\n- The **flip rule**: v_BA = −v_AB\n- In **river problems**, the current doesn't affect crossing time — only where you land\n- In **airplane problems**, wind affects both speed and direction over the ground\n- These are **vector additions** — in 2D, use Pythagorean theorem for perpendicular velocities\n\n**Coming up:** We'll combine everything from this unit — vectors, projectiles, and relative motion — to tackle more complex 2D scenarios."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A boat aims straight across a 100 m wide river at 5 m/s (relative to water). The current flows at 3 m/s. (a) How long to cross? (b) How far downstream does it end up? (c) If you wanted to land directly across (zero drift), which direction would you need to aim — upstream or downstream — and why?",
      placeholder: "(a) t = 100/5 = ... (b) d = current × t = ... (c) Think about which way the current pushes and how to cancel it...",
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
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Reference Frame", definition: "A coordinate system attached to an observer, used to measure positions and velocities. Different reference frames can give different velocity measurements for the same object." },
        { term: "Relative Velocity", definition: "The velocity of one object as observed from another object's reference frame. Written as v_AB: velocity of A relative to B." },
        { term: "v_AB Notation", definition: "Subscript notation for relative velocity. First subscript (A) is the object moving; second subscript (B) is the observer. v_AB = −v_BA." },
        { term: "Ground Speed", definition: "An object's velocity relative to the ground. For planes, this is airspeed plus wind velocity (vector sum)." },
        { term: "Airspeed", definition: "An airplane's velocity relative to the surrounding air. Different from ground speed when wind is present." },
        { term: "Current (River)", definition: "The velocity of the water relative to the ground. Affects where a boat ends up but not how long it takes to cross." },
        { term: "Headwind / Tailwind", definition: "Wind blowing opposite (headwind) or in the same direction (tailwind) as an object's motion. Headwinds reduce ground speed; tailwinds increase it." },
        { term: "Crosswind", definition: "Wind blowing perpendicular to an object's intended path. Causes lateral drift without directly reducing forward speed." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion2d-relative-motion")
      .set(lesson);
    console.log('✅ Lesson "Relative Motion" seeded successfully!');
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
