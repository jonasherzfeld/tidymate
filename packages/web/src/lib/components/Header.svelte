<script>
    import UserCircleOutline from '~icons/mdi/user-circle-outline';
    import HouseCircleOutline from '~icons/mdi/house-circle-outline';
    import InfoIcon from 'virtual:icons/fluent/info-12-regular';
    import DocsIcon from 'virtual:icons/fluent/document-bullet-list-16-regular';
    import SignOut from 'virtual:icons/mdi/sign-out';
    import SignIn from 'virtual:icons/mdi/sign-in';
    import RegisterIcon from 'virtual:icons/mdi/register-outline';
    import TodoIcon from 'virtual:icons/fluent/task-list-square-16-filled';
    import ChoresIcon from 'virtual:icons/fluent/calendar-arrow-counterclockwise-48-filled';

    import Unknown from '$lib/img/Unknown_person.jpg';
    let name_initials = $derived($page.data.user?.first_name?.charAt(0).toUpperCase() + $page.data.user?.last_name?.charAt(0).toUpperCase())

    import { applyAction, enhance } from '$app/forms';
    import { page } from '$app/stores';
    import Logo from '$lib/img/tidymate_logo_white.png';
    import AvatarGraphic from './AvatarGraphic.svelte';

    let is_logged_in = $derived($page.data.user? true : false);
    let is_in_house = $derived($page.data.house? true : false);
</script>

<div class="navbar p-0 pe-2 min-h-0">
    <div class="flex-1">
        <a href={is_logged_in && is_in_house? '/home' : '/'} class="btn btn-ghost text-xl">
            <img alt="User" src={Logo} width="30px" />Tidymate</a
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
                <AvatarGraphic height="h-10" width="w-10" />
            </div>
            <ul
                tabindex="-1"
                class="menu menu-xl dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
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
                            <a href="/auth/register/group" class="justify-left gap-5">
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
