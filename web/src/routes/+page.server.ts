import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import { fail } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
  // redirect user if logged in
  if (locals.user && locals.house) {
    redirect(302, "/home");
  }
  redirect(302, "/auth/login");
};

export const actions: Actions = {
  set_theme: async ({ url, cookies }) => {
    const theme = url.searchParams.get("theme");
    const redirect_to = url.searchParams.get("redirectTo");

    if (theme) {
      cookies.set("colortheme", theme, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365
      });
    }
    redirect(303, redirect_to ?? "/");
  },

  create_notification: async ({ request, cookies }) => {
    const formData = await request.formData();
    const name = String(formData.get("name"));
    const description = String(formData.get("description"));
    const severity = Number(formData.get("severity"));

   const requestInitOptions: RequestInit = {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           Cookie: `session=${cookies.get("session")}`
         },
         body: JSON.stringify({
           name: name,
           description: description,
           severity: severity
         }),
         signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
       };
   
       const res = await fetch(`${BASE_API_URI}/notifications/create-notification`, requestInitOptions);
   
       try {
         const response = await res.json();
         if (!res.ok) {
           return fail(400, { errors: response.error });
         }
         return {
           success: true,
         };
       } catch {
         return fail(500, { errors: "Internal Error" });
       }
  },

  delete_notification: async ({ request, cookies }) => {
    const formData = await request.formData();
    const id = String(formData.get("id"));

    const requestInitOptions: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({ id }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(`${BASE_API_URI}/notifications/delete-notification`, requestInitOptions);

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

