<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { page } from '$app/stores';

    let creatingJoinId = $state(false);
    let joinIdValue = $state($page.data.house.join_id);
    let isActiveJoinId = $derived(joinIdValue);

    let { serverErrors = $bindable() }: { serverErrors: string } = $props();

    const { enhance: joinidEnhance } = superForm($page.data.joinIdForm, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creatingJoinId = true;
        },
        onUpdate: async ({ form, result }) => {
            const action = result.data;
            serverErrors = result.data.errors;
            if (form.valid) {
                joinIdValue = action.join_id;
            }
            creatingJoinId = false;
        }
    });
</script>

<div>
    <h2 class="mt-5 mb-2">Invite friends to your house</h2>
    <form action="?/toggle_join_id" method="POST" use:joinidEnhance>
        <div class="join">
            <input
                disabled={creatingJoinId}
                id="npm-install-copy-button"
                class="input input-bordered join-item bg-neutral text-base-300"
                value={joinIdValue}
            />
            <button
                class="btn join-item rounded-r-full btn-accent border-none"
                disabled={creatingJoinId || !$page.data.user.is_admin}
            >
                {#if !creatingJoinId}
                    {isActiveJoinId ? 'Delete' : 'Create'}
                {:else}
                    <span class="loading loading-spinner loading-lg"></span>
                {/if}
            </button>
        </div>
    </form>
</div>
