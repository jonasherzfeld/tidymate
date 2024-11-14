<script lang="ts">
    import { fly } from 'svelte/transition';

    let { data, children } = $props();
    const pageTransitionDuration = 300;
    const pageTransitionDistance = 100;
</script>

{#key data.url}
    <div
        in:fly={data.url.endsWith('/todo')
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
    >
        <div class="flex bg-base-100 min-h-screen w-full items-start justify-center">
            <div class="flex flex-col justify-center text-center w-full max-w-screen-sm p-4 mt-5">
                {@render children?.()}
            </div>
        </div>
    </div>
{/key}
