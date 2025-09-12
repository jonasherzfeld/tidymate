<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import { MenuIcon, HouseIcon } from "$lib/utils/icons";
  import MenuBlock from "./MenuBlock.svelte";
  import type { RestrictionType } from "$lib/utils/constants";
  import { getRestrictionType } from "$lib/utils/helpers";
  import { cn } from "$lib/utils";
  import ThemeSwitch from "./ThemeSwitch.svelte";
  import { getContext } from "svelte";

  let {
    children
  }: {
    children: Snippet;
  } = $props();

  const isWebApp: boolean = getContext<() => boolean>("webapp")();

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

<div class="flex flex-col">
  <div
    class={`text-shade-500 navbar border-base-300 bg-base-300 sticky top-0 z-10 ml-0 h-fit w-full border-b border-solid shadow-md ${isWebApp ? "pt-safe-top" : ""}`}>
    <div class={`m-0 flex w-fit p-0 ${isWebApp ? "hidden" : "lg:hidden"}`}>
      <button
        onclick={handleClick}
        class="btn btn-square btn-ghost btn-sm ml-3"
        aria-label="Open Menu">
        <MenuIcon />
      </button>
    </div>
    <Header />
  </div>
  <div class="drawer lg:drawer-open">
    <input
      id="my-drawer-2"
      type="checkbox"
      class="drawer-toggle"
      bind:checked={isDrawerOpen} />

    <div class="drawer-content flex w-full flex-col items-center justify-start">
      <!-- Page content here -->
      <div class="drawer-content flex w-full flex-col">
        {@render children?.()}
      </div>
    </div>
    <div class="drawer-side mt-16 h-main-sidebar lg:mt-0 lg:sticky lg:top-16">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay lg:hidden"
      ></label>
      <ul
        class={`menu border-neutral bg-base-200 h-main-sidebar w-80 justify-between  pt-5 pb-5 overflow-y-auto border-r-[1px] lg:h-main-sidebar ${isWebApp ? "pt-safe-top" : ""}`}>
        <!-- Sidebar content here -->
        <div>
          <li class="text-base">
              <a href="/" onclick={handleClick}
                ><HouseIcon />Home</a>
         </li>
          {#if menuRestriction.includes("logged_in")}
            <div class="mt-2">
              <div class=" border-t-[1px] border-neutral"></div>
              <div class="mt-2 ml-3 text-neutral font-bold">
                <span>Personal</span>
              </div>
            </div>
          {/if}
          <MenuBlock
            position="drawer_top"
            restricted={menuRestriction}
            publicType="private"
            handleClick={isDrawerOpen ? handleClick : undefined} />
          {#if menuRestriction.includes("house_member")}
            <div class="mt-6">
              <div class=" border-t-[1px] border-neutral"></div>
              <div class="mt-2 ml-3 text-neutral font-bold">
                <span>House</span>
              </div>
            </div>
          {/if}
          <MenuBlock
            position="drawer_top"
            restricted={menuRestriction}
            publicType="public"
            handleClick={isDrawerOpen ? handleClick : undefined} />
        </div>
        <div>
          <div class="divider"></div>
          <MenuBlock
            position="drawer_bottom"
            restricted={["none"]}
            publicType="public" />
          <ThemeSwitch />
        </div>
      </ul>
    </div>
  </div>
</div>
