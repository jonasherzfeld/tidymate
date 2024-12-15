<script lang="ts">
    let { children } = $props();
</script>

<ul
    tabindex="-1"
    class="dropdown-content menu bg-base-200 rounded-md z-[1] w-44 p-2 shadow-md border-[1px] border-neutral"
>
    {@render children?.()}
</ul>
