<script>
    import Drawer from '$lib/components/Drawer.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<Drawer>
    <slot />
    <Footer />
</Drawer>
