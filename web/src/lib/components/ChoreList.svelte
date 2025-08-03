<script lang="ts">
  import type { PageData } from "../../routes/home/chores/$types.js";
  import ChoreItem from "$lib/components/ChoreItem.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import { getUsernameById } from "$lib/utils/helpers";
  import {
    UserIcon,
    ReloadIcon,
    RoomFilterIcon,
    SearchIcon
  } from "$lib/utils/icons";

  let {
    data,
    chorePageState = $bindable<ItemListState<Chore>>()
  }: { data: PageData; chorePageState: ItemListState<Chore> } = $props();

  let nameFilterFn: (value: string) => string | undefined = (value) => {
    return getUsernameById(value, data.house.members);
  };
</script>

<div class="flex h-full flex-col gap-3">
  <div class="flex gap-2">
    <label class="input input-sm input-bordered flex grow items-center gap-2">
      <SearchIcon />
      <input
        type="search"
        class="grow"
        placeholder="Search"
        bind:value={chorePageState.searchText} />
    </label>
    <a class="flex flex-row flex-wrap gap-2" href="/home/chores/new">
      <button
        formaction="?/create_chore"
        class="btn btn-primary btn-sm w-[92px]">Add</button>
    </a>
  </div>
  <div class="flex w-full flex-row justify-between gap-2">
    <div>
      <a href="/home/chores" data-sveltekit-reload>
        <button
          class="btn btn-outline btn-sm rounded-md border-neutral-200 shadow-sm">
          <ReloadIcon class="h-4 w-4" />
        </button>
      </a>
    </div>
    <div class="flex w-full flex-row justify-end gap-2">
      <FilterDropDown
        title="Room"
        values={chorePageState.filters[1].values}
        bind:filterValue={chorePageState.filters[1].selection}>
        <RoomFilterIcon class="h-4 w-4" />
      </FilterDropDown>
      <FilterDropDown
        title="Assignee"
        values={chorePageState.filters[0].values}
        valueFn={nameFilterFn}
        bind:filterValue={chorePageState.filters[0].selection}>
        <UserIcon class="h-4 w-4" />
      </FilterDropDown>
    </div>
  </div>
  <div class="flex flex-col">
    <div class="">
      <div class="flex flex-1 flex-col gap-2">
        {#each chorePageState.filteredSortedItems as chore}
          <ChoreItem
            {...chore}
            onChange={(deadline: string, last_done: string) => {
              chorePageState.items = chorePageState.items.map((c) =>
                c.id === chore.id
                  ? { ...c, deadline: deadline, last_done: last_done }
                  : c
              );
              chorePageState.history = [
                ...chorePageState.history,
                {
                  id: "",
                  event_type: "completed",
                  item_id: chore.id,
                  item_type: "chore",
                  item_data: chore.data,
                  user_id: "",
                  house_id: "",
                  created_on: new Date().toISOString(),
                  user: data.user
                } as History
              ];
            }}
            onRemove={() => {
              chorePageState.items = chorePageState.items.filter(
                (c) => c.id !== chore.id
              );
              chorePageState.history = [
                ...chorePageState.history,
                {
                  id: "",
                  event_type: "deleted",
                  item_id: chore.id,
                  item_type: "chore",
                  item_data: chore.data,
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
</div>
