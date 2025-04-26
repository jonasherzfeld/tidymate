<script lang="ts">
  import {
    ROUTE_MAPPING,
    type RouteLinkPosition,
    type RestrictionType
  } from "$lib/utils/constants";

  let {
    restricted,
    position,
    handleClick,
    buttonView
  }: {
    restricted: RestrictionType[];
    position: RouteLinkPosition;
    handleClick?: () => void;
    buttonView?: boolean;
  } = $props();
</script>

{#each ROUTE_MAPPING as item}
  {#if item.position.includes(position)}
    {#if restricted.includes(item.restricted) || item.restricted === ("none" as RestrictionType)}
      <li class="text-base">
        {#if !buttonView}
          {#if handleClick}
            <a href={item.url} target={item.target} onclick={handleClick}
              ><item.icon />{item.title}</a>
          {:else}
            <a href={item.url} target={item.target}
              ><item.icon />{item.title}</a>
          {/if}
        {:else}
          <a href={item.url} target={item.target} class="p-0"
            ><button class="btn btn-square btn-ghost btn-md gap-0 p-0 text-xs"
              ><item.icon class="h-6 w-6" />{item.title}</button
            ></a>
        {/if}
      </li>
    {/if}
  {/if}
{/each}
