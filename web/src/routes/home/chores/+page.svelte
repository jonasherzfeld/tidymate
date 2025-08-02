<script lang="ts">
  import type { PageData } from "./$types.js";
  import ChoreList from "$lib/components/ChoreList.svelte";
  import ChoreStats from "$lib/components/ChoreStats.svelte";
  import ChoreHistory from "$lib/components/ChoreHistory.svelte";
  import { StatisticsIcon, HistoryIcon, ChoresIcon } from "$lib/utils/icons.js";

  let { data }: { data: PageData } = $props();
  let activeTab: "chores" | "stats" | "history" = $state("chores");
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <div role="tablist" class="tabs tabs-lifted">
    <label class="tab">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        class="tab"
        aria-label="Chores"
        bind:group={activeTab}
        value="chores"
        checked />
      <ChoresIcon class="mr-2 h-4 w-4" />
      Chores
    </label>
    <div
      role="tabpanel"
      class="tab-content bg-base-100 border-base-300 rounded-box p-2">
      <ChoreList {data} />
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
      <ChoreStats {data} />
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
      <ChoreHistory {data} />
    </div>
  </div>
</div>
