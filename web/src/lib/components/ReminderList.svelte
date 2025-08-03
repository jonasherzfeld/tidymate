<script lang="ts">
  import { onMount } from "svelte";
  import { initializeFilterValues } from "$lib/utils/helpers";
  import ReminderItem from "$lib/components/ReminderItem.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import { byPropertiesOf } from "$lib/utils/helpers";
  import { GeneralIcon, SearchIcon } from "$lib/utils/icons";

  let { data }: { data: PageData } = $props();
  let serverErrors: string = $state("");
  const reminderState: ItemListState<Reminder> = $state({
    items: [],
    filters: [{ property: "category", values: [], selection: [] }],
    searchText: "",
    sortBy: "deadline",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  onMount(() => {
    const todos = data.reminders;
    reminderState.items = todos;
    initializeFilterValues<Reminder>(
      reminderState.filters,
      reminderState.items
    );
  });

  $effect(() => {
    reminderState.filteredSortedItems = reminderState.items
      .filter((reminder: Reminder) => {
        for (const filter of reminderState.filters) {
          if (filter.selection.length > 0) {
            if (
              !filter.selection.includes(reminder[filter.property] as string)
            ) {
              return false;
            }
          }
        }

        const matchesSearch =
          !reminderState.searchText ||
          reminder.data
            .toLowerCase()
            .includes(reminderState.searchText.toLowerCase());

        return matchesSearch;
      })
      .sort(
        byPropertiesOf<Reminder>([
          "done",
          ((reminderState.sortOrder === "desc" ? "" : "-") +
            reminderState.sortBy) as sortArg<Reminder>
        ])
      );
  });
</script>

<div class="flex h-full flex-col gap-3">
  <div class="flex gap-2">
    <label class="input input-sm input-bordered flex grow items-center gap-2">
      <SearchIcon />
      <input
        type="search"
        class="grow"
        placeholder="Search"
        bind:value={reminderState.searchText} />
    </label>
    <a class="flex flex-row flex-wrap gap-2" href="/home/reminders/new">
      <button
        formaction="?/create_reminder"
        class="btn btn-primary btn-sm w-[92px]">Add</button>
    </a>
  </div>
  <div class="flex w-full flex-row justify-between gap-2">
    <div class="flex w-full flex-row justify-end gap-2">
      <FilterDropDown
        title="Category"
        values={reminderState.filters[0].values}
        bind:filterValue={reminderState.filters[0].selection}>
        <GeneralIcon class="h-4 w-4" />
      </FilterDropDown>
    </div>
  </div>
  <div class="flex flex-col">
    {#if serverErrors}
      <h1 class="step-subtitle text-error mt-2">
        {serverErrors}
      </h1>
    {/if}
    <div class="flex flex-1 flex-col gap-2">
      {#each reminderState.filteredSortedItems as reminder, id}
        <ReminderItem
          {...reminder}
          onChange={(deadline: string, last_done: string) => {
            reminderState.items = reminderState.items.map((c) =>
              c.id === reminder.id ? { ...c, deadline: deadline, last_done: last_done } : c
            );
          }}
          onRemove={() => {
            reminderState.items = reminderState.items.filter(
              (c) => c.id !== reminder.id
            );
          }} />
      {/each}
    </div>
  </div>
</div>
