<script lang="ts">
    import type { Snippet } from 'svelte';
    import { page } from '$app/stores';

    import Header from '$lib/components/Header.svelte';
    import Logo from '$lib/img/tidymate_logo_white.png';
    import TodoIcon from 'virtual:icons/fluent/task-list-square-16-filled';
    import ChoresIcon from 'virtual:icons/fluent/calendar-arrow-counterclockwise-48-filled';
    import InfoIcon from 'virtual:icons/fluent/info-12-regular';
    import DocsIcon from 'virtual:icons/fluent/document-bullet-list-16-regular';


    type Props = {
        children: Snippet
    }
    let { children }: Props = $props();

    let is_logged_in = $derived($page.data.user ? true : false);
    let is_in_house = $derived($page.data.house? true : false);

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
                <button
                    onclick={handleClick}
                    class="btn btn-square btn-ghost"
                    aria-label="Open Menu"
                >
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
        <button onclick={handleClick} class="drawer-overlay" aria-label="Close Menu"></button>
        <ul class="menu bg-base-200 min-h-full w-80 p-4">
            <!-- Sidebar content here -->
            <a
                href={is_logged_in && is_in_house ? '/home' : '/'}
                class="btn btn-ghost text-xl"
                onclick={handleClick}
            >
                <img alt="User" src={Logo} width="30px" />Tidymate</a
            >
            {#if is_logged_in && is_in_house}
                <li class="text-base">
                    <a href="/home/todo" onclick={handleClick}><TodoIcon style="font-size:1.2rem" />To-Dos</a>
                </li>
                <li class="text-base">
                    <a href="/home/chores" onclick={handleClick}><ChoresIcon style="font-size:1.2rem" />Chores</a>
                </li>
                <div class="divider"></div>
            {/if}
                <li><a href='/about' onclick={handleClick}><InfoIcon style="font-size:1.2rem" /> About</a></li>
                <li><a href='https://tidymate-docs.vercel.app' onclick={handleClick} target="_blank"><DocsIcon style="font-size:1.2rem" />Documention ↗</a></li>
        </ul>
    </div>
</div>
