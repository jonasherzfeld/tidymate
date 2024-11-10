import { BASE_API_URI } from '$lib/utils/constants';
import { loginSchema } from '$lib/utils/schemas';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export async function load({ locals }) {
    // redirect user if logged in
    if (locals.user) {
        redirect(302, '/');
    }

    const login_form = await superValidate(locals.user, zod(loginSchema));
    return {
        login_form
    };
}

export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @param cookies - SvelteKit's cookie object
     * @returns Error data or redirects user to the home page or the previous page
     */
    login: async ({ request, fetch, cookies }) => {
        const form = await superValidate(request, zod(loginSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const requestInitOptions: RequestInit = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: form.data.email,
                password: form.data.password
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/login`, requestInitOptions);

        if (!res.ok) {
            try {
                const response = await res.json();
                return fail(400, { form, errors: response.error });
            } catch {
                return fail(500, { form });
            }
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

        redirect(303, form.data.next ? form.data.next : '/');
    }
};
