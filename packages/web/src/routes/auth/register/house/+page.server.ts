import { BASE_API_URI } from "$lib/utils/constants";
import { registerHouseSchema } from "$lib/utils/schemas";
import { fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export async function load({ locals }) {
  // redirect user if not logged in
  if (locals.user && locals.house) {
    redirect(302, "/");
  }

  const register_house_form = await superValidate(zod(registerHouseSchema));
  return {
    register_house_form
  };
}

export const actions = {
  register_house: async ({ request, fetch, locals, cookies }) => {
    const form = await superValidate(request, zod(registerHouseSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const registrationBody = {
      house_name: form.data.house_name,
      house_city: form.data.house_country ? form.data.house_city : "",
      house_country: form.data.house_country ? form.data.house_country : ""
    };

    const requestInitOptions: RequestInit = {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify(registrationBody)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/register-house`,
      requestInitOptions
    );

    if (!res.ok) {
      const response = await res.json();
      return fail(400, { form, errors: response.error });
    }

    redirect(303, "/");
  }
};
