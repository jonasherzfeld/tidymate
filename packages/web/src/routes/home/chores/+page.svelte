<script lang="ts">
  import type { PageData } from "./$types.js";
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { ListHandler } from "$lib/utils/list_handler";
  import { initializeFilterValues } from "$lib/utils/helpers";
  import ChoreItem from "$lib/components/ChoreItem.svelte";
  import SortDropDown from "$lib/components/SortDropDown.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import {
    ReloadIcon,
    TagIcon,
    UserIcon,
    BedroomIcon,
    SearchIcon
  } from "$lib/utils/icons";
  import { browser } from "$app/environment";

  let { data }: { data: PageData } = $props();

  let serverErrors: string = $state("");

  let sortKey: SearchableItemSortKey<Chore> = $state("created_on");
  let sortOrder: boolean = $state(true);

  let filters: FilterDescription<Chore>[] = $state([
    { property: "assignee", values: [], filterValues: [] },
    { property: "tags", values: [], filterValues: [] },
    { property: "room", values: [], filterValues: [] }
  ]);

  let showComplete: boolean = $state(false);
  let newChoreData: string = $state("");
  let removedList: string[] = $state([]);
  let searchText: string = $state("");

  let choreListHandler: ListHandler<Chore> = $state(new ListHandler());
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

  const handleSubmit = async ({}) => {
    return async ({ result, update }) => {
      serverErrors = result.data.errors;
      if (result.status === 200) {
        newChoreData = "";
        choreListHandler = new ListHandler(
          [...choreListHandler.getFullList(), result.data.chore],
          searchableProperties,
          data.house.members
        );
      } else {
        update();
      }
    };
  };

  onMount(async () => {
    choreListHandler = new ListHandler(
      await data.streamed.chore_list,
      searchableProperties,
      data.house.members
    );
    initializeFilterValues<Chore>(filters, choreListHandler.getFullList());
  });
</script>

<div class="flex min-h-full min-w-full flex-col justify-between gap-3">
  <div class="flex flex-col gap-3">
    <div class="flex gap-2">
      <label class="input input-bordered input-sm flex grow items-center gap-2">
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
          <BedroomIcon class="h-4 w-4" />
        </FilterDropDown>
        <FilterDropDown
          title="Tags"
          values={filters[1].values}
          bind:filterValue={filters[1].filterValues}>
          <TagIcon class="h-4 w-4" />
        </FilterDropDown>
        <FilterDropDown
          title="Assignee"
          values={filters[0].values}
          bind:filterValue={filters[0].filterValues}>
          <UserIcon class="h-4 w-4" />
        </FilterDropDown>

        <SortDropDown bind:sortKey bind:sortOrder />
      </div>
    </div>
    <div class="flex flex-col">
      {#if serverErrors}
        <h1 class="step-subtitle text-error mt-2">
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
              <ChoreItem {...chore} bind:removedList />
            {/each}
          </div>
        {:catch error}
          <p>{error.message}</p>
        {/await}
      </div>
    </div>
  </div>
</div>
