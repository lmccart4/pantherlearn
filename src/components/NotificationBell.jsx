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
  const dropdownRef = useRef(null);

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeNotifications(user.uid, setNotifications);
    return () => unsub();
  }, [user?.uid]);

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
    </div>
  );
}
