import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { emailSchema, firstNameSchema, lastNameSchema } from '$lib/utils/schemas';
import type { Config } from '@sveltejs/adapter-vercel';
import type { PageServerLoad } from './$types.js';

export const config: Config = {
    runtime: 'edge'
};

export const load: PageServerLoad = async ({ locals }) => {
    const emailForm = await superValidate(locals.user, zod(emailSchema));
    const firstNameForm = await superValidate(locals.user, zod(firstNameSchema));
    const lastNameForm = await superValidate(locals.user, zod(lastNameSchema));

    return {
        emailForm,
        firstNameForm,
        lastNameForm
    };
};

export const actions = {
    update_email: async ({ request, fetch, cookies }) => {
        const emailForm = await superValidate(request, zod(emailSchema));
        if (!emailForm.valid) return fail(400, { emailForm });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                email: emailForm.data.email,
                first_name: '',
                last_name: ''
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { emailForm, errors: response.error });
        }

        return message(emailForm, 'Email Updated!');
    },

    update_first_name: async ({ request, fetch, cookies }) => {
        const firstNameForm = await superValidate(request, zod(firstNameSchema));
        if (!firstNameForm.valid) return fail(400, { firstNameForm });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                email: '',
                first_name: firstNameForm.data.first_name,
                last_name: ''
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { firstNameForm, errors: response.error });
        }

        return message(firstNameForm, 'Email Updated!');
    },

    update_last_name: async ({ request, fetch, cookies }) => {
        const lastNameForm = await superValidate(request, zod(lastNameSchema));
        if (!lastNameForm.valid) return fail(400, { lastNameForm });

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
                last_name: lastNameForm.data.last_name
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-user`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { lastNameForm, errors: response.error });
        }

        return message(lastNameForm, 'Email Updated!');
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
            return fail(400, { errors: response.error });
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
