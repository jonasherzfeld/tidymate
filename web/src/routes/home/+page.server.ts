import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Cookies } from "@sveltejs/kit";
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

async function get_todos(cookies: Cookies): Promise<Todo[]> {
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
