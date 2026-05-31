<script lang="ts">
  import type { PageData } from "../../routes/home/reminders/$types.js";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import TaskItem from "$lib/components/TaskItem.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import { Button, EmptyState } from "$lib/components/ui";
  import { GeneralIcon, ReloadIcon, SearchIcon, ReminderIcon } from "$lib/utils/icons";
  import { CATEGORY_CONFIG, FREQUENCY_INTERVALS } from "$lib/utils/constants";

  let {
    data,
    reminderPageState = $bindable<ItemListState<Reminder>>()
  }: { data: PageData; reminderPageState: ItemListState<Reminder> } = $props();
</script>

<div class="flex h-full flex-col gap-4">
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <label
        class="border-neutral bg-base-100 focus-within:border-primary/60 flex grow items-center gap-2 rounded-field border px-3 py-2 transition-colors">
        <SearchIcon class="text-muted h-4 w-4" />
        <input
          type="search"
          class="grow bg-transparent text-sm outline-none placeholder:text-base-content/40"
          placeholder="Search reminders"
          bind:value={reminderPageState.searchText} />
      </label>
      <a href="/home/reminders/new">
        <Button variant="primary" size="sm">+ New</Button>
      </a>
    </div>

    <div class="flex items-center justify-between gap-2">
      <a href="/home/reminders" data-sveltekit-reload aria-label="Reload">
        <Button variant="outline" size="sm">
          <ReloadIcon class="h-4 w-4" />
        </Button>
      </a>
      <FilterDropDown
        title="Category"
        values={reminderPageState.filters[0].values}
        bind:filterValue={reminderPageState.filters[0].selection}>
        <GeneralIcon class="h-4 w-4" />
      </FilterDropDown>
    </div>
  </div>

  <div class="flex flex-1 flex-col gap-2">
    {#if reminderPageState.filteredSortedItems.length === 0}
      <EmptyState
        icon={ReminderIcon}
        title={reminderPageState.searchText ? "No matches" : "No reminders yet"}
        description={reminderPageState.searchText
          ? "Try a different search term or clear filters."
          : "Personal reminders only you can see. Add one to get started."} />
    {:else}
      {#each reminderPageState.filteredSortedItems as reminder (reminder.id)}
        {@const categoryConfig = CATEGORY_CONFIG.find((c) => c.name === reminder.category)}
        {@const freq = FREQUENCY_INTERVALS.find((f) => f.value === reminder.frequency)?.description}
        {@const lastDoneDays = reminder.last_done
          ? Math.floor((Date.now() - new Date(reminder.last_done).getTime()) / (1000 * 3600 * 24))
          : undefined}
        <div animate:flip={{ duration: 220 }} transition:fade={{ duration: 160 }}>
          <TaskItem
            id={reminder.id}
            title={reminder.data}
            done={reminder.done}
            kind="reminder"
            category={categoryConfig}
            deadline={reminder.deadline}
            frequencyDescription={freq}
            daysSinceLastDone={lastDoneDays}
            onCheck={(_, payload: any) => {
              if (payload?.reminder) {
                reminderPageState.items = reminderPageState.items.map((r) =>
                  r.id === reminder.id
                    ? {
                        ...r,
                        deadline: payload.reminder.deadline,
                        last_done: payload.reminder.last_done
                      }
                    : r
                );
                reminderPageState.history = [
                  ...reminderPageState.history,
                  {
                    id: `temp-${Date.now()}`,
                    event_type: "completed",
                    item_id: reminder.id,
                    item_data: reminder.data,
                    item_type: "reminder",
                    item: reminder,
                    user_id: data.user.id,
                    house_id: data.user.house_id,
                    created_on: new Date().toISOString(),
                    user: data.user
                  } as History
                ];
              }
            }}
            onRemove={() => {
              reminderPageState.items = reminderPageState.items.filter(
                (r) => r.id !== reminder.id
              );
              reminderPageState.history = [
                ...reminderPageState.history,
                {
                  id: `temp-${Date.now()}`,
                  event_type: "deleted",
                  item_id: reminder.id,
                  item_data: reminder.data,
                  item_type: "reminder",
                  item: reminder,
                  user_id: data.user.id,
                  house_id: data.user.house_id,
                  created_on: new Date().toISOString(),
                  user: data.user
                } as History
              ];
            }} />
        </div>
      {/each}
    {/if}
  </div>
</div>
