<script lang="ts">
    import Drawer from '$lib/components/Drawer.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import '../app.css';

    let { children } = $props();
</script>

<Drawer>
    {@render children?.()}
    <Footer />
</Drawer>
