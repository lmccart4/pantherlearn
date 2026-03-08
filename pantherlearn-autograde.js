// pantherlearn-autograde.js
// Autonomous grading agent for PantherLearn
// Queries Firestore for ungraded student responses, evaluates them via Claude, writes grades back.
//
// Usage:
//   node pantherlearn-autograde.js                     # Grade all courses
//   node pantherlearn-autograde.js --course <courseId>  # Grade specific course
//   node pantherlearn-autograde.js --dry-run            # Preview without writing grades
//
// Prerequisites:
//   npm install firebase anthropic
//
// Auth: Uses Firebase auth (email/password or token). Set env vars:
//   FIREBASE_EMAIL + FIREBASE_PASSWORD   — for email/password auth
//   — OR —
//   FIREBASE_AUTH_TOKEN                   — for OAuth token from your agent
//
//   ANTHROPIC_API_KEY                     — your Claude API key (sk-ant-...)
//   — OR —
//   ANTHROPIC_AUTH_TOKEN                   — OAuth token (from Claude subscription)

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
} from "firebase/auth";
import Anthropic from "@anthropic-ai/sdk";

// ─── Configuration ───────────────────────────────────────────────────────────

// Firebase config — values from src/lib/firebase.jsx (.env)
const firebaseConfig = {
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4",
  measurementId: "G-5Y6BKF09HF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Support both API key (sk-ant-...) and OAuth token
const claude = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : new Anthropic({ authToken: process.env.ANTHROPIC_AUTH_TOKEN, apiKey: null });

// ─── CLI Args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const courseFlag = args.indexOf("--course");
const TARGET_COURSE = courseFlag !== -1 ? args[courseFlag + 1] : null;

// ─── Grading System Prompt ───────────────────────────────────────────────────

const GRADING_SYSTEM_PROMPT = `You are an expert grading assistant for a high school classroom. You grade student responses using a strict 5-bucket system. You must assign EXACTLY one of these grades — no in-between values.

## Grade Buckets

| writtenScore | writtenLabel | Meaning |
|-------------|-------------|---------|
| 0 | "Missing" | No submission, completely off-task, nonsensical, or academic dishonesty |
| 0.55 | "Emerging" | Attempted but surface-level, no real understanding demonstrated |
| 0.65 | "Approaching" | Some understanding but incomplete, vague, or has significant gaps |
| 0.85 | "Developing" | Solid, demonstrates real comprehension of the material |
| 1.0 | "Refining" | Exceptional — shows deep internalization, original connections, goes beyond baseline understanding |

## Key Distinguishing Questions

- **0 vs 0.55**: Did the student even try? A 0 is no attempt or bad faith. A 0.55 means they at least read the question and responded (even poorly).
- **0.55 vs 0.65**: A 0.55 is going through the motions. A 0.65 shows genuine (if incomplete) thinking — you can see the gears turning.
- **0.65 vs 0.85**: A 0.65 has gaps you'd want to follow up on. An 0.85 doesn't leave you with doubts about comprehension.
- **0.85 vs 1.0**: An 0.85 says "I understand this." A 1.0 says "I understand this AND here's how I'm thinking about it at a deeper level." The student verbalizes comprehension that goes above and beyond.

## Important Notes

- Grade the THINKING, not the writing quality. These are 9th graders. Grammar and spelling don't matter — understanding does.
- Consider the question's difficulty when calibrating. A solid answer to a recall question is different from a solid answer to a synthesis question.
- For chatbot conversations, grade the STUDENT's messages only — quality of prompts, engagement depth, evidence of learning, task completion.

## Response Format

Respond with ONLY valid JSON, no markdown fences, no preamble:
{
  "writtenScore": <number>,
  "writtenLabel": "<string>",
  "feedback": "<1-2 sentence constructive feedback for the student>",
  "reasoning": "<brief internal note explaining the grading decision>"
}`;

// ─── Authentication ──────────────────────────────────────────────────────────

async function authenticate() {
  if (process.env.FIREBASE_AUTH_TOKEN) {
    console.log("🔑 Authenticating with custom token (OAuth)...");
    await signInWithCustomToken(auth, process.env.FIREBASE_AUTH_TOKEN);
  } else if (process.env.FIREBASE_EMAIL && process.env.FIREBASE_PASSWORD) {
    console.log("🔑 Authenticating with email/password...");
    await signInWithEmailAndPassword(
      auth,
      process.env.FIREBASE_EMAIL,
      process.env.FIREBASE_PASSWORD
    );
  } else {
    throw new Error(
      "No auth credentials found. Set FIREBASE_AUTH_TOKEN or FIREBASE_EMAIL + FIREBASE_PASSWORD"
    );
  }
  console.log(`✅ Authenticated as: ${auth.currentUser.email || auth.currentUser.uid}`);
}

// ─── Data Fetching ───────────────────────────────────────────────────────────

async function getCourses() {
  const snap = await getDocs(collection(db, "courses"));
  const courses = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((c) => !c.hidden);

  if (TARGET_COURSE) {
    const filtered = courses.filter((c) => c.id === TARGET_COURSE);
    if (filtered.length === 0) {
      throw new Error(`Course "${TARGET_COURSE}" not found. Available: ${courses.map((c) => c.id).join(", ")}`);
    }
    return filtered;
  }
  return courses;
}

async function getEnrolledStudents(courseId) {
  const snap = await getDocs(
    query(collection(db, "enrollments"), where("courseId", "==", courseId))
  );
  const uids = new Set();
  snap.forEach((d) => {
    const data = d.data();
    const uid = data.uid || data.email?.replace(/[.@]/g, "_");
    if (uid) uids.add(uid);
  });
  return [...uids];
}

async function getLessonsWithBlocks(courseId) {
  const snap = await getDocs(
    query(collection(db, "courses", courseId, "lessons"), orderBy("order", "asc"))
  );
  const lessons = {};
  snap.forEach((d) => {
    const data = d.data();
    lessons[d.id] = {
      title: data.title || d.id,
      blocks: data.blocks || [],
      order: data.order || 0,
    };
  });
  return lessons;
}

async function getUngradedResponses(courseId, studentUids, lessonMap) {
  const ungraded = [];

  const results = await Promise.allSettled(
    studentUids.map(async (uid) => {
      const lessonDocs = await getDocs(
        collection(db, "progress", uid, "courses", courseId, "lessons")
      );
      return { uid, lessonDocs };
    })
  );

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const { uid, lessonDocs } = result.value;

    lessonDocs.forEach((d) => {
      const data = d.data();
      if (!data.answers) return;

      Object.entries(data.answers).forEach(([blockId, answer]) => {
        // Match the exact filter from GradingDashboard
        if (answer.needsGrading && answer.submitted && answer.writtenScore == null) {
          // Look up the question prompt from lesson blocks
          const lesson = lessonMap[d.id];
          const block = lesson?.blocks?.find((b) => b.id === blockId);
          const prompt = block?.prompt || block?.title || blockId;
          const questionType = block?.questionType || "short_answer";

          ungraded.push({
            studentId: uid,
            lessonId: d.id,
            lessonTitle: lesson?.title || d.id,
            courseId,
            blockId,
            questionPrompt: prompt,
            questionType,
            answer: answer.answer,
            submittedAt: answer.submittedAt,
            path: d.ref.path,
          });
        }
      });
    });
  }

  return ungraded;
}

