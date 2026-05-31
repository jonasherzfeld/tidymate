<script lang="ts">
  import type { PageData } from "./$types.js";
  import ChoreList from "$lib/components/ChoreList.svelte";
  import InsightsPanel from "$lib/components/InsightsPanel.svelte";
  import { Button, SectionHeader } from "$lib/components/ui";
  import { StatisticsIcon } from "$lib/utils/icons.js";
  import { onMount } from "svelte";
  import { initializeFilterValues, byPropertiesOf } from "$lib/utils/helpers";

  let { data }: { data: PageData } = $props();

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

  let insightsOpen = $state(false);

  onMount(() => {
    chorePageState.items = data.chores;
    chorePageState.history = (data.history || []).filter((h) => h.item_type === "chore");
    initializeFilterValues<Chore>(chorePageState.filters, chorePageState.items);
  });

  $effect(() => {
    chorePageState.filteredSortedItems = chorePageState.items
      .filter((chore: Chore) => {
        for (const filter of chorePageState.filters) {
          if (filter.selection.length > 0) {
            if (!filter.selection.includes(chore[filter.property] as string)) return false;
          }
        }
        const matchesSearch =
          !chorePageState.searchText ||
          chore.data.toLowerCase().includes(chorePageState.searchText.toLowerCase());
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

<div class="flex w-full flex-1 flex-col gap-5">
  <SectionHeader title="Chores" subtitle="Recurring tasks shared with your house.">
    {#snippet actions()}
      <Button variant="outline" size="sm" onclick={() => (insightsOpen = true)}>
        <StatisticsIcon class="h-4 w-4" />
        Insights
      </Button>
    {/snippet}
  </SectionHeader>

  <ChoreList {data} bind:chorePageState />
</div>

<InsightsPanel
  bind:open={insightsOpen}
  itemType="chore"
  itemPageState={chorePageState}
  title="Chore insights" />
