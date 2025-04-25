<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLAttributes } from "svelte/elements";

  interface Props extends HTMLAttributes<any> {
    children: Snippet;
  }
  let { children, ...others }: Props = $props();
</script>

<li>
  <span {...others}>
    {@render children?.()}
  </span>
</li>
