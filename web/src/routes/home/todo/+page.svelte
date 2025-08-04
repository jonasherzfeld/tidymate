<script lang="ts">
  import type { PageData } from "./$types.js";
  import TodoList from "$lib/components/TodoList.svelte";
  import TodoStats from "$lib/components/items-page/ItemStats.svelte";
  import TodoHistory from "$lib/components/items-page/ItemHistory.svelte";
  import { StatisticsIcon, HistoryIcon, TodoIcon } from "$lib/utils/icons.js";
  import { onMount } from "svelte";
  import {
    initializeFilterValues,
    byPropertiesOf
  } from "$lib/utils/helpers.js";

  let { data }: { data: PageData } = $props();
  let activeTab: "todos" | "stats" | "history" = $state("todos");

  let todoPageState: ItemListState<Todo> = $state({
    items: [],
    history: [],
    filters: [{ property: "assignee", values: [], selection: [] }],
    searchText: "",
    sortBy: "created_on",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  onMount(() => {
    todoPageState.items = data.todos;
    todoPageState.history = (data.history || []).filter(
      (h) => h.item_type === "todo"
    );
    initializeFilterValues<Todo>(todoPageState.filters, todoPageState.items);
  });

  $effect(() => {
    todoPageState.filteredSortedItems = todoPageState.items
      .filter((todo: Todo) => {
        for (const filter of todoPageState.filters) {
          if (filter.selection.length > 0) {
            if (!filter.selection.includes(todo[filter.property] as string)) {
              return false;
            }
          }
        }

        const matchesSearch =
          !todoPageState.searchText ||
          todo.data
            .toLowerCase()
            .includes(todoPageState.searchText.toLowerCase());

        return matchesSearch;
      })
      .sort(
        byPropertiesOf<Todo>([
          "done",
          ((todoPageState.sortOrder === "desc" ? "" : "-") +
            todoPageState.sortBy) as sortArg<Todo>
        ])
      );
  });
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <div role="tablist" class="tabs tabs-lifted">
    <label class="tab">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        class="tab"
        aria-label="Todos"
        bind:group={activeTab}
        value="todos"
        checked />
      <TodoIcon class="mr-2 h-4 w-4" />
      Todos
    </label>
    <div
      role="tabpanel"
      class="tab-content bg-base-100 border-base-300 rounded-box p-2">
      <TodoList {data} bind:todoPageState />
    </div>

    <label class="tab">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        class="tab"
        aria-label="Stats"
        bind:group={activeTab}
        value="stats" />
      <StatisticsIcon class="mr-2 h-4 w-4" />
      Stats
    </label>
    <div
      role="tabpanel"
      class="tab-content bg-base-100 border-base-300 rounded-box p-2">
      <TodoStats item_type={"todo"} itemPageState={todoPageState} />
    </div>

    <label class="tab">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        class="tab"
        aria-label="History"
        bind:group={activeTab}
        value="history" />
      <HistoryIcon class="mr-2 h-4 w-4" />
      History
    </label>
    <div
      role="tabpanel"
      class="tab-content bg-base-100 border-base-300 rounded-box p-2">
      <TodoHistory itemPageState={todoPageState} />
    </div>
  </div>
</div>
