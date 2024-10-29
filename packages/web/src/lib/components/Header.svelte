<script>
    import 'tailwindcss/tailwind.css';

    import { applyAction, enhance } from '$app/forms';
    import { page } from '$app/stores';
    import Unknown from '$lib/img/Unknown_person.jpg';
    import Logo from '$lib/img/tidymate_logo_white.png';
    import { NAV_LINKS } from '$lib/utils/constants';

    let is_logged_in = $derived($page.data.user ? true : false);
</script>

<div class="navbar p-0 pe-2 min-h-0">
    <div class="flex-1">
        <a href={is_logged_in ? '/home' : '/'} class="btn btn-ghost text-xl">
            <img alt="User" src={Logo} width="30px" />Tidymate</a
        >
        {#if is_logged_in}
            <div class="hidden flex-none lg:block">
                <ul class="menu menu-horizontal px-1">
                    {#each NAV_LINKS as link}
                        <li><a href={link.href}>{link.title}</a></li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
    <div class="flex-none gap-2">
        <div class="hidden lg:block">
            <ul class="menu menu-horizontal m-0 p-0">
                <li>
                    <a href="/about">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                            />
                        </svg>

                        About</a
                    >
                </li>
                <li>
                    <a href="https://tidymate-docs.vercel.app" target="_blank">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="size-6"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                        </svg>
                        Documention ↗</a
                    >
                </li>
            </ul>
        </div>
        <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <div class=" mask mask-squircle h-10 w-10">
                    {#if !$page.data.user}
                        <img alt="User" src={Unknown} />
                    {:else}
                        <img
                            alt="User"
                            src={$page.data.user.thumbnail ? $page.data.user.thumbnail : Unknown}
                        />
                    {/if}
                </div>
            </div>
            <ul
                tabindex="-1"
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
                        <li><button type="submit">Logout</button></li>
                    </form>
                {/if}
            </ul>
        </div>
    </div>
</div>
