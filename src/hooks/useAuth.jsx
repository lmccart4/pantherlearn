// src/hooks/useAuth.jsx
import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { auth, db, logOut } from "../lib/firebase";

const AuthContext = createContext(null);

/**
 * Determines role from email pattern:
 * - Must be @paps.net
 * - 3+ digits before @ = student (e.g. jsmith123@paps.net)
 * - Fewer than 3 digits before @ = teacher (e.g. lmccarthy@paps.net)
 */
function getRoleFromEmail(email) {
  if (!email) return null;
  const lower = email.toLowerCase();

  // Must be @paps.net
  if (!lower.endsWith("@paps.net")) return null;

  // Count digits in the local part (before @)
  const localPart = lower.split("@")[0];
  const digitCount = (localPart.match(/\d/g) || []).length;

  return digitCount >= 3 ? "student" : "teacher";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [nickname, setNickname] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email;
        const role = getRoleFromEmail(email);

        // Block non-paps.net emails
        if (!role) {
          setAuthError("Access restricted to @paps.net accounts only.");
          await logOut();
          setUser(null);
          setUserRole(null);
          setNickname(null);
          setLoading(false);
          return;
        }

        setAuthError(null);
        setUser(firebaseUser);
        setUserRole(role);

        // Create/update user doc in Firestore
        const userRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          // Load nickname
          setNickname(data.nickname || null);
          // Update role if it changed
          if (data.role !== role) {
            await setDoc(userRef, { role }, { merge: true });
          }
        } else {
          await setDoc(userRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role,
            nickname: null,
            createdAt: new Date(),
          });
          setNickname(null);
        }

        // ─── Auto-link enrollments ───
        // Find any enrollment docs matching this email (from CSV/manual roster upload)
        // and link them to this user's UID + update enrolledCourses on user doc
        if (role === "student") {
          try {
            const enrollSnap = await getDocs(
              query(collection(db, "enrollments"), where("email", "==", email.toLowerCase()))
            );
            if (!enrollSnap.empty) {
              const freshUserDoc = await getDoc(userRef);
              const ec = freshUserDoc.exists() ? (freshUserDoc.data().enrolledCourses || {}) : {};
              // Clean up any junk in enrolledCourses
              const ecMap = {};
              if (Array.isArray(ec)) {
                ec.forEach((id) => { if (typeof id === "string" && id) ecMap[id] = true; });
              } else if (typeof ec === "object") {
                for (const [key, value] of Object.entries(ec)) {
                  if (value === true && isNaN(key)) ecMap[key] = true;
                  else if (typeof value === "string" && value) ecMap[value] = true;
                }
              }
              let needsUpdate = false;

              for (const enrollDoc of enrollSnap.docs) {
                const data = enrollDoc.data();
                // Link UID to enrollment doc if not already set
                if (!data.uid || data.uid !== firebaseUser.uid) {
                  await updateDoc(enrollDoc.ref, {
                    uid: firebaseUser.uid,
                    studentUid: firebaseUser.uid,
                    displayName: firebaseUser.displayName || data.name || null,
                  });
                }
                // Add course to enrolledCourses map
                if (data.courseId && !ecMap[data.courseId]) {
                  ecMap[data.courseId] = true;
                  needsUpdate = true;
                }
              }

              if (needsUpdate) {
                await setDoc(userRef, { enrolledCourses: ecMap }, { merge: true });
              }
            }
          } catch (err) {
            console.warn("Auto-link enrollments failed:", err);
          }
        }
      } else {
        setUser(null);
        setUserRole(null);
        setNickname(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const getToken = async () => {
    if (!user) return null;
    return user.getIdToken();
  };

  // Allow components to update nickname locally after saving
  const updateNickname = (newNickname) => {
    setNickname(newNickname || null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, nickname, updateNickname, loading, getToken, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
