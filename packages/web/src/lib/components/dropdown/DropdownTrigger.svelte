<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    interface Props extends HTMLButtonAttributes {
        children: Snippet;
        className: string;
    }
    let { children, className, ...others }: Props = $props();
    export { className as class };
</script>

<button
    tabindex="0"
    class={`btn shadow-sm btn-outline rounded-md border-base-300 ${className}`}
    {...others}
>
    {@render children?.()}
</button>
