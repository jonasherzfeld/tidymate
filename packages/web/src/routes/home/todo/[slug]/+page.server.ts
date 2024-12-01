import { BASE_API_URI } from '$lib/utils/constants';
import type { Config } from '@sveltejs/adapter-vercel';
import type { Cookies } from '@sveltejs/kit';
import { todoItemSchema } from '$lib/utils/schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';

export const config: Config = {
    runtime: 'edge'
};

async function get_todo(todoId: string, cookies: Cookies): Promise<Todo> {
    let requestInitOptions: RequestInit = {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Cookie: `session=${cookies.get('session')}`
        }
    };

    const res = await fetch(`${BASE_API_URI}/items/get-todo/${todoId}`, requestInitOptions);
    const response = await res.json();
    if (!res.ok) {
        return null;
    }
    return response.todo as Todo;
}

export const load = async ({ params, cookies }) => {
    const todoItemForm = await superValidate(zod(todoItemSchema));

    return {
        todo: await get_todo(params.slug, cookies),
        todoItemForm
    };
};
