// Service Worker for Tidymate push notifications

self.addEventListener("push", function (event) {
  console.log("[SW] Push event received");

  if (!event.data) {
    console.warn("[SW] Push event has no data");
    return;
  }

  let data;
  try {
    data = event.data.json();
    console.log("[SW] Push payload:", JSON.stringify(data));
  } catch (e) {
    console.error("[SW] Failed to parse push data:", e);
    return;
  }

  const options = {
    body: data.body || "",
    icon: data.icon || "/web-app-manifest-192x192.png",
    badge: "/favicon-48x48.png",
    data: { href: data.href || "/" },
    vibrate: [100, 50, 100],
    tag: "tidymate-notification",
    renotify: true
  };

  console.log("[SW] Showing notification:", data.title, options);

  event.waitUntil(
    self.registration.showNotification(data.title || "Tidymate", options)
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log(
    "[SW] Notification clicked, href:",
    event.notification.data?.href
  );
  event.notification.close();

  const href = event.notification.data?.href || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.focus();
            client.navigate(href);
            return;
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(href);
        }
      })
  );
});

self.addEventListener("install", function () {
  console.log("[SW] Installing...");
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  console.log("[SW] Activating...");
  event.waitUntil(self.clients.claim());
});
