import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { choreItemSchema } from "$lib/utils/schemas";
import type { Cookies } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";

async function get_chore(choreId: string, cookies: Cookies): Promise<Chore> {
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
    `${BASE_API_URI}/chores/get-chore/${choreId}`,
    requestInitOptions
  );

  if (!res.ok) {
    return {} as Chore;
  }

  try {
    const response = await res.json();
    return response.chore as Chore;
  } catch {
    return {} as Chore;
  }
}

export const load: PageServerLoad = async ({ params, cookies }) => {
  const choreItemForm = await superValidate(zod(choreItemSchema));
  if (params.slug === "new") {
    return {
      chore: {
        id: "",
        data: "",
        frequency: 1,
        assignee: "",
        deadline: "",
        last_done: "",
        room: "",
        severity: "LOW",
        created_on: "",
        done: false
      },
      slug: params.slug,
      choreItemForm
    };
  }
  return {
    chore: await get_chore(params.slug, cookies),
    slug: params.slug,
    choreItemForm
  };
};

export const actions = {
  create_chore: async ({ request, fetch, cookies }) => {
    const createChoreForm = await superValidate(request, zod(choreItemSchema));

    if (!createChoreForm.valid) return fail(400, { createChoreForm });

    let requestInitOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        id: createChoreForm.data.id,
        data: createChoreForm.data.data,
        frequency: createChoreForm.data.frequency,
        assignee: createChoreForm.data.assignee ?? "",
        room: createChoreForm.data.room,
        deadline: createChoreForm.data.deadline
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/chores/create-chore`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { createChoreForm, errors: response.error });
      } catch {
        return fail(500, { createChoreForm, errors: "Internal Error" });
      }
    }

    return redirect(300, "/home/chores");
  },

  change_chore: async ({ request, fetch, cookies }) => {
    const changeChoreForm = await superValidate(request, zod(choreItemSchema));
    if (!changeChoreForm.valid) return fail(400, { changeChoreForm });

    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        id: changeChoreForm.data.id,
        data: changeChoreForm.data.data,
        frequency: changeChoreForm.data.frequency,
        room: changeChoreForm.data.room,
        assignee: changeChoreForm.data.assignee ?? "",
        deadline: changeChoreForm.data.deadline
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/chores/update-chore`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { changeChoreForm, errors: response.error });
      } catch {
        return fail(500, { changeChoreForm, errors: "Internal Error" });
      }
    }

    return redirect(300, "/home/chores");
  }
};