async function getUngradedChatLogs(courseId, studentUids, lessonMap) {
  const ungraded = [];

  for (const [lessonId, lesson] of Object.entries(lessonMap)) {
    const chatBlocks = lesson.blocks.filter((b) => b.type === "chatbot");

    for (const chatBlock of chatBlocks) {
      try {
        const studentDocs = await getDocs(
          collection(db, "courses", courseId, "chatLogs", lessonId, chatBlock.id)
        );

        studentDocs.forEach((studentDoc) => {
          if (!studentUids.includes(studentDoc.id)) return;
          const data = studentDoc.data();

          if (data.messages && data.messages.length > 0) {
            // Check if this chat has already been graded
            // We'll need to check the progress doc for a chatbot grade
            ungraded.push({
              studentId: studentDoc.id,
              lessonId,
              lessonTitle: lesson.title,
              courseId,
              blockId: chatBlock.id,
              blockTitle: chatBlock.title || chatBlock.id,
              systemPrompt: chatBlock.systemPrompt || "",
              messages: data.messages,
              messageCount: data.messages.filter((m) => m.role === "user").length,
              questionType: "chatbot",
            });
          }
        });
      } catch (e) {
        // chatLog collection may not exist for this lesson/block combo
        continue;
      }
    }
  }

  return ungraded;
}

// ─── Override Harvesting (Self-Calibration) ──────────────────────────────────

async function harvestOverrides(courseId, studentUids, lessonMap) {
  const overrides = [];

  const results = await Promise.allSettled(
    studentUids.map(async (uid) => {
      const lessonDocs = await getDocs(
        collection(db, "progress", uid, "courses", courseId, "lessons")
      );
      return { uid, lessonDocs };
    })
  );

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const { uid, lessonDocs } = result.value;

    lessonDocs.forEach((d) => {
      const data = d.data();
      if (!data.answers) return;

      Object.entries(data.answers).forEach(([blockId, answer]) => {
        // An override is: teacher manually graded AND autogradeOriginal exists
        // Skip overrides flagged as non-calibration (glitches, mercy grades, etc.)
        if (
          answer.gradedBy === "teacher" &&
          answer.autogradeOriginal &&
          answer.overrideReason !== "glitch" &&
          answer.overrideReason !== "mercy" &&
          answer.overrideReason !== "ignore"
        ) {
          const lesson = lessonMap[d.id];
          const block = lesson?.blocks?.find((b) => b.id === blockId);
          const prompt = block?.prompt || block?.title || blockId;

          overrides.push({
            questionPrompt: prompt,
            studentAnswer: answer.answer,
            agentScore: answer.autogradeOriginal.writtenScore,
            agentLabel: answer.autogradeOriginal.writtenLabel,
            teacherScore: answer.writtenScore,
            teacherLabel: answer.writtenLabel,
          });
        }
      });
    });
  }

  return overrides;
}

