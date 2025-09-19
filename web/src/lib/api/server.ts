// /web/src/lib/api/server.ts (new file)
import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Cookies } from "@sveltejs/kit";

export async function authenticatedFetch<T>(
  endpoint: string,
  cookies: Cookies,
  options: RequestInit = {}
): Promise<T | null> {
  const requestInit: RequestInit = {
    ...options,
    method: options.method || "GET",
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Cookie: `session=${cookies.get("session")}`,
    },
    signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS),
  };

  const res = await fetch(`${BASE_API_URI}${endpoint}`, requestInit);

  if (!res.ok) {
    // You could add more robust error handling here
    return null;
  }

  try {
    return await res.json() as T;
  } catch {
    return null;
  }
}
