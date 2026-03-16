// src/screens/SetupScreen.jsx
// Mandatory Google Sign-In for PantherLearn integration
import { useState, useEffect } from "react";
import { auth, signInWithGoogle } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export function SetupScreen({ onStart }) {
  const [user, setUser] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState(null);

  // Enrolled courses for the student
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Connection test
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Listen for auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setChecking(false);
    });
    return () => unsub();
  }, []);

  // Once signed in, fetch enrolled courses
  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const enrollSnap = await getDocs(
          query(collection(db, "enrollments"), where("uid", "==", user.uid))
        );
        const courseIds = new Set();
        enrollSnap.forEach((d) => {
          const data = d.data();
          if (data.courseId) courseIds.add(data.courseId);
        });

        if (courseIds.size === 0) {
          // Also check by email
          const emailSnap = await getDocs(
            query(collection(db, "enrollments"), where("email", "==", user.email))
          );
          emailSnap.forEach((d) => {
            const data = d.data();
            if (data.courseId) courseIds.add(data.courseId);
          });
        }

        // Fetch course details
        const courseList = [];
        const allCoursesSnap = await getDocs(collection(db, "courses"));
        allCoursesSnap.forEach((d) => {
          if (courseIds.has(d.id)) {
            courseList.push({ id: d.id, ...d.data() });
          }
        });

        setCourses(courseList);
        if (courseList.length === 1) setSelectedCourse(courseList[0].id);
      } catch (e) {
        console.error("Failed to fetch courses:", e);
      }
      setLoadingCourses(false);
    };
    fetchCourses();
  }, [user]);

  const handleSignIn = async () => {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (e) {
      if (e.code !== "auth/popup-closed-by-user") {
        setError("Sign-in failed. Please try again.");
      }
    }
    setSigningIn(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const { GEMINI_PROXY_URL } = await import("../lib/firebase");
      const res = await fetch(GEMINI_PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          payload: {
            studentPrompt: "Say hello in exactly 3 words",
            targetOutput: "test",
            targetWordCount: 10,
          },
        }),
      });
      if (res.ok) {
        setTestResult("success");
      } else {
        setTestResult("error");
      }
    } catch {
      setTestResult("error");
    }
    setTesting(false);
  };

  const canStart = user && selectedCourse && testResult === "success";

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-neutral-500 text-sm animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="text-center mb-10">
        <div
          className="text-5xl md:text-6xl font-black tracking-[-0.04em] mb-2"
          style={{
            fontFamily: "'Oswald', system-ui",
            background: "linear-gradient(135deg, #f97316, #ea580c, #fbbf24)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PROMPT DUEL
        </div>
        <p className="text-neutral-500 text-sm">Master the art of AI prompting</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Step 1: Sign In */}
        <div className={`rounded-xl border p-5 transition-all ${
          user ? "border-emerald-500/20 bg-emerald-500/[0.03]" : "border-white/[0.06] bg-white/[0.02]"
        }`}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
              user ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-neutral-500"
            }`}>
              {user ? "✓" : "1"}
            </div>
            <span className="text-sm font-semibold text-neutral-300">Sign In</span>
          </div>

          {user ? (
            <div className="flex items-center gap-3 ml-10">
              {user.photoURL && (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full border border-white/10" />
              )}
              <div>
                <div className="text-sm font-semibold text-white">{user.displayName}</div>
                <div className="text-[11px] text-neutral-500">{user.email}</div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              disabled={signingIn}
              className="ml-10 flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] bg-white text-black disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {signingIn ? "Signing in..." : "Sign in with Google"}
            </button>
          )}
          {error && <p className="text-red-400 text-xs mt-2 ml-10">{error}</p>}
        </div>

        {/* Step 2: Select Course */}
        {user && (
          <div className={`rounded-xl border p-5 transition-all ${
            selectedCourse ? "border-emerald-500/20 bg-emerald-500/[0.03]" : "border-white/[0.06] bg-white/[0.02]"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                selectedCourse ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-neutral-500"
              }`}>
                {selectedCourse ? "✓" : "2"}
              </div>
              <span className="text-sm font-semibold text-neutral-300">Select Course</span>
            </div>

            {loadingCourses ? (
              <div className="ml-10 text-neutral-500 text-sm animate-pulse">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="ml-10 text-neutral-500 text-sm">
                No enrolled courses found. Make sure you're signed into the right account.
              </div>
            ) : (
              <div className="ml-10 flex flex-wrap gap-2">
                {courses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourse(c.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedCourse === c.id
                        ? "bg-orange-500/20 border border-orange-500/30 text-orange-400"
                        : "bg-white/[0.04] border border-white/[0.06] text-neutral-400 hover:bg-white/[0.06]"
                    }`}
                  >
                    {c.icon || "📚"} {c.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Connection Test */}
        {user && selectedCourse && (
          <div className={`rounded-xl border p-5 transition-all ${
            testResult === "success" ? "border-emerald-500/20 bg-emerald-500/[0.03]" : "border-white/[0.06] bg-white/[0.02]"
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                testResult === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-neutral-500"
              }`}>
                {testResult === "success" ? "✓" : "3"}
              </div>
              <span className="text-sm font-semibold text-neutral-300">Connection Test</span>
            </div>

            <div className="ml-10">
              {testResult === "success" ? (
                <span className="text-emerald-400 text-sm font-semibold">✓ Connected to AI</span>
              ) : testResult === "error" ? (
                <div>
                  <span className="text-red-400 text-sm">Connection failed.</span>
                  <button onClick={handleTest} className="text-orange-400 text-sm ml-2 underline">Retry</button>
                </div>
              ) : (
                <button
                  onClick={handleTest}
                  disabled={testing}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/[0.04] border border-white/[0.06] text-neutral-400 hover:bg-white/[0.06] transition-all disabled:opacity-50"
                >
                  {testing ? "Testing..." : "Test Connection"}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={() => onStart(user, selectedCourse)}
          disabled={!canStart}
          className="w-full py-4 rounded-xl font-bold text-lg transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed text-white"
          style={{
            background: canStart
              ? "linear-gradient(135deg, #f97316, #ea580c)"
              : "rgba(255,255,255,0.05)",
          }}
        >
          ⚔️ ENTER THE ARENA
        </button>
      </div>

      <p className="text-[10px] text-neutral-600 mt-8 text-center max-w-sm">
        🐾 XP earned in Prompt Duel syncs to your PantherLearn profile.
        Your teacher can see your game results and grade your performance.
      </p>
    </div>
  );
}
