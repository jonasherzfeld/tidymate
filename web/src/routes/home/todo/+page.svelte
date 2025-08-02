<script lang="ts">
  import type { PageData } from "./$types.js";
  import TodoList from "$lib/components/TodoList.svelte";
  import TodoStats from "$lib/components/TodoStats.svelte";
  import TodoHistory from "$lib/components/TodoHistory.svelte";
  import { StatisticsIcon, HistoryIcon, TodoIcon } from "$lib/utils/icons.js";

  let { data }: { data: PageData } = $props();
  let activeTab: "todos" | "stats" | "history" = $state("todos");
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
      class="tab-content bg-base-100 border-base-300 rounded-box p-6">
      <TodoList {data} />
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
      class="tab-content bg-base-100 border-base-300 rounded-box p-6">
      <TodoStats {data} />
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
      class="tab-content bg-base-100 border-base-300 rounded-box p-6">
      <TodoHistory {data} />
    </div>
  </div>
</div>