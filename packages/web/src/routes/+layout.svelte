<script lang="ts">
    import Drawer from '$lib/components/Drawer.svelte';
    import Footer from '$lib/components/Footer.svelte';

    let { children} = $props();
</script>

<Drawer>
    {@render children?.()}
    <Footer />
</Drawer>
