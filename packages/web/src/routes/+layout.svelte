<script lang="ts">
    import Drawer from '$lib/components/Drawer.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import type { Snippet } from 'svelte';
    import { browser } from '$app/environment';
    import '../app.css';
    import { page } from '$app/stores';
    import WebAppMenuBar from '$lib/components/WebAppMenuBar.svelte';

    let isLoggedIn: boolean = $derived($page.data.user ? true : false);
    let isInHouse: boolean = $derived($page.data.house ? true : false);

    let { children }: { children: Snippet } = $props();

    let isWebApp: boolean = $state(false);
    if (browser) {
        isWebApp =
            window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    }
    let isPageLoaded = $state(false);
    const handlePageLoaded = ({}) => {
        isPageLoaded = true;
    };
</script>

{#if !isPageLoaded}
    <div class="flex justify-center items-center h-screen" use:handlePageLoaded>
        <span class="loading loading-spinner loading-lg"></span>
    </div>
{/if}
<Drawer {isWebApp}>
    <div class={`flex grow ${isWebApp ? '' : 'min-h-screen'} min-w-full`}>
        {@render children?.()}
    </div>
    {#if isWebApp}
        <WebAppMenuBar />
    {:else}
        <Footer />
    {/if}
</Drawer>
