<script lang="ts">
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();
</script>

<div class="flex h-screen justify-center">
    <div
        class="grid grid-cols-1 text-center m-4 p-4 w-full sm:w-[350px] h-fit content-between rounded-lg justify-content bg-base-200"
    >
        <div>
            <h1 class="text-4xl">Register</h1>
        </div>
        {@render children?.()}
    </div>
</div>
