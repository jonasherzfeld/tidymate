<script lang="ts">
    let { children } = $props();
</script>

<div class="flex bg-base-100 h-[calc(100vh-74px)] w-full items-start justify-center">
    <div class="flex justify-center text-center w-screen p-4 mt-5">
        {@render children?.()}
    </div>
</div>
