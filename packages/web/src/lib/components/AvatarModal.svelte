<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} [children]
     */

    /** @type {Props} */
    let { children, showModal = $bindable() } = $props();

    let dialog = $state(); // HTMLDialogElement

    $effect(() => {
        if (showModal) dialog.showModal();
    });
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
    class="modal"
    bind:this={dialog}
    onclose={() => (showModal = false)}
    onclick={(e) => {
        if (e.target === dialog) dialog.close();
    }}
>
    <div class="modal-box">
        <div class="modal-title">
            <h3>Change profile picture</h3>
            <button
                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onclick={() => dialog.close()}>✕</button
            >
        </div>
        {@render children?.()}
        <!-- <button class="btn" onclick={() => dialog.close()}>Close</button> -->
    </div>
</dialog>
