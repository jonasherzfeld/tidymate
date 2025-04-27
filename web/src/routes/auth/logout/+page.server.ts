import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
  const requestInitOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `sessionid=${cookies.get("session")}`
    },
    signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
  };

  const res = await fetch(`${BASE_API_URI}/auth/logout`, requestInitOptions);

  if (!res.ok) {
    try {
      const response = await res.json();
      return fail(400, { errors: response.error });
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }

  // eat the cookie
  cookies.delete("session", { path: "/" });

  // redirect the user
  redirect(302, "/auth/login");
}
