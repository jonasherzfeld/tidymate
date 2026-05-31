<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    children: Snippet;
    className: string;
  }
  let { children, className, ...others }: Props = $props();
  export { className as class };
</script>

<button
  tabindex="0"
  class={`btn btn-outline border-neutral rounded-field hover:bg-base-200 hover:border-base-content/20 shadow-[var(--shadow-xs)] ${className}`}
  {...others}>
  {@render children?.()}
</button>
