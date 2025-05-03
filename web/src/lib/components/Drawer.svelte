<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import { MenuIcon } from "$lib/utils/icons";
  import MenuBlock from "./MenuBlock.svelte";
  import type { RestrictionType } from "$lib/utils/constants";
  import { getRestrictionType } from "$lib/utils/helpers";
  import { cn } from "$lib/utils";
  import ThemeSwitch from "./ThemeSwitch.svelte";

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

<div class="drawer flex flex-col">
  <input
    id="my-drawer-3"
    type="checkbox"
    class="drawer-toggle"
    bind:checked={isDrawerOpen} />

  <!-- Navbar (Header stays stationary) -->
  <div
    class={`text-shade-500 border-solidshadow-md navbar sticky top-0 z-10 ml-0 w-full border-b border-base-300 bg-base-300 ${isWebApp ? "pt-12" : ""}`}>
    <div class={`m-0 flex w-fit p-0 ${isWebApp ? "hidden" : ""}`}>
      <button
        onclick={handleClick}
        class="btn btn-square btn-ghost btn-sm ml-3"
        aria-label="Open Menu">
        <MenuIcon />
      </button>
    </div>
    <Header />
  </div>

  <!-- Main Content (Moves with the drawer on large screens) -->
  <div
    class={cn("drawer-content flex flex-col ", isDrawerOpen && "drawer-open")}>
    {@render children?.()}
  </div>

  <!-- Drawer Sidebar -->

  <div class="drawer-side z-20">
    <label
      for="my-drawer-3"
      aria-label="close sidebar"
      class="drawer-overlay w-full lg:hidden"></label>

    <ul
      class={`menu -ml-3 min-h-full w-80 justify-between rounded-md border-r-[1px] border-neutral bg-base-200  p-4 pl-7 ${isWebApp ? "pt-12" : ""}`}>
      <!-- Sidebar content here -->
      <div class="mt-16 lg:hidden">
        <MenuBlock
          position="drawer_top"
          restricted={menuRestriction}
          {handleClick} />
      </div>
      <div class="mt-16 hidden lg:block">
        <MenuBlock position="drawer_top" restricted={menuRestriction} />
      </div>
      <div>
        <div class="divider"></div>
        <MenuBlock position="drawer_bottom" restricted={["none"]} />
        <ThemeSwitch />
      </div>
    </ul>
  </div>
</div>

<style>
  .drawer-content {
    /* transition: margin-left 0.3s ease; */
    margin-left: 0;
  }

  .drawer-open {
    margin-left: 19rem; /* Adjust this value to match the drawer width */
  }

  .navbar {
    z-index: 50; /* Ensure the navbar stays above the drawer */
  }

  /* Media query for large displays */
  @media (max-width: 1024px) {
    .drawer-open {
      margin-left: 0 !important; /* Disable drawer movement on smaller screens */
    }
  }
</style>
