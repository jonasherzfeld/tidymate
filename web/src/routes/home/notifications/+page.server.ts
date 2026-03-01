import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import type { Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";

export const actions: Actions = {
  view_notification: async ({ request, cookies }) => {
    const formData = await request.formData();
    const id = String(formData.get("id"));

    const res = await fetch(
      `${BASE_API_URI}/notifications/view-notification/${id}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${cookies.get("session")}`
        },
        signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
      }
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { success: true, href: response.notification.href };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  },

  delete_notification: async ({ request, cookies }) => {
    const formData = await request.formData();
    const id = String(formData.get("id"));

    const res = await fetch(
      `${BASE_API_URI}/notifications/delete-notification/${id}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${cookies.get("session")}`
        },
        signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
      }
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { success: true };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  },

  delete_all_notifications: async ({ cookies }) => {
    const res = await fetch(
      `${BASE_API_URI}/notifications/delete-all-notifications`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${cookies.get("session")}`
        },
        signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
      }
    );

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { success: true };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }
};
