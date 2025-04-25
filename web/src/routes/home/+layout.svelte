<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="bg-base-100 flex min-h-full w-full items-start justify-center">
  {@render children?.()}
</div>
