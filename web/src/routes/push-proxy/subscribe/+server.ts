import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const session = cookies.get("session");
  const body = await request.json();

  const res = await fetch(`${BASE_API_URI}/notifications/push/subscribe`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${session}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
  });

  if (!res.ok) {
    return json({ error: "Failed to subscribe" }, { status: res.status });
  }

  const data = await res.json();
  return json(data, { status: res.status });
};
