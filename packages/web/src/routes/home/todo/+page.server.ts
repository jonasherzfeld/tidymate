import { BASE_API_URI } from '$lib/utils/constants';
import type { Cookies } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';
import { fail } from '@sveltejs/kit';

export const config: Config = {
    runtime: 'edge'
};

async function get_todos(cookies: Cookies) {
    let requestInitOptions: RequestInit = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `session=${cookies.get('session')}`
        }
    };

    const res = await fetch(`${BASE_API_URI}/items/get-todos`, requestInitOptions);
    const response = await res.json();
    if (!res.ok) {
        return null;
    }
    return response.todos;
}

export const load = async ({ cookies }) => {
    return {
        streamed: {
            todo_list: get_todos(cookies)
        }
    };
};

export const actions = {
    delete_todo: async ({ request, fetch, cookies }) => {
        const params = new URLSearchParams(request.url);
        const todo_id = params.getAll('id')[0];

        if (!todo_id) {
            return fail(400, { error: 'Invalid Todo ID' });
        }

        let requestInitOptions: RequestInit = {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                Cookie: `session=${cookies.get('session')}`
            }
        };

        const res = await fetch(`${BASE_API_URI}/items/delete-todo/${todo_id}`, requestInitOptions);
        const response = await res.json();
        if (!res.ok) {
            return fail(400, { error: response.error });
        }

        return { todo_id: todo_id };
    }
};
