import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const session = cookies.get("session");
  console.log(`[PUSH PROXY] POST unsubscribe, session=${session ? "set" : "MISSING"}, backend=${BASE_API_URI}`);

  const body = await request.json();

  const res = await fetch(
    `${BASE_API_URI}/notifications/push/unsubscribe`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    }
  );

  console.log(`[PUSH PROXY] unsubscribe backend response: ${res.status}`);

  if (!res.ok) {
    const text = await res.text();
    console.error(`[PUSH PROXY] unsubscribe failed: ${res.status} ${text}`);
    return json({ error: "Failed to unsubscribe" }, { status: res.status });
  }

  const data = await res.json();
  return json(data, { status: res.status });
};
