import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { todoItemSchema } from "$lib/utils/schemas";
import type { Cookies } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";

async function get_todo(todoId: string, cookies: Cookies): Promise<Todo> {
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
    `${BASE_API_URI}/items/get-todo/${todoId}`,
    requestInitOptions
  );

  if (!res.ok) {
    return {} as Todo;
  }

  try {
    const response = await res.json();
    return response.todo as Todo;
  } catch {
    return {} as Todo;
  }
}

export const load: PageServerLoad = async ({ params, cookies }) => {
  const todoItemForm = await superValidate(zod(todoItemSchema));

  return {
    todo: await get_todo(params.slug, cookies),
    todoItemForm
  };
};

export const actions = {
  change_todo: async ({ request, fetch, cookies }) => {
    const changeTodoForm = await superValidate(request, zod(todoItemSchema));
    if (!changeTodoForm.valid) return fail(400, { changeTodoForm });
    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        id: changeTodoForm.data.id,
        data: changeTodoForm.data.data,
        assignee: changeTodoForm.data.assignee ?? "",
        deadline: changeTodoForm.data.deadline ?? ""
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/items/update-todo`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { changeTodoForm, errors: response.error });
      } catch {
        return fail(500, { changeTodoForm, errors: "Internal Error" });
      }
    }
    return redirect(300, "/home/todo");
  }
};
