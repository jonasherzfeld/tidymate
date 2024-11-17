<script lang="ts">
    import TodoItem from '$lib/components/TodoItem.svelte';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import type { PageData } from './$types.js';
    import { sort } from '$lib/utils/helpers';
    import { Toggle } from '$lib/components/ui/toggle/index.js';
    import DoneAllIcon from 'virtual:icons/mdi/done-all';
    import SortDropDown from '$lib/components/SortDropDown.svelte';
    import FilterDropDown from '$lib/components/FilterDropDown.svelte';

    type SearchableTodo = Todo & { searchTerms: string };

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === '-') {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
            return result * sortOrder;
        };
    }

    let { data }: { data: PageData } = $props();
    let sortKey: string = $state('-created_on');
    let filterKey: string = $state('assignee');
    let filterValue: string[] = $state([]);
    let showComplete: boolean = $state(false);
    let newTodoData: string = $state('');
    let fullTodoList: SearchableTodo[] = $state([]);
    let removedList: string[] = $state([]);
    let searchText: string = $state('');
    const searchHandler = () => {
        const searchTerm = searchText.toLowerCase() || '';
        return fullTodoList.filter((item) => {
            const removed = removedList.includes(item.id);
            let filtered = true;
            if (filterKey && filterValue.length > 0) {
                filtered = filterValue.includes(item[filterKey]);
            }
            return !removed && filtered && item.searchTerms.toLowerCase().includes(searchTerm);
        });
    };
    let filteredTodoList: Todo[] = $derived(
        searchHandler().sort(dynamicSort(sortKey)).sort(dynamicSort('done'))
    );

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
        sort(fullTodoList, 'done');
    });
</script>

<div class="flex flex-col flex-1 gap-3 min-w-full h-full">
    <div class="flex flex-row gap-2">
        <FilterDropDown bind:filterValue />
        <SortDropDown bind:sortKey />
        <Toggle variant="outline" size="sm" aria-label="toggle" bind:pressed={showComplete}
            ><DoneAllIcon class="h-4 w-4" /></Toggle
        >

        <label class="input input-bordered input-sm flex grow items-center gap-2">
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
    <div class=" flex flex-col flex-1">
        <div class="card bg-base-200 rounded-lg">
            {#await data.streamed.todo_list}
                <div class="flex w-full flex-col gap-4">
                    <div class="skeleton h-32 w-full"></div>
                    <div class="skeleton h-4 w-28"></div>
                    <div class="skeleton h-4 w-full"></div>
                    <div class="skeleton h-4 w-full"></div>
                </div>
            {:then}
                <div class="flex flex-col flex-1">
                    {#each filteredTodoList as todo, id}
                        {#if !todo.done || (todo.done && showComplete)}
                            {#if id !== 0}
                                <div class="divider m-0 p-0 h-1"></div>
                            {/if}
                            <TodoItem {...todo} bind:removedList />
                        {/if}
                    {/each}
                </div>
            {:catch error}
                <p>{error.message}</p>
            {/await}
        </div>
    </div>
    <div class="flex card bg-base-300 rounded-lg p-2 sticky bottom-3">
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
    </div>
</div>
