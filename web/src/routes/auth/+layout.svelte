<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-full w-full justify-center">
  <div
    class="justify-content bg-base-200 m-4 grid h-fit w-full grid-cols-1 content-between rounded-lg p-4 text-center sm:w-[350px]">
    {@render children?.()}
  </div>
</div>
