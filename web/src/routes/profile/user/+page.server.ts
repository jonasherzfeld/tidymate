import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema
} from "$lib/utils/schemas";
import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ locals }) => {
  const emailForm = await superValidate(locals.user, zod(emailSchema));
  const firstNameForm = await superValidate(locals.user, zod(firstNameSchema));
  const lastNameForm = await superValidate(locals.user, zod(lastNameSchema));

  return {
    emailForm,
    firstNameForm,
    lastNameForm
  };
};

export const actions = {
  update_email: async ({ request, fetch, cookies }) => {
    const emailForm = await superValidate(request, zod(emailSchema));
    if (!emailForm.valid) return fail(400, { emailForm });

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        email: emailForm.data.email,
        first_name: "",
        last_name: ""
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-user`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { emailForm, errors: response.error });
      } catch {
        return fail(500, { emailForm, errors: "Internal Error" });
      }
    }

    return message(emailForm, "Email Updated!");
  },

  update_first_name: async ({ request, fetch, cookies }) => {
    const firstNameForm = await superValidate(request, zod(firstNameSchema));
    if (!firstNameForm.valid) return fail(400, { firstNameForm });

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        email: "",
        first_name: firstNameForm.data.first_name,
        last_name: ""
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-user`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { firstNameForm, errors: response.error });
      } catch {
        return fail(500, { firstNameForm, errors: "Internal Error" });
      }
    }

    return message(firstNameForm, "Email Updated!");
  },

  update_last_name: async ({ request, fetch, cookies }) => {
    const lastNameForm = await superValidate(request, zod(lastNameSchema));
    if (!lastNameForm.valid) return fail(400, { lastNameForm });

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        email: "",
        first_name: "",
        last_name: lastNameForm.data.last_name
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-user`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { lastNameForm, errors: response.error });
      } catch {
        return fail(500, { lastNameForm, errors: "Internal Error" });
      }
    }

    return message(lastNameForm, "Email Updated!");
  },

  upload_image: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();

    const requestInitOptions: RequestInit = {
      method: "POST",
      headers: {
        Cookie: `session=${cookies.get("session")}`
      },
      body: formData,
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(`${BASE_API_URI}/file/upload`, requestInitOptions);

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return {
        success: true,
        thumbnail: response.thumbnail
      };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  },

  delete_image: async ({ fetch, cookies }) => {
    const requestInitOptions: RequestInit = {
      method: "DELETE",
      headers: {
        Cookie: `session=${cookies.get("session")}`
      },
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(`${BASE_API_URI}/file/delete`, requestInitOptions);

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return {
        success: true,
        thumbnail: ""
      };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }
};
