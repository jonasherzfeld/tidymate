<script>
    import 'tailwindcss/tailwind.css';

    import { applyAction, enhance } from '$app/forms';
    import { page } from '$app/stores';
    import Avatar from '$lib/img/teamavatar.png';
    import Unknown from '$lib/img/Unknown_person.jpg';
    import Logo from '$lib/img/tidymate_logo_white.png';

    // this is for later in TypeScript
    // type NavLink = {
    // 	title: string;
    // 	href: string;
    // };
    export let nav_links = [];
    //const Avatar = 'https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp';
</script>

<div class="navbar">
    <div class="flex-1">
        <a href="/" class="btn btn-ghost text-xl">
            <img alt="User" src={Logo} width="30px" />Tidymate</a
        >
        <div class="hidden flex-none lg:block">
            <ul class="menu menu-horizontal px-1">
                {#each nav_links as link}
                    <li><a href={link.href}>{link.title}</a></li>
                {/each}
            </ul>
        </div>
    </div>
    <div class="flex-none gap-2">
        <ul class="menu menu-horizontal px-1">
            <li><a href="/about">About</a></li>
            <li><a href="https://tidymate-docs.vercel.app" target="_blank">Documention ↗</a></li>
        </ul>
        <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                    {#if !$page.data.user}
                        <img alt="User" src={Unknown} />
                    {:else}
                        <img
                            alt="User"
                            src={$page.data.user.thumbnail ? $page.data.user.thumbnail : Avatar}
                        />
                    {/if}
                </div>
            </div>
            <ul
                tabindex="0"
                class="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
                {#if !$page.data.user}
                    <li><a href="/auth/login">Login</a></li>
                    <li><a href="/auth/register">Register</a></li>
                {:else}
                    <li>
                        <a href="/profile/user" class="justify-between"> Profile </a>
                    </li>
                    {#if !$page.data.user.house_id}
                        <li>
                            <a href="/auth/register/group" class="justify-between">
                                Register House
                            </a>
                        </li>
                    {:else}
                        <li>
                            <a href="/profile/house" class="justify-between"> House </a>
                        </li>
                    {/if}

                    <form
                        action="/auth/logout"
                        method="POST"
                        use:enhance={async () => {
                            return async ({ result }) => {
                                await applyAction(result);
                            };
                        }}
                    >
                        <!-- <li><a href="/auth/logout">Logout</a></li> -->
                        <li><button type="submit">Logout</button></li>
                    </form>
                {/if}
            </ul>
        </div>
    </div>
</div>
