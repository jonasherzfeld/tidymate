import { BASE_API_URI } from '$lib/utils/constants';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (event.locals.user) {
		// if there is already a user  in session load page as normal
		return await resolve(event);
	}
	// get cookies from browser
	const session = event.cookies.get('session');

	if (!session) {
		// if there is no session load page as normal
		return await resolve(event);
	}

	// find the user based on the session
	const res = await event.fetch(`${BASE_API_URI}/auth/current-user`, {
		credentials: 'include',
		headers: {
			Cookie: `session=${session}`
		}
	});

	if (!res.ok) {
		// if there is no session load page as normal
		return await resolve(event);
	}

	// if `user` exists set `events.local`
	const response = await res.json();
	event.locals.user = response;

	// load page as normal
	return await resolve(event);
}
