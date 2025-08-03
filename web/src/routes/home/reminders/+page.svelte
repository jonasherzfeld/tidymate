<script lang="ts">
  import type { PageData } from "./$types.js";
  import ReminderList from "$lib/components/ReminderList.svelte";
  import RemindersStats from "$lib/components/items-page/ItemStats.svelte";
  import RemindersHistory from "$lib/components/items-page/ItemHistory.svelte";
  import {
    StatisticsIcon,
    HistoryIcon,
    ReminderIcon
  } from "$lib/utils/icons.js";
  import { onMount } from "svelte";
  import { byPropertiesOf, initializeFilterValues } from "$lib/utils/helpers";

  let { data }: { data: PageData } = $props();
  let activeTab: "reminders" | "stats" | "history" = $state("reminders");

  let reminderPageState: ItemListState<Reminder> = $state({
    items: [],
    history: [],
    filters: [{ property: "category", values: [], selection: [] }],
    searchText: "",
    sortBy: "deadline",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  onMount(() => {
    reminderPageState.items = data.reminders;
    reminderPageState.history = (data.history || []).filter(
      (h) => h.item_type === "reminder"
    );
    initializeFilterValues<Reminder>(
      reminderPageState.filters,
      reminderPageState.items
    );
  });

  $effect(() => {
    reminderPageState.filteredSortedItems = reminderPageState.items
      .filter((reminder: Reminder) => {
        for (const filter of reminderPageState.filters) {
          if (filter.selection.length > 0) {
            if (
              !filter.selection.includes(reminder[filter.property] as string)
            ) {
              return false;
            }
          }
        }

        const matchesSearch =
          !reminderPageState.searchText ||
          reminder.data
            .toLowerCase()
            .includes(reminderPageState.searchText.toLowerCase());

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

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <div role="tablist" class="tabs tabs-lifted">
    <label class="tab">
      <input
        type="radio"
        name="my_tabs_2"
        role="tab"
        class="tab"
        aria-label="Reminders"
        bind:group={activeTab}
        value="reminders"
        checked />
      <ReminderIcon class="mr-2 h-4 w-4" />
      Reminders
    </label>
    <div
      role="tabpanel"
      class="tab-content bg-base-100 border-base-300 rounded-box p-2">
      <ReminderList {data} bind:reminderPageState />
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
      <RemindersStats item_type="reminder" itemPageState={reminderPageState} />
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
      <RemindersHistory itemPageState={reminderPageState} />
    </div>
  </div>
</div>
