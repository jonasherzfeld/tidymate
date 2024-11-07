import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { z } from 'zod';

const email_schema = z.object({
    email: z.string().email()
});

const first_name_schema = z.object({
    first_name: z.string().min(3)
});

const last_name_schema = z.object({
    last_name: z.string().min(3)
});

export const load = async ({ locals }) => {
    const email_form = await superValidate(locals.user, zod(email_schema));
    const first_name_form = await superValidate(locals.user, zod(first_name_schema));
    const last_name_form = await superValidate(locals.user, zod(last_name_schema));

    return {
        email_form,
        first_name_form,
        last_name_form
    };
};

export const actions = {
    update_email: async ({ request, fetch, cookies }) => {
        const email_form = await superValidate(request, zod(email_schema));
        if (!email_form.valid) return fail(400, { email_form });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                email: email_form.data.email,
                first_name: '',
                last_name: ''
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return message(email_form, 'Email Updated!');
    },

    update_first_name: async ({ request, fetch, cookies }) => {
        const first_name_form = await superValidate(request, zod(first_name_schema));
        if (!first_name_form.valid) return fail(400, { first_name_form });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                email: '',
                first_name: first_name_form.data.first_name,
                last_name: ''
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return message(first_name_form, 'Email Updated!');
    },

    update_last_name: async ({ request, fetch, cookies }) => {
        const last_name_form = await superValidate(request, zod(last_name_schema));
        if (!last_name_form.valid) return fail(400, { last_name_form });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                email: '',
                first_name: '',
                last_name: last_name_form.data.last_name
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return message(last_name_form, 'Email Updated!');
    },

    upload_image: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();

        const requestInitOptions: RequestInit = {
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
        const requestInitOptions: RequestInit = {
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
