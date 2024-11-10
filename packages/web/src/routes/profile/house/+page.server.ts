import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import {
    houseNamechema,
    houseCitySchema,
    houseCountrySchema,
    houseJoinIdSchema
} from '$lib/utils/schemas';

async function get_house_members(cookies: Cookies) {
    let requestInitOptions: RequestInit = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `session=${cookies.get('session')}`
        }
    };

    const res = await fetch(`${BASE_API_URI}/auth/get-house-members`, requestInitOptions);
    const response = await res.json();
    if (!res.ok) {
        return null;
    }
    return response.user_list;
}

export const load = async ({ locals, cookies }) => {
    const name_form = await superValidate(locals.house, zod(houseNamechema));
    const city_form = await superValidate(locals.house, zod(houseCitySchema));
    const country_form = await superValidate(locals.house, zod(houseCountrySchema));
    const joinid_form = await superValidate(locals.house, zod(houseJoinIdSchema));
    const user_list = async () => {
        return await get_house_members(cookies);
    };
    return {
        name_form,
        city_form,
        country_form,
        joinid_form,
        streamed: {
            user_list: user_list()
        }
    };
};

export const actions = {
    update_name: async ({ request, fetch, cookies }) => {
        const name_form = await superValidate(request, zod(houseNamechema));

        if (!name_form.valid) return fail(400, { name_form });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                name: name_form.data.name,
                city: '',
                country: ''
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-house`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { name_form, errors: response.error });
        }

        return message(name_form, 'Name Updated!');
    },

    update_city: async ({ request, fetch, cookies }) => {
        const city_form = await superValidate(request, zod(houseCitySchema));

        if (!city_form.valid) return fail(400, { city_form });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                name: '',
                city: city_form.data.city,
                country: ''
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-house`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { city_form, errors: response.error });
        }

        return message(city_form, 'City updated!');
    },

    update_country: async ({ request, fetch, cookies }) => {
        const country_form = await superValidate(request, zod(houseCountrySchema));

        if (!country_form.valid) return fail(400, { country_form });

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                name: '',
                city: '',
                country: country_form.data.country
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-house`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { country_form, errors: response.error });
        }

        return message(country_form, 'Country updated!');
    },

    toggle_join_id: async ({ request, locals, cookies }) => {
        const joinid_form = await superValidate(request, zod(houseJoinIdSchema));

        let requestInitOptions: RequestInit = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                house_id: locals.house.id
            })
        };

        let route;
        if (locals.house.join_id) {
            requestInitOptions.method = 'DELETE';
            route = `${BASE_API_URI}/auth/deactivate-join`;
        } else {
            route = `${BASE_API_URI}/auth/activate-join`;
        }
        const res = await fetch(route, requestInitOptions);

        const response = await res.json();
        if (!res.ok) {
            return fail(400, { joinid_form, errors: response.error });
        }
        return { joinid_form, join_id: response.join_id };
    },

    set_admin: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const user_id = String(formData.get('user_id'));
        const is_admin = Boolean(formData.get('is_admin'));

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                is_admin: is_admin
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/set-admin/${user_id}`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return { user: response.user, success: res.ok };
    }
};
