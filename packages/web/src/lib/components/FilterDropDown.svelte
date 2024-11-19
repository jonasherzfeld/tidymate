<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Button } from '$lib/components/ui/button/index.js';

    let {
        title,
        values,
        filterValue = $bindable(),
        children
    }: { title: string; values: string[]; filterValue: string[]; children?: Snippet } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" size="sm" builders={[builder]}>
            {@render children?.()}
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-52 bg-base-100">
        <DropdownMenu.Label>{title}</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {#if values.length === 0}
            <DropdownMenu.Item disabled class="flex w-full justify-center text-center"
                >No {title}</DropdownMenu.Item
            >
        {:else}
            {#each values as value}
                <DropdownMenu.CheckboxItem
                    checked={filterValue.includes(value)}
                    onclick={() => {
                        filterValue.includes(value)
                            ? (filterValue = filterValue.filter((item) => item !== value))
                            : (filterValue = [...filterValue, value]);
                    }}>{value}</DropdownMenu.CheckboxItem
                >
            {/each}
        {/if}
    </DropdownMenu.Content>
</DropdownMenu.Root>
