<script lang="ts">
    let { children } = $props();
</script>

<ul
    tabindex="-1"
    class="dropdown-content menu bg-base-100 rounded-md z-[1] w-44 p-2 shadow-md border-[1px] border-base-300"
>
    {@render children?.()}
</ul>
