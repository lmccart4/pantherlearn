// src/lib/enrollment.jsx
// Enroll code system for course access control.
// Each course has sections, each section has its own enroll code.
// Students join by entering a section's code.

import { db } from "./firebase";
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, where, serverTimestamp, writeBatch
} from "firebase/firestore";

// ═══════════════════════════════════════
// ENROLL CODE GENERATION
// ═══════════════════════════════════════

/**
 * Cleans enrolledCourses into a proper map { courseId: true }.
 * Handles: arrays, maps with numeric index junk, mixed formats.
 */
function cleanEnrolledCourses(ec) {
  if (!ec) return {};
  const clean = {};
  if (Array.isArray(ec)) {
    // Array format: ["ai-literacy", "physics"]
    ec.forEach((id) => { if (typeof id === "string" && id) clean[id] = true; });
  } else if (typeof ec === "object") {
    // Map format — but might have junk like { 0: "digital-literacy", "digital-literacy": true }
    for (const [key, value] of Object.entries(ec)) {
      if (value === true && isNaN(key)) {
        // Proper entry: { "digital-literacy": true }
        clean[key] = true;
      } else if (typeof value === "string" && value) {
        // Legacy numeric index: { 0: "digital-literacy" }
        clean[value] = true;
      }
    }
  }
  return clean;
}

function generateCodePrefix(title) {
  const cleaned = title.toUpperCase().replace(/[^A-Z]/g, "");
  const consonants = cleaned.replace(/[AEIOU]/g, "");
  const prefix = (consonants.length >= 4 ? consonants : cleaned).slice(0, 4);
  return prefix.padEnd(4, "X");
}

function generateCodeSuffix() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return suffix;
}

