<script lang="ts">
    import type { Snippet } from 'svelte';
    import { page } from '$app/stores';
    import Header from '$lib/components/Header.svelte';
    import Logo from './Logo.svelte';
    import MenuIcon from 'virtual:icons/mdi/menu';
    import MenuBlock from './MenuBlock.svelte';

    let {
        isWebApp,
        children
    }: {
        isWebApp: boolean;
        children: Snippet;
    } = $props();

    let is_logged_in: boolean = $derived($page.data.user ? true : false);
    let is_in_house: boolean = $derived($page.data.house ? true : false);
    let menu_restriction: RestrictionType[] = $derived(
        is_logged_in && is_in_house
            ? ['logged_in', 'house_member']
            : is_logged_in
              ? ['logged_in', 'no_house_member']
              : ['logged_out']
    );
    let checked: boolean = $state(false);

    function handleClick() {
        checked = !checked;
    }
</script>

<div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" bind:checked />
    <div class="drawer-content flex flex-col min-h-screen">
        <!-- Navbar -->
        <div
            class={`navbar w-full bg-base-300 text-shade-500 border-solid border-b border-shape-500 sticky top-0 z-10 shadow-md ${isWebApp ? 'pt-12' : ''}`}
        >
            <div class={`flex w-fit p-0 m-0 lg:hidden ${isWebApp ? 'hidden' : ''}`}>
                <button
                    onclick={handleClick}
                    class="btn btn-square btn-ghost w-fit ml-3"
                    aria-label="Open Menu"
                >
                    <MenuIcon />
                </button>
            </div>
            <Header />
        </div>
        {@render children?.()}
    </div>

    <div class="drawer-side z-20">
        <button onclick={handleClick} class="drawer-overlay" aria-label="Close Menu"></button>
        <ul
            class={`menu bg-base-300 min-h-full w-80 p-4 rounded-md border ${isWebApp ? 'pt-12' : ''}`}
        >
            <!-- Sidebar content here -->
            <a
                href={is_logged_in && is_in_house ? '/home' : '/'}
                class="btn btn-ghost text-xl"
                onclick={handleClick}
            >
                <Logo width="30px" />Tidymate</a
            >
            <MenuBlock position="drawer_top" restricted={menu_restriction} {handleClick} />
            <div class="divider"></div>
            <MenuBlock position="drawer_bottom" restricted={['none']} {handleClick} />
        </ul>
    </div>
</div>
