<script lang="ts">
  import type { PageData } from "./$types.js";
  import ReminderList from "$lib/components/ReminderList.svelte";
  import InsightsPanel from "$lib/components/InsightsPanel.svelte";
  import { Button, SectionHeader } from "$lib/components/ui";
  import { StatisticsIcon } from "$lib/utils/icons.js";
  import { onMount } from "svelte";
  import { byPropertiesOf, initializeFilterValues } from "$lib/utils/helpers";

  let { data }: { data: PageData } = $props();

  let reminderPageState: ItemListState<Reminder> = $state({
    items: [],
    history: [],
    filters: [{ property: "category", values: [], selection: [] }],
    searchText: "",
    sortBy: "deadline",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  let insightsOpen = $state(false);

  onMount(() => {
    reminderPageState.items = data.reminders;
    reminderPageState.history = (data.history || []).filter((h) => h.item_type === "reminder");
    initializeFilterValues<Reminder>(reminderPageState.filters, reminderPageState.items);
  });

  $effect(() => {
    reminderPageState.filteredSortedItems = reminderPageState.items
      .filter((reminder: Reminder) => {
        for (const filter of reminderPageState.filters) {
          if (filter.selection.length > 0) {
            if (!filter.selection.includes(reminder[filter.property] as string)) return false;
          }
        }
        const matchesSearch =
          !reminderPageState.searchText ||
          reminder.data.toLowerCase().includes(reminderPageState.searchText.toLowerCase());
        return matchesSearch;
      })
      .sort(
        byPropertiesOf<Reminder>([
          "done",
          ((reminderPageState.sortOrder === "desc" ? "" : "-") +
            reminderPageState.sortBy) as sortArg<Reminder>
        ])
      );
  });
</script>

<div class="flex w-full flex-1 flex-col gap-5">
  <SectionHeader title="Reminders" subtitle="Personal reminders only you can see.">
    {#snippet actions()}
      <Button variant="outline" size="sm" onclick={() => (insightsOpen = true)}>
        <StatisticsIcon class="h-4 w-4" />
        Insights
      </Button>
    {/snippet}
  </SectionHeader>

  <ReminderList {data} bind:reminderPageState />
</div>

<InsightsPanel
  bind:open={insightsOpen}
  itemType="reminder"
  itemPageState={reminderPageState}
  title="Reminder insights" />
