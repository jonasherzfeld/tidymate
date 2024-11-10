import { BASE_API_URI } from '$lib/utils/constants';
import { formatError } from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerHouseSchema } from '$lib/utils/schemas';

export async function load({ locals }) {
    // redirect user if not logged in
    if (locals.user && locals.house) {
        redirect(302, '/');
    }

    const register_house_form = await superValidate(locals.user, zod(registerHouseSchema));
    return {
        register_house_form
    };
}

export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @returns Error data or redirects user to the home page or the previous page
     */
    register_house: async ({ request, fetch, locals, cookies }) => {
        const form = await superValidate(request, zod(registerHouseSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const registrationBody = {
            house_name: form.data.house_name
        };

        const requestInitOptions: RequestInit = {
            method: 'POST',
            credentials: 'include',

            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify(registrationBody)
        };

        const res = await fetch(`${BASE_API_URI}/auth/register-house`, requestInitOptions);

        if (!res.ok) {
            const response = await res.json();
            const errors = formatError(response.error);
            return fail(400, { form, errors: errors });
        }

        redirect(303, '/');
    }
};
