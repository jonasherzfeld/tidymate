<script lang="ts">
  import type { PageData } from "../../routes/home/todo/$types.js";
  import { enhance } from "$app/forms";
  import { flip } from "svelte/animate";
  import { fade } from "svelte/transition";
  import TaskItem from "$lib/components/TaskItem.svelte";
  import SortDropDown from "$lib/components/SortDropDown.svelte";
  import FilterDropDown from "$lib/components/FilterDropDown.svelte";
  import ToggleButton from "$lib/components/ToggleButton.svelte";
  import { Button, EmptyState } from "$lib/components/ui";
  import { ReloadIcon, UserIcon, DoneAllIcon, SearchIcon, TodoIcon } from "$lib/utils/icons";
  import { getUsernameById } from "$lib/utils/helpers";
  import { cn } from "$lib/utils";

  let {
    data,
    todoPageState = $bindable<ItemListState<Todo>>()
  }: { data: PageData; todoPageState: ItemListState<Todo> } = $props();

  let serverErrors: string = $state("");
  let showComplete: boolean = $state(false);
  let newTodoData: string = $state("");
  let creating: boolean = $state(false);

  const nameFilterFn = (value: string) => getUsernameById(value, data.house.members);

  let visibleTodos = $derived(
    todoPageState.filteredSortedItems.filter((t) => !t.done || (t.done && showComplete))
  );

  const handleSubmit = async () => {
    creating = true;
    return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
      creating = false;
      serverErrors = result.data?.errors ?? "";
      if (result.status === 200) {
        todoPageState.items.push(result.data.todo);
        todoPageState.history.push({
          id: `temp-${Date.now()}`,
          event_type: "created",
          item_id: result.data.todo.id,
          item_data: result.data.todo.data,
          item_type: "todo",
          item: result.data.todo,
          user_id: data.user.id,
          house_id: data.user.house_id,
          created_on: new Date().toISOString(),
          user: data.user
        } as History);
        newTodoData = "";
      } else {
        update();
      }
    };
  };
</script>

<div class="flex min-h-full flex-col gap-4">
  <!-- Toolbar -->
  <div class="flex flex-col gap-2">
    <label
      class="border-neutral bg-base-100 focus-within:border-primary/60 rounded-field flex w-full items-center gap-2 border px-3 py-2 transition-colors">
      <SearchIcon class="text-muted h-4 w-4" />
      <input
        type="search"
        class="placeholder:text-base-content/40 grow bg-transparent text-sm outline-none"
        placeholder="Search todos"
        bind:value={todoPageState.searchText} />
    </label>

    <div class="flex w-full items-center justify-between gap-2">
      <a href="/home/todo" data-sveltekit-reload aria-label="Reload">
        <Button variant="outline" size="sm">
          <ReloadIcon class="h-4 w-4" />
        </Button>
      </a>

      <div class="flex items-center gap-2">
        <FilterDropDown
          title="Assignee"
          values={todoPageState.filters[0].values}
          bind:filterValue={todoPageState.filters[0].selection}
          valueFn={nameFilterFn}>
          <UserIcon class="h-4 w-4" />
        </FilterDropDown>

        <SortDropDown
          bind:sortKey={todoPageState.sortBy}
          bind:sortOrder={todoPageState.sortOrder} />

        <ToggleButton
          className={cn(
            "btn btn-sm rounded-field border transition-colors",
            showComplete
              ? "border-primary bg-primary/10 text-primary"
              : "border-neutral bg-base-100 hover:bg-base-200"
          )}
          bind:isToggled={showComplete}>
          <DoneAllIcon class="h-4 w-4" />
        </ToggleButton>
      </div>
    </div>
  </div>

  {#if serverErrors}
    <div class="bg-error/10 text-error border-error/20 rounded-field border px-3 py-2 text-sm">
      {serverErrors}
    </div>
  {/if}

  <!-- List -->
  <div class="flex flex-1 flex-col gap-2">
    {#if visibleTodos.length === 0}
      <EmptyState
        icon={TodoIcon}
        title={todoPageState.searchText ? "No matches" : "Nothing to do — yet"}
        description={todoPageState.searchText
          ? "Try a different search term or clear filters."
          : "Add your first todo with the input below."} />
    {:else}
      {#each visibleTodos as todo (todo.id)}
        <div animate:flip={{ duration: 220 }} transition:fade={{ duration: 160 }}>
          <TaskItem
            id={todo.id}
            title={todo.data}
            done={todo.done}
            kind="todo"
            deadline={todo.deadline}
            assigneeName={getUsernameById(todo.assignee, data.house.members)}
            onCheck={(next) => {
              todoPageState.items = todoPageState.items.map((t) =>
                t.id === todo.id ? { ...t, done: next } : t
              );
              if (next) {
                todoPageState.history = [
                  ...todoPageState.history,
                  {
                    id: `temp-${Date.now()}`,
                    event_type: "completed",
                    item_id: todo.id,
                    item_data: todo.data,
                    item_type: "todo",
                    item: todo,
                    user_id: data.user.id,
                    house_id: data.user.house_id,
                    created_on: new Date().toISOString(),
                    user: data.user
                  } as History
                ];
              }
            }}
            onRemove={() => {
              todoPageState.items = todoPageState.items.filter((t) => t.id !== todo.id);
              todoPageState.history = [
                ...todoPageState.history,
                {
                  id: `temp-${Date.now()}`,
                  event_type: "deleted",
                  item_id: todo.id,
                  item_data: todo.data,
                  item_type: "todo",
                  item: todo,
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

  <!-- Quick create -->
  <div
    class="bg-base-100 border-neutral rounded-field sticky bottom-3 border p-2 shadow-[var(--shadow-md)]">
    <form method="POST" use:enhance={handleSubmit}>
      <div class="flex items-center gap-2">
        <input
          type="text"
          class="placeholder:text-base-content/40 grow bg-transparent px-2 py-1.5 text-sm outline-none"
          placeholder="Add a new todo…"
          name="todo_data"
          bind:value={newTodoData} />
        <Button
          variant="primary"
          size="sm"
          loading={creating}
          disabled={!newTodoData.trim()}
          type="submit"
          formaction="?/create_todo">
          Add
        </Button>
      </div>
    </form>
  </div>
</div>
