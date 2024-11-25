<script lang="ts">
    import Drawer from '$lib/components/Drawer.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import type { Snippet } from 'svelte';
    import '../app.css';

    let { children }: { children: Snippet } = $props();

    let page_loaded = $state(false);
    const pageLoaded = ({}) => {
        page_loaded = true;
    };
</script>

{#if !page_loaded}
    <div class="flex justify-center items-center h-screen" use:pageLoaded>
        <span class="loading loading-spinner loading-lg"></span>
    </div>
{/if}
<Drawer>
    {@render children?.()}
    <Footer />
</Drawer>
