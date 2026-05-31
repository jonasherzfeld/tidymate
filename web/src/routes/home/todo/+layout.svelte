<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="mx-auto flex w-full max-w-screen-md flex-1 flex-col px-4 py-5">
  {@render children?.()}
</div>
