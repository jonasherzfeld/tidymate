<script lang="ts">
  import type { PageData } from "./$types.js";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import TodoItem from "$lib/components/TodoItem.svelte";
  import SortDropDown from "$lib/components/SortDropDown.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import {
    ReloadIcon,
    UserIcon,
    DoneAllIcon,
    SearchIcon
  } from "$lib/utils/icons";
  import ToggleButton from "$lib/components/ToggleButton.svelte";
  import { getContext } from "svelte";
  import {
    initializeFilterValues,
    getUsernameById,
    byPropertiesOf
  } from "$lib/utils/helpers";

  let { data }: { data: PageData } = $props();
  let serverErrors: string = $state("");
  let showComplete: boolean = $state(false);
  let newTodoData: string = $state("");
  const isWebApp: boolean = getContext("webapp");

  const todoState: ItemListState<Todo> = $state({
    items: [],
    filters: [{ property: "assignee", values: [], selection: [] }],
    searchText: "",
    sortBy: "created_on",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  let nameFilterFn: (value: string) => string | undefined = (value) => {
    return getUsernameById(value, data.house.members);
  };

  const handleSubmit = async ({}) => {
    return async ({ result, update }) => {
      serverErrors = result.data.errors;
      if (result.status === 200) {
        todoState.items.push(result.data.todo);
        newTodoData = "";
      } else {
        update();
      }
    };
  };

  onMount(async () => {
    const todos = await data.streamed.todo_list;
    todoState.items = todos;
    initializeFilterValues<Todo>(todoState.filters, todoState.items);
  });

  $effect(() => {
    todoState.filteredSortedItems = todoState.items
      .filter((todo: Todo) => {
        for (const filter of todoState.filters) {
          if (filter.selection.length > 0) {
            if (!filter.selection.includes(todo[filter.property] as string)) {
              return false;
            }
          }
        }

        const matchesSearch =
          !todoState.searchText ||
          todo.data.toLowerCase().includes(todoState.searchText.toLowerCase());

        return matchesSearch;
      })
      .sort(
        byPropertiesOf<Todo>([
          "done",
          ((todoState.sortOrder === "desc" ? "" : "-") +
            todoState.sortBy) as sortArg<Todo>
        ])
      );
  });
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <div class="flex flex-col gap-3">
    <div>
      <label
        class="input input-sm input-bordered flex w-full grow items-center gap-2">
        <SearchIcon />
        <input
          type="search"
          class="grow"
          placeholder="Search"
          bind:value={todoState.searchText} />
      </label>
    </div>
    <div class="flex w-full flex-row justify-between gap-2">
      <div class="flex w-full flex-row justify-end gap-2">
        <FilterDropDown
          title="Assignee"
          values={todoState.filters[0].values}
          bind:filterValue={todoState.filters[0].selection}
          valueFn={nameFilterFn}>
          <UserIcon class="h-4 w-4" />
        </FilterDropDown>

        <SortDropDown
          bind:sortKey={todoState.sortBy}
          bind:sortOrder={todoState.sortOrder} />
        <ToggleButton
          className={`btn shadow-sm btn-outline rounded-md btn-sm border-neutral-200 ${showComplete ? "bg-accent" : ""}`}
          bind:isToggled={showComplete}>
          <DoneAllIcon class="h-4 w-4" />
        </ToggleButton>
      </div>
    </div>
    <div class="flex flex-col">
      {#if serverErrors}
        <h1 class="step-subtitle text-error mt-2">
          {serverErrors}
        </h1>
      {/if}
      <div
        class="card card-bordered border-neutral bg-base-300 rounded-lg shadow-md">
        {#await data.streamed.todo_list}
          <div class="flex w-full flex-col gap-4">
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
          </div>
        {:then}
          <div class="flex flex-1 flex-col">
            {#each todoState.filteredSortedItems as todo, id}
              {#if !todo.done || (todo.done && showComplete)}
                {#if todo && id !== 0}
                  <div class="divider m-0 h-1 p-0"></div>
                {/if}
                <TodoItem
                  {...todo}
                  onChange={(checked: boolean) => {
                    todoState.items = todoState.items.map((t) =>
                      t.id === todo.id ? { ...t, done: checked } : t
                    );
                  }}
                  onRemove={() => {
                    todoState.items = todoState.items.filter(
                      (t) => t.id !== todo.id
                    );
                  }} />
              {/if}
            {/each}
          </div>
        {:catch error}
          <p>{error.message}</p>
        {/await}
      </div>
    </div>
  </div>
  <div
    class={`card border-base-100 bg-base-300 sticky flex w-full rounded-lg border-2 p-2 ${isWebApp ? "bottom-24" : "bottom-3"}`}>
    <form method="POST" use:enhance={handleSubmit}>
      <div class="flex flex-row flex-wrap gap-2">
        <input
          type="text"
          class="input input-bordered grow"
          placeholder="Create to-do"
          name="todo_data"
          bind:value={newTodoData} />
        <button formaction="?/create_todo" class="btn btn-primary">Add</button>
      </div>
    </form>
  </div>
</div>
