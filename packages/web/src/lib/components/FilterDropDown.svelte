<script lang="ts">
    import Dropdown from './dropdown/Dropdown.svelte';
    import DropdownContent from './dropdown/DropdownContent.svelte';
    import DropdownTrigger from './dropdown/DropdownTrigger.svelte';
    import DropdownTextItem from './dropdown/DropdownTextItem.svelte';
    import DropdownCheckboxItem from './dropdown/DropdownCheckboxItem.svelte';
    import type { Snippet } from 'svelte';
    import { getUsernameById } from '$lib/utils/helpers';
    import { page } from '$app/stores';

    let {
        title,
        values,
        filterValue = $bindable(),
        children
    }: { title: string; values: string[]; filterValue: string[]; children?: Snippet } = $props();
</script>

<Dropdown>
    <DropdownTrigger className="btn-sm border-neutral-200">
        {@render children?.()}
    </DropdownTrigger>
    <DropdownContent>
        <DropdownTextItem
            class="flex w-full justify-left font-bold pointer-events-none
">{title}</DropdownTextItem
        >
        {#if values.length === 0}
            <DropdownTextItem
                class="flex w-full justify-center text-center pointer-events-none
">No {title}</DropdownTextItem
            >
        {:else}
            {#each values as value}
                <DropdownCheckboxItem
                    checked={filterValue.includes(value)}
                    onclick={() => {
                        filterValue.includes(value)
                            ? (filterValue = filterValue.filter((item) => item !== value))
                            : (filterValue = [...filterValue, value]);
                    }}>{getUsernameById(value, $page.data.house.members)}</DropdownCheckboxItem
                >
            {/each}
        {/if}
    </DropdownContent>
</Dropdown>
