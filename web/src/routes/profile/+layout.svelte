<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-full w-full items-start justify-center bg-base-100">
  <div class="mt-5 flex w-full max-w-screen-sm justify-center p-4 text-center">
    {@render children?.()}
  </div>
</div>
