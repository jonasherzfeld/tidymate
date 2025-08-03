<script lang="ts">
  import type { PageData } from "./$types.js";
  import ChoreList from "$lib/components/ChoreList.svelte";
  import ChoreHistory from "$lib/components/items-page/ItemHistory.svelte";
  import ChoreStats from "$lib/components/items-page/ItemStats.svelte";
  import { StatisticsIcon, HistoryIcon, ChoresIcon } from "$lib/utils/icons.js";
  import { onMount } from "svelte";
  import { initializeFilterValues } from "$lib/utils/helpers";
  import { byPropertiesOf } from "$lib/utils/helpers";

  let { data }: { data: PageData } = $props();
  let activeTab: "chores" | "stats" | "history" = $state("chores");

  let chorePageState: ItemListState<Chore> = $state({
    items: [],
    history: [],
    filters: [
      { property: "assignee", values: [], selection: [] },
      { property: "room", values: [], selection: [] }
    ],
    searchText: "",
    sortBy: "deadline",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  onMount(() => {
    chorePageState.items = data.chores;
    chorePageState.history = (data.history || []).filter(
      (h) => h.item_type === "chore"
    );
    initializeFilterValues<Chore>(chorePageState.filters, chorePageState.items);
  });

  $effect(() => {
    chorePageState.filteredSortedItems = chorePageState.items
      .filter((chore: Chore) => {
        for (const filter of chorePageState.filters) {
          if (filter.selection.length > 0) {
            if (!filter.selection.includes(chore[filter.property] as string)) {
              return false;
            }
          }
        }

        const matchesSearch =
          !chorePageState.searchText ||
          chore.data
            .toLowerCase()
            .includes(chorePageState.searchText.toLowerCase());

        return matchesSearch;
      })
      .sort(
        byPropertiesOf<Chore>([
          "done",
          ((chorePageState.sortOrder === "desc" ? "" : "-") +
            chorePageState.sortBy) as sortArg<Chore>
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
      <ChoreList {data} bind:chorePageState />
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
      <ChoreStats item_type="chore" itemPageState={chorePageState} />
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
      <ChoreHistory itemPageState={chorePageState} />
    </div>
  </div>
</div>
