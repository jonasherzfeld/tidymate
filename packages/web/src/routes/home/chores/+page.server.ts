import { BASE_API_URI } from "$lib/utils/constants";
import type { Config } from "@sveltejs/adapter-vercel";
import type { Cookies } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const config: Config = {
  runtime: "edge"
};

async function get_chores(cookies: Cookies): Promise<Chore[]> {
  let requestInitOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookies.get("session")}`
    }
  };

  const res = await fetch(
    `${BASE_API_URI}/chores/get-chores`,
    requestInitOptions
  );
  if (!res.ok) {
    return [] as Chore[];
  }
  const response = await res.json();
  return response.chores;
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
      }
    };

    const res = await fetch(
      `${BASE_API_URI}/chores/delete-chore/${choreId}`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { errors: response.error });
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
      }
    };

    const res = await fetch(
      `${BASE_API_URI}/chores/check-chore/${choreId}`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { errors: response.error });
    }

    return { chore: response.chore };
  }
};
