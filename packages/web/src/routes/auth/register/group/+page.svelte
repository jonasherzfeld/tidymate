<script lang="ts">
    import { receive, send } from '$lib/utils/helpers';
    import { scale } from 'svelte/transition';
    import TextInput from '$lib/components/TextInput.svelte';
    import { superForm } from 'sveltekit-superforms';

    let { data } = $props();
    let is_loading = $state(false);
    let server_errors = $state([]);

    const { form, errors, enhance } = superForm(data.register_house_form, {
        onSubmit: async () => {
            is_loading = true;
        },
        onUpdate: async ({ form, result }) => {
            is_loading = false;
            server_errors = result.data.errors;
        }
    });
</script>

<div>
    <form
        class="flex flex-col space-y-2 mt-4 m-2"
        action="?/register_house"
        method="POST"
        use:enhance
    >
        {#if server_errors}
            {#each server_errors as error (error.id)}
                <h4
                    class="step-subtitle warning"
                    in:receive={{ key: error.id }}
                    out:send={{ key: error.id }}
                >
                    {error.error}
                </h4>
            {/each}
        {/if}

        <TextInput
            type="text"
            name="house_name"
            placeholder="Home name"
            bind:value={$form.house_name}
        />
        {#if $errors.house_name}<span class="invalid text-error">{$errors.house_name}</span>{/if}

        <div class="btn-container">
            <button class="btn btn-neutral btn-wide" disabled={is_loading}>
                {#if !is_loading}
                    Register
                {:else}
                    <span class="loading loading-spinner loading-lg"></span>
                {/if}
            </button>
        </div>
    </form>
</div>
