import { BASE_API_URI } from '$lib/utils/constants';
import { formatError, isEmpty } from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    // redirect user if not logged in
    if (locals.user && locals.house) {
        throw redirect(302, '/');
    }
}

/** @type {import('./$types').Actions} */
export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @returns Error data or redirects user to the home page or the previous page
     */
    register_house: async ({ request, fetch, locals }) => {
        const formData = await request.formData();
        const houseName = String(formData.get('house_name'));

        // Some validations
        /** @type {Record<string, string>} */
        const fieldsError = {};

        if (!isEmpty(fieldsError)) {
            return fail(400, { fieldsError: fieldsError });
        }
        console.log(locals.user);
        const registrationBody = {
            house_name: houseName
        };

        /** @type {RequestInit} */
        const requestInitOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationBody)
        };

        const res = await fetch(`${BASE_API_URI}/auth/register_house`, requestInitOptions);

        if (!res.ok) {
            const response = await res.json();
            const errors = formatError(response.error);
            return fail(400, { errors: errors });
        }

        throw redirect(303, '/');
    }
};
