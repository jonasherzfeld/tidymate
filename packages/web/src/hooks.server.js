import { BASE_API_URI, PROTECTED_ROUTES_HOUSE, PROTECTED_ROUTES_USER } from '$lib/utils/constants';
import { redirect } from '@sveltejs/kit';

export function isAccessValid(path, user, house) {
    const is_protecte_route_user = PROTECTED_ROUTES_USER.filter((option) =>
        path.startsWith(option)
    );
    console.log('is_protecte_route_user', is_protecte_route_user);
    if (!user && is_protecte_route_user.length >= 1) {
        return false;
    }

    const is_protecte_route_house = PROTECTED_ROUTES_HOUSE.filter((option) =>
        path.startsWith(option)
    );
    console.log('is_protecte_route_house', is_protecte_route_house);
    if (!house && is_protecte_route_house.length >= 1) {
        return false;
    }
    console.log('is_protecte_route_house', is_protecte_route_house);

    return true;
}

export async function validateSession(event, resolve) {
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

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
    console.log('event.url.pathname', event.url.pathname);
    if (event.locals.user) {
        // if there is already a user  in session load page as normal
        return await resolve(event);
    }

    const res = await validateSession(event, resolve);
    if (res) {
        // if `user` exists set `events.local`
        const response = await res.json();
        event.locals.user = response.user;
        event.locals.house = response.house;
    }

    const is_valid = isAccessValid(event.url.pathname, event.locals.user, event.locals.house);
    if (!is_valid) {
        throw redirect(303, '/');
    }

    // load page as normal
    return await resolve(event);
}
