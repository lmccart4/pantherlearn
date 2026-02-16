// src/lib/displayName.js
// Resolves how a student's name should appear based on who's viewing.
//
// Student/classmate view:  "Jim Doe" (nickname replaces first name)
// Teacher view:            "Jim (James) Doe" (nickname with real name in parens)
// No nickname set:         "James Doe" (normal displayName)

/**
 * @param {object} opts
 * @param {string} opts.displayName - Full real name from Google auth (e.g. "James Doe")
 * @param {string} opts.nickname - User-set nickname (e.g. "Jim"), or null/undefined
 * @param {boolean} opts.isTeacherViewing - Whether the current viewer is a teacher
 * @returns {string} The formatted display name
 */
export function resolveDisplayName({ displayName, nickname, isTeacherViewing = false }) {
  if (!displayName) return nickname || "Student";
  if (!nickname || !nickname.trim()) return displayName;

  const nick = nickname.trim();
  const parts = displayName.trim().split(" ");
  const firstName = parts[0] || "";
  const restOfName = parts.slice(1).join(" ");

  // If nickname is same as first name, just return normal name
  if (nick.toLowerCase() === firstName.toLowerCase()) return displayName;

  if (isTeacherViewing) {
    // Teacher sees: James "Jim" Doe
    return restOfName
      ? `${firstName} "${nick}" ${restOfName}`
      : `${firstName} "${nick}"`;
  } else {
    // Students/classmates see: "Jim Doe"
    return restOfName ? `${nick} ${restOfName}` : nick;
  }
}

/**
 * Short version — just first name or nickname
 * Used in compact displays like team panels, leaderboard
 */
export function resolveFirstName({ displayName, nickname, isTeacherViewing = false }) {
  if (!displayName && !nickname) return "Student";
  if (!nickname || !nickname.trim()) return displayName?.split(" ")[0] || "Student";

  const nick = nickname.trim();
  const firstName = displayName?.split(" ")[0] || "";

  if (nick.toLowerCase() === firstName.toLowerCase()) return firstName;

  if (isTeacherViewing) {
    return `${firstName} "${nick}"`;
  }
  return nick;
}
