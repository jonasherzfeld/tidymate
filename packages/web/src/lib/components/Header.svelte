<script lang="ts">
    import UserCircleOutline from '~icons/mdi/user-circle-outline';
    import HouseCircleOutline from '~icons/mdi/house-circle-outline';
    import InfoIcon from 'virtual:icons/fluent/info-12-regular';
    import DocsIcon from 'virtual:icons/fluent/document-bullet-list-16-regular';
    import SignOut from 'virtual:icons/mdi/sign-out';
    import SignIn from 'virtual:icons/mdi/sign-in';
    import RegisterIcon from 'virtual:icons/mdi/register-outline';
    import TodoIcon from 'virtual:icons/fluent/task-list-square-16-filled';
    import ChoresIcon from 'virtual:icons/fluent/calendar-arrow-counterclockwise-48-filled';
    import { applyAction, enhance } from '$app/forms';
    import { page } from '$app/stores';
    import Logo from './Logo.svelte';
    import AvatarGraphic from './AvatarGraphic.svelte';
    import { HEADER_MAPPING, type HeaderMap } from '$lib/utils/constants';

    let is_logged_in: boolean = $derived($page.data.user ? true : false);
    let is_in_house: boolean = $derived($page.data.house ? true : false);
    let header_title: HeaderMap | undefined = $derived(
        HEADER_MAPPING.find((item) => item.key === $page.route.id)
    );
</script>

<div class="navbar p-0 pl-3 pr-3 min-h-0 flex justify-between">
    <div class="flex w-fit">
        <a href={is_logged_in && is_in_house ? '/home' : '/'} class="btn btn-ghost text-xl p-0">
            <Logo width="30px" /><span class="hidden lg:block">Tidymate</span></a
        >
        {#if is_logged_in && is_in_house}
            <div class="hidden flex-none lg:block">
                <ul class="menu menu-horizontal px-1">
                    <li>
                        <a href="/home/todo"><TodoIcon style="font-size:1.2rem" />To-Dos</a>
                    </li>
                    <li>
                        <a href="/home/chores"><ChoresIcon style="font-size:1.2rem" />Chores</a>
                    </li>
                </ul>
            </div>
        {/if}
    </div>
    <div class="flex-1 -z-10 pl-2 w-fit text-xl font-sans justify-left lg:hidden">
        {#if header_title}
            {header_title.title}
        {/if}
    </div>
    <div class="flex-none gap-2">
        <div class="hidden lg:block">
            <ul class="menu menu-horizontal m-0 p-0">
                <li>
                    <a href="/about"><InfoIcon style="font-size:1.2rem" /> About</a>
                </li>
                <li>
                    <a href="https://tidymate-docs.vercel.app" target="_blank">
                        <DocsIcon style="font-size:1.2rem" /> Documention ↗</a
                    >
                </li>
            </ul>
        </div>
        <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <AvatarGraphic thumbnail={$page.data.user?.thumbnail} height="h-10" width="w-10" />
            </div>
            <ul
                tabindex="-1"
                class="menu menu-xl dropdown-content bg-base-300 rounded-box border shadow-md z-[1] mt-3 w-52 p-2 shadow"
            >
                {#if !is_logged_in}
                    <li class="text-base">
                        <a href="/auth/login" class="justify-left gap-5"
                            ><SignIn style="font-size:1.2em" />Login</a
                        >
                    </li>
                    <li class="text-base">
                        <a href="/auth/register" class="justify-left gap-5"
                            ><RegisterIcon style="font-size:1.2em" /> Register</a
                        >
                    </li>
                {:else}
                    <li class="text-base">
                        <a href="/profile/user" class="justify-left gap-5"
                            ><UserCircleOutline style="font-size:1.2em" /> Your Profile
                        </a>
                    </li>
                    {#if !is_in_house}
                        <li class="text-base">
                            <a href="/auth/register/house" class="justify-left gap-5">
                                <RegisterIcon style="font-size:1.2em" />
                                Register House
                            </a>
                        </li>
                    {:else}
                        <li class="text-base">
                            <a href="/profile/house" class="justify-left gap-5">
                                <HouseCircleOutline style="font-size:1.2em" /> Your House
                            </a>
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
                        <li class="text-base">
                            <button type="submit" class="justify-left gap-5">
                                <SignOut style="font-size:1.2em" /> Logout</button
                            >
                        </li>
                    </form>
                {/if}
            </ul>
        </div>
    </div>
</div>
