<script lang="ts">
  import { BellIcon } from "$lib/utils/icons";
  // import { superForm } from "sveltekit-superforms";
  import { page } from "$app/state";
  import { enhance } from "$app/forms";

  let {
    notifications = $bindable([])
  }: {
    notifications: Notification[];
  } = $props();

  let serverErrors: string = $state("");
  let isLoading: boolean = $state(false);
  let numNotifications: number = $derived(notifications.length);

  // const { enhance: joinidEnhance } = superForm(page.data.joinIdForm, {
  //   invalidateAll: false,
  //   resetForm: false,
  //   onSubmit: async () => {
  //     creatingJoinId = true;
  //   },
  //   onUpdate: async ({ form, result }) => {
  //     const action = result.data;
  //     serverErrors = result.data.errors;
  //     if (form.valid) {
  //       joinIdValue = action.join_id;
  //     }
  //     creatingJoinId = false;
  //   }
  // });
</script>

<form action="/?/create_notification" method="POST" use:enhance>
  <input type="hidden" name="name" value="Test1" />
  <input type="hidden" name="description" value="Test2" />
  <input type="hidden" name="severity" value="1" />
  <button
    class="btn btn-ghost rounded-field"
    onclick={() => {
      notifications = [];
    }}>
    Send Notifications
  </button>
</form>

<div class="dropdown dropdown-end indicator">
  <div
    tabindex="0"
    role="button"
    class="btn btn-ghost btn-square btn-sm rounded-field indicator">
    <span class="indicator-item badge badge-secondary badge-xs"
      >{numNotifications}</span>
    <BellIcon class="h-4 w-4" />
  </div>
  <ul
    class="list dropdown-content bg-base-100 rounded-box z-1 mt-4 w-96 p-2 shadow-sm">
    <li class="p-4 pb-2 text-xs tracking-wide opacity-60">
      Your Notifications
    </li>

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
    {#each notifications as notification}
      <li class="list-row">
        <div class="indicator flex grow">
          {#if !notification.is_viewed}
            <span
              class="indicator-item indicator-end badge badge-secondary badge-xs"
              >New</span>
          {/if}
          <span class="w-80 font-bold">
            {notification.created_on}
            <form
              action="/?/delete_notification/{notification.id}"
              method="POST"
              use:enhance>
              <button
                class="btn btn-ghost btn-xs btn-circle float-right"
                type="submit"
                aria-label="Delete Notification">
                delete
              </button>
            </form>
          </span>
        </div>
      </li>
    {/each}
  </ul>
</div>
