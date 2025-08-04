<script lang="ts">
  import type { PageData } from "../../routes/home/todo/$types.js";
  import { enhance } from "$app/forms";
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
  import { getUsernameById } from "$lib/utils/helpers";

  let {
    data,
    todoPageState = $bindable<ItemListState<Todo>>()
  }: { data: PageData; todoPageState: ItemListState<Todo> } = $props();

  let serverErrors: string = $state("");
  let showComplete: boolean = $state(false);
  let newTodoData: string = $state("");

  let nameFilterFn: (value: string) => string | undefined = (value) => {
    return getUsernameById(value, data.house.members);
  };

  const handleSubmit = async ({}) => {
    return async ({ result, update }) => {
      serverErrors = result.data.errors;
      if (result.status === 200) {
        todoPageState.items.push(result.data.todo);
        newTodoData = "";
      } else {
        update();
      }
    };
  };
</script>

<div class="flex min-h-full flex-col justify-between gap-3">
  <div class="flex flex-col gap-3">
    <div>
      <label
        class="input input-sm input-bordered flex w-full grow items-center gap-2">
        <SearchIcon />
        <input
          type="search"
          class="grow"
          placeholder="Search"
          bind:value={todoPageState.searchText} />
      </label>
    </div>
    <div class="flex w-full flex-row justify-between gap-2">
      <div>
        <a href="/home/todo" data-sveltekit-reload>
          <button
            class="btn btn-outline btn-sm rounded-md border-neutral-200 shadow-sm">
            <ReloadIcon class="h-4 w-4" />
          </button>
        </a>
      </div>
      <div class="flex w-full flex-row justify-end gap-2">
        <FilterDropDown
          title="Assignee"
          values={todoPageState.filters[0].values}
          bind:filterValue={todoPageState.filters[0].selection}
          valueFn={nameFilterFn}>
          <UserIcon class="h-4 w-4" />
        </FilterDropDown>

        <SortDropDown
          bind:sortKey={todoPageState.sortBy}
          bind:sortOrder={todoPageState.sortOrder} />
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
        <div class="flex flex-1 flex-col">
          {#each todoPageState.filteredSortedItems as todo, id}
            {#if !todo.done || (todo.done && showComplete)}
              {#if todo && id !== 0}
                <div class="divider m-0 h-1 p-0"></div>
              {/if}
              <TodoItem
                {...todo}
                onChange={(checked: boolean) => {
                  todoPageState.items = todoPageState.items.map((t) =>
                    t.id === todo.id ? { ...t, done: checked } : t
                  );
                  todoPageState.history = [
                    ...todoPageState.history,
                    {
                      id: "",
                      event_type: "completed",
                      item_id: todo.id,
                      item_type: "todo",
                      item_data: todo.data,
                      user_id: "",
                      house_id: "",
                      created_on: new Date().toISOString(),
                      user: data.user
                    } as History
                  ];
                }}
                onRemove={() => {
                  todoPageState.items = todoPageState.items.filter(
                    (t) => t.id !== todo.id
                  );
                  todoPageState.history = [
                    ...todoPageState.history,
                    {
                      id: "",
                      event_type: "deleted",
                      item_id: todo.id,
                      item_type: "todo",
                      item_data: todo.data,
                      user_id: "",
                      house_id: "",
                      created_on: new Date().toISOString(),
                      user: data.user
                    } as History
                  ];
                }} />
            {/if}
          {/each}
        </div>
      </div>
    </div>
  </div>
  <div
    class={`card border-base-100 bg-base-300 sticky mb-3 flex w-full rounded-lg border-2 p-2`}>
    <form method="POST" use:enhance={handleSubmit}>
      <div class="flex flex-row flex-wrap gap-2">
        <input
          type="text"
          class="input input-bordered flex w-fit grow"
          placeholder="Create to-do"
          name="todo_data"
          bind:value={newTodoData} />
        <button formaction="?/create_todo" class="btn btn-primary">Add</button>
      </div>
    </form>
  </div>
</div>
