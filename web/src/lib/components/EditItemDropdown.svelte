<script lang="ts" generics="T">
  import * as Dropdown from "$lib/components/dropdown/index.js";
  import type { Component } from "svelte";

  let {
    itemList,
    item,
    property,
    name,
    Icon
  }: {
    itemList: (keyof T)[];
    item: T;
    property: keyof T;
    name: string;
    Icon: Component;
  } = $props();
</script>

<Dropdown.Root>
  <button
    type="button"
    tabindex="0"
    class="text-normal btn btn-outline input-bordered w-full rounded-md bg-base-100">
    <div class="flex w-24 items-center gap-2 font-normal">
      <Icon class="h-4 w-4" />Room
    </div>
    <span class="grow text-right font-normal">
      {item[property] ? item[property] : "Set room"}
    </span>
  </button>
  <Dropdown.Content>
    <Dropdown.TextItem
      class="justify-left pointer-events-none flex w-full font-bold"
      >Room</Dropdown.TextItem>
    <Dropdown.RadioItem
      radioName={name}
      checked={item[property] === ""}
      onchange={() => {
        item[property] = "" as (typeof item)[property];
      }}>None</Dropdown.RadioItem>
    {#each itemList as itemIter}
      <Dropdown.RadioItem
        radioName={name}
        checked={item[property] === itemIter}
        onchange={() => {
          item[property] = itemIter;
        }}>{itemIter}</Dropdown.RadioItem>
    {/each}
  </Dropdown.Content>
</Dropdown.Root>
