<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    children,
    plain = false,
    classIn = ""
  }: { children: Snippet; plain?: boolean; classIn?: string } = $props();
</script>

<h3
  class={`from-primary via-secondary to-warning w-fit bg-gradient-to-r ${plain ? "" : "text-transparent"} bg-clip-text ${classIn}`}>
  {@render children?.()}
</h3>
