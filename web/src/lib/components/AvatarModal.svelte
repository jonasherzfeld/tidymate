<script lang="ts">
  import AvatarGraphic from "$lib/components/AvatarGraphic.svelte";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  let {
    showModal = $bindable()
  }: {
    showModal: boolean;
  } = $props();

  let dialog: HTMLDialogElement;
  let fileInput: HTMLInputElement;
  let user = $derived($page.data.user);
  let compressedFile: File | null = null; // Store compressed file separately
  let originalFile: File | null = null; // Store reference to original file for name

  $effect(() => {
    if (showModal) dialog.showModal();
  });

  // Handle form enhancement with compressed file
  const handleSubmit = async () => {
    return async ({ formData, action, update }) => {
      console.log('Form action:', action.pathname);
      console.log('Has compressed file:', !!compressedFile);
      
      // If we have a compressed file and this is an upload action, use it
      if (compressedFile && action.search.includes('upload_image')) {
        console.log('Using compressed file for upload', originalFile?.name);
        formData.set('avatar', compressedFile, originalFile?.name || "image.webp");
      }

      return await update();
    };
  };

  // Compress image before upload
  function compressImage(file: File, maxWidth: number = 800, maxHeight: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        console.log('Original image dimensions:', img.width, 'x', img.height);
        
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        console.log('Calculated dimensions:', width, 'x', height);
        
        // Set canvas size and draw image as-is (no rotation handling)
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          // Draw the image directly without any EXIF orientation handling
          // This will strip all EXIF data including rotation information
          ctx.drawImage(img, 0, 0, width, height);
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            // The resulting WebP will have no EXIF data and no rotation
            const compressedFile = new File([blob], file.name, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            console.log('Created compressed file without EXIF/rotation data');
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/webp', quality);
      };
      
      img.onerror = () => {
        console.error('Failed to load image for compression');
        resolve(file);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  // Handle file selection with compression
  async function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) return;

    // Validate file type - check for HEIC files that get auto-converted
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const forbiddenExtensions = ['.heic', '.heif'];
    
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    // Check if this is a temp file created from HEIC conversion
    const isTempHeicFile = file.name.toLowerCase().includes('tempimage') && file.type === 'image/jpeg';
    
    const isValidType = allowedTypes.includes(file.type) && allowedExtensions.includes(fileExtension) && !isTempHeicFile;
    if (!isValidType) {
      alert('Please select a valid image file (JPG, JPEG, PNG, or WebP).');
      target.value = '';
      return;
    }

    // Store reference to original file
    originalFile = file;

    // Check file size (5MB limit before compression)
    const maxSizeBeforeCompression = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeBeforeCompression) {
      alert('Please select an image smaller than 5MB (Current selection is ' + (file.size / 1024).toFixed(1) + 'KB)');
      target.value = '';
      return;
    }
    
    try {
      // Compress the image
      compressedFile = await compressImage(file);
      
      // Log file details for debugging
      console.log('Original file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      console.log('Compressed file:', {
        name: compressedFile.name,
        size: compressedFile.size,
        type: compressedFile.type
      });
      
      console.log(`Original size: ${(file.size / 1024).toFixed(1)}KB, Compressed size: ${(compressedFile.size / 1024).toFixed(1)}KB`);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error processing image. Please try a different file.');
      target.value = '';
      compressedFile = null;
    }
  }
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
      <div>
        <form
          class="flex h-fit flex-col items-start gap-1"
          method="POST"
          use:enhance={handleSubmit}
          enctype="multipart/form-data">
          <label class="form-control w-full max-w-xs">
            <input
              bind:this={fileInput}
              type="file"
              name="avatar"
              class="file-input file-input-bordered w-full max-w-xs"
              accept=".jpg, .jpeg, .png, .webp"
              onchange={handleFileChange} />
          </label>
          <div class="grid w-full gap-1 sm:grid-cols-2">
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
