// src/lib/classroom.jsx
// Google Classroom API helpers — calls the API directly using the teacher's OAuth access token

const CLASSROOM_API = "https://classroom.googleapis.com/v1";

// Fetch all active courses for the signed-in teacher
export async function fetchClassroomCourses(accessToken) {
  const courses = [];
  let pageToken = null;

  do {
    const params = new URLSearchParams({
      courseStates: "ACTIVE",
      pageSize: "30",
    });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${CLASSROOM_API}/courses?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to fetch Classroom courses");
    }

    const data = await res.json();
    if (data.courses) courses.push(...data.courses);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return courses;
}

// Fetch all students in a specific Classroom course
export async function fetchClassroomStudents(accessToken, courseId) {
  const students = [];
  let pageToken = null;

  do {
    const params = new URLSearchParams({ pageSize: "30" });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(`${CLASSROOM_API}/courses/${courseId}/students?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to fetch students");
    }

    const data = await res.json();
    if (data.students) students.push(...data.students);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return students.map((s) => ({
    userId: s.userId,
    email: s.profile?.emailAddress || "",
    name: s.profile?.name?.fullName || "",
    photoUrl: s.profile?.photoUrl || "",
  }));
}

// ─── Grade Sync Helpers ───────────────────────────────────────────────────────

// Create a coursework assignment in a Classroom course
export async function createCourseWork(accessToken, classroomCourseId, title, maxPoints = 100, dueDate = null) {
  const body = {
    title,
    maxPoints,
    workType: "ASSIGNMENT",
    state: "PUBLISHED",
  };

  // Add due date if provided (expects "YYYY-MM-DD" string)
  // If Google rejects it (past/same-day), the dashboard fallback retries without it
  if (dueDate) {
    const [year, month, day] = dueDate.split("-").map(Number);
    if (year && month && day) {
      body.dueDate = { year, month, day };
      body.dueTime = { hours: 23, minutes: 59 };
    }
  }

  const res = await fetch(`${CLASSROOM_API}/courses/${classroomCourseId}/courseWork`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to create coursework");
  }

  return res.json();
}

// List all student submissions for a coursework item
export async function listStudentSubmissions(accessToken, classroomCourseId, courseWorkId) {
  const submissions = [];
  let pageToken = null;

  do {
    const params = new URLSearchParams({ pageSize: "30" });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `${CLASSROOM_API}/courses/${classroomCourseId}/courseWork/${courseWorkId}/studentSubmissions?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to fetch submissions");
    }

    const data = await res.json();
    if (data.studentSubmissions) submissions.push(...data.studentSubmissions);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return submissions;
}

// Patch a student submission with a grade (0-100)
export async function patchStudentGrade(accessToken, classroomCourseId, courseWorkId, submissionId, grade) {
  const res = await fetch(
    `${CLASSROOM_API}/courses/${classroomCourseId}/courseWork/${courseWorkId}/studentSubmissions/${submissionId}?updateMask=assignedGrade,draftGrade`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assignedGrade: grade,
        draftGrade: grade,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Failed to patch grade");
  }

  return res.json();
}

// List all courseWork items for a Classroom course
export async function listCourseWork(accessToken, classroomCourseId) {
  const items = [];
  let pageToken = null;

  do {
    const params = new URLSearchParams({ pageSize: "30" });
    if (pageToken) params.set("pageToken", pageToken);

    const res = await fetch(
      `${CLASSROOM_API}/courses/${classroomCourseId}/courseWork?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Failed to list courseWork");
    }

    const data = await res.json();
    if (data.courseWork) items.push(...data.courseWork);
    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}

// ─── Roster Helpers ───────────────────────────────────────────────────────────

// Fetch courses + all their rosters in one go
export async function fetchFullRosters(accessToken) {
  const courses = await fetchClassroomCourses(accessToken);
  const result = [];

  for (const course of courses) {
    const students = await fetchClassroomStudents(accessToken, course.id);
    result.push({
      classroomId: course.id,
      name: course.name,
      section: course.section || "",
      description: course.descriptionHeading || course.description || "",
      studentCount: students.length,
      students,
    });
  }

  return result;
}
