<script lang="ts">
  import type { PageData } from "../../routes/home/reminders/$types.js";
  import ReminderItem from "$lib/components/ReminderItem.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import { GeneralIcon, ReloadIcon, SearchIcon } from "$lib/utils/icons";

  let {
    data,
    reminderPageState = $bindable<ItemListState<Reminder>>()
  }: { data: PageData; reminderPageState: ItemListState<Reminder> } = $props();
</script>

<div class="flex h-full flex-col gap-3">
  <div class="flex gap-2">
    <label class="input input-sm input-bordered flex grow items-center gap-2">
      <SearchIcon />
      <input
        type="search"
        class="grow"
        placeholder="Search"
        bind:value={reminderPageState.searchText} />
    </label>
    <a class="flex flex-row flex-wrap gap-2" href="/home/reminders/new">
      <button
        formaction="?/create_reminder"
        class="btn btn-primary btn-sm w-[92px]">Add</button>
    </a>
  </div>
  <div class="flex w-full flex-row justify-between gap-2">
    <div>
      <a href="/home/reminders" data-sveltekit-reload>
        <button
          class="btn btn-outline btn-sm rounded-md border-neutral-200 shadow-sm">
          <ReloadIcon class="h-4 w-4" />
        </button>
      </a>
    </div>
    <div class="flex w-full flex-row justify-end gap-2">
      <FilterDropDown
        title="Category"
        values={reminderPageState.filters[0].values}
        bind:filterValue={reminderPageState.filters[0].selection}>
        <GeneralIcon class="h-4 w-4" />
      </FilterDropDown>
    </div>
  </div>

  <div class="flex flex-col">
    <div class="flex flex-1 flex-col gap-2">
      {#each reminderPageState.filteredSortedItems as reminder, id}
        <ReminderItem
          {...reminder}
          onChange={(deadline: string, last_done: string) => {
            reminderPageState.items = reminderPageState.items.map((c) =>
              c.id === reminder.id
                ? { ...c, deadline: deadline, last_done: last_done }
                : c
            );
            reminderPageState.history = [
              ...reminderPageState.history,
              {
                id: "",
                event_type: "completed",
                item_id: reminder.id,
                item_type: "reminder",
                item_data: reminder.data,
                user_id: "",
                house_id: "",
                created_on: new Date().toISOString(),
                user: data.user
              } as History
            ];
          }}
          onRemove={() => {
            reminderPageState.items = reminderPageState.items.filter(
              (c) => c.id !== reminder.id
            );
            reminderPageState.history = [
              ...reminderPageState.history,
              {
                id: "",
                event_type: "deleted",
                item_id: reminder.id,
                item_type: "reminder",
                item_data: reminder.data,
                user_id: "",
                house_id: "",
                created_on: new Date().toISOString(),
                user: data.user
              } as History
            ];
          }} />
      {/each}
    </div>
  </div>
</div>
