<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    plain = false,
    classIn = ""
  }: { children: Snippet; plain?: boolean; classIn?: string } = $props();
</script>

<h3
  class={`w-fit bg-gradient-to-r from-primary via-secondary to-warning ${plain ? "" : "text-transparent"} bg-clip-text ${classIn}`}>
  {@render children?.()}
</h3>
