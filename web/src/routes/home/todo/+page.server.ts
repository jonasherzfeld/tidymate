import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Cookies } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

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

export const load: PageServerLoad = async ({ cookies }) => {
  return {
    streamed: {
      todo_list: get_todos(cookies)
    }
  };
};

export const actions = {
  create_todo: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const todoTextData = String(formData.get("todo_data"));

    if (!todoTextData) {
      return fail(400, { errors: "Nothing submitted" });
    }

    let requestInitOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({ data: todoTextData }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/items/create-todo`,
      requestInitOptions
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { todo: response.todo };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  },

  delete_todo: async ({ request, fetch, cookies }) => {
    const params = new URLSearchParams(request.url);
    const todoId = params.getAll("id")[0];

    if (!todoId) {
      return fail(400, { errors: "Invalid Todo ID" });
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
      `${BASE_API_URI}/items/delete-todo/${todoId}`,
      requestInitOptions
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { todo_id: todoId };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  },

  check_todo: async ({ request, fetch, cookies }) => {
    const params = new URLSearchParams(request.url);
    const todoId = params.getAll("id")[0];

    if (!todoId) {
      return fail(400, { errors: "Invalid Todo ID" });
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
      `${BASE_API_URI}/items/check-todo/${todoId}`,
      requestInitOptions
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { todo: response.todo };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }
};
