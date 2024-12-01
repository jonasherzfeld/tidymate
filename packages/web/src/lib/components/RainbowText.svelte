<script lang="ts">
    import type { Snippet } from 'svelte';

    let { children, classIn = '' }: { children: Snippet; classIn?: string } = $props();
</script>

<h3
    class={`w-fit bg-gradient-to-r from-primary via-secondary to-warning text-transparent bg-clip-text ${classIn}`}
>
    {@render children?.()}
</h3>
