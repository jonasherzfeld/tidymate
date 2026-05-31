<script lang="ts">
  import type { PageData } from "./$types.js";
  import TodoList from "$lib/components/TodoList.svelte";
  import InsightsPanel from "$lib/components/InsightsPanel.svelte";
  import { Button, SectionHeader } from "$lib/components/ui";
  import { StatisticsIcon, TodoIcon } from "$lib/utils/icons.js";
  import { onMount } from "svelte";
  import { initializeFilterValues, byPropertiesOf } from "$lib/utils/helpers.js";

  let { data }: { data: PageData } = $props();

  let todoPageState: ItemListState<Todo> = $state({
    items: [],
    history: [],
    filters: [{ property: "assignee", values: [], selection: [] }],
    searchText: "",
    sortBy: "created_on",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  let insightsOpen = $state(false);

  onMount(() => {
    todoPageState.items = data.todos;
    todoPageState.history = (data.history || []).filter((h) => h.item_type === "todo");
    initializeFilterValues<Todo>(todoPageState.filters, todoPageState.items);
  });

  $effect(() => {
    todoPageState.filteredSortedItems = todoPageState.items
      .filter((todo: Todo) => {
        for (const filter of todoPageState.filters) {
          if (filter.selection.length > 0) {
            if (!filter.selection.includes(todo[filter.property] as string)) return false;
          }
        }
        const matchesSearch =
          !todoPageState.searchText ||
          todo.data.toLowerCase().includes(todoPageState.searchText.toLowerCase());
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

<div class="flex w-full flex-1 flex-col gap-5">
  <SectionHeader title="Todos" subtitle="One-off tasks for the household.">
    {#snippet actions()}
      <Button variant="outline" size="sm" onclick={() => (insightsOpen = true)}>
        <StatisticsIcon class="h-4 w-4" />
        Insights
      </Button>
    {/snippet}
  </SectionHeader>

  <TodoList {data} bind:todoPageState />
</div>

<InsightsPanel
  bind:open={insightsOpen}
  itemType="todo"
  itemPageState={todoPageState}
  title="Todo insights" />
