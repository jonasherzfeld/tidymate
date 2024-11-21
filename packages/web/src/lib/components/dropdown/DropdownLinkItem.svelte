<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLAnchorAttributes } from 'svelte/elements';
    import DropdownItem from './DropdownItem.svelte';

    interface Props extends HTMLAnchorAttributes {
        children: Snippet;
    }
    let { children, ...others }: Props = $props();
</script>

<DropdownItem>
    <a {...others}>
        {@render children?.()}
    </a>
</DropdownItem>