function buildCalibrationBlock(overrides) {
  if (overrides.length === 0) return "";

  // Cap at 15 most recent overrides to avoid bloating the prompt
  const recent = overrides.slice(-15);

  let block = `\n\n## CALIBRATION FROM PAST TEACHER CORRECTIONS\n\nThe teacher has corrected your grading in the past. Study these corrections carefully and adjust your judgment accordingly:\n`;

  for (const o of recent) {
    block += `\n- Question: "${o.questionPrompt}"
  Student answer: "${o.studentAnswer?.slice(0, 150) || "[no answer]"}${o.studentAnswer?.length > 150 ? "..." : ""}"
  You graded: ${o.agentLabel} (${o.agentScore})
  Teacher corrected to: ${o.teacherLabel} (${o.teacherScore})`;
  }

  block += `\n\nUse these corrections to calibrate your grading. If you see similar patterns, apply the teacher's judgment.`;
  return block;
}

// ─── Claude Grading ──────────────────────────────────────────────────────────

async function gradeWithClaude(item, calibrationBlock = "") {
  let userPrompt;

  if (item.questionType === "chatbot") {
    // Format the conversation for grading
    const conversationText = item.messages
      .map((m) => `${m.role === "user" ? "STUDENT" : "CHATBOT"}: ${m.content || m.text || ""}`)
      .join("\n");

    userPrompt = `Grade this student's chatbot conversation.

LESSON: "${item.lessonTitle}"
CHATBOT NAME: "${item.blockTitle}"
CHATBOT PURPOSE: "${item.systemPrompt}"

CONVERSATION:
${conversationText}

Remember: Grade the STUDENT's messages only — their engagement, strategy, and evidence of learning. Not the chatbot's responses.`;
  } else {
    userPrompt = `Grade this student response.

LESSON: "${item.lessonTitle}"
QUESTION: "${item.questionPrompt}"
STUDENT ANSWER: "${item.answer}"`;
  }

  const response = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: GRADING_SYSTEM_PROMPT + calibrationBlock,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((c) => c.type === "text")
    .map((c) => c.text)
    .join("");

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.error(`  ⚠️  Failed to parse Claude response: ${text}`);
    return null;
  }
}

// ─── Grade Writing ───────────────────────────────────────────────────────────

