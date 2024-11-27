<script lang="ts">
    import {
        ROUTE_MAPPING,
        type RouteLinkPosition,
        type RestrictionType
    } from '$lib/utils/constants';

    let {
        restricted,
        position,
        handleClick
    }: { restricted: RestrictionType[]; position: RouteLinkPosition; handleClick?: () => void } =
        $props();
</script>

{#each ROUTE_MAPPING as item}
    {#if item.position.includes(position)}
        {#if restricted.includes(item.restricted) || item.restricted === ('none' as RestrictionType)}
            <li class="text-base">
                {#if handleClick}
                    <a href={item.url} target={item.external ? '_blank' : ''} onclick={handleClick}
                        ><item.icon />{item.title}</a
                    >
                {:else}
                    <a href={item.url} target={item.external ? '_blank' : ''}
                        ><item.icon />{item.title}</a
                    >
                {/if}
            </li>
        {/if}
    {/if}
{/each}
