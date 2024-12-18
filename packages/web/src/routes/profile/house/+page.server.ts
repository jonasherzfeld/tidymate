import { BASE_API_URI } from "$lib/utils/constants";
import {
  houseCitySchema,
  houseCountrySchema,
  houseJoinIdSchema,
  houseNamechema
} from "$lib/utils/schemas";
import type { Config } from "@sveltejs/adapter-vercel";
import type { Cookies } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export const config: Config = {
  runtime: "edge"
};

async function get_house_members(cookies: Cookies): Promise<User[]> {
  let requestInitOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookies.get("session")}`
    }
  };

  const res = await fetch(
    `${BASE_API_URI}/auth/get-house-members`,
    requestInitOptions
  );
  const response = await res.json();
  if (!res.ok) {
    return [] as User[];
  }
  return response.user_list;
}

export const load = async ({ locals, cookies }) => {
  const nameForm = await superValidate(locals.house, zod(houseNamechema));
  const cityForm = await superValidate(locals.house, zod(houseCitySchema));
  const countryForm = await superValidate(
    locals.house,
    zod(houseCountrySchema)
  );
  const joinIdForm = await superValidate(locals.house, zod(houseJoinIdSchema));
  return {
    streamed: {
      user_list: get_house_members(cookies)
    },
    nameForm,
    cityForm,
    countryForm,
    joinIdForm
  };
};

export const actions = {
  update_name: async ({ request, fetch, cookies }) => {
    const nameForm = await superValidate(request, zod(houseNamechema));

    if (!nameForm.valid) return fail(400, { nameForm });

    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        name: nameForm.data.name,
        city: "",
        country: ""
      })
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-house`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { nameForm, errors: response.error });
    }

    return message(nameForm, "Name Updated!");
  },

  update_city: async ({ request, fetch, cookies }) => {
    const cityForm = await superValidate(request, zod(houseCitySchema));

    if (!cityForm.valid) return fail(400, { cityForm });

    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        name: "",
        city: cityForm.data.city,
        country: ""
      })
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-house`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { cityForm, errors: response.error });
    }

    return message(cityForm, "City updated!");
  },

  update_country: async ({ request, fetch, cookies }) => {
    const countryForm = await superValidate(request, zod(houseCountrySchema));

    if (!countryForm.valid) return fail(400, { countryForm });

    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        name: "",
        city: "",
        country: countryForm.data.country
      })
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-house`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { countryForm, errors: response.error });
    }

    return message(countryForm, "Country updated!");
  },

  toggle_join_id: async ({ request, locals, cookies }) => {
    const joinIdForm = await superValidate(request, zod(houseJoinIdSchema));

    let requestInitOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        house_id: locals.house.id
      })
    };

    let route;
    if (locals.house.join_id) {
      requestInitOptions.method = "DELETE";
      route = `${BASE_API_URI}/auth/deactivate-join`;
    } else {
      route = `${BASE_API_URI}/auth/activate-join`;
    }
    const res = await fetch(route, requestInitOptions);

    const response = await res.json();
    if (!res.ok) {
      return fail(400, { joinIdForm, errors: response.error });
    }
    return { joinIdForm, join_id: response.join_id };
  },

  set_admin: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const user_id = String(formData.get("user_id"));
    const is_admin = Boolean(formData.get("is_admin"));

    let requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        is_admin: is_admin
      })
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/set-admin/${user_id}`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { error: response.error });
    }

    return { user: response.user, success: res.ok };
  }
};
