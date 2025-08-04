import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Cookies } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { fail } from "@sveltejs/kit";

async function get_chores(cookies: Cookies): Promise<Chore[]> {
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

async function get_todos(cookies: Cookies): Promise<Todo[]> {
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
    `${BASE_API_URI}/items/get-todos`,
    requestInitOptions
  );

  if (!res.ok) {
    return [] as Todo[];
  }

  try {
    const response = await res.json();
    return response.todos;
  } catch {
    return [] as Todo[];
  }
}

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

async function get_completion_stats(cookies: Cookies): Promise<any> {
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
    `${BASE_API_URI}/history/get-completion-stats`,
    requestInitOptions
  );

  if (!res.ok) {
    return {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      completed_reminders: 0,
      by_user: {}
    };
  }

  try {
    const response = await res.json();
    return response.stats;
  } catch {
    return {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      completed_reminders: 0,
      by_user: {}
    };
  }
}

async function get_personal_stats(cookies: Cookies): Promise<any> {
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
    `${BASE_API_URI}/history/get-personal-stats`,
    requestInitOptions
  );

  if (!res.ok) {
    return {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      completed_reminders: 0
    };
  }

  try {
    const response = await res.json();
    return response.stats;
  } catch {
    return {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      completed_reminders: 0
    };
  }
}

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    chores: await get_chores(cookies),
    todos: await get_todos(cookies),
    reminders: await get_reminders(cookies),
    completionStats: await get_completion_stats(cookies),
    personalStats: await get_personal_stats(cookies)
  };
};

export const actions = {
  delete_history: async ({ request, fetch, cookies }) => {
    const params = new URLSearchParams(request.url);
    const itemType = params.get("item_type");

    if (!itemType) {
      return fail(400, { errors: "Item type not specified" });
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
      `${BASE_API_URI}/history/delete-history/${itemType}`,
      requestInitOptions
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return {
        success: true,
        message: response.message,
        deleted_count: response.deleted_count
      };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }
};