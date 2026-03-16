// seed-work-energy-discovery.js
// Physics — Energy Unit, Lesson 8 (order: 7)
// "How Do We Change a System's Energy?"
// Run from your pantherlearn directory: node scripts/seed-work-energy-discovery.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "How Do We Change a System's Energy?",
  questionOfTheDay: "If a force is applied to an object but at a 90° angle to its motion, what happens to its energy — and why?",
  course: "Physics",
  unit: "Energy",
  order: 7,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════════

    {
      id: "section-warmup",
      type: "section_header",
      title: "Warm Up",
      subtitle: "~10 minutes",
      icon: "🔥"
    },
    {
      id: "b1",
      type: "objectives",
      title: "What You'll Figure Out Today",
      items: [
        "Discover what changes a system's energy",
        "Identify the direction of force and displacement in different experiments",
        "Find the pattern that connects force direction, displacement direction, and energy change"
      ]
    },
    {
      id: "b2",
      type: "text",
      content: "Imagine you have a piece of chalk sitting on the table. Your goal is to **crush it** — but you can't use your hands directly.\n\nInstead, you have two systems available to you:\n- **A wooden cart** (sitting motionless on the table)\n- **A brick** (sitting flat on the table)\n\nLet's see if either system can do the job right now."
    },
    {
      id: "q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A wooden cart is sitting motionless on the table. A piece of chalk is placed against the wall of the lab station. Can the cart crush the chalk right now?",
      options: [
        "No — the cart isn't moving, so it can't do anything to the chalk",
        "Yes — the cart is heavy enough to crush it",
        "Maybe — it depends on the type of chalk"
      ],
      correctIndex: 0,
      explanation: "A stationary cart has no ability to crush the chalk. It's just sitting there. It needs to be moving to do any damage.",
      difficulty: "understand"
    },
    {
      id: "q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A brick is sitting flat on the table, right next to the chalk. Can the brick crush the chalk right now?",
      options: [
        "No — the brick is just sitting there, it has no ability to fall onto the chalk",
        "Yes — the brick is heavy, so it should crush the chalk",
        "Maybe — if someone pushes it sideways into the chalk"
      ],
      correctIndex: 0,
      explanation: "The brick is sitting on the table at the same level as the chalk. It has no \"falling ability\" — it's not elevated above the chalk, so it can't do the job.",
      difficulty: "understand"
    },
    {
      id: "b3",
      type: "callout",
      style: "question",
      icon: "🤔",
      content: "Neither system can crush the chalk right now. In physics, we say they have no **energy** — no ability to do the job.\n\nSo the big question is: **How do we give these systems energy?** And what exactly are we doing when we change a system's energy?"
    },

    {
      id: "div1",
      type: "divider"
    },

    // ═══════════════════════════════════════════════
    // PART 1: KINETIC ENERGY (System: Cart)
    // ═══════════════════════════════════════════════

    {
      id: "section-main",
      type: "section_header",
      title: "Part 1: Kinetic Energy",
      subtitle: "System: Cart",
      icon: "🚗"
    },
    {
      id: "b4",
      type: "callout",
      style: "scenario",
      icon: "📦",
      content: "**System: Cart**\n\nFor the next three experiments, your system is a wooden cart. Place a piece of chalk directly against the wall of your lab station — the chalk is the \"job\" your system might be able to do."
    },
    {
      id: "b5",
      type: "text",
      content: "Grab a wooden cart and set it on your table. Place a piece of chalk directly against the wall of your lab station.\n\nRight now, the cart is **stationary**. It has **zero kinetic energy** — no ability to crush the chalk.\n\nYour first challenge: **change that.**"
    },

    // --- Experiment 1: Increase KE ---

    {
      id: "b6",
      type: "text",
      content: "### Experiment 1: Increase the Cart's Energy"
    },
    {
      id: "b7",
      type: "activity",
      title: "Give the Cart the Ability to Crush the Chalk",
      icon: "🔬",
      instructions: "The cart is sitting still. It currently has **no ability** to crush the chalk.\n\nYour job: **Do something to the cart so that it gains the ability to crush the chalk.** Use your hands and the cart. Figure it out. Try it!\n\n⚠️ Be safe and don't damage the classroom or lab equipment."
    },
    {
      id: "q3",
      type: "question",
      questionType: "short_answer",
      prompt: "What did you do to give the cart the ability to crush the chalk?",
      difficulty: "apply"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "How do you know the cart's kinetic energy INCREASED? What's different about the cart now compared to before?",
      difficulty: "analyze"
    },
    {
      id: "b8",
      type: "callout",
      style: "objective",
      icon: "🧭",
      content: "Now let's be precise about **directions**. When you applied a force to the cart, that force had a direction. And the cart moved — that motion (displacement) also had a direction."
    },
    {
      id: "q5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction did you push the cart? (This is the direction of the FORCE you applied to the system.)",
      options: [
        "Toward the wall (forward, in the direction of the chalk)",
        "Away from the wall (backward, away from the chalk)",
        "Upward",
        "Downward"
      ],
      correctIndex: 0,
      explanation: "You pushed the cart forward, toward the chalk against the wall. That's the direction of the force.",
      difficulty: "apply"
    },
    {
      id: "q6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction did the cart move? (This is the direction of the DISPLACEMENT of the system.)",
      options: [
        "Toward the wall (forward, same direction as the push)",
        "Away from the wall (backward, opposite the push)",
        "Upward",
        "Downward"
      ],
      correctIndex: 0,
      explanation: "The cart moved forward, toward the wall — the same direction you pushed it. That's the displacement.",
      difficulty: "apply"
    },
    {
      id: "q7",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Experiment 1, what was the relationship between the direction of the force you applied and the direction the cart moved (its displacement)?",
      options: [
        "Same direction — force and displacement pointed the same way",
        "Opposite directions — force and displacement pointed opposite ways",
        "Perpendicular — force was at a 90° angle to the displacement"
      ],
      correctIndex: 0,
      explanation: "You pushed the cart forward and it moved forward. The force and displacement were in the same direction. When force and displacement are in the same direction, the system's energy increases.",
      difficulty: "analyze"
    },

    {
      id: "div2",
      type: "divider"
    },

    // --- Experiment 2: Decrease KE ---

    {
      id: "b9",
      type: "text",
      content: "### Experiment 2: Decrease the Cart's Energy"
    },
    {
      id: "b10",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Important:** To *decrease* energy, the system needs to **have energy to start with**. That means you need to begin this experiment with the cart **already moving**.\n\nBe clear about when your experiment STARTS and when it ENDS."
    },
    {
      id: "b11",
      type: "activity",
      title: "Decrease the Cart's Kinetic Energy",
      icon: "🔬",
      instructions: "Start with a cart that is **already rolling** across the table (it has kinetic energy — it has the ability to crush chalk).\n\nYour job: **Do something to decrease the cart's kinetic energy.** The cart should end up with LESS ability to crush the chalk than it had at the start.\n\nBe ready to describe exactly when your experiment starts and ends."
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the START of your experiment. What was the cart doing at the beginning of the process?",
      difficulty: "apply"
    },
    {
      id: "q9",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the END of your experiment. What was the cart doing at the end of the process?",
      difficulty: "apply"
    },
    {
      id: "q10",
      type: "question",
      questionType: "short_answer",
      prompt: "What did you do to decrease the cart's kinetic energy?",
      difficulty: "apply"
    },
    {
      id: "q11",
      type: "question",
      questionType: "short_answer",
      prompt: "How do you know the cart's kinetic energy DECREASED? What evidence do you have?",
      difficulty: "analyze"
    },
    {
      id: "q12",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction was the force you applied to the cart? (Direction of the FORCE.)",
      options: [
        "Backward (opposite the cart's motion)",
        "Forward (same direction as the cart's motion)",
        "Upward",
        "Downward"
      ],
      correctIndex: 0,
      explanation: "To slow the cart down, you pushed against its motion — backward. That's the direction of the force.",
      difficulty: "apply"
    },
    {
      id: "q13",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction was the cart moving while you applied the force? (Direction of DISPLACEMENT.)",
      options: [
        "Forward (the cart kept moving in its original direction while slowing down)",
        "Backward (the cart reversed direction)",
        "Upward",
        "Downward"
      ],
      correctIndex: 0,
      explanation: "Even while slowing down, the cart was still moving forward. The displacement is in the direction the cart actually moved.",
      difficulty: "apply"
    },
    {
      id: "q14",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Experiment 2, what was the relationship between the direction of the force you applied and the direction the cart was moving (its displacement)?",
      options: [
        "Opposite directions — force and displacement pointed opposite ways",
        "Same direction — force and displacement pointed the same way",
        "Perpendicular — force was at a 90° angle to the displacement"
      ],
      correctIndex: 0,
      explanation: "You pushed against the cart's motion (backward) while the cart moved forward. The force and displacement were in opposite directions. When force and displacement are in opposite directions, the system's energy decreases.",
      difficulty: "analyze"
    },

    {
      id: "div3",
      type: "divider"
    },

    // --- Experiment 3: No Change to KE ---

    {
      id: "b12",
      type: "text",
      content: "### Experiment 3: A Force That Doesn't Change the Cart's Energy"
    },
    {
      id: "b13",
      type: "text",
      content: "Now for something different. The cart is rolling at a **constant velocity** across the table. Its kinetic energy isn't changing — it's staying the same.\n\nBut there ARE forces acting on the cart right now. Not every force changes a system's energy."
    },
    {
      id: "b14",
      type: "activity",
      title: "Find a Force That Doesn't Change KE",
      icon: "🔬",
      instructions: "The cart is rolling across the table at a steady speed.\n\nYour job: **Identify a force that is acting on the cart RIGHT NOW but is NOT changing the cart's kinetic energy.**\n\n💡 Hint: Don't just think about forces you apply with your hand. Think about ALL the forces acting on the cart — including ones that are always there."
    },
    {
      id: "q15",
      type: "question",
      questionType: "short_answer",
      prompt: "What force did you identify that is acting on the cart but NOT changing its kinetic energy?",
      difficulty: "analyze"
    },
    {
      id: "q16",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction does this force point? (Direction of the FORCE.)",
      options: [
        "Upward (if normal force) or Downward (if gravity)",
        "Forward (same direction as the cart's motion)",
        "Backward (opposite the cart's motion)"
      ],
      correctIndex: 0,
      explanation: "The normal force pushes upward from the table, and gravity pulls downward. Both of these forces are vertical — not in the direction the cart is rolling.",
      difficulty: "apply"
    },
    {
      id: "q17",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction is the cart moving? (Direction of DISPLACEMENT.)",
      options: [
        "Horizontally (across the table)",
        "Upward",
        "Downward"
      ],
      correctIndex: 0,
      explanation: "The cart is rolling across the table — its displacement is horizontal.",
      difficulty: "apply"
    },
    {
      id: "q18",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Experiment 3, what was the relationship between the direction of the force you identified and the direction the cart was moving (its displacement)?",
      options: [
        "Perpendicular — the force was at a 90° angle to the displacement",
        "Same direction — force and displacement pointed the same way",
        "Opposite directions — force and displacement pointed opposite ways"
      ],
      correctIndex: 0,
      explanation: "The normal force pushes upward and gravity pulls downward, but the cart moves horizontally. These forces are perpendicular (at 90°) to the displacement. When force and displacement are perpendicular, the system's energy does not change.",
      difficulty: "analyze"
    },

    {
      id: "div4",
      type: "divider"
    },

    // ═══════════════════════════════════════════════
    // PART 2: GRAVITATIONAL POTENTIAL ENERGY (System: Brick + Earth)
    // ═══════════════════════════════════════════════

    {
      id: "section-gpe",
      type: "section_header",
      title: "Part 2: Gravitational Potential Energy",
      subtitle: "System: Brick + Earth",
      icon: "🧱"
    },
    {
      id: "b15",
      type: "text",
      content: "Put the cart away. Grab a **brick** and a **plastic bucket**. Place the bucket on the ground.\n\nWe're switching to a completely different system and a different kind of energy."
    },
    {
      id: "b16",
      type: "callout",
      style: "scenario",
      icon: "📦",
      content: "**System: Brick + Earth**\n\nFor the next three experiments, your system is the brick AND the Earth together. The chalk is still the \"job\" — place the chalk inside the plastic bucket on the ground. Can this system crush it?"
    },
    {
      id: "b17",
      type: "text",
      content: "The brick is sitting on the ground next to the bucket. Think back to what we said in the warm up — it can't crush the chalk right now.\n\nBut here's the important part: **we are NOT going to push the brick sideways across the floor.** That would give it kinetic energy — motion energy — just like the cart.\n\nWe want to give this system a **different kind** of ability. One that involves **lifting** — so that if the brick were dropped into the bucket, it could crush the chalk inside."
    },
    {
      id: "q19",
      type: "question",
      questionType: "short_answer",
      prompt: "If you lift the brick above the bucket (with the chalk inside), can the brick crush the chalk? Why or why not? (Think carefully — is the brick actually crushing it while you hold it up?)",
      difficulty: "analyze"
    },
    {
      id: "q20",
      type: "question",
      questionType: "multiple_choice",
      prompt: "You're holding the brick above the bucket. Can the brick crush the chalk RIGHT NOW, while you're holding it?",
      options: [
        "Not yet — it has the POTENTIAL to crush it, but only if I drop it into the bucket (a trigger has to occur)",
        "Yes — it's above the bucket so it will crush the chalk",
        "No — lifting it doesn't help at all"
      ],
      correctIndex: 0,
      explanation: "The brick has the *potential* ability to fall into the bucket and crush the chalk, but it can't actually do the job until something triggers it — like you letting go. This is a stored, potential energy.",
      difficulty: "analyze"
    },
    {
      id: "b18",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "This is **gravitational potential energy** — a stored ability to do a job. The brick *could* crush the chalk if you dropped it into the bucket, but it can't do anything while you're holding it. The energy is **potential** (stored), not **kinetic** (happening right now).\n\n⚠️ **Always drop the brick into the plastic bucket on the ground.** Be safe and don't damage the classroom or lab equipment."
    },

    {
      id: "div5",
      type: "divider"
    },

    // --- Experiment 4: Increase GPE ---

    {
      id: "b19",
      type: "text",
      content: "### Experiment 4: Increase the Brick's Gravitational Potential Energy"
    },
    {
      id: "b20",
      type: "activity",
      title: "Give the Brick + Earth System the Ability to Crush the Chalk",
      icon: "🔬",
      instructions: "The brick is sitting on the ground next to the bucket. It currently has **no gravitational potential energy** — no falling ability, no stored ability to crush the chalk.\n\nYour job: **Do something to the brick so that the system gains gravitational potential energy.** The system should end up with the potential ability to crush the chalk inside the bucket (if dropped in).\n\nRemember: We want **potential** (stored) ability, not sideways kinetic energy."
    },
    {
      id: "q21",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the START of your experiment. Where is the brick and what is it doing?",
      difficulty: "apply"
    },
    {
      id: "q22",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the END of your experiment. Where is the brick and what is it doing?",
      difficulty: "apply"
    },
    {
      id: "q23",
      type: "question",
      questionType: "short_answer",
      prompt: "What did you do to increase the brick's gravitational potential energy?",
      difficulty: "apply"
    },
    {
      id: "q24",
      type: "question",
      questionType: "short_answer",
      prompt: "How do you know the gravitational potential energy INCREASED? What's different about the system now?",
      difficulty: "analyze"
    },
    {
      id: "q25",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction was the force you applied to the brick? (Direction of the FORCE.)",
      options: [
        "Upward",
        "Downward",
        "Horizontally (sideways)"
      ],
      correctIndex: 0,
      explanation: "You lifted the brick upward. The force you applied was in the upward direction.",
      difficulty: "apply"
    },
    {
      id: "q26",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction did the brick move? (Direction of DISPLACEMENT.)",
      options: [
        "Upward",
        "Downward",
        "Horizontally (sideways)"
      ],
      correctIndex: 0,
      explanation: "The brick moved upward — that's its displacement.",
      difficulty: "apply"
    },
    {
      id: "q27",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Experiment 4, what was the relationship between the direction of the force you applied and the direction the brick moved (its displacement)?",
      options: [
        "Same direction — force and displacement both pointed upward",
        "Opposite directions — force and displacement pointed opposite ways",
        "Perpendicular — force was at a 90° angle to the displacement"
      ],
      correctIndex: 0,
      explanation: "You pushed the brick upward and it moved upward. The force and displacement were in the same direction. When force and displacement are in the same direction, the system's energy increases.",
      difficulty: "analyze"
    },

    {
      id: "div6",
      type: "divider"
    },

    // --- Experiment 5: Decrease GPE ---

    {
      id: "b21",
      type: "text",
      content: "### Experiment 5: Decrease the Brick's Gravitational Potential Energy"
    },
    {
      id: "b22",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Important:** To *decrease* gravitational potential energy, the system needs to **have some to start with**. That means the brick needs to start **elevated above the bucket**.\n\nYou can decrease its potential energy by **slowly lowering** it — you don't have to drop it."
    },
    {
      id: "b23",
      type: "activity",
      title: "Decrease the Brick's Gravitational Potential Energy",
      icon: "🔬",
      instructions: "Start with the brick **held above the bucket** (it has gravitational potential energy — it has the stored ability to crush the chalk in the bucket if dropped).\n\nYour job: **Decrease the system's gravitational potential energy by slowly lowering the brick.** The brick should end up with LESS potential ability to crush the chalk than it had at the start.\n\nBe ready to describe exactly when your experiment starts and ends."
    },
    {
      id: "q28",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the START of your experiment. Where is the brick?",
      difficulty: "apply"
    },
    {
      id: "q29",
      type: "question",
      questionType: "short_answer",
      prompt: "Describe the END of your experiment. Where is the brick?",
      difficulty: "apply"
    },
    {
      id: "q30",
      type: "question",
      questionType: "short_answer",
      prompt: "What did you do to decrease the brick's gravitational potential energy?",
      difficulty: "apply"
    },
    {
      id: "q31",
      type: "question",
      questionType: "short_answer",
      prompt: "How do you know the gravitational potential energy DECREASED? What evidence do you have?",
      difficulty: "analyze"
    },
    {
      id: "q32",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction was the force you applied to the brick while lowering it? (Think carefully: which direction is your hand pushing on the brick?)",
      options: [
        "Upward (your hand is supporting the brick from below, pushing up even as it moves down)",
        "Downward (your hand is pushing the brick down)",
        "Horizontally (sideways)"
      ],
      correctIndex: 0,
      explanation: "Even though the brick moves down, your hand is pushing UPWARD on it — you're supporting it, slowing its descent. The force from your hand is upward.",
      difficulty: "analyze"
    },
    {
      id: "q33",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction did the brick move? (Direction of DISPLACEMENT.)",
      options: [
        "Downward",
        "Upward",
        "Horizontally (sideways)"
      ],
      correctIndex: 0,
      explanation: "You lowered the brick — it moved downward. That's its displacement.",
      difficulty: "apply"
    },
    {
      id: "q34",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Experiment 5, what was the relationship between the direction of the force you applied (upward, supporting the brick as you lowered it) and the direction the brick moved (its displacement)?",
      options: [
        "Opposite directions — force pointed up but the brick moved down",
        "Same direction — force and displacement both pointed downward",
        "Perpendicular — force was at a 90° angle to the displacement"
      ],
      correctIndex: 0,
      explanation: "Your hand pushed upward (supporting the brick) while the brick moved downward. The force and displacement were in opposite directions. When force and displacement are in opposite directions, the system's energy decreases.",
      difficulty: "analyze"
    },

    {
      id: "div7",
      type: "divider"
    },

    // --- Experiment 6: No Change to GPE ---

    {
      id: "b24",
      type: "text",
      content: "### Experiment 6: A Force That Doesn't Change the Brick's Gravitational Potential Energy"
    },
    {
      id: "b25",
      type: "text",
      content: "The brick is being held at a steady height above the bucket. It has gravitational potential energy.\n\nBut just like with the cart, **not every force changes this type of energy**."
    },
    {
      id: "b26",
      type: "activity",
      title: "Find a Force That Doesn't Change GPE",
      icon: "🔬",
      instructions: "Hold the brick at a fixed height above the bucket. Now **slide it horizontally** — move it sideways while keeping it at the **same height**.\n\nThink about the force of gravity pulling the brick downward while the brick moves sideways.\n\nYour job: **Identify whether the gravitational force changes the system's gravitational potential energy during this horizontal motion.**"
    },
    {
      id: "q35",
      type: "question",
      questionType: "multiple_choice",
      prompt: "While you moved the brick sideways, what direction was the gravitational force (the pull of the Earth on the brick) pointing?",
      options: [
        "Downward (toward the ground)",
        "Horizontally (same direction the brick moved)",
        "Upward"
      ],
      correctIndex: 0,
      explanation: "Gravity always pulls downward, toward the center of the Earth — no matter which way the brick is moving.",
      difficulty: "apply"
    },
    {
      id: "q36",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What direction was the brick's displacement when you slid it sideways?",
      options: [
        "Horizontally (sideways, at the same height)",
        "Downward",
        "Upward"
      ],
      correctIndex: 0,
      explanation: "You slid the brick sideways — its displacement was horizontal, not up or down.",
      difficulty: "apply"
    },
    {
      id: "q37",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In Experiment 6, what was the relationship between the direction of the gravitational force (pulling the brick downward) and the direction the brick moved sideways (its displacement)?",
      options: [
        "Perpendicular — the gravitational force pointed down while the brick moved sideways (90° angle)",
        "Same direction — gravity and displacement pointed the same way",
        "Opposite directions — gravity and displacement pointed opposite ways"
      ],
      correctIndex: 0,
      explanation: "Gravity pulled the brick downward while the brick moved horizontally. The force and displacement were perpendicular (at 90°). When force and displacement are perpendicular, the system's energy does not change.",
      difficulty: "analyze"
    },

    {
      id: "div8",
      type: "divider"
    },

    // ═══════════════════════════════════════════════
    // WRAP UP: The Pattern
    // ═══════════════════════════════════════════════

    {
      id: "section-wrapup",
      type: "section_header",
      title: "Wrap Up: Find the Pattern",
      subtitle: "~10 minutes",
      icon: "🔍"
    },
    {
      id: "b27",
      type: "text",
      content: "You just ran **six experiments** across two different systems and two different types of energy. In every single experiment, you identified:\n\n- The **direction of the force**\n- The **direction of the displacement**\n- Whether the system's energy **increased, decreased, or stayed the same**\n\nNow let's see if there's a pattern hiding in your data."
    },
    {
      id: "q38",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at Experiments 1 and 4 — the ones where energy INCREASED. What do you notice about the relationship between the direction of the force and the direction of the displacement? Were they pointing the same way, opposite ways, or something else?",
      difficulty: "analyze"
    },
    {
      id: "q39",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at Experiments 2 and 5 — the ones where energy DECREASED. What do you notice about the relationship between the direction of the force and the direction of the displacement?",
      difficulty: "analyze"
    },
    {
      id: "q40",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at Experiments 3 and 6 — the ones where energy DID NOT CHANGE. What do you notice about the relationship between the direction of the force and the direction of the displacement?",
      difficulty: "analyze"
    },
    {
      id: "b28",
      type: "callout",
      style: "insight",
      icon: "⚡",
      content: "**The Pattern You Discovered:**\n\n🟢 When force and displacement point in the **same direction** (parallel) → the system's energy **INCREASES**\n\n🔴 When force and displacement point in **opposite directions** (antiparallel) → the system's energy **DECREASES**\n\n⚪ When force and displacement are **perpendicular** (at right angles) → the system's energy **DOES NOT CHANGE**"
    },
    {
      id: "b29",
      type: "text",
      content: "This process — a force acting on a system while the system moves through a displacement — has a name in physics. When a force and a displacement happen together, we call it **work**.\n\nWork is what changes a system's energy. The direction of the force relative to the displacement tells you *how* the energy changes."
    },
    {
      id: "b30",
      type: "definition",
      term: "Work",
      definition: "The process by which a force applied to a system over a displacement changes the system's energy. The relationship between the force direction and displacement direction determines whether energy increases, decreases, or stays the same."
    },
    {
      id: "q41",
      type: "question",
      questionType: "short_answer",
      prompt: "In your own words: If you see a force and a displacement pointing in the same direction, what can you immediately predict about the system's energy? What if they point in opposite directions?",
      difficulty: "evaluate"
    },
    {
      id: "q42",
      type: "question",
      questionType: "short_answer",
      prompt: "A student pushes a box to the right across the floor. Friction acts on the box to the left. Is friction increasing, decreasing, or not changing the box's kinetic energy? How do you know? (Use the pattern you discovered.)",
      difficulty: "apply"
    },
    {
      id: "q43",
      type: "question",
      questionType: "short_answer",
      prompt: "You carry a heavy backpack across a flat hallway. Is the upward force of your shoulders on the backpack increasing, decreasing, or not changing the backpack's gravitational potential energy? How do you know?",
      difficulty: "apply"
    },
    {
      id: "b31",
      type: "vocab_list",
      terms: [
        { term: "Work", definition: "The process of a force acting on a system through a displacement, which changes the system's energy." },
        { term: "Parallel", definition: "Force and displacement point in the same direction. Results in an INCREASE in the system's energy." },
        { term: "Antiparallel", definition: "Force and displacement point in opposite directions. Results in a DECREASE in the system's energy." },
        { term: "Perpendicular", definition: "Force and displacement are at right angles to each other. Results in NO CHANGE to the system's energy." },
        { term: "Kinetic Energy", definition: "The energy a system has due to its motion — its ability to do a job because it is moving." },
        { term: "Gravitational Potential Energy", definition: "The stored energy a system has due to its height — its potential ability to do a job if it falls." }
      ]
    }

  ]
};

async function seed() {
  try {
    await db.collection('courses').doc('physics')
      .collection('lessons').doc('work-energy-discovery')
      .set(lesson);
    console.log('✅ Lesson "How Do We Change a System\'s Energy?" seeded successfully!');
    console.log('   Path: courses/physics/lessons/work-energy-discovery');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Order: 7');
    console.log('   Visible: false (publish via Lesson Editor when ready)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
