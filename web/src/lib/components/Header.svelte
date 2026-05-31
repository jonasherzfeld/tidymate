<script lang="ts">
  import { page } from "$app/stores";
  import Logo from "./Logo.svelte";
  import AvatarGraphic from "./AvatarGraphic.svelte";
  import MenuBlock from "./MenuBlock.svelte";
  import NotificationCenter from "./NotificationCenter.svelte";
  import ThemeSwitch from "./ThemeSwitch.svelte";
  import { type RestrictionType } from "$lib/utils/constants";
  import { getRouteTitle, getRestrictionType } from "$lib/utils/helpers";

  let isLoggedIn: boolean = $derived($page.data.user ? true : false);
  let isHouseMember: boolean = $derived($page.data.house ? true : false);
  let menuRestriction: RestrictionType[] = $derived(getRestrictionType(isLoggedIn, isHouseMember));
  let headerTitle: string | undefined = $derived(getRouteTitle($page.route.id));
  let accountLabel = $derived.by(() => {
    const u = $page.data.user;
    if (!u) return "Account menu";
    const initials = `${u.first_name?.[0] ?? ""}${u.last_name?.[0] ?? ""}`.toUpperCase();
    const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
    return `${initials} — Account menu${name ? ` for ${name}` : ""}`;
  });
</script>

<div class="navbar flex min-h-0 justify-between gap-2 p-0 px-3">
  <!-- Brand -->
  <div class="flex w-fit shrink-0 items-center">
    <a
      href={menuRestriction.includes("house_member") ? "/home" : "/"}
      class="hover:bg-base-200 -ml-1 inline-flex items-center gap-2 rounded-field px-2 py-1.5 transition-colors">
      <Logo width="28px" />
      <span class="text-base-content hidden text-base font-semibold tracking-tight lg:block">
        Tidymate
      </span>
    </a>
  </div>

  <!-- Page title (mobile) -->
  <div class="text-base-content min-w-0 flex-1 truncate pl-1 text-sm font-medium lg:hidden">
    {#if headerTitle}
      {headerTitle}
    {/if}
  </div>

  <!-- Actions -->
  <div class="flex w-fit shrink-0 items-center gap-4">
    {#if isLoggedIn}
      <NotificationCenter notifications={$page.data.notifications} />
    {/if}

    <div class="dropdown dropdown-end">
      <button
        tabindex="0"
        class="hover:ring-primary/40 ring-base-100 flex h-9 w-9 items-center justify-center rounded-full ring-2 transition-shadow"
        aria-label={accountLabel}>
        <AvatarGraphic thumbnail={$page.data.user?.thumbnail} height="h-9" width="w-9" />
      </button>
      <ul
        tabindex="-1"
        class="menu dropdown-content border-neutral bg-base-100 z-[5] mt-2 w-56 rounded-box border p-1.5 shadow-[var(--shadow-lg)]">
        {#if isLoggedIn && $page.data.user}
          <div class="flex flex-col px-3 py-2 gap-0.5 active:!bg-transparent">
            <span class="text-base-content text-sm font-medium">
              {$page.data.user.first_name}
              {$page.data.user.last_name}
            </span>
            <span class="text-muted text-xs">{$page.data.user.email}</span>
          </div>
          <li class="border-neutral my-1 border-t"></li>
        {/if}
        <MenuBlock position="avatar_dropdown" restricted={menuRestriction} />
        {#if isLoggedIn}
          <li class="border-neutral my-1 border-t"></li>
          <ThemeSwitch />
        {/if}
      </ul>
    </div>
  </div>
</div>
