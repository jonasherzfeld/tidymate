<script lang="ts">
  import {
    ROUTE_MAPPING,
    type RouteLinkPosition,
    type RestrictionType,
    type PublicType
  } from "$lib/utils/constants";

  let {
    restricted,
    position,
    publicType,
    handleClick,
    buttonView
  }: {
    restricted: RestrictionType[];
    position: RouteLinkPosition;
    publicType?: PublicType;
    handleClick?: () => void;
    buttonView?: boolean;
  } = $props();
</script>

{#each ROUTE_MAPPING as item}
  {#if item.position.includes(position)}
    {#if publicType === undefined || item.publicType.includes(publicType)}
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
            <a href={item.url} target={item.target} class="flex flex-col font-mono gap-0 text-xs p-0">
                <item.icon class="h-6 w-6" />{item.title}
              </a>
          {/if}
        </li>
      {/if}
    {/if}
  {/if}
{/each}
