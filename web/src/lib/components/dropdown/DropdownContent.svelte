<script lang="ts">
  let { children } = $props();
</script>

<ul
  tabindex="-1"
  class="menu dropdown-content border-neutral bg-base-200 z-[1] w-52 rounded-md border-[1px] p-2 shadow-md">
  {@render children?.()}
</ul>
