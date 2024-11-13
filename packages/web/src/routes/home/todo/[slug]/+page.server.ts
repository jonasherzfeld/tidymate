import type { Config } from '@sveltejs/adapter-vercel';
import { todoItemSchema } from '$lib/utils/schemas';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const config: Config = {
    runtime: 'edge'
};

export const load = async ({ params }) => {
    const todo_item_form = await superValidate(zod(todoItemSchema));

    return {
        slug: params.slug,
        todo_item_form
    };
};
