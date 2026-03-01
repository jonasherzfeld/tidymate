<script lang="ts">
  import { page } from "$app/state";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import {
    DeleteIcon,
    ReminderIcon,
    TodoIcon,
    ChoresIcon,
    GeneralIcon,
    BellIcon
  } from "$lib/utils/icons";
  import {
    isPushSupported,
    getExistingSubscription,
    subscribeToPush,
    unsubscribeFromPush
  } from "$lib/utils/pushNotifications";

  let pushSupported: boolean = $state(false);
  let pushSubscribed: boolean = $state(false);
  let pushLoading: boolean = $state(false);

  if (browser) {
    pushSupported = isPushSupported();
    if (pushSupported) {
      getExistingSubscription().then((sub) => {
        pushSubscribed = !!sub;
      });
    }
  }

  async function togglePush() {
    pushLoading = true;
    try {
      if (pushSubscribed) {
        const success = await unsubscribeFromPush();
        if (success) pushSubscribed = false;
      } else {
        const success = await subscribeToPush();
        if (success) pushSubscribed = true;
      }
    } finally {
      pushLoading = false;
    }
  }

  let sortedNotifications = $derived(
    [...(page.data.notifications || [])]
      .filter((n: Notification) => !n.is_removed)
      .sort(
        (a: Notification, b: Notification) =>
          new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
      )
  );

  function handleViewNotification() {
    return async ({
      result,
      update
    }: {
      result: any;
      update: () => Promise<void>;
    }) => {
      await update();

      if (result.type === "success" && result.data?.href) {
        await goto(result.data.href);
      }
    };
  }

  function formatDate(dateStr: string): string {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return dateStr;
    }
  }

  function getNotificationIcon(description: string): typeof ReminderIcon {
    if (description.includes("Reminder")) return ReminderIcon;
    if (description.includes("Todo")) return TodoIcon;
    if (description.includes("Chore")) return ChoresIcon;
    return GeneralIcon;
  }
</script>

<div
  class="bg-base-100 flex min-h-full w-full flex-1 items-start justify-center">
  <div
    class="mt-5 flex w-full max-w-screen-lg flex-1 flex-col justify-center gap-5 p-4">
    <div class="flex flex-row items-center gap-2">
      <h1 class="flex grow items-center gap-2 text-lg font-bold">
        <BellIcon class="h-5 w-5" />
        Notifications
      </h1>
      <form
        action="/home/notifications?/delete_all_notifications"
        method="POST"
        use:enhance>
        <button
          class="btn btn-outline btn-sm rounded-md border-neutral-200 shadow-sm"
          type="submit"
          aria-label="Clear all notifications">
          Clear All
        </button>
      </form>
    </div>

    <div class="flex flex-1 flex-col gap-2">
      {#if sortedNotifications.length === 0}
        <div class="flex items-center justify-center p-8 opacity-60">
          No notifications
        </div>
      {/if}
      {#each sortedNotifications as notification}
        <div class="flex w-full">
          <div
            class="card card-bordered border-neutral bg-base-300 flex h-fit w-full flex-row items-start justify-between rounded-lg p-2 shadow-sm">
            <form
              class="flex min-w-0 grow"
              method="POST"
              use:enhance={handleViewNotification}>
              <button
                class="flex w-full items-center gap-3 text-left"
                type="submit"
                aria-label="View Notification"
                formaction="/home/notifications?/view_notification">
                <div class="flex h-full w-fit items-center justify-start pl-1">
                  {#if notification.description.includes("Reminder")}
                    <ReminderIcon class="h-5 w-5 opacity-50" />
                  {:else if notification.description.includes("Todo")}
                    <TodoIcon class="h-5 w-5 opacity-50" />
                  {:else if notification.description.includes("Chore")}
                    <ChoresIcon class="h-5 w-5 opacity-50" />
                  {:else}
                    <GeneralIcon class="h-5 w-5 opacity-50" />
                  {/if}
                </div>
                <div
                  class="justify-left flex h-fit min-w-0 grow flex-col gap-1 pr-2 pl-2 text-left">
                  <div class="flex flex-row items-center gap-2">
                    <h2 class="text-x mt-0 flex items-start pt-0">
                      {notification.name}
                    </h2>
                    {#if !notification.is_viewed}
                      <span class="badge badge-secondary badge-xs">New</span>
                    {/if}
                  </div>
                  <div class="flex flex-row items-center">
                    <span class="text-xs font-medium text-neutral-500">
                      {notification.description}
                    </span>
                  </div>
                  <div class="flex flex-row items-center">
                    <span class="text-xs text-neutral-400">
                      {formatDate(notification.created_on)}
                    </span>
                  </div>
                </div>
              </button>
              <input type="hidden" name="id" value={notification.id} />
            </form>
            <div class="flex h-full w-fit items-start justify-end">
              <form method="POST" use:enhance>
                <input type="hidden" name="id" value={notification.id} />
                <button
                  class="btn btn-ghost btn-xs btn-square border-neutral"
                  type="submit"
                  aria-label="Delete Notification"
                  formaction="/home/notifications?/delete_notification">
                  <DeleteIcon class="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      {/each}
    </div>

    {#if pushSupported}
      <div class="mt-2">
        <button
          class="btn btn-outline btn-sm rounded-md border-neutral-200 shadow-sm"
          onclick={togglePush}
          disabled={pushLoading}>
          {#if pushLoading}
            <span class="loading loading-spinner loading-xs"></span>
          {:else if pushSubscribed}
            Disable Push Notifications
          {:else}
            Enable Push Notifications
          {/if}
        </button>
      </div>
    {/if}
  </div>
</div>
