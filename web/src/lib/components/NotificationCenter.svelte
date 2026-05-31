<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import {
    BellIcon,
    ChoresIcon,
    DeleteIcon,
    GeneralIcon,
    ReminderIcon,
    TodoIcon
  } from "$lib/utils/icons";
  import { IconButton } from "$lib/components/ui";
  import { cn } from "$lib/utils";

  let {
    notifications = $bindable([])
  }: {
    notifications: Notification[];
  } = $props();

  let serverErrors: string = $state("");

  let numUnread = $derived(notifications.filter((n) => !n.is_viewed && !n.is_removed).length);
  let visible = $derived(
    [...notifications]
      .filter((n) => !n.is_removed)
      .sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime())
  );

  function isToday(d: string) {
    const date = new Date(d);
    const now = new Date();
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  }

  let todayItems = $derived(visible.filter((n) => isToday(n.created_on)));
  let earlierItems = $derived(visible.filter((n) => !isToday(n.created_on)));
  let bellLabel = $derived(numUnread > 0 ? `Notifications, ${numUnread} unread` : "Notifications");

  function handleViewNotification() {
    return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
      await update();
      if (result.type === "success" && result.data?.href) {
        await goto(result.data.href);
      }
    };
  }

  function iconFor(type: string) {
    if (type === "reminder") return ReminderIcon;
    if (type === "todo") return TodoIcon;
    if (type === "chore") return ChoresIcon;
    return GeneralIcon;
  }

  function formatTime(dateStr: string) {
    try {
      const d = new Date(dateStr);
      if (isToday(dateStr)) {
        return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      }
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return "";
    }
  }
</script>

<div class="dropdown dropdown-bottom dropdown-end">
  <IconButton
    variant="ghost"
    size="sm"
    aria-label={bellLabel}
    class="relative"
    onclick={(e) => e.currentTarget.focus()}>
    {#if numUnread > 0}
      <span
        aria-hidden="true"
        class="bg-accent ring-base-100 text-accent-content absolute -top-0.5 -right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold ring-2">
        {numUnread > 9 ? "9+" : numUnread}
      </span>
    {/if}
    <BellIcon class="h-4 w-4" />
  </IconButton>

  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <div
    tabindex="0"
    class="dropdown-content bg-base-100 border-neutral rounded-box z-[5] mt-2 w-80 overflow-hidden border shadow-[var(--shadow-lg)]">
    <div class="border-neutral flex items-center justify-between border-b px-4 py-3">
      <div>
        <div class="text-base-content text-sm font-semibold">Notifications</div>
        <div class="text-muted text-xs">
          {numUnread > 0 ? `${numUnread} unread` : "All caught up"}
        </div>
      </div>
      {#if visible.length > 0}
        <form action="/?/delete_all_notifications" method="POST" use:enhance>
          <button
            class="text-muted hover:text-base-content text-xs font-medium transition-colors"
            type="submit"
            aria-label="Clear all">
            Clear all
          </button>
        </form>
      {/if}
    </div>

    <div class="max-h-[60vh] overflow-y-auto">
      {#if serverErrors}
        <div class="text-error px-4 py-2 text-sm">{serverErrors}</div>
      {/if}

      {#if visible.length === 0}
        <div class="text-muted flex flex-col items-center gap-2 px-4 py-8 text-sm">
          <BellIcon class="h-6 w-6 opacity-40" />
          You have no notifications
        </div>
      {/if}

      {#each [{ title: "Today", items: todayItems }, { title: "Earlier", items: earlierItems }] as group}
        {#if group.items.length > 0}
          <div
            class="text-muted bg-base-200/60 px-4 py-1.5 text-[10px] font-semibold tracking-wider uppercase">
            {group.title}
          </div>
          {#each group.items as notification}
            {@const Icon = iconFor(notification.item_type)}
            <form
              method="POST"
              use:enhance={handleViewNotification}
              class={cn(
                "border-neutral border-b last:border-0",
                !notification.is_viewed && "bg-primary/[0.03]"
              )}>
              <input type="hidden" name="id" value={notification.id} />
              <div class="hover:bg-base-200 flex items-start gap-3 px-4 py-3 transition-colors">
                <button
                  type="submit"
                  class="flex flex-1 items-start gap-3 text-left"
                  formaction="/?/view_notification"
                  aria-label="View notification">
                  <div
                    class="bg-base-200 text-base-content/70 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <Icon class="h-4 w-4" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <span class="text-base-content truncate text-sm font-medium">
                        {notification.name}
                      </span>
                      {#if !notification.is_viewed}
                        <span class="bg-primary inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        ></span>
                      {/if}
                    </div>
                    <p class="text-muted mt-0.5 line-clamp-2 text-xs">
                      {notification.description}
                    </p>
                    <p class="text-muted/70 mt-1 text-[10px]">
                      {formatTime(notification.created_on)}
                    </p>
                  </div>
                </button>
                <button
                  class="text-muted hover:text-error rounded-field -m-1 inline-flex h-7 w-7 items-center justify-center transition-colors"
                  type="submit"
                  aria-label="Delete notification"
                  formaction="/?/delete_notification">
                  <DeleteIcon class="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          {/each}
        {/if}
      {/each}
    </div>
  </div>
</div>
