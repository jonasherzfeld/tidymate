<script lang="ts">
    import { fly } from 'svelte/transition';
    import type { PageData } from './$types';
    import type { Snippet } from 'svelte';

    let { data, children }: { data: PageData; children: Snippet } = $props();
    const pageTransitionDuration: number = 300;
    const pageTransitionDistance: number = 100;
</script>

{#key data.url}
    <div class="flex flex-1 min-h-full">
        <!-- in:fly={data.url.endsWith('/chore')
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
        out:fly={data.url.endsWith('/chore')
            ? { x: pageTransitionDistance, duration: pageTransitionDuration }
            : { x: -pageTransitionDistance, duration: pageTransitionDuration }}
    > -->
        <div class="flex flex-1 w-full min-h-full items-start justify-center">
            <div class="flex grow justify-center text-center max-w-screen-sm p-4 min-h-full">
                {@render children?.()}
            </div>
        </div>
    </div>
{/key}
