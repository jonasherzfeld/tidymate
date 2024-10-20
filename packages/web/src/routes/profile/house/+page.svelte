<script>
    import TextInput from '$lib/components/TextInput.svelte';
    import { applyAction, enhance } from '$app/forms';

    export let data;
    // export let action: undefined | { success: boolean, name: string};
    export let action;
    export let form;

    const handlerJoinId = async () => {
        return async ({ result }) => {
            action = { success: result.status === 200, join_id: result.data.join_id };
        };
    };
</script>

<div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">{data.house.name}</h1>
            <p class="py-6">This is the settings page for your house!</p>
            <TextInput name="name" bind:value={data.house.name} disabled={true}
                ><b>Name</b></TextInput
            >
            <TextInput name="first_name" bind:value={data.house.country} disabled={true}
                ><b>Country</b>
            </TextInput>
            <TextInput name="last_name" bind:value={data.house.city} disabled={true}
                ><b>City</b>
            </TextInput>
            <TextInput name="joined_on" bind:value={data.house.created_on} disabled={true}
                ><b>Created On</b>
            </TextInput>

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
                        {#if action?.success}
                            <input
                                id="npm-install-copy-button"
                                class="input input-bordered join-item"
                                placeholder="Join ID"
                                value={action?.join_id}
                            />
                        {:else}
                            <input
                                id="npm-install-copy-button"
                                class="input input-bordered join-item input-primary"
                                placeholder="Join ID"
                                value={data.house.join_id}
                            />
                        {/if}
                        <button class="btn join-item rounded-r-full bg-primary border-none">
                            {#if data.house.join_id || action?.join_id}
                                Delete
                            {:else}
                                Create
                            {/if}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
