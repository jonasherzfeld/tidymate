import { BASE_API_URI, PROTECTED_ROUTES_HOUSE, PROTECTED_ROUTES_USER } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export function isAccessValid(path: String, user: User, house : House) {
    const is_protecte_route_user = PROTECTED_ROUTES_USER.filter((option) =>
        path.startsWith(option)
    );
    if (!user && is_protecte_route_user.length >= 1) {
        return false;
    }

    const is_protecte_route_house = PROTECTED_ROUTES_HOUSE.filter((option) =>
        path.startsWith(option)
    );
    if (!house && is_protecte_route_house.length >= 1) {
        return false;
    }

    return true;
}

export async function validateSession(event: RequestEvent) {
    // get cookies from browser
    const session = event.cookies.get('session');
    if (!session) {
        // if there is no session load page as normal
        return null;
    }

    // find the user based on the session
    const res = await event.fetch(`${BASE_API_URI}/auth/current-user`, {
        credentials: 'include',
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
    const new_theme = event.url.searchParams.get('theme');
    const cookie_theme = event.cookies.get("colortheme");
    if (new_theme) {
        theme = new_theme;
    } else if (cookie_theme) {
        theme = cookie_theme;
    }

    let add_theme_config = {};
    if (theme) {
        add_theme_config = {
            transformPageChunk: ({html}) =>
                html.replace('data-theme=""', `data-theme="${theme}"`)
            };
    };


    if (event.locals.user) {
        // if there is already a user in session load page as normal
        return await resolve(event, add_theme_config);
    }

    const res = await validateSession(event);
    if (res) {
        // if `user` exists set `events.local`
        const response = await res.json();
        event.locals.user = response.user;
        event.locals.house = response.house;
    }

    const is_valid = isAccessValid(event.url.pathname, event.locals.user, event.locals.house);
    if (!is_valid) {
        redirect(303, '/');
    }

    // load page as normal
    return await resolve(event, add_theme_config);
}