export async function generateEnrollCode(courseTitle) {
  let code;
  let attempts = 0;
  const prefix = generateCodePrefix(courseTitle);
  while (attempts < 20) {
    code = `${prefix}-${generateCodeSuffix()}`;
    const existing = await findCourseByEnrollCode(code);
    if (!existing) return code;
    attempts++;
  }
  return `${prefix}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

// ═══════════════════════════════════════
// COURSE + SECTION LOOKUP BY ENROLL CODE
// ═══════════════════════════════════════

// Find a course and section by enroll code
// Searches the sections map on each course document
export async function findCourseByEnrollCode(code) {
  const normalizedCode = code.toUpperCase().trim();
  const coursesSnap = await getDocs(collection(db, "courses"));

  for (const courseDoc of coursesSnap.docs) {
    const data = courseDoc.data();

    // Check per-section codes (new format)
    if (data.sections) {
      for (const [sectionId, section] of Object.entries(data.sections)) {
        if (section.enrollCode === normalizedCode) {
          return {
            id: courseDoc.id,
            ...data,
            matchedSectionId: sectionId,
            matchedSectionName: section.name,
          };
        }
      }
    }

    // Fallback: check legacy single enrollCode on course
    if (data.enrollCode === normalizedCode) {
      return { id: courseDoc.id, ...data, matchedSectionId: null, matchedSectionName: null };
    }
  }
  return null;
}

// ═══════════════════════════════════════
// STUDENT ENROLLMENT
// ═══════════════════════════════════════

export async function enrollWithCode(studentUid, studentEmail, enrollCode) {
  const course = await findCourseByEnrollCode(enrollCode);
  if (!course) {
    throw new Error("Invalid enroll code. Please check with your teacher.");
  }

  // Check if already enrolled (by doc ID or by email)
  const existingEnrollment = await getEnrollment(studentUid, course.id, studentEmail);

  if (existingEnrollment) {
    // Already enrolled — repair enrolledCourses and link UID if needed
    try {
      // Link UID to enrollment doc if it was created via CSV
      if (!existingEnrollment.uid || existingEnrollment.uid !== studentUid) {
        await setDoc(doc(db, "enrollments", existingEnrollment.id), {
          uid: studentUid, studentUid,
        }, { merge: true });
      }
      const userRef = doc(db, "users", studentUid);
      const userDoc = await getDoc(userRef);
      const ecMap = cleanEnrolledCourses(userDoc.exists() ? userDoc.data().enrolledCourses : {});
      if (!ecMap[course.id]) {
        ecMap[course.id] = true;
        await setDoc(userRef, { enrolledCourses: ecMap }, { merge: true });
      }
    } catch (e) {
      console.warn("Could not repair enrolledCourses:", e);
    }
    return { ...course, section: existingEnrollment.section || course.matchedSectionName };
  }

  const emailClean = studentEmail.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const enrollKey = `${course.id}_${emailClean}`;

  await setDoc(doc(db, "enrollments", enrollKey), {
    courseId: course.id,
    studentUid,
    uid: studentUid,
    teacherUid: course.ownerUid,
    email: studentEmail.toLowerCase(),
    enrollCode: enrollCode.toUpperCase().trim(),
    section: course.matchedSectionName || null,
    sectionId: course.matchedSectionId || null,
    enrolledAt: serverTimestamp(),
  }, { merge: true });

  // Add to user's enrolledCourses map for Firestore rules
  // Stored as a map { courseId: true } so the `in` operator works in security rules
  const userRef = doc(db, "users", studentUid);
  const userDoc = await getDoc(userRef);
  const currentCourses = userDoc.exists() ? (userDoc.data().enrolledCourses || {}) : {};
  if (!currentCourses[course.id]) {
    await setDoc(userRef, {
      enrolledCourses: { ...currentCourses, [course.id]: true },
    }, { merge: true });
  }

  return { ...course, section: course.matchedSectionName };
}

// ═══════════════════════════════════════
// ENROLLMENT QUERIES
// ═══════════════════════════════════════

export async function getEnrollment(studentUid, courseId, studentEmail) {
  // Try email-based key first (new standard format)
  if (studentEmail) {
    const emailClean = studentEmail.toLowerCase().replace(/[^a-z0-9]/g, "_");
    const emailKey = `${courseId}_${emailClean}`;
    const emailSnap = await getDoc(doc(db, "enrollments", emailKey));
    if (emailSnap.exists()) return { id: emailSnap.id, ...emailSnap.data() };
  }
  // Fall back to UID-based key (legacy format)
  const uidKey = `${courseId}_${studentUid}`;
  const uidSnap = await getDoc(doc(db, "enrollments", uidKey));
  return uidSnap.exists() ? { id: uidSnap.id, ...uidSnap.data() } : null;
}

export async function getStudentEnrolledCourseIds(studentUid) {
  const userRef = doc(db, "users", studentUid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const ec = userDoc.data().enrolledCourses;
    // Handle map format: { "ai-literacy": true, "physics": true }
    if (ec && typeof ec === "object" && !Array.isArray(ec)) {
      const ids = Object.keys(ec);
      if (ids.length > 0) return new Set(ids);
    }
    // Handle legacy array format: ["ai-literacy", "physics"]
    if (Array.isArray(ec) && ec.length > 0) {
      return new Set(ec);
    }
  }

  // Fallback: check enrollments collection using both field names
  const email = userDoc.exists() ? userDoc.data().email?.toLowerCase() : null;
  const ids = new Set();

  // Check by uid field (CSV/manual roster)
  try {
    const byUid = await getDocs(query(collection(db, "enrollments"), where("uid", "==", studentUid)));
    byUid.forEach((d) => { if (d.data().courseId) ids.add(d.data().courseId); });
  } catch (e) { /* ignore */ }

  // Check by studentUid field (enroll code)
  try {
    const byStudentUid = await getDocs(query(collection(db, "enrollments"), where("studentUid", "==", studentUid)));
    byStudentUid.forEach((d) => { if (d.data().courseId) ids.add(d.data().courseId); });
  } catch (e) { /* ignore */ }

  // Check by email if available
  if (email && ids.size === 0) {
    try {
      const byEmail = await getDocs(query(collection(db, "enrollments"), where("email", "==", email)));
      byEmail.forEach((d) => { if (d.data().courseId) ids.add(d.data().courseId); });
    } catch (e) { /* ignore */ }
  }

  // Auto-fix: write enrolledCourses to user doc so this lookup is instant next time
  if (ids.size > 0) {
    try {
      const ecMap = {};
      ids.forEach((id) => { ecMap[id] = true; });
      await setDoc(userRef, { enrolledCourses: ecMap }, { merge: true });
    } catch (e) {
      console.warn("Could not auto-fix enrolledCourses:", e);
    }
  }

  return ids;
}

export async function getCourseEnrollments(courseId) {
  const q = query(collection(db, "enrollments"), where("courseId", "==", courseId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTeacherEnrollments(teacherUid) {
  const q = query(collection(db, "enrollments"), where("teacherUid", "==", teacherUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ═══════════════════════════════════════
// SECTION MANAGEMENT
// ═══════════════════════════════════════

// Add a new section to a course with a unique enroll code
export async function addSection(courseId, sectionName) {
  const courseRef = doc(db, "courses", courseId);
  const courseDoc = await getDoc(courseRef);
  if (!courseDoc.exists()) throw new Error(`Course ${courseId} not found`);

  const data = courseDoc.data();
  const sections = data.sections || {};
  const sectionId = sectionName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  if (sections[sectionId]) throw new Error(`Section "${sectionName}" already exists`);

  const enrollCode = await generateEnrollCode(data.title || courseId);
  sections[sectionId] = { name: sectionName, enrollCode };

  await updateDoc(courseRef, { sections });
  return { sectionId, name: sectionName, enrollCode };
}

// Remove a section from a course
export async function removeSection(courseId, sectionId) {
  const courseRef = doc(db, "courses", courseId);
  const courseDoc = await getDoc(courseRef);
  if (!courseDoc.exists()) throw new Error(`Course ${courseId} not found`);

  const sections = { ...courseDoc.data().sections };
  delete sections[sectionId];
  await updateDoc(courseRef, { sections });
}

// Regenerate enroll code for a specific section
export async function regenerateSectionCode(courseId, sectionId) {
  const courseRef = doc(db, "courses", courseId);
  const courseDoc = await getDoc(courseRef);
  if (!courseDoc.exists()) throw new Error(`Course ${courseId} not found`);

  const sections = { ...courseDoc.data().sections };
  if (!sections[sectionId]) throw new Error(`Section ${sectionId} not found`);

  const newCode = await generateEnrollCode(courseDoc.data().title || courseId);
  sections[sectionId].enrollCode = newCode;
  await updateDoc(courseRef, { sections });
  return newCode;
}

// Get all sections for a course
export function getCourseSections(courseData) {
  if (!courseData?.sections) return [];
  return Object.entries(courseData.sections).map(([id, s]) => ({
    id,
    name: s.name,
    enrollCode: s.enrollCode,
  }));
}

// ═══════════════════════════════════════
// COURSE OWNERSHIP
// ═══════════════════════════════════════

export async function getTeacherCourses(teacherUid) {
  const q = query(collection(db, "courses"), where("ownerUid", "==", teacherUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function regenerateEnrollCode(courseId, courseTitle) {
  const newCode = await generateEnrollCode(courseTitle);
  await updateDoc(doc(db, "courses", courseId), { enrollCode: newCode });
  return newCode;
}
