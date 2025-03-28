<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import Logo from "./Logo.svelte";
  import { MenuIcon } from "$lib/utils/icons";
  import MenuBlock from "./MenuBlock.svelte";
  import type { RestrictionType } from "$lib/utils/constants";
  import { getRestrictionType } from "$lib/utils/helpers";
  import RainbowText from "./RainbowText.svelte";
  let {
    isWebApp,
    children
  }: {
    isWebApp: boolean;
    children: Snippet;
  } = $props();

  let isLoggedIn: boolean = $derived($page.data.user ? true : false);
  let isHouseMember: boolean = $derived($page.data.house ? true : false);
  let menuRestriction: RestrictionType[] = $derived(
    getRestrictionType(isLoggedIn, isHouseMember)
  );
  let isDrawerOpen: boolean = $state(false);

  function handleClick() {
    isDrawerOpen = !isDrawerOpen;
  }
</script>

<div class="drawer">
  <input
    id="my-drawer-3"
    type="checkbox"
    class="drawer-toggle"
    bind:checked={isDrawerOpen} />
  <div class="drawer-content flex min-h-screen flex-col">
    <!-- Navbar -->
    <div
      class={`navbar bg-base-300 text-shade-500 border-neutral sticky top-0 z-10 w-full border-b border-solid shadow-md ${isWebApp ? "pt-12" : ""}`}>
      <div class={`m-0 flex w-fit p-0 lg:hidden ${isWebApp ? "hidden" : ""}`}>
        <button
          onclick={handleClick}
          class="btn btn-square btn-ghost ml-3 w-fit"
          aria-label="Open Menu">
          <MenuIcon />
        </button>
      </div>
      <Header />
    </div>
    {@render children?.()}
  </div>

  <div class="drawer-side z-20">
    <button onclick={handleClick} class="drawer-overlay" aria-label="Close Menu"
    ></button>
    <ul
      class={`menu bg-base-300 -ml-3 min-h-full w-80 rounded-md border-r-[1px] p-4 pl-7 ${isWebApp ? "pt-12" : ""}`}>
      <!-- Sidebar content here -->
      <a
        href={isLoggedIn && isHouseMember ? "/home" : "/"}
        class="btn btn-ghost text-xl"
        onclick={handleClick}>
        <Logo width="30px" /><RainbowText>Tidymate</RainbowText></a>
      <MenuBlock
        position="drawer_top"
        restricted={menuRestriction}
        {handleClick} />
      <div class="divider"></div>
      <MenuBlock position="drawer_bottom" restricted={["none"]} {handleClick} />
    </ul>
  </div>
</div>
