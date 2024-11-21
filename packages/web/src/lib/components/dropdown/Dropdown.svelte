<script lang="ts">
    let { children } = $props();
</script>

<div class="dropdown dropdown-bottom dropdown-end">
    {@render children?.()}
</div>
