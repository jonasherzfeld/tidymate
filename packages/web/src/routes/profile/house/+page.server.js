import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';

export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @returns Error data or redirects user to the home page or the previous page
     */
    activate_join: async ({ cookies }) => {
        const requestInitOptions = {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `sessionid=${cookies.get('session')}`
            }
        };

        const res = await fetch(`${BASE_API_URI}/auth/activate_join`, requestInitOptions);

        const response = await res.json();
        if (!res.ok) {
            const errors = [];
            errors.push({ error: response.error, id: 0 });
            return fail(400, { errors: errors });
        }

        return { name: response.join_id, success: res.ok };
    }
};
