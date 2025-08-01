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
        <li class="gap-8 text-base">
          {#if !buttonView}
            {#if handleClick}
              <a href={item.url} target={item.target} onclick={handleClick}
                ><item.icon />{item.title}</a>
            {:else}
              <a href={item.url} target={item.target}
                ><item.icon />{item.title}</a>
            {/if}
          {:else if position === "menu_mid"}
            <a
              href={item.url}
              target={item.target}
              class="btn-square bg-base-content text-base-300 flex h-12 w-12 flex-col gap-0 p-1 text-xs font-light"
              style="text-decoration: none  !important; outline: none !important;"
              onmousedown={(e) => e.preventDefault()}
              onmouseup={(e) => e.preventDefault()}>
              <item.icon class="h-6 w-6" />{item.title}
            </a>
          {:else}
            <a
              href={item.url}
              target={item.target}
              class=" flex w-12 flex-col gap-0 p-1 text-xs font-light"
              style="text-decoration: none !important; background-color: transparent !important; color: inherit !important; outline: none !important;"
              onmousedown={(e) => e.preventDefault()}
              onmouseup={(e) => e.preventDefault()}>
              <item.icon class="h-6 w-6" />{item.title}
            </a>
          {/if}
        </li>
      {/if}
    {/if}
  {/if}
{/each}
