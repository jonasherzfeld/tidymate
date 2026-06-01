import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get("session");

  const res = await fetch(`${BASE_API_URI}/notifications/push/vapid-public-key`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${session}`
    },
    signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
  });

  if (!res.ok) {
    return json({ error: "Failed to fetch VAPID key" }, { status: res.status });
  }

  const data = await res.json();
  return json(data);
};
