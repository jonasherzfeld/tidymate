import {
  BASE_API_URI,
  PROTECTED_ROUTES_HOUSE,
  PROTECTED_ROUTES_USER
} from "$lib/utils/constants";
import type { RequestEvent } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { THEME_MAPPING } from "$lib/utils/constants";

export function isAccessValid(path: String, user: User, house: House): boolean {
  const isProtecteRouteByUser = PROTECTED_ROUTES_USER.filter((option) =>
    path.startsWith(option)
  );
  if (!user && isProtecteRouteByUser.length >= 1) {
    return false;
  }

  const isProtectedRouteByHouse = PROTECTED_ROUTES_HOUSE.filter((option) =>
    path.startsWith(option)
  );
  if (!house && isProtectedRouteByHouse.length >= 1) {
    return false;
  }

  return true;
}

export async function validateSession(
  event: RequestEvent
): Promise<Response | null> {
  // get cookies from browser
  const session = event.cookies.get("session");
  if (!session) {
    // if there is no session load page as normal
    return null;
  }

  // find the user based on the session
  const res = await event.fetch(`${BASE_API_URI}/auth/current-user`, {
    credentials: "include",
    headers: {
      Cookie: `session=${session}`
    }
  });

  if (!res.ok) {
    // if there is no session load page as normal
    return null;
  }
  return res;
}

export async function handle({ event, resolve }) {
  let theme: string | null = "light";
  const newTheme = event.url.searchParams.get("theme");
  const cookieTheme = event.cookies.get("colortheme");
  if (newTheme) {
    theme = newTheme;
  } else if (cookieTheme) {
    theme = cookieTheme;
  }

  let addThemeConfig = {};
  if (theme) {
    addThemeConfig = {
      transformPageChunk: ({ html }) =>
        html.replace('data-theme=""', `data-theme="${theme === "dark" ? THEME_MAPPING.dark : THEME_MAPPING.light}"`),
    };
  }

  if (event.locals.user) {
    // if there is already a user in session load page as normal
    return await resolve(event, addThemeConfig);
  }

  const res = await validateSession(event);
  if (res) {
    // if `user` exists set `events.local`
    const response = await res.json();
    event.locals.user = response.user;
    event.locals.house = response.house;
  }

  const isValid = isAccessValid(
    event.url.pathname,
    event.locals.user,
    event.locals.house
  );
  if (!isValid) {
    redirect(303, "/auth/login");
  }

  // load page as normal
  return await resolve(event, addThemeConfig);
}
