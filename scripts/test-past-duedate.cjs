// Test: Can we PATCH a past due date onto an existing Classroom assignment?
const fs = require("fs");
const path = require("path");

const TOKEN_PATH = path.join(__dirname, "..", ".classroom-token.json");
const ENV_PATH = path.join(__dirname, "..", ".env.classroom");
const GC_API = "https://classroom.googleapis.com/v1";

// Load env
const envContent = fs.readFileSync(ENV_PATH, "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const [k, v] = line.split("=");
  if (k && v) env[k.trim()] = v.trim();
});

const tokenData = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.CLASSROOM_CLIENT_ID,
      client_secret: env.CLASSROOM_CLIENT_SECRET,
      refresh_token: tokenData.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  // Use Period 5 AI Literacy class for testing
  const classroomCourseId = "839169932383";

  // Step 1: Create a test assignment WITHOUT due date
  console.log("Step 1: Creating test assignment without due date...");
  const createRes = await fetch(`${GC_API}/courses/${classroomCourseId}/courseWork`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "TEST - Delete Me (due date experiment)",
      maxPoints: 100,
      workType: "ASSIGNMENT",
      state: "PUBLISHED",
    }),
  });

  if (!createRes.ok) {
    console.error("Create failed:", await createRes.json());
    return;
  }

  const assignment = await createRes.json();
  console.log("Created:", assignment.id);

  // Step 2: PATCH a past due date onto it
  console.log("\nStep 2: PATCHing past due date (2026-02-22) onto it...");
  const patchRes = await fetch(
    `${GC_API}/courses/${classroomCourseId}/courseWork/${assignment.id}?updateMask=dueDate,dueTime`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      dueDate: { year: 2026, month: 2, day: 22 },
      dueTime: { hours: 23, minutes: 59 },
    }),
  });

  if (!patchRes.ok) {
    const err = await patchRes.json();
    console.error("PATCH failed:", err.error?.message || JSON.stringify(err));

    // Step 3: Try today's date
    console.log("\nStep 3: Trying today's date instead...");
    const today = new Date();
    const patchRes2 = await fetch(
      `${GC_API}/courses/${classroomCourseId}/courseWork/${assignment.id}?updateMask=dueDate,dueTime`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dueDate: { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() },
        dueTime: { hours: 23, minutes: 59 },
      }),
    });

    if (!patchRes2.ok) {
      console.error("Today PATCH also failed:", (await patchRes2.json()).error?.message);
    } else {
      console.log("Today's date PATCH succeeded!");
    }

    // Step 4: Try tomorrow then change to past
    console.log("\nStep 4: Setting tomorrow first, then changing to past...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const patchRes3 = await fetch(
      `${GC_API}/courses/${classroomCourseId}/courseWork/${assignment.id}?updateMask=dueDate,dueTime`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        dueDate: { year: tomorrow.getFullYear(), month: tomorrow.getMonth() + 1, day: tomorrow.getDate() },
        dueTime: { hours: 23, minutes: 59 },
      }),
    });

    if (patchRes3.ok) {
      console.log("Tomorrow PATCH succeeded, now trying past date again...");
      const patchRes4 = await fetch(
        `${GC_API}/courses/${classroomCourseId}/courseWork/${assignment.id}?updateMask=dueDate,dueTime`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          dueDate: { year: 2026, month: 2, day: 22 },
          dueTime: { hours: 23, minutes: 59 },
        }),
      });

      if (patchRes4.ok) {
        console.log("SUCCESS! Past due date set via tomorrow->past workaround!");
      } else {
        console.error("Past date PATCH still failed after setting tomorrow:", (await patchRes4.json()).error?.message);
      }
    }
  } else {
    console.log("SUCCESS! Direct PATCH of past due date worked!");
  }

  // Cleanup: delete the test assignment
  console.log("\nCleaning up test assignment...");
  await fetch(`${GC_API}/courses/${classroomCourseId}/courseWork/${assignment.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Deleted.");
}

main().catch(console.error);
