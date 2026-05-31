<script lang="ts">
  import { Dialog } from "bits-ui";
  import { fade, fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { X, Trash2 } from "lucide-svelte";
  import { invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import FilePond, { registerPlugin } from "svelte-filepond";
  import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
  import FilePondPluginImagePreview from "filepond-plugin-image-preview";
  import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
  import FilePondPluginImageCrop from "filepond-plugin-image-crop";
  import FilePondPluginImageResize from "filepond-plugin-image-resize";
  import FilePondPluginImageTransform from "filepond-plugin-image-transform";
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import { Button } from "$lib/components/ui";
  import { toast } from "$lib/components/ui/toast.svelte";

  registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  );

  let {
    showModal = $bindable(),
    actionBase = ""
  }: {
    showModal: boolean;
    /** Optional absolute route prefix for form actions, e.g. "/profile/user".
     *  Defaults to the current page (relative `?/`). */
    actionBase?: string;
  } = $props();

  let pond: any;
  let user = $derived($page.data.user);
  let busy = $state(false);

  function closeSoon() {
    invalidateAll().then(() => (showModal = false));
  }
</script>

<Dialog.Root bind:open={showModal}>
  <Dialog.Portal>
    <Dialog.Overlay forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div
            {...props}
            class="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]"
            transition:fade={{ duration: 160, easing: cubicOut }}>
          </div>
        {/if}
      {/snippet}
    </Dialog.Overlay>

    <Dialog.Content forceMount>
      {#snippet child({ props, open })}
        {#if open}
          <div
            class="pointer-events-none fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
            <div
              {...props}
              class="bg-base-100 border-neutral rounded-t-box sm:rounded-box pointer-events-auto flex w-full flex-col border shadow-[var(--shadow-lg)] sm:max-w-md"
              transition:fly={{ y: 24, duration: 220, easing: cubicOut }}>
              <!-- Header -->
              <div class="border-neutral flex items-start justify-between gap-3 border-b p-5">
                <div class="min-w-0">
                  <Dialog.Title class="text-lg font-semibold tracking-tight">
                    Profile photo
                  </Dialog.Title>
                  <Dialog.Description class="text-muted mt-1 text-xs">
                    PNG, JPG, or WebP — square crop, up to 5&nbsp;MB
                  </Dialog.Description>
                </div>
                <Dialog.Close
                  class="text-muted hover:bg-base-200 hover:text-base-content rounded-field -m-1 inline-flex h-8 w-8 items-center justify-center transition-colors"
                  aria-label="Close">
                  <X class="h-4 w-4" />
                </Dialog.Close>
              </div>

              <!-- Body -->
              <div class="flex flex-col gap-5 p-5">
                <div class="flex justify-center">
                  <div
                    class="bg-base-200 ring-base-100 outline-neutral rounded-full ring-4 outline">
                    <AvatarGraphic
                      thumbnail={user?.thumbnail}
                      height="h-24"
                      width="w-24"
                      textSize="text-3xl font-semibold" />
                  </div>
                </div>

                <FilePond
                  bind:this={pond}
                  name="filepond"
                  server={{
                    url: `${actionBase}?/`,
                    process: { url: "upload_image", method: "POST" },
                    revert: { url: "delete_image", method: "POST" }
                  }}
                  acceptedFileTypes={["image/png", "image/jpeg", "image/webp", "image/jpg"]}
                  allowMultiple={false}
                  allowRevert={false}
                  allowProcess={false}
                  allowRemove={true}
                  instantUpload={true}
                  maxFiles={1}
                  maxFileSize="5MB"
                  imageCropAspectRatio={"1:1"}
                  imageResizeTargetWidth={200}
                  imageResizeTargetHeight={200}
                  stylePanelLayout={"compact"}
                  labelIdle={`Drop image here or <span class="filepond--label-action">browse</span>`}
                  labelFileLoading="Loading"
                  labelFileProcessing="Uploading"
                  labelFileProcessingComplete="Done"
                  labelFileProcessingAborted="Cancelled"
                  labelFileProcessingError="Upload failed"
                  onprocessfilestart={() => {
                    busy = true;
                  }}
                  onprocessfile={(error: any) => {
                    busy = false;
                    if (error) {
                      toast.error(
                        "Upload failed",
                        error?.main ?? error?.message ?? "Try a different image."
                      );
                      return;
                    }
                    toast.success("Profile photo updated");
                    pond?.removeFiles?.();
                    closeSoon();
                  }}
                  onerror={(error: any) => {
                    busy = false;
                    toast.error("Couldn't load image", error?.main ?? error?.message ?? "");
                  }} />
              </div>

              <!-- Footer (only when there's a saved photo to remove) -->
              {#if user?.thumbnail}
                <div class="border-neutral flex items-center justify-between border-t p-4">
                  <form
                    method="POST"
                    use:enhance={() => {
                      busy = true;
                      return async ({ result }) => {
                        busy = false;
                        if (result.status === 200) {
                          user.thumbnail = "";
                          pond?.removeFiles?.();
                          toast.success("Profile photo removed");
                          closeSoon();
                        } else {
                          toast.error("Couldn't remove photo");
                        }
                      };
                    }}>
                    <button
                      type="submit"
                      formaction={`${actionBase}?/delete_image`}
                      disabled={busy}
                      class="text-error hover:text-error/80 inline-flex items-center gap-1.5 text-sm font-medium disabled:opacity-50">
                      <Trash2 class="h-4 w-4" />
                      Remove photo
                    </button>
                  </form>
                  <Button variant="ghost" size="sm" onclick={() => (showModal = false)}>
                    Done
                  </Button>
                </div>
              {/if}
            </div>
          </div>
        {/if}
      {/snippet}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
