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
  import { getContext } from "svelte";

  let {
    children
  }: {
    children: Snippet;
  } = $props();

  const isWebApp: boolean = getContext("webapp");

  let isLoggedIn: boolean = $derived($page.data.user ? true : false);
  let isHouseMember: boolean = $derived($page.data.house ? true : false);
  let menuRestriction: RestrictionType[] = $derived(
    getRestrictionType(isLoggedIn, isHouseMember)
  );
  let isDrawerOpen: boolean = $state(false);

  function handleClick() {
    isDrawerOpen = !isDrawerOpen;
  }
  const HEADER_HIGHT = "4rem";
</script>

<div class="flex flex-col">
  <div
    class={`text-shade-500 navbar border-base-300 bg-base-300 sticky top-0 z-10 ml-0 h-fit w-full border-b border-solid shadow-md ${isWebApp ? "pt-12" : ""}`}>
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
  <div class={cn("drawer", isDrawerOpen ? "lg:drawer-open" : "")}>
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
    <div class="drawer-side mt-16 h-[calc(100vh-4rem)] lg:mt-0">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"
      ></label>
      <ul
        class={`menu border-neutral bg-base-200 h-[calc(100vh-4rem)] w-80 justify-between  overflow-y-auto border-r-[1px]  ${isWebApp ? "pt-12" : ""}`}>
        <!-- Sidebar content here -->
        <div class="mt-4 lg:hidden">
          {#if menuRestriction.includes("logged_in")}
            <div class="ml-3 font-mono">
              <span>Personal</span>
            </div>
          {/if}
          <MenuBlock
            position="drawer_top"
            restricted={menuRestriction}
            publicType="private"
            {handleClick} />
          {#if menuRestriction.includes("house_member")}
            <div class="ml-3 mt-6 font-mono">
              <span>House</span>
            </div>
          {/if}
          <MenuBlock
            position="drawer_top"
            restricted={menuRestriction}
            publicType="public"
            {handleClick} />
        </div>
        <div class="mt-4 hidden lg:block">
          {#if menuRestriction.includes("logged_in")}
            <div class="ml-3 font-mono">
              <span>Personal</span>
            </div>
          {/if}
          <MenuBlock
            position="drawer_top"
            restricted={menuRestriction}
            publicType="private" />
          {#if menuRestriction.includes("house_member")}
            <div class="ml-3 mt-6 font-mono">
              <span>House</span>
            </div>
          {/if}
          <MenuBlock
            position="drawer_top"
            restricted={menuRestriction}
            publicType="public" />
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
