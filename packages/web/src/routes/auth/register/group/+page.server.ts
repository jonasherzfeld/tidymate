import { BASE_API_URI } from '$lib/utils/constants';
import { formatError, isEmpty } from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';

export async function load({ locals }) {
    // redirect user if not logged in
    if (locals.user && locals.house) {
        redirect(302, '/');
    }
}

export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @returns Error data or redirects user to the home page or the previous page
     */
    register_house: async ({ request, fetch, locals, cookies }) => {
        const formData = await request.formData();
        const houseName = String(formData.get('house_name'));

        // Some validations
        const fieldsError: FieldsError = {};

        if (!isEmpty(fieldsError)) {
            return fail(400, { fieldsError: fieldsError });
        }
        const registrationBody = {
            house_name: houseName
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
            return fail(400, { errors: errors });
        }

        redirect(303, '/');
    }
};
