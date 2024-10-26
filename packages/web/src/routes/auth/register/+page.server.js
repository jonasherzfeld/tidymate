import { BASE_API_URI } from '$lib/utils/constants';
import {
    formatError,
    isEmpty,
    isValidEmail,
    isValidPasswordMedium,
    isValidJoinId
} from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./user/$types').PageServerLoad} */
export async function load({ locals }) {
    // redirect user if logged in
    if (locals.user) {
        redirect(302, '/');
    }
}

/** @type {import('./user/$types').Actions} */
export const actions = {
    /**
     *
     * @param request - The request object
     * @param fetch - Fetch object from sveltekit
     * @returns Error data or redirects user to the home page or the previous page
     */
    register: async ({ request, fetch }) => {
        const formData = await request.formData();
        const email = String(formData.get('email'));
        const firstName = String(formData.get('first_name'));
        const lastName = String(formData.get('last_name'));
        const password = String(formData.get('password'));
        const confirmPassword = String(formData.get('confirm_password'));
        const joinId = String(formData.get('join_id'));
        const join_id_given = joinId !== 'null';

        // Some validations
        /** @type {Record<string, string>} */
        const fieldsError = {};
        if (!isValidEmail(email)) {
            fieldsError.email = 'That email address is invalid.';
        }
        if (!isValidPasswordMedium(password)) {
            fieldsError.password =
                'Password is not valid. Password must contain six characters or more and has at least one lowercase and one uppercase alphabetical character or has at least one lowercase and one numeric character or has at least one uppercase and one numeric character.';
        }
        if (confirmPassword.trim() !== password.trim()) {
            fieldsError.confirmPassword = 'Password and confirm password do not match.';
        }
        if (join_id_given && !isValidJoinId(joinId)) {
            fieldsError.joinId = 'Invalid Home ID.';
        }

        if (!isEmpty(fieldsError)) {
            return fail(400, { fieldsError: fieldsError });
        }
        const registrationBody = {
            email,
            first_name: firstName,
            last_name: lastName,
            join_id: joinId,
            password
        };

        /** @type {RequestInit} */
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
            return fail(400, { errors: errors });
        }

        if (!join_id_given) {
            redirect(303, '/auth/register/group');
        }
        redirect(303, '/');
    }
};
