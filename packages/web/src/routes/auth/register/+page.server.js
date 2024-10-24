import { BASE_API_URI } from '$lib/utils/constants';
import { formatError, isEmpty, isValidEmail, isValidPasswordMedium } from '$lib/utils/helpers';
import { fail, redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
    // redirect user if logged in
    if (locals.user) {
        redirect(302, '/');
    }
}
