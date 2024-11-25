<script lang="ts">
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
</script>

<div class="flex bg-base-100 min-h-screen w-full items-start justify-center">
    <div class="flex justify-center text-center w-full max-w-screen-sm p-4 mt-5">
        {@render children?.()}
    </div>
</div>
