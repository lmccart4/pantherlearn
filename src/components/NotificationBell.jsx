// src/components/NotificationBell.jsx
// Real-time notification bell with dropdown panel for the TopBar.

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { subscribeNotifications, markRead, markAllRead, NOTIF_TYPES } from "../lib/notifications";
import { useNavigate } from "react-router-dom";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationBell() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [toastExiting, setToastExiting] = useState(false);
  const dropdownRef = useRef(null);
  const knownIdsRef = useRef(null); // null = first load, Set after
  const toastTimerRef = useRef(null);

  // Subscribe to real-time notifications + detect new ones for toast
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeNotifications(user.uid, (notifs) => {
      setNotifications(notifs);

      // On first load, just record existing IDs — don't toast
      if (knownIdsRef.current === null) {
        knownIdsRef.current = new Set(notifs.map((n) => n.id));
        return;
      }

      // Find new unread notifications we haven't seen
      const newUnread = notifs.filter((n) => !n.read && !knownIdsRef.current.has(n.id));
      if (newUnread.length > 0) {
        // Show the most recent new notification as a toast
        const latest = newUnread[0];
        showToast(latest);
      }

      // Update known IDs
      knownIdsRef.current = new Set(notifs.map((n) => n.id));
    });
    return () => unsub();
  }, [user?.uid]);

  const showToast = (notif) => {
    // Clear any existing toast timer
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastExiting(false);
    setToast(notif);
    // Auto-dismiss after 4 seconds
    toastTimerRef.current = setTimeout(() => {
      setToastExiting(true);
      setTimeout(() => { setToast(null); setToastExiting(false); }, 300);
    }, 4000);
  };

  const dismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastExiting(true);
    setTimeout(() => { setToast(null); setToastExiting(false); }, 300);
  };

  const handleToastClick = async (notif) => {
    dismissToast();
    if (!notif.read) {
      await markRead(user.uid, notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClick = async (notif) => {
    if (!notif.read) {
      await markRead(user.uid, notif.id);
    }
    if (notif.link) {
      navigate(notif.link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllRead(user.uid);
  };

  return (
    <div className="notif-bell-wrap" ref={dropdownRef}>
      <button
        className="notif-bell-btn"
        onClick={() => setOpen(!open)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
      >
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown" role="menu" aria-label="Notifications"
          onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }}>
          <div className="notif-header">
            <span className="notif-header-title">Notifications</span>
            {unreadCount > 0 && (
              <button className="notif-mark-all" onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <span style={{ fontSize: 28 }}>🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const typeInfo = NOTIF_TYPES[notif.type] || {};
                return (
                  <button
                    key={notif.id}
                    className={`notif-item ${notif.read ? "" : "unread"}`}
                    onClick={() => handleClick(notif)}
                  >
                    <div className="notif-item-icon" style={{ color: typeInfo.color || "var(--amber)" }}>
                      {notif.icon || typeInfo.icon || "🔔"}
                    </div>
                    <div className="notif-item-body">
                      <div className="notif-item-title">{notif.title}</div>
                      {notif.body && <div className="notif-item-text">{notif.body}</div>}
                      <div className="notif-item-time">{timeAgo(notif.createdAt)}</div>
                    </div>
                    {!notif.read && <div className="notif-unread-dot" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      {/* Toast notification popup */}
      {toast && (
        <div
          onClick={() => handleToastClick(toast)}
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 10000,
            maxWidth: 340,
            background: "var(--surface, #1e2132)",
            border: "1px solid var(--border, #2a2f3d)",
            borderLeft: `3px solid ${NOTIF_TYPES[toast.type]?.color || "var(--amber)"}`,
            borderRadius: 10,
            padding: "12px 14px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
            cursor: toast.link ? "pointer" : "default",
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            animation: toastExiting ? "notifToastOut 0.3s ease forwards" : "notifToastIn 0.3s ease forwards",
          }}
        >
          <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1 }}>
            {toast.icon || NOTIF_TYPES[toast.type]?.icon || "🔔"}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "var(--text, #e0e0e0)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {toast.title}
            </div>
            {toast.body && (
              <div style={{
                fontSize: 12, color: "var(--text3, #888)", marginTop: 2,
                lineHeight: 1.4,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {toast.body}
              </div>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); dismissToast(); }}
            style={{
              background: "none", border: "none", color: "var(--text3, #888)",
              fontSize: 14, cursor: "pointer", padding: "0 2px", flexShrink: 0, lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      )}

      <style>{`
        @keyframes notifToastIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes notifToastOut {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100px); }
        }
      `}</style>
    </div>
  );
}
