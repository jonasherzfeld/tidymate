import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
    // redirect user if logged in
    if (locals.user && locals.house) {
        redirect(302, '/home');
    }
}
