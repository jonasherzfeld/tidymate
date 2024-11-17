<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import { Button } from '$lib/components/ui/button/index.js';
    import FilterIcon from 'virtual:icons/fluent/filter-12-filled';

    let { filterValue = $bindable() }: { filterValue: string[] } = $props();
    // let test1 = $state(false);
    // let test2 = $state(false);
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
        <Button variant="outline" size="sm" builders={[builder]}
            ><FilterIcon class="h-4 w-4" /></Button
        >
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-52 bg-base-100">
        <DropdownMenu.Label>Filter</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
                <span>Assignee</span>
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
                <DropdownMenu.CheckboxItem
                    onclick={() => {
                        filterValue.includes('Jonas')
                            ? filterValue.splice(filterValue.indexOf('Jonas'), 1)
                            : filterValue.push('Jonas');
                    }}
                >
                    Jonas
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem
                    onclick={() => {
                        filterValue.includes('Valeria')
                            ? filterValue.splice(filterValue.indexOf('Valeria'), 1)
                            : filterValue.push('Valeria');
                    }}
                >
                    Valeria
                </DropdownMenu.CheckboxItem>
            </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
    </DropdownMenu.Content>
</DropdownMenu.Root>
