<script lang="ts">
    import Drawer from '$lib/components/Drawer.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import type { Snippet } from 'svelte';
    import { browser } from '$app/environment';
    import TodoIcon from 'virtual:icons/fluent/task-list-square-16-filled';
    import ChoresIcon from 'virtual:icons/fluent/calendar-arrow-counterclockwise-48-filled';
    import HouseIcon from 'virtual:icons/fluent/home-20-filled';
    import '../app.css';
    import { page } from '$app/stores';

    let is_logged_in: boolean = $derived($page.data.user ? true : false);
    let is_in_house: boolean = $derived($page.data.house ? true : false);

    let { children }: { children: Snippet } = $props();

    let isWebApp: boolean = $state(false);
    if (browser) {
        isWebApp =
            window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    }

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
<Drawer {isWebApp}>
    <div class={`flex grow ${isWebApp ? '' : 'min-h-screen'} min-w-full`}>
        {@render children?.()}
    </div>
    {#if isWebApp}
        <ul
            class="menu menu-horizontal justify-center bg-base-300 h-20 sticky border-t-[1px] bottom-0 shadow-md gap-3"
        >
            {#if is_logged_in && is_in_house}
                <li class="text-base">
                    <a href="/home" class="p-0"
                        ><button class="btn btn-md btn-square"
                            ><HouseIcon style="font-size:1.2rem" /></button
                        ></a
                    >
                </li>
                <li class="text-base">
                    <a href="/home/todo" class="p-0"
                        ><button class="btn btn-md btn-square"
                            ><TodoIcon style="font-size:1.2rem" /></button
                        ></a
                    >
                </li>
                <li class="text-base">
                    <a href="/home/chores" class="p-0"
                        ><button class="btn btn-md btn-square"
                            ><ChoresIcon style="font-size:1.2rem" /></button
                        ></a
                    >
                </li>
                <div class="divider"></div>
            {/if}
        </ul>
    {:else}
        <Footer />
    {/if}
</Drawer>