async function writeGrade(item, grade) {
  const progressRef = doc(
    db,
    "progress",
    item.studentId,
    "courses",
    item.courseId,
    "lessons",
    item.lessonId
  );

  // Preserve existing answer data, add grade fields + autogradeOriginal for override tracking
  await setDoc(
    progressRef,
    {
      answers: {
        [item.blockId]: {
          answer: item.answer, // preserve original answer
          submitted: true, // preserve submitted flag
          needsGrading: false,
          writtenScore: grade.writtenScore,
          writtenLabel: grade.writtenLabel,
          gradedAt: new Date(),
          feedback: grade.feedback || null,
          gradingReasoning: grade.reasoning || null,
          gradedBy: "autograde-agent",
          // Store the agent's original decision so teacher overrides can be detected
          autogradeOriginal: {
            writtenScore: grade.writtenScore,
            writtenLabel: grade.writtenLabel,
            feedback: grade.feedback || null,
            reasoning: grade.reasoning || null,
            gradedAt: new Date(),
          },
        },
      },
    },
    { merge: true }
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🐾 PantherLearn AutoGrader");
  console.log("─".repeat(50));

  if (DRY_RUN) {
    console.log("🔍 DRY RUN MODE — no grades will be written\n");
  }

  // Authenticate
  await authenticate();

  // Get courses
  const courses = await getCourses();
  console.log(`\n📚 Found ${courses.length} course(s) to grade\n`);

  let totalGraded = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const course of courses) {
    console.log(`\n${"═".repeat(50)}`);
    console.log(`📖 ${course.icon || ""} ${course.title || course.id}`);
    console.log(`${"═".repeat(50)}`);

    // Get enrolled students
    const studentUids = await getEnrolledStudents(course.id);
    console.log(`👥 ${studentUids.length} enrolled students`);

    // Get lessons with block definitions
    const lessonMap = await getLessonsWithBlocks(course.id);
    const lessonCount = Object.keys(lessonMap).length;
    console.log(`📝 ${lessonCount} lessons loaded`);

    // Harvest past teacher overrides for self-calibration
    const overrides = await harvestOverrides(course.id, studentUids, lessonMap);
    const calibrationBlock = buildCalibrationBlock(overrides);
    if (overrides.length > 0) {
      console.log(`🎯 ${overrides.length} past teacher corrections loaded for calibration`);
    } else {
      console.log(`🎯 No past corrections found (first run or no overrides yet)`);
    }

    // Find ungraded written responses
    const ungradedWritten = await getUngradedResponses(course.id, studentUids, lessonMap);
    console.log(`\n✏️  ${ungradedWritten.length} ungraded written responses`);

    // Grade written responses
    for (let i = 0; i < ungradedWritten.length; i++) {
      const item = ungradedWritten[i];
      const progress = `[${i + 1}/${ungradedWritten.length}]`;

      process.stdout.write(
        `  ${progress} ${item.studentId.slice(0, 8)}... → "${item.questionPrompt.slice(0, 50)}..." `
      );

      try {
        const grade = await gradeWithClaude(item, calibrationBlock);

        if (!grade) {
          console.log("⚠️  SKIP (parse error)");
          totalSkipped++;
          continue;
        }

        // Validate the grade is a valid bucket
        const validScores = [0, 0.55, 0.65, 0.85, 1.0];
        if (!validScores.includes(grade.writtenScore)) {
          console.log(`⚠️  SKIP (invalid score: ${grade.writtenScore})`);
          totalSkipped++;
          continue;
        }

        if (DRY_RUN) {
          console.log(`→ ${grade.writtenLabel} (${grade.writtenScore}) [DRY RUN]`);
          console.log(`     Feedback: ${grade.feedback}`);
          console.log(`     Reasoning: ${grade.reasoning}`);
        } else {
          await writeGrade(item, grade);
          console.log(`→ ${grade.writtenLabel} (${grade.writtenScore}) ✅`);
        }

        totalGraded++;

        // Small delay to avoid rate limiting Claude API
        await new Promise((r) => setTimeout(r, 200));
      } catch (err) {
        console.log(`❌ ERROR: ${err.message}`);
        totalFailed++;
      }
    }

    // TODO: Uncomment to also grade chatbot conversations
    // Chatbot grading is trickier — you may want to review these manually first.
    // To enable, uncomment the block below:
    //
    // const ungradedChats = await getUngradedChatLogs(course.id, studentUids, lessonMap);
    // console.log(`\n💬 ${ungradedChats.length} ungraded chat conversations`);
    //
    // for (let i = 0; i < ungradedChats.length; i++) {
    //   const item = ungradedChats[i];
    //   const progress = `[${i + 1}/${ungradedChats.length}]`;
    //   process.stdout.write(`  ${progress} ${item.studentId.slice(0,8)}... → "${item.blockTitle}" `);
    //
    //   try {
    //     const grade = await gradeWithClaude(item);
    //     if (!grade) { console.log("⚠️  SKIP"); totalSkipped++; continue; }
    //
    //     const validScores = [0, 0.55, 0.65, 0.85, 1.0];
    //     if (!validScores.includes(grade.writtenScore)) {
    //       console.log(`⚠️  SKIP (invalid score: ${grade.writtenScore})`);
    //       totalSkipped++;
    //       continue;
    //     }
    //
    //     if (DRY_RUN) {
    //       console.log(`→ ${grade.writtenLabel} (${grade.writtenScore}) [DRY RUN]`);
    //     } else {
    //       // For chats, we write the grade to the progress doc under the chatbot block ID
    //       await writeGrade({ ...item, answer: "[chatbot conversation]" }, grade);
    //       console.log(`→ ${grade.writtenLabel} (${grade.writtenScore}) ✅`);
    //     }
    //     totalGraded++;
    //     await new Promise((r) => setTimeout(r, 200));
    //   } catch (err) {
    //     console.log(`❌ ERROR: ${err.message}`);
    //     totalFailed++;
    //   }
    // }
  }

  // Summary
  console.log(`\n${"═".repeat(50)}`);
  console.log("📊 GRADING SUMMARY");
  console.log(`${"═".repeat(50)}`);
  console.log(`  ✅ Graded:  ${totalGraded}`);
  console.log(`  ⚠️  Skipped: ${totalSkipped}`);
  console.log(`  ❌ Failed:  ${totalFailed}`);
  console.log(`  📝 Total:   ${totalGraded + totalSkipped + totalFailed}`);
  if (DRY_RUN) {
    console.log(`\n  🔍 This was a DRY RUN — no grades were written to Firestore.`);
    console.log(`     Run without --dry-run to save grades.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("\n💥 Fatal error:", err);
  process.exit(1);
});
