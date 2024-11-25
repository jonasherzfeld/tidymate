<script lang="ts">
    import type { Snippet } from 'svelte';

    let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-full w-full justify-center">
    <div
        class="grid grid-cols-1 text-center m-4 p-4 w-full sm:w-[350px] h-fit content-between rounded-lg justify-content bg-base-200"
    >
        {@render children?.()}
    </div>
</div>
