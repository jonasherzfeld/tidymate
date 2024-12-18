<script lang="ts">
  let { children } = $props();
</script>

<ul
  tabindex="-1"
  class="dropdown-content menu bg-base-200 border-neutral z-[1] w-44 rounded-md border-[1px] p-2 shadow-md">
  {@render children?.()}
</ul>
