import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals }) {
	// redirect user if not logged in
	if (!locals.user) {
		throw redirect(302, `/auth/login?next=/home/chores`);
	}
}
