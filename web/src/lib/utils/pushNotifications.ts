function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  const supported = "serviceWorker" in navigator && "PushManager" in window;
  console.debug("[PUSH] isPushSupported:", supported);
  return supported;
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.ready;
  const sub = await registration.pushManager.getSubscription();
  console.debug(
    "[PUSH] getExistingSubscription:",
    sub ? `active (endpoint=${sub.endpoint.slice(0, 60)}...)` : "none"
  );
  return sub;
}

export async function subscribeToPush(): Promise<boolean> {
  console.debug("[PUSH] subscribeToPush: starting...");
  if (!isPushSupported()) return false;

  try {
    console.debug("[PUSH] Registering service worker...");
    const registration = await navigator.serviceWorker.register("/sw.js");
    console.debug("[PUSH] SW registered, scope:", registration.scope);
    await navigator.serviceWorker.ready;
    console.debug("[PUSH] SW ready");

    console.debug("[PUSH] Requesting notification permission...");
    const permission = await Notification.requestPermission();
    console.debug("[PUSH] Permission result:", permission);
    if (permission !== "granted") return false;

    // Get VAPID public key via SvelteKit proxy (same origin, cookies work)
    console.debug(
      "[PUSH] Fetching VAPID public key from /api/push/vapid-public-key..."
    );
    const res = await fetch("/api/push/vapid-public-key");
    console.debug("[PUSH] VAPID key response:", res.status, res.statusText);
    if (!res.ok) {
      console.error(
        "[PUSH] Failed to fetch VAPID key:",
        res.status,
        await res.text()
      );
      return false;
    }
    const { public_key } = await res.json();
    console.debug("[PUSH] Got VAPID public key, length:", public_key?.length);

    if (!public_key) {
      console.error("[PUSH] VAPID public key is empty!");
      return false;
    }

    // Subscribe via PushManager
    console.debug("[PUSH] Subscribing via PushManager...");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(public_key)
    });
    console.debug(
      "[PUSH] PushManager subscription created:",
      subscription.endpoint.slice(0, 60) + "..."
    );

    // Send subscription to backend via SvelteKit proxy
    console.debug("[PUSH] Sending subscription to backend...");
    const subRes = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: subscription.toJSON() })
    });
    console.debug(
      "[PUSH] Backend subscribe response:",
      subRes.status,
      subRes.statusText
    );
    if (!subRes.ok) {
      console.error("[PUSH] Backend subscribe failed:", await subRes.text());
    }

    return subRes.ok;
  } catch (err) {
    console.error("[PUSH] subscribeToPush error:", err);
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  console.debug("[PUSH] unsubscribeFromPush: starting...");
  if (!isPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      console.debug("[PUSH] No existing subscription to unsubscribe");
      return true;
    }

    console.debug("[PUSH] Telling backend to remove subscription...");
    const res = await fetch("/api/push/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint })
    });
    console.debug("[PUSH] Backend unsubscribe response:", res.status);

    console.debug("[PUSH] Unsubscribing locally...");
    await subscription.unsubscribe();
    console.debug("[PUSH] Local unsubscribe done");

    return true;
  } catch (err) {
    console.error("[PUSH] unsubscribeFromPush error:", err);
    return false;
  }
}
