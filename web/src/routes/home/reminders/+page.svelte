<script lang="ts">
  import type { PageData } from "./$types.js";
  import ReminderList from "$lib/components/ReminderList.svelte";
  import RemindersStats from "$lib/components/RemindersStats.svelte";
  import RemindersHistory from "$lib/components/RemindersHistory.svelte";
  import {
    StatisticsIcon,
    HistoryIcon,
    ReminderIcon
  } from "$lib/utils/icons.js";

  let { data }: { data: PageData } = $props();
  let activeTab: "reminders" | "stats" | "history" = $state("reminders");
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
      class="tab-content bg-base-100 border-base-300 rounded-box p-6">
      <ReminderList {data} />
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
      <RemindersStats {data} />
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
      <RemindersHistory {data} />
    </div>
  </div>
</div>
