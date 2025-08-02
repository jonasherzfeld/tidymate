import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Cookies } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

async function get_reminders(cookies: Cookies): Promise<Reminder[]> {
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
    `${BASE_API_URI}/reminders/get-reminders`,
    requestInitOptions
  );

  if (!res.ok) {
    return [] as Reminder[];
  }

  try {
    const response = await res.json();
    return response.reminders;
  } catch {
    return [] as Reminder[];
  }
}

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    streamed: {
      reminder_list: get_reminders(cookies)
    }
  };
};

export const actions = {
  delete_reminder: async ({ request, fetch, cookies }) => {
    const params = new URLSearchParams(request.url);
    const reminderId = params.getAll("id")[0];

    if (!reminderId) {
      return fail(400, { errors: "Invalid Reminder ID" });
    }

    const requestInitOptions: RequestInit = {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/reminders/delete-reminder/${reminderId}`,
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

    return { reminder_id: reminderId };
  },

  check_reminder: async ({ request, fetch, cookies }) => {
    const params = new URLSearchParams(request.url);
    const reminderId = params.getAll("id")[0];

    if (!reminderId) {
      return fail(400, { errors: "Invalid Reminder ID" });
    }

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/reminders/check-reminder/${reminderId}`,
      requestInitOptions
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { reminder: response.reminder };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }
};
