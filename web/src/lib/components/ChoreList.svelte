<script lang="ts">
  import type { PageData } from "../../routes/home/chores/$types.js";
  import { onMount } from "svelte";
  import { initializeFilterValues } from "$lib/utils/helpers";
  import ChoreItem from "$lib/components/ChoreItem.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import { byPropertiesOf, getUsernameById } from "$lib/utils/helpers";
  import { UserIcon, RoomFilterIcon, SearchIcon } from "$lib/utils/icons";

  let { data }: { data: PageData } = $props();
  let serverErrors: string = $state("");
  const choreState: ItemListState<Chore> = $state({
    items: [],
    filters: [
      { property: "assignee", values: [], selection: [] },
      { property: "room", values: [], selection: [] }
    ],
    searchText: "",
    sortBy: "deadline",
    sortOrder: "desc",
    filteredSortedItems: []
  });

  let nameFilterFn: (value: string) => string | undefined = (value) => {
    return getUsernameById(value, data.house.members);
  };

  onMount(async () => {
    const todos = await data.streamed.chore_list;
    choreState.items = todos;
    initializeFilterValues<Chore>(choreState.filters, choreState.items);
  });

  $effect(() => {
    choreState.filteredSortedItems = choreState.items
      .filter((chore: Chore) => {
        for (const filter of choreState.filters) {
          if (filter.selection.length > 0) {
            if (!filter.selection.includes(chore[filter.property] as string)) {
              return false;
            }
          }
        }

        const matchesSearch =
          !choreState.searchText ||
          chore.data
            .toLowerCase()
            .includes(choreState.searchText.toLowerCase());

        return matchesSearch;
      })
      .sort(
        byPropertiesOf<Chore>([
          "done",
          ((choreState.sortOrder === "desc" ? "" : "-") +
            choreState.sortBy) as sortArg<Chore>
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
        bind:value={choreState.searchText} />
    </label>
    <a class="flex flex-row flex-wrap gap-2" href="/home/chores/new">
      <button
        formaction="?/create_chore"
        class="btn btn-primary btn-sm w-[92px]">Add</button>
    </a>
  </div>
  <div class="flex w-full flex-row justify-between gap-2">
    <div class="flex w-full flex-row justify-end gap-2">
      <FilterDropDown
        title="Room"
        values={choreState.filters[1].values}
        bind:filterValue={choreState.filters[1].selection}>
        <RoomFilterIcon class="h-4 w-4" />
      </FilterDropDown>
      <FilterDropDown
        title="Assignee"
        values={choreState.filters[0].values}
        valueFn={nameFilterFn}
        bind:filterValue={choreState.filters[0].selection}>
        <UserIcon class="h-4 w-4" />
      </FilterDropDown>
    </div>
  </div>
  <div class="flex flex-col">
    {#if serverErrors}
      <h1 class="step-subtitle text-error mt-2">
        {serverErrors}
      </h1>
    {/if}
    <div class="">
      {#await data.chores}
        <div class="flex w-full flex-col gap-4">
          <div class="skeleton h-32 w-full"></div>
          <div class="skeleton h-4 w-28"></div>
          <div class="skeleton h-4 w-full"></div>
          <div class="skeleton h-4 w-full"></div>
        </div>
      {:then}
        <div class="flex flex-1 flex-col gap-2">
          {#each choreState.filteredSortedItems as chore, id}
            <ChoreItem
              {...chore}
              onChange={(d: string) => {
                choreState.items = choreState.items.map((c) =>
                  c.id === chore.id ? { ...c, deadline: d } : c
                );
              }}
              onRemove={() => {
                choreState.items = choreState.items.filter(
                  (c) => c.id !== chore.id
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
