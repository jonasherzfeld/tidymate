import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Cookies } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

async function get_chores(cookies: Cookies): Promise<Chore[]> {
  let requestInitOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookies.get("session")}`
    },
    signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
  };

  const res = await fetch(
    `${BASE_API_URI}/chores/get-chores`,
    requestInitOptions
  );

  if (!res.ok) {
    return [] as Chore[];
  }

  try {
    const response = await res.json();
    return response.chores;
  } catch {
    return [] as Chore[];
  }
}

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    streamed: {
      chore_list: get_chores(cookies)
    }
  };
};

export const actions = {
  delete_chore: async ({ request, fetch, cookies }) => {
    const params = new URLSearchParams(request.url);
    const choreId = params.getAll("id")[0];

    if (!choreId) {
      return fail(400, { errors: "Invalid Chore ID" });
    }

    let requestInitOptions: RequestInit = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/chores/delete-chore/${choreId}`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { errors: response.error });
      } catch {
        return fail(500, { errors: "Internal Error" });
      }
    }

    return { chore_id: choreId };
  },

  check_chore: async ({ request, fetch, cookies }) => {
    const params = new URLSearchParams(request.url);
    const choreId = params.getAll("id")[0];

    if (!choreId) {
      return fail(400, { errors: "Invalid Chore ID" });
    }

    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/chores/check-chore/${choreId}`,
      requestInitOptions
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { chore: response.chore };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }
};
