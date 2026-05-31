<script lang="ts">
  import type { Snippet } from "svelte";
  import Logo from "$lib/components/Logo.svelte";
  import RainbowText from "$lib/components/RainbowText.svelte";

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-full w-full items-center justify-center">
  <!-- Form panel -->
  <div class="flex w-full items-center justify-center px-6 py-12">
    <div class="w-full max-w-sm">
      <div class="mb-8 flex items-center gap-3 lg:hidden">
        <Logo width="32px" />
        <RainbowText plain classIn="text-xl font-semibold tracking-tight">Tidymate</RainbowText>
      </div>
      {@render children?.()}
    </div>
  </div>
</div>
