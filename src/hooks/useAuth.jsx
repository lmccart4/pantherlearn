// src/hooks/useAuth.jsx
import { useState, useEffect, createContext, useContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logOut } from "../lib/firebase";
import { syncUserProfile } from "./useUserProfile";
import { autoLinkEnrollments } from "./useAutoEnrollment";

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

  if (!lower.endsWith("@paps.net")) return null;

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

        // Sync user profile in Firestore (create or update)
        const userNickname = await syncUserProfile(firebaseUser, role);
        setNickname(userNickname);

        // Auto-link enrollment records for students
        if (role === "student") {
          await autoLinkEnrollments(firebaseUser);
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