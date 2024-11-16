<script lang="ts">
    import TodoItem from '$lib/components/TodoItem.svelte';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import type { PageData } from './$types.js';

    type SearchableTodo = Todo & { searchTerms: string };

    let { data }: { data: PageData } = $props();
    let newTodoData: string = $state('');
    let fullTodoList: SearchableTodo[] = $state([]);
    let removedList: string[] = $state([]);
    let searchText: string = $state('');
    const searchHandler = () => {
        const searchTerm = searchText.toLowerCase() || '';
        return fullTodoList.filter((item) => {
            const removed = removedList.includes(item.id);
            return !removed && item.searchTerms.toLowerCase().includes(searchTerm);
        });
    };
    let filteredTodoList: Todo[] = $derived(searchHandler());

    const handleSubmit = async ({}) => {
        return async ({ result, update }) => {
            if (result.status === 200) {
                newTodoData = '';
                const newTodo = result.data.todo;
                const newSearchItem = {
                    ...newTodo,
                    searchTerms: `${newTodo.data} ${newTodo.assignee} ${newTodo.tags.join(' ')}`
                };
                fullTodoList.push(newSearchItem);
            } else {
                update();
            }
        };
    };

    onMount(async () => {
        const getTodoList = async () => {
            const list = await data.streamed.todo_list;
            const filtered = list.map((todo: Todo) => ({
                ...todo,
                searchTerms: `${todo.data} ${todo.assignee} ${todo.tags.join(' ')}`
            }));
            fullTodoList = filtered;
        };
        await getTodoList();
    });
</script>

<div class="flex flex-col flex-1 gap-3 min-w-full">
    <form method="POST" use:enhance={handleSubmit}>
        <div class="flex flex-row flex-wrap gap-2">
            <input
                type="text"
                class="input input-bordered grow"
                placeholder="Create to-do"
                name="todo_data"
                bind:value={newTodoData}
            />
            <button formaction="?/create_todo" class="btn btn-primary">Add</button>
        </div>
    </form>
    <div>
        <label class="input input-bordered input-sm flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="h-4 w-4 opacity-70"
            >
                <path
                    fill-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                    clip-rule="evenodd"
                />
            </svg>
            <input type="search" class="grow" placeholder="Search" bind:value={searchText} />
        </label>
    </div>
    {#await data.streamed.todo_list}
        <div class="flex w-full flex-col gap-4">
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
        </div>
    {:then}
        <div class="flex flex-col flex-1 gap-2">
            {#each filteredTodoList as todo}
                {#if !todo.done}
                    <TodoItem {todo} bind:removedList />
                {/if}
            {/each}
        </div>
        <details class="collapse collapse-arrow rounded-none m-0 p-0 mt-2">
            <summary
                class="collapse-title text-start text-md font-sans pt-4 mb-2 rounded-none border-b-2"
                >Completed</summary
            >
            <div class="flex flex-col flex-1 gap-2">
                {#each filteredTodoList as todo}
                    {#if todo.done}
                        <TodoItem {todo} bind:removedList />
                    {/if}
                {/each}
            </div>
        </details>
    {:catch error}
        <p>{error.message}</p>
    {/await}
</div>
