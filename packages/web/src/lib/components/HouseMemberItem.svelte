<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import AvatarGraphic from "./AvatarGraphic.svelte";

  let {
    userId = "",
    isAdmin = false,
    src = "",
    firstName = "",
    lastName = "",
    joinedOn = "",
    changeEnabled = false
  }: {
    userId: string;
    isAdmin: boolean;
    src: string;
    firstName: string;
    lastName: string;
    joinedOn: string;
    changeEnabled: boolean;
  } = $props();

  let isCallingUser = $state(userId === $page.data.user.id);
  let isChangeEnabledForOthers = $derived(changeEnabled && !isCallingUser);
  let date = new Date(joinedOn);
  let changingAdminStatus = $state(false);

  const handleIsAdmin = async () => {
    changingAdminStatus = true;

    return async ({ result, update }) => {
      if (result.status !== 200) {
        await update();
      }
      changingAdminStatus = false;
    };
  };
</script>

<tr class={isCallingUser ? "bg-base-100" : ""}>
  <td>
    <div class="flex items-center gap-3">
      <div class="avatar">
        <AvatarGraphic
          height="h-10"
          width="w-10"
          {firstName}
          {lastName}
          thumbnail={src} />
      </div>
      <div>
        <div class="font-bold">{firstName} {lastName}</div>
      </div>
    </div>
  </td>
  <td>
    <div class="">{date.toLocaleDateString("en-GB")}</div>
  </td>
  <th>
    <form
      action="/profile/house?/set_admin"
      method="POST"
      use:enhance={handleIsAdmin}>
      <input type="hidden" name="user_id" value={userId} />
      <input
        type="checkbox"
        name="is_admin"
        class="toggle toggle-primary cursor-pointer"
        onchange={(e) => e.target.form.requestSubmit()}
        bind:checked={isAdmin}
        disabled={!isChangeEnabledForOthers || changingAdminStatus} />
    </form>
  </th>
</tr>
