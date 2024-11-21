<script lang="ts">
    import type { Snippet } from 'svelte';

    let {
        className,
        isToggled = $bindable(),
        children
    }: { className: string; isToggled: boolean; children?: Snippet } = $props();
</script>

<button
    class={className}
    onclick={() => {
        isToggled = !isToggled;
    }}
>
    {@render children?.()}
    <input type="checkbox" class="hidden" bind:checked={isToggled} />
</button>
