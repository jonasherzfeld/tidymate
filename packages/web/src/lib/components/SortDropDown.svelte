<script lang="ts">
    import * as Dropdown from '$lib/components/dropdown/index.js';
    import { SortIcon } from '$lib/utils/icons';
    let {
        sortKey = $bindable(),
        sortOrder = $bindable()
    }: { sortKey: string; sortOrder: boolean } = $props();

    function onChange(event) {
        sortKey = event.currentTarget.value;
    }
</script>

<Dropdown.Root>
    <Dropdown.Trigger className="btn-sm border-neutral-200">
        <SortIcon class="h-4 w-4" />
    </Dropdown.Trigger>
    <Dropdown.Content>
        <Dropdown.TextItem class="flex w-full justify-left font-bold pointer-events-none"
            >Sort</Dropdown.TextItem
        >
        <Dropdown.CheckboxItem
            checked={sortOrder}
            onclick={() => {
                sortOrder = !sortOrder;
            }}>{sortOrder ? 'Descending' : 'Ascending'}</Dropdown.CheckboxItem
        >
        <Dropdown.RadioItem
            radioName="sort"
            name="created_on"
            onchange={onChange}
            checked={sortKey.includes('created_on')}>Created On</Dropdown.RadioItem
        >
        <Dropdown.RadioItem
            radioName="sort"
            name="assignee"
            onchange={onChange}
            checked={sortKey.includes('assignee')}>Assignee</Dropdown.RadioItem
        >
        <Dropdown.RadioItem
            radioName="sort"
            name="data"
            onchange={onChange}
            checked={sortKey.includes('data')}>Text</Dropdown.RadioItem
        >
    </Dropdown.Content>
</Dropdown.Root>
