import { BASE_API_URI } from "$lib/utils/constants";
import { todoItemSchema } from "$lib/utils/schemas";
import type { Config } from "@sveltejs/adapter-vercel";
import type { Cookies } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";

export const config: Config = {
  runtime: "edge"
};

async function get_todo(todoId: string, cookies: Cookies): Promise<Todo> {
  let requestInitOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookies.get("session")}`
    }
  };

  const res = await fetch(
    `${BASE_API_URI}/items/get-todo/${todoId}`,
    requestInitOptions
  );
  const response = await res.json();
  if (!res.ok) {
    return {} as Todo;
  }

  return response.todo as Todo;
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
      })
    };

    const res = await fetch(
      `${BASE_API_URI}/items/update-todo`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { changeTodoForm, errors: response.error });
    }

    return redirect(300, "/home/todo");
  }
};
