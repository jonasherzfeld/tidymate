<script lang="ts">
  import Dropdown from "./dropdown/Dropdown.svelte";
  import DropdownContent from "./dropdown/DropdownContent.svelte";
  import DropdownTrigger from "./dropdown/DropdownTrigger.svelte";
  import DropdownTextItem from "./dropdown/DropdownTextItem.svelte";
  import DropdownCheckboxItem from "./dropdown/DropdownCheckboxItem.svelte";
  import type { Snippet } from "svelte";

  let {
    title,
    values,
    valueFn,
    filterValue = $bindable(),
    children
  }: {
    title: string;
    values: string[];
    valueFn?: (value: string) => string;
    filterValue: string[];
    children?: Snippet;
  } = $props();
</script>

<Dropdown>
  <DropdownTrigger className="btn-sm border-neutral-200">
    {@render children?.()}
  </DropdownTrigger>
  <DropdownContent>
    <DropdownTextItem
      class="justify-left pointer-events-none flex w-full font-bold
">{title}</DropdownTextItem>
    {#if values.length === 0}
      <DropdownTextItem
        class="pointer-events-none flex w-full justify-center text-center
">No {title}</DropdownTextItem>
    {:else}
      {#each values as value}
        <DropdownCheckboxItem
          checked={filterValue.includes(value)}
          onclick={() => {
            filterValue.includes(value)
              ? (filterValue = filterValue.filter((item) => item !== value))
              : (filterValue = [...filterValue, value]);
          }}>
          {#if valueFn}
            {valueFn(value)}
          {:else}
            {value}
          {/if}
        </DropdownCheckboxItem>
      {/each}
    {/if}
  </DropdownContent>
</Dropdown>
