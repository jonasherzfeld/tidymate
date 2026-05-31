<script lang="ts">
  let { children } = $props();
</script>

<ul
  tabindex="-1"
  class="menu dropdown-content border-neutral bg-base-100 z-[1] w-52 rounded-field border p-1.5 shadow-[var(--shadow-md)]">
  {@render children?.()}
</ul>
