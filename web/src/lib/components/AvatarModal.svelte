<script lang="ts">
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import FilePond, { registerPlugin, supported } from 'svelte-filepond';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageResize from 'filepond-plugin-image-resize';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
	import { invalidateAll } from '$app/navigation';

  // Register the plugins
  registerPlugin(FilePondPluginImageExifOrientation, 
                FilePondPluginImagePreview,
                FilePondPluginFileValidateType,
                FilePondPluginImageCrop,
                FilePondPluginImageResize,
                FilePondPluginImageTransform);

  // a reference to the component, used to call FilePond methods
  let pond;

  // the name to use for the internal file input
  let name = 'filepond';


  let {
    showModal = $bindable()
  }: {
    showModal: boolean;
  } = $props();

  let dialog: HTMLDialogElement;
  let user = $derived($page.data.user);
  let fileAdded = $state(false);
  
  $effect(() => {
    if (showModal) dialog.showModal();
  });

  const handleRemove = async ({}) => {
    return async ({ result, update }) => {
      if (result.status === 200) {
        user.thumbnail = "";
        pond.removeFiles();
        invalidateAll();
      } else {
        update();
      }
    };
  };

  const handleUpload = async ({}) => {
    return async ({ result, update }) => {
      if (result.status === 200) {
        user.thumbnail = result.data.thumbnail;
        pond.processFiles();
        invalidateAll();
      } else {
        update();
      }
    };
  };
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
      <div class=" items-center gap-2 w-full ">
            <FilePond bind:this={pond} {name}
              server={{
                      url: '?/',
                      process: {
                          url: 'upload_image',
                          method: 'POST',
                      },
                      revert: {
                          url: 'delete_image',
                          method: 'POST',
                      }}}
              acceptedFileTypes={["image/png", "image/jpeg", "image/webp", "image/jpg"]}
              allowMultiple={false}
              allowProcess={false}
              allowRevert={false}
              allowRemove={true}
              instantUpload={false}
              maxFiles={1}
              maxFileSize="5MB"
              onerror={(error) => {
                alert('Error processing image: ' + error.message);
                invalidateAll();
              }}
              onprocessfile={(error, file) => {
                if (error) {
                  alert('Error processing image: ' + error.message);
                } else {
                  invalidateAll();
                }
              }}
              onprocessfilerevert={(file) => {
                invalidateAll();
              }}
              onaddfile={(error, file) => {
                if (error) {
                  console.error('Error adding file:', error);
                } else {
                  fileAdded = true;
                }
              }}
              onremovefile={() => {
                fileAdded = false;
              }}
              labelIdle="Tap to add an image or drag and drop"
              imageCropAspectRatio={'1:1'}
              imageResizeTargetWidth={200}
              imageResizeTargetHeight={200}
              stylePanelLayout={'compact'}
              labelFileLoading="Loading"
              labelFileProcessing="Processing"
              labelFileProcessingComplete="Processing complete"
              labelFileProcessingAborted="Processing aborted"
              labelFileProcessingError="Processing error"
              />
        {#if !user.thumbnail}
        <form
          class="flex w-full"
          method="POST"
          use:enhance={handleUpload}
          enctype="multipart/form-data">
            <button
              class="btn btn-info btn-outline w-full"
              formaction="?/trigger_upload_image"
              type="submit"
              disabled={!fileAdded}>
              Upload image
            </button>
        </form>
        {:else}
        <form
          class="flex w-full"
          method="POST"
          use:enhance={handleRemove}
          enctype="multipart/form-data">
            <button
              class="btn btn-error w-full"
              formaction="?/delete_image"
              type="submit">
              Remove image
            </button>
        </form>
        {/if}
      </div>
    </div>
  </div>
</dialog>
