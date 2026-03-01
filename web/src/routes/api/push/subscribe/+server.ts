import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, cookies }) => {
  const session = cookies.get("session");
  console.log(
    `[PUSH PROXY] POST subscribe, session=${session ? "set" : "MISSING"}, backend=${BASE_API_URI}`
  );

  const body = await request.json();
  console.log(`[PUSH PROXY] subscribe body keys:`, Object.keys(body));

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

  console.log(`[PUSH PROXY] subscribe backend response: ${res.status}`);

  if (!res.ok) {
    const text = await res.text();
    console.error(`[PUSH PROXY] subscribe failed: ${res.status} ${text}`);
    return json({ error: "Failed to subscribe" }, { status: res.status });
  }

  const data = await res.json();
  return json(data, { status: res.status });
};
