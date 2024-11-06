import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';

function sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


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

export const load = ( ({ cookies }) => {
    const user_list = get_house_members(cookies);

    return {
        streamed: {
            user_list: new Promise((resolve) => {
            user_list
              .then(data => {
                 return resolve(data)
              })
              .catch((error) => {
                return fail(400, { error: error });
              })
          })
        }
      }
});

export const actions = {
    update_house: async ({ request, fetch, cookies }) => {
        const formData = await request.formData();
        const name = String(formData.get('name'));
        const city = String(formData.get('city'));
        const country = String(formData.get('country'));

        let requestInitOptions: RequestInit = {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            },
            body: JSON.stringify({
                name: name === "null" ? '' : name,
                city: city === "null" ? '' : city,
                country: country === "null" ? '' : country
            })
        };

        const res = await fetch(`${BASE_API_URI}/auth/update-house`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return { user: response.user, success: res.ok };
    },

    toggle_join_id: async ({ locals, cookies }) => {
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
            return fail(400, { error: response.error });
        }

        return { join_id: response.join_id, success: res.ok };
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
