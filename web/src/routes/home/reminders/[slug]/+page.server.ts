import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { reminderItemSchema } from "$lib/utils/schemas";
import type { Cookies } from "@sveltejs/kit";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";

async function get_reminder(reminderId: string, cookies: Cookies): Promise<Reminder> {
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
    `${BASE_API_URI}/reminders/get-reminder/${reminderId}`,
    requestInitOptions
  );

  if (!res.ok) {
    return {} as Reminder;
  }

  try {
    const response = await res.json();
    return response.reminder as Reminder;
  } catch {
    return {} as Reminder;
  }
}

export const load: PageServerLoad = async ({ params, cookies }) => {
  const reminderItemForm = await superValidate(zod(reminderItemSchema));
  if (params.slug === "new") {
    return {
      reminder: {
        id: "",
        data: "",
        frequency: 1,
        assignee: "",
        deadline: "",
        last_done: "",
        category: "",
        created_on: "",
        done: false
      },
      slug: params.slug,
      reminderItemForm
    };
  }
  return {
    reminder: await get_reminder(params.slug, cookies),
    slug: params.slug,
    reminderItemForm
  };
};

export const actions = {
  create_reminder: async ({ request, fetch, cookies }) => {
    const createReminderForm = await superValidate(request, zod(reminderItemSchema));

    if (!createReminderForm.valid) return fail(400, { createReminderForm });

    let requestInitOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        id: createReminderForm.data.id,
        data: createReminderForm.data.data,
        frequency: createReminderForm.data.frequency,
        assignee: createReminderForm.data.assignee ?? "",
        category: createReminderForm.data.category,
        deadline: createReminderForm.data.deadline
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/reminders/create-reminder`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { createReminderForm, errors: response.error });
      } catch {
        return fail(500, { createReminderForm, errors: "Internal Error" });
      }
    }

    return redirect(300, "/home/reminders");
  },

  change_reminder: async ({ request, fetch, cookies }) => {
    const changeReminderForm = await superValidate(request, zod(reminderItemSchema));
    if (!changeReminderForm.valid) return fail(400, { changeReminderForm });

    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        id: changeReminderForm.data.id,
        data: changeReminderForm.data.data,
        frequency: changeReminderForm.data.frequency,
        category: changeReminderForm.data.category,
        assignee: changeReminderForm.data.assignee ?? "",
        deadline: changeReminderForm.data.deadline
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/reminders/update-reminder`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { changeReminderForm, errors: response.error });
      } catch {
        return fail(500, { changeReminderForm, errors: "Internal Error" });
      }
    }

    return redirect(300, "/home/reminders");
  }
};
