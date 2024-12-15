<script lang="ts">
    import { enhance } from '$app/forms';
    import AvatarGraphic from '$lib/components/AvatarGraphic.svelte';
    import { page } from '$app/stores';

    let {
        showModal = $bindable()
    }: {
        showModal: Boolean;
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
        if (e.key === 'Escape') dialog.close();
    }}
>
    <div class="modal-box">
        <div class="modal-title">
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => dialog.close()}>✕</button
            >
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 ml-4 mr-4">
            <div class="avatar m-5 ml-0">
                <AvatarGraphic
                    thumbnail={user.thumbnail}
                    height="h-24"
                    width="w-24"
                    textSize="text-5xl font-bold"
                />
            </div>
            <div>
                <form method="POST" use:enhance enctype="multipart/form-data">
                    <label class="form-control w-full max-w-xs mb-4">
                        <input
                            type="file"
                            name="file"
                            class="file-input file-input-bordered w-full max-w-xs"
                            accept=".jpg, .jpeg, .png, .webp"
                        />
                    </label>
                    <div class="grid sm:grid-cols-2 gap-3">
                        <button
                            class="btn"
                            type="submit"
                            formaction="?/upload_image"
                            disabled={!!user.thumbnail}>Upload image</button
                        >
                        <button
                            class="btn btn-error"
                            formaction="?/delete_image"
                            type="submit"
                            disabled={!user.thumbnail}
                        >
                            Remove image
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</dialog>
