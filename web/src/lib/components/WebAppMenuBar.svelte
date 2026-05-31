<script lang="ts">
  import { page } from "$app/stores";
  import { ROUTE_MAPPING, type RestrictionType } from "$lib/utils/constants";
  import { getRestrictionType } from "$lib/utils/helpers";
  import { cn } from "$lib/utils";

  let isLoggedIn: boolean = $derived($page.data.user ? true : false);
  let isInHouse: boolean = $derived($page.data.house ? true : false);
  let restrictionType: RestrictionType[] = $derived(getRestrictionType(isLoggedIn, isInHouse));

  let menuItems = $derived(
    ROUTE_MAPPING.filter(
      (item) =>
        item.position.includes("menu") &&
        (restrictionType.includes(item.restricted) || item.restricted === "none")
    )
  );

  function isActive(url: string): boolean {
    const path = $page.url.pathname;
    if (url === "/home") return path === "/home";
    return path.startsWith(url);
  }
</script>

<nav
  class="bg-base-100 border-neutral h-[calc(theme(spacing.webapp-menu)+env(safe-area-inset-bottom))] fixed right-0 bottom-0 left-0 z-20 flex items-center justify-around border-t px-3 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-md)]">
  {#each menuItems as item}
    {@const active = isActive(item.url)}
    <a
      href={item.url}
      target={item.target}
      class={cn(
        "flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors",
        active ? "text-primary" : "text-muted hover:text-base-content"
      )}>
      <span
        class={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all",
          active && "bg-primary/10"
        )}>
        <item.icon class="h-5 w-5" />
      </span>
      <span class="text-[10px] font-medium">{item.title}</span>
    </a>
  {/each}
</nav>
