// src/components/PushOptIn.jsx
// One-time banner prompting students to enable push notifications.

export default function PushOptIn({ onEnable, onDismiss }) {
  return (
    <div className="push-optin">
      <span className="push-optin-icon">🔔</span>
      <span className="push-optin-text">
        Get notified about due dates, grades, and announcements
      </span>
      <button className="push-optin-btn push-optin-enable" onClick={onEnable}>
        Enable
      </button>
      <button className="push-optin-btn push-optin-dismiss" onClick={onDismiss}>
        Not now
      </button>
    </div>
  );
}
