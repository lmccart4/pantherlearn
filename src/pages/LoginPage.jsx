// src/pages/LoginPage.jsx — Savanna Signal
import { useEffect } from "react";
import { signInWithGoogle, signInWithCredentials } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { Button, Card, Chip, Kicker, Tape, Callout } from "../components/savanna";

export default function LoginPage() {
  const { authError } = useAuth();

  // Agent auto-sign-in: ?agent=pixel&key=pixel-qa-agent-2026
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const agent = params.get("agent");
    const key = params.get("key");
    if (agent && key) {
      window.history.replaceState({}, "", window.location.pathname);
      signInWithCredentials(`${agent}@lachlan.internal`, key).catch(() => {});
    }
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  return (
    <main id="main-content" className="sv-login">
      <div className="sv-login-split">
        <section className="sv-login-copy">
          <Kicker>◆ PantherLearn · v2026</Kicker>
          <h1 className="t-display-1 sv-login-headline">
            Learn <em>sharp.</em><br />
            Build <u>fast.</u><br />
            Ship <em>clean.</em>
          </h1>
          <p className="t-body-lg sv-login-sub">
            Physics, AI literacy, and digital literacy — wired into one place.
            Sign in with your school account to pick up where you left off.
          </p>
          <Tape items={["Classroom synced", "AI-ready", "Perth Amboy HS"]} />
        </section>

        <Card variant="raised" className="sv-login-card">
          <img src="/images/pl-logo.png" alt="" className="sv-login-logo" />
          <h2 className="sv-login-title">Sign in</h2>
          <p className="sv-login-sub-sm">
            Use your <strong>@paps.net</strong> school account.
          </p>

          {authError && (
            <Callout tone="danger" title="Sign-in blocked">
              {authError}
            </Callout>
          )}

          <Button
            variant="hero"
            size="lg"
            onClick={handleSignIn}
            className="sv-login-btn"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            }
          >
            Continue with Google
          </Button>

          <div className="sv-login-chips">
            <Chip tone="ghost" dot>Student</Chip>
            <Chip tone="ghost" dot>Teacher</Chip>
            <Chip tone="ghost" dot>Guardian</Chip>
          </div>
        </Card>
      </div>

      <style>{`
        .sv-login {
          min-height: 100vh;
          padding: var(--space-7) var(--space-5);
          display: grid;
          place-items: center;
          position: relative;
          z-index: 1;
        }
        .sv-login-split {
          width: 100%;
          max-width: 1180px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: var(--space-8);
          align-items: center;
        }
        @media (max-width: 860px) {
          .sv-login-split { grid-template-columns: 1fr; gap: var(--space-6); }
        }
        .sv-login-copy { max-width: 620px; }
        .sv-login-headline { margin: var(--space-4) 0 var(--space-5); }
        .sv-login-sub { color: var(--fg-muted); margin-bottom: var(--space-5); }
        .sv-login-card {
          width: 100%;
          max-width: 440px;
          justify-self: end;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        @media (max-width: 860px) {
          .sv-login-card { justify-self: stretch; }
        }
        .sv-login-logo { width: 56px; height: 56px; }
        .sv-login-title {
          font-family: var(--serif);
          font-weight: 900;
          font-size: 40px;
          letter-spacing: -0.02em;
          color: var(--fg-default);
          margin: 0;
          font-variation-settings: "SOFT" 60;
        }
        .sv-login-sub-sm {
          font-size: var(--t-base);
          color: var(--fg-muted);
        }
        .sv-login-btn { width: 100%; justify-content: center; }
        .sv-login-chips {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          padding-top: var(--space-3);
          border-top: 1px dashed var(--border-soft);
        }
      `}</style>
    </main>
  );
}
