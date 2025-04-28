<script lang="ts">
  import type { PageData } from "./$types.js";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { ListHandler } from "$lib/utils/list_handler";
  import { initializeFilterValues } from "$lib/utils/helpers";
  import TodoItem from "$lib/components/TodoItem.svelte";
  import SortDropDown from "$lib/components/SortDropDown.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import {
    ReloadIcon,
    TagIcon,
    UserIcon,
    DoneAllIcon,
    SearchIcon
  } from "$lib/utils/icons";
  import ToggleButton from "$lib/components/ToggleButton.svelte";
  import { browser } from "$app/environment";

  let { data }: { data: PageData } = $props();

  let serverErrors: string = $state("");

  let sortKey: SearchableItemSortKey<Todo> = $state("created_on");
  let sortOrder: boolean = $state(true);

  let filters: FilterDescription<Todo>[] = $state([
    { property: "assignee", values: [], filterValues: [] },
    { property: "tags", values: [], filterValues: [] }
  ]);

  let showComplete: boolean = $state(false);
  let newTodoData: string = $state("");
  let removedList: string[] = $state([]);
  let searchText: string = $state("");

  let todoListHandler: ListHandler<Todo> = $state(new ListHandler("done"));
  const searchableProperties: (keyof Todo)[] = ["data", "assignee", "tags"];
  let todoList: Todo[] = $derived(
    todoListHandler.getSortedAndFilteredList(
      searchText,
      sortOrder,
      sortKey,
      filters,
      removedList
    )
  );

  let isWebApp: boolean = $state(false);
  if (browser) {
    isWebApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
  }

  const handleSubmit = async ({}) => {
    return async ({ result, update }) => {
      serverErrors = result.data.errors;
      if (result.status === 200) {
        newTodoData = "";
        todoListHandler = new ListHandler(
          "done",
          searchableProperties,
          data.house.members,
          [...todoListHandler.getFullList(), result.data.todo]
        );
      } else {
        update();
      }
    };
  };

  onMount(async () => {
    todoListHandler = new ListHandler(
      "done",
      searchableProperties,
      data.house.members,
      await data.streamed.todo_list
    );
    initializeFilterValues<Todo>(filters, todoListHandler.getFullList());
  });
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <div class="flex flex-col gap-3">
    <div>
      <label class="input input-sm input-bordered flex grow items-center gap-2">
        <SearchIcon />
        <input
          type="search"
          class="grow"
          placeholder="Search"
          bind:value={searchText} />
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
          title="Tags"
          values={filters[1].values}
          bind:filterValue={filters[1].filterValues}>
          <TagIcon class="h-4 w-4" />
        </FilterDropDown>
        <FilterDropDown
          title="Assignee"
          values={filters[0].values}
          bind:filterValue={filters[0].filterValues}>
          <UserIcon class="h-4 w-4" />
        </FilterDropDown>

        <SortDropDown bind:sortKey bind:sortOrder />
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
            {#each todoList as todo, id}
              {#if !todo.done || (todo.done && showComplete)}
                {#if todo && id !== 0}
                  <div class="divider m-0 h-1 p-0"></div>
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
