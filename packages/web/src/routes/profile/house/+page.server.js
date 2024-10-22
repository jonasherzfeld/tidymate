import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';

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
    }
};
