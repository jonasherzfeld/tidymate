<script lang="ts">
  import { BellIcon } from "$lib/utils/icons";
  import { enhance } from "$app/forms";
  import {
    DeleteIcon,
    ReminderIcon,
    TodoIcon,
    ChoresIcon,
    GeneralIcon
  } from "$lib/utils/icons";
  import { goto } from "$app/navigation";

  let {
    notifications = $bindable([])
  }: {
    notifications: Notification[];
  } = $props();

  let serverErrors: string = $state("");
  let isLoading: boolean = $state(false);
  let numNonViewedNotifications: number = $derived(
    notifications.filter((n) => !n.is_viewed).length
  );
  let sortedNotifications = $derived(
    [...notifications].sort(
      (a, b) =>
        new Date(b.created_on).getTime() - new Date(a.created_on).getTime()
    )
  );

  function markAsViewed(notificationId: string) {
    notifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, is_viewed: true } : n
    );
  }

  function handleViewNotification() {
    return async ({ result, update }) => {
      console.log("Handling view notification:", result);
      if (result.type === "success" && result.data?.href) {
        console.log("Navigating to:", result.data.href);
        await goto(result.data.href);
      } else {
        console.log("No href found in result data.");
        await update();
      }
    };
  }
</script>

<div class="dropdown dropdown-bottom dropdown-end indicator">
  <div
    tabindex="0"
    role="button"
    class="btn btn-ghost btn-square btn-sm rounded-field indicator">
    {#if numNonViewedNotifications > 0}
      <span class="indicator-item badge badge-secondary badge-xs"
        >{numNonViewedNotifications}</span>
    {/if}
    <BellIcon class="h-4 w-4" />
  </div>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <ul
    tabindex="0"
    class="list dropdown-content rounded-box border-neutral bg-base-300 z-[1] mt-2 w-64 min-h-24 border-[1px] p-1 shadow-md">
    <div class="flex items-center justify-between">
      <li class="p-4 pb-2 text-xs tracking-wide opacity-60">
        Your Notifications
      </li>
      <form action="/?/delete_all_notifications" method="POST" use:enhance>
        <button
          class="btn btn-ghost btn-link p-4 pb-2 text-xs font-normal tracking-wide opacity-60"
          type="submit"
          aria-label="Mark all as viewed">
          Clear All
        </button>
      </form>
    </div>

    <div class="flex grow flex-col items-center justify-center">
      {#if serverErrors && serverErrors.length > 0}
        <h1 class="step-subtitle text-error mt-2">
          {serverErrors}
        </h1>
      {/if}
      {#if serverErrors}
        <h1 class="step-subtitle text-error mt-2">
          {serverErrors}
        </h1>
      {/if}
      {#if isLoading}
        <div class="flex w-full flex-col gap-4">
          <div class="skeleton h-32 w-full"></div>
          <div class="skeleton h-4 w-28"></div>
        </div>
      {/if}
      {#if notifications.length === 0}
        <li class="text-center">No notifications</li>
      {/if}
      {#each sortedNotifications as notification}
        <form method="POST" use:enhance={handleViewNotification}>
          <li class="list-row">
            <button
              class="flex w-full flex-col text-left"
              type="submit"
              aria-label="View Notification"
              formaction="/?/view_notification"
              onclick={(e) => {
                markAsViewed(notification.id);
              }}>
              <div class="flex flex-row items-center gap-3">
                {#if notification.name.includes("Reminder")}
                  <ReminderIcon class="h-6 w-6  opacity-50" />
                {:else if notification.name.includes("Todo")}
                  <TodoIcon class="h-6 w-6  opacity-50" />
                {:else if notification.name.includes("Chore")}
                  <ChoresIcon class="h-6 w-6  opacity-50" />
                {:else}
                  <GeneralIcon class="h-6 w-6 opacity-50" />
                {/if}
                <div class="flex flex-col">
                  <span class="w-80 font-bold">{notification.name}</span>
                  <span class="text-sm">
                    {notification.description}
                  </span>
                </div>
              </div>
            </button>

            <input type="hidden" name="id" value={notification.id} />
            <div class="indicator flex grow items-center">
              <button
                class="btn btn-ghost btn-xs btn-circle float-right"
                type="submit"
                aria-label="Delete Notification"
                formaction="/?/delete_notification">
                {#if !notification.is_viewed}
                  <span
                    class="indicator-item indicator-center badge badge-secondary badge-xs"
                    >New</span>
                {/if}
                <DeleteIcon class="h-4 w-4" />
              </button>
            </div>
          </li>
        </form>
      {/each}
    </div>
  </ul>
</div>
