import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';

async function get_user_by_id(user_id, cookies) {
    let requestInitOptions = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `session=${cookies.get('session')}`
        }
    };

    const res = await fetch(`${BASE_API_URI}/auth/get-user/${user_id}`, requestInitOptions);
    const response = await res.json();
    if (!res.ok) {
        return null;
    }
    return response.user;
}

/** @type {import('./user/$types').PageServerLoad} */
export async function load({ locals, cookies }) {
    let user_list = [];
    for (const member_id of locals.house.members) {
        let user = await get_user_by_id(member_id, cookies);
        if (user) {
            user_list.push(user);
        }
    }
    return { user_list: user_list };
}

export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @returns Error data or redirects user to the home page or the previous page
     */
    toggle_join_id: async ({ locals, cookies }) => {
        let requestInitOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                house_id: locals.house.id
            })
        };

        let route;
        if (locals.house.join_id) {
            requestInitOptions.method = 'DELETE';
            route = `${BASE_API_URI}/auth/deactivate_join`;
        } else {
            route = `${BASE_API_URI}/auth/activate_join`;
        }
        const res = await fetch(route, requestInitOptions);

        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return { join_id: response.join_id, success: res.ok };
    },

    set_admin: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const user_id = String(formData.get('user_id'));
        const is_admin = Boolean(formData.get('is_admin'));

        let requestInitOptions = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                is_admin: is_admin
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user/${user_id}`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return { user: response.user, success: res.ok };
    }
};
