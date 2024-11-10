import { BASE_API_URI } from '$lib/utils/constants';
import { formatError } from '$lib/utils/helpers';
import { registerSchema } from '$lib/utils/schemas';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load({ locals }) {
    // redirect user if logged in
    if (locals.user) {
        redirect(302, '/');
    }

    const register_form = await superValidate(locals.user, zod(registerSchema));
    return {
        register_form
    };
}

/** @type {import('./user/$types').Actions} */
export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @returns Error data or redirects user to the home page or the previous page
     */
    register: async ({ request, fetch, cookies }) => {
        const form = await superValidate(request, zod(registerSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const registrationBody = {
            email: form.data.email,
            first_name: form.data.first_name,
            last_name: form.data.last_name,
            join_id: form.data.join_id ? form.data.join_id : '',
            password: form.data.password
        };

        const requestInitOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationBody)
        };

        const res = await fetch(`${BASE_API_URI}/auth/register`, requestInitOptions);

        const response = await res.json();
        if (!res.ok) {
            const errors = formatError(response.error);
            return fail(400, { form, errors: errors });
        }

        if (res.headers.has('Set-Cookie')) {
            const sessionID = Object.fromEntries(res.headers)
                ['set-cookie'].split(';')[0]
                .split(/=(.*)/s)[1];

            const path = Object.fromEntries(res.headers)['set-cookie'].split(';')[2].split('=')[1];
            const maxAge = 60 * 60 * 24 * 30;

            cookies.set('session', sessionID, {
                httpOnly: true,
                sameSite: 'lax',
                path: path,
                secure: false,
                maxAge: maxAge
            });
        }

        if (!form.data.join_id) {
            redirect(303, '/auth/register/group');
        }
        redirect(303, '/');
    }
};
