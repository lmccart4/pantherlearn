// seed-motion2d-angled-projectiles.js
// Creates "Angled Projectiles" lesson (Unit 3: Motion in 2D, Lesson 4)
// Run: node scripts/seed-motion2d-angled-projectiles.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Angled Projectiles",
  questionOfTheDay: "A soccer player kicks a ball at 45 degrees and another at 60 degrees with the same speed. Which one travels farther? The answer surprises most people.",
  course: "Physics",
  unit: "Motion in 2D",
  order: 4,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "⚽",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "callout-qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A soccer player kicks a ball at 45 degrees and another at 60 degrees with the same speed. Which one travels farther? The answer surprises most people."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Think back to the last lesson. In a horizontal launch, the initial vertical velocity was zero. Now imagine you throw a ball upward at an angle. Compared to a horizontal launch, what changes?",
      options: [
        "The ball now has an initial vertical velocity AND horizontal velocity",
        "Gravity no longer acts on the ball",
        "The horizontal velocity is no longer constant",
        "The ball doesn't follow a curved path anymore"
      ],
      correctIndex: 0,
      explanation: "When you launch at an angle, you're giving the object both a horizontal AND vertical component of velocity. Gravity still acts the same way (only vertically), and horizontal velocity is still constant. The big difference is that the ball now goes UP before it comes down.",
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
        "Break an initial velocity into horizontal and vertical components using trigonometry",
        "Solve angled projectile problems using component equations",
        "Explain the symmetry of projectile motion on level ground",
        "Calculate maximum height and range for an angled launch",
        "Identify the launch angle that maximizes range (45 degrees)"
      ]
    },

    // ═══════════════════════════════════════════
    // FROM HORIZONTAL TO ANGLED
    // ═══════════════════════════════════════════
    {
      id: "section-transition",
      type: "section_header",
      icon: "📐",
      title: "From Horizontal to Angled Launches",
      subtitle: "~8 minutes"
    },
    {
      id: "b-transition",
      type: "text",
      content: "Last lesson, we launched objects **horizontally** — the initial velocity was entirely in the x-direction. That made things simpler because v₀ᵧ = 0.\n\nNow we're launching at an **angle above the horizontal**. Think of kicking a soccer ball, launching a water balloon from a slingshot, or a basketball shot. The object goes up AND forward.\n\nThe physics is identical — horizontal and vertical are still independent. The only difference is that now we need to **split the initial velocity into two components** using trigonometry."
    },
    {
      id: "b-def-components",
      type: "definition",
      term: "Velocity Components",
      definition: "The horizontal (v₀ₓ) and vertical (v₀ᵧ) parts of an initial velocity vector. For a launch speed v₀ at angle θ above horizontal: v₀ₓ = v₀ cos θ (horizontal part) and v₀ᵧ = v₀ sin θ (vertical part). These components are independent and get analyzed separately."
    },
    {
      id: "callout-components",
      type: "callout",
      style: "insight",
      icon: "🔑",
      content: "**The Two Equations You Need:**\n\n- **v₀ₓ = v₀ cos θ** — horizontal component (stays constant the whole flight)\n- **v₀ᵧ = v₀ sin θ** — vertical component (changes due to gravity)\n\nOnce you split the velocity, everything works exactly like before. Horizontal: constant velocity. Vertical: free fall with an initial upward velocity."
    },
    {
      id: "q-components-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A water balloon is launched at 20 m/s at 30° above the horizontal. What is its initial horizontal velocity (v₀ₓ)?",
      options: [
        "20 m/s",
        "20 × sin(30°) = 10 m/s",
        "20 × cos(30°) = 17.3 m/s",
        "20 × tan(30°) = 11.5 m/s"
      ],
      correctIndex: 2,
      explanation: "Horizontal component uses cosine: v₀ₓ = v₀ cos θ = 20 × cos(30°) = 20 × 0.866 = 17.3 m/s. Remember: cos gives you the side ADJACENT to the angle (horizontal), sin gives you the side OPPOSITE (vertical).",
      difficulty: "apply"
    },
    {
      id: "q-components-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A football is kicked at 25 m/s at an angle of 53° above the horizontal. Calculate: (a) the horizontal component v₀ₓ and (b) the vertical component v₀ᵧ. Round to one decimal place.",
      placeholder: "v₀ₓ = 25 × cos(53°) = ... v₀ᵧ = 25 × sin(53°) = ...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SYMMETRY
    // ═══════════════════════════════════════════
    {
      id: "section-symmetry",
      type: "section_header",
      icon: "🔄",
      title: "The Symmetry of Projectile Motion",
      subtitle: "~8 minutes"
    },
    {
      id: "b-symmetry",
      type: "text",
      content: "When a projectile is launched from and lands on **level ground**, something beautiful happens — the motion is perfectly symmetric:\n\n```\n                    ★ peak\n                 ╱     ╲\n              ╱           ╲\n           ╱                 ╲\n        ╱                       ╲\n     ╱                             ╲\n  launch ─────────────────────── landing\n         ◄──── half range ────►\n```\n\n**What symmetry means:**\n\n- **Time up = Time down.** If it takes 2 seconds to reach the peak, it takes 2 seconds to fall back. Total flight time = 2 × time to peak.\n\n- **Speed at launch = Speed at landing.** The object returns to its original height with the same speed it started with (just angled downward now).\n\n- **Vertical velocity at the peak = 0.** At the very top, the projectile has momentarily stopped moving upward. It still has horizontal velocity — it hasn't stopped entirely.\n\n- **The peak happens at exactly half the total flight time.**"
    },
    {
      id: "callout-peak",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Common Mistake:** Students think the object \"stops\" at the peak. It doesn't! At the peak, the VERTICAL velocity is zero, but the horizontal velocity is still going strong. The object is still moving — just purely horizontally for that instant."
    },
    {
      id: "q-symmetry-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ball launched at an angle reaches its maximum height after 3 seconds. If it lands on level ground, what is the total flight time?",
      options: [
        "3 seconds",
        "4.5 seconds",
        "6 seconds",
        "9 seconds"
      ],
      correctIndex: 2,
      explanation: "By symmetry, time up = time down. If it takes 3 seconds to reach the peak, it takes 3 more seconds to fall back. Total time = 2 × 3 = 6 seconds. This only works for launches and landings at the same height.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SOLVING ANGLED PROBLEMS
    // ═══════════════════════════════════════════
    {
      id: "section-solving",
      type: "section_header",
      icon: "🧮",
      title: "Solving Angled Projectile Problems",
      subtitle: "~12 minutes"
    },
    {
      id: "b-strategy",
      type: "text",
      content: "### Problem-Solving Strategy\n\n**Step 1: Break v₀ into components.**\n- v₀ₓ = v₀ cos θ\n- v₀ᵧ = v₀ sin θ\n\n**Step 2: Analyze vertical motion to find time.**\n- Time to peak: v₀ᵧ = g × t_peak → t_peak = v₀ᵧ / g\n- Total time (level ground): t_total = 2 × t_peak\n\n**Step 3: Find maximum height.**\n- h_max = v₀ᵧ² / (2g)\n- Or equivalently: h_max = v₀ᵧ × t_peak − ½g × t_peak²\n\n**Step 4: Find range (horizontal distance).**\n- Range = v₀ₓ × t_total\n\n**Step 5: Check — does the answer make physical sense?**"
    },
    {
      id: "b-worked-example-1",
      type: "text",
      content: "### Worked Example 1: Soccer Kick\n\n**Problem:** A soccer player kicks a ball at 18 m/s at 40° above the ground. Find: (a) time in the air, (b) maximum height, (c) how far it travels.\n\n**Step 1: Components.**\n- v₀ₓ = 18 cos(40°) = 18 × 0.766 = 13.8 m/s\n- v₀ᵧ = 18 sin(40°) = 18 × 0.643 = 11.6 m/s\n\n**Step 2: Time (using vertical).**\n- Time to peak: t_peak = v₀ᵧ / g = 11.6 / 9.8 = 1.18 s\n- Total time: t_total = 2 × 1.18 = **2.37 s**\n\n**Step 3: Maximum height.**\n- h_max = v₀ᵧ² / (2g) = (11.6)² / (2 × 9.8) = 134.6 / 19.6 = **6.87 m**\n\n**Step 4: Range.**\n- Range = v₀ₓ × t_total = 13.8 × 2.37 = **32.7 m**\n\nA 32.7 m kick — about a third of the field. That checks out for a solid mid-field pass."
    },
    {
      id: "b-worked-example-2",
      type: "text",
      content: "### Worked Example 2: Water Balloon Launch\n\n**Problem:** You launch a water balloon at 12 m/s at 60° above horizontal at your friend 8 meters away. Does it reach them?\n\n**Step 1: Components.**\n- v₀ₓ = 12 cos(60°) = 12 × 0.5 = 6 m/s\n- v₀ᵧ = 12 sin(60°) = 12 × 0.866 = 10.4 m/s\n\n**Step 2: Total flight time.**\n- t_peak = 10.4 / 9.8 = 1.06 s\n- t_total = 2 × 1.06 = 2.12 s\n\n**Step 3: Range.**\n- Range = 6 × 2.12 = **12.7 m**\n\n**Verdict:** Yes — the balloon travels 12.7 m, overshooting your friend by almost 5 meters. You'd need to aim at a lower angle or throw softer."
    },

    // ═══════════════════════════════════════════
    // THE OPTIMAL ANGLE
    // ═══════════════════════════════════════════
    {
      id: "section-optimal",
      type: "section_header",
      icon: "🎯",
      title: "The Optimal Angle: 45°",
      subtitle: "~5 minutes"
    },
    {
      id: "b-optimal",
      type: "text",
      content: "Here's a question worth thinking about: if you launch a projectile at a fixed speed, what angle gives you the **maximum range**?\n\nThe answer is **45 degrees** — exactly halfway between horizontal and vertical.\n\n### Why 45°?\n\nIt's a tradeoff:\n- **Low angles** (like 15°): lots of horizontal speed, but the ball doesn't stay in the air long enough to go far\n- **High angles** (like 75°): the ball stays up a long time, but it doesn't cover much ground horizontally\n- **45°**: the perfect balance between time in the air and horizontal speed\n\n### Complementary Angles\n\nAngles that add up to 90° give the **same range** (but different heights):\n- 30° and 60° → same range\n- 20° and 70° → same range\n- 15° and 75° → same range\n\nThe steeper angle goes higher but travels the same horizontal distance."
    },
    {
      id: "q-optimal-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A cannon fires at a fixed speed. At which angle will the cannonball travel the greatest horizontal distance on level ground?",
      options: [
        "30°",
        "45°",
        "60°",
        "90°"
      ],
      correctIndex: 1,
      explanation: "45° maximizes range for a given launch speed on level ground. It's the ideal balance between horizontal velocity (which decreases as angle increases) and time in the air (which increases as angle increases). At 90° the ball goes straight up and comes straight back down — zero range.",
      difficulty: "recall"
    },
    {
      id: "q-optimal-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A ball launched at 30° lands 50 meters away. If launched at the same speed but at 60°, how far does it land?",
      options: [
        "25 meters",
        "50 meters — same range because 30° and 60° are complementary",
        "75 meters",
        "100 meters"
      ],
      correctIndex: 1,
      explanation: "Complementary angles (angles that add to 90°) give the same range. 30° + 60° = 90°, so both launches travel 50 meters. The 60° shot goes much higher, but lands at the same spot.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // PRACTICE
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "✏️",
      title: "Practice",
      subtitle: "~8 minutes"
    },
    {
      id: "q-practice-1",
      type: "question",
      questionType: "short_answer",
      prompt: "A basketball player shoots from the 3-point line at 9 m/s at 50° above the horizontal. (a) Find the horizontal and vertical components of the initial velocity. (b) How long is the ball in the air? (c) What is the maximum height above the release point?",
      placeholder: "(a) v₀ₓ = 9cos(50°) = ... v₀ᵧ = 9sin(50°) = ... (b) t_total = 2 × v₀ᵧ/g = ... (c) h = v₀ᵧ²/(2g) = ...",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "short_answer",
      prompt: "A golf ball is hit at 40 m/s at 35° above the ground. Calculate: (a) the range and (b) the maximum height. Then (c) at what other angle could you hit it at the same speed and get the same range?",
      placeholder: "(a) Range = v₀ₓ × t_total = ... (b) h_max = v₀ᵧ²/(2g) = ... (c) The complementary angle is ...",
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
      content: "Today's key takeaways:\n\n- An angled launch has both a horizontal AND vertical initial velocity\n- Split using trig: **v₀ₓ = v₀ cos θ** and **v₀ᵧ = v₀ sin θ**\n- After splitting, solve horizontal and vertical separately — same as last lesson\n- On level ground, the motion is **symmetric**: time up = time down, total time = 2 × v₀ᵧ / g\n- **Maximum height:** h = v₀ᵧ² / (2g)\n- **Range:** R = v₀ₓ × t_total\n- **45°** gives maximum range for a given speed\n- Complementary angles (adding to 90°) give the same range but different heights\n\n**Coming up:** We'll put all of Unit 3 together — combining vectors, horizontal launches, and angled launches into real-world analysis problems."
    },
    {
      id: "q-exit",
      type: "question",
      questionType: "short_answer",
      prompt: "Exit Ticket: A tennis ball is served at 30 m/s at 8° below the horizontal from a height of 2.5 m. Wait — that's not an angled launch upward. Explain why this problem is DIFFERENT from what we learned today, and describe how you'd approach solving it.",
      placeholder: "This is different because...",
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
        { term: "Velocity Components", definition: "The horizontal (v₀ₓ) and vertical (v₀ᵧ) parts of an initial velocity. Found using v₀ₓ = v₀ cos θ and v₀ᵧ = v₀ sin θ." },
        { term: "Launch Angle (θ)", definition: "The angle between the initial velocity vector and the horizontal. Determines the ratio of horizontal to vertical velocity." },
        { term: "Symmetry of Projectile Motion", definition: "On level ground, the time going up equals the time coming down, and the speed at launch equals the speed at landing." },
        { term: "Maximum Height", definition: "The highest point a projectile reaches. At this point, vertical velocity is zero. Calculated as h = v₀ᵧ² / (2g)." },
        { term: "Range", definition: "The total horizontal distance a projectile travels from launch to landing. Maximized at a 45° launch angle for a given speed." },
        { term: "Complementary Angles", definition: "Two angles that add up to 90° (like 30° and 60°). When launched at the same speed, complementary angles produce the same range but different maximum heights." },
        { term: "Time of Flight", definition: "The total time a projectile is in the air. For level ground: t = 2v₀ᵧ / g." }
      ]
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("motion2d-angled-projectiles")
      .set(lesson);
    console.log('✅ Lesson "Angled Projectiles" seeded successfully!');
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
