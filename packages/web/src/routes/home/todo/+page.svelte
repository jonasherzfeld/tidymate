<script lang="ts">
    import type { PageData } from './$types.js';
    import { enhance } from '$app/forms';
    import { onMount } from 'svelte';
    import { TodoListHandler } from '$lib/utils/todo-list-handler';
    import { initializeFilterValues } from '$lib/utils/helpers';
    import TodoItem from '$lib/components/TodoItem.svelte';
    import SortDropDown from '$lib/components/SortDropDown.svelte';
    import FilterDropDown from '$lib/components/FilterDropDown.svelte';
    import ReloadIcon from 'virtual:icons/fluent/arrow-clockwise-24-filled';
    import TagIcon from 'virtual:icons/fluent/tag-16-filled';
    import UserIcon from 'virtual:icons/fluent/person-24-filled';
    import DoneAllIcon from 'virtual:icons/mdi/done-all';
    import SearchIcon from 'virtual:icons/mdi/search';
    import ToggleButton from '$lib/components/ToggleButton.svelte';

    let { data }: { data: PageData } = $props();

    let sortKey: keyof SearchableTodo | `-${string & keyof SearchableTodo}` = $state('created_on');
    let sortOrder: boolean = $state(true);

    let filters: FilterDescription<Todo>[] = $state([
        { property: 'assignee', values: [], filterValues: [] },
        { property: 'tags', values: [], filterValues: [] }
    ]);

    let showComplete: boolean = $state(false);
    let newTodoData: string = $state('');
    let removedList: string[] = $state([]);
    let searchText: string = $state('');

    let todoListHandler: TodoListHandler = $state(new TodoListHandler());
    let todoList: Todo[] = $derived(
        todoListHandler.getSortedAndFilteredList(
            searchText,
            sortOrder,
            sortKey,
            filters,
            removedList
        )
    );

    const handleSubmit = async ({}) => {
        return async ({ result, update }) => {
            if (result.status === 200) {
                newTodoData = '';
                todoListHandler = new TodoListHandler([
                    ...todoListHandler.getFullList(),
                    result.data.todo
                ]);
            } else {
                update();
            }
        };
    };

    onMount(async () => {
        todoListHandler = new TodoListHandler(await data.streamed.todo_list);
        initializeFilterValues<Todo>(filters, todoListHandler.getFullList());
    });
</script>

<div class="flex flex-col gap-3 min-w-full min-h-screen justify-between">
    <div class="flex flex-col gap-3">
        <div>
            <label class="input input-bordered input-sm flex grow items-center gap-2">
                <SearchIcon />
                <input type="search" class="grow" placeholder="Search" bind:value={searchText} />
            </label>
        </div>
        <div class="flex flex-row gap-2 w-full justify-between">
            <div>
                <a href="/home/todo" data-sveltekit-reload>
                    <button class="btn btn-sm shadow-sm btn-outline rounded-md border-neutral-200">
                        <ReloadIcon class="h-4 w-4" />
                    </button>
                </a>
            </div>
            <div class="flex flex-row gap-2 w-full justify-end">
                <FilterDropDown
                    title="Tags"
                    values={filters[1].values}
                    bind:filterValue={filters[1].filterValues}
                >
                    <TagIcon class="h-4 w-4" />
                </FilterDropDown>
                <FilterDropDown
                    title="Assignee"
                    values={filters[0].values}
                    bind:filterValue={filters[0].filterValues}
                >
                    <UserIcon class="h-4 w-4" />
                </FilterDropDown>

                <SortDropDown bind:sortKey bind:sortOrder />
                <ToggleButton
                    className={`btn shadow-sm btn-outline rounded-md btn-sm border-neutral-200 ${showComplete ? 'bg-accent' : ''}`}
                    bind:isToggled={showComplete}
                >
                    <DoneAllIcon class="h-4 w-4" />
                </ToggleButton>
            </div>
        </div>
        <div class="flex flex-col">
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
                        {#each todoList as todo, id}
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
    </div>
    <div class="flex card bg-base-300 rounded-lg border-2 border-base-100 p-2 sticky bottom-3">
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
