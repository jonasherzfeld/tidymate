<script lang="ts">
  import { enhance } from "$app/forms";
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import { page } from "$app/stores";

  let {
    showModal = $bindable()
  }: {
    showModal: boolean;
  } = $props();

  let dialog: HTMLDialogElement;
  let user = $derived($page.data.user);

  $effect(() => {
    if (showModal) dialog.showModal();
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
  class="modal"
  bind:this={dialog}
  onclose={() => (showModal = false)}
  onclick={(e) => {
    if (e.target === dialog) dialog.close();
  }}
  onkeydown={(e) => {
    if (e.key === "Escape") dialog.close();
  }}>
  <div class="modal-box">
    <div class="modal-title">
      <button
        class="btn btn-circle btn-ghost btn-sm absolute top-2 right-2"
        onclick={() => dialog.close()}>✕</button>
    </div>

    <div class="mr-4 ml-4 flex flex-col items-center gap-3 sm:flex-row">
      <div class="avatar m-5 ml-0">
        <AvatarGraphic
          thumbnail={user.thumbnail}
          height="h-24"
          width="w-24"
          textSize="text-5xl font-bold" />
      </div>
      <div >
        <form class="flex flex-col h-fit items-start gap-1" method="POST" use:enhance enctype="multipart/form-data">
          <label class="form-control w-full max-w-xs">
            <input
              type="file"
              name="file"
              class="file-input file-input-bordered w-full max-w-xs"
              accept=".jpg, .jpeg, .png, .webp" />
          </label>
          <div class="grid gap-1 w-full sm:grid-cols-2">
            <button
              class="btn"
              type="submit"
              formaction="?/upload_image"
              disabled={!!user.thumbnail}>Upload image</button>
            <button
              class="btn btn-error"
              formaction="?/delete_image"
              type="submit"
              disabled={!user.thumbnail}>
              Remove image
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</dialog>
