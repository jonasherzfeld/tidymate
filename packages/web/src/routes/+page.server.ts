import { redirect } from '@sveltejs/kit';
import type { Actions } from '@sveltejs/kit';

export async function load({ locals }) {
    // redirect user if logged in
    if (locals.user && locals.house) {
        redirect(302, '/home');
    }
}

export const actions: Actions = {
    set_theme: async ({ url, cookies }) => {
        console.log('set_theme', url.searchParams.get('theme'));
        const theme = url.searchParams.get('theme');
        const redirect_to = url.searchParams.get('redirectTo');

        if (theme) {
            cookies.set('colortheme', theme, {
                path: '/',
                maxAge: 60 * 60 * 24 * 365,
            });
        }
        redirect(303, redirect_to ?? '/');
    }
}