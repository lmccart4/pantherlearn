// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import TopBar from "./components/TopBar";
import ErrorBoundary from "./components/ErrorBoundary";
import { TranslationProvider } from "./contexts/TranslationContext";
import { PreviewProvider } from "./contexts/PreviewContext";
import PreviewBanner from "./components/PreviewBanner";
import OfflineBanner from "./components/OfflineBanner";
import usePushNotifications from "./hooks/usePushNotifications";

// Lazy-loaded widgets — only needed after auth, load in background
const ClassChat = lazy(() => import("./components/ClassChat"));
const FloatingMusicPlayer = lazy(() => import("./components/FloatingMusicPlayer"));
const AnnotationOverlay = lazy(() => import("./components/AnnotationOverlay"));
const ScreenReader = lazy(() => import("./components/ScreenReader"));
const BugReporter = lazy(() => import("./components/BugReporter"));
const PushOptIn = lazy(() => import("./components/PushOptIn"));

// Lazy-loaded pages
const LoginPage = lazy(() => import("./pages/LoginPage"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CoursePage = lazy(() => import("./pages/CoursePage"));
const LessonViewer = lazy(() => import("./pages/LessonViewer"));
const LessonEditor = lazy(() => import("./pages/LessonEditor"));
const GradingDashboard = lazy(() => import("./pages/GradingDashboard"));
const RosterSync = lazy(() => import("./pages/RosterSync"));
const StudentProgress = lazy(() => import("./pages/StudentProgress"));
const XPControls = lazy(() => import("./pages/XPControls"));
const TeamManager = lazy(() => import("./pages/TeamManager"));
const ManaManager = lazy(() => import("./pages/ManaManager"));
const BossBattle = lazy(() => import("./pages/BossBattle"));
const AvatarCreator = lazy(() => import("./pages/AvatarCreator"));
const MyGrades = lazy(() => import("./pages/MyGrades"));
const MessageCenter = lazy(() => import("./pages/MessageCenter"));
const GuessWhoGame = lazy(() => import("./pages/GuessWhoGame"));
const StudentAnalytics = lazy(() => import("./pages/StudentAnalytics"));
const WeeklyEvidence = lazy(() => import("./pages/WeeklyEvidence"));
const BotBuilder = lazy(() => import("./pages/BotBuilder"));

const TRANSLATE_URL = import.meta.env.VITE_TRANSLATE_URL || "https://us-central1-pantherprep-a5a73.cloudfunctions.net/translateText";

const LoadingSpinner = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
    <div className="spinner" />
  </div>
);

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <TopBar />
      <Outlet />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelectorAll('[style*="overflow"]').forEach(el => {
      el.scrollTop = 0;
    });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  const { showOptIn, handleEnable, handleDismiss } = usePushNotifications();

  if (loading) return <LoadingSpinner />;

  return (
    <PreviewProvider>
      {/* Ambient background video — loops silently behind all content */}
      <video
        className="bg-atmosphere-video"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      >
        <source src="/bg-atmosphere.mp4" type="video/mp4" />
      </video>
      <div className="bg-atmosphere-overlay" aria-hidden="true" />
      <ScrollToTop />
      <PreviewBanner />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/course/:courseId" element={<CoursePage />} />
            <Route path="/course/:courseId/lesson/:lessonId" element={<LessonViewer />} />
            <Route path="/editor" element={<LessonEditor />} />
            <Route path="/grading" element={<GradingDashboard />} />
            <Route path="/rosters" element={<RosterSync />} />
            <Route path="/progress" element={<StudentProgress />} />
            <Route path="/xp-controls/:courseId" element={<XPControls />} />
            <Route path="/teams/:courseId" element={<TeamManager />} />
            <Route path="/mana/:courseId" element={<ManaManager />} />
            <Route path="/boss-battle/:courseId" element={<BossBattle />} />
            <Route path="/avatar" element={<AvatarCreator />} />
            <Route path="/my-grades" element={<MyGrades />} />
            <Route path="/messages" element={<MessageCenter />} />
            <Route path="/analytics" element={<StudentAnalytics />} />
            <Route path="/course/:courseId/evidence" element={<WeeklyEvidence />} />
            <Route path="/guess-who/:courseId/:gameId" element={<GuessWhoGame />} />
            <Route path="/chatbot-workshop/:courseId" element={<BotBuilder />} />
          </Route>
        </Routes>
      </Suspense>
      {showOptIn && <Suspense fallback={null}><PushOptIn onEnable={handleEnable} onDismiss={handleDismiss} /></Suspense>}
      {user && <Suspense fallback={null}><ClassChat /></Suspense>}
      {user && <Suspense fallback={null}><FloatingMusicPlayer /></Suspense>}
      {user && <Suspense fallback={null}><AnnotationOverlay /></Suspense>}
      {user && <Suspense fallback={null}><ScreenReader /></Suspense>}
      {user && <Suspense fallback={null}><BugReporter /></Suspense>}
      <OfflineBanner />
    </PreviewProvider>
  );
}

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TranslationProvider cloudFunctionUrl={TRANSLATE_URL}>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </TranslationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
