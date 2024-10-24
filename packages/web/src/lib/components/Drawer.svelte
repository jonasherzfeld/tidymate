<script>
    import Header from '$lib/components/Header.svelte';
    import Logo from '$lib/img/tidymate_logo_white.png';
    import { page } from '$app/stores';
    import { INFO_LINKS, NAV_LINKS } from '$lib/utils/constants';
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children } = $props();

    let is_logged_in = $derived($page.data.user ? true : false);
    let checked = $state('');
    function handleClick() {
        checked === 'checked' ? (checked = '') : (checked = 'checked');
    }
</script>

<div class="drawer">
    <input id="my-drawer-3" type="checkbox" class="drawer-toggle" bind:checked />
    <div class="drawer-content flex flex-col">
        <!-- Navbar -->
        <div
            class="navbar w-full bg-base-100 text-shade-500 border-solid border-b border-shape-500"
        >
            <div class="flex-none lg:hidden">
                <button onclick={handleClick} class="btn btn-square btn-ghost">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        class="inline-block h-6 w-6 stroke-current"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>
            <Header />
        </div>
        {@render children?.()}
    </div>

    <div class="drawer-side">
        <button onclick={handleClick} class="drawer-overlay"></button>
        <ul class="menu bg-base-200 min-h-full w-80 p-4">
            <!-- Sidebar content here -->
            <a href="/" class="btn btn-ghost text-xl">
                <img alt="User" src={Logo} width="30px" />Tidymate</a
            >
            {#if is_logged_in}
                {#each NAV_LINKS as link}
                    <li>
                        <a href={link.href} onclick={handleClick}>{link.title}</a>
                    </li>
                {/each}
                <div class="divider"></div>
            {/if}
            {#each INFO_LINKS as link}
                <li><a href={link.href} onclick={handleClick}>{link.title}</a></li>
            {/each}
        </ul>
    </div>
</div>
