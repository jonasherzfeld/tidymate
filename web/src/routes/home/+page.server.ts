import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";
import { authenticatedFetch } from "$lib/api/server";

export const load: PageServerLoad = async ({ cookies }) => {
  const [chores, todos, reminders, completionStats, personalStats] = await Promise.all([
    authenticatedFetch<{ chores: Chore[] }>("/chores/get-chores", cookies),
    authenticatedFetch<{ todos: Todo[] }>("/items/get-todos", cookies),
    authenticatedFetch<{ reminders: Reminder[] }>("/reminders/get-reminders", cookies),
    authenticatedFetch<{ stats: any }>("/history/get-completion-stats", cookies),
    authenticatedFetch<{ stats: any }>("/history/get-personal-stats", cookies),
  ]);

  return {
    chores: chores?.chores ?? [],
    todos: todos?.todos ?? [],
    reminders: reminders?.reminders ?? [],
    completionStats: completionStats?.stats ?? {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      completed_reminders: 0,
      by_user: {}
    },
    personalStats: personalStats?.stats ?? {
      total_completed: 0,
      completed_todos: 0,
      completed_chores: 0,
      completed_reminders: 0
    },
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
