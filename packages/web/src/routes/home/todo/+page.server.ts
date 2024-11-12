import { BASE_API_URI } from '$lib/utils/constants';
import { fail } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Config } from '@sveltejs/adapter-vercel';

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
