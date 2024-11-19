<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import SortIcon from 'virtual:icons/fluent/arrow-sort-16-filled';

    let {
        sortKey = $bindable(),
        sortOrder = $bindable()
    }: { sortKey: string; sortOrder: boolean } = $props();
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" size="sm" builders={[builder]}
            ><SortIcon class="h-4 w-4" /></Button
        >
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-52 bg-base-100">
        <DropdownMenu.Label>Sort</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup bind:value={sortKey}>
            <DropdownMenu.CheckboxItemSort class="bg-primary text-white" bind:checked={sortOrder}
                >{sortOrder ? 'Descending' : 'Ascending'}</DropdownMenu.CheckboxItemSort
            >
            <DropdownMenu.RadioItem value="created_on">Created On</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="data">Text</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="assignee">Assignee</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
</DropdownMenu.Root>
