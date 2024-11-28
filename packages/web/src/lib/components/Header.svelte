<script lang="ts">
    import { page } from '$app/stores';
    import Logo from './Logo.svelte';
    import AvatarGraphic from './AvatarGraphic.svelte';
    import { type RestrictionType } from '$lib/utils/constants';
    import MenuBlock from './MenuBlock.svelte';
    import { getRouteTitle, getRestrictionType } from '$lib/utils/helpers';
    import RainbowText from './RainbowText.svelte';

    let isLoggedIn: boolean = $derived($page.data.user ? true : false);
    let isHouseMember: boolean = $derived($page.data.house ? true : false);
    let menuRestriction: RestrictionType[] = $derived(
        getRestrictionType(isLoggedIn, isHouseMember)
    );
    let headerTitle: string | undefined = $derived(getRouteTitle($page.route.id));
</script>

<div class="navbar p-0 pl-3 pr-3 min-h-0 flex justify-between">
    <div class="flex w-fit">
        <a
            href={menuRestriction.includes('house_member') ? '/home' : '/'}
            class="btn btn-ghost hover:bg-transparent text-xl p-0 mr-2"
        >
            <Logo width="30px" /><span class="hidden lg:block"><RainbowText>Tidymate</RainbowText></span></a
        >
        <div class="hidden lg:block">
            <ul class="menu menu-horizontal m-0 p-0">
                <MenuBlock position="header_left" restricted={menuRestriction} />
            </ul>
        </div>
    </div>
    <div class="flex-1 -z-10 pl-2 w-fit text-xl font-sans justify-left lg:hidden">
        {#if headerTitle}
            {headerTitle}
        {/if}
    </div>
    <div class="flex-none gap-2">
        <div class="hidden lg:block">
            <ul class="menu menu-horizontal m-0 p-0">
                <MenuBlock position="header_right" restricted={['none']} />
            </ul>
        </div>
        <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
                <AvatarGraphic thumbnail={$page.data.user?.thumbnail} height="h-10" width="w-10" />
            </div>
            <ul
                tabindex="-1"
                class="menu menu-xl dropdown-content bg-base-300 rounded-box border shadow-md z-[1] mt-3 w-52 p-2"
            >
                <MenuBlock position="avatar_dropdown" restricted={menuRestriction} />
            </ul>
        </div>
    </div>
</div>
