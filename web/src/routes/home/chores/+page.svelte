<script lang="ts">
  import type { PageData } from "./$types.js";
  import { onMount } from "svelte";
  import { ListHandler } from "$lib/utils/list_handler";
  import { initializeFilterValues } from "$lib/utils/helpers";
  import ChoreItem from "$lib/components/ChoreItem.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import { getUsernameById } from "$lib/utils/helpers";
  import {
    ReloadIcon,
    UserIcon,
    RoomFilterIcon,
    SearchIcon
  } from "$lib/utils/icons";
  import { browser } from "$app/environment";

  let { data }: { data: PageData } = $props();

  let serverErrors: string = $state("");

  let sortKey: SearchableItemSortKey<Chore> = $state("-deadline");
  let sortOrder: boolean = $state(true);

  let filters: FilterDescription<Chore>[] = $state([
    { property: "assignee", values: [], filterValues: [] },
    { property: "tags", values: [], filterValues: [] },
    { property: "room", values: [], filterValues: [] }
  ]);
  let nameFilterFn: (value: string) => string | undefined = (value) => {
    console.log(value);
    return getUsernameById(value, data.house.members);
  };

  let removedList: string[] = $state([]);
  let searchText: string = $state("");

  let choreListHandler: ListHandler<Chore> = $state(
    new ListHandler("deadline")
  );
  const searchableProperties: (keyof Chore)[] = ["data", "assignee", "tags"];
  let choreList: Chore[] = $derived(
    choreListHandler.getSortedAndFilteredList(
      searchText,
      sortOrder,
      sortKey,
      filters,
      removedList
    )
  );

  let isWebApp: boolean = $state(false);
  if (browser) {
    isWebApp =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone;
  }

  onMount(async () => {
    choreListHandler = new ListHandler(
      "deadline",
      searchableProperties,
      data.house.members,
      await data.streamed.chore_list
    );
    initializeFilterValues<Chore>(filters, choreListHandler.getFullList());
  });
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <div class="flex flex-col gap-3">
    <div class="flex gap-2">
      <label class="input input-sm input-bordered flex grow items-center gap-2">
        <SearchIcon />
        <input
          type="search"
          class="grow"
          placeholder="Search"
          bind:value={searchText} />
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
          values={filters[2].values}
          bind:filterValue={filters[2].filterValues}>
          <RoomFilterIcon class="h-4 w-4" />
        </FilterDropDown>
        <FilterDropDown
          title="Assignee"
          values={filters[0].values}
          valueFn={nameFilterFn}
          bind:filterValue={filters[0].filterValues}>
          <UserIcon class="h-4 w-4" />
        </FilterDropDown>
      </div>
    </div>
    <div class="flex flex-col">
      {#if serverErrors}
        <h1 class="step-subtitle mt-2 text-error">
          {serverErrors}
        </h1>
      {/if}
      <div class="">
        {#await data.streamed.chore_list}
          <div class="flex w-full flex-col gap-4">
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
          </div>
        {:then}
          <div class="flex flex-1 flex-col gap-2">
            {#each choreList as chore, id}
              <ChoreItem
                {...chore}
                bind:removedList
                onchange={(deadline: string) => {
                  choreListHandler.fullList[id].deadline = deadline;
                  choreListHandler = new ListHandler<Chore>(
                    "deadline",
                    searchableProperties,
                    data.house.members,
                    choreListHandler.fullList
                  );
                }} />
            {/each}
          </div>
        {:catch error}
          <p>{error.message}</p>
        {/await}
      </div>
    </div>
  </div>
</div>
