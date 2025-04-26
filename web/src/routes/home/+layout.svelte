<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-full w-full items-start justify-center bg-base-100">
  {@render children?.()}
</div>
