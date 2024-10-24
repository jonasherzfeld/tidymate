import { BASE_API_URI } from '$lib/utils/constants';
import { formatError } from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    // redirect user if logged in
    if (locals.user) {
        throw redirect(302, '/');
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @param cookies - SvelteKit's cookie object
     * @returns Error data or redirects user to the home page or the previous page
     */
    login: async ({ request, fetch, cookies }) => {
        const data = await request.formData();
        const email = String(data.get('email'));
        const password = String(data.get('password'));
        const next = String(data.get('next'));

        /** @type {RequestInit} */
        const requestInitOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        };

        console.log(`${BASE_API_URI}/auth/login`);
        const res = await fetch(`${BASE_API_URI}/auth/login`, requestInitOptions);

        if (!res.ok) {
            const response = await res.json();
            const errors = formatError(response.error);
            return fail(400, { errors: errors });
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

        throw redirect(303, next || '/');
        //return { success: true };
        // then in +page.svelte
        // 	{#if form?.success}
        // <p>Successfully logged in! Welcome back, {data.user.name}</p>
        // {/if}
    }
};
