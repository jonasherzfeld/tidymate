import { BASE_API_URI } from '$lib/utils/constants';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ fetch, cookies }) => {
        const requestInitOptions: RequestInit = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `sessionid=${cookies.get('session')}`
            }
        };

        const res = await fetch(`${BASE_API_URI}/auth/logout`, requestInitOptions);

        if (!res.ok) {
            const response = await res.json();
            return fail(400, { errors: response.error });
        }

        // eat the cookie
        cookies.delete('session', { path: '/' });

        // redirect the user
        redirect(302, '/auth/login');
    }
};
