import { BASE_API_URI, FETCH_ABORT_TIMEOUT_MS } from "$lib/utils/constants";
import {
  emailSchema,
  firstNameSchema,
  houseCitySchema,
  houseCountrySchema,
  houseJoinIdSchema,
  houseNamechema,
  lastNameSchema
} from "$lib/utils/schemas";
import type { Cookies } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

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
  const res = await fetch(`${BASE_API_URI}/auth/get-house-members`, requestInitOptions);
  if (!res.ok) return [] as User[];
  try {
    const response = await res.json();
    return response.user_list as User[];
  } catch {
    return [] as User[];
  }
}

export const load: PageServerLoad = async ({ locals, cookies }) => {
  const [emailForm, firstNameForm, lastNameForm, nameForm, cityForm, countryForm, joinIdForm] =
    await Promise.all([
      superValidate(locals.user, zod(emailSchema)),
      superValidate(locals.user, zod(firstNameSchema)),
      superValidate(locals.user, zod(lastNameSchema)),
      superValidate(locals.house, zod(houseNamechema)),
      superValidate(locals.house, zod(houseCitySchema)),
      superValidate(locals.house, zod(houseCountrySchema)),
      superValidate(locals.house, zod(houseJoinIdSchema))
    ]);

  return {
    streamed: { user_list: get_house_members(cookies) },
    emailForm,
    firstNameForm,
    lastNameForm,
    nameForm,
    cityForm,
    countryForm,
    joinIdForm
  };
};
