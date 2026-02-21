// Firebase Cloud Messaging service worker — handles background push notifications.
// This file MUST live at the site root (/) for FCM to work.

/* eslint-env serviceworker */
/* global firebase */

importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4",
});

const messaging = firebase.messaging();

// Background push handler — fires when the app is not in the foreground.
// We use data-only messages from the Cloud Function so this always fires.
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || "PantherLearn";
  const options = {
    body: data.body || "",
    icon: "/vite.svg",
    badge: "/vite.svg",
    data: { link: data.link || "/" },
  };
  self.registration.showNotification(title, options);
});

// Click handler — open or focus the app at the notification's link.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.link || "/";
  const url = new URL(link, self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // Focus an existing tab if one is open
      for (const client of windowClients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      // Otherwise open a new tab
      return clients.openWindow(url);
    })
  );
});
