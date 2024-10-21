<script>
    import { enhance } from '$app/forms';
    import { page } from '$app/stores';

    let action;
    let form;
    $: is_active_join_id = $page.data.house.join_id || action?.join_id;
    $: creating_join_id = false;

    const handlerJoinId = async () => {
        creating_join_id = true;

        return async ({ update }) => {
            let result = await update();
            creating_join_id = false;
            action = { success: result.status === 200, join_id: result.$page.data.join_id };
        };
    };
</script>

<div>
    <h2 class="mt-5 mb-2">Invite friends to your house</h2>
    <form action="?/toggle_join_id" method="POST" use:enhance={handlerJoinId}>
        {#if form?.errors}
            {#each form?.errors as error (error.id)}
                <h4
                    class="step-subtitle warning"
                    in:receive={{ key: error.id }}
                    out:send={{ key: error.id }}
                >
                    {error.error}
                </h4>
            {/each}
        {/if}

        <div class="join">
            <input
                disabled={creating_join_id}
                id="npm-install-copy-button"
                class="input input-bordered join-item"
                placeholder="Join ID"
                value={action?.success ? action?.join_id : $page.data.house.join_id}
            />
            <button class="btn join-item rounded-r-full bg-primary border-none">
                {is_active_join_id ? 'Delete' : 'Create'}
            </button>
        </div>
    </form>
</div>
