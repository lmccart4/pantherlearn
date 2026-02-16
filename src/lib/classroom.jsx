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
