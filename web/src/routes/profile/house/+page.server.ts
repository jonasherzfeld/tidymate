import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import {
  houseCitySchema,
  houseCountrySchema,
  houseJoinIdSchema,
  houseNamechema,
  houseRoomSchema
} from "$lib/utils/schemas";
import type { Cookies } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import { message, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

async function get_house_members(cookies: Cookies): Promise<User[]> {
  const requestInitOptions: RequestInit = {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${cookies.get("session")}`
    },
    signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
  };

  const res = await fetch(
    `${BASE_API_URI}/auth/get-house-members`,
    requestInitOptions
  );

  if (!res.ok) {
    return [] as User[];
  }

  try {
    const response = await res.json();
    return response.user_list as User[];
  } catch {
    return [] as User[];
  }
}

export const load = async ({ locals, cookies }) => {
  const nameForm = await superValidate(locals.house, zod(houseNamechema));
  const cityForm = await superValidate(locals.house, zod(houseCitySchema));
  const countryForm = await superValidate(
    locals.house,
    zod(houseCountrySchema)
  );
  const newRoomForm = await superValidate(zod(houseRoomSchema));
  const editRoomForm = await superValidate(zod(houseRoomSchema));
  const joinIdForm = await superValidate(locals.house, zod(houseJoinIdSchema));
  return {
    streamed: {
      user_list: get_house_members(cookies)
    },
    nameForm,
    cityForm,
    countryForm,
    newRoomForm,
    editRoomForm,
    joinIdForm,
    house: locals.house
  };
};

export const actions = {
  update_name: async ({ request, fetch, cookies }) => {
    const nameForm = await superValidate(request, zod(houseNamechema));

    if (!nameForm.valid) return fail(400, { nameForm });

    const requestInitOptions: RequestInit = {
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
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-house`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { nameForm, errors: response.error });
      } catch {
        return fail(500, { nameForm, errors: "Internal Error" });
      }
    }

    return message(nameForm, "Name Updated!");
  },

  update_city: async ({ request, fetch, cookies }) => {
    const cityForm = await superValidate(request, zod(houseCitySchema));

    if (!cityForm.valid) return fail(400, { cityForm });

    const requestInitOptions: RequestInit = {
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
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-house`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { cityForm, errors: response.error });
      } catch {
        return fail(500, { cityForm, errors: "Internal Error" });
      }
    }

    return message(cityForm, "City updated!");
  },

  update_country: async ({ request, fetch, cookies }) => {
    const countryForm = await superValidate(request, zod(houseCountrySchema));

    if (!countryForm.valid) return fail(400, { countryForm });

    const requestInitOptions: RequestInit = {
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
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/update-house`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { countryForm, errors: response.error });
      } catch {
        return fail(500, { countryForm, errors: "Internal Error" });
      }
    }

    return message(countryForm, "Country updated!");
  },

  create_room: async ({ request, fetch, cookies }) => {
    const roomForm = await superValidate(request, zod(houseRoomSchema));

    if (!roomForm.valid) return fail(400, { roomForm });

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        name: roomForm.data.room
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/create-room`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { roomForm, errors: response.error });
      } catch {
        return fail(500, { roomForm, errors: "Internal Error" });
      }
    }

    return { roomForm };
  },

  edit_room: async ({ request, fetch, cookies }) => {
    const roomForm = await superValidate(request, zod(houseRoomSchema));

    if (!roomForm.valid) return fail(400, { roomForm });

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        name: roomForm.data.room
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/create-room`,
      requestInitOptions
    );

    if (!res.ok) {
      try {
        const response = await res.json();
        return fail(400, { roomForm, errors: response.error });
      } catch {
        return fail(500, { roomForm, errors: "Internal Error" });
      }
    }

    return { roomForm };
  },

  toggle_join_id: async ({ request, locals, cookies }) => {
    const joinIdForm = await superValidate(request, zod(houseJoinIdSchema));

    const requestInitOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        house_id: locals.house.id
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    let route;
    if (locals.house.join_id) {
      requestInitOptions.method = "DELETE";
      route = `${BASE_API_URI}/auth/deactivate-join`;
    } else {
      route = `${BASE_API_URI}/auth/activate-join`;
    }
    const res = await fetch(route, requestInitOptions);

    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { joinIdForm, errors: response.error });
      }
      return { joinIdForm, join_id: response.join_id };
    } catch {
      return fail(500, { joinIdForm, errors: "Internal Error" });
    }
  },

  set_admin: async ({ request, fetch, cookies }) => {
    const formData = await request.formData();
    const user_id = String(formData.get("user_id"));
    const is_admin = Boolean(formData.get("is_admin"));

    const requestInitOptions: RequestInit = {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${cookies.get("session")}`
      },
      body: JSON.stringify({
        is_admin: is_admin
      }),
      signal: AbortSignal.timeout(FETCH_ABORT_TIMEOUT_MS)
    };

    const res = await fetch(
      `${BASE_API_URI}/auth/set-admin/${user_id}`,
      requestInitOptions
    );
    const response = await res.json();
    if (!res.ok) {
      return fail(400, { error: response.error });
    }
    try {
      const response = await res.json();
      if (!res.ok) {
        return fail(400, { errors: response.error });
      }
      return { user: response.user, success: res.ok };
    } catch {
      return fail(500, { errors: "Internal Error" });
    }
  }
};
