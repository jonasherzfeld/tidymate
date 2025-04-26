<script lang="ts">
  let { children } = $props();
</script>

<div class="dropdown dropdown-end dropdown-bottom">
  {@render children?.()}
</div>
