import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

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
  }
};
