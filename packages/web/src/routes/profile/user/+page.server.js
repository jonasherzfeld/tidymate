import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';

export const actions = {
    update_first_name: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const first_name = String(formData.get('first_name'));

        let requestInitOptions = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                first_name: first_name
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return { user: response.user, success: res.ok };
    },

    update_last_name: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const last_name = String(formData.get('last_name'));

        let requestInitOptions = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                last_name: last_name
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return { user: response.user, success: res.ok };
    },

    upload_image: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();

        /** @type {RequestInit} */
        const requestInitOptions = {
            method: 'POST',
            headers: {
                Cookie: `session=${cookies.get('session')}`
            },
            body: formData
        };

        const res = await fetch(`${BASE_API_URI}/file/upload`, requestInitOptions);

        if (!res.ok) {
            const response = await res.json();
            return fail(400, { error: response.error });
        }

        const response = await res.json();

        return {
            success: true,
            thumbnail: response.thumbnail
        };
    },

    delete_image: async ({ fetch, cookies }) => {
        /** @type {RequestInit} */
        const requestInitOptions = {
            method: 'DELETE',
            headers: {
                Cookie: `session=${cookies.get('session')}`
            }
        };

        const res = await fetch(`${BASE_API_URI}/file/delete`, requestInitOptions);

        if (!res.ok) {
            const response = await res.json();
            return fail(400, { errors: response.error });
        }

        return {
            success: true,
            thumbnail: ''
        };
    }
};
