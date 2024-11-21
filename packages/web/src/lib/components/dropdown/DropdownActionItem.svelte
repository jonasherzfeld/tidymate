<script lang="ts">
    import type { Snippet } from 'svelte';
    import DropdownItem from './DropdownItem.svelte';

    let { action, disabled, children }: { action?: string; disabled?: boolean; children: Snippet } =
        $props();
</script>

<DropdownItem>
    <button
        type="submit"
        class="text-error"
        formaction={action}
        {disabled}
        onclick={(e) => {
            e.currentTarget.blur();
        }}
    >
        {@render children?.()}
    </button>
</DropdownItem>
