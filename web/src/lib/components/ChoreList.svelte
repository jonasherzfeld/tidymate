<script lang="ts">
  import type { PageData } from "../../routes/home/chores/$types.js";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import TaskItem from "$lib/components/TaskItem.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import { Button, EmptyState } from "$lib/components/ui";
  import { getUsernameById, getThumbnailById } from "$lib/utils/helpers";
  import { UserIcon, ReloadIcon, RoomFilterIcon, SearchIcon, ChoresIcon } from "$lib/utils/icons";
  import { FREQUENCY_INTERVALS, ROOM_CONFIG } from "$lib/utils/constants";

  let {
    data,
    chorePageState = $bindable<ItemListState<Chore>>()
  }: { data: PageData; chorePageState: ItemListState<Chore> } = $props();

  const nameFilterFn = (value: string) => getUsernameById(value, data.house.members);
</script>

<div class="flex h-full flex-col gap-4">
  <!-- Toolbar -->
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-2">
      <label
        class="border-neutral bg-base-100 focus-within:border-primary/60 rounded-field flex grow items-center gap-2 border px-3 py-2 transition-colors">
        <SearchIcon class="text-muted h-4 w-4" />
        <input
          type="search"
          class="placeholder:text-base-content/40 grow bg-transparent text-sm outline-none"
          placeholder="Search chores"
          bind:value={chorePageState.searchText} />
      </label>
      <a href="/home/chores/new">
        <Button variant="primary" size="sm">+ New</Button>
      </a>
    </div>

    <div class="flex items-center justify-between gap-2">
      <a href="/home/chores" data-sveltekit-reload aria-label="Reload">
        <Button variant="outline" size="sm">
          <ReloadIcon class="h-4 w-4" />
        </Button>
      </a>

      <div class="flex items-center gap-2">
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
  </div>

  <!-- List -->
  <div class="flex flex-1 flex-col gap-2">
    {#if chorePageState.filteredSortedItems.length === 0}
      <EmptyState
        icon={ChoresIcon}
        title={chorePageState.searchText ? "No matches" : "No chores yet"}
        description={chorePageState.searchText
          ? "Try a different search term or clear filters."
          : "Recurring chores keep your space tidy. Add one to get started."} />
    {:else}
      {#each chorePageState.filteredSortedItems as chore (chore.id)}
        {@const roomConfig = ROOM_CONFIG.find((r) => r.name === chore.room)}
        {@const freq = FREQUENCY_INTERVALS.find((f) => f.value === chore.frequency)?.description}
        {@const lastDoneDays = chore.last_done
          ? Math.floor((Date.now() - new Date(chore.last_done).getTime()) / (1000 * 3600 * 24))
          : undefined}
        <div animate:flip={{ duration: 220 }} transition:fade={{ duration: 160 }}>
          <TaskItem
            id={chore.id}
            title={chore.data}
            done={chore.done}
            kind="chore"
            category={roomConfig}
            deadline={chore.deadline}
            frequencyDescription={freq}
            daysSinceLastDone={lastDoneDays}
            assigneeName={getUsernameById(chore.assignee, data.house.members)}
            assigneeThumbnail={getThumbnailById(chore.assignee, data.house.members) ?? ""}
            onCheck={(_, payload: any) => {
              if (payload?.chore) {
                chorePageState.items = chorePageState.items.map((c) =>
                  c.id === chore.id
                    ? { ...c, deadline: payload.chore.deadline, last_done: payload.chore.last_done }
                    : c
                );
                chorePageState.history = [
                  ...chorePageState.history,
                  {
                    id: `temp-${Date.now()}`,
                    event_type: "completed",
                    item_id: chore.id,
                    item_data: chore.data,
                    item_type: "chore",
                    item: chore,
                    user_id: data.user.id,
                    house_id: data.user.house_id,
                    created_on: new Date().toISOString(),
                    user: data.user
                  } as History
                ];
              }
            }}
            onRemove={() => {
              chorePageState.items = chorePageState.items.filter((c) => c.id !== chore.id);
              chorePageState.history = [
                ...chorePageState.history,
                {
                  id: `temp-${Date.now()}`,
                  event_type: "deleted",
                  item_id: chore.id,
                  item_data: chore.data,
                  item_type: "chore",
                  item: chore,
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
