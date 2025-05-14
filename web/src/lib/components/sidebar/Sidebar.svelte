<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import Header from "$lib/components/Header.svelte";
  import { MenuIcon } from "$lib/utils/icons";
  import MenuBlock from "$lib/components/MenuBlock.svelte";
  import type { RestrictionType } from "$lib/utils/constants";
  import { getRestrictionType } from "$lib/utils/helpers";
  import { cn } from "$lib/utils";
  import ThemeSwitch from "$lib/components/ThemeSwitch.svelte";
  import { getContext } from "svelte";
  import { SIDEBAR_COOKIE_NAME, SIDEBAR_COOKIE_MAX_AGE } from "./constants";
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { is } from "superstruct";

  let {
    children
  }: {
    children: Snippet;
  } = $props();

  const isWebApp: boolean = getContext("webapp");

  let form: HTMLFormElement;

  let isLoggedIn: boolean = $derived(page.data.user ? true : false);
  let isHouseMember: boolean = $derived(page.data.house ? true : false);
  let menuRestriction: RestrictionType[] = $derived(
    getRestrictionType(isLoggedIn, isHouseMember)
  );
  const initialSidebarState: string | null = $derived(page.data.sidebarState);
  let isDrawerOpen: boolean = $derived(initialSidebarState === "true");
  $inspect(isDrawerOpen, "isDrawerOpen", page.data.sidebarState, "cookie");

  function toggleSidebar() {
    isDrawerOpen = !isDrawerOpen;
    console.log(
      `/?/set_sidebar&${SIDEBAR_COOKIE_NAME}=${isDrawerOpen}&redirectTo=${
        page.url.pathname
      }`
    );
    form.requestSubmit();
  }

  const HEADER_HIGHT = "4rem";
  console.log("INITIAL SIDEBAR STATE", isDrawerOpen);
</script>

<form
  bind:this={form}
  method="POST"
  action="/?/set_sidebar&{SIDEBAR_COOKIE_NAME}={isDrawerOpen}&redirectTo={page
    .url.pathname}"
  class="hidden">
</form>

<div class="flex flex-col">
  <div
    class={`text-shade-500 navbar border-base-300 bg-base-300 sticky top-0 z-10 ml-0 h-16 w-full border-b border-solid shadow-md ${isWebApp ? "pt-12" : ""}`}>
    <div class={`m-0 flex w-fit p-0 ${isWebApp ? "hidden" : ""}`}>
      <button
        onclick={toggleSidebar}
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
        <div class="lg:hidden">
          <MenuBlock
            position="drawer_top"
            restricted={menuRestriction}
            handleClick={toggleSidebar} />
        </div>
        <div class="hidden lg:block">
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
</div>
