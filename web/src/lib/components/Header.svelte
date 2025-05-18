<script lang="ts">
  import { page } from "$app/stores";
  import Logo from "./Logo.svelte";
  import AvatarGraphic from "./AvatarGraphic.svelte";
  import { type RestrictionType } from "$lib/utils/constants";
  import MenuBlock from "./MenuBlock.svelte";
  import { getRouteTitle, getRestrictionType } from "$lib/utils/helpers";
  import RainbowText from "./RainbowText.svelte";

  let isLoggedIn: boolean = $derived($page.data.user ? true : false);
  let isHouseMember: boolean = $derived($page.data.house ? true : false);
  let menuRestriction: RestrictionType[] = $derived(
    getRestrictionType(isLoggedIn, isHouseMember)
  );
  let headerTitle: string | undefined = $derived(getRouteTitle($page.route.id));
</script>

<div class="navbar flex min-h-0 justify-between p-0 pl-3 pr-3">
  <div class="flex w-fit">
    <a
      href={menuRestriction.includes("house_member") ? "/home" : "/"}
      class="btn btn-ghost mr-2 p-0 text-xl hover:bg-transparent">
      <Logo width="30px" /><span class="hidden lg:block"
        ><RainbowText plain>Tidymate</RainbowText></span
      ></a>
  </div>
  <div class="justify-left -z-10 w-fit flex-1 pl-2 font-sans text-xl lg:hidden">
    {#if headerTitle}
      {headerTitle}
    {/if}
  </div>
  <div class="flex-none gap-2">
    <div class="hidden lg:block">
      <ul class="menu menu-horizontal m-0 p-0">
        <MenuBlock position="header_right" restricted={["none"]} />
      </ul>
    </div>
    <div class="dropdown dropdown-end">
      <div
        tabindex="0"
        role="button"
        class="avatar btn btn-circle btn-ghost hover:bg-secondary">
        <AvatarGraphic
          thumbnail={$page.data.user?.thumbnail}
          height="h-10"
          width="w-10" />
      </div>
      <ul
        tabindex="-1"
        class="menu-xl md menu dropdown-content rounded-box border-neutral bg-base-300 z-[1] mt-3 w-52 p-2 shadow-md">
        <MenuBlock position="avatar_dropdown" restricted={menuRestriction} />
      </ul>
    </div>
  </div>
</div>
