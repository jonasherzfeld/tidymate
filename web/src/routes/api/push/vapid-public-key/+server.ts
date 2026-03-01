import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get("session");
  console.log(
    `[PUSH PROXY] GET vapid-public-key, session=${session ? "set" : "MISSING"}, backend=${BASE_API_URI}`
  );

  const res = await fetch(
    `${BASE_API_URI}/notifications/push/vapid-public-key`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`
      },
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    }
  );

  console.log(`[PUSH PROXY] vapid-public-key backend response: ${res.status}`);

  if (!res.ok) {
    const text = await res.text();
    console.error(
      `[PUSH PROXY] vapid-public-key failed: ${res.status} ${text}`
    );
    return json({ error: "Failed to fetch VAPID key" }, { status: res.status });
  }

  const data = await res.json();
  console.log(
    `[PUSH PROXY] vapid-public-key: key length=${data.public_key?.length}`
  );
  return json(data);
};
