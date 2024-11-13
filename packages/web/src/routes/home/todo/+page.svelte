<script lang="ts">
    import TodoItem from '$lib/components/TodoItem.svelte';
    import AddIcon from 'virtual:icons/fluent/add-12-filled';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';

    let { data } = $props();
    let fullTodoList = $state([]);
    let removedList: string[] = $state([]);
    let searchText = $state('');
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
                removedList.push(result.data.todo_id);
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

<div class="flex flex-col flex-1 min-w-full">
    <div class="flex mb-6 relative items-center justify-center">
        <div class="flex justify-center items-center w-fit">
            <h1 class="text-5xl font-bold">To-Dos</h1>
        </div>
        <div class="absolute right-3 items-center">
            <a href="/home/todo/add"
                ><button class="btn btn-circle btn-info btn-outline"><AddIcon /></button></a
            >
        </div>
    </div>
    <div class="flex flex-col flex-1 gap-3 min-w-full">
        <input type="search" placeholder="Search" bind:value={searchText} />
        {#await data.streamed.todo_list}
            <div class="flex w-full flex-col gap-4">
                <div class="skeleton h-32 w-full"></div>
                <div class="skeleton h-4 w-28"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
            </div>
        {:then}
            <form method="POST" use:enhance={handleSubmit}>
                <div class=" flex flex-col flex-1 gap-2 p-3 card bg-base-300">
                    {#each filteredTodoList as todo}
                        <TodoItem {todo} />
                    {/each}
                </div>
            </form>
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </div>
</div>
