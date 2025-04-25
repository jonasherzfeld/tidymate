<script lang="ts">
  import { fly } from "svelte/transition";
  import type { PageData } from "./$types";
  import type { Snippet } from "svelte";

  let { data, children }: { data: PageData; children: Snippet } = $props();
  const pageTransitionDuration: number = 300;
  const pageTransitionDistance: number = 100;
</script>

{#key data.url}
  <div class="flex min-h-full flex-1">
    <!-- in:fly={data.url.endsWith('/todo')
            ? {
                  x: -pageTransitionDistance,
                  duration: pageTransitionDuration,
                  delay: pageTransitionDuration
              }
            : {
                  x: pageTransitionDistance,
                  duration: pageTransitionDuration,
                  delay: pageTransitionDuration
              }}
        out:fly={data.url.endsWith('/todo')
            ? { x: pageTransitionDistance, duration: pageTransitionDuration }
            : { x: -pageTransitionDistance, duration: pageTransitionDuration }}
    > -->
    <div class="flex min-h-full w-full flex-1 items-start justify-center">
      <div
        class="flex min-h-full max-w-screen-sm grow justify-center p-4 text-center">
        {@render children?.()}
      </div>
    </div>
  </div>
{/key}
