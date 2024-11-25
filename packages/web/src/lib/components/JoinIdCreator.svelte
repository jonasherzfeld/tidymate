<script lang="ts">
    import { superForm } from 'sveltekit-superforms';
    import { page } from '$app/stores';

    let creating_join_id = $state(false);
    let join_id_value = $state($page.data.house.join_id);
    let is_active_join_id = $derived(join_id_value);

    let { server_errors = $bindable() }: { server_errors: string } = $props();

    const { enhance: joinid_enhance } = superForm($page.data.joinid_form, {
        invalidateAll: false,
        resetForm: false,
        onSubmit: async () => {
            creating_join_id = true;
        },
        onUpdate: async ({ form, result }) => {
            const action = result.data;
            server_errors = result.data.errors;
            console.log(server_errors);
            if (form.valid) {
                join_id_value = action.join_id;
            }
            creating_join_id = false;
        }
    });
</script>

<div>
    <h2 class="mt-5 mb-2">Invite friends to your house</h2>
    <form action="?/toggle_join_id" method="POST" use:joinid_enhance>
        <div class="join">
            <input
                disabled={creating_join_id}
                id="npm-install-copy-button"
                class="input input-bordered join-item bg-neutral text-base-300"
                value={join_id_value}
            />
            <button
                class="btn join-item rounded-r-full btn-accent border-none"
                disabled={creating_join_id || !$page.data.user.is_admin}
            >
                {#if !creating_join_id}
                    {is_active_join_id ? 'Delete' : 'Create'}
                {:else}
                    <span class="loading loading-spinner loading-lg"></span>
                {/if}
            </button>
        </div>
    </form>
</div>
