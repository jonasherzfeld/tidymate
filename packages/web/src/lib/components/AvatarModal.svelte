<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children: Snippet;
        showModal: Boolean;
    }

    let { children, showModal = $bindable() }: Props = $props();

    let dialog: HTMLDialogElement;

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
        {@render children?.()}
    </div>
</dialog>
