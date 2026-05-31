<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/stores";
  import Header from "$lib/components/Header.svelte";
  import { MenuIcon } from "$lib/utils/icons";
  import { ROUTE_MAPPING, type RestrictionType } from "$lib/utils/constants";
  import { getRestrictionType } from "$lib/utils/helpers";
  import { cn } from "$lib/utils";
  import { getContext } from "svelte";

  let { children }: { children: Snippet } = $props();

  const isWebApp: boolean = getContext<() => boolean>("webapp")();

  let isLoggedIn: boolean = $derived($page.data.user ? true : false);
  let isHouseMember: boolean = $derived($page.data.house ? true : false);
  let menuRestriction: RestrictionType[] = $derived(getRestrictionType(isLoggedIn, isHouseMember));
  let isDrawerOpen: boolean = $state(false);

  // Sidebar entries: house section + personal section, with active highlight.
  let houseItems = $derived(
    ROUTE_MAPPING.filter(
      (item) =>
        item.position.includes("drawer_top") &&
        item.publicType === "public" &&
        (menuRestriction.includes(item.restricted) || item.restricted === "none")
    )
  );
  let personalItems = $derived(
    ROUTE_MAPPING.filter(
      (item) =>
        item.position.includes("drawer_top") &&
        item.publicType === "private" &&
        (menuRestriction.includes(item.restricted) || item.restricted === "none")
    )
  );
  let bottomItems = $derived(
    ROUTE_MAPPING.filter((item) => item.position.includes("drawer_bottom"))
  );

  function isActive(url: string): boolean {
    const path = $page.url.pathname;
    if (url === "/home") return path === "/home";
    return path.startsWith(url);
  }

  function close() {
    isDrawerOpen = false;
  }
</script>

<div class="flex flex-col">
  <!-- Top bar -->
  <div
    class={cn(
      "navbar bg-base-100 border-neutral sticky top-0 z-10 h-fit w-full border-b shadow-[var(--shadow-xs)]",
      isWebApp && "pt-safe-top"
    )}>
    <div class={cn("flex w-fit", isWebApp ? "hidden" : "lg:hidden")}>
      <button
        onclick={() => (isDrawerOpen = !isDrawerOpen)}
        class="hover:bg-base-200 rounded-field ml-2 inline-flex h-9 w-9 items-center justify-center transition-colors"
        aria-label="Open menu">
        <MenuIcon class="h-5 w-5" />
      </button>
    </div>
    <Header />
  </div>

  <div class="drawer lg:drawer-open">
    <input
      id="my-drawer-2"
      type="checkbox"
      class="drawer-toggle"
      aria-label="Toggle navigation menu"
      bind:checked={isDrawerOpen} />

    <div class="drawer-content flex w-full flex-col items-center justify-start">
      <main class="drawer-content flex w-full flex-col">
        {@render children?.()}
      </main>
    </div>

    <!-- Sidebar -->
    <div class="drawer-side h-main-sidebar mt-16 lg:sticky lg:top-16 lg:mt-0">
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay lg:hidden"></label>

      <aside
        class={cn(
          "bg-base-100 border-neutral h-main-sidebar flex w-72 flex-col justify-between gap-4 overflow-y-auto border-r p-4",
          isWebApp && "pt-safe-top"
        )}>
        <nav class="flex flex-col gap-1">
          {#if personalItems.length > 0}
            <div
              class="text-muted px-3 pt-2 pb-1 text-[10px] font-semibold tracking-wider uppercase">
              Personal
            </div>
            {#each personalItems as item}
              <a
                href={item.url}
                target={item.target}
                onclick={close}
                class={cn(
                  "rounded-field flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                  isActive(item.url)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-base-content hover:bg-base-200"
                )}>
                <item.icon class="h-4 w-4" />
                {item.title}
              </a>
            {/each}
          {/if}

          {#if houseItems.length > 0}
            <div
              class="text-muted px-3 pt-4 pb-1 text-[10px] font-semibold tracking-wider uppercase">
              House
            </div>
            {#each houseItems as item}
              <a
                href={item.url}
                target={item.target}
                onclick={close}
                class={cn(
                  "rounded-field flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                  isActive(item.url)
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-base-content hover:bg-base-200"
                )}>
                <item.icon class="h-4 w-4" />
                {item.title}
              </a>
            {/each}
          {/if}
        </nav>

        <div class="border-neutral border-t pt-3">
          {#each bottomItems as item}
            <a
              href={item.url}
              target={item.target}
              class="text-muted hover:bg-base-200 hover:text-base-content rounded-field flex items-center gap-3 px-3 py-2 text-sm transition-colors">
              <item.icon class="h-4 w-4" />
              {item.title}
            </a>
          {/each}
        </div>
      </aside>
    </div>
  </div>
</div>
