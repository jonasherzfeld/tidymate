import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Cookies } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

async function get_history(cookies: Cookies): Promise<History[]> {
  const requestInitOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookies.get("session")}`
    },
    signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
  };

  const res = await fetch(
    `${BASE_API_URI}/history/get-history`,
    requestInitOptions
  );

  if (!res.ok) {
    return [] as History[];
  }

  try {
    const response = await res.json();
    return response.history;
  } catch {
    return [] as History[];
  }
}

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    history: await get_history(cookies)
  };
};
